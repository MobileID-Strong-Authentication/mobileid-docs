---
title: "Mobile ID und Microsoft Entra ID: Stärkere MFA mit External Authentication"
date: 2026-03-27
author: Mobile ID Team
description: "Microsoft Entra External MFA ist jetzt allgemein verfügbar. Erfahren Sie, wie Mobile ID als vertrauenswürdiger externer MFA-Anbieter SIM-basierte und App-basierte Authentisierung in Ihre Entra ID-Umgebung bringt."
thumbnail: /release-notes/img/entra-eam-thumb.png
lang: de
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
Microsoft Entra ID ist die Identitätsplattform hinter Millionen von Unternehmensumgebungen. Mit der <strong>allgemeinen Verfügbarkeit von External MFA</strong> können Organisationen einen vertrauenswürdigen externen Authentisierungsanbieter in Entra ID einbinden und behalten dabei die volle Kontrolle über Conditional Access Policies. Mobile ID, betrieben von Swisscom, ergänzt Entra ID-Logins, die MFA erfordern, um <a href="/rest-api-guide/introduction#mobile-id-sim---method">hardwaregestützte SIM-Authentisierung</a> und <a href="/rest-api-guide/introduction#mobile-id-app---method">App-basierte Push-Benachrichtigungen mit Geofencing</a>.
</div>

<div class="blog-video">
  <video controls preload="metadata" poster="/release-notes/img/entra-eam-thumb.png">
    <source src="/release-notes/media/entra-external-mfa-explainer.mp4" type="video/mp4" />
  </video>
  <div class="blog-video-caption">
    <svg class="video-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
    <span>Video-Zusammenfassung (7 Min.). Die wichtigsten Punkte dieses Artikels auf einen Blick.</span>
  </div>
</div>

## Was ist Microsoft Entra External MFA?

Microsoft Entra ID ist die zentrale Plattform für Identity and Access Management in Unternehmen, die Microsoft 365, Azure und Tausende verbundener Anwendungen nutzen. Bei der Anmeldung wertet Entra ID **Conditional Access Policies** aus, um zu entscheiden, ob eine zusätzliche Verifizierung nötig ist und welche Methode verwendet werden soll.

Entra ID bietet bereits mehrere integrierte MFA-Methoden: Authenticator App, FIDO2 Security Keys, SMS und Telefonanrufe. Für Organisationen, die einen **externen Authentisierungsanbieter** einbinden mussten, war die einzige Option ein Legacy-Mechanismus namens **Custom Controls**. Custom Controls erlaubten die Weiterleitung von Benutzern an einen externen Anbieter, allerdings mit erheblichen Einschränkungen. Die externe Authentisierung wurde von Entra ID nicht vollständig als MFA anerkannt, was die Verwendung in Conditional Access Policies und Grant Controls einschränkte.

**External MFA** ändert das. Seit Mai 2024 in der Public Preview und [seit März 2026 allgemein verfügbar](https://techcommunity.microsoft.com/blog/microsoft-entra-blog/external-mfa-in-microsoft-entra-id-is-now-generally-available/4488926), ermöglicht External MFA einem externen Anbieter, sich als vollständig anerkannte Multifaktor-Authentisierungsmethode zu registrieren. Entra ID behandelt die External MFA-Antwort genau wie seine integrierten Methoden: Sie erfüllt die MFA-Anforderungen von Conditional Access, funktioniert mit Sign-in Frequency Policies und fügt sich in den Standard-Authentisierungsfluss ein.

Die Integration basiert auf **OpenID Connect (OIDC)**, einem offenen, standardkonformen Protokoll. Keine proprietären APIs, kein Vendor Lock-in.

::: info
External MFA ersetzt Custom Controls, die Microsoft am [30. September 2026 abkündigen](https://learn.microsoft.com/en-us/entra/identity/authentication/how-to-authentication-external-method-manage) will. Organisationen, die noch Custom Controls verwenden, sollten ihre Migration jetzt planen.
:::

## Wie funktioniert External MFA?

Der Ablauf ist für den Endbenutzer transparent. Bei der Anmeldung an einer geschützten Anwendung wertet Entra ID die Conditional Access Policy aus. Wenn MFA erforderlich ist und Mobile ID als externer Anbieter konfiguriert wurde, wird der Benutzer via OIDC zu Mobile ID zur Authentisierung weitergeleitet. Nach erfolgreicher Verifizierung kehrt der Benutzer mit einem gültigen MFA Claim zu Entra ID zurück und erhält Zugang.

<EntraIntegrationFlow />

Entra ID bleibt während des gesamten Prozesses die **Identity Control Plane**: Policy-Auswertung, Zugangsentscheide, Token-Ausstellung und Session Management. Mobile ID übernimmt den eigentlichen Authentisierungsschritt, bei dem der Benutzer seine Identität durch einen zweiten Faktor nachweist.

Das Ergebnis ist eine klare Aufgabentrennung. Microsofts Policy Engine und Governance-Funktionen auf der einen Seite, Mobile IDs spezialisierte Authentisierungsmethoden und in der Schweiz betriebene Infrastruktur auf der anderen.

## Warum Mobile ID als External MFA-Anbieter?

Die meisten externen MFA-Anbieter bieten App-basierte Push-Benachrichtigungen. Mobile ID geht mit einer Kombination von Authentisierungsmethoden weiter, die Szenarien abdeckt, die andere Anbieter schlicht nicht adressieren können.

### SIM-basierte Authentisierung: Keine App erforderlich

Die [SIM-Methode](/rest-api-guide/introduction#mobile-id-sim---method) von Mobile ID nutzt die SIM-Karte (oder eSIM) als manipulationssicheres Hardware-Token, zertifiziert nach **EAL5+** (ISO/IEC 15408). Über 6 Millionen Schweizer SIM-Karten von Swisscom, Sunrise und Salt sind Mobile ID-fähig.

Für Entra ID-Umgebungen bedeutet das: MFA funktioniert auf **jedem Mobilgerät**, einschliesslich einfacher Telefone ohne Smartphone-Betriebssystem. Keine App-Installation, keine App-Store-Abhängigkeit, keine Datenverbindung während der Authentisierung nötig. Für Organisationen mit Aussendienstmitarbeitenden, industriellen Umgebungen oder Mitarbeitenden ohne Smartphone ist das ein entscheidender Unterschied.

Die zwei Faktoren sind die physische SIM-Karte (Besitz) und der persönliche Mobile ID PIN (Wissen). Die Authentisierung läuft über einen separaten verschlüsselten Kanal, unabhängig von der Internetverbindung.

### App-basierte Authentisierung: Mehr als einfaches Push

Die [Mobile ID App](/rest-api-guide/introduction#mobile-id-app---method) für iOS und Android geht weit über Standard-Push-Benachrichtigungen hinaus. Benutzer können sich per Fingerabdruck oder Gesichtserkennung authentisieren. [Geofencing](/oidc-integration-guide/getting-started#authentication-context-class-reference-acr) beschränkt die Authentisierung auf bestimmte geografische Gebiete, mit integrierter Jailbreak- und GPS-Spoofing-Erkennung. Number Matching lässt den Benutzer einen auf dem Bildschirm angezeigten Code bestätigen, was MFA Fatigue-Angriffe verhindert. Und [Transaction Signing](/oidc-integration-guide/message-formats) zeigt die Details einer Transaktion direkt auf dem Gerät an (z.B. «Bestätigen Sie die Überweisung von CHF 1'000 auf Konto XY»), sodass der Benutzer explizit zustimmt.

Die App basiert auf Technologie von Futurae, einem ETH-Zürich-Spin-off, und speichert Schlüssel im Trusted Execution Environment (TEE) des Geräts.

### Passkey-Authentisierung: Phishing-resistenter Login

Neben SIM und App unterstützt Mobile ID [FIDO2 Passkeys](/oidc-integration-guide/passkey-authentication) für phishing-resistente Authentisierung in seinem OIDC Ecosystem. Passkeys sind kryptografisch an die Domain gebunden, was sie immun gegen URL-Spoofing macht. Benutzer registrieren ihre Passkeys einmalig auf [mobileid.ch](https://mobileid.ch/login) und können sie bei allen verbundenen Relying Parties nutzen.

::: info
Passkeys sind eine allgemeine Mobile ID-Funktion, die über die Standard-OIDC-Integration verfügbar ist. Im Kontext von Entra ID External MFA sind SIM und App die primären Authentisierungsmethoden. Details zu Passkeys und ihrer Rolle im breiteren Mobile ID Ecosystem finden Sie im Begleitartikel: [Mobile ID Passkeys: Phishing-resistente Authentisierung für Browser-Szenarien](/release-notes/posts/2026-03-30-mobile-id-passkeys).
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

External MFA mit Mobile ID adressiert ein breites Spektrum von Unternehmensszenarien. Welche Authentisierungsmethode am besten passt (SIM oder App), hängt von den Sicherheitsanforderungen und dem Benutzerkontext ab.

<EntraUseCaseCards />

### Microsoft 365 MFA für Mitarbeitende

Das häufigste Szenario: Absicherung des Zugangs zu Outlook, Teams, SharePoint und anderen Microsoft 365-Anwendungen. Wenn eine Conditional Access Policy MFA verlangt, authentisieren sich Mitarbeitende über Mobile ID anstelle von oder ergänzend zu Microsoft Authenticator.

Das ist besonders wertvoll für Organisationen, die einen **einzigen MFA-Anbieter über alle Anwendungen hinweg** wollen, nicht nur für Microsoft-Dienste. Da Mobile ID [Standard-OIDC](/oidc-integration-guide/introduction) verwendet, funktionieren die gleichen Authentisierungsmethoden für Entra ID, eigene Webanwendungen, VPN-Zugang und mehr.

### VPN und Remote Access

Für VPN-Gateways, Citrix-Umgebungen, VDI-Sessions und Remote-Desktop-Zugang bietet Mobile ID MFA über das [RADIUS Interface Gateway](/radius-interface-gateway-guide/introduction) oder direkt via OIDC. Die SIM-Methode eignet sich hier besonders, weil sie auch in Umgebungen zuverlässig funktioniert, in denen App-basierte Authentisierung unpraktisch ist. Eine Remote-Desktop-Session blockiert beispielsweise oft die Bluetooth-Kommunikation mit einem Security Key.

### Privileged Access Management

Admin-Konten und der Zugang zu sensiblen Systemen erfordern das höchste Sicherheitsniveau. Entra ID Conditional Access Policies können auf bestimmte Admin-Rollen und sensible Anwendungen ausgerichtet werden, um External MFA via Mobile ID zu verlangen. Mobile ID authentisiert den Benutzer dann mit den verfügbaren Methoden. Für Organisationen, die Mobile ID auch ausserhalb des Entra-Kontexts nutzen (z.B. für Webanwendungen oder VPN), erlauben [granulare ACR-Werte](/oidc-integration-guide/getting-started#authentication-context-class-reference-acr) in der OIDC Authorization Request der Relying Party, spezifische Methoden wie App mit Geofencing oder Transaction Signing zu erzwingen.

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
      <p><span class="blog-step-title">Ein Entra ID-Administratorkonto vorbereiten.</span> Für die Ersteinrichtung ist die Rolle Global Administrator oder Privileged Role Administrator erforderlich.</p>
    </div>
  </div>
</div>

Die Schritt-für-Schritt-Konfiguration ist im [Cloud Integration Guide](/oidc-integration-guide/cloud-integration-guide#microsoft-entra-id) dokumentiert, einschliesslich Conditional Access Policy-Setup, Admin Consent und optionalen Schritten zur Priorisierung von Mobile ID gegenüber Microsoft Authenticator.

<div class="blog-infographic">
  <img src="/release-notes/media/infografik-entra-integration-flow.jpg" alt="Mobile ID-Integrationsarchitektur mit Microsoft Entra ID: OIDC-basierter Authentisierungsfluss mit Policy-Auswertung, External MFA und Zugriffskontrolle" />
</div>

## Fazit

Mit der allgemeinen Verfügbarkeit von External MFA in Microsoft Entra ID müssen Organisationen nicht mehr zwischen zentralem Identity Management und spezialisierter Authentisierung wählen. Entra ID bleibt die Policy Engine. Mobile ID liefert den zweiten Faktor, per SIM oder App, je nach Anwendungsfall.

In der Praxis bedeutet das einen MFA-Anbieter für Entra ID, Webanwendungen, VPN und RADIUS-Umgebungen, der alle Gerätetypen vom Smartphone bis zum einfachen Mobiltelefon abdeckt. Dazu kommen eine in der Schweiz betriebene Infrastruktur mit standardbasierter OIDC-Integration und eine zukunftssichere Grundlage, weil External MFA die abgekündigten Custom Controls ersetzt und Mobile ID sich mit neuen Funktionen wie dem [Passkey Vault](/release-notes/posts/2026-03-30-mobile-id-passkeys#roadmap-the-mobile-id-passkey-vault) weiterentwickelt.

Bei Fragen zu Mobile ID-Integrationen wenden Sie sich an [Backoffice.Security@swisscom.com](mailto:Backoffice.Security@swisscom.com). Allgemeine Informationen zum Service finden Sie auf [mobileid.ch](https://www.mobileid.ch/de).
