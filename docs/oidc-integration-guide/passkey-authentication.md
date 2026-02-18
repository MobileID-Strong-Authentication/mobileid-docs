# Passkey Authentication (early access)

MobileID now supports **FIDO2 Passkeys** as an authentication method within the OpenID Connect service. Relying Parties can allow their users to authenticate using MobileID Passkeys - alongside or instead of the existing MobileID SIM, App, and OTP SMS methods.

## What Are Passkeys?

The MobileID ecosystem already offers several proven authentication methods: **MobileID SIM** (SIM-based authentication), **MobileID App** (push-based authentication on iOS and Android), and **OTP SMS**. With the introduction of **FIDO2 Passkeys**, MobileID now adds a modern, phishing-resistant authentication option to its portfolio - giving Relying Parties and their users even more flexibility to balance security and convenience.

Passkeys are built on the [FIDO2](https://fidoalliance.org/fido2/) standard and the [WebAuthn](https://www.w3.org/TR/webauthn-2/) API. Instead of passwords, passkeys use **public-key cryptography**: a private key stays securely on the user's device (or synced within a platform ecosystem), while the corresponding public key is stored by the service.

Key characteristics of passkeys:

- **Phishing-resistant** - Authentication is cryptographically bound to the origin (domain), so credentials cannot be phished or replayed on a different site.
- **Passwordless** - Users authenticate with biometrics (fingerprint, face), a device PIN, or a hardware security key. No passwords to remember or leak.
- **Multi-factor by design** - Passkeys inherently combine possession (the device holding the private key) with a user verification factor (biometrics or PIN), satisfying multi-factor authentication requirements in a single gesture.
- **Multi-device** - Depending on the passkey type, credentials can be synced across devices within a platform ecosystem (e.g., Apple iCloud Keychain, Google Password Manager) or bound to a single hardware device (e.g., YubiKey).

### Device-Bound vs. Synced Passkeys

The term "Passkeys" is an **umbrella term** for FIDO2-based authenticators. Under the hood, these can be **platform authenticators** (built into a device, such as Touch ID or Windows Hello) or **roaming authenticators** (external hardware keys, such as a YubiKey). These authenticator types differ significantly in how they store the private key - and this distinction directly impacts the security assurance level they can achieve.

For MobileID, one of the most relevant security standards is [**NIST AAL3**](https://pages.nist.gov/800-63-3/sp800-63b.html) (Authentication Assurance Level 3), which specifies the highest level of authentication assurance. To achieve AAL3, the authenticator must be **device-bound** (the private key cannot be exported or synced) and the hardware must be **FIPS 140-2 certified**. Cloud-synced passkeys - while phishing-resistant and suitable for AAL2 - do not meet AAL3 because the private key is exportable across devices.

This distinction matters for Relying Parties integrating MobileID: while **MobileID users are free to register any type of passkey** in their [MyMobileID Dashboard](https://mobileid.ch/login), the **RP has full control** over which passkey types are accepted during authentication. Through the passkey claims returned by MobileID (see [Passkey Scope and Claims](#passkey-scope-and-claims)), the RP can enforce specific requirements - for example, accepting only FIPS 140-2 certified, device-bound passkeys for high-assurance use cases.

| Aspect | Device-Bound Passkeys | Cloud-Synced Passkeys |
|--------|----------------------|----------------------|
| **Private key storage** | Stored locally on a single device's secure hardware (e.g., Secure Enclave, TPM) | Synced across devices via encrypted cloud services (e.g., iCloud Keychain, Google Password Manager) |
| **Examples** | YubiKey, Windows Hello, hardware security keys | Apple Passkeys, Google Passkeys |
| **Portability** | Tied to one device; if lost, the passkey is lost | Available on all devices within the user's ecosystem |
| **NIST AAL3 compliance** | Yes (if FIPS 140-2 certified) | No (private key is exportable) |
| **Phishing-resistant** | Yes | Yes |

::: info
Only **device-bound passkeys** on **FIPS 140-2 certified** authenticators (e.g., YubiKey 5 FIPS Series with firmware 5.7+) can meet [NIST AAL3](https://pages.nist.gov/800-63-3/sp800-63b.html) requirements. Cloud-synced passkeys are phishing-resistant and meet AAL2, but do not satisfy AAL3 because the private key can be exported.
:::

## Why MobileID Passkeys?

Implementing passkey registration, management, and authentication from scratch is **complex and resource-intensive** for Relying Parties. MobileID Passkeys remove this burden entirely by leveraging a concept familiar from established OpenID Connect providers: **all passkey operations happen on the `mobileid.ch` domain**.

Similar to how signing in with Google redirects the user to `google.com` for authentication, MobileID redirects the user to `mobileid.ch` during the OIDC authorization code flow. Because the user's passkeys are **bound to the `mobileid.ch` origin**, they work seamlessly across any Relying Party that integrates MobileID - the user registers their passkeys once and can authenticate at any RP, regardless of the RP's domain. This centralized approach maintains full security guarantees, including the ability to achieve the highest assurance levels such as **NIST AAL3** (see [Authentication Flow](#authentication-flow-oidc) below).

By using MobileID Passkeys, RPs benefit from:

- **No passkey infrastructure to build** - MobileID handles the entire FIDO2/WebAuthn registration and authentication lifecycle. RPs integrate via the standard OpenID Connect protocol they already use.
- **Centralized passkey management** - Users register and manage their passkeys on the [MyMobileID Dashboard](https://mobileid.ch/login), secured by MobileID step-up authentication. RPs do not need to build passkey management UIs.
- **Single registration, multi-RP usage** - Passkeys are bound to the `mobileid.ch` domain, not to individual RP domains. A single MobileID Passkey works across all Relying Parties that use MobileID OIDC.
- **Flexible authenticator support** - Users can register passkeys from different platforms and vendors (Apple, Google, YubiKey, Windows Hello, etc.) and manage multiple passkeys on their account.
- **NIST AAL3 possible** - With FIPS 140-2 certified authenticators, RPs can achieve the highest NIST assurance level through MobileID, without building any of the complex infrastructure themselves.
- **Backward-compatible** - If an RP ignores all passkey-related parameters, or if passkeys are not enabled for the client account, the runtime behavior is identical to the current release.

## How It Works

### Passkey Registration

Users register their passkeys on the **MyMobileID Dashboard** at [https://mobileid.ch/login](https://mobileid.ch/login):

1. The user authenticates to the MyMobileID Dashboard (via SMS OTP verification).
2. In the dashboard, the user selects **Manage Passkeys**.
3. The user registers one or more passkeys - the passkey name defaults to their MobileID mobile number.
4. Passkeys are bound to the `mobileid.ch` domain, enabling cross-RP usage.

Users can register passkeys from different platforms (e.g., Apple Touch ID, Google Password Manager, YubiKey) and manage (list/delete) them at any time.

<div style="display: flex; gap: 24px; justify-content: center; flex-wrap: wrap; margin: 24px 0; align-items: flex-start;">
  <figure style="text-align: center; margin: 0;">
    <img src="/img/oidc/mymobileid-passkeys-tile.png" alt="Passkey management tile on the MyMobileID Dashboard" width="260">
    <figcaption style="font-size: 0.85em; color: var(--vp-c-text-2); margin-top: 8px;">Passkey management tile</figcaption>
  </figure>
  <figure style="text-align: center; margin: 0;">
    <img src="/img/oidc/mymobileid-passkeys-list.png" alt="List of registered passkeys on the MyMobileID Dashboard" width="400">
    <figcaption style="font-size: 0.85em; color: var(--vp-c-text-2); margin-top: 8px;">Registered passkeys with KeyRingID and metadata</figcaption>
  </figure>
</div>

### Authentication Flow (OIDC)

During the OpenID Connect authorization code flow, passkey authentication works as follows:

1. The user clicks the login button on the **Relying Party's** website.
2. The user's browser is **redirected** from the RP's domain to the `mobileid.ch` domain (the MobileID OpenID Provider).
3. On the `mobileid.ch` domain, the user is prompted to authenticate with their **MobileID Passkey** - this works because the passkeys were registered on the same `mobileid.ch` domain.
4. After successful passkey authentication, the user is redirected back to the RP with the authorization code.
5. The RP completes the standard token exchange and retrieves user claims.

::: tip
The passkey authentication is **usernameless** and **passwordless** - the user simply confirms with biometrics, a PIN, or by tapping their hardware key. No phone number or username entry is needed if the RP enforces passkey-only authentication.
:::

### Passkey-Only vs. Fallback

Depending on the chosen ACR value, the RP can configure two modes:

- **Passkey-only** (e.g., `mid_al4_passkey`): Only passkey authentication is allowed. If the user cannot authenticate with a passkey, they must abort and register a new passkey on the MyMobileID Dashboard before trying again.
- **Passkey-preferred with fallback** (e.g., `mid_al2_any`, `mid_al4_any` with passkeys enabled): Passkey authentication is tried first. If it fails, the user can fall back to MobileID SIM, App, or OTP SMS.

<div style="display: flex; gap: 24px; justify-content: center; flex-wrap: wrap; margin: 24px 0;">
  <figure style="text-align: center; margin: 0;">
    <img src="/img/oidc/mockdesign-auth-passkeyonly.png" alt="Passkey-only authentication flow" width="280">
    <figcaption style="font-size: 0.85em; color: var(--vp-c-text-2); margin-top: 8px;">Passkey-only</figcaption>
  </figure>
  <figure style="text-align: center; margin: 0;">
    <img src="/img/oidc/mockdesign-auth-fallback.png" alt="Passkey-preferred with fallback methods" width="280">
    <figcaption style="font-size: 0.85em; color: var(--vp-c-text-2); margin-top: 8px;">Passkey-preferred with fallback</figcaption>
  </figure>
</div>

### RP Control Over Passkey Quality

Beyond choosing between passkey-only and fallback modes, the RP can **enforce specific passkey quality requirements**. Every passkey authentication returns detailed claims via the `mid_passkey` scope (see [Passkey Scope and Claims](#passkey-scope-and-claims)), such as `mid_pk_cert_level` (e.g., `FIPS140-2`), `mid_pk_binding` (e.g., `device-bound`), and `mid_pk_aaguid` (authenticator model). The RP can evaluate these claims to accept or reject the authentication based on its own security policy.

The highest assurance level is achieved with the ACR value **`mid_al4_passkey`**, which requires the RP to provide a `keyringId` in the `login_hint`. This enables **KeyRingID matching** - a MobileID-specific mechanism that guarantees **NIST AAL3** compliance:

- The **KeyRingID** is a stable identifier associated with the user's passkey registration. As long as the KeyRingID matches, MobileID guarantees that the user is authenticating with a passkey that was registered through a verified step-up authentication process, ensuring continuity of trust.
- If the KeyRingID **no longer matches**, it means the user has changed their passkey (e.g., registered a new one) but the required step-up authentication during the registration on the MyMobileID Portal was skipped or bypassed. In this case, AAL3 cannot be guaranteed, and the RP is notified via the claims.
- The KeyRingID is returned as the `mid_pk_keyringid` claim and should be stored by the RP for subsequent authentication requests at AL4.

This gives the RP a spectrum of choices - from using passkeys purely as a **UX improvement** (e.g., `mid_al2_any` with fallback to SIM/App), to enforcing the **highest security level** (e.g., `mid_al4_passkey` with KeyRingID and FIPS 140-2 validation). The various ACR values and their properties are detailed in the [Passkey ACR Values](#passkey-acr-values) table.

## OIDC Passkey Parameters

### Core Request Parameters

The following table shows the request parameters for an authorization request that uses passkey authentication. Most parameters are the same as for standard MobileID OIDC requests (see [Getting Started](/oidc-integration-guide/getting-started#authorization-code-request)).

| Parameter | Required | Example | Notes |
|-----------|----------|---------|-------|
| `response_type` | Yes | `code` | Standard OIDC |
| `scope` | Yes | `openid phone mid_passkey` | Add `mid_passkey` for passkey claims |
| `client_id` | Yes | `rpdemo` | Issued by Swisscom |
| `redirect_uri` | Yes | `https://rp.example.com/cb` | Must match registration |
| `acr_values` | Yes | `mid_al4_passkey` | See [Passkey ACR Values](#passkey-acr-values) |
| `state` / `nonce` | Yes | random | Standard OIDC |
| `ui_locales` | No | `de` | `en`, `de`, `fr`, `it` |
| `login_hint` | No | JSON | See [Login Hint Extensions](#login-hint-extensions) |
| `dtbd` | No | `"Login to #CLIENT#?"` | Ignored for passkey authentication |

::: warning
The `dtbd` parameter is **ignored** during passkey authentication, since the FIDO2 authentication ceremony is handled natively by the browser/authenticator.
:::

### Passkey Scope and Claims

To receive passkey-related claims, add the `mid_passkey` scope to the authorization request. The following claims are returned via the **UserInfo endpoint** (or optionally in the ID Token):

| Scope | Claim | Type | Example Value | Description |
|-------|-------|------|---------------|-------------|
| `mid_passkey` | `mid_pk_keyringid` | string | `MIDPK123A567B90` | The user's passkey keyring identifier |
| | `mid_pk_binding` | string | `device-bound` \| `syncable` | Whether the passkey is bound to a device or synced |
| | `mid_pk_cert_level` | string | `FIPS140-2` \| `CommonCriteria` | Certification level of the authenticator |
| | `mid_pk_created_ts` | number | `1717584000` | When the credential was first registered (Unix epoch) |
| | `mid_pk_last_used_ts` | number | `1717591234` | Last usage timestamp (helps risk engines spot dormant keys) |
| | `mid_pk_aaguid` | string | `2fc0579f-8113-...` | FIDO Metadata Service identifier; maps to authenticator vendor/model |
| | `mid_pk_cred_fingerprint` | string | `pQECAyYgASFY...` | SHA-256 of the credential public key (COSE format) |
| | `mid_pk_auth_attachment` | string | `platform` \| `cross-platform` | Authenticator attachment modality |
| | `mid_pk_os_family` | string | `iOS` \| `Android` \| `Windows` | OS family of the authenticator platform |

::: tip Claim delivery and availability
The `mid_pk_keyringid` claim is also available via the `mid_profile` scope, allowing RPs to retrieve the KeyRingID without requesting the full `mid_passkey` scope.

**ID Token** should carry the minimal set of claims needed for cryptographic proof (sub, iss, aud, acr, amr, nonce, etc.). **UserInfo endpoint** is the recommended delivery channel for passkey detail claims, as they may change and can be verbose.

Following OIDC best practice, if a specific claim is not available for a given authentication (e.g., the authenticator does not report a certification level), that claim is simply **omitted from the response** rather than returned with a null or empty value.
:::

### Login Hint Extensions

The `login_hint` JSON schema has been extended with passkey-related fields. The full schema is:

```json
{
  "enableManualInput": true,
  "useLDAP": false,
  "hints": [
    {
      "msisdn": "+41791234567",
      "sn": "MIDCHEYUD1YE4QB1",
      "keyringId": "MIDPK123A567B90",
      "userName": "john.doe",
      "userPassword": "plain-secret",
      "isHashed": false,
      "default": true
    }
  ]
}
```

New passkey-specific field:

| Field | Type | Description |
|-------|------|-------------|
| `keyringId` | string | Restricts passkey authentication to a specific keyring. **Required** for `mid_al4_passkey` and `mid_al4_any` (when passkeys are enabled). |

Rules:

- Omit fields you don't need - the server tolerates missing keys.
- `sn` must be present for AL4 unless fetched via LDAP.
- `keyringId` is required for AL4 passkey flows to enforce a specific keyring.
- `useLDAP` and `msisdn` are mutually exclusive.

#### Passkey Login Hint Examples

Passkey-only (AL4):

```json
{"hints": [{"msisdn": "+41765XXXXXX", "keyringId": "MIDPKXXXXXXXXXX"}]}
```

Passkey-preferred with SIM/App fallback (AL4):

```json
{"enableManualInput": false, "hints": [{"msisdn": "+41765XXXXXX", "sn": "+574XXXXXX", "keyringId": "MIDPKXXXXXXXXXX"}]}
```

Passkey-preferred (AL2), no keyring restriction:

```json
{"enableManualInput": true, "hints": [{"msisdn": "+41765XXXXXX"}]}
```

### Passkey ACR Values

The following table shows how passkeys fit into the MobileID Authentication Level (AL) matrix. Passkeys are supported at **AL2** and **AL4**. There is no passkey support at AL3.

<div class="icon-legend">
  <span><img src="/img/oidc/lightbulb_on.svg" width="16" height="16"> Included</span>
  <span><img src="/img/oidc/lightbulb.svg" width="16" height="16"> Excluded</span>
  <span><img src="/img/oidc/star.svg" width="16" height="16"> Included, if 'Passkeys' feature is enabled for the client account</span>
</div>

<div class="table-scroll">
<table class="acr-table">
<thead>
<tr>
  <th rowspan="2">acr_values</th>
  <th colspan="4" style="text-align:center">Authentication Method</th>
  <th colspan="2" style="text-align:center">Additional Checks</th>
  <th rowspan="2" class="col-icon">NIST<br>AAL3</th>
  <th rowspan="2">Remarks</th>
</tr>
<tr>
  <th class="col-icon"><img src="/img/oidc/simkarte_LIGHT.png" width="22" height="22"><br>SIM</th>
  <th class="col-icon"><img src="/img/oidc/smartphone_LIGHT_1.png" width="22" height="22"><br>App</th>
  <th class="col-icon"><img src="/img/oidc/mobile-message_LIGHT.png" width="22" height="22"><br>OTP</th>
  <th class="col-icon"><img src="/img/oidc/passkey-icon-nobg.png" width="22" height="22"><br>Passkey</th>
  <th class="col-icon"><img src="/img/oidc/map_pointer_LIGHT.png" width="22" height="22"><br>CH Loc</th>
  <th class="col-icon"><img src="/img/oidc/passport_LIGHT.png" width="22" height="22"><br>KeyRing</th>
</tr>
</thead>
<tbody>
<tr>
  <td class="col-acr"><code>mid_al2_any</code></td>
  <td class="col-icon"><img src="/img/oidc/lightbulb_on.svg" width="16" height="16"></td>
  <td class="col-icon"><img src="/img/oidc/lightbulb_on.svg" width="16" height="16"></td>
  <td class="col-icon"><img src="/img/oidc/lightbulb_on.svg" width="16" height="16"></td>
  <td class="col-icon"><img src="/img/oidc/star.svg" width="16" height="16"></td>
  <td class="col-icon"><img src="/img/oidc/lightbulb.svg" width="16" height="16"></td>
  <td class="col-icon"><img src="/img/oidc/lightbulb.svg" width="16" height="16"></td>
  <td class="col-icon"><img src="/img/oidc/lightbulb.svg" width="16" height="16"></td>
  <td>Passkey-preferred if <code>passkeys_enabled:true</code>. Fallback to SIM/App/SMS if passkey auth fails.</td>
</tr>
<tr>
  <td class="col-acr"><code>mid_al3_any</code></td>
  <td class="col-icon"><img src="/img/oidc/lightbulb_on.svg" width="16" height="16"></td>
  <td class="col-icon"><img src="/img/oidc/lightbulb_on.svg" width="16" height="16"></td>
  <td class="col-icon"><img src="/img/oidc/lightbulb.svg" width="16" height="16"></td>
  <td class="col-icon"><img src="/img/oidc/lightbulb.svg" width="16" height="16"></td>
  <td class="col-icon"><img src="/img/oidc/lightbulb.svg" width="16" height="16"></td>
  <td class="col-icon"><img src="/img/oidc/lightbulb.svg" width="16" height="16"></td>
  <td class="col-icon"><img src="/img/oidc/lightbulb.svg" width="16" height="16"></td>
  <td>See note <sup>[1]</sup></td>
</tr>
<tr>
  <td class="col-acr"><code>mid_al3_any_ch</code></td>
  <td class="col-icon"><img src="/img/oidc/lightbulb_on.svg" width="16" height="16"></td>
  <td class="col-icon"><img src="/img/oidc/lightbulb_on.svg" width="16" height="16"></td>
  <td class="col-icon"><img src="/img/oidc/lightbulb.svg" width="16" height="16"></td>
  <td class="col-icon"><img src="/img/oidc/lightbulb.svg" width="16" height="16"></td>
  <td class="col-icon"><img src="/img/oidc/lightbulb_on.svg" width="16" height="16"></td>
  <td class="col-icon"><img src="/img/oidc/lightbulb.svg" width="16" height="16"></td>
  <td class="col-icon"><img src="/img/oidc/lightbulb.svg" width="16" height="16"></td>
  <td></td>
</tr>
<tr>
  <td class="col-acr"><code>mid_al3_simcard</code></td>
  <td class="col-icon"><img src="/img/oidc/lightbulb_on.svg" width="16" height="16"></td>
  <td class="col-icon"><img src="/img/oidc/lightbulb.svg" width="16" height="16"></td>
  <td class="col-icon"><img src="/img/oidc/lightbulb.svg" width="16" height="16"></td>
  <td class="col-icon"><img src="/img/oidc/lightbulb.svg" width="16" height="16"></td>
  <td class="col-icon"><img src="/img/oidc/lightbulb.svg" width="16" height="16"></td>
  <td class="col-icon"><img src="/img/oidc/lightbulb.svg" width="16" height="16"></td>
  <td class="col-icon"><img src="/img/oidc/lightbulb.svg" width="16" height="16"></td>
  <td></td>
</tr>
<tr>
  <td class="col-acr"><code>mid_al3_mobileapp</code></td>
  <td class="col-icon"><img src="/img/oidc/lightbulb.svg" width="16" height="16"></td>
  <td class="col-icon"><img src="/img/oidc/lightbulb_on.svg" width="16" height="16"></td>
  <td class="col-icon"><img src="/img/oidc/lightbulb.svg" width="16" height="16"></td>
  <td class="col-icon"><img src="/img/oidc/lightbulb.svg" width="16" height="16"></td>
  <td class="col-icon"><img src="/img/oidc/lightbulb.svg" width="16" height="16"></td>
  <td class="col-icon"><img src="/img/oidc/lightbulb.svg" width="16" height="16"></td>
  <td class="col-icon"><img src="/img/oidc/lightbulb.svg" width="16" height="16"></td>
  <td></td>
</tr>
<tr>
  <td class="col-acr"><code>mid_al4_any</code></td>
  <td class="col-icon"><img src="/img/oidc/lightbulb_on.svg" width="16" height="16"></td>
  <td class="col-icon"><img src="/img/oidc/lightbulb_on.svg" width="16" height="16"></td>
  <td class="col-icon"><img src="/img/oidc/lightbulb.svg" width="16" height="16"></td>
  <td class="col-icon"><img src="/img/oidc/star.svg" width="16" height="16"></td>
  <td class="col-icon"><img src="/img/oidc/lightbulb.svg" width="16" height="16"></td>
  <td class="col-icon"><img src="/img/oidc/lightbulb_on.svg" width="16" height="16"></td>
  <td class="col-icon"><img src="/img/oidc/lightbulb.svg" width="16" height="16"></td>
  <td>Passkey-preferred if <code>passkeys_enabled:true</code>. Fallback to SIM/App. RP must provide <code>sn</code> and <code>keyringId</code> in <code>login_hint</code>.</td>
</tr>
<tr>
  <td class="col-acr"><code>mid_al4_any_ch</code></td>
  <td class="col-icon"><img src="/img/oidc/lightbulb_on.svg" width="16" height="16"></td>
  <td class="col-icon"><img src="/img/oidc/lightbulb_on.svg" width="16" height="16"></td>
  <td class="col-icon"><img src="/img/oidc/lightbulb.svg" width="16" height="16"></td>
  <td class="col-icon"><img src="/img/oidc/lightbulb.svg" width="16" height="16"></td>
  <td class="col-icon"><img src="/img/oidc/lightbulb_on.svg" width="16" height="16"></td>
  <td class="col-icon"><img src="/img/oidc/lightbulb_on.svg" width="16" height="16"></td>
  <td class="col-icon"><img src="/img/oidc/lightbulb.svg" width="16" height="16"></td>
  <td></td>
</tr>
<tr>
  <td class="col-acr"><code>mid_al4_simcard</code></td>
  <td class="col-icon"><img src="/img/oidc/lightbulb_on.svg" width="16" height="16"></td>
  <td class="col-icon"><img src="/img/oidc/lightbulb.svg" width="16" height="16"></td>
  <td class="col-icon"><img src="/img/oidc/lightbulb.svg" width="16" height="16"></td>
  <td class="col-icon"><img src="/img/oidc/lightbulb.svg" width="16" height="16"></td>
  <td class="col-icon"><img src="/img/oidc/lightbulb.svg" width="16" height="16"></td>
  <td class="col-icon"><img src="/img/oidc/lightbulb_on.svg" width="16" height="16"></td>
  <td class="col-icon"><img src="/img/oidc/lightbulb.svg" width="16" height="16"></td>
  <td></td>
</tr>
<tr>
  <td class="col-acr"><code>mid_al4_mobileapp</code></td>
  <td class="col-icon"><img src="/img/oidc/lightbulb.svg" width="16" height="16"></td>
  <td class="col-icon"><img src="/img/oidc/lightbulb_on.svg" width="16" height="16"></td>
  <td class="col-icon"><img src="/img/oidc/lightbulb.svg" width="16" height="16"></td>
  <td class="col-icon"><img src="/img/oidc/lightbulb.svg" width="16" height="16"></td>
  <td class="col-icon"><img src="/img/oidc/lightbulb.svg" width="16" height="16"></td>
  <td class="col-icon"><img src="/img/oidc/lightbulb_on.svg" width="16" height="16"></td>
  <td class="col-icon"><img src="/img/oidc/lightbulb.svg" width="16" height="16"></td>
  <td></td>
</tr>
<tr>
  <td class="col-acr"><code>mid_al4_passkey</code></td>
  <td class="col-icon"><img src="/img/oidc/lightbulb.svg" width="16" height="16"></td>
  <td class="col-icon"><img src="/img/oidc/lightbulb.svg" width="16" height="16"></td>
  <td class="col-icon"><img src="/img/oidc/lightbulb.svg" width="16" height="16"></td>
  <td class="col-icon"><img src="/img/oidc/star.svg" width="16" height="16"></td>
  <td class="col-icon"><img src="/img/oidc/lightbulb.svg" width="16" height="16"></td>
  <td class="col-icon"><img src="/img/oidc/lightbulb_on.svg" width="16" height="16"></td>
  <td class="col-icon"><img src="/img/oidc/lightbulb_on.svg" width="16" height="16"></td>
  <td><strong>Passkey-only</strong> &amp; phishing-resistant. RP must provide <code>keyringId</code> in <code>login_hint</code>. NIST AAL3 if FIPS 140-2 certified authenticator.</td>
</tr>
</tbody>
</table>
</div>

**[1]** Passkeys are only supported with AL2 or AL4. There is no support for Passkeys with AL3. To keep things simple, the RP should use AL4 and provide `keyringId` via `login_hint`.

### Passkey Feature Flag

Passkey support is controlled via the `passkeys_enabled` flag, which Swisscom configures **per OIDC client** (a single RP can have multiple OIDC clients). The RP can request Swisscom to set this flag to `true` or `false` for each of its clients.

This flag determines whether passkeys are available and affects the authentication method priority order when the RP requests an ACR with `_any` suffix:

| `passkeys_enabled` (per client) | Priority order for `_any` ACRs |
|-------------------------------|----------------|
| `false` (default) | SIM :arrow_right: App :arrow_right: SMS |
| `true` | Passkey :arrow_right: SIM :arrow_right: App :arrow_right: SMS |

When set to `true` and the user has a registered passkey, passkey authentication is offered first. If the passkey authentication fails or the user opts out, MobileID falls back to the next available method according to the priority order.

::: warning
- If the requested ACR is disabled for the client, MobileID returns error `mid_sec_2020`.
- If `passkeys_enabled` is `false` but the RP requests a passkey-only ACR (e.g., `mid_al4_passkey`), MobileID returns `mid_auth_3080` ("No authentication method available").
:::

### Passkey AMR Values

The following AMR (Authentication Method Reference) values are returned in the ID Token when passkey authentication is used:

<div class="icon-legend">
  <span><img src="/img/oidc/lightbulb_on.svg" width="16" height="16"> Included</span>
  <span><img src="/img/oidc/lightbulb.svg" width="16" height="16"> Excluded</span>
</div>

<div class="table-scroll">
<table class="amr-table">
<thead>
<tr>
  <th rowspan="2">amr_values</th>
  <th colspan="4" style="text-align:center">Authentication Method</th>
  <th rowspan="2">Remarks</th>
</tr>
<tr>
  <th class="col-icon"><img src="/img/oidc/simkarte_LIGHT.png" width="22" height="22"><br>SIM</th>
  <th class="col-icon"><img src="/img/oidc/smartphone_LIGHT_1.png" width="22" height="22"><br>App</th>
  <th class="col-icon"><img src="/img/oidc/mobile-message_LIGHT.png" width="22" height="22"><br>OTP</th>
  <th class="col-icon"><img src="/img/oidc/passkey-icon-nobg.png" width="22" height="22"><br>Passkey</th>
</tr>
</thead>
<tbody>
<tr>
  <td class="col-acr"><code>mid_app</code></td>
  <td class="col-icon"><img src="/img/oidc/lightbulb.svg" width="16" height="16"></td>
  <td class="col-icon"><img src="/img/oidc/lightbulb_on.svg" width="16" height="16"></td>
  <td class="col-icon"><img src="/img/oidc/lightbulb.svg" width="16" height="16"></td>
  <td class="col-icon"><img src="/img/oidc/lightbulb.svg" width="16" height="16"></td>
  <td></td>
</tr>
<tr>
  <td class="col-acr"><code>mid_geo</code></td>
  <td class="col-icon"><img src="/img/oidc/lightbulb_on.svg" width="16" height="16"></td>
  <td class="col-icon"><img src="/img/oidc/lightbulb_on.svg" width="16" height="16"></td>
  <td class="col-icon"><img src="/img/oidc/lightbulb.svg" width="16" height="16"></td>
  <td class="col-icon"><img src="/img/oidc/lightbulb.svg" width="16" height="16"></td>
  <td></td>
</tr>
<tr>
  <td class="col-acr"><code>mid_otp</code></td>
  <td class="col-icon"><img src="/img/oidc/lightbulb.svg" width="16" height="16"></td>
  <td class="col-icon"><img src="/img/oidc/lightbulb.svg" width="16" height="16"></td>
  <td class="col-icon"><img src="/img/oidc/lightbulb_on.svg" width="16" height="16"></td>
  <td class="col-icon"><img src="/img/oidc/lightbulb.svg" width="16" height="16"></td>
  <td></td>
</tr>
<tr>
  <td class="col-acr"><code>mid_sim</code></td>
  <td class="col-icon"><img src="/img/oidc/lightbulb_on.svg" width="16" height="16"></td>
  <td class="col-icon"><img src="/img/oidc/lightbulb.svg" width="16" height="16"></td>
  <td class="col-icon"><img src="/img/oidc/lightbulb.svg" width="16" height="16"></td>
  <td class="col-icon"><img src="/img/oidc/lightbulb.svg" width="16" height="16"></td>
  <td></td>
</tr>
<tr>
  <td class="col-acr"><code>mid_sms</code></td>
  <td class="col-icon"><img src="/img/oidc/lightbulb.svg" width="16" height="16"></td>
  <td class="col-icon"><img src="/img/oidc/lightbulb.svg" width="16" height="16"></td>
  <td class="col-icon"><img src="/img/oidc/lightbulb_on.svg" width="16" height="16"></td>
  <td class="col-icon"><img src="/img/oidc/lightbulb.svg" width="16" height="16"></td>
  <td></td>
</tr>
<tr>
  <td class="col-acr"><code>phr</code></td>
  <td class="col-icon"><img src="/img/oidc/lightbulb.svg" width="16" height="16"></td>
  <td class="col-icon"><img src="/img/oidc/lightbulb.svg" width="16" height="16"></td>
  <td class="col-icon"><img src="/img/oidc/lightbulb.svg" width="16" height="16"></td>
  <td class="col-icon"><img src="/img/oidc/lightbulb_on.svg" width="16" height="16"></td>
  <td>Standard AMR "<strong>Phishing-Resistant</strong>". Only for ACR <code>mid_al4_passkey</code>.</td>
</tr>
<tr>
  <td class="col-acr"><code>hwk</code></td>
  <td class="col-icon"><img src="/img/oidc/lightbulb_on.svg" width="16" height="16"></td>
  <td class="col-icon"><img src="/img/oidc/lightbulb_on.svg" width="16" height="16"></td>
  <td class="col-icon"><img src="/img/oidc/lightbulb.svg" width="16" height="16"></td>
  <td class="col-icon"><img src="/img/oidc/lightbulb_on.svg" width="16" height="16"></td>
  <td>Standard AMR <a href="https://datatracker.ietf.org/doc/html/rfc8176">RFC 8176</a> "<strong>Hardware Key</strong>"</td>
</tr>
</tbody>
</table>
</div>

## Canonical RP Scenarios

The following table summarizes the most common passkey integration scenarios:

| # | Goal | `acr_values` | Key `login_hint` flags | Notes |
|---|------|-------------|----------------------|-------|
| 1 | **AL4, Passkey-only, phishing-resistant, FIPS- or device-bound** | `mid_al4_passkey` | `keyringId` | Requires `passkeys_enabled:true`. MobileID restricts passkey choices to the keyring. RP must request scope `mid_passkey` and validate claims to ensure a FIPS- or device-bound passkey was used. |
| 2 | **AL4, Passkey-only, phishing-resistant** | `mid_al4_passkey` | `keyringId` | Requires `passkeys_enabled:true`. MobileID restricts passkey choices to the keyring. |
| 3 | **AL4, Passkey-preferred, SIM/App fallback** | `mid_al4_any` | `keyringId`, `sn`, optional: `enableManualInput`, `msisdn` | MobileID restricts passkey choices to the keyring. `enableManualInput` and `msisdn` may be used for fallback. |
| 4 | **AL2, Passkey-preferred, SIM/App or OTP-SMS fallback** | `mid_al2_any` | optional: `enableManualInput`, `msisdn` | Lightweight passkey integration with full fallback support. |

::: tip Future improvement
RPs may provide passkey requirements via `login_hint` (e.g., "device-bound") and MobileID could use this to restrict passkey choices to a specific subset of the user's available passkeys.
:::

## Passkey Error Codes

In addition to the existing [error codes](/oidc-integration-guide/getting-started#error-code-table), the following errors are specific to passkey authentication:

| OIDC Error | Code | Description | RP Action |
|------------|------|-------------|-----------|
| `invalid_request` | `mid_req_1140` | Invalid keyring ID in `login_hint` | Provide the keyring ID in the correct format. |
| `invalid_request` | `mid_req_1150` | AL4 passkey requested but keyring ID is empty in `login_hint` | Add valid keyring ID in `login_hint`. |
| `access_denied` | `mid_auth_3500` | Passkey keyring mismatch | Instruct user to use a valid passkey matching the keyring ID. |
| `access_denied` | `mid_auth_3900` | Authentication failed for other reasons (may include passkey validation failure) | Check if passkey validation failed; allow retry. |

## Backward Compatibility

MobileID Passkey support is fully backward-compatible:

- If an RP **ignores all passkey-related parameters** or the client account has `passkeys_enabled:false` (the default), the runtime behavior is **identical to the current release**.
- The `passkeys_enabled` feature flag is managed per `client_id` on the MobileID server. Contact Swisscom to enable passkeys for your account.
- Existing scopes, ACR values, and login_hint formats continue to work unchanged.

## Enabling Passkeys

To enable MobileID Passkeys for your OIDC client:

1. Contact your Swisscom commercial contact or reach out to **Backoffice.Security@swisscom.com**.
2. Update your authorization requests to include passkey-related parameters as documented above.

::: tip
Start with `mid_al2_any` (passkey-preferred with fallback) for the smoothest user experience, then consider moving to `mid_al4_passkey` (passkey-only) once your users have registered their passkeys.
:::

<style>
.table-scroll {
  overflow-x: auto;
  margin-bottom: 16px;
}

.icon-legend {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  padding: 10px 14px;
  margin-bottom: 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  font-size: 0.9em;
  background-color: var(--vp-c-bg-soft);
}

.icon-legend span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.acr-table,
.amr-table {
  width: auto;
  border-collapse: collapse;
  font-size: 0.9em;
  margin-bottom: 20px;
}

.acr-table th,
.acr-table td,
.amr-table th,
.amr-table td {
  border: 1px solid var(--vp-c-divider);
  padding: 8px 10px;
  vertical-align: middle;
}

.acr-table thead th,
.amr-table thead th {
  background-color: var(--vp-c-bg-soft);
  font-weight: 600;
  vertical-align: bottom;
}

.acr-table thead th.col-icon,
.amr-table thead th.col-icon {
  text-align: center;
}

.acr-table thead th img,
.amr-table thead th img {
  display: block;
  margin: 0 auto 4px auto;
  height: 22px;
  object-fit: contain;
}

.col-icon {
  text-align: center;
  white-space: nowrap;
  width: 1%;
  padding: 6px 8px;
}

.col-acr {
  white-space: nowrap;
}

.acr-table td img,
.amr-table td img {
  vertical-align: middle;
  display: inline-block;
}
</style>
