# Getting Started

Before you can integrate and use Mobile ID OpenID Connect sign-in, the client on-boarding process must have been completed by Swisscom.

For the technical on-boarding, you will be asked to provide Swisscom following information:

| What | Quick Description | Ref. |
|------|--------------------|------|
| **Client Display Name** | Your client’s name, which is displayed by the authorization server. <br> Example value: `iDemo Online Shop` | |
| **Redirect URI(s)** | Redirection URI(s) to which the response will be sent. Note that TLS (https) is always required and localhost URI is not allowed.<br> Example value:<br>`https://app01.idemo-company.ch/oauth2/authresp`<br>`https://app02.idemo-company.ch/oauth2/authresp` | oidc spec |
| **Default ACR** | Your default ACR. Must be a value that is available for your selected Mobile ID contract.<br> Example value: `mid_al3_any` | 2.2.2 |
| **Client Auth Mode** | Your client’s authentication method, either basic or post.<br> Example value: `client_secret_post` | 2.4 |
| **Always Prompt For Consent** | The Mobile ID server default behaviour is to skip the consent step, provided such is already recorded for the given end-user and client.<br> Default: `false` | |
| **MFA Number Matching** | Enable MFA number matching feature for Mobile ID SIM and Mobile ID App authentication.<br> When a user responds to an MFA notification using Mobile ID SIM or Mobile ID App, they'll be presented with a number on their mobile. They need to select that number in the sign-in prompt to complete the approval.<br> Default: `false` | video |
| **LDAP Settings** | Optional. Mobile ID server can connect to an LDAP(S) to validate user credentials and/or retrieve user attributes from the LDAP, such as:<br> - MFA mobile number attribute<br> - Mobile ID Serialnumber attribute (required for ACR mid_al4)<br> - User password attribute | |
| **CNAME Record** | Optional. Mobile ID server can use a custom domain instead of default m.mobileid.ch. Custom Domains are only relevant if prompt=login is used. We will need your record name (e.g. mobileid.acme.com) that routes the traffic to m.mobileid.ch. | |

You will get a unique OIDC client identifier and client secret from Swisscom.
If you did not receive your client credentials, it means that your on-boarding process is not finished yet.
Please check the state with your commercial contact or via **Backoffice.Security@swisscom.com**.

---

## Endpoint URIs

A default Mobile ID OpenID Provider configuration is published on the OIDC discovery endpoint, which allows a client to discover the OAuth 2.0 and OpenID Connect endpoints, capabilities, supported cryptographic algorithms and features.

It is recommended to host a local copy of this file when your application relies on constant availability of this endpoint data.

| Endpoint | URL |
|-----------|-----|
| Discovery | https://openid.mobileid.ch/.well-known/openid-configuration |
| Authorization | https://m.mobileid.ch/oidc/authorize |
| Token | https://openid.mobileid.ch/token |
| User Info | https://openid.mobileid.ch/userinfo |
| Pushed Authorization Requests | https://openid.mobileid.ch/par |

---

## Authorization Code Request

The authorization code can be obtained by performing a simple HTTP GET request towards the Authorization Code endpoint of the Mobile ID OP. The client secret is not involved yet.

| Endpoint | URL |
|-----------|-----|
| Authorization | https://m.mobileid.ch/oidc/authorize |

The Relying Party may trigger the authorization code flow by calling the authorization link (including required request parameters), for example:

```html
<a href="https://m.mobileid.ch/oidc/authorize?response_type=code&scope=openid&client_id=s6BhdRkqt3&state=af0ifjsldkj&redirect_uri=https%3A%2F%2Fcompany.ch%2Fcb" rel="noreferrer">MobileID-sign-in-button</a>
