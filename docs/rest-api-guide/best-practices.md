# Best Practices

The Swisscom Mobile ID Strong Authentication GitHub repository provides various examples of Mobile ID client implementations.

The repository [`mobileid-client-java`](https://github.com/SwisscomTrustServices/mobileid-client-java) serves as the *main* Java-based reference implementation for building Mobile ID REST and SOAP API clients.

This library is ideal for Java 8+ projects that require secure authentication and authorization using a mobile phone.
It can be added as a dependency to your project and used in any scenario requiring access to the Swisscom Mobile ID service.

## MSS Signature

### Signature Request

When constructing an MSS Signature request, the following best-practice guidelines should be followed:

1. **Define a unique `AP_TransID` (Transaction ID)**
   Each signature request must have a unique transaction identifier.

2. **Set the current time for `Instant` (with time zone)**
   The `Instant` parameter must include time zone information and must not deviate excessively from the Mobile ID Service's current time; otherwise, a fault response with sub-code 101 will be returned.
   - **Example:** `2020-01-01T12:00:00.000+01:00`
   - Must conform to the [W3C `xs:dateTime`](https://www.w3.org/TR/xmlschema-2/#dateTime) format.

3. **Ensure uniqueness across the triplet `(AP_ID, AP_TransID, Instant)`**
   The combination of these three fields must be unique for every transaction.
   Duplicate triplets are rejected.

4. **Specify `MSISDN` in international format**
   The user's phone number must follow international (E.164) notation without spaces.
   A leading “+” is allowed but optional.
   - **Example:** `+41791234567`

5. **Set a valid `UserLang` value**
   The value must be one of the supported languages — EN, DE, FR, or IT — and must match the language used in the DataToBeDisplayed (`DTBD`) message.

6. **Define the `DataToBeDisplayed` (DTBD) message**
   The text shown on the user’s mobile device must comply with the following guidelines:
   - Encoded in UTF-8 [<sup id="a17">17</sup>](#17).
   - Should include a unique transaction reference (e.g., timestamp, customer ID, contract ID).
   - **Length limits:**
     - Maximum 239 characters if all characters are in the standard GSM DA character set.
     - If any character falls outside this set (e.g., the lowercase cedilla "ç"), the maximum length reduces to 119 characters.
   - Keep the message as short and user-friendly as possible.

   **Example DTBD:**
   > `Bank ACME: Proceed with the login? (TXN-3D5K)`

---

**Footnotes**

17. <span id="17"></span> Type of the AP_TransID is xsd:NCName, refer to http://www.datypic.com/sc/xsd/t-xsd_NCName.html [↩](#a17)

18. <span id="17"></span> http://www.w3.org/TR/xmlschema-2/#dateTime [↩](#a17)

19. <span id="17"></span> http://en.wikipedia.org/wiki/UTF-8 [↩](#a17)

20. <span id="17"></span> In mobile telephony GSM 03.38 is the standard character set used in short message service. [↩](#a17)

---

### Signature Response

After receiving the MSS Signature Response, the client (Application Provider – AP) must perform proper response validation to ensure authenticity, integrity, and consistency with the original request.

The key validation aspects are as follows:

1. **Match Request and Response Identifiers**
   - Verify that the `AP_TransID` and `MSISDN` values in the response are identical to those sent in the original request.
   - Any mismatch should be treated as an invalid response and rejected.

2. **Validate the Mobile User’s X.509 Certificate**
   - Ensure the user certificate chains up to a trusted root CA contained in your local TrustStore.
   - The client should only trust certificates that link to a trust anchor matching the expected Swisscom Mobile ID CA.
   - Your TrustStore should only contain the relevant root CA certificate (see **[Root CA Certificates](/rest-api-guide/root-ca-certs.md)**).

3. **Verify the Digital Signature**
   - Confirm that the received digital signature is cryptographically valid.
   - The signed content must correspond exactly to the `DataToBeDisplayed (DTBD)` text from the earlier signature request.
   - The client must be capable of validating both RSA and ECDSA signatures.

4. **(Optional) Validate the Mobile ID Serial Number**
   - For the highest level of assurance and a fully strong two-factor authentication process, validate the Mobile ID serial number as described in **Section Mobile ID Serial Number Validation**.

5. **Implement Proper Fault and Status Handling**
   - Handle all status and fault codes using structured exception handling logic to ensure stable, predictable behavior of the client application.

---

**Important Note:**
Certificate revocation checks are not recommended.
Mobile ID user certificates are never revoked individually — the Mobile ID service backend manages account validity and state directly.


### Signature Concurrency Control

This section describes the behavior of the Mobile ID Service when an Application Provider (AP) submits a new MSS Signature request while another signature transaction is already in progress for the same MSISDN and the same authentication method.

Concurrency handling depends on whether the request targets the SIM method or the Mobile ID App method.

---

##### SIM Method Concurrency
If both signature requests target the SIM-based authentication method, and the first signature transaction is still in progress, the second request is rejected immediately.

- **Fault Code:** `406 / PB_SIGNATURE_PROCESS`
- **Description:** The subscriber already has an active signature operation in process.
- See **Section 6** for detailed fault code definitions.

---

##### App Method Concurrency
If both requests target the Mobile ID App-based authentication method, the behavior is different:

- The existing first signature transaction is canceled automatically by the backend.
- The second signature request is then displayed on the mobile device via the Mobile ID App.

- **Fault Code (cancellation of first transaction):** `401 / USER_CANCEL`
- See **Section 6** for further information.

## Mobile ID Serial Number Validation

With an MSS Signature response, you will get signature data and the mobile user's X.509 certificate, which contains the public key required to validate the signature data.

That X.509 certificate's Subject Name (Distinguished Name) contains a unique Mobile ID serial number.

Example subject name with the serial number:

```bash

cn=midcheptod58qe59:pn,serialnumber=midcheptod58qe59,pseudonym=midcheptod58qe59
```


For highest level of assurance and a truly strong two-factor-authentication process, an AP should store this value at the first signature and then verify every subsequent signature response if that serial number value still matches.

If the value does not match anymore, it means that the user re-activated their account without a valid recovery option. In such case (serial number mismatch) the 2nd factor (knowledge/inherence) is not assured.

## Timeout Value

Use the reference values below to set an appropriate transaction timeout:

| MSS Operation | Transaction Timeout | Client Connection Timeout |
|---------------|---------------------|---------------------------|
| Synchronous MSS Signature | 80 seconds for Mobile ID SIM<br>40 seconds for Mobile ID App | 90 seconds<br>50 seconds |
| Asynchronous MSS Signature | 80 seconds for Mobile ID SIM<br>40 seconds for Mobile ID App | 10 seconds |
| MSS Status Query | - | 10 seconds |
| MSS Receipt | - | 90 seconds |
| MSS Profile Query | - | 10 seconds |

## Mobile ID FAQ

Please visit [https://mobileid.ch/en/faq](https://mobileid.ch/en/faq) for a list of frequently asked questions about Mobile ID

## Mobile ID Service Health Check

The recommended way to check the service health status is to send a synchronous MSS Signature request with the MSISDN value set to +41000000000 and DTBD set to Heartbeat.

The Mobile ID service health check is successful if a fault code 101/WRONG_PARAM with Detail value Illegal msisdn is returned, as shown in the example:

### SOAP/XML

```xml
..
      <soapenv:Fault>
         <soapenv:Code>
            <soapenv:Value>soapenv:Sender</soapenv:Value>
            <soapenv:Subcode xmlns:mss="http://uri.etsi.org/TS102204/v1.1.2#"
                             xmlns:fi="http://mss.ficom.fi/TS102204/v1.0.0#">
               <soapenv:Value>mss:_101</soapenv:Value>
            </soapenv:Subcode>
         </soapenv:Code>
         <soapenv:Reason>
            <soapenv:Text xml:lang="en">WRONG_PARAM</soapenv:Text>
         </soapenv:Reason>
         <soapenv:Detail>
            <ns1:detail xmlns:ns1="http://kiuru.methics.fi/mssp">Illegal msisdn</ns1:detail>
         </soapenv:Detail>
      </soapenv:Fault>
..
```


### REST/JSON

```json
..

{
    "Fault": {
        "Code": {
            "SubCode": {
                "Value": "_101",
                "ValueNs": "http://uri.etsi.org/TS102204/v1.1.2#"
            },
            "Value": "Sender",
            "ValueNs": "http://www.w3.org/2003/05/soap-envelope"
        },
        "Detail": "Illegal msisdn",
        "Reason": "WRONG_PARAM"
    }
}

..
```


## Mobile ID Client Examples

The GitHub Repository at [https://github.com/MobileID-Strong-Authentication](https://github.com/MobileID-Strong-Authentication) contains different examples for a Mobile ID client.

The repo **[`mobileid-client-java`](https://github.com/SwisscomTrustServices/mobileid-client-java)**  is the main Java-based reference implementation for the Mobile ID REST and SOAP API client.

The library provided by this repository is for all clients that are developing Java-based projects that need secure authentication and authorization services using the mobile phone.

The library works with Java 8+ projects and can be added as a project dependency and used in any scenario that needs to access the Swisscom Mobile ID service.
