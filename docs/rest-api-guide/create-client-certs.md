# Create Client Certificates

Below are examples how to create a self-signed certificate with OpenSSL and Java Keytool.

Remarks:
- Use any meaningful value for the distinguished name (CN/O/C values).
- Use SHA-256 as shown below.
- Validity can be set to 3 or 5 years. However, the validity is never checked by Mobile ID.
- The examples create a self-signed certificate (easy to make, no cost).
- The client certificate's Enhanced Key Usage must include Client Authentication (OID 1.3.6.1.5.5.7.3.2).
- Provide the resulting `mycert.crt` file to Swisscom and keep your private key / keystore files (`*.jks`, `*.p12`, `*.jks`) securely stored.

## OpenSSL

### Generate Key & Create CSR

```bash
$ openssl req -new -newkey rsa:4096 -nodes -rand /dev/urandom \
  -keyout mycert.key -out mycert.csr -sha256 \
  -subj '/CN=mobileid.company.ch/O=Company/C=CH'

```

### Self-Sign Certificate

```bash

$ openssl x509 -req -days 1825 -sha256 -in mycert.csr -signkey mycert.key -out my-cert.crt

```

and run:

```bash

$ openssl x509 -req -days 1825 -sha256 -extfile ext.cnf \
  -in mycert.csr -signkey mycert.key -out mycert.crt
```


### Convert To PKCS#12

Optionally, if you need a PKCS#12 file you can convert the Key and Certificate with this command:

```bash
$ openssl pkcs12 -export -in mycert.crt -inkey mycert.key -out mycert.p12
```


## Java KeyTool

### Generate Key & Export Certificate

```bash
$ keytool -genkey -alias <alias-name> -keyalg RSA -keysize 4096 -validity 1825 \
  -dname "CN=mobileid.company.ch,O=Company,C=CH" -keystore mycert.jks

$ keytool -export -alias <alias-name> -keystore mycert.jks -file mycert.crt
```
Tip: If your JDK supports it, add an Extended Key Usage for client auth during key generation (syntax depends on JDK version), e.g. -ext "ExtendedKeyUsage=clientAuth". Otherwise, you can generate a CSR with keytool and self-sign it with OpenSSL using the ext.cnf shown above.

