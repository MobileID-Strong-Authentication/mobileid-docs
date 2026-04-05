---
title: "Mobile ID Passkeys: authentification résistante au phishing pour les scénarios navigateur"
date: 2026-03-30
author: Mobile ID Team
description: "Les Passkeys permettent des connexions résistantes au phishing par biométrie en moins de 3 secondes. Mobile ID les intègre nativement dans l'écosystème OIDC et montre pourquoi la SIM et l'App restent indispensables."
thumbnail: /release-notes/img/passkeys-thumb.png
lang: fr
readingTime: 12
layout: release-notes-post
video:
  title: "Mobile ID Passkeys: authentification résistante au phishing pour les scénarios navigateur"
  description: "Courte vidéo explicative sur la place des Passkeys dans l'écosystème Mobile ID."
  src: /release-notes/media/passkey-advantage.mp4
  poster: /release-notes/img/passkeys-thumb.png
  duration: PT6M56S
  uploadDate: 2026-03-30T00:00:00.000Z
---

<script setup>
import AcrLevels from '../../.vitepress/theme/components/AcrLevels.vue'
import PasskeyRegistrationFlow from '../../.vitepress/theme/components/PasskeyRegistrationFlow.vue'
import PasskeyLoginFlow from '../../.vitepress/theme/components/PasskeyLoginFlow.vue'
import PasskeyTypesCards from '../../.vitepress/theme/components/PasskeyTypesCards.vue'
import HybridAuthFlow from '../../.vitepress/theme/components/HybridAuthFlow.vue'
import LanguageSwitcher from '../../.vitepress/theme/components/LanguageSwitcher.vue'
import ScreenshotStep from '../../.vitepress/theme/components/ScreenshotStep.vue'
import VideoEmbed from '../../.vitepress/theme/components/VideoEmbed.vue'
</script>

<LanguageSwitcher />

<div class="blog-lead">
Microsoft bloque chaque jour environ 7'000 attaques par mot de passe par seconde, et 47 % des consommateurs abandonnent un achat lorsqu'ils ont oublié leur mot de passe. Dans un monde où le phishing reste le vecteur d'attaque le plus courant, une réponse fondamentalement nouvelle s'impose. Les <strong>Passkeys</strong> sont cette réponse. Mobile ID les intègre désormais nativement dans son écosystème OIDC et les combine avec les atouts éprouvés de la SIM et de l'App.
</div>

<VideoEmbed src="/release-notes/media/passkey-advantage.mp4" poster="/release-notes/img/passkeys-thumb.png" link-text="Ouvrir le MP4">
  Courte vidéo explicative sur la place des Passkeys dans l'écosystème Mobile ID.
</VideoEmbed>

## NIST AAL : le cadre de référence pour les niveaux de sécurité

Avant d'examiner chaque méthode en détail, il est essentiel de disposer d'une compréhension commune des niveaux de sécurité. Le standard NIST SP 800-63B définit trois Authenticator Assurance Levels (AAL) qui servent de cadre de référence dans les secteurs réglementés tels que la banque, la santé et le secteur public.

**AAL1** exige uniquement une authentification à facteur unique. Les mots de passe, les SMS-OTP ou les tokens simples satisfont ce niveau. Le degré de sécurité est faible.

**AAL2** requiert deux facteurs distincts. De plus, une option résistante au phishing doit être proposée pour les services en ligne. Les Cloud-Synced Passkeys, les générateurs TOTP, le Mobile Push (comme Mobile ID SIM ou App) et les appareils OTP multifacteurs satisfont AAL2.

**AAL3** est le niveau le plus élevé. Il exige la cryptographie à clé publique, un module matériel validé FIPS 140 niveau 2 ou supérieur, des procédés résistants au phishing et une clé privée non exportable. Une ré-authentification après 15 minutes d'inactivité est également requise. Seuls quelques authenticateurs remplissent pleinement ces exigences : les clés de sécurité certifiées FIPS (par ex. YubiKey 5 FIPS Series), certaines smartcards et les Hardware Security Modules.

## Que sont les Passkeys ?

Les Passkeys sont une implémentation conviviale du standard FIDO2 et de l'API WebAuthn. Ils remplacent les mots de passe par des paires de clés cryptographiques et permettent une connexion par biométrie en moins de 3 secondes. Le principe fondamental : la clé privée ne quitte jamais l'appareil de l'utilisateur. L'authenticateur signe un challenge que le serveur vérifie à l'aide de la clé publique.

La particularité des Passkeys réside dans le mécanisme d'Origin-Binding : la clé est liée cryptographiquement au domaine du service. Même si un utilisateur arrive sur une page de phishing parfaitement reproduite, l'authentification échoue car le navigateur détecte le domaine incorrect et ne libère pas la clé.

## Types de Passkeys : confort vs. sécurité maximale

Tous les Passkeys ne se valent pas. Selon le niveau de protection requis, différents types sont utilisés. Ce choix a un impact direct sur le niveau de sécurité atteignable.

### Cloud-Synced Passkeys

Les Cloud-Synced Passkeys sont synchronisés via l'infrastructure cloud du fournisseur de plateforme : Apple iCloud Keychain, Google Password Manager ou des gestionnaires tiers comme 1Password. Dans les principaux écosystèmes grand public, la synchronisation cloud est devenue l'expérience utilisateur par défaut, car elle maximise la récupération et l'usage multi-appareils.

Le grand avantage : les Passkeys sont disponibles sur tous les appareils du même écosystème. En cas de perte d'un appareil, l'accès est maintenu via les autres appareils. La synchronisation est protégée par un chiffrement de bout en bout. Les Cloud-Synced Passkeys peuvent également être partagés avec des membres de la famille ou des amis, ce qui signifie aussi qu'ils peuvent se retrouver sur des appareils non fiables.

Niveau de sécurité : **AAL2**. Les clés étant exportables et stockées dans des infrastructures cloud (soumises au US CLOUD Act), elles ne satisfont pas les exigences AAL3.

### Device-Bound Passkeys

Avec les Device-Bound Passkeys, la clé privée ne quitte jamais le matériel de sécurité. Les représentants typiques sont les clés de sécurité certifiées FIPS telles que la YubiKey 5 FIPS Series (FIPS 140-2 Cert #3907, env. CHF 100 chez Digitec). Elles offrent le niveau de sécurité le plus élevé et sont conformes AAL3.

Point important : les YubiKeys standard (sans certification FIPS) ne suffisent pas pour AAL3. En septembre 2024, une vulnérabilité grave a été découverte dans la série YubiKey 5, qui ne peut pas être corrigée par mise à jour du firmware et nécessite un remplacement physique du token. Cela illustre un problème fondamental des tokens physiques : les failles de sécurité peuvent être coûteuses et complexes à corriger.

Niveau de sécurité : **AAL3** (uniquement avec certification FIPS 140-2 et firmware 5.7 ou ultérieur).

### Platform Authenticators

Les Platform Authenticators sont des modules de sécurité intégrés directement dans l'appareil, comme Windows Hello (TPM), Apple Touch ID/Face ID (Secure Enclave) ou la puce Titan M2 dans les appareils Google Pixel. Selon la configuration, ils peuvent fonctionner en mode Cloud-Synced ou Device-Bound.

AAL3 n'est atteignable que si la clé n'est pas synchronisée dans le cloud et si le composant matériel est validé FIPS. Dans la pratique, cela exige une configuration liée à l'appareil ou un authentificateur externe qui conserve la clé privée en dehors d'un magasin d'identifiants synchronisé dans le cloud.

### Fournisseurs de Passkeys tiers

Depuis iOS 17 et Android 14, des fournisseurs tiers peuvent s'enregistrer comme Passkey Provider. La Credential Manager API (Android) et AuthenticationServices (iOS) permettent aux applications d'authentification de créer et de gérer des Passkeys sans que l'utilisateur ne dépende du stockage natif de Passkeys du système.

C'est le fondement technique du futur Mobile ID Passkey Vault : l'application Mobile ID deviendra elle-même un Passkey Provider et pourra gérer des Device-Bound Passkeys au niveau AAL3, sans nécessiter de tokens matériels physiques.

<div class="blog-infographic">
  <img src="/release-notes/media/infografik-passkey-typen.webp" alt="Types de Passkeys comparés en termes de sécurité : Cloud-Synced, Device-Bound et Platform Authenticators" />
</div>

<PasskeyTypesCards />

## Intégration des Passkeys : simple pour les utilisateurs, complexe pour les entreprises

Les Passkeys promettent une expérience utilisateur simple. La réalité technique en coulisse est toutefois exigeante. Une infrastructure Passkey complète nécessite :

Un **backend WebAuthn** avec bibliothèque serveur FIDO2, validation de l'attestation, gestion des credentials et stockage sécurisé des clés. Un **Credential Lifecycle Management** pour l'enregistrement, la désactivation, la récupération et la gestion de plusieurs Passkeys par utilisateur. Des **[mécanismes de fallback](/oidc-integration-guide/passkey-authentication#passkey-only-vs-fallback)** pour les utilisateurs sans appareil compatible Passkey ou en cas d'échec d'authentification. Des **vérifications de conformité** pour les secteurs réglementés, incluant la [validation AAGUID](/oidc-integration-guide/passkey-authentication#rp-control-over-passkey-quality) contre la base de données FIDO Metadata Service (MDS) et la vérification de certification FIPS.

Mobile ID résout cette complexité : les Relying Parties n'intègrent pas l'infrastructure Passkey elles-mêmes, mais le service OIDC de Mobile ID. L'enregistrement et la gestion des Passkeys se font de manière centralisée sur mobileid.ch. Un Passkey est enregistré une seule fois et peut ensuite être utilisé auprès de toutes les Relying Parties connectées.

Pour les entreprises, cela signifie une intégration OIDC standard avec des [valeurs ACR configurables](/oidc-integration-guide/passkey-authentication#passkey-acr-values), un fallback automatique vers SIM, App ou SMS, et la fiabilité d'un partenaire comme Swisscom, qui utilise lui-même ces solutions pour protéger des infrastructures hautement critiques.

## Profil de sécurité selon le contexte d'utilisation

Toutes les méthodes Mobile ID offrent une authentification forte. Le choix optimal dépend du scénario d'utilisation. La distinction centrale : s'agit-il d'un scénario navigateur ouvert avec URL librement accessible, ou d'un parcours fermé ?

### Parcours navigateur : URL ouvertes et risque de phishing

Dans le navigateur, l'utilisateur navigue librement. Il peut cliquer sur des liens dans des e-mails, saisir des URL manuellement ou accéder à des pages via des moteurs de recherche. C'est là que le risque de phishing est le plus élevé : les attaquants peuvent falsifier des domaines et reproduire des pages de connexion de manière trompeuse.

Les Passkeys offrent dans ce scénario un avantage systémique. Grâce au mécanisme cryptographique d'Origin-Binding, la clé est liée de manière fixe au domaine authentique. Le navigateur vérifie automatiquement si le domaine demandeur correspond au domaine enregistré. Une page de phishing sur `m0bileid.ch` n'obtient aucun accès au Passkey enregistré pour `mobileid.ch`. Cela fait des Passkeys le premier choix pour les connexions purement web.

Important : les Passkeys ne sont pas non plus exempts de vecteurs d'attaque. Les malwares sur la plateforme, les extensions de navigateur compromises ou l'ingénierie sociale au niveau du système d'exploitation peuvent affecter toute méthode. Les Passkeys éliminent spécifiquement le problème de l'usurpation d'URL.

### Parcours fermés : VPN, Remote Desktop, Kiosk, Apps natives

Pour les connexions via clients VPN, environnements Remote Desktop/VDI, terminaux kiosque, transitions App-to-App natives ou rappels du helpdesk, d'autres mécanismes de protection s'appliquent. Dans ces scénarios, il n'y a pas d'URL librement accessible. La connexion est contrôlée par le client ou l'infrastructure. L'usurpation d'URL n'est pas un vecteur d'attaque.

Mobile ID SIM et App offrent ici une sécurité robuste grâce à la liaison matérielle (EAL5+), au Number Matching, au Transaction Signing et au geofencing dans les scénarios pris en charge. Le geofencing côté App s'appuie sur le GPS et des signaux d'intégrité du terminal ; le geofencing SIM pris en charge s'appuie sur les données de localisation du réseau mobile. Les Passkeys ne sont souvent pas utilisables dans nombre de ces scénarios : WebAuthn est une technologie navigateur, et les clients VPN ou les sessions Remote Desktop (pas de canal BLE vers l'authenticateur !) ne les prennent souvent pas en charge.

### SIM et App également utilisables dans le navigateur

SIM et App peuvent aussi être utilisés pour les connexions navigateur. Tous les cas d'utilisation ne nécessitent pas une résistance maximale au phishing dans le navigateur. Pour de nombreuses applications, l'authentification éprouvée par Push via SIM ou App constitue une solution pragmatique et sûre. Mobile ID couvre tous les scénarios avec OIDC et REST API.

<div class="blog-infographic">
  <img src="/release-notes/media/infografik-methoden-szenarien.webp" alt="Méthodes d'authentification en aperçu : Passkeys, SIM et App comparés par scénario" />
</div>

## Pourquoi SIM et App restent indispensables

Les Passkeys sont un excellent complément pour les scénarios navigateur. SIM et App déploient leurs atouts uniques là où WebAuthn atteint ses limites.

### Mobile ID SIM

La méthode basée sur la SIM utilise la carte SIM compatible Mobile ID (ou eSIM) comme token matériel sécurisé. Plus de 6 millions de cartes SIM suisses chez Swisscom, Sunrise, UPC et Salt sont compatibles Mobile ID. Les clés cryptographiques sont stockées directement sur la SIM, certifiée selon le profil de protection **EAL5+** (ISO/IEC 15408) et le niveau d'évaluation E3 (ITSEC).

La méthode SIM ne nécessite ni installation d'application ni dépendance à un App Store. L'authentification s'affiche sous forme d'overlay SIM Toolkit directement par-dessus l'application métier. Elle fonctionne sur tout appareil mobile, y compris les appareils sans système d'exploitation smartphone, et via le canal GSM. Grâce au SMS-over-IP et au WiFi, la méthode SIM est également utilisable en l'absence de couverture réseau mobile.

Lors d'un changement d'appareil, l'utilisateur transfère simplement sa SIM. Le compte est conservé sans nouvel enregistrement. La vérification de localisation basée sur la SIM est particulièrement fiable, car la position dans le réseau mobile est difficile à manipuler.

### Mobile ID App

L'application Mobile ID (iOS et Android) offre, en plus de l'authentification biométrique, un large éventail d'avantages spécifiques à l'App qui ne sont pas reproductibles avec les seuls Passkeys :

**Authentification par Push** avec biométrie ou code d'accès comme second facteur. **Geofencing côté App** avec localisation GPS et détection intégrée de jailbreak et de services de simulation, rendant le GPS spoofing plus difficile. **Le Number Matching et le [Transaction Signing](/oidc-integration-guide/message-formats)** restent disponibles à la fois avec Mobile ID SIM et Mobile ID App ; dans l'App, ils sont combinés à une validation biométrique et à une UX smartphone plus riche. **Le passage App-to-App** permet dans les scénarios bancaires le basculement automatisé de l'application métier vers l'application Mobile ID et retour.

L'application repose sur la technologie de Futurae (spin-off de l'ETH Zurich) et utilise le Trusted Execution Environment (TEE) de l'appareil. Elle est disponible dans le monde entier, dans les pays autorisés, via l'App Store.

## Passkeys-Plus : le Hybrid Auth Flow pour un niveau proche d'AAL3

NIST AAL3 est un standard de sécurité extrêmement élevé. Un véritable AAL3 exige entre autres un module matériel validé FIPS 140-2, ce qui dépend de la configuration concrète de l'appareil. Pour les systèmes hautement critiques, Swisscom utilise déjà en interne le modèle **Passkeys-Plus**, qui vise un niveau de sécurité très élevé.

L'approche combine deux composants déjà existants en un Hybrid Auth Flow :

**Étape 1 : Cloud-Sync Passkey (AAL2).** L'utilisateur s'authentifie dans le navigateur avec un Passkey. Cela offre une large prise en charge des écosystèmes et un Origin-Binding résistant au phishing.

**Étape 2 : Mobile ID Push Step-Up.** L'utilisateur reçoit ensuite un Push sur son smartphone. Mobile ID Push utilise la cryptographie à clé publique avec des clés non exportables, liées à l'appareil. L'utilisateur confirme par biométrie ou code d'accès. En option, le géoblocage et l'affichage du consentement utilisateur s'ajoutent.

La combinaison apporte : connexion liée à l'origine, plus clé liée à l'appareil et non exportable, plus consentement explicite de l'utilisateur, plus géolocalisation. Elle peut atteindre AAL3 dans les déploiements où le second facteur s'exécute sur un matériel approprié certifié FIPS 140-2. La reconnaissance réglementaire comme AAL3 complet doit toutefois toujours être évaluée au cas par cas, selon le cas d'utilisation, la base matérielle et le cadre de conformité. Une couverture plus large de cryptographie validée FIPS et de Device Attestation dans l'étape Mobile ID Push ne sera pleinement disponible qu'après de futures extensions.

L'étape Push reste sur le smartphone. Sur le desktop, l'utilisateur s'authentifie localement avec le Passkey, et le Step-Up s'effectue out-of-band via le téléphone.

<div class="blog-infographic">
  <img src="/release-notes/media/infografik-hybrid-auth.webp" alt="Authentification hybride pour NIST AAL3 : Cloud-Sync Passkey combiné avec Mobile ID Push Step-Up" />
</div>

<HybridAuthFlow />

## Mobile ID Authentication Levels : pilotage granulaire via les valeurs ACR

En plus de ces cadres de référence externes, Mobile ID définit ses propres Authentication Levels (AL2–AL4) comme valeurs ACR dans l'[OIDC Authorization Request](/oidc-integration-guide/getting-started#authorization-code-request). Ces valeurs déterminent quelles méthodes d'authentification sont autorisées pour un login donné. Mobile ID s'aligne ici sur la logique à quatre niveaux d'ISO/IEC 29115. `AL4` désigne donc le niveau de sécurité Mobile ID le plus élevé. La matrice ACR complète est documentée dans le [guide d'intégration OIDC](/oidc-integration-guide/getting-started#authentication-context-class-reference-acr).

<AcrLevels />

En mode `mid_al4_passkey`, une authentification exclusivement par Passkey est imposée, garantissant une véritable résistance au phishing sans fallbacks faibles. Pour une flexibilité maximale, `mid_al2_any` autorise toutes les méthodes disponibles, y compris le SMS. Avec `mid_al4_any`, l'authentification par Passkey est privilégiée, avec fallback sur SIM ou App.

Alors que la plupart des fournisseurs proposent les Passkeys uniquement comme simple remplacement de mot de passe avec des chemins de récupération peu sûrs (Google, PayPal, GitHub et même les CFF autorisent l'OTP par e-mail comme fallback), Mobile ID permet l'application de politiques de sécurité strictes et la restriction aux authenticateurs certifiés FIPS via la validation AAGUID contre la base de données FIDO Metadata Service.

## Flux d'enregistrement et de connexion

Le déploiement technique est remarquablement simple pour les Relying Parties.

### Enregistrement centralisé sur mobileid.ch

Les utilisateurs gèrent leurs Passkeys via le [tableau de bord MyMobileID](/oidc-integration-guide/passkey-authentication#passkey-registration) sur mobileid.ch/login. Une nouvelle tuile indique immédiatement où les Passkeys peuvent être enregistrés et administrés de manière centralisée. Les Passkeys sont stockés sur le domaine m.mobileid.ch et sont ensuite disponibles auprès de toutes les Relying Parties connectées.

Les nouvelles vues du tableau de bord montrent d'un coup d'oeil le point d'entrée et l'expérience de gestion centralisée :

<ScreenshotStep img="/release-notes/media/manage-passkeys-button.jpg" alt="Tableau de bord MyMobileID : tuile Mobile ID Passkey avec bouton MANAGE PASSKEYS">
<p>La tuile <strong>Manage Passkeys</strong> constitue le point d'entrée central de la nouvelle fonctionnalité Passkey dans MyMobileID. C'est ici que les utilisateurs démarrent l'enregistrement et la gestion de leurs Passkeys.</p>
</ScreenshotStep>

<ScreenshotStep img="/release-notes/media/manage-passkeys-2.jpg" alt="Gestion des Passkeys dans MyMobileID avec la liste des Passkeys enregistrés">
<p>Une fois la vue ouverte, les utilisateurs retrouvent leurs Passkeys déjà enregistrés dans un écran de gestion clair et peuvent compléter ou entretenir leur portefeuille de Passkeys si nécessaire.</p>
</ScreenshotStep>

<PasskeyRegistrationFlow />

### Connexion RP via OIDC

Pour les scénarios de connexion typiques chez une Relying Party, le tableau de bord inclut désormais aussi le <strong>Mobile ID Check</strong>. Il permet aux utilisateurs de tester leurs méthodes Mobile ID activées dans un cas d'usage d'authentification réaliste :

<ScreenshotStep img="/release-notes/media/passkey-check-button.jpg" alt="Tableau de bord MyMobileID : tuile Mobile ID Check avec bouton TEST">
<p>La tuile <strong>Mobile ID Check</strong> offre un point d'entrée simple pour tester directement depuis le tableau de bord les méthodes Mobile ID disponibles, comme la SIM, l'App et désormais aussi le Passkey.</p>
</ScreenshotStep>

<ScreenshotStep img="/release-notes/media/passkey-check-2.jpg" alt="Mobile ID Check avec les méthodes sélectionnables App et Passkey">
<p>Si au moins un Passkey a déjà été enregistré, Passkey apparaît comme méthode sélectionnable. La nouvelle option de connexion peut ainsi être validée rapidement dans un [flux de login](/oidc-integration-guide/passkey-authentication#authentication-flow-oidc) typique avant sa mise en production.</p>
</ScreenshotStep>

Selon la [valeur ACR](/oidc-integration-guide/passkey-authentication#passkey-acr-values) configurée, le flux approprié est déclenché. Avec `mid_al4_passkey`, seul un Passkey est accepté. Avec `mid_al2_any`, l'utilisateur peut choisir entre Passkey, SIM, App ou SMS. En cas d'erreur ou d'absence de Passkeys, la RP peut autoriser un [fallback](/oidc-integration-guide/passkey-authentication#passkey-only-vs-fallback) sécurisé vers d'autres méthodes.

<PasskeyLoginFlow />

## Feuille de route : le Mobile ID Passkey Vault

Avec le Mobile ID Passkey Vault, Mobile ID dispose d'une solution sur la feuille de route, actuellement en développement, conçue pour permettre l'AAL3 avec l'application Mobile ID. L'objectif est un authenticateur répondant aux exigences strictes d'AAL3 et évoluant au même niveau de sécurité qu'une clé matérielle certifiée FIPS, tout en restant pleinement intégré à l'écosystème Mobile ID.

Par rapport aux clés matérielles physiques, le Passkey Vault offre des avantages opérationnels clairs : la connexion par Passkey peut être combinée directement avec le geoblocking et un consentement explicite de l'utilisateur, et l'authenticateur peut être déployé et étendu bien plus simplement et à moindre coût que des tokens matériels onéreux.

L'application Mobile ID évolue ainsi vers un authenticateur logiciel scalable qui complète l'authentification basée SIM par un MFA push, des capacités Passkey et une UX smartphone plus riche pour le Transaction Signing et le consentement utilisateur.

## Conclusion : tout d'un seul tenant

Avec l'introduction des Passkeys, Mobile ID consolide sa position d'écosystème unique réunissant toutes les méthodes d'authentification pertinentes sous un même toit. Les Passkeys pour des connexions navigateur résistantes au phishing. La SIM pour la sécurité matérielle maximale sans installation d'application, y compris le geofencing fondé sur le réseau mobile lorsqu'il est pris en charge. L'App pour le geofencing GPS, la biométrie et l'utilisation mondiale. Le Number Matching et le Transaction Signing peuvent être utilisés avec la SIM comme avec l'App. Et avec le Hybrid Auth Flow, une solution atteignant un niveau proche d'AAL3, sans que chaque utilisateur n'ait besoin de posséder un token matériel.

Les entreprises bénéficient d'une intégration OIDC standard, d'un hébergement des données en Suisse et de la fiabilité d'un partenaire qui utilise lui-même ces solutions pour protéger des infrastructures hautement critiques.

**Le client décide quelle méthode convient le mieux à son cas d'utilisation. Mobile ID offre la flexibilité nécessaire.**

*Mobile ID : la bonne méthode pour chaque scénario. Tout au sein d'un seul écosystème.*

Pour toute question sur les intégrations Mobile ID, contactez [Backoffice.Security@swisscom.com](mailto:Backoffice.Security@swisscom.com). Pour des informations générales sur le service, visitez [mobileid.ch](https://www.mobileid.ch/fr).
