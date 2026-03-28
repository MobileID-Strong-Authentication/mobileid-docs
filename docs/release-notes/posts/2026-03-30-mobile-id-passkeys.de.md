---
title: "Mobile ID Passkeys: Phishing-resistente Authentisierung für Browser-Szenarien"
date: 2026-03-30
author: Mobile ID Team
description: "Passkeys ermöglichen phishing-resistente Logins per Biometrie in unter 3 Sekunden. Mobile ID integriert sie nativ ins OIDC Ecosystem und zeigt, warum SIM und App weiterhin unverzichtbar sind."
thumbnail: /release-notes/img/passkeys-thumb.png
lang: de
readingTime: 12
layout: release-notes-post
---

<script setup>
import AcrLevels from '../../.vitepress/theme/components/AcrLevels.vue'
import PasskeyRegistrationFlow from '../../.vitepress/theme/components/PasskeyRegistrationFlow.vue'
import PasskeyLoginFlow from '../../.vitepress/theme/components/PasskeyLoginFlow.vue'
import PasskeyTypesCards from '../../.vitepress/theme/components/PasskeyTypesCards.vue'
import HybridAuthFlow from '../../.vitepress/theme/components/HybridAuthFlow.vue'
import LanguageSwitcher from '../../.vitepress/theme/components/LanguageSwitcher.vue'
import ScreenshotStep from '../../.vitepress/theme/components/ScreenshotStep.vue'
</script>

<LanguageSwitcher />

<div class="blog-lead">
Microsoft blockiert täglich rund 7'000 Passwort-Angriffe pro Sekunde, und 47 % der Konsumenten brechen einen Kauf ab, wenn sie ihr Passwort vergessen. In einer Welt, in der Phishing nach wie vor der häufigste Angriffsvektor ist, braucht es eine grundlegend neue Antwort. <strong>Passkeys</strong> sind diese Antwort. Mobile ID integriert sie jetzt nativ in sein OIDC Ecosystem und kombiniert sie mit den bewährten Stärken von SIM und App.
</div>

<div class="blog-video">
  <video controls preload="metadata" poster="/release-notes/media/infografik-overview.webp">
    <source src="/release-notes/media/passkey-advantage.mp4" type="video/mp4" />
  </video>
  <div class="blog-video-caption">
    <svg class="video-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
    <span>Video-Zusammenfassung (7 Min.) — Die wichtigsten Punkte dieses Artikels auf einen Blick.</span>
  </div>
</div>

## NIST AAL und ISO/IEC LoA: Referenzrahmen für Sicherheitsniveaus

Bevor die einzelnen Methoden im Detail betrachtet werden, ist ein gemeinsames Verständnis der Sicherheitsstufen entscheidend. In der Praxis werden dafür zwei Referenzrahmen häufig herangezogen: NIST SP 800-63B (heute in Revision 4) mit drei Authenticator Assurance Levels (AAL1-AAL3) und ISO/IEC 29115:2013 mit vier Levels of Assurance (LoA1-LoA4). Beide beschreiben vom Prinzip her dasselbe: wie hoch die Vertrauens- bzw. Sicherheitsstufe einer Authentisierung ist. Verwirrend ist nur, dass die Skalen unterschiedlich benannt und nummeriert sind. Das höchste Niveau ist daher je nach Referenzrahmen entweder **AAL3** oder **LoA4**.

**AAL1** verlangt lediglich eine Einzel-Faktor-Authentisierung. Passwörter, SMS-OTPs oder einfache Token erfüllen diese Stufe. Das Sicherheitsniveau ist gering.

**AAL2** erfordert zwei unterschiedliche Faktoren. Zusätzlich muss für Online-Dienste eine phishing-resistente Option angeboten werden. Cloud-Synced Passkeys, TOTP-Generatoren, Mobile Push (wie Mobile ID SIM oder App) und Multi-Faktor-OTP-Geräte erfüllen AAL2.

**AAL3** ist das höchste NIST-Niveau. Es verlangt phishing-resistente Public-Key-Kryptografie mit nicht exportierbarem privatem Schlüssel sowie zusätzliche Hardware-, Kryptografie- und Re-Authentisierungsanforderungen. Nur wenige Authenticatoren erfüllen diese Anforderungen vollständig: FIPS-zertifizierte Security Keys (z.B. YubiKey 5 FIPS Series), bestimmte Smartcards und Hardware Security Modules.

## Was sind Passkeys?

Passkeys sind eine benutzerfreundliche Implementierung des FIDO2-Standards und der WebAuthn-API. Sie ersetzen Passwörter durch kryptografische Schlüsselpaare und ermöglichen einen Login per Biometrie in unter 3 Sekunden. Das Kernprinzip: Der private Schlüssel verlässt das Gerät des Benutzers nie. Stattdessen signiert der Authenticator eine Challenge, die der Server mit dem öffentlichen Schlüssel verifiziert.

Das Besondere an Passkeys ist das sogenannte Origin-Binding: Der Schlüssel ist kryptografisch an die Domain des Dienstes gebunden. Selbst wenn ein Benutzer auf eine perfekt nachgebaute Phishing-Seite gelangt, scheitert die Authentisierung, weil der Browser die falsche Domain erkennt und den Schlüssel nicht freigibt.

## Passkey-Typen: Komfort vs. maximale Sicherheit

Nicht alle Passkeys sind gleich. Je nach Schutzbedarf kommen unterschiedliche Typen zum Einsatz. Die Wahl hat direkte Auswirkungen auf das erreichbare Sicherheitsniveau.

### Cloud-Synced Passkeys

Cloud-Synced Passkeys werden über die Cloud-Infrastruktur des Plattformanbieters synchronisiert: Apple iCloud Keychain, Google Password Manager oder 3rd-Party-Manager wie 1Password. In den gängigen Consumer-Ökosystemen ist Cloud-Synchronisierung heute die Standard-User-Experience, weil sie Recovery und geräteübergreifende Nutzung maximiert.

Der grosse Vorteil: Passkeys stehen auf allen Geräten desselben Ökosystems zur Verfügung. Geht ein Gerät verloren, bleibt der Zugang über andere Geräte erhalten. Die Synchronisierung erfolgt mit Ende-zu-Ende-Verschlüsselung. Cloud-Synced Passkeys können zudem mit Familienmitgliedern oder Freunden geteilt werden, was auch bedeutet, dass sie auf nicht vertrauenswürdige Geräte gelangen können.

Sicherheitsniveau: **AAL2**. Da die Schlüssel exportierbar sind und in Cloud-Infrastrukturen liegen (die dem US CLOUD Act unterliegen), erfüllen sie nicht die Anforderungen für AAL3.

### Device-Bound Passkeys

Bei Device-Bound Passkeys verlässt der private Schlüssel die Sicherheits-Hardware nie. Typische Vertreter sind FIPS-zertifizierte Security Keys wie der YubiKey 5 FIPS Series (FIPS 140-2 Cert #3907, ca. CHF 100 bei Digitec). Diese bieten die höchste Sicherheit und sind AAL3-konform.

Wichtig zu wissen: Standard-YubiKeys (ohne FIPS-Zertifizierung) genügen nicht für AAL3. Im September 2024 wurde zudem eine schwerwiegende Schwachstelle in der YubiKey 5 Series entdeckt, die nicht per Firmware-Update behoben werden kann, sondern einen physischen Austausch des Tokens erfordert. Dies illustriert ein grundsätzliches Problem physischer Token: Sicherheitslücken können teuer und aufwändig zu beheben sein.

Sicherheitsniveau: **AAL3** (nur mit FIPS 140-2-Zertifizierung und Firmware 5.7 oder neuer).

### Platform Authenticators

Platform Authenticators sind direkt im Gerät verbaute Sicherheitsmodule wie Windows Hello (TPM), Apple Touch ID/Face ID (Secure Enclave) oder der Titan M2 Chip in Google-Pixel-Geräten. Sie können je nach Konfiguration als Cloud-Synced oder Device-Bound funktionieren.

AAL3 ist nur erreichbar, wenn der Schlüssel nicht in die Cloud synchronisiert wird und die Hardware-Komponente FIPS-validiert ist. In der Praxis erfordert dies eine gerätegebundene Konfiguration oder einen externen Authenticator, der den privaten Schlüssel ausserhalb eines cloud-synchronisierten Credential Stores hält.

### 3rd-Party Passkey Provider

Seit iOS 17 und Android 14 können Drittanbieter als Passkey-Provider registriert werden. Die Credential Manager API (Android) bzw. AuthenticationServices (iOS) ermöglichen es Authentisierungs-Apps, Passkeys zu erstellen und zu verwalten, ohne dass der Benutzer auf den systemeigenen Passkey-Speicher angewiesen ist.

Dies ist die technische Grundlage für den geplanten Mobile ID Passkey Vault: Die Mobile ID App wird selbst zum Passkey-Provider und kann Device-Bound Passkeys auf AAL3-Niveau verwalten, ohne dass physische Hardware-Token erforderlich sind.

<div class="blog-infographic">
  <img src="/release-notes/media/infografik-passkey-typen.webp" alt="Passkey-Typen im Sicherheitsvergleich: Cloud-Synced, Device-Bound und Platform Authenticators" />
</div>

<PasskeyTypesCards />

## Passkey-Integration: Für Benutzer einfach, für Unternehmen komplex

Passkeys versprechen eine einfache User Experience. Die technische Realität hinter den Kulissen ist jedoch anspruchsvoll. Eine vollständige Passkey-Infrastruktur erfordert:

Ein **WebAuthn-Backend** mit FIDO2-Server-Library, Attestation-Validierung, Credential-Management und sicherer Schlüsselspeicherung. Ein **Credential-Lifecycle-Management** für Registrierung, Deaktivierung, Wiederherstellung und die Verwaltung mehrerer Passkeys pro Benutzer. **[Fallback-Mechanismen](/oidc-integration-guide/passkey-authentication#passkey-only-vs-fallback)** für Benutzer ohne Passkey-fähiges Gerät oder bei fehlgeschlagener Authentisierung. **Compliance-Prüfungen** für regulierte Branchen, einschliesslich [AAGUID-Validierung](/oidc-integration-guide/passkey-authentication#rp-control-over-passkey-quality) gegen die FIDO Metadata Service (MDS) Datenbank und FIPS-Zertifizierungsprüfung.

Mobile ID löst diese Komplexität: Relying Parties integrieren nicht die Passkey-Infrastruktur selbst, sondern den Mobile ID OIDC Service. Die Passkey-Registrierung und -Verwaltung findet zentral auf mobileid.ch statt. Ein Passkey wird einmal registriert und kann anschliessend bei allen angebundenen Relying Parties genutzt werden.

Für Unternehmen bedeutet das eine Standard-OIDC-Integration mit [konfigurierbaren ACR-Werten](/oidc-integration-guide/passkey-authentication#passkey-acr-values), automatischem Fallback auf SIM, App oder SMS und der Sicherheit eines Partners wie Swisscom, der diese Lösungen selbst zum Schutz hochkritischer Infrastrukturen einsetzt.

## Sicherheitsprofil nach Nutzungskontext

Alle Mobile ID Methoden bieten starke Authentisierung. Die optimale Wahl hängt vom Einsatzszenario ab. Die zentrale Unterscheidung: Handelt es sich um ein offenes Browser-Szenario mit frei wählbarer URL oder um eine geschlossene Journey?

### Browser-Journeys: Offene URLs und Phishing-Risiko

Im Browser navigiert der Benutzer frei. Er kann auf Links in E-Mails klicken, URLs manuell eintippen oder über Suchmaschinen auf Seiten gelangen. Hier liegt das grösste Phishing-Risiko: Angreifer können Domains fälschen und Login-Seiten täuschend echt nachbauen.

Passkeys bieten in diesem Szenario einen systemischen Vorteil. Durch kryptografisches Origin-Binding ist der Schlüssel fest an die echte Domain gebunden. Der Browser prüft automatisch, ob die anfordernde Domain mit der registrierten übereinstimmt. Eine Phishing-Seite auf `m0bileid.ch` erhält keinen Zugriff auf den Passkey, der für `mobileid.ch` registriert wurde. Das macht Passkeys zur ersten Wahl für reine Web-Logins.

Wichtig: Auch Passkeys sind nicht frei von Angriffsvektoren. Malware auf der Plattform, kompromittierte Browser-Extensions oder Social Engineering auf Betriebssystemebene können jede Methode betreffen. Passkeys eliminieren spezifisch das URL-Spoofing-Problem.

### Geschlossene Journeys: VPN, Remote Desktop, Kiosk, Native Apps

Bei Logins in VPN-Clients, Remote-Desktop-/VDI-Umgebungen, am Kiosk-Terminal, bei nativen App-to-App-Wechseln oder beim Helpdesk-Callback greifen andere Schutzmechanismen. In diesen Szenarien gibt es keine frei wählbare URL. Die Verbindung wird durch den Client oder die Infrastruktur kontrolliert. URL-Spoofing ist kein Angriffsvektor.

Mobile ID SIM und App bieten hier starke Sicherheit durch Hardware-Bindung (EAL5+), Geofencing, Number Matching und Transaction Signing. Passkeys sind in vielen dieser Szenarien gar nicht einsetzbar: WebAuthn ist eine Browser-Technologie, und VPN-Clients oder Remote-Desktop-Sitzungen (kein BLE-Kanal zum Authenticator!) unterstützen sie oft nicht.

### SIM und App auch im Browser nutzbar

SIM und App können auch für Browser-Logins eingesetzt werden. Nicht jeder Use Case erfordert maximale Phishing-Resistenz im Browser. Für viele Anwendungen ist die bewährte Push-basierte Authentisierung via SIM oder App eine pragmatische und sichere Lösung. Mobile ID deckt mit OIDC und REST API alle Szenarien ab.

<div class="blog-infographic">
  <img src="/release-notes/media/infografik-methoden-szenarien.webp" alt="Authentifizierungsmethoden im Überblick: Passkeys, SIM und App im Szenarien-Vergleich" />
</div>

## Warum SIM und App unverzichtbar bleiben

Passkeys sind eine starke Ergänzung für Browser-Szenarien. SIM und App spielen ihre einzigartigen Stärken dort aus, wo WebAuthn an Grenzen stösst.

### Mobile ID SIM

Die SIM-basierte Methode nutzt die Mobile-ID-fähige SIM-Karte (oder eSIM) als sicheren Hardware-Token. Über 6 Millionen Schweizer SIM-Karten bei Swisscom, Sunrise, UPC und Salt sind Mobile-ID-fähig. Die kryptografischen Schlüssel werden direkt auf der SIM gespeichert, die nach dem Schutzprofil **EAL5+** (ISO/IEC 15408) und Evaluation Level E3 (ITSEC) zertifiziert ist.

Die SIM-Methode benötigt keine App-Installation und keine App-Store-Abhängigkeit. Die Authentisierung wird als SIM-Toolkit-Overlay direkt über der Fachapplikation angezeigt. Sie funktioniert auf jedem Mobilgerät, auch auf Geräten ohne Smartphone-Betriebssystem, und über den GSM-Kanal. Über SMS-over-IP und WiFi ist die SIM-Methode auch bei fehlender Mobilfunkverbindung nutzbar.

Beim Gerätewechsel steckt der Benutzer die SIM einfach um. Das Konto bleibt erhalten, ohne erneute Registrierung. Die SIM-basierte Standortverifikation ist besonders vertrauenswürdig, weil die Position im Mobilfunknetz schwer zu manipulieren ist.

### Mobile ID App

Die Mobile ID App (iOS und Android) bietet neben biometrischer Authentisierung ein breites Spektrum an Zusatzfunktionen, die mit Passkeys nicht abbildbar sind:

**Push-basierte Authentisierung** mit Biometrie oder Passcode als zweitem Faktor. **Geofencing** mit GPS-basierter Standortbestimmung und integrierter Jailbreak- und Mock-Service-Erkennung, die GPS-Spoofing erschwert. **Number Matching**, bei dem der Benutzer eine auf dem Bildschirm angezeigte Zahl in der App bestätigt. **[Transaction Signing](/oidc-integration-guide/message-formats)**, das Transaktionsdaten (z.B. "Bestätige die Überweisung von CHF 1'000 auf Konto XY") direkt auf dem Gerät anzeigt und die explizite Zustimmung des Benutzers erfordert. App-to-App-Wechsel ermöglicht in Banking-Szenarien den automatisierten Wechsel von der Fachapplikation zur Mobile ID App und zurück.

Die App basiert auf der Technologie von Futurae (ETH Zürich Spin-off) und nutzt das Trusted Execution Environment (TEE) des Geräts. Sie ist weltweit in freigegebenen Ländern über den App Store verfügbar.

## Passkeys-Plus: Der Hybrid Auth Flow für nahezu AAL3

NIST AAL3 ist ein extrem hoher Sicherheitsstandard. Echtes AAL3 bedingt unter anderem ein nach FIPS 140-2 validiertes Hardware-Modul, was von der konkreten Gerätekonfiguration abhängt. Für hochkritische Systeme nutzt Swisscom intern bereits das Modell **Passkeys-Plus**, das ein sehr hohes Sicherheitsniveau anstrebt.

Der Ansatz kombiniert zwei bereits existierende Komponenten zu einem Hybrid Auth Flow:

**Schritt 1: Cloud-Sync Passkey (AAL2).** Der Benutzer authentisiert sich im Browser mit einem Passkey. Dies bietet breite Ökosystem-Unterstützung und phishing-resistentes Origin-Binding.

**Schritt 2: Mobile ID Push Step-Up.** Anschliessend erhält der Benutzer einen Push auf sein Smartphone. Mobile ID Push nutzt Public-Key-Kryptografie mit nicht exportierbaren, gerätegebundenen Schlüsseln. Der Benutzer bestätigt mit Biometrie oder Passcode. Optional kommen Geoblocking und User-Consent-Anzeige hinzu.

Die Kombination liefert: Origin-gebundenen Login plus gerätegebundenen, nicht exportierbaren Schlüssel plus expliziten User Consent plus Geolokation. Damit ist AAL3 in Deployments möglich, in denen der zweite Faktor auf geeigneter FIPS-140-2-zertifizierter Hardware läuft. Ob dies regulatorisch in jedem Fall als vollständiges AAL3 anerkannt wird, muss weiterhin pro Use Case, Hardwarebasis und Compliance-Rahmen beurteilt werden. Eine breitere Abdeckung mit FIPS-validierter Kryptografie und Device Attestation im Mobile ID Push Step ist erst nach zukünftigen Erweiterungen vollständig gegeben.

Der Push-Schritt bleibt auf dem Smartphone. Am Desktop authentisiert sich der Benutzer lokal mit dem Passkey, und der Step-Up erfolgt out-of-band über das Telefon.

<div class="blog-infographic">
  <img src="/release-notes/media/infografik-hybrid-auth.webp" alt="Hybrid-Authentifizierung für NIST AAL3: Cloud-Sync Passkey kombiniert mit Mobile ID Push Step-Up" />
</div>

<HybridAuthFlow />

## Mobile ID Authentication Levels: Granulare Steuerung über ACR-Werte

Neben diesen externen Referenzrahmen definiert Mobile ID eigene Authentication Levels (AL2–AL4) als ACR-Werte im [OIDC Authorization Request](/oidc-integration-guide/getting-started#authorization-code-request). Diese Werte legen fest, welche Authentisierungsmethoden für einen Login erlaubt sind. Mobile ID orientiert sich dabei an der vierstufigen Logik aus ISO/IEC 29115. `AL4` bezeichnet entsprechend die höchste Mobile-ID-Sicherheitsstufe. Die vollständige ACR-Matrix ist im [OIDC Integration Guide](/oidc-integration-guide/getting-started#authentication-context-class-reference-acr) dokumentiert.

<AcrLevels />

Im Modus `mid_al4_passkey` wird eine Passkey-only-Authentisierung erzwungen, die echte Phishing-Resistenz ohne schwache Fallbacks garantiert. Für maximale Flexibilität erlaubt `mid_al2_any` alle verfügbaren Methoden einschliesslich SMS. Mit `mid_al4_any` wird die Passkey-Authentisierung bevorzugt, mit Fallback auf SIM oder App.

Während die meisten Provider Passkeys nur als einfachen Passwort-Ersatz mit unsicheren Wiederherstellungswegen anbieten (Google, PayPal, GitHub und selbst SBB erlauben OTP-E-Mail als Fallback), ermöglicht Mobile ID die Durchsetzung strenger Sicherheitspolicies und die Einschränkung auf FIPS-zertifizierte Authenticatoren über AAGUID-Validierung gegen die FIDO Metadata Service Datenbank.

## Registration und Login Flows

Der technische Rollout ist für Relying Parties denkbar einfach.

### Zentrale Registrierung auf mobileid.ch

Benutzer verwalten ihre Passkeys über das [MyMobileID Dashboard](/oidc-integration-guide/passkey-authentication#passkey-registration) auf mobileid.ch/login. Dort macht eine neue Kachel sichtbar, wo Passkeys zentral registriert und gepflegt werden. Die Passkeys werden auf der Domain m.mobileid.ch gespeichert und stehen anschliessend bei allen angebundenen Relying Parties zur Verfügung.

Die neue Dashboard-Ansicht zeigt den Einstiegspunkt und die zentrale Verwaltung auf einen Blick:

<ScreenshotStep img="/release-notes/media/manage-passkeys-button.jpg" alt="MyMobileID Dashboard: Mobile ID Passkey Kachel mit MANAGE PASSKEYS Button">
<p>Die Kachel <strong>Manage Passkeys</strong> ist der zentrale Einstiegspunkt für das neue Passkey-Feature in MyMobileID. Hier starten Benutzer die Registrierung und Verwaltung ihrer Passkeys.</p>
</ScreenshotStep>

<ScreenshotStep img="/release-notes/media/manage-passkeys-2.jpg" alt="Passkey-Verwaltung in MyMobileID mit Liste registrierter Passkeys">
<p>Nach dem Öffnen sehen Benutzer ihre bereits registrierten Passkeys in einer übersichtlichen Verwaltungsansicht und können ihr Passkey-Portfolio bei Bedarf erweitern oder pflegen.</p>
</ScreenshotStep>

<PasskeyRegistrationFlow />

### RP-Login via OIDC

Für typische Login-Szenarien bei einer Relying Party steht im Dashboard neu auch der <strong>Mobile ID Check</strong> zur Verfügung. Damit können Benutzer ihre aktivierten Mobile ID Methoden in einem realistischen Authentisierungs-Use-Case testen:

<ScreenshotStep img="/release-notes/media/passkey-check-button.jpg" alt="MyMobileID Dashboard: Mobile ID Check Kachel mit TEST Button">
<p>Die Kachel <strong>Mobile ID Check</strong> bietet einen einfachen Einstieg, um vorhandene Mobile ID Methoden wie SIM, App oder neu auch Passkey direkt im Dashboard zu testen.</p>
</ScreenshotStep>

<ScreenshotStep img="/release-notes/media/passkey-check-2.jpg" alt="Mobile ID Check mit Auswahl der verfügbaren Methoden App und Passkey">
<p>Ist bereits mindestens ein Passkey registriert, erscheint Passkey als auswählbare Methode. So lässt sich die neue Login-Option vor dem produktiven Einsatz in einem typischen [Login-Flow](/oidc-integration-guide/passkey-authentication#authentication-flow-oidc) schnell validieren.</p>
</ScreenshotStep>

Je nach konfiguriertem [ACR-Wert](/oidc-integration-guide/passkey-authentication#passkey-acr-values) wird der passende Flow ausgelöst. Bei `mid_al4_passkey` wird ausschliesslich ein Passkey akzeptiert. Bei `mid_al2_any` kann der Benutzer zwischen Passkey, SIM, App oder SMS wählen. Bei Fehlern oder fehlenden Passkeys kann die RP einen sicheren [Fallback](/oidc-integration-guide/passkey-authentication#passkey-only-vs-fallback) auf andere Methoden zulassen.

<PasskeyLoginFlow />

## Roadmap: Der Mobile ID Passkey Vault

Mit dem Mobile ID Passkey Vault befindet sich eine Roadmap-Lösung in Entwicklung, die AAL3 mit der Mobile ID App ermöglichen soll. Ziel ist ein Authenticator, der die strengen Anforderungen von AAL3 erfüllt und auf demselben Sicherheitsniveau spielt wie ein FIPS-zertifizierter Hardware-Key, dabei aber vollständig ins Mobile-ID-Ökosystem integriert bleibt.

Gegenüber physischen Hardware-Keys bietet der Passkey Vault klare operative Vorteile: Die Passkey-Anmeldung lässt sich direkt mit Geoblocking und explizitem User Consent kombinieren, und der Authenticator lässt sich deutlich einfacher und kostengünstiger ausrollen und skalieren als teure Hardware-Token.

Die Mobile ID App entwickelt sich damit zu einem skalierbaren Software-Authenticator, der SIM-Authentisierung, Push-basierte MFA, Passkey-Funktionalität und Transaction Signing in einer einzigen Anwendung vereint.

## Fazit: Alles aus einer Hand

Mit der Einführung von Passkeys festigt Mobile ID seine Position als einzigartiges Ökosystem, das alle relevanten Authentisierungsmethoden unter einem Dach vereint. Passkeys für phishing-resistente Browser-Logins. SIM für höchste Hardware-Sicherheit ohne App-Installation. App für Geofencing, Transaction Signing und weltweite Nutzbarkeit. Und mit dem Hybrid Auth Flow eine Lösung, die nahezu AAL3-Niveau erreicht, ohne dass jeder Benutzer einen Hardware-Token besitzen muss.

Unternehmen profitieren von einer Standard-OIDC-Integration, Schweizer Datenhaltung und der Sicherheit eines Partners, der diese Lösungen selbst zum Schutz hochkritischer Infrastrukturen einsetzt.

**Der Kunde entscheidet, welche Methode für seinen Use Case am besten passt. Mobile ID liefert die Flexibilität dazu.**

*Mobile ID: die richtige Methode für jedes Szenario. Alles aus einem Ökosystem.*

Wenn Sie Ihren Use Case besprechen möchten, kontaktieren Sie uns über [swisscom.ch/mobileid](https://www.swisscom.ch/mobileid).
