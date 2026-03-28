---
title: "Mobile ID et Microsoft Entra ID : un MFA renforcé avec External Authentication"
date: 2026-03-27
author: Mobile ID Team
description: "Microsoft Entra External MFA est désormais disponible en version générale. Découvrez comment Mobile ID s'intègre en tant que fournisseur External MFA de confiance, apportant l'authentification basée sur la SIM et sur l'App à votre environnement Entra ID."
thumbnail: /release-notes/img/entra-eam-thumb.png
lang: fr
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
Microsoft Entra ID est la plateforme d'identité utilisée par des millions d'environnements d'entreprise. Avec <strong>External MFA désormais disponible en version générale</strong>, les organisations peuvent intégrer un fournisseur d'authentification tiers de confiance dans Entra ID tout en conservant le contrôle total sur les politiques Conditional Access. Mobile ID, opéré par Swisscom, ajoute l'<a href="/rest-api-guide/introduction#mobile-id-sim---method">authentification matérielle via la SIM</a> et l'<a href="/rest-api-guide/introduction#mobile-id-app---method">authentification par App avec Geofencing</a> aux connexions Entra ID nécessitant un MFA.
</div>

## Qu'est-ce que Microsoft Entra External MFA ?

Microsoft Entra ID est la plateforme centrale de gestion des identités et des accès pour les entreprises utilisant Microsoft 365, Azure et des milliers d'applications connectées. Lorsqu'un utilisateur se connecte, Entra ID évalue les politiques **Conditional Access** pour déterminer si une vérification supplémentaire est nécessaire et quelle méthode utiliser.

Entra ID propose déjà plusieurs méthodes MFA intégrées : application Authenticator, clés de sécurité FIDO2, SMS et appels téléphoniques. Pour les organisations qui devaient recourir à un **fournisseur d'authentification tiers**, la seule option était un mécanisme hérité appelé **Custom Controls**. Custom Controls permettait de rediriger les utilisateurs vers un fournisseur externe, mais avec des limitations significatives. L'authentification externe n'était pas pleinement reconnue comme MFA par Entra ID, ce qui limitait son utilisation dans les politiques Conditional Access et les contrôles d'accès.

**External MFA** change la donne. Lancé en préversion publique en mai 2024 et [disponible en version générale depuis mars 2026](https://techcommunity.microsoft.com/blog/microsoft-entra-blog/external-mfa-in-microsoft-entra-id-is-now-generally-available/4488926), External MFA permet à un fournisseur externe de s'enregistrer en tant que méthode d'authentification multifacteur pleinement reconnue. Entra ID traite la réponse External MFA exactement comme ses méthodes intégrées : elle satisfait les exigences MFA de Conditional Access, fonctionne avec les politiques de fréquence de connexion et s'intègre dans le flux d'authentification standard.

L'intégration utilise **OpenID Connect (OIDC)**, un protocole ouvert et conforme aux standards. Pas d'API propriétaire, pas de dépendance à un fournisseur.

::: info
External MFA remplace Custom Controls, que Microsoft prévoit de [retirer le 30 septembre 2026](https://learn.microsoft.com/en-us/entra/identity/authentication/how-to-authentication-external-method-manage). Les organisations utilisant encore Custom Controls doivent planifier leur migration dès maintenant.
:::

## Comment fonctionne External MFA ?

Le flux est transparent pour l'utilisateur final. Lorsqu'une personne se connecte à une application protégée, Entra ID évalue la politique Conditional Access. Si le MFA est requis et que Mobile ID est configuré comme fournisseur externe, l'utilisateur est redirigé via OIDC vers Mobile ID pour l'authentification. Après une vérification réussie, l'utilisateur retourne vers Entra ID avec un claim MFA valide et obtient l'accès.

<EntraIntegrationFlow />

Entra ID reste le **plan de contrôle des identités** tout au long du processus : évaluation des politiques, décisions d'accès, émission de tokens et gestion des sessions. Mobile ID gère l'étape d'authentification elle-même, au cours de laquelle l'utilisateur prouve son identité par un second facteur.

Le résultat est une séparation claire des responsabilités. D'un côté, le moteur de politiques et les capacités de gouvernance de Microsoft. De l'autre, les méthodes d'authentification spécialisées de Mobile ID et une infrastructure opérée en Suisse.

## Pourquoi choisir Mobile ID comme fournisseur External MFA ?

La plupart des fournisseurs External MFA proposent des notifications push via une application. Mobile ID va plus loin avec une combinaison de méthodes d'authentification qui couvre des scénarios auxquels les autres fournisseurs ne peuvent tout simplement pas répondre.

### Authentification par SIM : sans application

La [méthode SIM](/rest-api-guide/introduction#mobile-id-sim---method) de Mobile ID utilise la carte SIM (ou eSIM) comme token matériel inviolable, certifié **EAL5+** (ISO/IEC 15408). Plus de 6 millions de cartes SIM suisses de Swisscom, Sunrise et Salt sont compatibles Mobile ID.

Pour les déploiements Entra ID, cela signifie que le MFA fonctionne sur **tout appareil mobile**, y compris les téléphones basiques sans système d'exploitation smartphone. Pas d'application à installer, pas de dépendance à un app store, pas de connexion de données nécessaire lors de l'authentification. Pour les organisations avec des collaborateurs sur le terrain, des environnements industriels ou des employés qui ne disposent pas de smartphone, c'est un facteur de différenciation essentiel.

Les deux facteurs sont la carte SIM physique (possession) et le code PIN Mobile ID personnel (connaissance). L'authentification s'effectue via un canal chiffré séparé, indépendant de la connexion internet.

### Authentification par App : bien plus qu'un simple push

L'[App Mobile ID](/rest-api-guide/introduction#mobile-id-app---method) pour iOS et Android va bien au-delà des notifications push standard. Les utilisateurs peuvent s'authentifier par empreinte digitale ou reconnaissance faciale. Le [Geofencing](/oidc-integration-guide/getting-started#authentication-context-class-reference-acr) limite l'authentification à des zones géographiques spécifiques, avec détection intégrée du jailbreak et du GPS spoofing. Le Number Matching permet à l'utilisateur de confirmer un code affiché à l'écran, ce qui prévient les attaques par fatigue MFA. Et le [Transaction Signing](/oidc-integration-guide/message-formats) affiche les détails d'une transaction directement sur l'appareil (par ex. « Confirmez le transfert de CHF 1'000 vers le compte XY ») afin que l'utilisateur donne son consentement explicite.

L'application repose sur la technologie de Futurae, une spin-off de l'ETH Zurich, et stocke les clés dans le Trusted Execution Environment (TEE) de l'appareil.

### Authentification par Passkey : connexion résistante au phishing

Au-delà de la SIM et de l'App, Mobile ID prend en charge les [Passkeys FIDO2](/oidc-integration-guide/passkey-authentication) pour une authentification résistante au phishing dans l'ensemble de son écosystème OIDC. Les Passkeys sont liés cryptographiquement au domaine, ce qui les rend insensibles au URL spoofing. Les utilisateurs enregistrent leurs Passkeys une seule fois sur [mobileid.ch](https://mobileid.ch/login) et peuvent les utiliser auprès de toutes les parties de confiance connectées.

::: info
Les Passkeys sont une fonctionnalité générale de Mobile ID disponible via l'intégration OIDC standard. Dans le contexte Entra ID External MFA, la SIM et l'App sont les méthodes d'authentification principales. Pour en savoir plus sur les Passkeys et leur rôle dans l'écosystème Mobile ID, consultez l'article complémentaire : [Mobile ID Passkeys : authentification résistante au phishing pour les scénarios navigateur](/release-notes/posts/2026-03-30-mobile-id-passkeys).
:::

### Exploitation suisse et résidence des données

Mobile ID est opéré par Swisscom depuis la Suisse. Les organisations ayant des exigences de résidence des données ou une préférence pour des services de sécurité opérés en Europe peuvent avoir la certitude que les données d'authentification restent sous juridiction suisse.

### Là où Mobile ID apporte une valeur ajoutée par rapport au MFA natif

Microsoft Authenticator est un choix solide par défaut pour les organisations qui n'ont besoin que du push par application et du TOTP. Mobile ID devient pertinent lorsque cela ne suffit pas : lorsqu'une partie du personnel ne dispose pas de smartphone, lorsque l'authentification doit être liée à une zone géographique, lorsque les utilisateurs doivent confirmer explicitement les détails d'une transaction sur leur appareil, ou lorsque l'organisation souhaite un fournisseur MFA unique qui fonctionne à travers Entra ID, les applications personnalisées, le VPN et les environnements RADIUS. Ce sont des scénarios où une approche exclusivement basée sur une application atteint ses limites.

## Cas d'usage en entreprise

External MFA avec Mobile ID couvre un large éventail de scénarios d'entreprise. La méthode d'authentification la plus adaptée (SIM ou App) dépend des exigences de sécurité et du contexte utilisateur.

<EntraUseCaseCards />

### MFA Microsoft 365 pour les collaborateurs

Le scénario le plus courant : sécuriser l'accès à Outlook, Teams, SharePoint et aux autres applications Microsoft 365. Lorsqu'une politique Conditional Access exige le MFA, les collaborateurs s'authentifient via Mobile ID au lieu de, ou en complément de, Microsoft Authenticator.

Cela est particulièrement pertinent pour les organisations qui souhaitent un **fournisseur MFA unique pour toutes les applications**, et pas uniquement pour les services Microsoft. Étant donné que Mobile ID utilise le [standard OIDC](/oidc-integration-guide/introduction), les mêmes méthodes d'authentification fonctionnent pour Entra ID, les applications web personnalisées, l'accès VPN et plus encore.

### VPN et accès à distance

Pour les passerelles VPN, les environnements Citrix, les sessions VDI et l'accès bureau à distance, Mobile ID fournit le MFA via le [RADIUS Interface Gateway](/radius-interface-gateway-guide/introduction) ou directement via OIDC. La méthode SIM est particulièrement adaptée ici car elle fonctionne de manière fiable même dans les environnements où l'authentification par application est peu pratique. Une session de bureau à distance, par exemple, bloque souvent la communication Bluetooth avec une clé de sécurité.

### Gestion des accès privilégiés

Les comptes administrateurs et l'accès aux systèmes sensibles exigent le niveau d'assurance le plus élevé. Les politiques Conditional Access d'Entra ID peuvent cibler des rôles d'administrateur spécifiques et des applications sensibles pour exiger External MFA via Mobile ID. Mobile ID authentifie alors l'utilisateur avec les méthodes disponibles. Pour les organisations qui utilisent également Mobile ID en dehors du contexte Entra (par ex. pour les applications web ou le VPN), les [valeurs ACR granulaires](/oidc-integration-guide/getting-started#authentication-context-class-reference-acr) dans la requête d'autorisation OIDC permettent à la Relying Party d'imposer des méthodes spécifiques telles que l'App avec Geofencing ou le Transaction Signing.

### Personnel hybride et de terrain

Tous les collaborateurs ne disposent pas d'un smartphone. Les travailleurs de terrain, le personnel de production ou les employés dans des environnements réglementés peuvent n'avoir qu'un téléphone mobile basique. Avec Mobile ID SIM, ces utilisateurs bénéficient d'un MFA fort sans aucune installation d'application. Le personnel de bureau peut utiliser l'App Mobile ID avec la biométrie pour une expérience plus fluide. Un seul fournisseur couvre tous les types d'appareils.

<div class="blog-infographic">
  <img src="/release-notes/media/infografik-entra-use-cases.jpg" alt="Cas d'usage en entreprise pour Mobile ID comme External MFA dans Microsoft Entra ID : scénarios Microsoft 365, VPN, accès privilégiés et personnel hybride" />
</div>

## Le parcours de migration : de Custom Controls à External MFA

Microsoft a établi un calendrier clair. Les organisations utilisant encore Custom Controls pour le MFA tiers doivent migrer vers External MFA avant la date de retrait.

<EntraMigrationTimeline />

La migration peut se faire progressivement. Microsoft prend en charge l'exécution de Custom Controls et External MFA **en parallèle** pendant la période de transition. Une approche recommandée :

1. Configurer Mobile ID comme méthode External MFA dans le centre d'administration Entra à l'aide du [guide de configuration](/oidc-integration-guide/cloud-integration-guide#microsoft-entra-id)
2. Créer une politique Conditional Access parallèle ciblant un groupe d'utilisateurs test
3. Valider le flux d'authentification avec le groupe test
4. Étendre à tous les utilisateurs et désactiver l'ancienne politique Custom Controls

::: tip
Si vous découvrez Mobile ID et que vous l'envisagez comme fournisseur External MFA, Swisscom gère le processus d'[onboarding client](/oidc-integration-guide/getting-started). Vous recevrez l'Application ID, le Client ID et la Discovery URL nécessaires pour configurer External MFA dans Entra ID.
:::

## Comment démarrer

La mise en place de Mobile ID comme fournisseur External MFA dans Entra ID nécessite trois éléments :

1. **Un onboarding Mobile ID complété.** Contactez Swisscom pour recevoir vos identifiants d'intégration ([premiers pas](/oidc-integration-guide/getting-started)).
2. **Un abonnement Entra ID P1 ou P2** avec Conditional Access activé et des licences attribuées aux utilisateurs ciblés.
3. **Un compte administrateur Entra ID** avec le rôle Global Administrator ou Privileged Role Administrator pour la configuration initiale.

La configuration pas à pas est documentée dans le [Cloud Integration Guide](/oidc-integration-guide/cloud-integration-guide#microsoft-entra-id), y compris la configuration de la politique Conditional Access, le consentement administrateur et les étapes optionnelles pour prioriser Mobile ID par rapport à Microsoft Authenticator.

<div class="blog-infographic">
  <img src="/release-notes/media/infografik-entra-integration-flow.jpg" alt="Architecture d'intégration Mobile ID avec Microsoft Entra ID : flux d'authentification basé sur OIDC montrant l'évaluation des politiques, External MFA et le contrôle d'accès" />
</div>

## Conclusion

Avec External MFA désormais disponible en version générale dans Microsoft Entra ID, les organisations n'ont plus à choisir entre une gestion centralisée des identités et une authentification spécialisée. Entra ID reste le moteur de politiques. Mobile ID fournit le second facteur, via la SIM ou l'App, selon le cas d'usage.

Ce que cela signifie en pratique : un seul fournisseur MFA pour Entra ID, les applications web, le VPN et les environnements RADIUS. Tous les types d'appareils couverts, du smartphone au téléphone basique. Une infrastructure opérée en Suisse avec une intégration OIDC basée sur les standards. Et un chemin pérenne, puisque External MFA remplace les Custom Controls dépréciés et que Mobile ID continue d'évoluer avec de nouvelles fonctionnalités comme le [Passkey Vault](/release-notes/posts/2026-03-30-mobile-id-passkeys#roadmap-the-mobile-id-passkey-vault).

Pour toute question sur les intégrations Mobile ID, contactez [Backoffice.Security@swisscom.com](mailto:Backoffice.Security@swisscom.com). Pour des informations générales sur le service, consultez [mobileid.ch](https://www.mobileid.ch/fr).
