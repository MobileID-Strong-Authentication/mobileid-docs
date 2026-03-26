---
title: "Mobile ID Passkeys: autenticazione resistente al phishing per scenari browser"
date: 2026-03-23
author: Mobile ID Team
description: "I Passkeys consentono login resistenti al phishing tramite biometria in meno di 3 secondi. Mobile ID li integra nativamente nell'ecosistema OIDC e mostra perché SIM e App restano indispensabili."
thumbnail: /release-notes/img/passkeys-thumb.png
lang: it
readingTime: 12
layout: release-notes-post
---

<script setup>
import ComparisonTable from '../../.vitepress/theme/components/ComparisonTable.vue'
import AcrLevels from '../../.vitepress/theme/components/AcrLevels.vue'
import PasskeyRegistrationFlow from '../../.vitepress/theme/components/PasskeyRegistrationFlow.vue'
import PasskeyLoginFlow from '../../.vitepress/theme/components/PasskeyLoginFlow.vue'
import SzenarienMatrix from '../../.vitepress/theme/components/SzenarienMatrix.vue'
import PasskeyTypesCards from '../../.vitepress/theme/components/PasskeyTypesCards.vue'
import HybridAuthFlow from '../../.vitepress/theme/components/HybridAuthFlow.vue'
import HybridAuthComparisonTable from '../../.vitepress/theme/components/HybridAuthComparisonTable.vue'
import PasskeyVaultRoadmap from '../../.vitepress/theme/components/PasskeyVaultRoadmap.vue'
import LanguageSwitcher from '../../.vitepress/theme/components/LanguageSwitcher.vue'
import ScreenshotStep from '../../.vitepress/theme/components/ScreenshotStep.vue'
</script>

<LanguageSwitcher />

<div class="blog-lead">
Microsoft blocca ogni giorno circa 7'000 attacchi alle password al secondo, e il 47% dei consumatori abbandona un acquisto quando dimentica la propria password. In un mondo in cui il phishing resta il vettore di attacco più diffuso, serve una risposta radicalmente nuova. <strong>I Passkeys</strong> sono questa risposta. Mobile ID li integra ora nativamente nel proprio ecosistema OIDC, combinandoli con i punti di forza consolidati di SIM e App.
</div>

<div class="blog-infographic">
  <img src="/release-notes/media/infografik-overview.webp" alt="Mobile ID Passkeys: panoramica dell'ecosistema con gestione centralizzata dei Passkeys e integrazione OIDC" />
</div>

## NIST AAL: il quadro di riferimento per i livelli di sicurezza

Prima di analizzare nel dettaglio i singoli metodi, è fondamentale avere una comprensione condivisa dei livelli di sicurezza. Lo standard NIST SP 800-63B definisce tre Authenticator Assurance Levels (AAL), che nei settori regolamentati come banking, sanità e pubblica amministrazione fungono da quadro di riferimento.

**AAL1** richiede soltanto un'autenticazione a fattore singolo. Password, SMS-OTP o semplici token soddisfano questo livello. Il grado di sicurezza è basso.

**AAL2** richiede due fattori distinti. Inoltre, per i servizi online deve essere offerta un'opzione resistente al phishing. Cloud-Synced Passkeys, generatori TOTP, Mobile Push (come Mobile ID SIM o App) e dispositivi OTP multifattore soddisfano AAL2.

**AAL3** è il livello più elevato. Richiede crittografia a chiave pubblica, un modulo hardware validato FIPS 140 Level 2 o superiore, procedure resistenti al phishing e una chiave privata non esportabile. Si applica inoltre una ri-autenticazione dopo 15 minuti di inattività. Solo pochi authenticator soddisfano pienamente questi requisiti: chiavi di sicurezza certificate FIPS (ad es. YubiKey 5 FIPS Series), determinate smartcard e Hardware Security Modules.

## Cosa sono i Passkeys?

I Passkeys sono un'implementazione user-friendly dello standard FIDO2 e dell'API WebAuthn. Sostituiscono le password con coppie di chiavi crittografiche e consentono il login tramite biometria in meno di 3 secondi. Il principio fondamentale: la chiave privata non lascia mai il dispositivo dell'utente. L'authenticator firma una challenge che il server verifica con la chiave pubblica.

La particolarità dei Passkeys è il cosiddetto Origin-Binding: la chiave è legata crittograficamente al dominio del servizio. Anche se un utente raggiunge una pagina di phishing riprodotta alla perfezione, l'autenticazione fallisce perché il browser riconosce il dominio errato e non rilascia la chiave.

<ComparisonTable />

## Tipi di Passkeys: comodità vs. massima sicurezza

Non tutti i Passkeys sono uguali. A seconda del livello di protezione richiesto, si impiegano tipologie diverse. La scelta ha un impatto diretto sul livello di sicurezza raggiungibile.

### Cloud-Synced Passkeys

I Cloud-Synced Passkeys vengono sincronizzati attraverso l'infrastruttura cloud del fornitore della piattaforma: Apple iCloud Keychain, Google Password Manager o gestori di terze parti come 1Password. Nei principali ecosistemi consumer la sincronizzazione cloud è diventata l'esperienza utente predefinita, perché massimizza recovery e utilizzo su più dispositivi.

Il grande vantaggio: i Passkeys sono disponibili su tutti i dispositivi dello stesso ecosistema. In caso di smarrimento di un dispositivo, l'accesso resta garantito tramite gli altri dispositivi. La sincronizzazione avviene con crittografia end-to-end. I Cloud-Synced Passkeys possono inoltre essere condivisi con familiari o amici, il che significa anche che possono finire su dispositivi non affidabili.

Livello di sicurezza: **AAL2**. Poiché le chiavi sono esportabili e risiedono in infrastrutture cloud (soggette al CLOUD Act statunitense), non soddisfano i requisiti per AAL3.

### Device-Bound Passkeys

Con i Device-Bound Passkeys la chiave privata non lascia mai l'hardware di sicurezza. Rappresentanti tipici sono le chiavi di sicurezza certificate FIPS come la YubiKey 5 FIPS Series (FIPS 140-2 Cert #3907, ca. CHF 100 su Digitec). Offrono il massimo livello di sicurezza e sono conformi ad AAL3.

È importante sapere che le YubiKey standard (senza certificazione FIPS) non sono sufficienti per AAL3. Nel settembre 2024 è stata inoltre scoperta una grave vulnerabilità nella YubiKey 5 Series, che non può essere corretta tramite aggiornamento firmware ma richiede la sostituzione fisica del token. Questo illustra un problema fondamentale dei token fisici: le falle di sicurezza possono essere costose e complesse da risolvere.

Livello di sicurezza: **AAL3** (solo con certificazione FIPS 140-2 e firmware 5.7 o successivo).

### Platform Authenticators

I Platform Authenticators sono moduli di sicurezza integrati direttamente nel dispositivo, come Windows Hello (TPM), Apple Touch ID/Face ID (Secure Enclave) o il chip Titan M2 nei dispositivi Google Pixel. Possono funzionare come Cloud-Synced o Device-Bound a seconda della configurazione.

AAL3 è raggiungibile solo se la chiave non viene sincronizzata nel cloud e il componente hardware è validato FIPS. In pratica ciò richiede una configurazione device-bound o un autenticatore esterno che mantenga la chiave privata al di fuori di uno store di credenziali sincronizzato nel cloud.

### 3rd-Party Passkey Provider

Da iOS 17 e Android 14 è possibile registrare provider di terze parti come Passkey Provider. La Credential Manager API (Android) e AuthenticationServices (iOS) consentono alle app di autenticazione di creare e gestire Passkeys senza che l'utente dipenda dall'archivio Passkey di sistema.

Questa è la base tecnica per il futuro Mobile ID Passkey Vault: l'app Mobile ID diventerà essa stessa un Passkey Provider e potrà gestire Device-Bound Passkeys a livello AAL3, senza la necessità di token hardware fisici.

<div class="blog-infographic">
  <img src="/release-notes/media/infografik-passkey-typen.webp" alt="Tipi di Passkeys a confronto in termini di sicurezza: Cloud-Synced, Device-Bound e Platform Authenticators" />
</div>

<PasskeyTypesCards />

## Integrazione Passkey: semplice per gli utenti, complessa per le aziende

I Passkeys promettono un'esperienza utente semplice. La realtà tecnica dietro le quinte è tuttavia impegnativa. Un'infrastruttura Passkey completa richiede:

Un **backend WebAuthn** con libreria server FIDO2, validazione dell'attestation, gestione delle credenziali e archiviazione sicura delle chiavi. Un **Credential-Lifecycle-Management** per registrazione, disattivazione, ripristino e gestione di più Passkeys per utente. **Meccanismi di fallback** per utenti senza dispositivo compatibile con i Passkeys o in caso di autenticazione non riuscita. **Verifiche di compliance** per settori regolamentati, inclusa la validazione AAGUID contro il database FIDO Metadata Service (MDS) e la verifica della certificazione FIPS.

Mobile ID risolve questa complessità: le Relying Party non integrano l'infrastruttura Passkey in proprio, bensì il servizio OIDC di Mobile ID. La registrazione e la gestione dei Passkeys avviene centralmente su mobileid.ch. Un Passkey viene registrato una sola volta e può successivamente essere utilizzato presso tutte le Relying Party collegate.

Per le aziende ciò significa un'integrazione OIDC standard con valori ACR configurabili, fallback automatico su SIM, App o SMS e la sicurezza di un partner come Swisscom, che impiega queste soluzioni internamente per proteggere infrastrutture altamente critiche.

## Profilo di sicurezza in base al contesto d'uso

Tutti i metodi Mobile ID offrono un'autenticazione forte. La scelta ottimale dipende dallo scenario di impiego. La distinzione centrale: si tratta di uno scenario browser aperto con URL liberamente selezionabile o di un percorso chiuso?

### Percorsi browser: URL aperti e rischio di phishing

Nel browser l'utente naviga liberamente. Può cliccare su link nelle e-mail, digitare URL manualmente o raggiungere pagine tramite motori di ricerca. Qui risiede il maggiore rischio di phishing: gli attaccanti possono falsificare domini e riprodurre pagine di login in modo ingannevolmente realistico.

I Passkeys offrono in questo scenario un vantaggio sistemico. Grazie all'Origin-Binding crittografico, la chiave è saldamente legata al dominio autentico. Il browser verifica automaticamente che il dominio richiedente corrisponda a quello registrato. Una pagina di phishing su `m0bileid.ch` non ottiene accesso al Passkey registrato per `mobileid.ch`. Questo rende i Passkeys la prima scelta per i login puramente web.

Importante: anche i Passkeys non sono esenti da vettori di attacco. Malware sulla piattaforma, estensioni browser compromesse o social engineering a livello di sistema operativo possono colpire qualsiasi metodo. I Passkeys eliminano specificamente il problema dello URL-Spoofing.

### Percorsi chiusi: VPN, Remote Desktop, Kiosk, App native

Per i login tramite client VPN, ambienti Remote Desktop/VDI, terminali kiosk, passaggi nativi app-to-app o callback dell'helpdesk, entrano in gioco altri meccanismi di protezione. In questi scenari non esiste un URL liberamente selezionabile. La connessione è controllata dal client o dall'infrastruttura. Lo URL-Spoofing non è un vettore di attacco.

Mobile ID SIM e App offrono qui una sicurezza robusta grazie a binding hardware (EAL5+), Geofencing, Number Matching e Transaction Signing. In molti di questi scenari i Passkeys non sono nemmeno utilizzabili: WebAuthn è una tecnologia browser, e i client VPN o le sessioni Remote Desktop (nessun canale BLE verso l'authenticator!) spesso non li supportano.

### SIM e App utilizzabili anche nel browser

SIM e App possono essere impiegati anche per i login nel browser. Non tutti i casi d'uso richiedono la massima resistenza al phishing nel browser. Per molte applicazioni, la consolidata autenticazione push-based tramite SIM o App rappresenta una soluzione pragmatica e sicura. Mobile ID copre tutti gli scenari con OIDC e REST API.

<div class="blog-infographic">
  <img src="/release-notes/media/infografik-methoden-szenarien.webp" alt="Panoramica dei metodi di autenticazione: Passkeys, SIM e App nel confronto tra scenari" />
</div>

<SzenarienMatrix />

## Perché SIM e App restano indispensabili

I Passkeys sono un valido complemento per gli scenari browser. SIM e App esprimono i loro punti di forza unici laddove WebAuthn raggiunge i propri limiti.

### Mobile ID SIM

Il metodo basato su SIM utilizza la SIM card compatibile con Mobile ID (o eSIM) come token hardware sicuro. Oltre 6 milioni di SIM card svizzere presso Swisscom, Sunrise, UPC e Salt sono compatibili con Mobile ID. Le chiavi crittografiche vengono memorizzate direttamente sulla SIM, certificata secondo il profilo di protezione **EAL5+** (ISO/IEC 15408) e il livello di valutazione E3 (ITSEC).

Il metodo SIM non richiede alcuna installazione di app né dipendenza dall'App Store. L'autenticazione viene mostrata come overlay SIM Toolkit direttamente sopra l'applicazione in uso. Funziona su qualsiasi dispositivo mobile, anche su dispositivi privi di sistema operativo smartphone, e tramite il canale GSM. Attraverso SMS-over-IP e WiFi, il metodo SIM è utilizzabile anche in assenza di copertura di rete mobile.

In caso di cambio dispositivo, l'utente semplicemente sposta la SIM. L'account resta attivo senza necessità di una nuova registrazione. La verifica della posizione basata su SIM è particolarmente affidabile, poiché la localizzazione nella rete mobile è difficile da manipolare.

### Mobile ID App

L'app Mobile ID (iOS e Android) offre, oltre all'autenticazione biometrica, un ampio spettro di funzionalità aggiuntive non realizzabili con i Passkeys:

**Autenticazione push-based** con biometria o passcode come secondo fattore. **Geofencing** con localizzazione GPS e rilevamento integrato di jailbreak e servizi mock, che ostacola lo spoofing GPS. **Number Matching**, in cui l'utente conferma nell'app un numero visualizzato sullo schermo. **Transaction Signing**, che mostra i dati della transazione (ad es. "Conferma il trasferimento di CHF 1'000 sul conto XY") direttamente sul dispositivo e richiede il consenso esplicito dell'utente. Il passaggio app-to-app consente negli scenari bancari la commutazione automatizzata dall'applicazione in uso all'app Mobile ID e ritorno.

L'app si basa sulla tecnologia di Futurae (spin-off dell'ETH di Zurigo) e utilizza il Trusted Execution Environment (TEE) del dispositivo. È disponibile in tutto il mondo nei paesi abilitati tramite l'App Store.

## Passkeys-Plus: l'Hybrid Auth Flow per un livello prossimo ad AAL3

NIST AAL3 è uno standard di sicurezza estremamente elevato. Un autentico AAL3 richiede tra l'altro un modulo hardware validato FIPS 140-2, il che dipende dalla configurazione concreta del dispositivo. Per i sistemi altamente critici, Swisscom utilizza già internamente il modello **Passkeys-Plus**, che mira a un livello di sicurezza molto elevato.

L'approccio combina due componenti già esistenti in un Hybrid Auth Flow:

**Fase 1: Cloud-Sync Passkey (AAL2).** L'utente si autentica nel browser con un Passkey. Questo offre un ampio supporto dell'ecosistema e Origin-Binding resistente al phishing.

**Fase 2: Mobile ID Push Step-Up.** Successivamente l'utente riceve un push sul proprio smartphone. Mobile ID Push utilizza crittografia a chiave pubblica con chiavi non esportabili e legate al dispositivo. L'utente conferma con biometria o passcode. Opzionalmente si aggiungono il geoblocking e la visualizzazione del consenso utente.

La combinazione fornisce: login con Origin-Binding, chiave legata al dispositivo e non esportabile, consenso esplicito dell'utente e geolocalizzazione. Può raggiungere AAL3 nei deployment in cui il secondo fattore gira su hardware idoneo certificato FIPS 140-2. Il riconoscimento regolatorio come AAL3 completo va tuttavia sempre valutato per singolo caso d'uso, base hardware e contesto di compliance. Una copertura più ampia di crittografia validata FIPS e di Device Attestation nel passaggio Mobile ID Push sarà pienamente disponibile solo dopo futuri ampliamenti.

Il passaggio push resta sullo smartphone. Sul desktop l'utente si autentica localmente con il Passkey, e lo step-up avviene out-of-band tramite il telefono.

<HybridAuthComparisonTable lang="it" />

<div class="blog-infographic">
  <img src="/release-notes/media/infografik-hybrid-auth.webp" alt="Autenticazione ibrida per NIST AAL3: Cloud-Sync Passkey combinato con Mobile ID Push Step-Up" />
</div>

<HybridAuthFlow />

## Mobile ID Authentication Levels: controllo granulare tramite valori ACR

Oltre al quadro di riferimento NIST AAL descritto sopra, Mobile ID definisce propri Authentication Levels (AL2–AL4) come valori ACR nell'OIDC Authorization Request. Questi livelli determinano quali metodi di autenticazione sono consentiti per un dato login e non vanno confusi con NIST AAL1–AAL3. La matrice ACR completa è documentata nella [guida all'integrazione OIDC](/oidc-integration-guide/getting-started#authentication-context-class-reference-acr).

<AcrLevels />

In modalità `mid_al4_passkey` viene forzata un'autenticazione esclusivamente tramite Passkey, che garantisce una reale resistenza al phishing senza fallback deboli. Per la massima flessibilità, `mid_al2_any` ammette tutti i metodi disponibili, incluso SMS. Con `mid_al4_any`, l'autenticazione tramite Passkey è preferita, con fallback su SIM o App.

Mentre la maggior parte dei provider offre i Passkeys come semplice sostituto della password con percorsi di recupero insicuri (Google, PayPal, GitHub e persino le FFS consentono OTP via e-mail come fallback), Mobile ID permette l'applicazione di policy di sicurezza rigorose e la restrizione ad authenticator certificati FIPS tramite validazione AAGUID contro il database FIDO Metadata Service.

## Flussi di registrazione e login

Il rollout tecnico per le Relying Party è estremamente semplice.

### Registrazione centralizzata su mobileid.ch

Gli utenti gestiscono i propri Passkeys tramite il dashboard MyMobileID su mobileid.ch/login. Lì possono aggiungere nuove chiavi, modificare o eliminare quelle esistenti. I Passkeys vengono memorizzati sul dominio m.mobileid.ch e sono successivamente disponibili presso tutte le Relying Party collegate.

Il processo di registrazione:

<ScreenshotStep img="/release-notes/media/mymobileid-dashboard-manage-passkeys-tile.png" alt="Dashboard MyMobileID: riquadro Mobile ID Passkey con pulsante MANAGE PASSKEYS">
<p><strong>1.</strong> Login su mobileid.ch (verifica tramite SMS-OTP per la conferma del numero di cellulare).</p>
<p><strong>2.</strong> Nel dashboard selezionare il riquadro "Mobile ID Passkey" e cliccare "MANAGE PASSKEYS".</p>
<p><strong>3.</strong> Selezionare "Add a passkey". Compare il dialogo nativo del browser (Touch ID, Face ID o chiave di sicurezza).</p>
<p><strong>4.</strong> Conferma biometrica o inserimento del PIN sull'authenticator.</p>
</ScreenshotStep>

<ScreenshotStep img="/release-notes/media/add-a-passkey.png" alt="Aggiunta di un Passkey: dialogo nativo iOS per il salvataggio di un Passkey su m-lab.mobileid.ch">
<p><strong>5.</strong> Il Passkey è registrato e riceve un KeyRingID univoco.</p>
<p>Il KeyRingID (ad es. <code>MIDPK5VQ8JV1TGL</code>) è l'identificatore stabile di una registrazione Passkey. Per scenari ad alta assurance (AL4), la Relying Party deve trasmettere questo KeyRingID nel <code>login_hint</code>, affinché Mobile ID possa verificare il corretto binding del Passkey.</p>
</ScreenshotStep>

<ScreenshotStep img="/release-notes/media/passkey-management-list-passkeys.png" alt="Gestione Passkeys: elenco dei Passkeys registrati con badge di tipo e KeyRingID">
<p>Nella gestione dei Passkeys l'utente visualizza tutti i Passkeys registrati con indicazione del tipo: le chiavi Device-Bound mostrano un badge a stella, le chiavi Cloud-Synced mostrano i badge "Synced" e "StepUp". Ogni voce riporta il KeyRingID, la data di creazione e l'ultimo utilizzo.</p>
</ScreenshotStep>

<div class="blog-infographic">
  <img src="/release-notes/media/infografik-flows.webp" alt="Flussi di registrazione e login Passkey: gestione centralizzata e login basato su OIDC" />
</div>

<PasskeyRegistrationFlow />

### Login della RP via OIDC

Quando un utente clicca "Sign in with Mobile ID" presso una Relying Party, si avvia un OIDC Authorization Code Flow:

<ScreenshotStep img="/release-notes/media/sign-in-with-passkey.png" alt="Login con Passkey: dialogo nativo iOS per l'autenticazione tramite Passkey su mobileid.ch">
<p><strong>1.</strong> La RP reindirizza l'utente verso Mobile ID, con il valore ACR desiderato nell'Authorization Request.</p>
<p><strong>2.</strong> Mobile ID mostra la pagina di autenticazione Passkey ("Passkey o chiave di sicurezza FIDO2").</p>
<p><strong>3.</strong> Compare il dialogo nativo del browser: "Sign in to mobileid.ch with your passkey".</p>
<p><strong>4.</strong> L'utente conferma tramite biometria o chiave di sicurezza.</p>
<p><strong>5.</strong> Mobile ID valida l'assertion e reindirizza con l'Authorization Code alla RP.</p>
<p><strong>6.</strong> La RP scambia il codice con ID Token e Access Token.</p>
</ScreenshotStep>

A seconda del valore ACR configurato, viene attivato il flusso appropriato. Con `mid_al4_passkey` viene accettato esclusivamente un Passkey. Con `mid_al2_any` l'utente può scegliere tra Passkey, SIM, App o SMS. In caso di errori o Passkeys mancanti, la RP può consentire un fallback sicuro su altri metodi.

Quando i Passkeys sono attivati per un client (`passkeys_enabled = true`), l'ordine di priorità è: Passkey, SIM, App, SMS.

<PasskeyLoginFlow />

## Roadmap: il Mobile ID Passkey Vault

Mobile ID persegue con il Passkey Vault la visione di un'infrastruttura Passkey sovrana. L'app Mobile ID diventerà essa stessa un 3rd-Party Passkey Provider su iOS e Android. Swisscom adotta un approccio make-not-buy e sviluppa l'authenticator internamente.

### Fase 1: Mobile MVP

Device-Bound Passkeys su iOS e Android, gestiti dall'app Mobile ID. Combinazione con Mobile ID Push per l'Hybrid Auth Flow. Utilizzo della Credential Manager API (Android) e di AuthenticationServices (iOS).

### Fase 2: estensione desktop

Supporto per macOS, iPadOS e Windows. Autenticazione cross-device tramite BLE/NFC, affinché il Passkey sullo smartphone possa essere utilizzato anche per i login desktop.

### Fase 3: Swiss Cloud-Synced Passkeys

Servizio di sincronizzazione con crittografia end-to-end e archiviazione dei dati in data center svizzeri. In questo modo si elimina il rischio legato al CLOUD Act delle cloud dei big tech statunitensi, con lo stesso livello di comodità di Apple iCloud Keychain o Google Password Manager.

### Fase 4: Attestation e FIDO MDS

Registrazione dell'app Mobile ID nel FIDO Metadata Service con un proprio AAGUID. In questo modo le Relying Party possono riconoscere l'app Mobile ID come authenticator affidabile e classificarne automaticamente il livello di sicurezza.

L'app diventerà un unico strumento di autenticazione completo: autenticazione SIM, MFA push-based, Passkey Provider e Transaction Signing in un'unica applicazione.

<PasskeyVaultRoadmap />

## Conclusione: tutto da un unico fornitore

Con l'introduzione dei Passkeys, Mobile ID consolida la propria posizione come ecosistema unico che riunisce tutti i metodi di autenticazione rilevanti sotto un unico tetto. Passkeys per login browser resistenti al phishing. SIM per la massima sicurezza hardware senza installazione di app. App per Geofencing, Transaction Signing e utilizzo mondiale. E con l'Hybrid Auth Flow una soluzione che raggiunge un livello prossimo ad AAL3, senza che ogni utente debba possedere un token hardware.

Le aziende beneficiano di un'integrazione OIDC standard, archiviazione dei dati in Svizzera e la sicurezza di un partner che impiega queste soluzioni internamente per proteggere infrastrutture altamente critiche.

**Il cliente decide quale metodo si adatta meglio al proprio caso d'uso. Mobile ID offre la flessibilità necessaria.**

*Mobile ID: il metodo giusto per ogni scenario. Tutto da un unico ecosistema.*
