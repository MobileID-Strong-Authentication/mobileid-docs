---
title: "Mobile ID e Microsoft Entra ID: MFA rafforzata con External Authentication"
date: 2026-03-27
author: Mobile ID Team
description: "Microsoft Entra External MFA è generalmente disponibile. Scopri come Mobile ID si integra come provider External MFA basato su OIDC e come SIM, App e Passkeys si articolano correttamente."
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
</script>

<LanguageSwitcher />

<div class="blog-lead">
Microsoft Entra ID è la piattaforma di identità alla base di milioni di ambienti aziendali. Con <strong>External MFA ora generalmente disponibile</strong>, le organizzazioni possono integrare un provider di autenticazione di terze parti affidabile in Entra ID, mantenendo il pieno controllo sulle policy Conditional Access. Mobile ID, operato da Swisscom, combina <a href="/rest-api-guide/introduction#mobile-id-sim---method">l'autenticazione hardware-grade basata su SIM</a>, <a href="/rest-api-guide/introduction#mobile-id-app---method">l'autenticazione push tramite app</a>, controlli condivisi come Number Matching e Transaction Signing, opzioni di Geofencing differenziate e un ecosistema OIDC più ampio che ora include anche i <a href="/oidc-integration-guide/passkey-authentication">Mobile ID Passkeys</a>. Nel percorso Entra External MFA, Entra consuma il risultato del provider mentre Mobile ID esegue l'esperienza di secondo fattore.
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

**External MFA** cambia questo scenario. Lanciata in anteprima pubblica nel maggio 2024 e [generalmente disponibile da marzo 2026](https://techcommunity.microsoft.com/blog/microsoft-entra-blog/external-mfa-in-microsoft-entra-id-is-now-generally-available/4488926), External MFA consente a un provider esterno di soddisfare il requisito MFA di Entra ID tramite un'integrazione provider basata su standard. In pratica, può soddisfare il grant control di Conditional Access **Require multifactor authentication** ed è gestita insieme agli altri metodi di autenticazione in Entra ID.

Questo non significa però che sia identica a ogni metodo integrato di Entra. Microsoft al momento non supporta External MFA con le Authentication Strengths. L'affermazione importante è più precisa: External MFA è un modo supportato per soddisfare il requisito MFA di Entra ID con un provider terzo.

L'integrazione utilizza **OpenID Connect (OIDC)** tra Entra ID e il provider esterno. Per Microsoft Entra External MFA si tratta del pattern provider documentato da Microsoft, non di una relying party che usa il normale Authorization Code Flow di Mobile ID.

::: info
External MFA sostituisce Custom Controls, che Microsoft prevede di [deprecare il 30 settembre 2026](https://learn.microsoft.com/en-us/entra/identity/authentication/how-to-authentication-external-method-manage). Le organizzazioni che utilizzano ancora Custom Controls dovrebbero pianificare la migrazione sin da ora.
:::

## Come funziona External MFA?

Il flusso resta semplice per l'utente finale, ma tecnicamente **non coincide** con una normale integrazione Mobile ID in Authorization Code da parte di una relying party. Nello scenario External MFA, Microsoft Entra ID chiama l'endpoint di autorizzazione OIDC del provider usando il proprio profilo implicit per provider esterni, includendo parametri come `response_type=id_token`, `response_mode=form_post` e un `id_token_hint` che identifica utente e tenant.

Mobile ID valida questo contesto Entra, esegue il percorso di secondo fattore lato provider e restituisce a Entra ID un `id_token` firmato. Entra ID valida quel token e verifica se il requisito MFA è stato soddisfatto.

<EntraIntegrationFlow />

Entra ID resta il **control plane dell'identità** durante l'intero processo: valutazione delle policy, decisioni di accesso, emissione dei token e gestione delle sessioni. Mobile ID gestisce il passaggio di autenticazione vero e proprio.

Questa separazione è fondamentale. Entra decide **quando** è richiesto l'MFA e consuma il risultato del provider. Mobile ID decide **come** l'utente si autentica nel percorso provider. Entra non ha bisogno di capire se Mobile ID ha soddisfatto internamente il secondo fattore tramite SIM, App o Passkey.

## Perché Mobile ID come provider External MFA?

La maggior parte dei provider External MFA offre notifiche push basate su app. Mobile ID va oltre, con una combinazione di metodi di autenticazione che copre scenari che altri provider semplicemente non possono affrontare.

Nel più ampio ecosistema Mobile ID esistono ora **tre metodi forti**: **SIM**, **App** e **Passkeys**. Per Entra External MFA, il punto importante non è che Entra scelga fra questi metodi; non lo fa. Mobile ID esegue il percorso lato provider e Entra consuma l'esito positivo.

### Autenticazione basata su SIM: nessuna app necessaria

Il [metodo SIM](/rest-api-guide/introduction#mobile-id-sim---method) di Mobile ID utilizza la scheda SIM (o eSIM) come token hardware tamper-proof, certificato **EAL5+** (ISO/IEC 15408). Oltre 6 milioni di SIM svizzere di Swisscom, Sunrise e Salt sono abilitate per Mobile ID.

Per gli ambienti Entra ID, ciò significa che la MFA funziona su **qualsiasi dispositivo mobile**, compresi i telefoni di base senza sistema operativo smartphone. Nessuna app da installare, nessuna dipendenza dall'app store, nessuna connessione dati necessaria durante l'autenticazione. Per le organizzazioni con lavoratori sul campo, ambienti industriali o dipendenti che non utilizzano smartphone, questo rappresenta un differenziatore fondamentale.

I due fattori sono la scheda SIM fisica (possesso) e il PIN Mobile ID personale (conoscenza). L'autenticazione avviene su un canale crittografato separato, indipendente dalla connessione internet.

### Autenticazione tramite app: oltre il semplice push

La [Mobile ID App](/rest-api-guide/introduction#mobile-id-app---method) per iOS e Android va ben oltre le notifiche push standard. Gli utenti possono autenticarsi con impronta digitale o riconoscimento facciale. **Il Number Matching** e il **[Transaction Signing](/oidc-integration-guide/message-formats)** sono disponibili sia con Mobile ID SIM sia con Mobile ID App. Nell'App, queste capacità si combinano con una UX nativa da smartphone e con la biometria. **Il Geofencing lato App** usa localizzazione GPS e segnali integrati di jailbreak e servizi mock, rendendo più difficile il GPS spoofing. Negli scenari supportati con Swisscom SIM, il Geofencing è possibile anche tramite il meccanismo di localizzazione della rete mobile.

L'app è basata sulla tecnologia di Futurae, uno spin-off dell'ETH di Zurigo, e conserva le chiavi nel Trusted Execution Environment (TEE) del dispositivo.

### Autenticazione Passkey: capacità browser resistente al phishing

Oltre a SIM e App, Mobile ID supporta ora anche i [Passkeys FIDO2](/oidc-integration-guide/passkey-authentication) nel proprio ecosistema OIDC. I Passkeys sono legati crittograficamente al dominio e quindi resistenti allo URL spoofing. Gli utenti registrano i propri Passkeys su [mobileid.ch](https://mobileid.ch/login) e possono usarli presso le relying party connesse configurate per i Mobile ID Passkeys.

Per le integrazioni OIDC dirette con Mobile ID, i Passkeys possono essere combinati con controlli specifici di Mobile ID come valori ACR orientati ai Passkeys e la gestione di `keyringId`. Questi controlli appartengono all'integrazione standard tra relying party e Mobile ID, non alla superficie amministrativa di Entra External MFA.

::: info
Nel contesto di Entra ID External MFA, Entra continua a consumare solo il risultato del flusso provider Mobile ID. Entra non distingue SIM, App o Passkey come metodi Mobile ID separati. Se i Passkeys sono abilitati nella configurazione del provider Mobile ID dietro un'integrazione Entra, restano una scelta di metodo lato Mobile ID e non un'impostazione lato Entra. Per maggiori dettagli sui Passkeys e sul loro ruolo nell'ecosistema Mobile ID, consultare l'articolo correlato: [Mobile ID Passkeys: autenticazione resistente al phishing per scenari browser](/release-notes/posts/2026-03-30-mobile-id-passkeys).
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

External MFA con Mobile ID copre un'ampia gamma di scenari aziendali. SIM e App coprono i percorsi enterprise out-of-band più ampi. I Passkeys completano i percorsi browser-centrici dove il supporto WebAuthn è disponibile end-to-end.

<EntraUseCaseCards />

### MFA per Microsoft 365 per i dipendenti

Lo scenario più comune: proteggere l'accesso a Outlook, Teams, SharePoint e altre applicazioni Microsoft 365. Quando una policy Conditional Access richiede la MFA, i dipendenti si autenticano tramite Mobile ID al posto di, o insieme a, Microsoft Authenticator.

Questo è particolarmente prezioso per le organizzazioni che desiderano un **unico provider MFA per tutte le applicazioni**, non solo per i servizi Microsoft. Poiché Mobile ID utilizza [OIDC standard](/oidc-integration-guide/introduction), gli stessi metodi di autenticazione funzionano per Entra ID, applicazioni web custom, accesso VPN e altro.

### VPN e accesso remoto

Per gateway VPN, ambienti Citrix, sessioni VDI e accesso desktop remoto, Mobile ID fornisce la MFA tramite il [RADIUS Interface Gateway](/radius-interface-gateway-guide/introduction) o direttamente via OIDC. Sia SIM sia App si adattano bene a questi scenari out-of-band, perché nessuno dei due metodi dipende dal Bluetooth verso una chiave hardware. Restano quindi pratici anche quando la sessione protetta è remota o guidata da un client.

I Passkeys possono comunque completare percorsi di accesso remoto browser-centrici quando WebAuthn è supportato end-to-end. Nei flussi VDI, RDP o VPN basati su client, però, sono spesso meno pratici perché il supporto browser/WebAuthn e il cross-device handoff non sono disponibili in modo coerente.

### Privileged Access Management

Gli account amministratore e l'accesso a sistemi sensibili richiedono il massimo livello di garanzia. Le policy Conditional Access di Entra ID possono essere indirizzate a ruoli amministrativi specifici e applicazioni sensibili per richiedere External MFA tramite Mobile ID. Ciò che Entra controlla è **quando** il fattore aggiuntivo è richiesto. Quale metodo Mobile ID venga usato nel percorso provider è una responsabilità di Mobile ID.

Controlli specifici di metodo, come gli ACR Mobile ID passkey-only, `keyringId` o altre regole di selezione diretta del metodo, appartengono a integrazioni OIDC dirette con Mobile ID al di fuori della superficie amministrativa di Entra External MFA.

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

Con External MFA ora generalmente disponibile in Microsoft Entra ID, le organizzazioni non devono più scegliere tra gestione centralizzata delle identità e autenticazione specializzata. Entra ID resta il motore di policy. Mobile ID fornisce il secondo fattore lato provider attraverso SIM, App e il più ampio ecosistema Mobile ID compatibile con i Passkeys, mentre Entra consuma solo il risultato External MFA.

In pratica, questo significa poter contare su un unico provider MFA per Entra ID, applicazioni web, VPN e ambienti RADIUS, con copertura che va dai telefoni di base alle moderne piattaforme compatibili con i Passkeys. SIM e App restano particolarmente forti per i percorsi enterprise out-of-band, mentre i Passkeys ampliano il portafoglio Mobile ID verso scenari browser resistenti al phishing quando la configurazione del provider e il supporto della piattaforma lo consentono. Il tutto con un'infrastruttura operata in Svizzera, un'integrazione OIDC basata su standard e una base solida per il futuro, perché External MFA sostituisce i Custom Controls deprecati e Mobile ID continua a evolversi con nuove funzionalità come il [Passkey Vault](/release-notes/posts/2026-03-30-mobile-id-passkeys#roadmap-the-mobile-id-passkey-vault).

Per domande sulle integrazioni Mobile ID, contattare [Backoffice.Security@swisscom.com](mailto:Backoffice.Security@swisscom.com). Per informazioni generali sul servizio, visitare [mobileid.ch](https://www.mobileid.ch/it).
