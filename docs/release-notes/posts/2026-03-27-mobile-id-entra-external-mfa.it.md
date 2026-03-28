---
title: "Mobile ID e Microsoft Entra ID: MFA rafforzata con External Authentication"
date: 2026-03-27
author: Mobile ID Team
description: "Microsoft Entra External MFA è generalmente disponibile. Scopri come Mobile ID aggiunge MFA basata su SIM e app per Entra ID, VPN, applicazioni web e workforce ibride."
thumbnail: /release-notes/img/entra-eam-thumb.png
lang: it
keywords:
  - Microsoft Entra External MFA
  - Mobile ID
  - provider External MFA
  - MFA Entra ID
  - Conditional Access
  - MFA basata su SIM
  - MFA basata su app
  - VPN MFA
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
Microsoft Entra ID è la piattaforma di identità alla base di milioni di ambienti aziendali. Con <strong>External MFA ora generalmente disponibile</strong>, le organizzazioni possono integrare un provider di autenticazione di terze parti affidabile in Entra ID, mantenendo il pieno controllo sulle policy Conditional Access. Mobile ID, operato da Swisscom, aggiunge <a href="/rest-api-guide/introduction#mobile-id-sim---method">l'autenticazione hardware-grade basata su SIM</a> e <a href="/rest-api-guide/introduction#mobile-id-app---method">l'autenticazione push tramite app con Geofencing</a> ai login Entra ID che richiedono MFA.
</div>

<div class="blog-video">
  <video controls preload="metadata" poster="/release-notes/img/entra-eam-thumb.png">
    <source src="/release-notes/media/entra-external-mfa-explainer.mp4" type="video/mp4" />
  </video>
  <div class="blog-video-caption">
    <svg class="video-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
    <span>Sintesi video (7 min). I punti chiave di questo articolo a colpo d'occhio.</span>
  </div>
</div>

## Cos'è Microsoft Entra External MFA?

Microsoft Entra ID è la piattaforma centrale di gestione delle identità e degli accessi per le aziende che utilizzano Microsoft 365, Azure e migliaia di applicazioni connesse. Quando gli utenti effettuano il login, Entra ID valuta le policy **Conditional Access** per decidere se è necessaria una verifica aggiuntiva e quale metodo utilizzare.

Entra ID offre già diversi metodi MFA integrati: Authenticator app, chiavi di sicurezza FIDO2, SMS e chiamate telefoniche. Per le organizzazioni che avevano bisogno di integrare un **provider di autenticazione di terze parti**, l'unica opzione era un meccanismo legacy chiamato **Custom Controls**. Custom Controls consentiva il reindirizzamento degli utenti a un provider esterno, ma con limitazioni significative. L'autenticazione esterna non veniva pienamente riconosciuta come MFA da Entra ID, il che ne limitava l'utilizzo nelle policy Conditional Access e nei grant controls.

**External MFA** cambia questo scenario. Lanciata in anteprima pubblica nel maggio 2024 e [generalmente disponibile da marzo 2026](https://techcommunity.microsoft.com/blog/microsoft-entra-blog/external-mfa-in-microsoft-entra-id-is-now-generally-available/4488926), External MFA consente a un provider esterno di registrarsi come metodo di autenticazione multifattore pienamente riconosciuto. Entra ID tratta la risposta External MFA esattamente come i propri metodi integrati: soddisfa i requisiti MFA di Conditional Access, funziona con le policy di frequenza di accesso e si integra nel flusso di autenticazione standard.

L'integrazione utilizza **OpenID Connect (OIDC)**, un protocollo aperto e conforme agli standard. Nessuna API proprietaria, nessun vendor lock-in.

::: info
External MFA sostituisce Custom Controls, che Microsoft prevede di [deprecare il 30 settembre 2026](https://learn.microsoft.com/en-us/entra/identity/authentication/how-to-authentication-external-method-manage). Le organizzazioni che utilizzano ancora Custom Controls dovrebbero pianificare la migrazione sin da ora.
:::

## Come funziona External MFA?

Il flusso è trasparente per l'utente finale. Quando qualcuno accede a un'applicazione protetta, Entra ID valuta la policy Conditional Access. Se è richiesta la MFA e Mobile ID è configurato come provider esterno, l'utente viene reindirizzato tramite OIDC a Mobile ID per l'autenticazione. Dopo la verifica avvenuta con successo, l'utente ritorna a Entra ID con un claim MFA valido e ottiene l'accesso.

<EntraIntegrationFlow />

Entra ID resta il **control plane dell'identità** durante l'intero processo: valutazione delle policy, decisioni di accesso, emissione dei token e gestione delle sessioni. Mobile ID gestisce il passaggio di autenticazione vero e proprio, in cui l'utente dimostra la propria identità tramite un secondo fattore.

Il risultato è una netta separazione delle responsabilità. Da un lato il motore di policy e le capacità di governance di Microsoft, dall'altro i metodi di autenticazione specializzati e l'infrastruttura operata in Svizzera di Mobile ID.

## Perché Mobile ID come provider External MFA?

La maggior parte dei provider External MFA offre notifiche push basate su app. Mobile ID va oltre, con una combinazione di metodi di autenticazione che copre scenari che altri provider semplicemente non possono affrontare.

### Autenticazione basata su SIM: nessuna app necessaria

Il [metodo SIM](/rest-api-guide/introduction#mobile-id-sim---method) di Mobile ID utilizza la scheda SIM (o eSIM) come token hardware tamper-proof, certificato **EAL5+** (ISO/IEC 15408). Oltre 6 milioni di SIM svizzere di Swisscom, Sunrise e Salt sono abilitate per Mobile ID.

Per gli ambienti Entra ID, ciò significa che la MFA funziona su **qualsiasi dispositivo mobile**, compresi i telefoni di base senza sistema operativo smartphone. Nessuna app da installare, nessuna dipendenza dall'app store, nessuna connessione dati necessaria durante l'autenticazione. Per le organizzazioni con lavoratori sul campo, ambienti industriali o dipendenti che non utilizzano smartphone, questo rappresenta un differenziatore fondamentale.

I due fattori sono la scheda SIM fisica (possesso) e il PIN Mobile ID personale (conoscenza). L'autenticazione avviene su un canale crittografato separato, indipendente dalla connessione internet.

### Autenticazione tramite app: oltre il semplice push

La [Mobile ID App](/rest-api-guide/introduction#mobile-id-app---method) per iOS e Android va ben oltre le notifiche push standard. Gli utenti possono autenticarsi con impronta digitale o riconoscimento facciale. Il [Geofencing](/oidc-integration-guide/getting-started#authentication-context-class-reference-acr) limita l'autenticazione a specifiche aree geografiche, con rilevamento integrato di jailbreak e GPS spoofing. Il Number Matching consente all'utente di confermare un codice visualizzato sullo schermo, prevenendo gli attacchi di MFA fatigue. Il [Transaction Signing](/oidc-integration-guide/message-formats) mostra i dettagli di una transazione direttamente sul dispositivo (ad es. "Conferma il trasferimento di CHF 1'000 sul conto XY"), in modo che l'utente dia il proprio consenso esplicito.

L'app è basata sulla tecnologia di Futurae, uno spin-off dell'ETH di Zurigo, e conserva le chiavi nel Trusted Execution Environment (TEE) del dispositivo.

### Autenticazione Passkey: login resistente al phishing

Oltre a SIM e App, Mobile ID supporta i [Passkeys FIDO2](/oidc-integration-guide/passkey-authentication) per l'autenticazione resistente al phishing nel proprio ecosistema OIDC. I Passkeys sono legati crittograficamente al dominio, il che li rende immuni allo URL spoofing. Gli utenti registrano i propri Passkeys una sola volta su [mobileid.ch](https://mobileid.ch/login) e possono utilizzarli su tutti i relying party connessi.

::: info
I Passkeys sono una funzionalità generale di Mobile ID disponibile tramite l'integrazione OIDC standard. Nel contesto di Entra ID External MFA, SIM e App sono i metodi di autenticazione principali. Per dettagli sui Passkeys e il loro ruolo nell'ecosistema Mobile ID più ampio, consultare l'articolo correlato: [Mobile ID Passkeys: autenticazione resistente al phishing per scenari browser](/release-notes/posts/2026-03-30-mobile-id-passkeys).
:::

### Operatività svizzera e residenza dei dati

Mobile ID è operato da Swisscom dalla Svizzera. Le organizzazioni con requisiti di residenza dei dati o una preferenza per servizi di sicurezza operati in Europa possono contare sul fatto che i dati di autenticazione restano sotto la giurisdizione svizzera.

### Dove Mobile ID aggiunge valore rispetto alla MFA nativa

Microsoft Authenticator è un'opzione solida come default per le organizzazioni che necessitano solo di push basato su app e TOTP. Mobile ID aggiunge un valore chiaro quando i requisiti vanno oltre questa base:

- **Parte del personale lavora senza smartphone.**
- **L'autenticazione deve essere vincolata a un'area geografica definita.**
- **Gli utenti devono confermare esplicitamente i dettagli della transazione sul proprio dispositivo.**
- **Un unico provider MFA deve coprire Entra ID, applicazioni custom, VPN e ambienti RADIUS.**

Questi sono scenari in cui un approccio basato solo su app raggiunge i propri limiti.

## Casi d'uso aziendali

External MFA con Mobile ID copre un'ampia gamma di scenari aziendali. Il metodo di autenticazione più adatto (SIM o App) dipende dai requisiti di sicurezza e dal contesto dell'utente.

<EntraUseCaseCards />

### MFA per Microsoft 365 per i dipendenti

Lo scenario più comune: proteggere l'accesso a Outlook, Teams, SharePoint e altre applicazioni Microsoft 365. Quando una policy Conditional Access richiede la MFA, i dipendenti si autenticano tramite Mobile ID al posto di, o insieme a, Microsoft Authenticator.

Questo è particolarmente prezioso per le organizzazioni che desiderano un **unico provider MFA per tutte le applicazioni**, non solo per i servizi Microsoft. Poiché Mobile ID utilizza [OIDC standard](/oidc-integration-guide/introduction), gli stessi metodi di autenticazione funzionano per Entra ID, applicazioni web custom, accesso VPN e altro.

### VPN e accesso remoto

Per gateway VPN, ambienti Citrix, sessioni VDI e accesso desktop remoto, Mobile ID fornisce la MFA tramite il [RADIUS Interface Gateway](/radius-interface-gateway-guide/introduction) o direttamente via OIDC. Il metodo SIM è particolarmente adatto in questo contesto perché funziona in modo affidabile anche in ambienti dove l'autenticazione basata su app non è praticabile. Una sessione desktop remoto, ad esempio, spesso blocca la comunicazione Bluetooth con una chiave di sicurezza.

### Privileged Access Management

Gli account amministratore e l'accesso a sistemi sensibili richiedono il massimo livello di garanzia. Le policy Conditional Access di Entra ID possono essere indirizzate a ruoli amministrativi specifici e applicazioni sensibili per richiedere External MFA tramite Mobile ID. Mobile ID autentica quindi l'utente con i metodi disponibili. Per le organizzazioni che utilizzano Mobile ID anche al di fuori del contesto Entra (ad es. per applicazioni web o VPN), i [valori ACR granulari](/oidc-integration-guide/getting-started#authentication-context-class-reference-acr) nella richiesta di autorizzazione OIDC consentono al Relying Party di imporre metodi specifici come App con Geofencing o Transaction Signing.

### Forza lavoro ibrida e sul campo

Non tutti i dipendenti dispongono di uno smartphone. Lavoratori sul campo, personale di produzione o dipendenti in ambienti regolamentati possono avere solo un telefono cellulare di base. Con Mobile ID SIM, questi utenti ottengono una MFA robusta senza alcuna installazione di app. Il personale d'ufficio può utilizzare la Mobile ID App con biometria per un'esperienza più fluida. Un unico provider copre ogni tipo di dispositivo.

<div class="blog-infographic">
  <img src="/release-notes/media/infografik-entra-use-cases.jpg" alt="Casi d'uso aziendali per Mobile ID come External MFA in Microsoft Entra ID: scenari Microsoft 365, VPN, accesso privilegiato e forza lavoro ibrida" />
</div>

## Il percorso di migrazione: da Custom Controls a External MFA

Microsoft ha fissato una tempistica chiara. Le organizzazioni che utilizzano ancora Custom Controls per la MFA di terze parti dovrebbero migrare a External MFA prima della scadenza di deprecazione.

<EntraMigrationTimeline />

La migrazione può avvenire gradualmente. Microsoft supporta l'utilizzo simultaneo di Custom Controls ed External MFA durante il periodo di transizione. Un approccio consigliato:

<div class="blog-step-list">
  <div class="blog-step-card">
    <div class="blog-step-number">1</div>
    <div class="blog-step-body">
      <p><span class="blog-step-title">Configurare Mobile ID in Entra ID.</span> Impostate Mobile ID come metodo External MFA nell'admin center di Entra seguendo la <a href="/oidc-integration-guide/cloud-integration-guide#microsoft-entra-id">guida alla configurazione</a>.</p>
    </div>
  </div>
  <div class="blog-step-card">
    <div class="blog-step-number">2</div>
    <div class="blog-step-body">
      <p><span class="blog-step-title">Creare una policy Conditional Access parallela.</span> Rivolgete la nuova policy inizialmente a un gruppo pilota ben definito, così da introdurre il nuovo flusso in modo controllato.</p>
    </div>
  </div>
  <div class="blog-step-card">
    <div class="blog-step-number">3</div>
    <div class="blog-step-body">
      <p><span class="blog-step-title">Validare il flusso di autenticazione con questo gruppo.</span> Verificate che la valutazione delle policy, il reindirizzamento verso Mobile ID e il ritorno MFA avvengano come previsto.</p>
    </div>
  </div>
  <div class="blog-step-card">
    <div class="blog-step-number">4</div>
    <div class="blog-step-body">
      <p><span class="blog-step-title">Estendere il rollout e dismettere la policy legacy.</span> Applicate poi la nuova policy a tutti gli utenti interessati e disabilitate la precedente configurazione basata su Custom Controls.</p>
    </div>
  </div>
</div>

::: tip
Se Mobile ID è una novità per la vostra organizzazione e lo state valutando come provider External MFA, Swisscom gestisce il processo di [onboarding del cliente](/oidc-integration-guide/getting-started). Riceverete l'Application ID, il Client ID e il Discovery URL necessari per configurare External MFA in Entra ID.
:::

## Come iniziare

Configurare Mobile ID come provider External MFA in Entra ID richiede tre prerequisiti:

<div class="blog-step-list">
  <div class="blog-step-card">
    <div class="blog-step-number">1</div>
    <div class="blog-step-body">
      <p><span class="blog-step-title">Completare l'onboarding di Mobile ID.</span> Contattate Swisscom per ricevere le credenziali di integrazione e portare a termine l'onboarding. Le informazioni di base sono raccolte nella sezione <a href="/oidc-integration-guide/getting-started">per iniziare</a>.</p>
    </div>
  </div>
  <div class="blog-step-card">
    <div class="blog-step-number">2</div>
    <div class="blog-step-body">
      <p><span class="blog-step-title">Disporre di un abbonamento Entra ID P1 o P2.</span> Conditional Access deve essere abilitato e le licenze devono essere assegnate agli utenti interessati.</p>
    </div>
  </div>
  <div class="blog-step-card">
    <div class="blog-step-number">3</div>
    <div class="blog-step-body">
      <p><span class="blog-step-title">Preparare un account amministratore Entra ID.</span> La configurazione iniziale richiede il ruolo Global Administrator oppure Privileged Role Administrator.</p>
    </div>
  </div>
</div>

La configurazione passo per passo è documentata nella [Cloud Integration Guide](/oidc-integration-guide/cloud-integration-guide#microsoft-entra-id), compresa la configurazione delle policy Conditional Access, il consenso amministratore e i passaggi opzionali per dare priorità a Mobile ID rispetto a Microsoft Authenticator.

<div class="blog-infographic">
  <img src="/release-notes/media/infografik-entra-integration-flow.jpg" alt="Architettura di integrazione Mobile ID con Microsoft Entra ID: flusso di autenticazione basato su OIDC che mostra la valutazione delle policy, External MFA e il controllo degli accessi" />
</div>

## Conclusione

Con External MFA ora generalmente disponibile in Microsoft Entra ID, le organizzazioni non devono più scegliere tra gestione centralizzata delle identità e autenticazione specializzata. Entra ID resta il motore di policy. Mobile ID fornisce il secondo fattore, tramite SIM o App, a seconda del caso d'uso.

In pratica, questo significa poter contare su un unico provider MFA per Entra ID, applicazioni web, VPN e ambienti RADIUS, con copertura per tutti i tipi di dispositivi, dagli smartphone ai telefoni di base. Il tutto con un'infrastruttura operata in Svizzera, un'integrazione OIDC basata su standard e una base solida per il futuro, perché External MFA sostituisce i Custom Controls deprecati e Mobile ID continua a evolversi con nuove funzionalità come il [Passkey Vault](/release-notes/posts/2026-03-30-mobile-id-passkeys#roadmap-the-mobile-id-passkey-vault).

Per domande sulle integrazioni Mobile ID, contattare [Backoffice.Security@swisscom.com](mailto:Backoffice.Security@swisscom.com). Per informazioni generali sul servizio, visitare [mobileid.ch](https://www.mobileid.ch/it).
