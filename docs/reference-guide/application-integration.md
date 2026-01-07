# Application Provider Client Integration

This chapter describes how an **Application Provider (AP)** integrates its backend with the **Swisscom Mobile ID signature service**.
It covers the necessary preconditions, endpoint configuration, and use of **mutual TLS authentication**.

---

## Preconditions

Before using the Swisscom Mobile ID Web Service, the following setup steps are required:

1. The Mobile ID customer (your organization) has a valid agreement with Swisscom.
   Under this agreement:

   - **Connectivity** between your AP and the Mobile ID platform is established
     (either over the Internet or via Swisscom LAN‑I service).
   - The AP’s **public source IP address or range** must be **whitelisted** in the Swisscom firewall.
   - The customer must deliver an **X.509 client certificate** to Swisscom.
     *(Creation is described in [Chapter 8](chapter8-create-x509-client-certificates.md).)*

2. Swisscom provides the customer with:
   - an **AP_ID (Application Provider Identifier)**, and
   - a **DTBD Prefix** value.

The **DTBD Prefix** is an AP‑specific keyword that must appear as a **prefix** in every Mobile ID message shown to the end‑user.
It identifies the requesting application on the handset display.

---

## Endpoint Address

The Mobile ID Web Service is accessible via both **SOAP** and **REST** interfaces.
Use whichever best matches your platform integration strategy.

### **SOAP Endpoint**

A dedicated HTTPS endpoint implementing ETSI TS 102 204 for Mobile ID Signatures.

```text
https://mobileid.swisscom.com/soap/services/MSS_Signature
