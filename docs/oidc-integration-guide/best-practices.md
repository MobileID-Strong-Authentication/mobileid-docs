# Best Practices

## Pushed Auth Request (PAR)

### Back-channel PAR Submission

The [Pushed Authorisation Request (PAR)](https://datatracker.ietf.org/doc/html/rfc9126) endpoint gives OAuth 2.0 clients a back-channel to post the parameters of an authorisation request to the Mobile ID server, to obtain an opaque URI handle for them, and then continue with the frontend redirection to the authorisation endpoint as usual.

::: info
Introducing an extra backend call to submit the authorisation parameters has three benefits:

- **Frees the authorisation request from any browser URL length limits.** They can become an issue with complex requests, such as RAR.
- **Keeps the parameters confidential** between client and server. Regular requests expose them in the URL query string and hence to the browser, the end-user and logs.
- **Confidential OAuth clients will be authenticated up-front**, and the request parameters will be checked for errors, before sending the end-user to the authorisation endpoint for login and consent.
:::


### PAR Request (POST)

Submits the OAuth 2.0 authorisation request parameters to `/par` to obtain a `request_uri` handle for use at the authorisation endpoint.

**Header parameters:**
- `Authorization` — Used for HTTP basic authentication of the client.
- `Content-Type` — Must be set to `application/x-www-form-urlencoded`.
- `Issuer` — The issuer URL (optional).
- `Tenant-ID` — The tenant ID (optional).

**Body:**
- The OAuth 2.0 authorisation request parameters, together with any client authentication parameters.

**Success:**
- Code: `200`
- Content-Type: `application/json`
- Body: `{object}` The PAR response.

Example PAR request for a confidential client registered for `client_secret_basic` authentication:

```http
POST /par HTTP/1.1
Host: openid.mobileid.ch
Authorization: Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW
Content-Type: application/x-www-form-urlencoded

response_type=code
&scope=openid%20email
&client_id=fcb5e4f1
&state=af0ifjsldkj
&redirect_uri=https%3A%2F%2Fclient.example.org%2Fcb
```

Example PAR request for a public client with [PKCE](https://datatracker.ietf.org/doc/html/rfc7636):

```http
POST /par HTTP/1.1
Host: openid.mobileid.ch
Content-Type: application/x-www-form-urlencoded

response_type=code
&scope=openid%20email
&client_id=fcb5e4f1
&state=af0ifjsldkj
&redirect_uri=https%3A%2F%2Fclient.example.org%2Fcb
&code_challenge_method=S256
&code_challenge=E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM
```

Example response with a request URI to complete the authorisation:

```http
HTTP/1.1 200 OK
Content-Type: application/json;charset=UTF-8
Cache-Control: no-store
Pragma: no-cache

{
  "request_uri" : "urn:ietf:params:oauth:request_uri:OsL1Z3VqIxAT9R77wB7KCw.5-cQUNt9DygE4XxnYjysnw",
  "expires_in"  : 60
}
```

### PAR Response

JSON object with members:

- `request_uri` — The request URI handle to use at the authorisation endpoint.
- `expires_in` — The configured lifetime of the request URI, in seconds.

Example:

```json
{
  "request_uri" : "urn:ietf:params:oauth:request_uri:OsL1Z3VqIxAT9R77wB7KCw.5-cQUNt9DygE4XxnYjysnw",
  "expires_in"  : 60
}
```

## Token and response validation

According to the OIDC specification, RPs must ensure that the received tokens are valid. The following chapters summarize the Relying Party's obligations when consuming OIDC/OAUTH tokens and responses.

### Authentication Request

Provide state and nonce values with sufficient entropy.

- [OIDC Core — AuthRequest](http://openid.net/specs/openid-connect-core-1_0.html#AuthRequest)
- [OIDC Core — NonceNotes](http://openid.net/specs/openid-connect-core-1_0.html#NonceNotes)

### Validate Auth Responses

Handle the state parameter correctly.

- [OIDC Core — AuthResponseValidation](http://openid.net/specs/openid-connect-core-1_0.html#AuthResponseValidation)

### Validate Token Responses

Validate the ID Token and verify scopes.

- [OIDC Core — TokenResponseValidation](http://openid.net/specs/openid-connect-core-1_0.html#TokenResponseValidation)

### Validate ID token

Relying Parties must validate ID Tokens. The Mobile ID OP signs ID Tokens with **RS256** by default. To verify the signature, fetch the public key from the JWKS endpoint:

| Resource | URL |
|----------|-----|
| Discovery | https://openid.mobileid.ch/.well-known/openid-configuration |
| JWKS | https://openid.mobileid.ch/jwks.json |

**Practical validation steps:**

1. Decode the JWT header and extract the `kid` (Key ID).
2. Fetch the matching public key from the [JWKS endpoint](https://openid.mobileid.ch/jwks.json) (cache the key set and refresh when an unknown `kid` appears).
3. Verify the RS256 signature using the public key.
4. Validate the standard claims:
   - `iss` must equal `https://openid.mobileid.ch`
   - `aud` must contain your `client_id`
   - `exp` must not be in the past
   - `nonce` must match the value you sent in the authorization request

::: tip
Most OIDC client libraries (e.g. `openid-client` for Node.js, `authlib` for Python, Spring Security for Java) handle JWKS fetching and ID Token validation automatically when configured with the discovery URL. It is strongly recommended to rely on a well-maintained library rather than implementing token validation manually.
:::

- [OIDC Core — IDTokenValidation](http://openid.net/specs/openid-connect-core-1_0.html#IDTokenValidation)

### Protect Client ID and secret

::: warning
Relying Party's credentials (for example, client secret) must be stored safely to remain a secret only known by the Relying Party. Relying Party should inform the Mobile ID OP in case credentials have been compromised.
:::

### Store tokens securely

::: warning
Tokens, especially Refresh Tokens, must be treated as credentials and stored securely in a place where only the End-Users for whom they were issued can access them.
:::

## Test Users

There are test user accounts available for testing and debugging purposes.

::: info
Due to the strict phone number validation during the Mobile ID authorization flow, these test phone numbers will only be accepted by the Mobile ID server if they are provided via the `login_hint` request parameter. Your account must be authorized to use the `login_hint` parameter and requires the use of Pushed Authorisation Requests (PAR), which keeps the parameters confidential between client and server (see section [Pushed Authorization Request (PAR)](/oidc-integration-guide/best-practices#pushed-authorization-request-par)).
:::

| MSISDN | Auth | Description |
|--------|------|-------------|
| `+41-700092501` | SIM | Robot User (EC key; Swisscom Root CA 2 Certificate) |
| `+41-700092502` | SIM | Robot User (RSA key; Swisscom Root CA 2 Certificate) |
| `+41-000092401` | SIM | Simulated user to test the Mobile ID Error 401; USER_CANCEL |
| `+41-000092402` | SIM | Simulated user to test the Mobile ID Error 402; PIN_BLOCKED |
| `+41-000092403` | SIM | Simulated user to test the Mobile ID Error 403; CARD_BLOCKED |
| `+41-000092404` | SIM | Simulated user to test the Mobile ID Error 404; NO_KEY_FOUND |
| `+41-000092406` | SIM | Simulated user to test the Mobile ID Error 406; PB_SIGNATURE_PROCESS |
