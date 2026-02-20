# Troubleshooting

This page covers the most common problems encountered when integrating with the Mobile ID service and how to diagnose them. While some examples reference the [Java Reference Client](/rest-api-guide/java-reference-client), the underlying causes and solutions apply to any client implementation.

## Diagnosing Connection Problems

Most initial integration issues are related to the TLS/mTLS connection setup. Understanding the difference between common connection errors helps narrow down the root cause quickly.

### Connection Timed Out

**Symptom:** The client waits for a long time and then fails with a "connect timed out" error.

**Cause:** The Mobile ID endpoint is not reachable from your network. This is typically a firewall or routing issue.

**Solutions:**
- Verify that your network allows outbound connections to `mobileid.swisscom.com` on the required port.
- Check if a proxy is required in your environment and configure it accordingly.
- Ensure the endpoint URL is correct (see [Integration Steps — Endpoint Address](/rest-api-guide/app-provider-client-integration#endpoint-address)).

### Connection Refused

**Symptom:** The client fails immediately with a "connection refused" error.

**Cause:** The Mobile ID endpoint is reachable at the network level, but your client's source IP address has not been whitelisted in the Swisscom firewall.

**Solutions:**
- Contact Swisscom to have your public IP address (or range) added to the allowlist.
- If you connect through a proxy or NAT gateway, make sure the **outbound** IP is what gets whitelisted.
- Verify the configured port and endpoint URL.

::: tip Distinguishing the Two
**Timed out** = no response at all (firewall drop or routing issue).
**Refused** = a response was received rejecting the connection (IP not whitelisted or wrong port).
:::

## TLS and Certificate Issues

### Wrong Client Certificate or AP ID (Fault 104)

**Symptom:** The Mobile ID service returns fault code `_104` with reason `UNAUTHORIZED_ACCESS` and detail `Wrong SSL credentials`.

```json
{
  "Fault": {
    "Code": {
      "SubCode": { "Value": "_104" },
      "Value": "Sender"
    },
    "Detail": "Wrong SSL credentials",
    "Reason": "UNAUTHORIZED_ACCESS"
  }
}
```

**Possible Causes:**
1. The client certificate used during the TLS handshake is not the one enrolled with Swisscom.
2. The certificate alias configured in the keystore is incorrect (the wrong certificate is being sent).
3. The AP ID does not match the one provisioned for your account.
4. The client is sending the full certificate chain instead of just the end-entity certificate.

**Solutions:**
- Verify the certificate alias in your keystore configuration matches the enrolled certificate.
- Double-check the AP ID value received from Swisscom.
- Ensure your client sends only the end-entity certificate, not the full chain (see [Mutual Authentication](/rest-api-guide/app-provider-client-integration#mutual-authentication)).

### Hostname Verification Failure

**Symptom:** TLS handshake fails with an error like `Certificate for <hostname> doesn't match any of the subject alternative names`.

**Cause:** The hostname in the endpoint URL does not match the server certificate's Subject Alternative Names (SANs). This typically means the endpoint URL is incorrect.

**Solutions:**
- Use the standard endpoint URL `https://mobileid.swisscom.com` (see [Integration Steps — Endpoint Address](/rest-api-guide/app-provider-client-integration#endpoint-address)).
- If connecting via Swisscom LAN-I, ensure hostname verification is configured for the LAN-I endpoint.

### Server Certificate Not Trusted

**Symptom:** TLS handshake fails with a "PKIX path building failed" or "unable to find valid certification path" error.

**Cause:** The Mobile ID server certificate's CA (SwissSign Gold CA — G2) is not in your client's trust store.

**Solutions:**
- Add the SwissSign Gold CA — G2 root certificate to your trust store (see [Root CA Certificates](/rest-api-guide/root-ca-certs)).
- If using a Java keystore, import it with:

```bash
keytool -importcert -alias swisssign-gold-g2 \
    -file SwissSign_Gold_CA_-_G2.crt \
    -keystore truststore.jks
```

### Keystore or Trust Store Not Found

**Symptom:** The client fails at startup with a `FileNotFoundException` for the keystore or trust store file.

**Solutions:**
- Verify the file path is correct (absolute or relative to the application's working directory).
- Ensure the file exists and is readable by the application process.

### Invalid Keystore or Key Password

**Symptom:** The client fails with `Keystore was tampered with, or password was incorrect` or `Cannot recover key`.

**Solutions:**
- Verify the keystore password and the private key password separately — they can differ.
- Use `keytool -list -keystore keystore.jks` to test the keystore password.

## Request-Level Errors

### Wrong Parameters (Fault 101)

The AP's request contains invalid parameter values. Common causes:
- The `Instant` timestamp deviates too much from the server's current time.
- Invalid MSISDN format.

### Missing Parameters (Fault 102)

A required field is missing from the request. Verify all mandatory fields are set (see [Mobile ID API](/rest-api-guide/mobile-id-api#mss-signature)).

### DTBD Too Long (Fault 103)

The `DataToBeDisplayed` exceeds the maximum allowed length:
- **239 characters** if all characters are in the GSM default alphabet.
- **119 characters** if any character falls outside the GSM set (e.g., `ç`).

See [Best Practices — Signature Request](/rest-api-guide/best-practices#signature-request) for DTBD guidelines.

### DTBD Prefix Missing (Fault 107)

The `DataToBeDisplayed` does not start with the mandatory AP-specific prefix (e.g., `"Bank ACME: "`). This prefix is assigned by Swisscom during provisioning.

### Unknown Client (Fault 105)

The MSISDN is not known to the Mobile ID service. The user may not have activated Mobile ID, or the MSISDN format is incorrect.

### Signature Already in Progress (Fault 406)

Another signature request is already active for the same MSISDN and authentication method. For the SIM method, wait for the existing transaction to complete. For the App method, the previous transaction is automatically cancelled.

See [Best Practices — Signature Concurrency Control](/rest-api-guide/best-practices#signature-concurrency-control) for details.

## Timeout and Polling Issues

### Response Timeout

**Symptom:** The client times out waiting for a synchronous signature response.

**Cause:** The HTTP response timeout is shorter than the signature transaction timeout. For synchronous requests, the server holds the connection open until the user responds or the transaction expires.

**Recommended timeouts:**

| Operation | Transaction Timeout | Client Connection Timeout |
|-----------|---------------------|---------------------------|
| Sync Signature (SIM) | 80 seconds | 90 seconds |
| Sync Signature (App) | 40 seconds | 50 seconds |
| Async Signature | 80 / 40 seconds | 10 seconds |
| Status Query | — | 10 seconds |
| Receipt | — | 90 seconds |
| Profile Query | — | 10 seconds |

### Async Polling Stops Prematurely

When polling for async signature status, continue polling while the status is `REQUEST_OK` (100) or `OUTSTANDING_TRANSACTION` (504). A final state is reached when you receive either:
- `SIGNATURE` (500) or `VALID_SIGNATURE` (502) — success
- Any fault code — failure

Use a polling interval of **5 seconds** as a reasonable default.

## Debugging Tips

### Enable TLS Debugging

To diagnose TLS handshake issues, enable JVM-level TLS logging:

```bash
# Full TLS debug output
java -Djavax.net.debug=all ...

# More targeted: handshake and certificate info only
java -Djavax.net.debug=ssl:handshake:verbose:keymanager:trustmanager \
     -Djava.security.debug=certpath ...
```

### Enable HTTP Request/Response Logging

For the [Java Reference Client](/rest-api-guide/java-reference-client#logging), set the appropriate loggers to `DEBUG`:

```xml
<logger name="ch.swisscom.mid.client.requestResponse" level="debug"/>
```

### Use Test MSISDNs

Mobile ID provides dedicated test MSISDNs that return specific fault codes, letting you test your error handling without a real mobile device.

Pattern: `+41000092<faultcode>` — for example, `+41000092401` returns fault `401 / USER_CANCEL`.

See [Status and Fault Codes — Testing](/rest-api-guide/status-fault-codes#testing-status-and-fault-codes) for the full list.

### Use the Java CLI for Quick Testing

The [Java Reference Client CLI](/rest-api-guide/java-reference-client#command-line-interface) is a convenient way to verify your setup independently of your application code:

```bash
# Test connectivity and credentials with a profile query
./bin/mid-client.sh -profile-query -msisdn 41791234567

# Test with verbose logging
./bin/mid-client.sh -profile-query -msisdn 41791234567 -vv

# Test with full TLS and HTTP traffic logging
./bin/mid-client.sh -profile-query -msisdn 41791234567 -vvv
```

## Common Error Quick Reference

| Symptom | Likely Cause | See |
|---------|-------------|-----|
| Connection timed out | Firewall / network issue | [Connection Timed Out](#connection-timed-out) |
| Connection refused | IP not whitelisted | [Connection Refused](#connection-refused) |
| Fault 104 — UNAUTHORIZED_ACCESS | Wrong cert or AP ID | [Wrong Client Certificate](#wrong-client-certificate-or-ap-id-fault-104) |
| Fault 101 — WRONG_PARAM | Bad timestamp or MSISDN | [Wrong Parameters](#wrong-parameters-fault-101) |
| Fault 107 — INAPPROPRIATE_DATA | Missing DTBD prefix | [DTBD Prefix Missing](#dtbd-prefix-missing-fault-107) |
| Fault 105 — UNKNOWN_CLIENT | User not activated | [Unknown Client](#unknown-client-fault-105) |
| Fault 208 — EXPIRED_TRANSACTION | User didn't respond | [Response Timeout](#response-timeout) |
| Fault 406 — PB_SIGNATURE_PROCESS | Concurrent signature | [Signature Already in Progress](#signature-already-in-progress-fault-406) |
| PKIX path building failed | Missing CA in trust store | [Server Certificate Not Trusted](#server-certificate-not-trusted) |
| Keystore tampered with | Wrong password | [Invalid Keystore Password](#invalid-keystore-or-key-password) |
