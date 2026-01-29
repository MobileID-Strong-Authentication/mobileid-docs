#!/usr/bin/env python3
"""
Vergleicht die Struktur des HTML-Referenzdokuments mit den Markdown-Dateien
"""

html_structure = [
    ("h1", "Introduction"),
    ("h2", "Terms and Abbreviations"),
    ("h2", "Mobile ID Signature Service (MSS)"),
    ("h3", "Mobile ID (e-)SIM"),
    ("h3", "Mobile ID App"),
    ("h3", "Authentication Flow"),
    ("h1", "Application Provider Client Integration"),
    ("h2", "Preconditions"),
    ("h2", "Endpoint Address"),
    ("h3", "SOAP Endpoint"),
    ("h3", "REST Endpoint"),
    ("h2", "Mutual Authentication"),
    ("h1", "Mobile ID API"),
    ("h2", "HTTP/1.1 Header"),
    ("h3", "HTTP Request"),
    ("h3", "HTTP Response"),
    ("h2", "MSS Signature"),
    ("h3", "Signature Profiles"),
    ("h3", "Synchronous MSS Signature"),
    ("h3", "Asynchronous MSS Signature"),
    ("h3", "Additional Services (AS)"),
    ("h3", "Message Formats on the Mobile ID App"),
    ("h2", "MSS Status Query"),
    ("h3", "MSS Status Query Request"),
    ("h3", "MSS Status Query Response"),
    ("h2", "MSS Receipt"),
    ("h3", "Synchronous MSS Receipt"),
    ("h3", "Encrypted MSS Receipts"),
    ("h2", "MSS Profile Query"),
    ("h3", "MSS Profile Query Request"),
    ("h3", "MSS Profile Query Response"),
    ("h1", "Best Practices"),
    ("h2", "MSS Signature"),
    ("h3", "Signature Request"),
    ("h3", "Signature Response"),
    ("h3", "Signature Concurrency Control"),
    ("h2", "Mobile ID Serial Number Validation"),
    ("h2", "Timeout Value"),
    ("h2", "Mobile ID FAQ"),
    ("h2", "Mobile ID Service Health Check"),
    ("h2", "Mobile ID Client Examples"),
    ("h1", "Auto Activation"),
    ("h2", "Introduction"),
    ("h2", "How to implement this feature"),
    ("h2", "User Perspective"),
    ("h1", "Status and Fault Codes"),
    ("h2", "Overview"),
    ("h2", "Testing Status and Fault Codes"),
    ("h3", "Test-MSISDN Overview"),
    ("h1", "Root CA Certificates (Trust Anchor)"),
    ("h2", "Mobile ID X509 Server Certificate"),
    ("h2", "Mobile ID User X509 Certificate"),
    ("h1", "Create X509 Client Certificates"),
    ("h2", "OpenSSL"),
    ("h3", "Generate Key & Create CSR"),
    ("h3", "Self-Sign Certificate"),
    ("h3", "Convert To PKCS#12"),
    ("h2", "Java KeyTool"),
    ("h3", "Generate Key & Export Certificate"),
    ("h1", "Health Status Microservice"),
]

# Markdown-Dateien Mapping
markdown_files = {
    "introduction.md": ["Introduction", "Terms and Abbreviations", "Mobile ID Signature Service (MSS)"],
    "app-provider-client-integration.md": ["Application Provider Client Integration", "Preconditions", "Endpoint Address", "Mutual Authentication"],
    "mobile-id-api.md": ["Mobile ID API", "HTTP/1.1 Header", "MSS Signature", "MSS Status Query", "MSS Receipt", "MSS Profile Query"],
    "best-practices.md": ["Best Practices", "MSS Signature", "Mobile ID Serial Number Validation", "Timeout Value", "Mobile ID FAQ", "Mobile ID Service Health Check", "Mobile ID Client Examples"],
    "auto-activation.md": ["Auto Activation", "Introduction", "How to implement this feature", "User Perspective"],
    "status-fault-codes.md": ["Status and Fault Codes", "Overview", "Testing Status and Fault Codes"],
    "root-ca-certs.md": ["Root CA Certificates (Trust Anchor)", "Mobile ID X509 Server Certificate", "Mobile ID User X509 Certificate"],
    "create-client-certs.md": ["Create X509 Client Certificates", "OpenSSL", "Java KeyTool"],
    "health-status.md": ["Health Status Microservice"],
    "imprint.md": ["Imprint (?)"]  # Nicht im HTML gefunden
}

print("## Strukturvergleich HTML vs. Markdown\n")
print("### HTML-Struktur (Referenz):")
current_h1 = None
for tag, heading in html_structure:
    if tag == "h1":
        current_h1 = heading
        print(f"\n**{heading}**")
    elif tag == "h2":
        print(f"  - {heading}")
    elif tag == "h3":
        print(f"    - {heading}")

print("\n\n### Mapping zu Markdown-Dateien:")
for md_file, sections in markdown_files.items():
    print(f"\n**{md_file}:**")
    for section in sections:
        found = False
        for tag, heading in html_structure:
            if heading == section:
                found = True
                break
        status = "✅" if found else "❌"
        print(f"  {status} {section}")
