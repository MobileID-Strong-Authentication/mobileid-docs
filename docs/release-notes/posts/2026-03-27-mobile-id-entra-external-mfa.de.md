---
title: "Mobile ID und Microsoft Entra ID: Stärkere MFA mit External Authentication"
date: 2026-03-27
author: Mobile ID Team
description: "Microsoft Entra External MFA ist allgemein verfügbar. Erfahren Sie, wie Mobile ID als OIDC-basierter External-MFA-Anbieter eingebunden wird und wie SIM, App und Passkeys fachlich zusammenhängen."
thumbnail: /release-notes/img/entra-eam-thumb.png
lang: de
keywords:
  - Microsoft Entra External MFA
  - Mobile ID
  - externer MFA-Anbieter
  - Entra ID MFA
  - Conditional Access
  - SIM-basierte MFA
  - App-basierte MFA
  - Passkeys
  - VPN MFA
readingTime: 10
layout: release-notes-post
---

<script setup>
import EntraIntegrationFlow from '../../.vitepress/theme/components/EntraIntegrationFlow.vue'
import EntraUseCaseCards from '../../.vitepress/theme/components/EntraUseCaseCards.vue'
import EntraMigrationTimeline from '../../.vitepress/theme/components/EntraMigrationTimeline.vue'
import LanguageSwitcher from '../../.vitepress/theme/components/LanguageSwitcher.vue'
import VideoEmbed from '../../.vitepress/theme/components/VideoEmbed.vue'
</script>

<LanguageSwitcher />

<div class="blog-lead">
Microsoft Entra ID ist die Identitätsplattform hinter Millionen von Unternehmensumgebungen. Mit der <strong>allgemeinen Verfügbarkeit von External MFA</strong> können Organisationen einen vertrauenswürdigen externen Authentisierungsanbieter in Entra ID einbinden und behalten dabei die volle Kontrolle über Conditional Access Policies. Mobile ID, betrieben von Swisscom, kombiniert <a href="/rest-api-guide/introduction#mobile-id-sim---method">hardwaregestützte SIM-Authentisierung</a>, <a href="/rest-api-guide/introduction#mobile-id-app---method">App-basiertes Push</a>, gemeinsame Controls wie Number Matching und Transaction Signing, differenzierte Geofencing-Optionen und ein breiteres OIDC-Ecosystem, das inzwischen auch <a href="/oidc-integration-guide/passkey-authentication">Mobile ID Passkeys</a> umfasst. Im Entra-External-MFA-Ablauf konsumiert Entra das Provider-Ergebnis, während Mobile ID das Second-Factor-Erlebnis ausführt.
</div>

<VideoEmbed src="/release-notes/media/entra-external-mfa-explainer.mp4" poster="/release-notes/img/entra-eam-thumb.png">
  Dieses Erklärvideo wurde mit Google NotebookLM basierend auf dem Mobile ID Artikel erstellt.
</VideoEmbed>

## Was ist Microsoft Entra External MFA?

Microsoft Entra ID ist die zentrale Plattform für Identity and Access Management in Unternehmen, die Microsoft 365, Azure und Tausende verbundener Anwendungen nutzen. Bei der Anmeldung wertet Entra ID **Conditional Access Policies** aus, um zu entscheiden, ob eine zusätzliche Verifizierung nötig ist und welche Methode verwendet werden soll.

Entra ID bietet bereits mehrere integrierte MFA-Methoden: Authenticator App, FIDO2 Security Keys, SMS und Telefonanrufe. Für Organisationen, die einen **externen Authentisierungsanbieter** einbinden mussten, war die einzige Option ein Legacy-Mechanismus namens **Custom Controls**. Custom Controls erlaubten die Weiterleitung von Benutzern an einen externen Anbieter, allerdings mit erheblichen Einschränkungen. Die externe Authentisierung wurde von Entra ID nicht vollständig als MFA anerkannt, was die Verwendung in Conditional Access Policies und Grant Controls einschränkte.

**External MFA** ändert das. Seit Mai 2024 in der Public Preview und [seit März 2026 allgemein verfügbar](https://techcommunity.microsoft.com/blog/microsoft-entra-blog/external-mfa-in-microsoft-entra-id-is-now-generally-available/4488926), ermöglicht External MFA einem externen Anbieter, die MFA-Anforderung von Entra ID über eine standardbasierte Provider-Integration zu erfüllen. In der Praxis kann damit der Conditional-Access-Grant-Control **Require multifactor authentication** erfüllt werden, und die Methode wird zusammen mit den übrigen Authentisierungsmethoden in Entra ID verwaltet.

Das macht External MFA aber nicht mit jeder integrierten Entra-Methode identisch. Microsoft unterstützt External MFA derzeit nicht mit Authentication Strengths. Die zentrale Aussage ist präziser: External MFA ist ein unterstützter Weg, die MFA-Anforderung von Entra ID mit einem Drittanbieter zu erfüllen.

Die Integration nutzt **OpenID Connect (OIDC)** zwischen Entra ID und dem externen Anbieter. Für Microsoft Entra External MFA ist das das von Microsoft dokumentierte Provider-Muster und nicht eine Relying Party, die den normalen Authorization Code Flow von Mobile ID verwendet.

::: info
External MFA ersetzt Custom Controls, die Microsoft am [30. September 2026 abkündigen](https://learn.microsoft.com/en-us/entra/identity/authentication/how-to-authentication-external-method-manage) will. Organisationen, die noch Custom Controls verwenden, sollten ihre Migration jetzt planen.
:::

## Wie funktioniert External MFA?

Der Ablauf ist für den Endbenutzer einfach, technisch aber **nicht** identisch mit einer normalen Mobile-ID-Authorization-Code-Integration einer Relying Party. Im External-MFA-Szenario ruft Microsoft Entra ID den OIDC-Authorization-Endpoint des Providers mit seinem External-Provider-Implicit-Flow auf, einschliesslich Parametern wie `response_type=id_token`, `response_mode=form_post` und `id_token_hint`, das Benutzer und Tenant identifiziert.

Mobile ID validiert diesen Entra-Kontext, führt den providerseitigen Second-Factor-Ablauf aus und gibt ein signiertes `id_token` an Entra ID zurück. Entra ID validiert dieses Token und prüft, ob die MFA-Anforderung erfüllt ist.

<EntraIntegrationFlow />

Entra ID bleibt während des gesamten Prozesses die **Identity Control Plane**: Policy-Auswertung, Zugangsentscheide, Token-Ausstellung und Session Management. Mobile ID übernimmt den eigentlichen Authentisierungsschritt.

Diese Trennung ist entscheidend. Entra steuert **wann** MFA erforderlich ist und konsumiert das Provider-Ergebnis. Mobile ID steuert **wie** der Benutzer sich im Provider-Ablauf authentisiert. Entra muss nicht verstehen, ob Mobile ID den zweiten Faktor intern mit SIM, App oder Passkey erbracht hat.

## Warum Mobile ID als External MFA-Anbieter?

Die meisten externen MFA-Anbieter bieten App-basierte Push-Benachrichtigungen. Mobile ID geht mit einer Kombination von Authentisierungsmethoden weiter, die Szenarien abdeckt, die andere Anbieter schlicht nicht adressieren können.

Im breiteren Mobile-ID-Ecosystem gibt es inzwischen **drei starke Methoden**: **SIM**, **App** und **Passkeys**. Für Entra External MFA ist wichtig, dass Entra nicht zwischen diesen Methoden auswählt. Mobile ID führt den providerseitigen Ablauf aus, Entra konsumiert das erfolgreiche Ergebnis.

### SIM-basierte Authentisierung: Keine App erforderlich

Die [SIM-Methode](/rest-api-guide/introduction#mobile-id-sim---method) von Mobile ID nutzt die SIM-Karte (oder eSIM) als manipulationssicheres Hardware-Token, zertifiziert nach **EAL5+** (ISO/IEC 15408). Über 6 Millionen Schweizer SIM-Karten von Swisscom, Sunrise und Salt sind Mobile ID-fähig.

Für Entra ID-Umgebungen bedeutet das: MFA funktioniert auf **jedem Mobilgerät**, einschliesslich einfacher Telefone ohne Smartphone-Betriebssystem. Keine App-Installation, keine App-Store-Abhängigkeit, keine Datenverbindung während der Authentisierung nötig. Für Organisationen mit Aussendienstmitarbeitenden, industriellen Umgebungen oder Mitarbeitenden ohne Smartphone ist das ein entscheidender Unterschied.

Die zwei Faktoren sind die physische SIM-Karte (Besitz) und der persönliche Mobile ID PIN (Wissen). Die Authentisierung läuft über einen separaten verschlüsselten Kanal, unabhängig von der Internetverbindung.

### App-basierte Authentisierung: Mehr als einfaches Push

Die [Mobile ID App](/rest-api-guide/introduction#mobile-id-app---method) für iOS und Android geht weit über Standard-Push-Benachrichtigungen hinaus. Benutzer können sich per Fingerabdruck oder Gesichtserkennung authentisieren. **Number Matching** und **[Transaction Signing](/oidc-integration-guide/message-formats)** stehen sowohl mit Mobile ID SIM als auch mit Mobile ID App zur Verfügung. In der App werden diese Fähigkeiten mit smartphone-nativer UX und Biometrie kombiniert. **App-basiertes Geofencing** nutzt GPS-basierte Standortbestimmung plus integrierte Jailbreak- und Mock-Service-Erkennung, was GPS-Spoofing erschwert. In unterstützten Swisscom-SIM-Szenarien ist Geofencing auch über den Standortmechanismus des Mobilfunknetzes möglich.

Die App basiert auf Technologie von Futurae, einem ETH-Zürich-Spin-off, und speichert Schlüssel im Trusted Execution Environment (TEE) des Geräts.

### Passkey-Authentisierung: Phishing-resistente Browser-Fähigkeit

Neben SIM und App unterstützt Mobile ID inzwischen auch [FIDO2 Passkeys](/oidc-integration-guide/passkey-authentication) in seinem OIDC Ecosystem. Passkeys sind kryptografisch an die Domain gebunden und dadurch resistent gegen URL-Spoofing. Benutzer registrieren ihre Passkeys auf [mobileid.ch](https://mobileid.ch/login) und können sie bei verbundenen Relying Parties verwenden, die für Mobile-ID-Passkeys konfiguriert sind.

Für direkte Mobile-ID-OIDC-Integrationen lassen sich Passkeys mit Mobile-ID-spezifischen Controls wie passkey-orientierten ACR-Werten und `keyringId` kombinieren. Diese Controls gehören zur Standard-Integration der Relying Party mit Mobile ID und nicht zur Entra-External-MFA-Adminoberfläche.

::: info
Im Kontext von Entra ID External MFA konsumiert Entra weiterhin nur das Ergebnis des Mobile-ID-Provider-Flows. Entra unterscheidet SIM, App und Passkey nicht als separate Mobile-ID-Methoden. Wenn Passkeys in der Mobile-ID-Provider-Konfiguration hinter einer Entra-Integration aktiviert sind, bleiben sie eine Mobile-ID-seitige Methodenwahl und keine Entra-seitige Einstellung. Details zu Passkeys und ihrer Rolle im breiteren Mobile-ID-Ecosystem finden Sie im Begleitartikel: [Mobile ID Passkeys: Phishing-resistente Authentisierung für Browser-Szenarien](/release-notes/posts/2026-03-30-mobile-id-passkeys).
:::

### Schweizer Betrieb und Datenresidenz

Mobile ID wird von Swisscom aus der Schweiz betrieben. Organisationen mit Anforderungen an die Datenresidenz oder einer Präferenz für europäisch betriebene Sicherheitsdienste können sicher sein, dass Authentisierungsdaten unter Schweizer Jurisdiktion bleiben.

### Wo Mobile ID über natives MFA hinaus Mehrwert bietet

Microsoft Authenticator ist ein solider Standard für Organisationen, die nur App-basiertes Push und TOTP benötigen. Mobile ID schafft dort klaren Mehrwert, wo die Anforderungen darüber hinausgehen:

- **Teile der Belegschaft arbeiten ohne Smartphone.**
- **Die Authentisierung muss an einen definierten geografischen Bereich gebunden sein.**
- **Benutzer müssen Transaktionsdetails auf ihrem Gerät explizit bestätigen.**
- **Ein einziger MFA-Anbieter soll Entra ID, eigene Anwendungen, VPN und RADIUS abdecken.**

Das sind Szenarien, in denen ein reiner App-Ansatz an seine Grenzen stösst.

## Unternehmens-Anwendungsfälle

Mobile ID adressiert ein breites Spektrum von Unternehmensszenarien über unterschiedliche Integrationsmodelle. SIM und App decken die breitesten Out-of-Band-Enterprise-Journeys ab. Passkeys ergänzen browser-zentrierte Journeys dort, wo WebAuthn-Unterstützung Ende-zu-Ende verfügbar ist.

<EntraUseCaseCards />

### Microsoft 365 MFA für Mitarbeitende

Das häufigste Szenario: Absicherung des Zugangs zu Outlook, Teams, SharePoint und anderen Microsoft 365-Anwendungen. Wenn eine Conditional Access Policy MFA verlangt, authentisieren sich Mitarbeitende über Mobile ID anstelle von oder ergänzend zu Microsoft Authenticator.

Das ist besonders wertvoll für Organisationen, die einen **einzigen MFA-Anbieter über alle Anwendungen hinweg** wollen, nicht nur für Microsoft-Dienste. Die Mobile ID-Authentisierungsmethoden — SIM, App und Passkeys — stehen über verschiedene Integrationsmodelle zur Verfügung: als Entra External MFA-Anbieter, über [Standard-OIDC](/oidc-integration-guide/introduction) für eigene Webanwendungen und via [RADIUS Interface Gateway](/radius-interface-gateway-guide/introduction) für VPN- und Netzwerkzugang.

### VPN und Remote Access

Für VPN-Gateways, Citrix-Umgebungen, VDI-Sessions und Remote-Desktop-Zugang bietet Mobile ID MFA über das [RADIUS Interface Gateway](/radius-interface-gateway-guide/introduction) oder direkt via OIDC. Sowohl SIM als auch App passen gut zu diesen Out-of-Band-Szenarien, weil keine der beiden Methoden von Bluetooth zu einem Hardware-Key abhängt. Sie bleiben damit auch dann praktisch, wenn die geschützte Session selbst remote oder client-gesteuert ist.

Passkeys können browser-zentrierte Remote-Access-Journeys weiterhin ergänzen, wenn WebAuthn Ende-zu-Ende unterstützt wird. In VDI-, RDP- oder clientbasierten VPN-Flows sind sie jedoch oft weniger komfortabel, weil Browser-/WebAuthn-Unterstützung und Cross-Device-Handoff dort nicht durchgängig verfügbar sind.

### Privileged Access Management

Admin-Konten und der Zugang zu sensiblen Systemen erfordern das höchste Sicherheitsniveau. Entra ID Conditional Access Policies können auf bestimmte Admin-Rollen und sensible Anwendungen ausgerichtet werden, um External MFA via Mobile ID zu verlangen. Was Entra steuert, ist **wann** der zusätzliche Faktor erforderlich ist. Welche Mobile-ID-Methode im Provider-Ablauf verwendet wird, ist Sache von Mobile ID.

Methodenspezifische Controls wie Mobile-ID-Passkey-only-ACRs, `keyringId` oder andere direkte Regeln zur Methodensteuerung gehören zu direkten Mobile-ID-OIDC-Integrationen ausserhalb der Entra-External-MFA-Adminoberfläche.

### Hybride Belegschaft und Aussendienst

Nicht alle Mitarbeitenden tragen ein Smartphone bei sich. Aussendienstmitarbeitende, Produktionspersonal oder Mitarbeitende in regulierten Umgebungen haben möglicherweise nur ein einfaches Mobiltelefon. Mit Mobile ID SIM erhalten diese Benutzer starke MFA ohne jegliche App-Installation. Büromitarbeitende können die Mobile ID App mit Biometrie für ein angenehmeres Erlebnis nutzen. Ein Anbieter deckt jeden Gerätetyp ab.

<div class="blog-infographic">
  <img src="/release-notes/media/infografik-entra-use-cases.jpg" alt="Unternehmens-Anwendungsfälle für Mobile ID als External MFA in Microsoft Entra ID: Microsoft 365, VPN, Privileged Access und hybride Belegschaftsszenarien" />
</div>

## Der Migrationspfad: Von Custom Controls zu External MFA

Microsoft hat einen klaren Zeitplan gesetzt. Organisationen, die noch Custom Controls für MFA mit Drittanbietern verwenden, sollten vor dem Abkündigungstermin auf External MFA migrieren.

<EntraMigrationTimeline />

Die Migration kann schrittweise erfolgen. Microsoft unterstützt den **parallelen Betrieb** von Custom Controls und External MFA während der Übergangsphase. Ein empfohlenes Vorgehen:

<div class="blog-step-list">
  <div class="blog-step-card">
    <div class="blog-step-number">1</div>
    <div class="blog-step-body">
      <p><span class="blog-step-title">Mobile ID in Entra ID konfigurieren.</span> Richten Sie Mobile ID im Entra Admin Center als External MFA-Methode ein und folgen Sie dabei der <a href="/oidc-integration-guide/cloud-integration-guide#microsoft-entra-id">Konfigurationsanleitung</a>.</p>
    </div>
  </div>
  <div class="blog-step-card">
    <div class="blog-step-number">2</div>
    <div class="blog-step-body">
      <p><span class="blog-step-title">Eine parallele Conditional Access Policy erstellen.</span> Richten Sie die neue Policy zunächst auf eine klar definierte Testgruppe aus, damit der neue Ablauf kontrolliert eingeführt werden kann.</p>
    </div>
  </div>
  <div class="blog-step-card">
    <div class="blog-step-number">3</div>
    <div class="blog-step-body">
      <p><span class="blog-step-title">Den Authentisierungsfluss mit dieser Gruppe validieren.</span> Prüfen Sie, ob Policy-Auswertung, Weiterleitung zu Mobile ID und erfolgreiche MFA-Rückgabe wie erwartet funktionieren.</p>
    </div>
  </div>
  <div class="blog-step-card">
    <div class="blog-step-number">4</div>
    <div class="blog-step-body">
      <p><span class="blog-step-title">Breit ausrollen und die Legacy-Policy abschalten.</span> Weiten Sie die Policy anschliessend auf alle vorgesehenen Benutzer aus und deaktivieren Sie danach die bisherige Custom-Controls-Konfiguration.</p>
    </div>
  </div>
</div>

::: tip
Wenn Sie neu bei Mobile ID sind und es als External MFA-Anbieter in Betracht ziehen, übernimmt Swisscom den [Onboarding-Prozess](/oidc-integration-guide/getting-started). Sie erhalten die Application ID, Client ID und Discovery URL, die für die Konfiguration von External MFA in Entra ID benötigt werden.
:::

## Erste Schritte

Die Einrichtung von Mobile ID als External MFA-Anbieter in Entra ID erfordert drei Voraussetzungen:

<div class="blog-step-list">
  <div class="blog-step-card">
    <div class="blog-step-number">1</div>
    <div class="blog-step-body">
      <p><span class="blog-step-title">Das Mobile ID-Onboarding abschliessen.</span> Kontaktieren Sie Swisscom, um Ihre Integrationszugangsdaten zu erhalten und das Onboarding vollständig abzuschliessen. Alle Grundlagen dazu finden Sie unter <a href="/oidc-integration-guide/getting-started">Erste Schritte</a>.</p>
    </div>
  </div>
  <div class="blog-step-card">
    <div class="blog-step-number">2</div>
    <div class="blog-step-body">
      <p><span class="blog-step-title">Ein Entra ID P1- oder P2-Abonnement bereitstellen.</span> Conditional Access muss aktiviert sein, und die betroffenen Benutzer benötigen die passenden Lizenzen.</p>
    </div>
  </div>
  <div class="blog-step-card">
    <div class="blog-step-number">3</div>
    <div class="blog-step-body">
      <p><span class="blog-step-title">Ein Entra ID-Administratorkonto vorbereiten.</span> Für die Konfiguration der externen MFA-Methode und der Conditional Access Policies ist mindestens die Rolle Authentication Policy Administrator erforderlich. Für die Erteilung der Admin-Zustimmung für die Anbieteranwendung wird mindestens die Rolle Privileged Role Administrator benötigt.</p>
    </div>
  </div>
</div>

Die Schritt-für-Schritt-Konfiguration ist im [Cloud Integration Guide](/oidc-integration-guide/cloud-integration-guide#microsoft-entra-id) dokumentiert, einschliesslich Conditional Access Policy-Setup, Admin Consent und optionalen Schritten zur Priorisierung von Mobile ID gegenüber Microsoft Authenticator.

<!-- Static integration flow infographic removed: the interactive EntraIntegrationFlow
     component above already visualizes this flow with correct provider-side framing. -->

## Fazit

Mit der allgemeinen Verfügbarkeit von External MFA in Microsoft Entra ID müssen Organisationen nicht mehr zwischen zentralem Identity Management und spezialisierter Authentisierung wählen. Entra ID bleibt die Policy Engine. Mobile ID liefert den providerseitigen zweiten Faktor über SIM, App und das breitere passkey-fähige Mobile-ID-Ecosystem, während Entra nur das External-MFA-Ergebnis konsumiert.

In der Praxis bedeutet das einen MFA-Anbieter für Entra ID, Webanwendungen, VPN und RADIUS-Umgebungen, der Gerätetypen vom einfachen Mobiltelefon bis zu modernen passkey-fähigen Plattformen abdeckt. SIM und App bleiben besonders stark für Out-of-Band-Enterprise-Journeys, und Passkeys erweitern das Mobile-ID-Portfolio für phishing-resistente Browser-Szenarien, wenn Provider-Konfiguration und Plattformunterstützung dies zulassen. Dazu kommen eine in der Schweiz betriebene Infrastruktur mit standardbasierter OIDC-Integration und eine zukunftssichere Grundlage, weil External MFA die abgekündigten Custom Controls ersetzt und Mobile ID sich mit neuen Funktionen wie dem [Passkey Vault](/release-notes/posts/2026-03-30-mobile-id-passkeys#roadmap-the-mobile-id-passkey-vault) weiterentwickelt.

Bei Fragen zu Mobile ID-Integrationen wenden Sie sich an [Backoffice.Security@swisscom.com](mailto:Backoffice.Security@swisscom.com). Allgemeine Informationen zum Service finden Sie auf [mobileid.ch](https://www.mobileid.ch/de).
