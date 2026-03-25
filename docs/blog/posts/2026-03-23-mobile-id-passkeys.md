---
title: "Mobile ID Passkeys: Phishing-resistente Authentisierung für Browser-Szenarien"
date: 2026-03-23
author: Mobile ID Team
description: "Passkeys ermöglichen phishing-resistente Logins per Biometrie in unter 3 Sekunden. Mobile ID integriert sie nativ ins OIDC Ecosystem — und zeigt, warum SIM und App weiterhin unverzichtbar sind."
thumbnail: /blog/img/passkeys-thumb.png
lang: de
readingTime: 8
layout: blog-post
---

<script setup>
import ComparisonTable from '../../.vitepress/theme/components/ComparisonTable.vue'
import AcrLevels from '../../.vitepress/theme/components/AcrLevels.vue'
import PasskeyRegistrationFlow from '../../.vitepress/theme/components/PasskeyRegistrationFlow.vue'
import PasskeyLoginFlow from '../../.vitepress/theme/components/PasskeyLoginFlow.vue'
import SzenarienMatrix from '../../.vitepress/theme/components/SzenarienMatrix.vue'
import PasskeyTypesCards from '../../.vitepress/theme/components/PasskeyTypesCards.vue'
import HybridAuthFlow from '../../.vitepress/theme/components/HybridAuthFlow.vue'
import PasskeyVaultRoadmap from '../../.vitepress/theme/components/PasskeyVaultRoadmap.vue'
</script>

<div class="blog-lead">
In einer Zeit, in der Microsoft täglich rund 7'000 Passwort-Angriffe blockiert und 47 % der Konsumenten einen Kauf abbrechen, wenn sie ihr Passwort vergessen, ist der Umstieg auf moderne Verfahren unumgänglich. <strong>Passkeys</strong> sind die Antwort — und Mobile ID integriert sie jetzt nativ in sein OIDC Ecosystem.
</div>

<div class="blog-infographic">
  <img src="/blog/media/infografik-overview.png" alt="Mobile ID Passkeys — Übersicht des Ecosystems mit zentraler Passkey-Verwaltung und OIDC-Integration" />
</div>

## Die Evolution der passwortlosen Freiheit

Passkeys ermöglichen einen Login per Biometrie in unter 3 Sekunden und bieten durch kryptografisches Origin-Binding einen systemischen Schutz vor Phishing. Das Besondere an Mobile ID: Ein Passkey wird zentral über das MyMobileID Portal auf mobileid.ch registriert und kann anschliessend bei allen Relying Parties (RPs) genutzt werden, die Mobile ID über OIDC angebunden haben. Damit entfällt für Unternehmen der mühsame Aufbau einer eigenen Passkey-Infrastruktur.

<ComparisonTable />

## Passkey-Typen: Komfort vs. maximale Sicherheit

Nicht alle Passkeys sind gleich. Die wesentlichen Typen, die je nach Schutzbedarf gewählt werden:

- **Cloud-Synced Passkeys** (z.B. Apple iCloud Keychain, Google Password Manager): Auf allen Geräten des Benutzers verfügbar, beste User Experience. Da die Schlüssel exportierbar sind und in der Cloud liegen, erfüllen sie nach NIST-Standard lediglich das Level **AAL2**.
- **Device-Bound Passkeys** (z.B. YubiKey): Der private Schlüssel verlässt die Hardware nie. Höchste Sicherheit, **AAL3-konform**, erfordert jedoch physische Token.
- **Platform Authenticators**: Direkt im Gerät verbaute Hardware-Module (wie Windows Hello oder Touch ID), die je nach Implementierung synchronisiert oder gerätegebunden sein können.

<div class="blog-infographic">
  <img src="/blog/media/infografik-passkey-typen.png" alt="Passkey-Typen im Sicherheitsvergleich — Cloud-Synced, Device-Bound und Platform Authenticators" />
</div>

<PasskeyTypesCards />

## Sicherheitsprofil nach Nutzungskontext

Alle Mobile ID Methoden bieten starke Authentisierung — die optimale Wahl hängt vom Einsatzszenario ab.

**Browser-Szenarien (Offene URLs):** Passkeys bieten hier einen zusätzlichen Vorteil: Durch kryptografisches Origin-Binding ist der Schlüssel fest an die echte Domain gebunden. Das macht sie zur ersten Wahl für reine Web-Logins.

**Geschlossene Szenarien (VPN, App-to-App, Kiosk):** Bei Logins in VPN-Clients, App-to-App-Wechseln im Banking oder am Kiosk-Terminal greifen andere Schutzmechanismen. Mobile ID SIM und App bieten hier starke Sicherheit durch Hardware-Bindung (EAL5+), Geofencing und Number Matching — Szenarien, in denen Passkeys oft gar nicht einsetzbar sind.

Wichtig: Auch Passkeys sind nicht frei von Angriffsvektoren — Malware auf der Plattform, kompromittierte Browser-Extensions oder Social Engineering auf Betriebssystemebene können jede Methode betreffen. Echte Sicherheit entsteht durch die richtige Methode für den jeweiligen Kontext.

## Warum SIM und App unverzichtbar bleiben

Passkeys sind eine starke Ergänzung für Browser-Szenarien. SIM und App spielen ihre einzigartigen Stärken dort aus, wo WebAuthn an Grenzen stösst:

- **Mobile ID SIM:** Höchste Hardware-Sicherheit (EAL5+) auf 6 Millionen Schweizer SIM-Karten. Funktioniert ohne App-Installation, auf jedem Mobilgerät (auch ohne Smartphone) und sogar ohne Internetverbindung über den GSM-Kanal.
- **Mobile ID App:** Ermöglicht neben biometrischer Authentisierung auch **Geofencing** (Standortüberprüfung), **Number Matching** und die Anzeige von Transaktionstexten (Transaction Signing) direkt auf dem Gerät.

<div class="blog-infographic">
  <img src="/blog/media/infografik-methoden-szenarien.png" alt="Authentifizierungsmethoden im Überblick — Passkeys, SIM und App im Szenarien-Vergleich" />
</div>

<SzenarienMatrix />

## Passkeys-Plus: Der Hybrid Auth Flow für AAL3

Für hochkritische Systeme nutzt Swisscom intern bereits das Modell **«Passkeys-Plus»**. Dabei werden benutzerfreundliche Cloud-Sync Passkeys mit einem Mobile ID Push Step-Up kombiniert. Dieser Flow erreicht das Sicherheitsniveau **NIST AAL3**, indem er die kryptografische Stärke von Passkeys mit der Hardware-Bindung und dem expliziten User Consent der Mobile ID App vereint.

<div class="blog-infographic">
  <img src="/blog/media/infografik-hybrid-auth.png" alt="Hybrid-Authentifizierung für NIST AAL3 — Cloud-Sync Passkey kombiniert mit Mobile ID Push Step-Up" />
</div>

<HybridAuthFlow />

## NIST AAL: Höchste Standards für regulierte Branchen

In Branchen wie Banking oder Healthcare wird zunehmend der Standard **NIST AAL3** (Authenticator Assurance Level 3) gefordert. Mobile ID ermöglicht dies über den Modus `MID_AL4_PASSKEY`, der echte Phishing-Resistenz ohne schwache Fallbacks garantiert. Während die meisten Provider Passkeys nur als einfachen Passwort-Ersatz mit unsicheren Wiederherstellungswegen anbieten, erlaubt Mobile ID die granulare Steuerung über ACR-Werte und die Durchsetzung von FIPS-zertifizierten Authenticatoren.

<AcrLevels />

## Registration & Login Flows

Der technische Rollout ist für Relying Parties denkbar einfach:

### Zentrale Registrierung auf mobileid.ch

Benutzer verwalten ihre Passkeys auf mobileid.ch/login. Dort können sie über das Dashboard («Manage Passkeys») neue Keys hinzufügen, die sicher auf der Domain m.mobileid.ch gespeichert werden.

1. Login auf mobileid.ch (Verifizierung via SMS-OTP)
2. Im Dashboard die Kachel «Mobile ID Passkeys» → «MANAGE PASSKEYS»
3. «Add a passkey» → Nativer Browser-Dialog (Touch ID / Face ID)
4. Biometrische Bestätigung → Passkey registriert auf mobileid.ch Origin
5. Der neue Passkey steht sofort für alle Relying Parties zur Verfügung

<div class="blog-infographic">
  <img src="/blog/media/infografik-flows.png" alt="Passkey Registration und Login Flows — zentrale Verwaltung und OIDC-basierter Login" />
</div>

<PasskeyRegistrationFlow />

### RP-Login via OIDC

Wenn ein Benutzer bei einer RP (z.B. acme.com) auf «Sign in with Mobile ID» klickt, erfolgt ein Redirect zu Mobile ID. Je nach konfiguriertem ACR-Wert (z.B. `mid_al4_passkey` für maximale Sicherheit oder `mid_al2_any` für maximale Flexibilität) wird der passende Flow ausgelöst. Bei Fehlern oder fehlenden Passkeys kann die RP einen sicheren Fallback auf SIM, App oder SMS zulassen.

<PasskeyLoginFlow />

## Roadmap: Der Mobile ID Passkey Vault

Mobile ID arbeitet am **Passkey Vault**. Dabei wird die Mobile ID App selbst zu einem **3rd-party Passkey Provider** auf iOS und Android.

- **Vorteil:** Device-bound Passkeys (AAL3-Niveau) können ohne zusätzliche Hardware-Tokens wie YubiKeys flächendeckend ausgerollt werden.
- **Souveränität:** Die Datenhaltung bleibt in der Schweiz, unabhängig von US-Big-Tech-Clouds.
- **Phasen:** Nach dem MVP für mobile Plattformen folgt die Unterstützung für Desktop-Systeme und ein Ende-zu-Ende verschlüsselter Schweizer Cloud-Sync-Service.

<div class="blog-infographic">
  <img src="/blog/media/infografik-hybrid-auth-2.png" alt="Passkey Vault Roadmap — Phasen der Mobile ID Passkey-Provider-Entwicklung" />
</div>

<PasskeyVaultRoadmap />

## Fazit: Alles aus einer Hand

Mit der Einführung von Passkeys festigt Mobile ID seine Position als einzigartiges Ökosystem, das alle relevanten Methoden unter einem Dach vereint. Unternehmen profitieren von einer Standard-OIDC-Integration, Schweizer Datenhaltung und der Sicherheit eines Partners wie Swisscom, der diese Lösungen selbst zum Schutz hochkritischer Infrastrukturen einsetzt.

**Der Kunde entscheidet, welche Methode für seinen Use Case am besten passt — Mobile ID liefert die Flexibilität dazu.**

*Mobile ID — die richtige Methode für jedes Szenario. Alles aus einem Ökosystem.*
