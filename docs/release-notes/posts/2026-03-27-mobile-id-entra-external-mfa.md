---
title: "Mobile ID and Microsoft Entra ID: Stronger MFA with External Authentication"
date: 2026-03-27
author: Mobile ID Team
description: "Microsoft Entra External MFA is now generally available. Learn how Mobile ID integrates as a trusted external MFA provider, bringing SIM-based and app-based authentication to your Entra ID environment."
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
Microsoft Entra ID is the identity platform behind millions of enterprise environments. With <strong>External MFA now generally available</strong>, organizations can plug a trusted third-party authentication provider into Entra ID while keeping full control over Conditional Access policies. Mobile ID, operated by Swisscom, adds <a href="/rest-api-guide/introduction#mobile-id-sim---method">hardware-grade SIM authentication</a> and <a href="/rest-api-guide/introduction#mobile-id-app---method">app-based push with geofencing</a> to Entra ID logins that require MFA.
</div>

## What Is Microsoft Entra External MFA?

Microsoft Entra ID is the central identity and access management platform for enterprises using Microsoft 365, Azure and thousands of connected applications. When users sign in, Entra ID evaluates **Conditional Access policies** to decide whether additional verification is needed and which method to use.

Entra ID already ships with several built-in MFA methods: Authenticator app, FIDO2 security keys, SMS and phone calls. For organizations that needed to bring in a **third-party authentication provider**, the only option was a legacy mechanism called **Custom Controls**. Custom Controls allowed redirecting users to an external provider, but with significant limitations. The external authentication was not fully recognized as MFA by Entra ID, which limited its use in Conditional Access policies and grant controls.

**External MFA** changes this. Launched in public preview in May 2024 and [generally available since March 2026](https://techcommunity.microsoft.com/blog/microsoft-entra-blog/external-mfa-in-microsoft-entra-id-is-now-generally-available/4488926), External MFA lets an external provider register as a fully recognized multifactor authentication method. Entra ID treats the external MFA response exactly like its built-in methods: it satisfies Conditional Access MFA requirements, works with sign-in frequency policies, and plugs into the standard authentication flow.

The integration uses **OpenID Connect (OIDC)**, an open, standards-compliant protocol. No proprietary APIs, no vendor lock-in.

::: info
External MFA replaces Custom Controls, which Microsoft plans to [deprecate on September 30, 2026](https://learn.microsoft.com/en-us/entra/identity/authentication/how-to-authentication-external-method-manage). Organizations still using Custom Controls should plan their migration now.
:::

## How Does External MFA Work?

The flow is transparent to the end user. When someone signs in to a protected application, Entra ID evaluates the Conditional Access policy. If MFA is required and Mobile ID is configured as the external provider, the user is redirected via OIDC to Mobile ID for authentication. After successful verification, the user returns to Entra ID with a valid MFA claim and gains access.

<EntraIntegrationFlow />

Entra ID remains the **identity control plane** throughout the process: policy evaluation, access decisions, token issuance and session management. Mobile ID handles the authentication step itself, where the user proves their identity through a second factor.

The result is a clean separation of concerns. Microsoft's policy engine and governance capabilities on one side, Mobile ID's specialized authentication methods and Swiss-operated infrastructure on the other.

## Why Mobile ID as Your External MFA Provider?

Most external MFA providers offer app-based push notifications. Mobile ID goes further with a combination of authentication methods that covers scenarios other providers simply cannot address.

### SIM-Based Authentication: No App Required

Mobile ID's [SIM method](/rest-api-guide/introduction#mobile-id-sim---method) uses the SIM card (or eSIM) as a tamper-proof hardware token, certified at **EAL5+** (ISO/IEC 15408). Over 6 million Swiss SIM cards from Swisscom, Sunrise and Salt are Mobile ID enabled.

For Entra ID deployments, this means MFA works on **any mobile device**, including basic phones without a smartphone operating system. No app to install, no app store dependency, no data connection needed during authentication. For organizations with field workers, industrial environments, or employees who do not carry smartphones, this is a critical differentiator.

The two factors are the physical SIM card (possession) and the personal Mobile ID PIN (knowledge). Authentication runs over a separate encrypted channel, independent of the internet connection.

### App-Based Authentication: Beyond Simple Push

The [Mobile ID App](/rest-api-guide/introduction#mobile-id-app---method) for iOS and Android goes well beyond standard push notifications. Users can authenticate with fingerprint or face recognition. [Geofencing](/oidc-integration-guide/getting-started#authentication-context-class-reference-acr) restricts authentication to specific geographic areas, with built-in jailbreak and GPS spoofing detection. Number matching lets the user confirm a code displayed on screen, which prevents MFA fatigue attacks. And [transaction signing](/oidc-integration-guide/message-formats) displays the details of a transaction directly on the device (e.g. "Confirm the transfer of CHF 1,000 to account XY") so the user gives explicit consent.

The app is built on technology from Futurae, an ETH Zurich spin-off, and stores keys in the device's Trusted Execution Environment (TEE).

### Passkey Authentication: Phishing-Resistant Login

Beyond SIM and App, Mobile ID supports [FIDO2 passkeys](/oidc-integration-guide/passkey-authentication) for phishing-resistant authentication across its OIDC ecosystem. Passkeys are cryptographically bound to the domain, which makes them immune to URL spoofing. Users register their passkeys once on [mobileid.ch](https://mobileid.ch/login) and can use them across all connected relying parties.

::: info
Passkeys are a general Mobile ID capability available through the standard OIDC integration. In the Entra ID External MFA context, SIM and App are the primary authentication methods. For details on passkeys and their role in the broader Mobile ID ecosystem, see the companion article: [Mobile ID Passkeys: Phishing-Resistant Authentication for Browser Scenarios](/release-notes/posts/2026-03-30-mobile-id-passkeys).
:::

### Swiss Operation and Data Residency

Mobile ID is operated by Swisscom from Switzerland. Organizations with data residency requirements or a preference for European-operated security services can be confident that authentication data stays within Swiss jurisdiction.

<!-- Infographic removed pending factual review: the original NotebookLM-generated graphic
     incorrectly portrayed Microsoft Authenticator as Push/TOTP-only, omitting its passkey support.
     Replace with a manually verified graphic before publishing. -->

## Enterprise Use Cases

External MFA with Mobile ID addresses a wide range of enterprise scenarios. Which authentication method fits best (SIM or App) depends on the security requirements and the user context.

<EntraUseCaseCards />

### Microsoft 365 MFA for Employees

The most common scenario: securing access to Outlook, Teams, SharePoint and other Microsoft 365 applications. When a Conditional Access policy requires MFA, employees authenticate through Mobile ID instead of, or alongside, Microsoft Authenticator.

This is particularly valuable for organizations that want a **single MFA provider across all applications**, not just Microsoft services. Since Mobile ID uses [standard OIDC](/oidc-integration-guide/introduction), the same authentication methods work for Entra ID, custom web applications, VPN access and more.

### VPN and Remote Access

For VPN gateways, Citrix environments, VDI sessions and remote desktop access, Mobile ID provides MFA through the [RADIUS Interface Gateway](/radius-interface-gateway-guide/introduction) or directly via OIDC. The SIM method is especially suited here because it works reliably even in environments where app-based authentication is impractical. A remote desktop session, for instance, often blocks Bluetooth communication with a security key.

### Privileged Access Management

Admin accounts and access to sensitive systems require the highest level of assurance. Entra ID Conditional Access policies can target specific admin roles and sensitive applications to require External MFA via Mobile ID. Mobile ID then authenticates the user with its available methods. For organizations that also use Mobile ID outside the Entra context (e.g. for web applications or VPN), [granular ACR values](/oidc-integration-guide/getting-started#authentication-context-class-reference-acr) in the OIDC authorization request allow the Relying Party to enforce specific methods such as App with geofencing or transaction signing.

### Hybrid and Field Workforce

Not every employee carries a smartphone. Field workers, production staff, or employees in regulated environments may only have a basic mobile phone. With Mobile ID SIM, these users get strong MFA without any app installation. Office-based staff can use the Mobile ID App with biometrics for a smoother experience. One provider covers every device type.

<div class="blog-infographic">
  <img src="/release-notes/media/infografik-entra-use-cases.jpg" alt="Enterprise use cases for Mobile ID as External MFA in Microsoft Entra ID: Microsoft 365, VPN, privileged access, and hybrid workforce scenarios" />
</div>

## The Migration Path: From Custom Controls to External MFA

Microsoft has set a clear timeline. Organizations still using Custom Controls for third-party MFA should migrate to External MFA before the deprecation deadline.

<EntraMigrationTimeline />

The migration can happen gradually. Microsoft supports running Custom Controls and External MFA **in parallel** during the transition period. A recommended approach:

1. Configure Mobile ID as an External MFA method in the Entra admin center using the [configuration guide](/oidc-integration-guide/cloud-integration-guide#microsoft-entra-id)
2. Create a parallel Conditional Access policy targeting a test group of users
3. Validate the authentication flow with the test group
4. Expand to all users and disable the legacy Custom Controls policy

::: tip
If you are new to Mobile ID and considering it as your External MFA provider, Swisscom handles the [client onboarding](/oidc-integration-guide/getting-started) process. You will receive the Application ID, Client ID and Discovery URL needed to configure External MFA in Entra ID.
:::

## How to Get Started

Setting up Mobile ID as an External MFA provider in Entra ID requires three things:

1. **A completed Mobile ID onboarding.** Contact Swisscom to receive your integration credentials ([getting started](/oidc-integration-guide/getting-started)).
2. **An Entra ID P1 or P2 subscription** with Conditional Access enabled and licenses assigned to the targeted users.
3. **An Entra ID admin account** with Global Administrator or Privileged Role Administrator role for the initial setup.

The step-by-step configuration is documented in the [Cloud Integration Guide](/oidc-integration-guide/cloud-integration-guide#microsoft-entra-id), including Conditional Access policy setup, admin consent, and optional steps to prioritize Mobile ID over Microsoft Authenticator.

<div class="blog-infographic">
  <img src="/release-notes/media/infografik-entra-integration-flow.jpg" alt="Mobile ID integration architecture with Microsoft Entra ID: OIDC-based authentication flow showing policy evaluation, external MFA, and access control" />
</div>

## Conclusion

With External MFA now generally available in Microsoft Entra ID, organizations no longer have to choose between centralized identity management and specialized authentication. Entra ID stays the policy engine. Mobile ID delivers the second factor, through SIM or App, depending on the use case.

What this means in practice: one MFA provider for Entra ID, web applications, VPN and RADIUS environments. Every device type covered, from smartphones to basic phones. Swiss-operated infrastructure with standards-based OIDC integration. And a future-proof path, since External MFA replaces the deprecated Custom Controls and Mobile ID continues to evolve with new capabilities like the [Passkey Vault](/release-notes/posts/2026-03-30-mobile-id-passkeys#roadmap-the-mobile-id-passkey-vault).

For questions about Mobile ID integrations, reach out to [Backoffice.Security@swisscom.com](mailto:Backoffice.Security@swisscom.com). For general information about the service, visit [mobileid.ch](https://www.mobileid.ch/en).
