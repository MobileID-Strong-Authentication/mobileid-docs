# Vergleichsbericht: HTML-Referenz vs. Markdown-Dokumentation

## Zusammenfassung
✅ **Hauptstruktur vorhanden**: Alle 9 Hauptkapitel (H1) aus dem HTML sind in Markdown-Dateien vorhanden  
⚠️ **Kleinere Unterschiede**: Einige Unterkapitel haben abweichende Titel oder zusätzliche Abschnitte  
❌ **Tippfehler gefunden**: "Additinal" statt "Additional", "Moblie" statt "Mobile"

---

## Detaillierter Vergleich

### ✅ introduction.md
**HTML-Referenz:**
- Introduction
  - Terms and Abbreviations
  - Mobile ID Signature Service (MSS)
    - Mobile ID (e-)SIM
    - Mobile ID App
    - Authentication Flow

**Markdown:**
- ✅ Introduction
- ✅ Terms and Abbreviations
- ✅ Mobile ID Signature Service (MSS)
  - ✅ Mobile ID SIM - Method (entspricht "Mobile ID (e-)SIM")
  - ✅ Mobile ID App - Method (entspricht "Mobile ID App")
  - ✅ Authentication Flow

**Bewertung:** ✅ Vollständig (nur minimale Titelabweichungen)

---

### ✅ app-provider-client-integration.md
**HTML-Referenz:**
- Application Provider Client Integration
  - Preconditions
  - Endpoint Address
    - SOAP Endpoint
    - REST Endpoint
  - Mutual Authentication

**Markdown:**
- ✅ Application Provider Client Integration
- ✅ Preconditions
- ✅ Endpoint Address
  - ⚠️ Overview Access (zusätzlich, nicht im HTML)
  - ✅ SOAP Endpoint
  - ✅ REST Endpoint
- ✅ Mutual Authentication
  - ⚠️ Important Guidelines for Certificate-Based Mutual Authentication (zusätzlich)

**Bewertung:** ✅ Vollständig + zusätzliche Abschnitte

---

### ⚠️ mobile-id-api.md
**HTML-Referenz:**
- Mobile ID API
  - HTTP/1.1 Header
    - HTTP Request
    - HTTP Response
  - MSS Signature
    - Signature Profiles
    - Synchronous MSS Signature
    - Asynchronous MSS Signature
    - Additional Services (AS)
    - Message Formats on the Mobile ID App
  - MSS Status Query
    - MSS Status Query Request
    - MSS Status Query Response
  - MSS Receipt
    - Synchronous MSS Receipt
    - Encrypted MSS Receipts
  - MSS Profile Query
    - MSS Profile Query Request
    - MSS Profile Query Response

**Markdown:**
- ✅ Mobile ID API
- ✅ HTTP/1.1 Header
  - ✅ HTTP Request
  - ✅ HTTP Response
- ✅ MSS Signature
  - ⚠️ Endpoint (zusätzlich)
  - ✅ Signature Profiles
  - ⚠️ Signature Profile Values (zusätzlich)
  - ⚠️ User Scenario Examples (Signature Profile Handling) (zusätzlich)
  - ⚠️ Signature Messaging Mode (zusätzlich)
  - ✅ Synchronous MSS Signature
  - ✅ Asynchronous MSS Signature
  - ❌ **"Additinal Services (AS)"** - TIPPFEHLER: sollte "Additional" sein
  - ❌ **"Message Formats on the Moblie ID App"** - TIPPFEHLER: sollte "Mobile" sein
- ✅ MSS Status Query
  - ⚠️ Endpoint (zusätzlich)
  - ✅ MSS Status Query Request
  - ✅ MSS Status Query Response
- ✅ MSS Receipt
  - ⚠️ Endpoint (zusätzlich)
  - ✅ Synchronous MSS Receipt
  - ✅ Encrypted MSS Receipts
- ✅ MSS Profile Query
  - ⚠️ Endpoint (zusätzlich)
  - ❌ **Fehlt:** MSS Profile Query Request
  - ❌ **Fehlt:** MSS Profile Query Response

**Bewertung:** ⚠️ Größtenteils vollständig, aber **2 Unterkapitel fehlen** + **2 Tippfehler**

---

### ✅ best-practices.md
**HTML-Referenz:**
- Best Practices
  - MSS Signature
    - Signature Request
    - Signature Response
    - Signature Concurrency Control
  - Mobile ID Serial Number Validation
  - Timeout Value
  - Mobile ID FAQ
  - Mobile ID Service Health Check
  - Mobile ID Client Examples

**Markdown:**
- ✅ Best Practices
- ✅ MSS Signature
  - ✅ Signature Request
  - ✅ Signature Response
  - ✅ Signature Concurrency Control
- ✅ Mobile ID Serial Number Validation
- ✅ Timeout Value
- ✅ Mobile ID FAQ
- ✅ Mobile ID Service Health Check
  - ⚠️ SOAP/XML (zusätzlich)
  - ⚠️ REST/JSON (zusätzlich)
- ✅ Mobile ID Client Examples

**Bewertung:** ✅ Vollständig + zusätzliche Abschnitte

---

### ✅ auto-activation.md
**HTML-Referenz:**
- Auto Activation
  - Introduction
  - How to implement this feature
  - User Perspective

**Markdown:**
- ✅ Auto Activation
- ✅ Introduction
- ✅ How to implement this feature
- ✅ User Perspective

**Bewertung:** ✅ Vollständig

---

### ⚠️ status-fault-codes.md
**HTML-Referenz:**
- Status and Fault Codes
  - Overview
  - Testing Status and Fault Codes
    - Test-MSISDN Overview

**Markdown:**
- ✅ Status and Fault Codes
- ✅ Overview
- ✅ Testing Status and Fault Codes
- ✅ Test-MSISDN Overview (als H2 statt H3)

**Bewertung:** ✅ Vollständig (nur leichte Hierarchie-Abweichung)

---

### ✅ root-ca-certs.md
**HTML-Referenz:**
- Root CA Certificates (Trust Anchor)
  - Mobile ID X509 Server Certificate
  - Mobile ID User X509 Certificate

**Markdown:**
- ✅ Root CA Certificates (Trust Anchor)
- ✅ Mobile ID X509 Server Certificate
- ✅ Mobile ID User X509 Certificate

**Bewertung:** ✅ Vollständig

---

### ✅ create-client-certs.md
**HTML-Referenz:**
- Create X509 Client Certificates
  - OpenSSL
    - Generate Key & Create CSR
    - Self-Sign Certificate
    - Convert To PKCS#12
  - Java KeyTool
    - Generate Key & Export Certificate

**Markdown:**
- ✅ Create X509 Client Certificates
- ✅ OpenSSL
  - ✅ Generate Key & Create CSR
  - ✅ Self-Sign Certificate
  - ✅ Convert To PKCS#12
- ✅ Java KeyTool
  - ✅ Generate Key & Export Certificate

**Bewertung:** ✅ Vollständig

---

### ⚠️ health-status.md
**HTML-Referenz:**
- Health Status Microservice

**Markdown:**
- ✅ Health Status Microservice
- ⚠️ Active Probing (zusätzlich)
- ⚠️ Real End-To-End Testing (zusätzlich)
- ⚠️ MobileID Telecommunications Providers (zusätzlich)
- ⚠️ MobileID App (zusätzlich)
- ⚠️ Health Status Levels (zusätzlich)

**Bewertung:** ✅ Vorhanden (Markdown hat viel mehr Details als HTML)

---

### ℹ️ imprint.md
**HTML-Referenz:**
- ❌ Nicht vorhanden

**Markdown:**
- ✅ Imprint
  - 📇 Company Information
  - 📞 Contact Information

**Bewertung:** ℹ️ Zusätzliche Datei (nicht im HTML-Referenzdokument)

---

## 🔧 Erforderliche Korrekturen

### **1. Tippfehler in mobile-id-api.md**
- Zeile mit "Additinal Services (AS)" → **"Additional Services (AS)"**
- Zeile mit "Message Formats on the Moblie ID App" → **"Message Formats on the Mobile ID App"**

### **2. Fehlende Unterkapitel in mobile-id-api.md**
Im Abschnitt "MSS Profile Query" fehlen:
- **MSS Profile Query Request**
- **MSS Profile Query Response**

---

## Statistik
- ✅ **9/9 Hauptkapitel vollständig vorhanden**
- ⚠️ **2 Unterkapitel fehlen** (MSS Profile Query Request/Response)
- ❌ **2 Tippfehler** (Additinal → Additional, Moblie → Mobile)
- ℹ️ **1 zusätzliche Datei** (imprint.md)
- ⚠️ **Mehrere zusätzliche Unterkapitel** (in mobile-id-api.md, best-practices.md, health-status.md) - diese erweitern die Dokumentation und sind kein Problem

---

## Empfehlung
1. ✅ **Tippfehler korrigieren** in mobile-id-api.md
2. ⚠️ **Fehlende Abschnitte ergänzen**: MSS Profile Query Request/Response
3. ℹ️ **Optional**: imprint.md in die HTML-Referenz aufnehmen oder als separate "administrative" Seite behandeln
