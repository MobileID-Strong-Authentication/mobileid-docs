# Mobile ID API

The **Mobile ID** service exposes a web API available via both **SOAP** and **RESTful (JSON)** interfaces.
Refer to **[Application Provider Client Intergration](/reference-guide/app-provider-client-integration)** for a detailed description of these interfaces, including links to the corresponding **WSDL** and **YAML** files on GitHub that describe the service definitions.

For your convenience, the RESTful API swagger documentation is also available here:
[API Specification](/api-reference/api)


## HTTP/1.1 Header

### HTTP Request

You can send **signature requests** using the **HTTP/1.1 POST** method over either the SOAP or RESTful interface.
The RESTful interface uses **JavaScript Object Notation (JSON)** as its media type.

**Required HTTP Header Fields:**

| Header Field | SOAP | RESTful / JSON |
|---------------|------|----------------|
| `Content-Type` | `text/xml;charset=UTF-8` | `application/json;charset=UTF-8` |
| `Accept` | – | `application/json` |


### HTTP Response

- If the request **succeeds**, the **Mobile ID** server responds with:
  `HTTP/1.1 200 OK`

- If an **error** occurs while processing the request (for example: `USER_CANCEL`, `EXPIRED_TRANSACTION`, `UNKNOWN_CLIENT`, etc. — see **[Status and Fault Codes](/reference-guide/status-fault-codes)**),
  the Mobile ID server responds with:
  `HTTP/1.1 500 Internal Server Error`

  The response will include a message containing a **Fault element** that describes the processing error.
  This behavior applies to **both the SOAP and RESTful** interfaces.

## MSS Signature

### Signature Profiles

For every authentication request, an AP can select the SIM or App authentication method by selecting a specific SignatureProfile-value in the MSS Signature request.

This will give all the required flexibility for an AP to handle different use cases. For example, an AP may use an MSS Profile Query ([MSS Profile Query](/reference-guide/mobile-id-api#mss-profile-query)) request to silently check the user’s authentication method capabilities before an MSS Signature request ([MSS Signature Request](/reference-guide/mobile-id-api#mss-signature-request)) is sent. In other scenarios, the AP may want to force a specific authentication method.

### Signature Profile Values

| Signature Profile Value | Description | AP Authorization¹ |
|--------------------------|-------------|--------------------|
| `http://mid.swisscom.ch/MID/v1/AuthProfile1` | **Deprecated.** Should no longer be used.<br>By default, this signature profile is mapped to `http://mid.swisscom.ch/STK-LoA4`. | Any AP is authorized. |
| `http://mid.swisscom.ch/Any-LoA4` | Mobile ID backend will automatically choose **SIM** or **App** authentication based on the user’s configured methods:<br>– The **SIM** method is always preferred.<br>– The **App** method is only selected if it is the *only* active method for that user.<br><br>As shown in **Section 3.2.1.1**, the response will indicate which authentication method was chosen. | By default, an AP is **not authorized** to use this profile.<br>Please contact **Swisscom** if you intend to use it. |
| `http://mid.swisscom.ch/STK-LoA4` | Forces **SIM authentication** method. | By default, an AP is **not authorized** to use this profile.<br>Please ask **Swisscom** if you intend to use it. |
| `http://mid.swisscom.ch/Device-LoA4` | Forces **App authentication** method. | By default, an AP is **not authorized** to use this profile.<br>Please ask **Swisscom** if you intend to use it. |
| `http://mid.swisscom.ch/Any-Geofencing-LoA4` | Mobile ID backend will choose **SIM** or **App** authentication based on both the user’s authentication and **geo‑location** capabilities:<br>– **SIM** method is preferred but only if the SIM has geo‑location capabilities (Swisscom SIM only).<br>– **App** method is selected if it is the only active method for that user, or if the user’s SIM lacks geo‑location capabilities. | By default, an AP is **not authorized** to use this profile.<br>The AP must have **Geofencing Additional Service** permission.<br>Please ask **Swisscom** if you intend to use it. |

---

¹ **Note:**
If an AP is not authorized to use a specific signature profile, the request is rejected with the fault response:

### User Scenario Examples (Signature Profile Handling)

The table below illustrates several example user scenarios and how the **MSSP** (Mobile ID backend) responds to a given **MSS Signature** request, depending on the user’s authentication capabilities and the selected **SignatureProfile** value.

Please note that these examples are **illustrative**, not exhaustive.


#### AP confiugration example

- The **AP** is authorized to use **all** signature profiles.
- The **AP** has a **signature profile mapping** configured so that an incoming signature profile
  `http://mid.swisscom.ch/MID/v1/AuthProfile1`
  is mapped internally to
  `http://mid.swisscom.ch/Any-LoA4`.
- These examples may **not apply** to every AP configuration;
  some APs may not be authorized to use all signature profiles,
  and others may not have a mapping configured.

#### MSSP Response Logic per Scenario

| MID User | SIM | App | Request’s Signature Profile | Response’s Signature Profile |
|-----------|-----|-----|-----------------------------|------------------------------|
| *(No active SIM / App)* | ✗ | ✗ | `http://mid.swisscom.ch/MID/v1/AuthProfile1` | n/a   *(Fault 105 / UNKNOWN_CLIENT)* |
| |  |  | `http://mid.swisscom.ch/Any-LoA4` | n/a   *(Fault 105 / UNKNOWN_CLIENT)* |
| |  |  | `http://mid.swisscom.ch/STK-LoA4` | n/a   *(Fault 105 / UNKNOWN_CLIENT)* |
| |  |  | `http://mid.swisscom.ch/Device-LoA4` | n/a   *(Fault 105 / UNKNOWN_CLIENT)* |
| **Active SIM only** | ✓ | ✗ | `http://mid.swisscom.ch/MID/v1/AuthProfile1` | `http://mid.swisscom.ch/STK-LoA4` |
| |  |  | `http://mid.swisscom.ch/Any-LoA4` | `http://mid.swisscom.ch/STK-LoA4` |
| |  |  | `http://mid.swisscom.ch/STK-LoA4` | `http://mid.swisscom.ch/STK-LoA4` |
| |  |  | `http://mid.swisscom.ch/Device-LoA4` | n/a   *(Fault 109 / UNSUPPORTED_PROFILE)* |
| **Active App only** | ✗ | ✓ | `http://mid.swisscom.ch/MID/v1/AuthProfile1` | `http://mid.swisscom.ch/Device-LoA4` |
| |  |  | `http://mid.swisscom.ch/Any-LoA4` | `http://mid.swisscom.ch/Device-LoA4` |
| |  |  | `http://mid.swisscom.ch/STK-LoA4` | n/a   *(Fault 109 / UNSUPPORTED_PROFILE)* |
| |  |  | `http://mid.swisscom.ch/Device-LoA4` | `http://mid.swisscom.ch/Device-LoA4` |
| **Active SIM and App** | ✓ | ✓ | `http://mid.swisscom.ch/MID/v1/AuthProfile1` | `http://mid.swisscom.ch/STK-LoA4` |
| |  |  | `http://mid.swisscom.ch/Any-LoA4` | `http://mid.swisscom.ch/STK-LoA4` |
| |  |  | `http://mid.swisscom.ch/STK-LoA4` | `http://mid.swisscom.ch/STK-LoA4` |
| |  |  | `http://mid.swisscom.ch/Device-LoA4` | `http://mid.swisscom.ch/Device-LoA4` |


**Note:**
An AP can use the **MSS Profile Query** request (see **[MSS Profile Query](/reference-guide/mobile-id-api#mss-profile-query)**) to determine a user’s capabilities.
For example, to check whether a particular user supports **SIM** and/or **App**‑based authentication before sending the signature request.


### Signature Messaging Mode

The ETSI 102 204  standard has defined the MSS Signature and Swisscom supports both synchronous and asynchronous (client-server) modes .
The MSS_Signature method is used to submit the mobile signature request message (MSS_SignatureReq). The result is provided within the signature response message (MSS_SignatureResp).
The Mobile ID customer (AP) can decide to call either synchronous or asynchronous signature requests. There are different aspects to consider:

- With the synchronous mode, the signature response is immediately processed by the AP after it has been made available by the Mobile ID Service, the overall authentication transaction will be faster. If an Application Provider intends to invoke many signature transactions of different users in parallel, it may require more memory because each thread is waiting for its comple-tion.

- With the asynchronous client-server mode, the Application Provider needs to implement a poll-ing mechanism (query the transaction status every x seconds until the signature is has been made available by the Mobile ID Service).



### Synchronous MSS Signature

The following steps describe a typical **synchronous (MessagingMode="synch")** Mobile ID authentication transaction:

![synchronous-mss-signature](/img/synchronous-mss-signature.png)


1. **End‑User Action**
   The end‑user uses an application that initiates an authentication request.

2. **Application Provider (AP) Request**
   The **AP** receives the authentication request and sends an
   **`MSS_SignatureReq`** message with parameter **`MessagingMode="synch"`** to the **MSSP** (Mobile ID backend).

3. **AP Credential Validation**
   The **Mobile ID backend (MSSP)** validates the **AP’s credentials** and verifies its authorization.

4. **Signature Request to User Device**
   The **Mobile ID backend** sends a signature request to the mobile device — either to the **SIM (STK applet)** or to the **Mobile ID App**, depending on the user’s configured method.

5. **User Authentication & Digital Signature**
   The **Mobile ID application** on the mobile device prompts the user to enter their **Mobile ID secret** (PIN, passcode, or biometric factor).
   - The user confirms with the correct secret.
   - The mobile application **digitally signs** the authentication payload.
   - The resulting **digital signature** is returned to the Mobile ID backend (**MSSP**).

6. **Signature Response Received**
   The **MSSP** receives the signature response and processes it.

7. **Response to Application Provider**
   The **Mobile ID backend** returns a **complete response** to the **AP**, containing:
   - The **digital signature**, and
   - The **certificate** that includes the end‑user’s public key.

8. **Access Decision by the AP**
   Based on the Mobile ID response, the **AP** may **grant** or **deny** access to the end‑user, depending on the authentication outcome.


#### Synchronous MSS Signature Request

**SOAP/XML**

```xml
<soapenv:Envelope soap:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"
 xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema"
 xmlns:soapenv="http://www.w3.org/2003/05/soap-envelope"
 xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
   <soapenv:Body>
      <MSS_Signature>
         <mss:MSS_SignatureReq MinorVersion="1" MajorVersion="1" MessagingMode="synch" TimeOut="80"
          xmlns:mss="http://uri.etsi.org/TS102204/v1.1.2#" xmlns:fi="http://mss.ficom.fi/TS102204/v1.0.0#">
            <mss:AP_Info AP_ID="yourAP_ID" AP_PWD="not-needed" AP_TransID="REF0101120000"
             Instant="2015-01-01T12:00:00.000+01:00"/>
            <mss:MSSP_Info>
               <mss:MSSP_ID>
                  <mss:URI>http://mid.swisscom.ch/</mss:URI>
               </mss:MSSP_ID>
            </mss:MSSP_Info>
            <mss:MobileUser>
               <mss:MSISDN>MOBILE_NUMBER</mss:MSISDN>
           </mss:MobileUser>
            <mss:DataToBeSigned MimeType="text/plain" Encoding="UTF-8">TEXT_TO_BE_SIGNED</mss:DataToBeSigned>
            <mss:SignatureProfile>
               <mss:mssURI>SIGNATURE_PROFILE</mss:mssURI>
            </mss:SignatureProfile>
             <mss:AdditionalServices>
                <mss:Service>
                  <mss:Description>
                     <mss:mssURI>http://mss.ficom.fi/TS102204/v1.0.0#userLang</mss:mssURI>
                  </mss:Description>
                  <fi:UserLang>LANGUAGE</fi:UserLang>
               </mss:Service>
             </mss:AdditionalServices>
         </mss:MSS_SignatureReq>
      </MSS_Signature>
   </soapenv:Body>
</soapenv:Envelope>
```

**REST/JSON**
```json

{
    "MSS_SignatureReq": {
        "AP_Info": {
            "AP_ID": "yourAP_ID",
            "AP_PWD": "not-needed",
            "AP_TransID": "REF0101120000",
            "Instant": "2015-01-01T12:00:00.000+01:00"
        },
        "AdditionalServices": [
            {
                "Description": "http://mss.ficom.fi/TS102204/v1.0.0#userLang",
                "UserLang": {
                    "Value": "LANGUAGE"
                }
            }
        ],
        "DataToBeSigned": {
            "Data": "TEXT_TO_BE_SIGNED",
            "Encoding": "UTF-8",
            "MimeType": "text/plain"
        },
        "MSSP_Info": {
            "MSSP_ID": {
                "URI": "http://mid.swisscom.ch/"
            }
        },
        "MajorVersion": "1",
        "MessagingMode": "synch",
        "MinorVersion": "2",
        "MobileUser": {
            "MSISDN": "MOBILE_NUMBER"
        },
        "SignatureProfile": "SIGNATURE_PROFILE",
        "TimeOut": "80"
    }
}

```
Note that `MinorVersion` value must be set to “2” in case of a REST/JSON request message.


#### Synchronous MSS Signature Response

**SOAP/XML**

```xml
<soapenv:Envelope xmlns:soapenv="http://www.w3.org/2003/05/soap-envelope"
 xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
   <soapenv:Body>
      <MSS_SignatureResponse>
         <mss:MSS_SignatureResp MajorVersion="1" MinorVersion="1" MSSP_TransID="h4dhx"
          xmlns:mss="http://uri.etsi.org/TS102204/v1.1.2#" xmlns:fi="http://mss.ficom.fi/TS102204/v1.0.0#">
            <mss:AP_Info AP_ID="yourAP_ID" AP_PWD="not-needed" AP_TransID="REF0101120000"
             Instant="2015-01-01T12:00:00.000+01:00"/>
            <mss:MSSP_Info Instant="2015-01-01T12:00:00.100+01:00">
               <mss:MSSP_ID>
                  <mss:URI>http://mid.swisscom.ch/</mss:URI>
               </mss:MSSP_ID>
            </mss:MSSP_Info>
            <mss:MobileUser>
               <mss:MSISDN>MOBILE_NUMBER</mss:MSISDN>
            </mss:MobileUser>
            <mss:MSS_Signature>
               <mss:Base64Signature>MIIIdwYJKoZIhvc...</mss:Base64Signature>
            </mss:MSS_Signature>
            <mss:SignatureProfile>
               <mss:mssURI>SIGNATURE_PROFILE</mss:mssURI>
            </mss:SignatureProfile>
            <mss:Status>
               <mss:StatusCode Value="500"/>
               <mss:StatusMessage>SIGNATURE</mss:StatusMessage>
            </mss:Status>
         </mss:MSS_SignatureResp>
      </MSS_SignatureResponse>
   </soapenv:Body>
</soapenv:Envelope>

```

**REST/JSON**

```json
{
    "MSS_SignatureResp": {
        "AP_Info": {
            "AP_ID": "yourAP_ID",
            "AP_TransID": "REF0101120000",
            "Instant": "2015-01-01T11:00:00.000Z"
        },
        "MSSP_Info": {
            "Instant": "2015-01-01T11:00:00.100Z",
            "MSSP_ID": {
                "URI": "http://mid.swisscom.ch/"
            }
        },
        "MSSP_TransID": "h44okl",
        "MSS_Signature": {
            "Base64Signature": "MIIIdwYJKoZIhvc..."
        },
        "MajorVersion": "1",
        "MinorVersion": "1",
        "MobileUser": {
            "MSISDN": "MOBILE_NUMBER"
        },
        "SignatureProfile": "SIGNATURE_PROFILE",
        "Status": {
            "StatusCode": {
                "Value": "500"
            },
            "StatusMessage": "SIGNATURE"
        }
    }
}

```

The `Base64Signature` content is a base 64 encoded CMS  (which is an extension of PKCS#7) signature object. It contains the DTBD message that has been signed by the SIM- or mobile application on the mobile device. In addition, it includes the mobile user certificate and all related intermediate certifi-cates. Therefore, the AP will always be able to fully validate the signature response.
Note that the response contains the signature profile value to indicate what authentication method was chosen, which is helpful in case the request signature profile was `http://mid.swisscom.ch/Any-LoA4`.


#### Fault Response
This is an example fault response in case of an illegal MSISDN value. Each fault response contains a (sub-)code value, reason text and detail text. Refer to section 6 for a list of status and error codes.

**SOAP/XML**

```xml
<soapenv:Envelope xmlns:soapenv="http://www.w3.org/2003/05/soap-envelope"
 xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
   <soapenv:Body>
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
   </soapenv:Body>
</soapenv:Envelope>

```

**REST/JSON**

```json
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

```


### Asynchronous MSS Signature

In the asynchronous mode, the AP initiates the signature request by calling MSS_Signature method and an acknowledgment response is sent back immediately by the MID to AP. The AP client then starts poll-ing using MSS_StatusQuery service to receive the response as depicted below.


1.	End-User uses an application that sends an authentication request.
2.	AP receives the request and sends an asynchronous MSS_SignatureReq request message to MSSP.
3.	MID backend validates the AP credentials.
4.	MID responds to AP with MSS_SignatureResp7 message (acknowledgment).
5.	MID sends a signature request to the application on the mobile device (either SIM or App).
6.	The mobile application (STK applet or Mobile App) prompts the End-User to enter the Mobile ID secret (PIN, passcode, biometry). End-User confirms with the correct secret and the application digitally signs the request and sends the signature back to the Mobile ID backend (MSSP).

::: info
Meanwhile the AP sends MSS_StatusReq requests to MID. The MID replies with MSS_StatusResp  (sta-tus code “504 OUTSTANDING_TRANSACTION”, which means that the AP will need to call again the status method).
:::

7.	Mobile ID backend (MSSP) receives the signature response.
8.	AP sends next MSS_StatusReq request message to MID.
9.	MID sends a complete response (signature + certificate containing the end-user's public key) to the AP as MSS_StatusResp Response.
10.	Depending on the response of MID, the AP may grant or deny access to the End-User.


#### Aynchronous MSS Signature Request
In pink the differences compared to the sync mode. This value isn’t the same for SOAP and REST.

**SOAP/XML**
```xml
<soapenv:Envelope soap:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/"
 xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema"
 xmlns:soapenv="http://www.w3.org/2003/05/soap-envelope"
 xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
   <soapenv:Body>
      <MSS_Signature>
         <mss:MSS_SignatureReq MinorVersion="1" MajorVersion="1" MessagingMode="asynchClientServer"
          TimeOut="80" xmlns:mss="http://uri.etsi.org/TS102204/v1.1.2#"
          xmlns:fi="http://mss.ficom.fi/TS102204/v1.0.0#">
            <mss:AP_Info AP_ID="yourAP_ID" AP_PWD="not-needed" AP_TransID="REF0101120000"
             Instant="2015-01-01T12:00:00.000+01:00"/>
            <mss:MSSP_Info>
               <mss:MSSP_ID>
                  <mss:URI>http://mid.swisscom.ch/</mss:URI>
               </mss:MSSP_ID>
            </mss:MSSP_Info>
            <mss:MobileUser>
               <mss:MSISDN>MOBILE_NUMBER</mss:MSISDN>
           </mss:MobileUser>
            <mss:DataToBeSigned MimeType="text/plain" Encoding="UTF-8">TEXT_TO_BE_SIGNED</mss:DataToBeSigned>
            <mss:SignatureProfile>
               <mss:mssURI>SIGNATURE_PROFILE</mss:mssURI>
            </mss:SignatureProfile>
             <mss:AdditionalServices>
                <mss:Service>
                  <mss:Description>
                     <mss:mssURI>http://mss.ficom.fi/TS102204/v1.0.0#userLang</mss:mssURI>
                  </mss:Description>
                  <fi:UserLang>LANGUAGE</fi:UserLang>
               </mss:Service>
             </mss:AdditionalServices>
         </mss:MSS_SignatureReq>
      </MSS_Signature>
   </soapenv:Body>
</soapenv:Envelope>


```

**REST/JSON**

```json
{
    "MSS_SignatureReq": {
        "AP_Info": {
            "AP_ID": "yourAP_ID",
            "AP_PWD": "not-needed",
            "AP_TransID": "REF0101120000",
            "Instant": "2015-01-01T12:00:00.000+01:00"
        },
        "AdditionalServices": [
            {
                "Description": "http://mss.ficom.fi/TS102204/v1.0.0#userLang",
                "UserLang": {
                    "Value": "LANGUAGE"
                }
            }
        ],
        "DataToBeSigned": {
            "Data": "TEXT_TO_BE_SIGNED",
            "Encoding": "UTF-8",
            "MimeType": "text/plain"
        },
        "MSSP_Info": {
            "MSSP_ID": {
                "URI": "http://mid.swisscom.ch/"
            }
        },
        "MajorVersion": "1",
        "MessagingMode": "asynch",
        "MinorVersion": "2",
        "MobileUser": {
            "MSISDN": "MOBILE_NUMBER"
        },
        "SignatureProfile": "SIGNATURE_PROFILE",
        "TimeOut": "80"
    }
}
```
Note that `MinorVersion` value must be set to “2” in case of a REST/JSON request message.

#### Aynchronous MSS Signature Response

**SOAP/XML**
```xml
<soapenv:Envelope xmlns:soapenv="http://www.w3.org/2003/05/soap-envelope"
 xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
   <soapenv:Body>
      <MSS_SignatureResponse>
         <mss:MSS_SignatureResp MajorVersion="1" MinorVersion="1" MSSP_TransID="h4iof"
          xmlns:mss="http://uri.etsi.org/TS102204/v1.1.2#" xmlns:fi="http://mss.ficom.fi/TS102204/v1.0.0#">
            <mss:AP_Info AP_ID="yourAP_ID" AP_PWD="not-needed" AP_TransID="REF0101120000"
             Instant="2015-01-01T12:00:00.000+01:00"/>
            <mss:MSSP_Info Instant="2015-01-01T12:00:00.100+01:00">
               <mss:MSSP_ID>
                  <mss:URI>http://mid.swisscom.ch/</mss:URI>
               </mss:MSSP_ID>
            </mss:MSSP_Info>
            <mss:MobileUser>
               <mss:MSISDN>MOBILE_NUMBER</mss:MSISDN>
            </mss:MobileUser>
            <mss:SignatureProfile>
               <mss:mssURI>SIGNATURE_PROFILE</mss:mssURI>
            </mss:SignatureProfile>
            <mss:Status>
               <mss:StatusCode Value="100"/>
               <mss:StatusMessage>REQUEST_OK</mss:StatusMessage>
            </mss:Status>
         </mss:MSS_SignatureResp>
      </MSS_SignatureResponse>
   </soapenv:Body>
</soapenv:Envelope>


```

**REST/JSON**

```json
{
    "MSS_SignatureResp": {
        "AP_Info": {
            "AP_ID": "yourAP_ID",
            "AP_TransID": "REF0101120000",
            "Instant": "2015-01-01T11:00:00.000Z"
        },
        "MSSP_Info": {
            "Instant": "2015-01-01T11:00:00.100Z",
            "MSSP_ID": {
                "URI": "http://mid.swisscom.ch/"
            }
        },
        "MSSP_TransID": "h4iof",
        "MajorVersion": "1",
        "MinorVersion": "1",
        "MobileUser": {
            "MSISDN": "MOBILE_NUMBER"
        },
        "SignatureProfile": "SIGNATURE_PROFILE",
        "Status": {
            "StatusCode": {
                "Value": "100"
            },
            "StatusMessage": "REQUEST_OK"
        }
    }
}

```
Note that the response contains the signature profile value to indicate what authentication method was chosen, which is helpful in case the request signature profile was `http://mid.swisscom.ch/Any-LoA4`.

### Additinal Services (AS)
The **MSS Signature** supports additional services that may be requested in the request message. Some of them are mandatory and some are optional.

#### User Language

The `UserLang` is a mandatory service for all Signature Requests.
One of the supported languages (EN, DE, FR, IT) must be defined. Please refer to section Synchronous MSS Signature Request or Aynchronous MSS Signature for an example. It should correspond to the language of the DataToBeDisplayed (DTBT) text message.
Example usage (code snippet from the MSS Signature Request):


**SOAP/XML**
```xml
<mss:AdditionalServices>
  <mss:Service>
    <mss:Description>
      <mss:mssURI>http://mss.ficom.fi/TS102204/v1.0.0#userLang</mss:mssURI>
    </mss:Description>
  </mss:Service>
</mss:AdditionalServices>

```

**REST/JSON**

```json
"AdditionalServices": [
  {
    "Description": "http://mss.ficom.fi/TS102204/v1.0.0#userLang"
  }
]

```

#### Geofencing

Geofencing is an optional service that enables Application Providers to define geographical boundaries. They can decide who can access what within that barrier, based on the user’s location data at the mo-ment of the Mobile ID authentication. This technology can help Application Providers to lock an applica-tion use to a specific geographic location and block any Mobile ID authentication requests outside of the fencing area.

With the geofencing service, any authorized  Application Provider (AP) may request the user’s location data in an MSS Signature request.

Geofencing can be requested with the MSS Signature's additional service URI set to `http://mid.swisscom.ch/as#geofencing`.

There are three different ways to enforce a Geofencing policy.
1.	The AP requests the Geofencing additional service by adding the URI http://mid.swisscom.ch/as#geofencing  to the MSS Signature request:

```json
"AdditionalServices": [
  {
    "Description": "http://mid.swisscom.ch/as#geofencing"
  }
]

```
A successful MSS Signature response will contain the geolocation data:

```json
"MSS_SignatureResp": {
  …
  "ServiceResponses": [ {
    "Description": "http://mid.swisscom.ch/as#geofencing",
    "Geofencing": {
      "Accuracy": "16",
      "Country": "CH",
      "DeviceConfidence="0.9",
      "LocationConfidence="0.85",
      "Timestamp": "2021-01-01T11:00:00.000+01:00"
    }
  } ]
  …
}
```
The AP parses the Service Response and implements the authorization accordingly.

2.	In addition to the 1st example, the AP adds a Geofencing Policy to the MSS Signature request:

```json
"AdditionalServices":[
  {
    "Description":"http://mid.swisscom.ch/as#geofencing",
    "GeoFencingRequest":{
      "countrywhitelist":[
        "CH",
        "DE",
        "AT"
      ],
      "countryblacklist":[
      ],
      "mindeviceconfidence":"0.7",
      "minlocationconfidence":"0.7",
      "maxtimestampminutes":"600",
      "maxaccuracymeters":"1000"
    }
  }
]
```
The policy may contain a country-based whitelist or blacklist and minimum threshold values for the confidence scores, timestamp and accuracy. The Mobile ID server will enforce the policy.

3.	A custom Geofencing Policy is set on the Mobile ID server. Here's an example, how a Geofencing Policy can be set on the Mobile ID server (of course the values can be adjusted according to the AP's need):

```json
{
   "enabled":"true",
   "verbose":"false",
   "countrywhitelist":[
      "CH",
      "DE",
      "AT"
   ],
   "countryblacklist":[
   ],
   "mindeviceconfidence":"0.7",
   "minlocationconfidence":"0.7",
   "maxtimestampminutes":"600",
   "maxaccuracymeters":"1000"
}

```
The policy may contain a country-based whitelist or blacklist and minimum threshold values for the confidence scores, timestamp and accuracy.
In this case, the AP can request the Geofencing service as shown in the 1st example. The Mobile ID server will enforce the custom Geofencing Policy that has been set for the AP.

##### Geofencing Service Data

| Key | Value Example | Format | Description |
|-----|---------------|--------|-------------|
| Country | CH | ISO 3166-1 alpha-2 | A two-letter country code of the current SIM or Device location. Current Country location of the SIM (country code of the currently registered mobile cell) or Device (country code based on the reverse geocoding of the device's GPS coordination). <br><br>**Recommendation**: Allow or block access based on the country code returned in this response. |
| Accuracy | 16 | An integer value. | Accuracy of the Device GPS, in meters. <br><br>In case of Mobile ID SIM authentications, the location is based on the mobile session information (country code of the currently registered mobile cell) and the accuracy is always 0 (the distance between the cell and the mobile device is unknown). <br><br>In case of Mobile ID App authentications, the location information is based on the device's GPS coordinates. The accuracy is a sum of the GPS accuracy and the distance between the GPS location point and the nearest geocoding data point (we do reverse geocoding of coordinates to country codes). <br><br>**Recommendation**: For Mobile ID App authentications, the accuracy depends on various factors. When the user is inside buildings or underground, the GPS is sometimes inaccurate. On latest iOS and Android, the user may also disable location precision, which will cause a high value for accuracy. |
| DeviceConfidence | 0.99 | Float between 0 and 1.00 | A high device confidence means that we have a high trust in the user device and OS version. The value 1.0 represents the highest possible trust. <br><br>Device confidence score is based on an internal calculation, which includes different checks such as root or jailbreak detection. <br><br>**Recommendation**: A score below 0.5 is an indication that the user's device may be rooted or jailbroken. |
| LocationConfidence | 0.85 | Float between 0 and 1.00 | A high location confidence means that we have a high trust in the user location data, which includes device confidence score in its calculation. The value 1.0 represents the highest possible trust. <br><br>Location confidence score is based on an internal calculation, which includes different checks such as mock service- and location spoofing detection, the age of the location data and the device confidence score. <br><br>For Mobile ID SIM authentication, the location confidence calculation incorporates the cell information age. <br><br>**Note**: The score will decrease every hour by 0.01 if location data is not up-to-date! Turning on and off the Device FlightMode feature will help to have up-to-date location data. <br><br>**Recommendation**: Typically, a location confidence of 0.7 or higher can be considered as a sufficient trust level. Please also refer to the table below. |
| Timestamp | 2021-01-01T11:00:00.000+01:00 | formatting of yyyy-MM-dd'T'HH:mm:ss.SSS'Z' | The timestamp of the location information. <br><br>**Recommendation**: Mobile Session (registered cell) information or GPS location coordination may not be up-to-date and may require action from the mobile user. Turning on and off the Device FlightMode feature will help to have up-to-date location data. |

**Recommendations** regarding Confidence Score checks: Usually it is sufficient if a client implements a minimum threshold check for the Location Confidence Score since the Location Confidence Score in-cludes the Device Confidence Score in its calculation. Here’s a rationale regarding the Location Confi-dence Score:


![confidence-score](/img/confidence-score.png)

- A score of `1.0` as minimum target threshold is recommended for extremely critical services only! It requires the user to have a Swisscom SIM and up-to-date SIM location data (not older than 1 hour). Turning on and off the Device FlightMode feature will help to have up-to-date location data.
- A score of `0.8` as minimum target threshold can be considered as a very high trust score and is a recommended target threshold for most critical services.
- A score of `0.7` as minimum target threshold is still a better confidence score than IP based location solutions and therefore a recommended target threshold for most standard services.

In case a user has a too low location confidence score, the following points should be checked by the user.

Timestamp value indicates that location data is older than 1 hour:
- ℹ️ Turn on and off the FlightMode, which usually helps to have up-to-date location data

Location- and Device Confidence Score are very low:
- ℹ️ User must not use a rooted or jailbroken device

Location Confidence Score too low:
- ℹ️ User must have Developer Mode disabled
- ℹ️ User must uninstall any 3rd party app that use Mock Location capabilities

Geofencing service limitations:
- Geofencing information is given without any guarantee and with the exclusion of any legal lia-bility.
- At the time of writing only MobileID App or Swisscom Mobile ID SIM cards support location data.
- For the MobileID App, the user must have the geofencing toggle enabled and location services permitted. Both Android and iOS App version 1.2.0 or higher support geofencing.



##### MSS Signature Request incl. Geofencing

```xml

      <MSS_Signature>
         <mss:MSS_SignatureReq MinorVersion="1" MajorVersion="1" MessagingMode="synch" TimeOut="80"
          xmlns:mss="http://uri.etsi.org/TS102204/v1.1.2#" xmlns:fi="http://mss.ficom.fi/TS102204/v1.0.0#">
            <mss:AP_Info AP_ID="yourAP_ID" AP_PWD="not-needed" AP_TransID="REF0101120000"
             Instant="2015-01-01T12:00:00.000+01:00"/>
            <mss:MSSP_Info>
               <mss:MSSP_ID>
                  <mss:URI>http://mid.swisscom.ch/</mss:URI>
               </mss:MSSP_ID>
            </mss:MSSP_Info>
            <mss:MobileUser>
               <mss:MSISDN>MOBILE_NUMBER</mss:MSISDN>
           </mss:MobileUser>
            <mss:DataToBeSigned MimeType="text/plain" Encoding="UTF-8">TEXT_TO_BE_SIGNED</mss:DataToBeSigned>
            <mss:SignatureProfile>
               <mss:mssURI>http://mid.swisscom.ch/MID/v1/AuthProfile1</mss:mssURI>
            </mss:SignatureProfile>
             <mss:AdditionalServices>
                <mss:Service>
                  <mss:Description>
                     <mss:mssURI>http://mss.ficom.fi/TS102204/v1.0.0#userLang</mss:mssURI>
                  </mss:Description>
                  <fi:UserLang>LANGUAGE</fi:UserLang>
               </mss:Service>
               <mss:Service>
                  <mss:Description>
                     <mss:mssURI>http://mid.swisscom.ch/as#geofencing</mss:mssURI>
                  </mss:Description>
               </mss:Service>
             </mss:AdditionalServices>
         </mss:MSS_SignatureReq>
      </MSS_Signature>


```

```json

{
    "MSS_SignatureReq": {
        "AP_Info": {
            "AP_ID": "yourAP_ID",
            "AP_PWD": "not-needed",
            "AP_TransID": "REF0101120000",
            "Instant": "2015-01-01T12:00:00.000+01:00"
        },
        "AdditionalServices": [
            {
                "Description": "http://mid.swisscom.ch/as#geofencing"
            },
            {
                "Description": "http://mss.ficom.fi/TS102204/v1.0.0#userLang",
                "UserLang": {
                    "Value": "LANGUAGE"
                }
            }
        ],
        "DataToBeSigned": {
            "Data": "TEXT_TO_BE_SIGNED",
            "Encoding": "UTF-8",
            "MimeType": "text/plain"
        },
        "MSSP_Info": {
            "MSSP_ID": {
                "URI": "http://mid.swisscom.ch/"
            }
        },
        "MajorVersion": "1",
        "MessagingMode": "synch",
        "MinorVersion": "1",
        "MobileUser": {
            "MSISDN": "MOBILE_NUMBER"
        },
        "SignatureProfile": "http://mid.swisscom.ch/MID/v1/AuthProfile1",
        "TimeOut": "80"
    }
}


```


##### MSS Signature Response incl. Geofencing Location Data

```xml

<soapenv:Envelope xmlns:soapenv="http://www.w3.org/2003/05/soap-envelope"
 xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
   <soapenv:Body>
      <MSS_SignatureResponse>
         <mss:MSS_SignatureResp MajorVersion="1" MinorVersion="1" MSSP_TransID="h4dhx"
          xmlns:mss="http://uri.etsi.org/TS102204/v1.1.2#" xmlns:fi="http://mss.ficom.fi/TS102204/v1.0.0#">
            <mss:AP_Info AP_ID="yourAP_ID" AP_PWD="not-needed" AP_TransID="REF0101120000"
             Instant="2021-01-01T11:00:00.000+01:00"/>
            <mss:MSSP_Info Instant="2021-01-01T11:00:00.000+01:00">
               <mss:MSSP_ID>
                  <mss:URI>http://mid.swisscom.ch/</mss:URI>
               </mss:MSSP_ID>
            </mss:MSSP_Info>
            <mss:MobileUser>
               <mss:MSISDN>MOBILE_NUMBER</mss:MSISDN>
            </mss:MobileUser>
            <mss:MSS_Signature>
               <mss:Base64Signature>MIIIdwYJKoZIhvc...</mss:Base64Signature>
            </mss:MSS_Signature>
            <mss:SignatureProfile>
               <mss:mssURI>SIGNATURE_PROFILE</mss:mssURI>
            </mss:SignatureProfile>
            <mss:Status>
               <mss:StatusCode Value="500"/>
               <mss:StatusMessage>SIGNATURE</mss:StatusMessage>
               <mss:StatusDetail>
                  <fi:ServiceResponses>
                     <fi:ServiceResponse>
                        <fi:Description>
                           <mss:mssURI>http://mid.swisscom.ch/as#geofencing</mss:mssURI>
                        </fi:Description>
                        <ns1:GeoFencing country="CH"
                                        accuracy="16"
                                        timestamp="2021-01-01T11:00:00.000+01:00"
                                        deviceconfidence="1.0"
                                        locationconfidence="1.0"
                                        xmlns:ns1="http://mid.swisscom.ch/TS102204/as/v1.0"/>
                     </fi:ServiceResponse>
                  </fi:ServiceResponses>
               </mss:StatusDetail>
            </mss:Status>
         </mss:MSS_SignatureResp>
      </MSS_SignatureResponse>
   </soapenv:Body>
</soapenv:Envelope>


```

```json
{
    "MSS_SignatureResp": {
        "AP_Info": {
            "AP_ID": "yourAP_ID",
            "AP_TransID": "REF0101120000",
            "Instant": "2021-01-01T11:00:00.000Z"
        },
        "MSSP_Info": {
            "Instant": "2021-01-01T11:00:00.000Z",
            "MSSP_ID": {
                "URI": "http://mid.swisscom.ch/"
            }
        },
        "MSSP_TransID": "h44okl",
        "MSS_Signature": {
            "Base64Signature": "MIIIdwYJKoZIhvc..."
        },
        "MajorVersion": "1",
        "MinorVersion": "1",
        "MobileUser": {
            "MSISDN": "MOBILE_NUMBER"
        },
        "ServiceResponses": [ {
            "Description": "http://mid.swisscom.ch/as#geofencing",
            "Geofencing": {
               "Accuracy": "16",
               "Country": "CH",
               "DeviceConfidence="1.0",
               "LocationConfidence="1.0",
               "Timestamp": "2021-01-01T11:00:00.000+01:00"
            }
        } ],
        "SignatureProfile": "SIGNATURE_PROFILE",
        "Status": {
            "StatusCode": {
                "Value": "500"
            },
            "StatusMessage": "SIGNATURE"
        }
    }
}


```


##### MSS Signature Response incl. Geofencing Fault Code

```xml

<soapenv:Envelope xmlns:soapenv="http://www.w3.org/2003/05/soap-envelope"
 xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
   <soapenv:Body>
      <MSS_SignatureResponse>
         <mss:MSS_SignatureResp MajorVersion="1" MinorVersion="1" MSSP_TransID="h4dhx"
          xmlns:mss="http://uri.etsi.org/TS102204/v1.1.2#" xmlns:fi="http://mss.ficom.fi/TS102204/v1.0.0#">
            <mss:AP_Info AP_ID="yourAP_ID" AP_PWD="not-needed" AP_TransID="REF0101120000"
             Instant="2021-01-01T11:00:00.000+01:00"/>
            <mss:MSSP_Info Instant="2021-01-01T11:00:00.000+01:00">
               <mss:MSSP_ID>
                  <mss:URI>http://mid.swisscom.ch/</mss:URI>
               </mss:MSSP_ID>
            </mss:MSSP_Info>
            <mss:MobileUser>
               <mss:MSISDN>MOBILE_NUMBER</mss:MSISDN>
            </mss:MobileUser>
            <mss:MSS_Signature>
               <mss:Base64Signature>MIIIdwYJKoZIhvc...</mss:Base64Signature>
            </mss:MSS_Signature>
            <mss:SignatureProfile>
               <mss:mssURI>SIGNATURE_PROFILE</mss:mssURI>
            </mss:SignatureProfile>
            <mss:Status>
               <mss:StatusCode Value="500"/>
               <mss:StatusMessage>SIGNATURE</mss:StatusMessage>
               <mss:StatusDetail>
                  <fi:ServiceResponses>
                     <fi:ServiceResponse>
                        <fi:Description>
                           <mss:mssURI>http://mid.swisscom.ch/as#geofencing</mss:mssURI>
                        </fi:Description>
                        <ns1:GeoFencing errorcode="100"
                                        errormessage="Geofencing feature disabled"
                                        xmlns:ns1="http://mid.swisscom.ch/TS102204/as/v1.0"/>
                     </fi:ServiceResponse>
                  </fi:ServiceResponses>
               </mss:StatusDetail>
            </mss:Status>
         </mss:MSS_SignatureResp>
      </MSS_SignatureResponse>
   </soapenv:Body>
</soapenv:Envelope>


```

```json
{
    "MSS_SignatureResp": {
        "AP_Info": {
            "AP_ID": "yourAP_ID",
            "AP_TransID": "REF0101120000",
            "Instant": "2021-01-01T11:00:00.000Z"
        },
        "MSSP_Info": {
            "Instant": "2021-01-01T11:00:00.000Z",
            "MSSP_ID": {
                "URI": "http://mid.swisscom.ch/"
            }
        },
        "MSSP_TransID": "h44okl",
        "MSS_Signature": {
            "Base64Signature": "MIIIdwYJKoZIhvc..."
        },
        "MajorVersion": "1",
        "MinorVersion": "1",
        "MobileUser": {
            "MSISDN": "MOBILE_NUMBER"
        },
        "ServiceResponses": [ {
            "Description": "http://mid.swisscom.ch/as#geofencing",
            "Geofencing": {
               "ErrorCode": "100",
               "ErrorMessage": "Geofencing feature disabled"
            }
        } ],
        "SignatureProfile": "SIGNATURE_PROFILE",
        "Status": {
            "StatusCode": {
                "Value": "500"
            },
            "StatusMessage": "SIGNATURE"
        }
    }
}

```


##### Geofencing Error Codes


ℹ️ The table below contains all error codes that the geofencing additional service may return. Note that the exact error message may vary for a given error code.

| Code | Message |
|------|---------|
| 100  | The geofencing feature option in the "More" menu is currently disabled. |
| 101  | The app failed to retrieve the user's location possibly due to insufficient resources (network, GPS, etc.) or a timeout. |
| 102  | The user has not yet responded to the dialog that grants the app permission to access location services. |
| 103  | The user has explicitly denied the app permission to access location services. |
| 104  | This is on iOS only. The user cannot enable location services possibly due to active restrictions such as parental controls, corporate policy etc. being in place. |
| 105  | The user has turned off location services device-wide (for all apps) from the system settings. |
| 106  | Location services are unavailable because the device is in Airplane mode. |
| 120  | Location failed to the app for an unspecified reason. |
| 121  | MSSP internal error (misconfiguration etc.). |
| 122  | AP is not authorized to use Geofencing additional service. |
| 123  | User has a non-Swisscom SIM card. |
| 200  | No location returned from mobile app. |
| 201  | App outdated, geofencing not supported. |



#### App to App -  Mobile Only Authentication

We strongly recommend making use of this service if you intend to invoke the Mobile ID authentication from your own App. The Mobile ID App2App service allows an Application Provider to automatically switch from their App to the Mobile ID App (and the Mobile ID App to automatically switch back to the originating App) as shown in step 10 and 18 in the sequence below. This will greatly improve the usa-bility for the App user.

![mobile-only-auth](/img/mobile-only-auth.png)

1.	While being in the Application Provider App, the user performs an action that requires authentica-tion
2.	The Application Provider App informs the Application Provider backend
3.	Optional: The Application Provider backend can request the Mobile ID capabilities of the user
4.	Optional: Mobile ID backend checks the user’s capabilities and provides the response
5.	Optional: Application Provider gets all user details to know if the user has an active Mobile ID App
6.	The Application Provider sends an asynchronous signature request that includes the App2App ser-vice request. The URI value of the Application Provider App is provided as RedirectURI parameter.
7.	Mobile ID API responds immediately with a Signature Response, which contains the AuthURI pa-rameter. This is the URI value of the Mobile ID App.
8.	The Application Provider App can either immediately trigger the Mobile ID App (step 8a) or display a button, which will trigger the Mobile ID App (step 8b)
9.	The AuthURI is triggered by the Application Provider App
10.	The Mobile ID App is automatically opened on the user’s smartphone
11.	The Mobile ID backend invokes the authentication request on the Mobile ID App
12.	The Mobile ID authentication message is shown on the Mobile ID App
13.	The user confirms the authentication request with his 2nd factor (Passcode or Biometry)
14.	The Mobile ID App signs the message with the private key stored on the device
15.	The Mobile ID App sends the signed data (signature) to the Mobile ID backend
16.	The Mobile ID backend completes the transaction
17.	The RedirectURI is triggered by the Mobile ID App
18.	The Application Provider App is automatically opened on the user’s smartphone
19.	The Application Provider polls the Mobile ID transaction status by sending a MSS Status Request
20.	The Status Response returns the final Mobile ID Signature (if outstanding, step 19 is repeated)
21.	Optional: The Application Provider validates the CMS Signature to ensure that the Signature is valid
22.	The Application Provider forwards the successful Mobile ID authentication result to their App

Example usage (code snippet from the MSS Signature Request):

```xml
<mss:AdditionalServices>
  <mss:Service>
    <mss:Description>
      <mss:mssURI>http://mid.swisscom.ch/as#app2app</mss:mssURI>
    </mss:Description>
    <mss:App2App>
      <ns1:RedirectUri xmlns:ns1="http://mid.swisscom.ch/TS102204/as/v1.0">myapp://example</ns1:RedirectUri>
    </mss:App2App>
  </mss:Service>
</mss:AdditionalServices>

```

```json
"AdditionalServices": [
  {
    "Description": "http://mid.swisscom.ch/as#app2app",
    "App2App": {
      "RedirectUri": "myapp://example"
    }
  }
]

```


Best Practice Guidelines:
- It is highly recommended for an Application Provider to implement the App2App service as it will greatly improve the usability for any user that uses the Mobile ID App as authentication method
- Both Android and iOS are supported for the automatic App2App switch
- This service can only be used with the asynchronous MSS Signature. In case a synchronous MSS Signature with App2App service is attempted, Mobile ID API will respond with a fault (WRONG_PARAM).
- In case this service is requested, there will be no Mobile ID push notification triggered. That’s because a push notification is not required if the Mobile ID App is automatically opened.
- Please refer also to the official documentation from Apple  and Android  about how to im-plement custom URL schemes in your app


##### MSS Signature Request incl. App2App service

```xml
```

```json
```


##### MSS Signature Response incl. App2App service response


### Message Formats on the Moblie ID App

#### Calssic DTBD (single-line text)

#### Transaction Approval (key/value pairs)


## MSS Status Query

## MSS Receipt

## MSS Profile Query
