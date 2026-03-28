---
title: "Mobile ID and Microsoft Entra ID: Stronger MFA with External Authentication"
date: 2026-03-27
author: Mobile ID Team
description: "Microsoft Entra External MFA is now generally available. Learn how Mobile ID integrates as a trusted external MFA provider, bringing SIM-based, app-based and passkey authentication to your Entra ID environment."
thumbnail: /release-notes/img/entra-eam-thumb.png
lang: en
readingTime: 10
layout: release-notes-post
---

<script setup>
import EntraIntegrationFlow from '../../.vitepress/theme/components/EntraIntegrationFlow.vue'
import EntraUseCaseCards from '../../.vitepress/theme/components/EntraUseCaseCards.vue'
import EntraMigrationTimeline from '../../.vitepress/theme/components/EntraMigrationTimeline.vue'
import LanguageSwitcher from '../../.vitepress/theme/components/LanguageSwitcher.vue'
</script>

<LanguageSwitcher />

<div class="blog-lead">
Microsoft Entra ID is the identity backbone for millions of organizations worldwide. With <strong>External MFA now generally available</strong>, enterprises can integrate a trusted third-party authentication provider directly into their Entra ID environment — without giving up centralized policy control. Mobile ID, operated by Swisscom, brings <a href="/rest-api-guide/introduction#mobile-id-sim---method">hardware-grade SIM authentication</a>, <a href="/rest-api-guide/introduction#mobile-id-app---method">app-based push with geofencing</a>, and <a href="/oidc-integration-guide/passkey-authentication">phishing-resistant passkeys</a> to every Entra ID login.
</div>

## What Is Microsoft Entra External MFA?

Microsoft Entra ID has long been the central identity and access management platform for enterprises using Microsoft 365, Azure and thousands of connected applications. When users sign in, Entra ID evaluates **Conditional Access policies** to decide whether additional verification is needed — and if so, which method to use.

Microsoft Entra ID already offers several built-in MFA methods — including Authenticator app, FIDO2 security keys, SMS and phone calls. For organizations that needed to integrate a **third-party authentication provider**, however, the only option was a legacy mechanism called **Custom Controls**. Custom Controls allowed redirecting users to an external provider, but with significant limitations: the external authentication was not fully recognized as MFA by Entra ID, limiting its use in Conditional Access policies and grant controls.

**External MFA** changes this fundamentally. Launched in public preview in May 2024 and [generally available since March 2026](https://techcommunity.microsoft.com/blog/microsoft-entra-blog/external-mfa-in-microsoft-entra-id-is-now-generally-available/4488926), External MFA allows an external provider to be registered as a fully recognized multifactor authentication method. The key difference: Entra ID treats the external MFA response exactly like its built-in methods. It satisfies Conditional Access MFA requirements, works with sign-in frequency policies, and integrates into the standard authentication flow.

The integration is based on **OpenID Connect (OIDC)**, meaning it uses an open, standards-compliant protocol rather than proprietary APIs. For enterprises, this means no vendor lock-in and predictable integration patterns.

::: info
External MFA replaces Custom Controls, which Microsoft plans to [deprecate on September 30, 2026](https://learn.microsoft.com/en-us/entra/identity/authentication/how-to-authentication-external-method-manage). Organizations still using Custom Controls should plan their migration now.
:::

## How Does External MFA Work?

The authentication flow is straightforward and transparent to the end user. When a user signs in to a protected application, Entra ID evaluates the Conditional Access policy. If MFA is required and Mobile ID is configured as the external MFA provider, the user is redirected via OIDC to Mobile ID for authentication. After successful verification, the user returns to Entra ID with a valid MFA claim and gains access.

<EntraIntegrationFlow />

Entra ID remains the **identity control plane** throughout the process. It handles policy evaluation, access decisions, token issuance and session management. Mobile ID handles the authentication itself — the part where the user proves their identity through a second factor.

This architecture gives enterprises the best of both worlds: Microsoft's policy engine and governance capabilities, combined with Mobile ID's specialized authentication methods and Swiss-operated infrastructure.

## Why Mobile ID as Your External MFA Provider?

Not all MFA providers are created equal. While many offer app-based push notifications, Mobile ID provides a unique combination of authentication methods that covers scenarios other providers cannot address.

### SIM-Based Authentication: No App Required

Mobile ID's [SIM method](/rest-api-guide/introduction#mobile-id-sim---method) uses the SIM card (or eSIM) as a tamper-proof hardware token, certified at **EAL5+** (ISO/IEC 15408). Over 6 million Swiss SIM cards from Swisscom, Sunrise and Salt are Mobile ID enabled.

This matters for Entra ID deployments because it means MFA works on **any mobile device** — including basic phones without a smartphone operating system. There is no app to install, no app store dependency, and no need for a data connection during authentication. For organizations with field workers, industrial environments, or employees who do not carry smartphones, this is a critical differentiator.

The two factors: the physical SIM card (possession) and the personal Mobile ID PIN (knowledge). Authentication runs over a separate encrypted channel, independent of the internet connection.

### App-Based Authentication: Beyond Simple Push

The [Mobile ID App](/rest-api-guide/introduction#mobile-id-app---method) (iOS and Android) goes well beyond standard push notifications:

- **Biometric confirmation** — authenticate with fingerprint or face recognition
- **[Geofencing](/oidc-integration-guide/getting-started#authentication-context-class-reference-acr)** — restrict authentication to specific geographic areas, with jailbreak and GPS spoofing detection
- **Number matching** — the user confirms a number displayed on screen, preventing MFA fatigue attacks
- **[Transaction signing](/oidc-integration-guide/message-formats)** — display transaction details (e.g. "Confirm the transfer of CHF 1,000 to account XY") for explicit user consent

The app is built on technology from Futurae (ETH Zurich spin-off) and uses the device's Trusted Execution Environment (TEE) for key storage.

### Passkey Authentication: Phishing-Resistant Login

Mobile ID also supports [FIDO2 passkeys](/oidc-integration-guide/passkey-authentication) for phishing-resistant authentication. Passkeys are cryptographically bound to the domain, making them immune to URL spoofing attacks. Users register their passkeys centrally on [mobileid.ch](https://mobileid.ch/login) and can use them across all connected relying parties.

For a detailed look at passkeys and their role in the Mobile ID ecosystem, see the companion article: [Mobile ID Passkeys: Phishing-Resistant Authentication for Browser Scenarios](/release-notes/posts/2026-03-30-mobile-id-passkeys).

### Swiss Operation and Data Residency

Mobile ID is operated by Swisscom from Switzerland. For organizations with data residency requirements or those preferring a European-operated security service, this provides assurance that authentication data stays within Swiss jurisdiction.

<!-- Infographic removed pending factual review: the original NotebookLM-generated graphic
     incorrectly portrayed Microsoft Authenticator as Push/TOTP-only, omitting its passkey support.
     Replace with a manually verified graphic before publishing. -->

## Enterprise Use Cases

External MFA with Mobile ID addresses a wide range of enterprise scenarios. The choice of authentication method — SIM, App, or Passkey — depends on the specific security requirements and user context.

<EntraUseCaseCards />

### Microsoft 365 MFA for Employees

The most common scenario: securing access to Outlook, Teams, SharePoint and other Microsoft 365 applications. When a Conditional Access policy requires MFA, employees authenticate through Mobile ID instead of (or in addition to) Microsoft Authenticator.

This is particularly valuable for organizations that want a **single MFA provider across all applications** — not just Microsoft services. Since Mobile ID uses [standard OIDC](/oidc-integration-guide/introduction), the same authentication methods work for Entra ID, custom web applications, VPN access and more.

### VPN and Remote Access

For VPN gateways, Citrix environments, VDI sessions and remote desktop access, Mobile ID provides MFA through the [RADIUS Interface Gateway](/radius-interface-gateway-guide/introduction) or directly via OIDC. The SIM method is especially suited here: it works reliably even in environments where app-based authentication is impractical — for example, when a remote desktop session blocks Bluetooth communication with a security key.

### Privileged Access Management

Admin accounts and access to sensitive systems demand the highest security levels. Entra ID Conditional Access policies can target specific admin roles and sensitive applications to require External MFA via Mobile ID. On the Mobile ID side, the Relying Party can then leverage [granular ACR values](/oidc-integration-guide/getting-started#authentication-context-class-reference-acr) to enforce specific authentication methods — for example requiring App authentication with geofencing or transaction signing. This way, Entra ID controls *when* MFA is required, while Mobile ID controls *how* the user authenticates.

### Hybrid and Field Workforce

Not every employee carries a smartphone. Field workers, production staff, or employees in regulated environments may only have a basic mobile phone. With Mobile ID SIM, these users get strong MFA without any app installation. Office-based staff can use the Mobile ID App with biometrics for a smoother experience. One provider, every device covered.

<div class="blog-infographic">
  <img src="/release-notes/media/infografik-entra-use-cases.jpg" alt="Enterprise use cases for Mobile ID as External MFA in Microsoft Entra ID: Microsoft 365, VPN, privileged access, and hybrid workforce scenarios" />
</div>

## The Migration Path: From Custom Controls to External MFA

Microsoft has set a clear timeline. Organizations currently using Custom Controls for third-party MFA should migrate to External MFA before the deprecation deadline.

<EntraMigrationTimeline />

The migration can happen gradually. Microsoft supports running Custom Controls and External MFA **in parallel** during the transition period. The recommended approach:

1. **Configure Mobile ID as an External MFA method** in the Entra admin center using the [configuration guide](/oidc-integration-guide/cloud-integration-guide#microsoft-entra-id)
2. **Create a parallel Conditional Access policy** targeting a test group of users
3. **Validate the authentication flow** with the test group
4. **Expand to all users** and disable the legacy Custom Controls policy

::: tip
If you are new to Mobile ID and considering it as your External MFA provider, Swisscom handles the [client onboarding](/oidc-integration-guide/getting-started) process. You will receive the Application ID, Client ID and Discovery URL needed to configure External MFA in Entra ID.
:::

## How to Get Started

Setting up Mobile ID as an External MFA provider in Entra ID requires three things:

1. **A completed Mobile ID onboarding** — contact Swisscom to receive your integration credentials ([getting started](/oidc-integration-guide/getting-started))
2. **Entra ID P1 or P2 subscription** — with Conditional Access and licenses for targeted users
3. **An Entra ID admin account** — Global Administrator or Privileged Role Administrator for the initial setup

The step-by-step configuration process is documented in the [Cloud Integration Guide](/oidc-integration-guide/cloud-integration-guide#microsoft-entra-id), including Conditional Access policy setup, admin consent, and optional steps to prioritize Mobile ID over Microsoft Authenticator.

<div class="blog-infographic">
  <img src="/release-notes/media/infografik-entra-integration-flow.jpg" alt="Mobile ID integration architecture with Microsoft Entra ID: OIDC-based authentication flow showing policy evaluation, external MFA, and access control" />
</div>

## Conclusion: Enterprise MFA Without Compromise

With External MFA now generally available in Microsoft Entra ID, organizations no longer need to choose between centralized identity management and specialized authentication. Entra ID remains the policy engine. Mobile ID delivers the authentication — through SIM, App, or Passkey, depending on what the use case demands.

For enterprises, this means:

- **One MFA provider** for Entra ID, web applications, VPN and RADIUS environments
- **Every device covered** — from smartphones to basic phones, from desktops to kiosk terminals
- **Swiss-operated** infrastructure with standards-based OIDC integration
- **Future-proof** — External MFA replaces the deprecated Custom Controls, and Mobile ID continues to evolve with new capabilities like the [Passkey Vault](/release-notes/posts/2026-03-30-mobile-id-passkeys#roadmap-the-mobile-id-passkey-vault)

**The right authentication method for every scenario. Seamlessly integrated into Microsoft Entra ID.**

To discuss your use case or start the onboarding process, contact us via [swisscom.ch/mobileid](https://www.swisscom.ch/mobileid).
