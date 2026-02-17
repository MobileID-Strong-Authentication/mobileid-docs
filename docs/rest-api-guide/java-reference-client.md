# Java Reference Client

The [`mobileid-client-java`](https://github.com/MobileID-Strong-Authentication/mobileid-client-java) repository provides the official Java reference implementation for the Mobile ID REST API (and SOAP API). It is designed for Java 8+ projects that need secure authentication and authorization using Swisscom Mobile ID.

The client library handles all the complexity of mTLS connections, request construction, response parsing, async polling, and signature validation — letting you focus on integrating Mobile ID into your application.

## Features

- **Synchronous and asynchronous** signature requests with polling
- **Signature receipt** delivery to mobile users
- **Profile queries** (account status, capabilities, certificate info)
- **Signature validation** (certificate path, signature integrity, DTBS matching)
- **Thread-safe** — create once, reuse across your application
- **Connection pooling** for efficient resource usage
- **HTTP proxy support** with optional authentication

## Getting the Library

### Maven

```xml
<dependency>
    <groupId>ch.mobileid.mid-java-client</groupId>
    <artifactId>mid-java-client-rest</artifactId>
    <version>1.5.7</version>
</dependency>
```

### Gradle

```groovy
dependencies {
    implementation 'ch.mobileid.mid-java-client:mid-java-client-rest:1.5.7'
}
```

::: tip
Check the [Releases page](https://github.com/MobileID-Strong-Authentication/mobileid-client-java/releases) for the latest version.
The library is also available on [Maven Central](https://search.maven.org/search?q=ch.mobileid).
:::

## Quick Start

### 1. Configure the Client

Create a `ClientConfiguration` with your AP credentials and TLS settings. This is done **once** per application lifetime.

```java
import ch.swisscom.mid.client.config.*;
import ch.swisscom.mid.client.impl.MIDClientImpl;
import ch.swisscom.mid.client.MIDClient;

ClientConfiguration config = new ClientConfiguration();
config.setProtocolToRest();
config.setApId("mid://id-received-from-swisscom");
config.setApPassword("pass-received-from-swisscom");

// Service endpoint
UrlsConfiguration urls = config.getUrls();
urls.setAllServiceUrlsTo(
    DefaultConfiguration.DEFAULT_INTERNET_BASE_URL 
    + DefaultConfiguration.REST_ENDPOINT_SUB_URL);

// mTLS client certificate
TlsConfiguration tls = config.getTls();
tls.setKeyStoreFile("keystore.jks");
tls.setKeyStorePassword("secret");
tls.setKeyStoreKeyPassword("secret");
tls.setKeyStoreCertificateAlias("mid-cert");
tls.setTrustStoreFile("truststore.jks");
tls.setTrustStorePassword("secret");

// HTTP timeouts
HttpConfiguration http = config.getHttp();
http.setConnectionTimeoutInMs(20_000);
http.setResponseTimeoutInMs(100_000);

// Create the client (thread-safe, reusable)
MIDClient client = new MIDClientImpl(config);
```

::: warning
Call `client.close()` when your application shuts down to properly release resources. Do **not** close it after each request.
:::

### 2. Request a Synchronous Signature

```java
import ch.swisscom.mid.client.model.*;

SignatureRequest request = new SignatureRequest();
request.setUserLanguage(UserLanguage.ENGLISH);
request.getDataToBeSigned().setData("Bank ACME: Confirm login (REF-8F2K)");
request.getMobileUser().setMsisdn("41791234567");
request.setSignatureProfile(SignatureProfiles.DEFAULT_PROFILE);
request.addAdditionalService(new GeofencingAdditionalService());

SignatureResponse response = client.requestSyncSignature(request);
```

### 3. Request an Asynchronous Signature with Polling

For better control and user experience, use the async flow with status polling:

```java
SignatureRequest request = new SignatureRequest();
request.setUserLanguage(UserLanguage.ENGLISH);
request.getDataToBeSigned().setData("Bank ACME: Confirm login (REF-8F2K)");
request.getMobileUser().setMsisdn("41791234567");
request.setSignatureProfile(SignatureProfiles.DEFAULT_PROFILE);

SignatureResponse response = client.requestAsyncSignature(request);

// Poll until the signature completes or fails
while (response.getStatus().getStatusCode() == StatusCode.REQUEST_OK ||
       response.getStatus().getStatusCode() == StatusCode.OUTSTANDING_TRANSACTION) {
    Thread.sleep(5000);
    response = client.pollForSignatureStatus(response.getTracking());
}

if (response.getStatus().getStatusCode() == StatusCode.SIGNATURE) {
    // Signature successful — validate and proceed
}
```

### 4. Send a Receipt

After a successful signature, send a receipt message to the mobile user:

```java
ReceiptRequest receiptRequest = new ReceiptRequest();
receiptRequest.getMessageToBeDisplayed().setData("Login completed successfully");
receiptRequest.setStatusCode(StatusCode.REQUEST_OK);
receiptRequest.addReceiptRequestExtension();

ReceiptResponse receiptResponse = client.requestSyncReceipt(
    response.getTracking(), receiptRequest);
```

### 5. Query a User Profile

Check if a user is registered and what methods are available:

```java
ProfileRequest request = new ProfileRequest();
request.getMobileUser().setMsisdn("41791234567");
request.setExtensionParamsToAllValues();

ProfileResponse response = client.requestProfile(request);
```

## Signature Validation

After acquiring a mobile signature, you should validate it to ensure the signing certificate is valid, the certificate path is trusted, and the signed data matches what was requested.

```java
import ch.swisscom.mid.client.crypto.*;

// Configure the trust store for certificate path validation
SignatureValidationConfiguration svConfig = new SignatureValidationConfiguration();
svConfig.setTrustStoreFile("signature-validation-truststore.jks");
svConfig.setTrustStoreType("jks");
svConfig.setTrustStorePassword("secret");

// Validate the signature
SignatureValidator validator = new SignatureValidatorImpl(svConfig);
SignatureValidationResult result = validator.validateSignature(
    response.getBase64Signature(),
    request.getDataToBeSigned().getData(),
    null
);

if (result.isValidationSuccessful()) {
    String midSerialNumber = result.getMobileIdSerialNumber();
    // Store and compare the serial number for strong 2FA assurance
} else {
    // Inspect what failed
    System.out.println("Cert path valid: " + result.isSignerCertificatePathValid());
    System.out.println("Cert valid: " + result.isSignerCertificateValid());
    System.out.println("Signature valid: " + result.isSignatureValid());
    System.out.println("DTBS matching: " + result.isDtbsMatching());
}
```

See [Best Practices — Signature Response](/rest-api-guide/best-practices#signature-response) for the full validation checklist.

## Error Handling

The client uses structured exceptions to communicate failures:

```java
import ch.swisscom.mid.client.MIDFlowException;
import ch.swisscom.mid.client.config.ConfigurationException;

try {
    SignatureResponse response = client.requestSyncSignature(request);
    // handle success
} catch (MIDFlowException e) {
    // Communication or business-level failure
    Fault fault = e.getFault();
    StatusCode code = fault.getStatusCode();
    FailureReason reason = fault.getFailureReason();
    String detail = fault.getStatusDetail();

    switch (code) {
        case USER_CANCEL:
            // User cancelled on their phone
            break;
        case EXPIRED_TRANSACTION:
            // User didn't respond in time
            break;
        case PIN_NR_BLOCKED:
            // User's Mobile ID PIN is blocked
            break;
        case UNAUTHORIZED_ACCESS:
            // Check TLS certificate and AP ID configuration
            break;
        default:
            // See Status and Fault Codes for the full list
            break;
    }
} catch (ConfigurationException e) {
    // Invalid client configuration (keystore, truststore, etc.)
}
```

See [Status and Fault Codes](/rest-api-guide/status-fault-codes) for the complete reference.

## Per-Request AP Credentials

If a single client instance serves multiple Application Providers, you can override the AP ID and password per request:

```java
SignatureRequest request = new SignatureRequest();
request.setOverrideApId("custom-ap-id");
request.setOverrideApPassword("custom-ap-password");
// ... remaining request setup
```

These overridden credentials are automatically carried into the tracking object used for async polling.

## Logging

The client uses SLF4J with the following logger hierarchy:

| Logger | Purpose |
|--------|---------|
| `ch.swisscom.mid.client` | General client activity |
| `ch.swisscom.mid.client.config` | Configuration-related activity |
| `ch.swisscom.mid.client.protocol` | Protocol-level communication |
| `ch.swisscom.mid.client.requestResponse` | Request/response messages (large data stripped) |
| `ch.swisscom.mid.client.fullRequestResponse` | Full request/response messages (including Base64 data) |

::: tip
Set `ch.swisscom.mid.client.requestResponse` to `DEBUG` for development and troubleshooting. Avoid enabling `fullRequestResponse` in production as it logs all certificate and signature data.
:::

## Command-Line Interface

The client also ships as a CLI tool for quick testing. Download the full package from the [Releases page](https://github.com/MobileID-Strong-Authentication/mobileid-client-java/releases).

```bash
# Generate sample configuration files
./bin/mid-client.sh -init

# Query a user profile
./bin/mid-client.sh -profile-query -msisdn 41791234567

# Request a signature (async with receipt)
./bin/mid-client.sh -sign -msisdn=41791234567 -lang=en \
    -dtbs "Bank ACME: Confirm login" -receipt

# Use verbose logging for debugging
./bin/mid-client.sh -sign -msisdn=41791234567 -lang=en \
    -dtbs "Bank ACME: Confirm login" -vv
```

## Further Resources

- [GitHub Repository](https://github.com/MobileID-Strong-Authentication/mobileid-client-java) — Source code, full documentation, and releases
- [Configuration Guide](https://github.com/MobileID-Strong-Authentication/mobileid-client-java/blob/main/docs/configure-the-client.md) — Detailed configuration reference
- [Proxy Configuration](https://github.com/MobileID-Strong-Authentication/mobileid-client-java/blob/main/docs/configure-proxy-connection.md) — HTTP proxy setup
- [Troubleshooting](/rest-api-guide/troubleshooting) — Common problems and solutions
