# Introduction

The purpose of this document is to provide technical documentation and guidelines on how to use the **Swisscom Mobile ID Authentication API**.

The Swisscom Mobile ID authentication solution protects access to your company data and applications with a comprehensive end‑to‑end solution for **two‑factor authentication (2FA)**.
Mobile ID can be used in multiple processes — from simple two‑factor login to **password‑free authentication**, **online signatures**, and **geofencing**.
It is suitable for various system landscapes and meets strict regulatory requirements.

➡️ For more information, visit [https://mobileid.ch](https://mobileid.ch).

---

## Terms and Abbreviations

| Term | Description |
|------|--------------|
| **AP** | Application Provider |
| **AP_ID** | Application Provider Identifier |
| **DTBD** | *Data‑To‑Be‑Displayed* — message displayed on the mobile phone (authentication context). |
| **DTBS** | *Data‑To‑Be‑Signed* — equal to DTBD; the data that will be signed with the Mobile ID signing key. |
| **JSON** | JavaScript Object Notation — text‑based open standard data interchange format. |
| **LAN‑I** | Swisscom LAN‑Interconnect Service (Enterprise WAN). |
| **MID** | Mobile ID platform providing the mobile signature service. |
| **MNO** | Mobile Network Operator — also called wireless service provider or carrier. |
| **MSISDN** | Number uniquely identifying a mobile subscription in a GSM/UMTS network. |
| **MSSP** | Mobile Signature Service Provider — Swisscom Mobile ID backend application. |
| **OTA** | Over‑The‑Air management technology for SIM communication. |
| **RESTful** | Style of software architecture for distributed systems relying on HTTP. |
| **SOAP** | Simple Object Access Protocol — XML‑based exchange protocol. |
| **WSDL** | Web Services Description Language — XML‑based web‑service contract description. |
| **X509** | Public‑Key Infrastructure and digital certificates standard. |
| **XML** | Extensible Markup Language — structured, human‑ and machine‑readable document format. |

---

## Mobile ID Signature Service (MSS)

**Mobile ID** is a cost‑efficient, managed authentication service operated by **Swisscom**.
The customer‑facing API follows the open standard **ETSI 102 204 V1.1.4 (2003‑08)**.

Authentication in Mobile ID is based on a secure hardware token which can be either:

- a **Mobile ID‑compliant SIM or eSIM**, or
- a **Mobile ID App** running on a smartphone.

A single user account may have both methods enabled.
The **Application Provider (AP)** can select and allow one or both methods for authentication.

---

### **Mobile ID (e‑)SIM Method**

The **SIM method** uses the **SIM Toolkit (STK)** application residing on the SIM card (or eSIM profile).



The STK app communicates securely with the Mobile ID server by **encrypted SMS PDUs**, invisible to the user.

#### **Key Advantages**

- **Strong Two‑Factor Authentication**
  - 1️⃣ *Possession Factor*: Physical SIM/eSIM
  - 2️⃣ *Knowledge Factor*: Personal Mobile ID PIN

- **High Level of Security**
  - Tamper‑proof secure hardware (EAL5+ and ITSEC E3 certified)
  - Authentication via a separate encrypted channel

- **Pre‑installed** STK App on the SIM/eSIM profile

- Supported by most **Swiss Mobile Network Operators**
  *(Swisscom, Sunrise, Salt, UPC)*

---

### **Mobile ID App Method**

The **App method** allows authentication using the **Mobile ID App** installed on an Android or iOS device.



#### **Activation Options**

1. **In‑App Enrolment**
   The user activates Mobile ID directly within the app.

2. **Self‑Care Portal Activation**
   Activation via [https://www.mobileid.ch](https://www.mobileid.ch),
   where the app scans a QR code displayed on the site.

The App can display plain UTF‑8 text for user confirmation — the so‑called
**DTBD (Classic View)**.

---

### **High‑Level Authentication Flow**



1. The Application Provider (AP) initiates an authentication or signature request.
2. The Mobile ID platform sends an authentication challenge to the user’s device (SIM or App).
3. The user verifies the **DTBD message** displayed and confirms using their **Mobile ID PIN** or biometrics.
4. The device returns the signed response with the user’s **X.509 certificate**.
5. The AP backend validates both signature and certificate chain via the **Swisscom Mobile ID API**.

---

### **Security Highlights**

- Meets **ETSI and Swiss regulatory requirements**.
- End‑to‑end encryption between AP, MSSP, and user device.
- Compatible with both **(e)SIM** and **App** deployment methods.
- Compliant with **two‑factor authentication frameworks** and online signature standards.
