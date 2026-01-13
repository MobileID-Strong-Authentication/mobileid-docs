# Status and Fault Codes
## Overview

| Status Code | Fault Code | Status Message | Description | MSS Signature | MSS Status Query | MSS Receipt | MSS Profile Query |
|-------------|------------|----------------|-------------|---------------|-------------------|-------------|-------------------|
| 100 |  | REQUEST_OK | The request from the AP has been accepted. | X |  | X | X |
|  | 101 | WRONG_PARAM | The AP's request contains wrong parameters. | X | X | X | X |
|  | 102 | MISSING_PARAM | The AP's request has missing parameters. | X | X | X | X |
|  | 103 | WRONG_DATA_LENGTH | The AP's request contains a DTBD message that is exceeding the max. allowed length. | X |  | X |  |
|  | 104 | UNAUTHORIZED_ACCESS | AP is not authorized to access the Mobile ID API. This is typically due to a wrong AP_ID value or missing X509 client certificate. | X | X | X | X |
|  | 105 | UNKNOWN_CLIENT | Either the MSISDN is unknown to the MID service and there is no Mobile ID user with that MSISDN. Or the MSISDN is an app only user and the AP is not authorized to use the app method. | X |  | X | X |
|  | 107 | INAPPROPRIATE_DATA | The AP's request was not accepted due to inappropriate data. Typically, the DTBD message does not contain the mandatory prefix string (see section 2.1) that is a unique string for each AP. | X |  | X |  |
|  | 108 | INCOMPATIBLE_INTERFACE | The AP's request contains bad data. Typically, a wrong MajorVersion or MinorVersion value has been set in the request. | X | X | X | X |
|  | 109 | UNSUPPORTED_PROFILE | Either the AP has specified an MSS signature profile value that the MSSP does not support or the AP is not authorized to use the Signature Profile. See section 3.2.1. | X |  |  |  |
|  | 208 | EXPIRED_TRANSACTION | The transaction timed out. The AP may try again. | X | X | X |  |
|  | 209 | OTA_ERROR | A Problem related to the MSSP internal Over-The-Air (OTA) communication with the Mobile ID user's SIM. Typically, there is a temporary problem with SMS communication. | X | X |  |  |
|  | 401 | USER_CANCEL | The user cancelled the request at the mobile phone. | X | X |  |  |
|  | 402 | PIN_NR_BLOCKED | The Mobile ID PIN of the SIM method is blocked. The user must re-activate the Mobile ID SIM card on the Mobile ID selfcare portal. | X | X | X | X |
|  | 403 | CARD_BLOCKED | The Mobile ID user is currently suspended. Please contact Swisscom Support. | X | X | X | X |
|  | 404 | NO_KEY_FOUND | The Mobile ID user exists but is not in an active state. The user must activate the account on the Mobile ID selfcare portal. | X | X | X | X |
|  | 406 | PB_SIGNATURE_PROCESS | A signature transaction is already on-going. Please try again later. | X | X |  |  |
|  | 422 | NO_CERT_FOUND | The Mobile ID user exists but is not in an active state. The user must activate the account on the Mobile ID selfcare portal. | X | X | X | X |
| 500 |  | SIGNATURE | The MSS Signature transaction was successful. | X | X |  |  |
| 501 |  | REVOKED_CERTIFICATE | The Mobile ID user's x509 certificate has been revoked. The user must re-activate the account on the Mobile ID selfcare portal. | X | X |  |  |
| 502 |  | VALID_SIGNATURE | The MSS Signature transaction was successful. | X | X |  |  |
| 503 |  | INVALID_SIGNATURE | The MSS Signature transaction failed due to invalid signature data. The user may try to re-activate the account on the Mobile ID selfcare portal. It may be required to replace the SIM card. | X | X |  |  |
| 504 |  | OUSTANDING_TRANSACTION | The MSS Signature transaction is outstanding. The AP must try again later. |  | X |  |  |
|  | 900 | INTERNAL_ERROR | An internal error on MSSP has occurred. Please try again later or contact Swisscom Support, if the problem persists. | X | X | X | X |


## Testing Status and Fault Codes

Specific MSISDNs are available to test different type of response status and fault codes. By placing a request to one of this number the related status or fault code will be raised. The following MSISDN structure is used for testing fault codes, which might help a developer to test the error handling of their Mobile ID client.

- `+41000092<faultcode>` - Use one of the 3-digit fault sub-code values listed in section 6.1.

On the other hand, a successful Mobile ID signature response can be tested by using one of the two MSISDNs listed below, which might help with CI/CD pipelines that include automated regression testing with Mobile ID authentications. However, your account will require specific permissions to be able to use the test-MSISDNs for successful Mobile ID responses. Please ask your Swisscom contact if you need this permission.

- `41700092501` – This number returns a successful Mobile ID signature response based on an EC key
- `41700092502` - This number returns a successful Mobile ID signature response based on an RSA key

## Test-MSISDN Overview

| Request Test-MSISDN | Fault Code | Reason Message | Detail Message |
|---------------------|------------|-----------------|-----------------|
| 41000092101 | 101 | WRONG_PARAM | Error among the arguments of the request |
| 41000092102 | 102 | MISSING_PARAM | An argument in the request is missing |
| 41000092103 | 103 | WRONG_DATA_LENGTH | The DataToBeSigned are too large. Limitations are due to the Mobile Signature technology implemented by the MSSP. |
| 41000092104 | 104 | UNAUTHORIZED_ACCESS | The AP is unknown, or the client authentication failed, or the AP asks for an additional service for which it has not subscribed. |
| 41000092105 | 105 | UNKNOWN_CLIENT | MSISDN is unknown |
| 41000092107 | 107 | INAPPROPRIATE_DATA | DTBD matching failed |
| 41000092108 | 108 | INCOMPATIBLE_INTERFACE | The minor version and/or major version parameters are inappropriate for the receiver of the message. |
| 41000092109 | 109 | UNSUPPORTED_PROFILE | The user does not support this Mobile Signature Profile |
| 41000092208 | 208 | EXPIRED_TRANSACTION | Transaction Expiry date has been reached or Time out has lapsed. |
| 41000092209 | 209 | OTA_ERROR | The MSSP has not succeeded to contact the end-user's mobile equipment Bad connection...) |
| 41000092401 | 401 | USER_CANCEL | User cancelled the request |
| 41000092402 | 402 | PIN_NR_BLOCKED | PIN of the mobile user is blocked |
| 41000092403 | 403 | CARD_BLOCKED | Mobile user account has state INACTIVE or no SIM assigned |
| 41000092404 | 404 | NO_KEY_FOUND | Mobile user account needs to be activated |
| 41000092406 | 406 | PB_SIGNATURE_PROCESS | Signature request already in progress. |
| 41000092422 | 422 | NO_CERT_FOUND | Certificate is expired |
| 41000092900 | 900 | INTERNAL_ERROR | Unknown Error |

For example, a Profile Query request with MSISDN +41000092401 will result in a fault 401 as shown below:

```json
{
    "Fault": {
        "Code": {
            "SubCode": {
                "Value": "_401",
                "ValueNs": "http://uri.etsi.org/TS102204/v1.1.2#"
            },
            "Value": "Receiver",
            "ValueNs": "http://www.w3.org/2003/05/soap-envelope"
        },
        "Detail": "User cancelled the request",
        "Reason": "USER_CANCEL"
    }
}
```


