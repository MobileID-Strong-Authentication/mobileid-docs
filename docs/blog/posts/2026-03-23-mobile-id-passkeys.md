---
title: "Mobile ID Passkeys: Die Zukunft der passwortlosen Authentisierung in der Schweiz"
date: 2026-03-23
author: Mobile ID Team
description: "Passwortlose Sicherheit ist keine Vision mehr, sondern Realität. Mit der Integration von FIDO2-Passkeys in das Mobile ID Ecosystem hebt Swisscom die digitale Identität auf ein neues Level."
thumbnail: /blog/img/passkeys-thumb.png
lang: de
readingTime: 6
layout: blog-post
---

<script setup>
import AudioPlayer from '../../.vitepress/theme/components/AudioPlayer.vue'
import VideoEmbed from '../../.vitepress/theme/components/VideoEmbed.vue'
import ComparisonTable from '../../.vitepress/theme/components/ComparisonTable.vue'
import AcrLevels from '../../.vitepress/theme/components/AcrLevels.vue'
import PasskeyRegistrationFlow from '../../.vitepress/theme/components/PasskeyRegistrationFlow.vue'
import PasskeyLoginFlow from '../../.vitepress/theme/components/PasskeyLoginFlow.vue'
</script>

<AudioPlayer src="/blog/media/passkeys-podcast.mp3" title="Lieber hören statt lesen? Podcast: Phishing-resistente Firmenlogins mit Mobile ID" />

<div class="blog-lead">
Passwortlose Sicherheit ist keine Vision mehr, sondern Realität. Mit der Integration von FIDO2-Passkeys in das Mobile ID Ecosystem hebt Swisscom die digitale Identität in der Schweiz auf ein neues Level an Sicherheit und Benutzerfreundlichkeit.
</div>

## Was sind Passkeys und warum brauchen wir sie?

Passkeys basieren auf dem weltweiten FIDO2-Standard und nutzen asymmetrische Kryptografie. Anstatt sich unsichere Passwörter zu merken, authentisieren sich Benutzer einfach über die Biometrie ihres Geräts — zum Beispiel per Face ID, Touch ID oder Windows Hello.

Der entscheidende Vorteil: Passkeys sind **phishing-resistent**. Da sie fest an die Domäne gebunden sind, können sie nicht auf gefälschten Webseiten abgefangen werden. Während herkömmliche MFA-Methoden (wie Passwörter kombiniert mit SMS) oft nur eine Phishing-Resistenz von 20–50 % aufweisen, bieten FIDO2-basierte Verfahren einen Schutz von über 99 %.

<div class="blog-infographic">
  <img src="/blog/img/passkeys-infographic.png" alt="Mobile ID Passkeys Infografik — zentrale Verwaltung, OIDC-Integration, Authentisierungslevel" />
</div>

## Warum Mobile ID Passkeys?

Mobile ID ist der erste Schweizer Identity Provider, der Passkeys nativ in sein bewährtes OpenID Connect (OIDC) Ecosystem integriert. Für Unternehmen (Relying Parties) bedeutet dies:

- **Keine eigene Infrastruktur:** Kein eigenes Passkey-Backend oder WebAuthn-Expertise nötig.
- **Einfache Integration:** Einbindung über den Standard-OIDC-Service.
- **Zentrales Management:** Benutzer verwalten ihre Passkeys zentral im MyMobileID Portal auf mobileid.ch. Einmal registriert, kann derselbe Passkey bei allen teilnehmenden Services genutzt werden.
- **Schweizer Lösung:** Alle Daten bleiben in der Schweiz, ohne Abhängigkeit von US Big Tech.

<ComparisonTable />

## NIST AAL3: Höchste Sicherheit für regulierte Branchen

Für Branchen wie Banking, Healthcare oder E-Government ermöglicht Mobile ID den NIST Authenticator Assurance Level 3 (AAL3). Durch den Modus „Passkey-only" (`mid_al4_passkey`) entfallen unsichere Fallbacks — echte Phishing-Resistenz mit hardwarebasierten, nicht-exportierbaren Schlüsseln.

<AcrLevels />

## Der Registrierungs-Flow (auf mobileid.ch)

Die Registrierung erfolgt zentral über das MyMobileID Dashboard:

1. Login auf mobileid.ch (Verifizierung via SMS-OTP)
2. Im Dashboard die Kachel „Mobile ID Passkeys" → „MANAGE PASSKEYS"
3. „Add a passkey" → Nativer Browser-Dialog (Touch ID / Face ID)
4. Biometrische Bestätigung → Passkey registriert auf mobileid.ch Origin
5. Der neue Passkey steht sofort für alle Relying Parties zur Verfügung

<PasskeyRegistrationFlow />

<VideoEmbed src="/blog/media/passkeys-explainer.mp4" />

## Der Login-Flow (bei der Relying Party)

1. Benutzer klickt auf der RP-Webseite „Sign in with MobileID"
2. OIDC Redirect zu mobileid.ch (Authorization Code Flow)
3. Passkey-Authentisierung per Biometrie auf mobileid.ch
4. Redirect zurück zur RP mit Authorization Code → Login Success

**Flexibler Fallback:** Falls Passkey fehlschlägt → Dropdown „Select another method" → Mobile ID SIM, App oder SMS. Gesteuert über ACR-Werte (`mid_al2_any` bis `mid_al4_passkey`).

<PasskeyLoginFlow />

## Swisscom: Ihr Partner für sichere Identitäten

Mobile ID Passkeys vereinen SIM-basierte Sicherheit, App-Komfort und modernste Passkey-Technologie in einem einzigen Service. Profitieren Sie von geringeren Supportkosten, reduzierten Authentisierungsfehlern und höchster Sicherheit.

<div class="blog-download-banner">
  <h3>Mobile ID Passkey Blueprint</h3>
  <p>Detailliertes Slide Deck zum Download</p>
  <a href="/blog/media/passkeys-blueprint.pdf" download>📄 PDF herunterladen</a>
</div>
