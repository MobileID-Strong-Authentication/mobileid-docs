---
title: "Mobile ID et Microsoft Entra ID : un MFA renforcé avec External Authentication"
date: 2026-03-27
author: Mobile ID Team
description: "Microsoft Entra External MFA est disponible en version générale. Découvrez comment Mobile ID s'intègre comme fournisseur External MFA basé sur OIDC et comment SIM, App et Passkeys s'articulent."
thumbnail: /release-notes/img/entra-eam-thumb.png
lang: fr
keywords:
  - Microsoft Entra External MFA
  - Mobile ID
  - fournisseur External MFA
  - MFA Entra ID
  - Conditional Access
  - MFA par SIM
  - MFA par App
  - Passkeys
  - MFA VPN
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
Microsoft Entra ID est la plateforme d'identité utilisée par des millions d'environnements d'entreprise. Avec <strong>External MFA désormais disponible en version générale</strong>, les organisations peuvent intégrer un fournisseur d'authentification tiers de confiance dans Entra ID tout en conservant le contrôle total sur les politiques Conditional Access. Mobile ID, opéré par Swisscom, combine l'<a href="/rest-api-guide/introduction#mobile-id-sim---method">authentification matérielle via la SIM</a>, l'<a href="/rest-api-guide/introduction#mobile-id-app---method">authentification push via l'App avec Geofencing</a> et un écosystème OIDC plus large qui inclut désormais les <a href="/oidc-integration-guide/passkey-authentication">Mobile ID Passkeys</a>. Dans le parcours Entra External MFA, Entra consomme le résultat du fournisseur tandis que Mobile ID exécute l'expérience de second facteur.
</div>

<div class="blog-video">
  <video controls preload="metadata" poster="/release-notes/img/entra-eam-thumb.png">
    <source src="/release-notes/media/entra-external-mfa-explainer.mp4" type="video/mp4" />
  </video>
  <div class="blog-video-caption">
    <svg class="video-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
    <span>Résumé vidéo (7 min). Les points clés de cet article en un coup d'oeil.</span>
  </div>
</div>

## Qu'est-ce que Microsoft Entra External MFA ?

Microsoft Entra ID est la plateforme centrale de gestion des identités et des accès pour les entreprises utilisant Microsoft 365, Azure et des milliers d'applications connectées. Lorsqu'un utilisateur se connecte, Entra ID évalue les politiques **Conditional Access** pour déterminer si une vérification supplémentaire est nécessaire et quelle méthode utiliser.

Entra ID propose déjà plusieurs méthodes MFA intégrées : application Authenticator, clés de sécurité FIDO2, SMS et appels téléphoniques. Pour les organisations qui devaient recourir à un **fournisseur d'authentification tiers**, la seule option était un mécanisme hérité appelé **Custom Controls**. Custom Controls permettait de rediriger les utilisateurs vers un fournisseur externe, mais avec des limitations significatives. L'authentification externe n'était pas pleinement reconnue comme MFA par Entra ID, ce qui limitait son utilisation dans les politiques Conditional Access et les contrôles d'accès.

**External MFA** change la donne. Lancé en préversion publique en mai 2024 et [disponible en version générale depuis mars 2026](https://techcommunity.microsoft.com/blog/microsoft-entra-blog/external-mfa-in-microsoft-entra-id-is-now-generally-available/4488926), External MFA permet à un fournisseur externe de satisfaire l'exigence MFA d'Entra ID au travers d'une intégration fournisseur fondée sur des standards. En pratique, cela permet de satisfaire le contrôle Conditional Access **Require multifactor authentication**, et la méthode est gérée avec les autres méthodes d'authentification dans Entra ID.

Cela ne signifie pas pour autant qu'External MFA est identique à toutes les méthodes natives d'Entra. Microsoft ne prend actuellement pas en charge External MFA avec les Authentication Strengths. L'affirmation importante est plus précise : External MFA est une manière supportée de satisfaire l'exigence MFA d'Entra ID avec un fournisseur tiers.

L'intégration utilise **OpenID Connect (OIDC)** entre Entra ID et le fournisseur externe. Pour Microsoft Entra External MFA, il s'agit du modèle fournisseur documenté par Microsoft, et non d'une relying party utilisant le flux Authorization Code habituel de Mobile ID.

::: info
External MFA remplace Custom Controls, que Microsoft prévoit de [retirer le 30 septembre 2026](https://learn.microsoft.com/en-us/entra/identity/authentication/how-to-authentication-external-method-manage). Les organisations utilisant encore Custom Controls doivent planifier leur migration dès maintenant.
:::

## Comment fonctionne External MFA ?

Le flux reste simple pour l'utilisateur final, mais techniquement il **ne correspond pas** à une intégration Mobile ID classique en Authorization Code côté relying party. Dans le scénario External MFA, Microsoft Entra ID appelle l'endpoint d'autorisation OIDC du fournisseur avec son profil implicite pour fournisseur externe, en incluant notamment `response_type=id_token`, `response_mode=form_post` et un `id_token_hint` qui identifie l'utilisateur et le tenant.

Mobile ID valide ce contexte Entra, exécute le parcours de second facteur côté fournisseur, puis renvoie un `id_token` signé à Entra ID. Entra ID valide ce token et vérifie si l'exigence MFA est satisfaite.

<EntraIntegrationFlow />

Entra ID reste le **plan de contrôle des identités** tout au long du processus : évaluation des politiques, décisions d'accès, émission de tokens et gestion des sessions. Mobile ID gère l'étape d'authentification proprement dite.

Cette séparation est essentielle. Entra décide **quand** le MFA est requis et consomme le résultat du fournisseur. Mobile ID décide **comment** l'utilisateur s'authentifie dans le parcours fournisseur. Entra n'a pas besoin de comprendre si Mobile ID a satisfait le second facteur via la SIM, l'App ou un Passkey.

## Pourquoi choisir Mobile ID comme fournisseur External MFA ?

La plupart des fournisseurs External MFA proposent des notifications push via une application. Mobile ID va plus loin avec une combinaison de méthodes d'authentification qui couvre des scénarios auxquels les autres fournisseurs ne peuvent tout simplement pas répondre.

Dans l'écosystème Mobile ID au sens large, il existe désormais **trois méthodes fortes** : **SIM**, **App** et **Passkeys**. Pour Entra External MFA, le point important n'est pas qu'Entra choisisse entre elles ; ce n'est pas le cas. Mobile ID exécute le parcours côté fournisseur, et Entra consomme le résultat positif.

### Authentification par SIM : sans application

La [méthode SIM](/rest-api-guide/introduction#mobile-id-sim---method) de Mobile ID utilise la carte SIM (ou eSIM) comme token matériel inviolable, certifié **EAL5+** (ISO/IEC 15408). Plus de 6 millions de cartes SIM suisses de Swisscom, Sunrise et Salt sont compatibles Mobile ID.

Pour les déploiements Entra ID, cela signifie que le MFA fonctionne sur **tout appareil mobile**, y compris les téléphones basiques sans système d'exploitation smartphone. Pas d'application à installer, pas de dépendance à un app store, pas de connexion de données nécessaire lors de l'authentification. Pour les organisations avec des collaborateurs sur le terrain, des environnements industriels ou des employés qui ne disposent pas de smartphone, c'est un facteur de différenciation essentiel.

Les deux facteurs sont la carte SIM physique (possession) et le code PIN Mobile ID personnel (connaissance). L'authentification s'effectue via un canal chiffré séparé, indépendant de la connexion internet.

### Authentification par App : bien plus qu'un simple push

L'[App Mobile ID](/rest-api-guide/introduction#mobile-id-app---method) pour iOS et Android va bien au-delà des notifications push standard. Les utilisateurs peuvent s'authentifier par empreinte digitale ou reconnaissance faciale. Le [Geofencing](/oidc-integration-guide/getting-started#authentication-context-class-reference-acr) limite l'authentification à des zones géographiques spécifiques, avec détection intégrée du jailbreak et du GPS spoofing. Le Number Matching permet à l'utilisateur de confirmer un code affiché à l'écran, ce qui prévient les attaques par fatigue MFA. Et le [Transaction Signing](/oidc-integration-guide/message-formats) affiche les détails d'une transaction directement sur l'appareil (par ex. « Confirmez le transfert de CHF 1'000 vers le compte XY ») afin que l'utilisateur donne son consentement explicite.

L'application repose sur la technologie de Futurae, une spin-off de l'ETH Zurich, et stocke les clés dans le Trusted Execution Environment (TEE) de l'appareil.

### Authentification par Passkey : capacité résistante au phishing pour le navigateur

Au-delà de la SIM et de l'App, Mobile ID prend désormais en charge les [Passkeys FIDO2](/oidc-integration-guide/passkey-authentication) dans son écosystème OIDC. Les Passkeys sont liés cryptographiquement au domaine et résistent donc au URL spoofing. Les utilisateurs enregistrent leurs Passkeys sur [mobileid.ch](https://mobileid.ch/login) et peuvent les utiliser auprès des relying parties connectées qui sont configurées pour les Mobile ID Passkeys.

Pour les intégrations OIDC directes avec Mobile ID, les Passkeys peuvent être combinés avec des contrôles propres à Mobile ID tels que des valeurs ACR orientées Passkey et la gestion de `keyringId`. Ces contrôles relèvent de l'intégration standard entre la relying party et Mobile ID, et non de la surface d'administration Entra External MFA.

::: info
Dans le contexte Entra ID External MFA, Entra consomme toujours uniquement le résultat du flux fournisseur Mobile ID. Entra ne distingue pas la SIM, l'App ou le Passkey comme méthodes Mobile ID séparées. Si les Passkeys sont activés dans la configuration du fournisseur Mobile ID derrière une intégration Entra, ils restent un choix de méthode côté Mobile ID et non un réglage côté Entra. Pour plus de détails sur les Passkeys et leur rôle dans l'écosystème Mobile ID, consultez l'article complémentaire : [Mobile ID Passkeys : authentification résistante au phishing pour les scénarios navigateur](/release-notes/posts/2026-03-30-mobile-id-passkeys).
:::

### Exploitation suisse et résidence des données

Mobile ID est opéré par Swisscom depuis la Suisse. Les organisations ayant des exigences de résidence des données ou une préférence pour des services de sécurité opérés en Europe peuvent avoir la certitude que les données d'authentification restent sous juridiction suisse.

### Là où Mobile ID apporte une valeur ajoutée par rapport au MFA natif

Microsoft Authenticator est un choix solide par défaut pour les organisations qui n'ont besoin que du push par application et du TOTP. Mobile ID apporte une valeur claire lorsque les exigences vont au-delà de ce socle :

- **Une partie du personnel travaille sans smartphone.**
- **L'authentification doit être limitée à une zone géographique définie.**
- **Les utilisateurs doivent confirmer explicitement les détails d'une transaction sur leur appareil.**
- **Un fournisseur MFA unique doit couvrir Entra ID, les applications métiers, le VPN et les environnements RADIUS.**

Ce sont des scénarios où une approche exclusivement basée sur une application atteint ses limites.

## Cas d'usage en entreprise

External MFA avec Mobile ID couvre un large éventail de scénarios d'entreprise. La SIM et l'App couvrent les parcours d'entreprise hors bande les plus larges. Les Passkeys complètent les parcours centrés navigateur là où la prise en charge WebAuthn est disponible de bout en bout.

<EntraUseCaseCards />

### MFA Microsoft 365 pour les collaborateurs

Le scénario le plus courant : sécuriser l'accès à Outlook, Teams, SharePoint et aux autres applications Microsoft 365. Lorsqu'une politique Conditional Access exige le MFA, les collaborateurs s'authentifient via Mobile ID au lieu de, ou en complément de, Microsoft Authenticator.

Cela est particulièrement pertinent pour les organisations qui souhaitent un **fournisseur MFA unique pour toutes les applications**, et pas uniquement pour les services Microsoft. Étant donné que Mobile ID utilise le [standard OIDC](/oidc-integration-guide/introduction), les mêmes méthodes d'authentification fonctionnent pour Entra ID, les applications web personnalisées, l'accès VPN et plus encore.

### VPN et accès à distance

Pour les passerelles VPN, les environnements Citrix, les sessions VDI et l'accès bureau à distance, Mobile ID fournit le MFA via le [RADIUS Interface Gateway](/radius-interface-gateway-guide/introduction) ou directement via OIDC. La SIM comme l'App conviennent bien à ces scénarios hors bande, car aucune des deux méthodes ne dépend du Bluetooth vers une clé matérielle. Elles restent donc pratiques même lorsque la session protégée elle-même est distante ou pilotée par un client.

Les Passkeys peuvent toujours compléter les parcours d'accès à distance centrés navigateur lorsque WebAuthn est pris en charge de bout en bout. En revanche, dans les flux VDI, RDP ou VPN basés sur un client, ils sont souvent moins pratiques parce que la prise en charge navigateur/WebAuthn et le handoff inter-appareils n'y sont pas disponibles de manière cohérente.

### Gestion des accès privilégiés

Les comptes administrateurs et l'accès aux systèmes sensibles exigent le niveau d'assurance le plus élevé. Les politiques Conditional Access d'Entra ID peuvent cibler des rôles d'administrateur spécifiques et des applications sensibles pour exiger External MFA via Mobile ID. Ce qu'Entra contrôle, c'est **quand** le facteur supplémentaire est requis. La méthode Mobile ID utilisée dans le parcours fournisseur relève de Mobile ID.

Les contrôles spécifiques à une méthode, tels que les ACR Mobile ID orientés Passkey, `keyringId` ou d'autres règles de pilotage direct de la méthode, relèvent d'intégrations OIDC directes avec Mobile ID en dehors de la surface d'administration Entra External MFA.

### Personnel hybride et de terrain

Tous les collaborateurs ne disposent pas d'un smartphone. Les travailleurs de terrain, le personnel de production ou les employés dans des environnements réglementés peuvent n'avoir qu'un téléphone mobile basique. Avec Mobile ID SIM, ces utilisateurs bénéficient d'un MFA fort sans aucune installation d'application. Le personnel de bureau peut utiliser l'App Mobile ID avec la biométrie pour une expérience plus fluide. Un seul fournisseur couvre tous les types d'appareils.

<div class="blog-infographic">
  <img src="/release-notes/media/infografik-entra-use-cases.jpg" alt="Cas d'usage en entreprise pour Mobile ID comme External MFA dans Microsoft Entra ID : scénarios Microsoft 365, VPN, accès privilégiés et personnel hybride" />
</div>

## Le parcours de migration : de Custom Controls à External MFA

Microsoft a établi un calendrier clair. Les organisations utilisant encore Custom Controls pour le MFA tiers doivent migrer vers External MFA avant la date de retrait.

<EntraMigrationTimeline />

La migration peut se faire progressivement. Microsoft prend en charge l'exécution de Custom Controls et External MFA **en parallèle** pendant la période de transition. Une approche recommandée :

<div class="blog-step-list">
  <div class="blog-step-card">
    <div class="blog-step-number">1</div>
    <div class="blog-step-body">
      <p><span class="blog-step-title">Configurer Mobile ID dans Entra ID.</span> Déclarez Mobile ID comme méthode External MFA dans le centre d'administration Entra en vous appuyant sur le <a href="/oidc-integration-guide/cloud-integration-guide#microsoft-entra-id">guide de configuration</a>.</p>
    </div>
  </div>
  <div class="blog-step-card">
    <div class="blog-step-number">2</div>
    <div class="blog-step-body">
      <p><span class="blog-step-title">Créer une politique Conditional Access parallèle.</span> Ciblez d'abord un groupe pilote clairement défini afin d'introduire le nouveau flux de manière contrôlée.</p>
    </div>
  </div>
  <div class="blog-step-card">
    <div class="blog-step-number">3</div>
    <div class="blog-step-body">
      <p><span class="blog-step-title">Valider le flux d'authentification avec ce groupe.</span> Vérifiez que l'évaluation des politiques, la redirection vers Mobile ID et le retour MFA réussi fonctionnent comme prévu.</p>
    </div>
  </div>
  <div class="blog-step-card">
    <div class="blog-step-number">4</div>
    <div class="blog-step-body">
      <p><span class="blog-step-title">Étendre ensuite le déploiement et retirer l'ancienne politique.</span> Appliquez la nouvelle politique à tous les utilisateurs concernés, puis désactivez la configuration Custom Controls existante.</p>
    </div>
  </div>
</div>

::: tip
Si vous découvrez Mobile ID et que vous l'envisagez comme fournisseur External MFA, Swisscom gère le processus d'[onboarding client](/oidc-integration-guide/getting-started). Vous recevrez l'Application ID, le Client ID et la Discovery URL nécessaires pour configurer External MFA dans Entra ID.
:::

## Comment démarrer

La mise en place de Mobile ID comme fournisseur External MFA dans Entra ID repose sur trois prérequis :

<div class="blog-step-list">
  <div class="blog-step-card">
    <div class="blog-step-number">1</div>
    <div class="blog-step-body">
      <p><span class="blog-step-title">Finaliser l'onboarding Mobile ID.</span> Contactez Swisscom pour recevoir vos identifiants d'intégration et terminer l'onboarding. Les informations de base sont disponibles dans <a href="/oidc-integration-guide/getting-started">premiers pas</a>.</p>
    </div>
  </div>
  <div class="blog-step-card">
    <div class="blog-step-number">2</div>
    <div class="blog-step-body">
      <p><span class="blog-step-title">Disposer d'un abonnement Entra ID P1 ou P2.</span> Conditional Access doit être activé et les licences doivent être attribuées aux utilisateurs concernés.</p>
    </div>
  </div>
  <div class="blog-step-card">
    <div class="blog-step-number">3</div>
    <div class="blog-step-body">
      <p><span class="blog-step-title">Prévoir un compte administrateur Entra ID.</span> La configuration initiale requiert le rôle Global Administrator ou Privileged Role Administrator.</p>
    </div>
  </div>
</div>

La configuration pas à pas est documentée dans le [Cloud Integration Guide](/oidc-integration-guide/cloud-integration-guide#microsoft-entra-id), y compris la configuration de la politique Conditional Access, le consentement administrateur et les étapes optionnelles pour prioriser Mobile ID par rapport à Microsoft Authenticator.

<div class="blog-infographic">
  <img src="/release-notes/media/infografik-entra-integration-flow.jpg" alt="Architecture d'intégration Mobile ID avec Microsoft Entra ID : flux d'authentification basé sur OIDC montrant l'évaluation des politiques, External MFA et le contrôle d'accès" />
</div>

## Conclusion

Avec External MFA désormais disponible en version générale dans Microsoft Entra ID, les organisations n'ont plus à choisir entre gestion centralisée des identités et authentification spécialisée. Entra ID reste le moteur de politiques. Mobile ID fournit le second facteur côté fournisseur au travers de la SIM, de l'App et d'un écosystème Mobile ID plus large, compatible avec les Passkeys, tandis qu'Entra ne consomme que le résultat External MFA.

Concrètement, les organisations disposent ainsi d'un seul fournisseur MFA pour Entra ID, les applications web, le VPN et les environnements RADIUS, avec une couverture allant du téléphone mobile basique aux plateformes modernes compatibles Passkey. La SIM et l'App restent particulièrement fortes pour les parcours d'entreprise hors bande, tandis que les Passkeys étendent le portefeuille Mobile ID aux scénarios navigateur résistants au phishing lorsque la configuration fournisseur et la compatibilité de plateforme le permettent. À cela s'ajoutent une infrastructure opérée en Suisse et une intégration OIDC fondée sur les standards, qui constituent une trajectoire durable à mesure qu'External MFA remplace les Custom Controls dépréciés et que Mobile ID continue d'évoluer avec de nouvelles capacités comme le [Passkey Vault](/release-notes/posts/2026-03-30-mobile-id-passkeys#roadmap-the-mobile-id-passkey-vault).

Pour toute question sur les intégrations Mobile ID, contactez [Backoffice.Security@swisscom.com](mailto:Backoffice.Security@swisscom.com). Pour des informations générales sur le service, consultez [mobileid.ch](https://www.mobileid.ch/fr).
