---
title: "Mobile ID Passkeys: Phishing-Resistant Authentication for Browser Scenarios"
date: 2026-03-23
author: Mobile ID Team
description: "Passkeys enable phishing-resistant logins via biometrics in under 3 seconds. Mobile ID integrates them natively into the OIDC ecosystem and shows why SIM and App remain indispensable."
thumbnail: /release-notes/img/passkeys-thumb.png
lang: en
readingTime: 12
layout: release-notes-post
---

<script setup>
import ComparisonTable from '../../.vitepress/theme/components/ComparisonTable.vue'
import AcrLevels from '../../.vitepress/theme/components/AcrLevels.vue'
import PasskeyRegistrationFlow from '../../.vitepress/theme/components/PasskeyRegistrationFlow.vue'
import PasskeyLoginFlow from '../../.vitepress/theme/components/PasskeyLoginFlow.vue'
import SzenarienMatrix from '../../.vitepress/theme/components/SzenarienMatrix.vue'
import PasskeyTypesCards from '../../.vitepress/theme/components/PasskeyTypesCards.vue'
import HybridAuthFlow from '../../.vitepress/theme/components/HybridAuthFlow.vue'
import HybridAuthComparisonTable from '../../.vitepress/theme/components/HybridAuthComparisonTable.vue'
import PasskeyVaultRoadmap from '../../.vitepress/theme/components/PasskeyVaultRoadmap.vue'
import LanguageSwitcher from '../../.vitepress/theme/components/LanguageSwitcher.vue'
import ScreenshotStep from '../../.vitepress/theme/components/ScreenshotStep.vue'
</script>

<LanguageSwitcher />

<div class="blog-lead">
Microsoft blocks roughly 7,000 password attacks per second every day, and 47% of consumers abandon a purchase when they forget their password. In a world where phishing remains the most common attack vector, a fundamentally new answer is needed. <strong>Passkeys</strong> are that answer. Mobile ID now integrates them natively into its OIDC ecosystem and combines them with the proven strengths of SIM and App.
</div>

<div class="blog-infographic">
  <img src="/release-notes/media/infografik-overview.webp" alt="Mobile ID Passkeys: ecosystem overview with centralized Passkey management and OIDC integration" />
</div>

## NIST AAL: The Reference Framework for Security Levels

Before examining each method in detail, a shared understanding of security levels is essential. The NIST standard SP 800-63B defines three Authenticator Assurance Levels (AAL), which serve as the reference framework in regulated industries such as banking, healthcare and government.

**AAL1** requires only single-factor authentication. Passwords, SMS OTPs or simple tokens satisfy this level. The security level is low.

**AAL2** requires two different factors. In addition, a phishing-resistant option must be offered for online services. Cloud-synced Passkeys, TOTP generators, Mobile Push (such as Mobile ID SIM or App) and multi-factor OTP devices meet AAL2.

**AAL3** is the highest level. It requires public-key cryptography, a hardware module validated to FIPS 140 Level 2 or higher, phishing-resistant methods and a non-exportable private key. Re-authentication after 15 minutes of inactivity is also required. Only a few authenticators fully meet these requirements: FIPS-certified security keys (e.g. YubiKey 5 FIPS Series), certain smartcards and hardware security modules.

## What Are Passkeys?

Passkeys are a user-friendly implementation of the FIDO2 standard and the WebAuthn API. They replace passwords with cryptographic key pairs and enable login via biometrics in under 3 seconds. The core principle: the private key never leaves the user's device. Instead, the authenticator signs a challenge that the server verifies with the public key.

What makes Passkeys special is origin binding: the key is cryptographically bound to the domain of the service. Even if a user lands on a perfectly replicated phishing site, authentication fails because the browser detects the wrong domain and refuses to release the key.

<ComparisonTable />

## Passkey Types: Convenience vs. Maximum Security

Not all Passkeys are created equal. Different types are used depending on the level of protection required. The choice directly affects the achievable security level.

### Cloud-Synced Passkeys

Cloud-synced Passkeys are synchronized via the platform provider's cloud infrastructure: Apple iCloud Keychain, Google Password Manager or third-party managers such as 1Password. In mainstream consumer ecosystems, cloud synchronization has become the default user experience because it maximizes recovery and cross-device convenience.

The major advantage: Passkeys are available across all devices within the same ecosystem. If a device is lost, access is retained through other devices. Synchronization uses end-to-end encryption. Cloud-synced Passkeys can also be shared with family members or friends, which also means they can end up on untrusted devices.

Security level: **AAL2**. Since the keys are exportable and reside in cloud infrastructures (which are subject to the US CLOUD Act), they do not meet the requirements for AAL3.

### Device-Bound Passkeys

With device-bound Passkeys, the private key never leaves the security hardware. Typical examples are FIPS-certified security keys such as the YubiKey 5 FIPS Series (FIPS 140-2 Cert #3907, approx. CHF 100 at Digitec). These offer the highest security and are AAL3-compliant.

Important to know: standard YubiKeys (without FIPS certification) are not sufficient for AAL3. In September 2024, a severe vulnerability was also discovered in the YubiKey 5 Series that cannot be fixed via firmware update but requires a physical replacement of the token. This illustrates a fundamental problem with physical tokens: security flaws can be expensive and cumbersome to resolve.

Security level: **AAL3** (only with FIPS 140-2 certification and firmware 5.7 or newer).

### Platform Authenticators

Platform authenticators are security modules built directly into the device, such as Windows Hello (TPM), Apple Touch ID/Face ID (Secure Enclave) or the Titan M2 chip in Google Pixel devices. Depending on configuration, they can function as cloud-synced or device-bound.

AAL3 is only achievable if the key is not synchronized to the cloud and the hardware component is FIPS-validated. In practice, this requires a device-bound configuration or an external authenticator that keeps the private key outside a cloud-synced credential store.

### 3rd-Party Passkey Providers

Since iOS 17 and Android 14, third-party providers can register as Passkey providers. The Credential Manager API (Android) and AuthenticationServices (iOS) allow authentication apps to create and manage Passkeys without relying on the system's built-in Passkey store.

This is the technical foundation for the planned Mobile ID Passkey Vault: the Mobile ID App itself becomes a Passkey provider and can manage device-bound Passkeys at AAL3 level, without requiring physical hardware tokens.

<div class="blog-infographic">
  <img src="/release-notes/media/infografik-passkey-typen.webp" alt="Passkey types compared by security level: Cloud-Synced, Device-Bound and Platform Authenticators" />
</div>

<PasskeyTypesCards />

## Passkey Integration: Simple for Users, Complex for Enterprises

Passkeys promise a simple user experience. The technical reality behind the scenes, however, is demanding. A complete Passkey infrastructure requires:

A **WebAuthn backend** with FIDO2 server library, attestation validation, credential management and secure key storage. A **credential lifecycle management** system for registration, deactivation, recovery and managing multiple Passkeys per user. **Fallback mechanisms** for users without a Passkey-capable device or when authentication fails. **Compliance checks** for regulated industries, including AAGUID validation against the FIDO Metadata Service (MDS) database and FIPS certification verification.

Mobile ID resolves this complexity: Relying Parties do not integrate the Passkey infrastructure themselves but rather the Mobile ID OIDC Service. Passkey registration and management takes place centrally on mobileid.ch. A Passkey is registered once and can then be used across all connected Relying Parties.

For enterprises, this means a standard OIDC integration with configurable ACR values, automatic fallback to SIM, App or SMS, and the assurance of a partner like Swisscom that uses these solutions itself to protect highly critical infrastructures.

## Security Profile by Usage Context

All Mobile ID methods provide strong authentication. The optimal choice depends on the use case scenario. The key distinction: is this an open browser scenario with a freely chosen URL, or a closed journey?

### Browser Journeys: Open URLs and Phishing Risk

In the browser, the user navigates freely. They can click links in emails, type URLs manually or reach pages via search engines. This is where phishing risk is greatest: attackers can spoof domains and replicate login pages with near-perfect accuracy.

Passkeys offer a systemic advantage in this scenario. Through cryptographic origin binding, the key is firmly tied to the authentic domain. The browser automatically checks whether the requesting domain matches the registered one. A phishing site on `m0bileid.ch` cannot access a Passkey registered for `mobileid.ch`. This makes Passkeys the first choice for pure web logins.

Important: Passkeys are not free from attack vectors either. Malware on the platform, compromised browser extensions or social engineering at the operating system level can affect any method. Passkeys specifically eliminate the URL spoofing problem.

### Closed Journeys: VPN, Remote Desktop, Kiosk, Native Apps

For logins via VPN clients, remote desktop/VDI environments, kiosk terminals, native app-to-app transitions or helpdesk callbacks, other protection mechanisms apply. In these scenarios there is no freely chosen URL. The connection is controlled by the client or the infrastructure. URL spoofing is not an attack vector.

Mobile ID SIM and App provide strong security here through hardware binding (EAL5+), geofencing, number matching and transaction signing. Passkeys are often not usable in many of these scenarios: WebAuthn is a browser technology, and VPN clients or remote desktop sessions (no BLE channel to the authenticator!) frequently do not support them.

### SIM and App Also Usable in the Browser

SIM and App can also be used for browser logins. Not every use case requires maximum phishing resistance in the browser. For many applications, the proven push-based authentication via SIM or App is a pragmatic and secure solution. Mobile ID covers all scenarios with OIDC and REST API.

<div class="blog-infographic">
  <img src="/release-notes/media/infografik-methoden-szenarien.webp" alt="Authentication methods overview: Passkeys, SIM and App compared across scenarios" />
</div>

<SzenarienMatrix />

## Why SIM and App Remain Indispensable

Passkeys are a strong addition for browser scenarios. SIM and App leverage their unique strengths where WebAuthn reaches its limits.

### Mobile ID SIM

The SIM-based method uses the Mobile ID enabled SIM card (or eSIM) as a secure hardware token. Over 6 million Swiss SIM cards from Swisscom, Sunrise, UPC and Salt are Mobile ID enabled. The cryptographic keys are stored directly on the SIM, which is certified under the protection profile **EAL5+** (ISO/IEC 15408) and Evaluation Level E3 (ITSEC).

The SIM method requires no app installation and has no app store dependency. The authentication prompt is displayed as a SIM Toolkit overlay directly on top of the business application. It works on any mobile device, including devices without a smartphone operating system, and over the GSM channel. Via SMS-over-IP and WiFi, the SIM method is also usable when there is no cellular connection.

When switching devices, the user simply moves the SIM. The account remains intact, without re-registration. SIM-based location verification is particularly trustworthy because the position within the mobile network is difficult to manipulate.

### Mobile ID App

The Mobile ID App (iOS and Android) offers, alongside biometric authentication, a broad range of additional capabilities that cannot be replicated with Passkeys:

**Push-based authentication** with biometrics or passcode as the second factor. **Geofencing** with GPS-based location determination and built-in jailbreak and mock service detection, making GPS spoofing more difficult. **Number matching**, where the user confirms a number displayed on screen within the app. **Transaction signing**, which displays transaction details (e.g. "Confirm the transfer of CHF 1,000 to account XY") directly on the device and requires the user's explicit consent. App-to-app transitions enable automated switching between the business application and the Mobile ID App and back in banking scenarios.

The app is based on technology from Futurae (ETH Zurich spin-off) and uses the device's Trusted Execution Environment (TEE). It is available worldwide in approved countries via the App Store.

## Passkeys-Plus: The Hybrid Auth Flow for Near AAL3

NIST AAL3 is an extremely high security standard. True AAL3 requires, among other things, a FIPS 140-2 validated hardware module, which depends on the specific device configuration. For highly critical systems, Swisscom already uses the **Passkeys-Plus** model internally, which targets a very high security level.

The approach combines two already existing components into a Hybrid Auth Flow:

**Step 1: Cloud-Sync Passkey (AAL2).** The user authenticates in the browser with a Passkey. This provides broad ecosystem support and phishing-resistant origin binding.

**Step 2: Mobile ID Push Step-Up.** The user then receives a push notification on their smartphone. Mobile ID Push uses public-key cryptography with non-exportable, device-bound keys. The user confirms with biometrics or passcode. Geoblocking and user consent display are optionally added.

The combination delivers: origin-bound login plus device-bound, non-exportable key plus explicit user consent plus geolocation. This can reach AAL3 in deployments where the second factor runs on suitable FIPS 140-2 certified hardware. Whether it is recognized as full AAL3 in every regulatory context must still be assessed per use case, hardware basis and compliance framework. Broader FIPS-validated cryptography and device attestation coverage in the Mobile ID Push step will only be fully available after future enhancements.

The push step remains on the smartphone. On desktop, the user authenticates locally with the Passkey, and the step-up occurs out-of-band via the phone.

<HybridAuthComparisonTable lang="en" />

<div class="blog-infographic">
  <img src="/release-notes/media/infografik-hybrid-auth.webp" alt="Hybrid authentication for NIST AAL3: Cloud-Sync Passkey combined with Mobile ID Push Step-Up" />
</div>

<HybridAuthFlow />

## Mobile ID Authentication Levels: Granular Control via ACR Values

Alongside the NIST AAL framework described above, Mobile ID defines its own Authentication Levels (AL2–AL4) as ACR values in the OIDC Authorization Request. These levels control which authentication methods are permitted for a given login and should not be confused with NIST AAL1–AAL3. The full ACR matrix is documented in the [OIDC Integration Guide](/oidc-integration-guide/getting-started#authentication-context-class-reference-acr).

<AcrLevels />

In `mid_al4_passkey` mode, a Passkey-only authentication is enforced, guaranteeing true phishing resistance without weak fallbacks. For maximum flexibility, `mid_al2_any` allows all available methods including SMS. With `mid_al4_any`, Passkey authentication is preferred with a fallback to SIM or App.

While most providers offer Passkeys only as a simple password replacement with insecure recovery paths (Google, PayPal, GitHub and even SBB allow OTP email as a fallback), Mobile ID enables the enforcement of strict security policies and the restriction to FIPS-certified authenticators via AAGUID validation against the FIDO Metadata Service database.

## Registration and Login Flows

The technical rollout is straightforward for Relying Parties.

### Centralized Registration on mobileid.ch

Users manage their Passkeys via the MyMobileID Dashboard on mobileid.ch/login. There they can add new keys, edit existing ones or delete them. The Passkeys are stored on the domain m.mobileid.ch and are subsequently available across all connected Relying Parties.

The registration process:

1. Login on mobileid.ch (verification via SMS OTP to confirm the mobile number)
2. Select the "Mobile ID Passkey" tile on the dashboard and click "MANAGE PASSKEYS"

<ScreenshotStep img="/release-notes/media/mymobileid-dashboard-manage-passkeys-tile.png" alt="MyMobileID Dashboard: Mobile ID Passkey tile with MANAGE PASSKEYS button">
<p><strong>3.</strong> Select "Add a passkey". The native browser dialog appears (Touch ID, Face ID or Security Key).</p>
<p><strong>4.</strong> Biometric confirmation or PIN entry on the authenticator.</p>
</ScreenshotStep>

<ScreenshotStep img="/release-notes/media/add-a-passkey.png" alt="Add a passkey: native iOS dialog for saving a Passkey on m-lab.mobileid.ch">
<p><strong>5.</strong> The Passkey is registered and receives a unique KeyRingID.</p>
<p>The KeyRingID (e.g. <code>MIDPK5VQ8JV1TGL</code>) is the stable identifier of a Passkey registration. For high-assurance scenarios (AL4), the Relying Party must pass this KeyRingID in the <code>login_hint</code> so that Mobile ID can verify the correct Passkey binding.</p>
</ScreenshotStep>

<ScreenshotStep img="/release-notes/media/passkey-management-list-passkeys.png" alt="Passkey management: list of registered Passkeys with type badges and KeyRingID">
<p>In Passkey management, the user sees all registered Passkeys with type labels: device-bound keys show a star badge, cloud-synced keys show "Synced" and "StepUp" badges. Each entry displays the KeyRingID, the creation date and the last usage.</p>
</ScreenshotStep>

<div class="blog-infographic">
  <img src="/release-notes/media/infografik-flows.webp" alt="Passkey registration and login flows: centralized management and OIDC-based login" />
</div>

<PasskeyRegistrationFlow />

### RP Login via OIDC

When a user clicks "Sign in with Mobile ID" at a Relying Party, an OIDC Authorization Code Flow takes place:

1. The RP redirects the user to Mobile ID, with the desired ACR value in the Authorization Request
2. Mobile ID displays the Passkey authentication page ("Passkey or FIDO2 Security Key")

<ScreenshotStep img="/release-notes/media/sign-in-with-passkey.png" alt="Passkey login: native iOS dialog for authentication with Passkey on mobileid.ch">
<p><strong>3.</strong> The native browser dialog appears: "Sign in to mobileid.ch with your passkey".</p>
<p><strong>4.</strong> The user confirms via biometrics or security key.</p>
<p><strong>5.</strong> Mobile ID validates the assertion and redirects back to the RP with an authorization code.</p>
<p><strong>6.</strong> The RP exchanges the code for an ID token and access token.</p>
</ScreenshotStep>

Depending on the configured ACR value, the appropriate flow is triggered. With `mid_al4_passkey`, only a Passkey is accepted. With `mid_al2_any`, the user can choose between Passkey, SIM, App or SMS. In case of errors or missing Passkeys, the RP can allow a secure fallback to other methods.

When Passkeys are enabled for a client (`passkeys_enabled = true`), the priority order is: Passkey, SIM, App, SMS.

<PasskeyLoginFlow />

## Roadmap: The Mobile ID Passkey Vault

Mobile ID pursues the vision of a sovereign Passkey infrastructure with the Passkey Vault. The Mobile ID App itself becomes a 3rd-party Passkey provider on iOS and Android. Swisscom follows a make-not-buy approach and builds the authenticator in-house.

### Phase 1: Mobile MVP

Device-bound Passkeys on iOS and Android, managed by the Mobile ID App. Combined with Mobile ID Push for the Hybrid Auth Flow. Leveraging the Credential Manager API (Android) and AuthenticationServices (iOS).

### Phase 2: Desktop Extension

Support for macOS, iPadOS and Windows. Cross-device authentication via BLE/NFC, so the Passkey on the smartphone can also be used for desktop logins.

### Phase 3: Swiss Cloud-Synced Passkeys

End-to-end encrypted synchronization service with data residency in Swiss data centers. This eliminates the CLOUD Act risk of US big tech clouds, while providing the same convenience as Apple iCloud Keychain or Google Password Manager.

### Phase 4: Attestation and FIDO MDS

Registration of the Mobile ID App in the FIDO Metadata Service with its own AAGUID. This enables Relying Parties to recognize the Mobile ID App as a trusted authenticator and automatically classify the security level.

The app becomes the one-stop authentication tool: SIM authentication, push-based MFA, Passkey provider and transaction signing in a single application.

<PasskeyVaultRoadmap />

## Conclusion: Everything from a Single Source

With the introduction of Passkeys, Mobile ID solidifies its position as a unique ecosystem that unites all relevant authentication methods under one roof. Passkeys for phishing-resistant browser logins. SIM for the highest hardware security without app installation. App for geofencing, transaction signing and worldwide usability. And with the Hybrid Auth Flow, a solution that achieves near AAL3 level without every user needing to own a hardware token.

Enterprises benefit from a standard OIDC integration, Swiss data residency and the assurance of a partner that uses these solutions itself to protect highly critical infrastructures.

**The customer decides which method best fits their use case. Mobile ID provides the flexibility to make it happen.**

*Mobile ID: the right method for every scenario. Everything from one ecosystem.*
