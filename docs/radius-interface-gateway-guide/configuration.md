# Configuration

This page describes how to configure the RIG application for your environment. RIG supports two configuration sources:

| Source | Storage | Best for |
|--------|---------|----------|
| **KeyValueStorage** (Redis) | Customer configs and I18N messages stored as JSON in Redis | Production / multi-node clusters |
| **AppSettings** (Environment Variables) | All configuration provided via environment variables | Single-node deployments without Redis |

The configuration source is controlled by these environment variables:

```bash
# Set to 'KeyValueStorage' (Redis) or 'AppSettings' (Environment Variables)
RadiusServer__CustomerConfigSource=KeyValueStorage
RadiusServer__I18nMessagesSource=KeyValueStorage
```

## Customer Configuration (Redis)

When using Redis, add the customer configuration as a JSON string to your Redis database:

- **Key:** `CUSTOMER_CONFIG_<unique-identifier>` (e.g., `CUSTOMER_CONFIG_mid://ap.mycompany.ch`)
- **Value:** JSON string (see example below)

You may configure one or multiple customers. Each customer should have its own Mobile ID account (`ApId`) for separate usage and billing reporting.

### Request Mapping

An incoming RADIUS `Access-Request` packet is mapped to the correct customer configuration as follows:

1. RIG first tries to match the packet's **source IP address** against any `SourceIps` entries in the customer configurations.
2. If no source IP matches, RIG tries to match the inbound `NAS-Identifier` attribute against the `NasIdentifier` entries.

Ensure each customer configuration has either unique `SourceIps` entries or a unique `NasIdentifier` entry.

### Customer Configuration Example

```json
{
  "Customer": "My Company XYZ",
  "ApId": "mid://ap.mycompany.ch",
  "NasIdentifier": "ch_mycompany",
  "SourceIps": [
    "10.1.1.22/32"
  ],
  "RadiusSharedSecret": "MyVeryStrongSharedSecret",
  "AccountingWebhook": {
    "Url": "https://my-webhook.example.com/accounting",
    "HttpMethod": "POST"
  },
  "UseLdap": true,
  "Ldap": {
    "Hosts": {
      "Primary": "10.0.0.5",
      "Secondary": "",
      "Tertiary": ""
    },
    "Port": 389,
    "ConnectionTimeoutSeconds": 20,
    "EnableSsl": false,
    "AdminUser": "cn=admin,dc=mycompany,dc=ch",
    "AdminPassword": "MyAdminPassword",
    "UseClientCredentialsForConnection": false,
    "FollowReferrals": false,
    "DefaultSearchScope": "LDAP_SCOPE_SUBTREE",
    "CheckUserAccountControl": false,
    "UserSearchBase": "ou=users,dc=mycompany,dc=ch",
    "UserSearchFilter": "(&(objectclass=person)(|(sAMAccountName={username})(userPrincipalName={username})))",
    "UserGroupSearchFilter": "(&(objectClass=groupOfNames)(member={userdn}))",
    "ValidateUserPassword": true,
    "MobileNrAttribute": "mobile",
    "LanguageAttribute": "preferredLanguage",
    "SerialNrAttribute": "msNPCallingStationID",
    "MfaMethod": {
      "MappingType": "Attribute",
      "AttributeName": "mfa_type",
      "Mappings": {
        "Sim": "LDAP_SIM_VALUE",
        "App": "LDAP_APP_VALUE",
        "Otp": "LDAP_OTP_VALUE",
        "None": "LDAP_NONE_VALUE"
      }
    },
    "ClassMatching": {
      "ClassMappings": [
        {
          "GroupDn": "cn=readers,ou=users,dc=example,dc=org",
          "ClassName": "Group Policy A"
        },
        {
          "GroupDn": "cn=admins,ou=users,dc=example,dc=org",
          "ClassName": "Group Policy B"
        }
      ]
    }
  },
  "Geofencing": {
    "Activate": true,
    "Whitelist": ["CH", "DE"],
    "MinimalDeviceConfidence": 0.7,
    "MinimalLocationConfidence": 0.7
  },
  "DefaultLanguage": "en",
  "ValidateSerialNr": false,
  "UseUserLanguage": false,
  "UseUserMfaMethod": true,
  "MfaMethods": ["SIM", "APP", "OTP", "NONE"],
  "Otp": {
    "Length": 5,
    "Mode": "Text",
    "SmsText": {
      "Default": "Ihr MobileID Code ist {0}",
      "De": "Ihr MobileID Code ist {0}",
      "Fr": "Votre MobileID Code est {0}",
      "It": "Il MobileID Code è {0}",
      "En": "Your MobileID Code is {0}"
    },
    "ReplyMessageText": {
      "Default": "Geben Sie den Code ein, den Sie per SMS erhalten haben",
      "De": "Geben Sie den Code ein, den Sie per SMS erhalten haben",
      "Fr": "Saisissez le code que vous avez reçu par SMS",
      "It": "Inserisci il codice che hai ricevuto via SMS",
      "En": "Enter the code you have received by SMS"
    }
  },
  "SimApp": {
    "DisplayText": {
      "Default": "MobileID: Bitte mit Mobile ID authentifizieren",
      "De": "MobileID: Bitte mit Mobile ID authentifizieren",
      "Fr": "MobileID: Veuillez vous authentifier avec votre ID mobile",
      "It": "MobileID: Si prega di autenticarsi con il Mobile ID",
      "En": "MobileID: Please authenticate with Mobile ID"
    }
  },
  "Events": {
    "UnusedMidServiceEvent": {
      "ExecutionDelayMinutes": 3,
      "NotificationIntervalDays": 7,
      "AppSmsText": {
        "Default": "Please visit https://mobileid.ch/activate and activate the MobileID App",
        "De": "Bitte besuchen Sie https://mobileid.ch/activate und aktivieren Sie die MobileID App",
        "Fr": "Veuillez visiter https://mobileid.ch/activate et activer l'application MobileID",
        "It": "Visita https://mobileid.ch/activate e attiva l'app MobileID",
        "En": "Please visit https://mobileid.ch/activate and activate the MobileID App"
      },
      "SimSmsText": {
        "Default": "Please visit https://mobileid.ch/activate and activate your MobileID SIM card",
        "De": "Bitte besuchen Sie https://mobileid.ch/activate und aktivieren Sie Ihre MobileID SIM-Karte",
        "Fr": "Veuillez visiter https://mobileid.ch/activate et activer votre carte SIM MobileID",
        "It": "Visita https://mobileid.ch/activate e attiva la tua SIM MobileID",
        "En": "Please visit https://mobileid.ch/activate and activate your MobileID SIM card"
      }
    },
    "ErrorNotificationEvent": {
      "ExecutionDelayMinutes": 0,
      "HandledErrorCodes": [
        {
          "ErrorCode": "RigSerialNumberMismatch",
          "NotificationIntervalDays": 1,
          "SmsText": {
            "Default": "Your MobileID Token has changed. Please re-register your MobileID.",
            "De": "Ihr MobileID Token hat sich geändert. Bitte registrieren Sie Ihr MobileID erneut.",
            "Fr": "Votre jeton MobileID a changé. Veuillez réenregistrer votre MobileID.",
            "It": "Il tuo token MobileID è cambiato. Registra nuovamente il tuo MobileID.",
            "En": "Your MobileID Token has changed. Please re-register your MobileID."
          }
        }
      ]
    }
  }
}
```

The following sections explain each configuration area in detail.

## General Settings

| Parameter | Type | Description |
|-----------|------|-------------|
| `Customer` | string | Display name for the customer |
| `ApId` | string | Mobile ID Application Provider ID (e.g., `mid://ap.mycompany.ch`) |
| `NasIdentifier` | string | RADIUS NAS identifier for matching incoming requests |
| `SourceIps` | string[] | Allowed source IP addresses/ranges in CIDR notation (e.g., `10.1.1.22/32`) |
| `RadiusSharedSecret` | string | RADIUS shared secret for authenticating RADIUS packets |
| `DefaultLanguage` | string | Default language code: `de`, `fr`, `it`, or `en` |
| `ValidateSerialNr` | boolean | Validate user's Mobile ID serial number against LDAP attribute |
| `UseUserLanguage` | boolean | Load the user's language preference from LDAP |
| `UseUserMfaMethod` | boolean | Load the user's preferred MFA method from LDAP |
| `MfaMethods` | string[] | Ordered list of allowed MFA methods: `SIM`, `APP`, `OTP`, `NONE` |
| `UseLdap` | boolean | Enable LDAP integration for user attribute lookup |

### Accounting Webhook

Forward RADIUS accounting traffic to an external system:

```json
"AccountingWebhook": {
  "Url": "https://my-webhook.example.com/accounting",
  "HttpMethod": "POST"
}
```

## LDAP Configuration

The LDAP section configures how RIG connects to your directory service to retrieve user attributes.

| Parameter | Type | Description |
|-----------|------|-------------|
| `Hosts.Primary` | string | Primary LDAP server hostname or IP address |
| `Hosts.Secondary` | string | Secondary (failover) LDAP server |
| `Hosts.Tertiary` | string | Tertiary (failover) LDAP server |
| `Port` | integer | LDAP port (`389` for LDAP, `636` for LDAPS) |
| `ConnectionTimeoutSeconds` | integer | Connection timeout in seconds |
| `EnableSsl` | boolean | Enable SSL/TLS for LDAP connections |
| `AdminUser` | string | Service account DN for LDAP queries |
| `AdminPassword` | string | Service account password |
| `UseClientCredentialsForConnection` | boolean | Use the RADIUS client's credentials instead of the admin user for LDAP connection |
| `FollowReferrals` | boolean | Follow LDAP referrals |
| `DefaultSearchScope` | string | LDAP search scope (e.g., `LDAP_SCOPE_SUBTREE`) |
| `CheckUserAccountControl` | boolean | Check Active Directory's `userAccountControl` attribute to verify the account is active |
| `UserSearchBase` | string | Base DN for user searches (e.g., `ou=users,dc=mycompany,dc=ch`) |
| `UserSearchFilter` | string | LDAP search filter with placeholders (see below) |
| `UserGroupSearchFilter` | string | LDAP filter for retrieving group memberships |
| `ValidateUserPassword` | boolean | Validate the user's password against LDAP |
| `MobileNrAttribute` | string | LDAP attribute containing the user's phone number (MSISDN) |
| `LanguageAttribute` | string | LDAP attribute for user's preferred language |
| `SerialNrAttribute` | string | LDAP attribute for Mobile ID serial number |

### Search Filter Placeholders

The following placeholders can be used in LDAP search filters:

| Placeholder | Description |
|-------------|-------------|
| `{username}` | The username part from the RADIUS `User-Name` attribute (before `@`) |
| `{domain}` | The domain part from the RADIUS `User-Name` attribute (after `@`) |
| `{userdn}` | The full DN of the user (available after the initial user search) |

**Example search filters:**

```
# Active Directory (sAMAccountName or UPN)
(&(objectclass=person)(|(sAMAccountName={username})(userPrincipalName={username})))

# OpenLDAP (uid)
(&(objectclass=inetOrgPerson)(uid={username}{domain}))

# Group membership search
(&(objectClass=groupOfNames)(member={userdn}))
```

## MFA Method Mapping

The MFA method for each user can be determined in two ways:

### Option 1: LDAP Attribute Mapping

Map an LDAP attribute value to an MFA method:

```json
"MfaMethod": {
  "MappingType": "Attribute",
  "AttributeName": "mfa_type",
  "Mappings": {
    "Sim": "LDAP_SIM_VALUE",
    "App": "LDAP_APP_VALUE",
    "Otp": "LDAP_OTP_VALUE",
    "None": "LDAP_NONE_VALUE"
  }
}
```

Replace the `LDAP_*_VALUE` strings with the actual attribute values used in your LDAP directory.

### Option 2: LDAP Group DN Mapping

Map LDAP group membership to an MFA method:

```json
"MfaMethod": {
  "MappingType": "GroupDn",
  "Mappings": {
    "Sim": "cn=mfa-sim,ou=groups,dc=example,dc=org",
    "App": "cn=mfa-app,ou=groups,dc=example,dc=org",
    "Otp": "cn=mfa-otp,ou=groups,dc=example,dc=org",
    "None": "cn=mfa-none,ou=groups,dc=example,dc=org"
  }
}
```

## RADIUS Class Attribute Mapping

The RADIUS `Class` attribute can be included in `Access-Accept` responses based on LDAP group membership. This is useful for applying policies on the RADIUS client side.

```json
"ClassMatching": {
  "ClassMappings": [
    {
      "GroupDn": "cn=admins,ou=groups,dc=example,dc=org",
      "ClassName": "Admin Policy"
    },
    {
      "GroupDn": "cn=users,ou=groups,dc=example,dc=org",
      "ClassName": "Standard Policy"
    }
  ]
}
```

When a user is a member of a matching LDAP group, the corresponding `ClassName` is included as the `Class` attribute in the RADIUS `Access-Accept` response.

## Geofencing

RIG supports geofencing to restrict authentication based on the user's geographic location. There are two modes: **simple** (country whitelist/blacklist) and **LDAP-based** (geofencing rules managed in the directory).

### Simple Geofencing

Define a whitelist or blacklist of ISO country codes:

::: code-group

```json [Whitelist]
"Geofencing": {
  "Activate": true,
  "Whitelist": ["CH", "DE", "FR", "IT", "AT"],
  "MinimalDeviceConfidence": 0.7,
  "MinimalLocationConfidence": 0.7
}
```

```json [Blacklist]
"Geofencing": {
  "Activate": true,
  "Blacklist": ["US", "CN", "RU"],
  "MinimalDeviceConfidence": 0.7,
  "MinimalLocationConfidence": 0.7
}
```

:::

| Parameter | Type | Description |
|-----------|------|-------------|
| `Activate` | boolean | Enable or disable geofencing |
| `Whitelist` | string[] | ISO country codes that are allowed (mutually exclusive with `Blacklist`) |
| `Blacklist` | string[] | ISO country codes that are blocked (mutually exclusive with `Whitelist`) |
| `MinimalDeviceConfidence` | decimal | Minimum device confidence score (0.0–1.0) |
| `MinimalLocationConfidence` | decimal | Minimum location confidence score (0.0–1.0) |

::: warning
`Whitelist` and `Blacklist` are mutually exclusive — define one or the other, not both.
:::

### LDAP-Based Geofencing

For more granular control, geofencing rules can be managed in the LDAP directory. This allows different whitelist/blacklist rules per user group.

```json
"Ldap": {
  "Geofencing": {
    "Activate": true,
    "GeofencingSearchBase": "dc=mycompany,dc=ch",
    "UserGeoGroupSearchFilter": "(&(objectClass=groupOfNames)(member={userdn})(ou=geo-groups))",
    "CountriesSearchFilter": "(objectClass=country)",
    "MinimalDeviceConfidence": 0.7,
    "MinimalLocationConfidence": 0.7,
    "FailAuthIfGroupMissing": true,
    "BlacklistGroupPrefix": "blacklist-",
    "WhitelistGroupPrefix": "whitelist-"
  }
}
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `GeofencingSearchBase` | string | Base DN for geofencing group searches |
| `UserGeoGroupSearchFilter` | string | LDAP filter to find the user's geofencing group |
| `CountriesSearchFilter` | string | LDAP filter to find country entries within a group |
| `FailAuthIfGroupMissing` | boolean | Reject authentication if the user is not in any geofencing group |
| `BlacklistGroupPrefix` | string | Prefix for blacklist group names (e.g., `blacklist-`) |
| `WhitelistGroupPrefix` | string | Prefix for whitelist group names (e.g., `whitelist-`) |

## Fortinet VSA Support

RIG supports Fortinet Vendor Specific Attributes (VSA) to enrich RADIUS `Access-Accept` responses with Fortinet-specific attributes. This is useful when RIG is used together with FortiGate firewalls.

The FortiGate behaviour is triggered when:
1. The Vendor Specific Attribute `Fortinet-Vdom-Name` is present in the incoming RADIUS `Access-Request` packet
2. The value of `Fortinet-Vdom-Name` matches the configured `VendorSpecificAttributeTriggerValue`

### Configuration Example

Add the `FortigateBehaviour` section inside the `Ldap` configuration:

```json
"Ldap": {
  "UserGroupSearchFilter": "(&(objectClass=groupOfNames)(member={userdn}))",
  "FortigateBehaviour": {
    "VendorSpecificAttributeTriggerValue": "root",
    "FortinetLdapUserGroupMap": [
      {
        "ForitnetGroupName": "gu-rad_msrl_sslvpn1",
        "LdapGroupDn": "cn=Admin,ou=Groups,dc=example,dc=local"
      },
      {
        "ForitnetGroupName": "gu-rad_msrl_sslvpn2",
        "LdapGroupDn": "cn=Viewer,ou=Groups,dc=example,dc=local"
      }
    ],
    "FortinetAccessProfile": "none",
    "DefaultFortinetGroupName": "no-group-found",
    "FailAuthIfGroupUnknown": false
  }
}
```

::: info
The property name `ForitnetGroupName` (note the spelling) is the actual field name used by the application. The LDAP `UserGroupSearchFilter` used for the Fortinet group lookup is defined at the `Ldap` level (not inside `FortigateBehaviour`).
:::

### Behaviour

After authenticating the user, RIG reads out all LDAP user groups and matches them against the `FortinetLdapUserGroupMap` entries. The **first matching group** is used.

**If a matching group is found**, the `Access-Accept` response is enriched with:

| Attribute | Value |
|-----------|-------|
| `Fortinet-Vdom-Name` | Value from the incoming `Access-Request` (e.g., `root`) |
| `Fortinet-Group-Name` | The matching `ForitnetGroupName` value |
| `Fortinet-Access-Profile` | The configured `FortinetAccessProfile` value |

**If no matching group is found:**

- If `FailAuthIfGroupUnknown` is `true`: the authentication is rejected
- If `FailAuthIfGroupUnknown` is `false`: the `Access-Accept` is enriched with the `DefaultFortinetGroupName`

## OTP Configuration

Configure the One-Time Password behaviour for SMS-based authentication:

| Parameter | Type | Description |
|-----------|------|-------------|
| `Length` | integer | Number of digits in the OTP (e.g., `5`) |
| `Mode` | string | OTP mode (`Text`) |
| `SmsText` | object | Multi-language SMS text template. Use `{0}` as placeholder for the OTP value |
| `ReplyMessageText` | object | Multi-language prompt text for the RADIUS `Access-Challenge` response |

## SIM/APP Display Text

Configure the text displayed on the user's mobile device during SIM or APP authentication:

```json
"SimApp": {
  "DisplayText": {
    "Default": "MobileID: Please authenticate with Mobile ID",
    "De": "MobileID: Bitte mit Mobile ID authentifizieren",
    "Fr": "MobileID: Veuillez vous authentifier avec votre ID mobile",
    "It": "MobileID: Si prega di autenticarsi con il Mobile ID",
    "En": "MobileID: Please authenticate with Mobile ID"
  }
}
```

::: tip
The `DisplayText` value is shown to the user on their mobile device. You can prefix it with your company or application name (e.g., `MyCompany VPN: Please authenticate with Mobile ID`).
:::

## SMS Event Notifications

RIG can send SMS notifications to users in specific situations. All event notifications are optional.

### Unused Mobile ID Service Event

After a successful authentication that fell back to OTP (because the user has no active Mobile ID SIM or APP), RIG can send an SMS notification to encourage the user to activate their Mobile ID account.

| Parameter | Type | Description |
|-----------|------|-------------|
| `ExecutionDelayMinutes` | integer | Delay in minutes before sending the notification |
| `NotificationIntervalDays` | integer | Minimum days between notifications to the same user |
| `AppSmsText` | object | Multi-language SMS text when SIM is **not** Mobile ID-compliant (suggest App activation) |
| `SimSmsText` | object | Multi-language SMS text when SIM **is** Mobile ID-compliant (suggest SIM activation) |

### Error Notification Event

Send an SMS notification to the user when a specific error occurs during authentication (e.g., serial number mismatch, geofencing error).

```json
"ErrorNotificationEvent": {
  "ExecutionDelayMinutes": 0,
  "HandledErrorCodes": [
    {
      "ErrorCode": "RigSerialNumberMismatch",
      "NotificationIntervalDays": 1,
      "SmsText": {
        "Default": "Your MobileID Token has changed. Please re-register.",
        "De": "Ihr MobileID Token hat sich geändert. Bitte registrieren Sie sich erneut.",
        "Fr": "Votre jeton MobileID a changé. Veuillez vous réenregistrer.",
        "It": "Il tuo token MobileID è cambiato. Registrati nuovamente.",
        "En": "Your MobileID Token has changed. Please re-register."
      }
    },
    {
      "ErrorCode": "MidGeo_100",
      "NotificationIntervalDays": 1,
      "SmsText": {
        "Default": "Please enable the Geofencing toggle in your MobileID App.",
        "De": "Bitte aktivieren Sie den Geofencing-Schalter in Ihrer MobileID App.",
        "Fr": "Veuillez activer le commutateur de géorepérage dans votre application MobileID.",
        "It": "Abilita l'interruttore di geofencing nella tua app MobileID.",
        "En": "Please enable the Geofencing toggle in your MobileID App."
      }
    }
  ]
}
```

## I18N Error Messages

The I18N error message configuration allows you to customize the `Reply-Message` content in RADIUS `Access-Reject` responses. Messages are defined per error code in four languages (German, French, Italian, English).

### Configuration via Redis

Add the I18N messages as a JSON array to Redis:

- **Key:** `I18N_MESSAGES`
- **Value:** JSON array (see example below)

::: info
The RIG application must be restarted after an I18N configuration change in Redis.
:::

```json
[
  {
    "Key": "DefaultErrorMessage",
    "De": "Authentifizierung fehlgeschlagen",
    "Fr": "Échec de l'authentification",
    "It": "Autenticazione non riuscita",
    "En": "Authentication failed"
  },
  {
    "Key": "Mid_105",
    "De": "Diese Rufnummer ist keine bekannte MobileID-Nummer.",
    "Fr": "Ce numéro de téléphone n'est pas un numéro MobileID connu.",
    "It": "Questo numero di telefono non è un numero MobileID conosciuto.",
    "En": "This phone number is an unknown MobileID number."
  },
  {
    "Key": "Mid_208",
    "De": "Die MobileID-Sitzung ist abgelaufen. Bitte versuchen Sie es erneut.",
    "Fr": "La session MobileID a expiré. Veuillez réessayer.",
    "It": "La sessione MobileID è scaduta. Riprova.",
    "En": "The MobileID authentication session has expired. Please try again."
  },
  {
    "Key": "Mid_401",
    "De": "Die MobileID-Authentifizierung wurde vom Benutzer abgebrochen.",
    "Fr": "L'authentification MobileID a été annulée par l'utilisateur.",
    "It": "L'autenticazione MobileID è stata annullata dall'utente.",
    "En": "The MobileID authentication was cancelled by the user."
  },
  {
    "Key": "Mid_402",
    "De": "Die MobileID-PIN ist gesperrt. Besuchen Sie https://mobileid.ch/reset um sie zurückzusetzen.",
    "Fr": "Le PIN MobileID est bloqué. Visitez https://mobileid.ch/reset pour le réinitialiser.",
    "It": "Il PIN MobileID è bloccato. Visita https://mobileid.ch/reset per reimpostarlo.",
    "En": "The MobileID PIN is blocked. Please visit https://mobileid.ch/reset to reset it."
  },
  {
    "Key": "Mid_404",
    "De": "Kein aktives MobileID gefunden. Besuchen Sie https://mobileid.ch/activate zur Aktivierung.",
    "Fr": "Aucun MobileID actif trouvé. Visitez https://mobileid.ch/activate pour l'activer.",
    "It": "Nessun MobileID attivo trovato. Visita https://mobileid.ch/activate per attivarlo.",
    "En": "No active MobileID found. Please visit https://mobileid.ch/activate to activate."
  },
  {
    "Key": "Mid_406",
    "De": "Es läuft bereits eine MobileID-Authentifizierung. Bitte warten und erneut versuchen.",
    "Fr": "Une authentification MobileID est déjà en cours. Veuillez patienter et réessayer.",
    "It": "Un'autenticazione MobileID è già in corso. Attendere e riprovare.",
    "En": "There is already a MobileID authentication on-going. Please wait and try again."
  },
  {
    "Key": "Mid_422",
    "De": "Kein aktives MobileID gefunden. Besuchen Sie https://mobileid.ch/activate zur Aktivierung.",
    "Fr": "Aucun MobileID actif trouvé. Visitez https://mobileid.ch/activate pour l'activer.",
    "It": "Nessun MobileID attivo trovato. Visita https://mobileid.ch/activate per attivarlo.",
    "En": "No active MobileID found. Please visit https://mobileid.ch/activate to activate."
  },
  {
    "Key": "LdapInvalidCredentials",
    "De": "LDAP-Authentifizierung fehlgeschlagen. Bitte überprüfen Sie Ihre Zugangsdaten.",
    "Fr": "Échec de l'authentification LDAP. Veuillez vérifier vos identifiants.",
    "It": "Autenticazione LDAP non riuscita. Verificare le credenziali.",
    "En": "LDAP user authentication failed. Please verify your credentials and try again."
  },
  {
    "Key": "LdapUserNotFound",
    "De": "LDAP-Benutzer nicht gefunden. Bitte überprüfen Sie Ihre Zugangsdaten.",
    "Fr": "Utilisateur LDAP introuvable. Veuillez vérifier vos identifiants.",
    "It": "Utente LDAP non trovato. Verificare le credenziali.",
    "En": "LDAP user not found. Please verify your credentials and try again."
  },
  {
    "Key": "RigOtpMismatch",
    "De": "Das eingegebene Einmalpasswort ist ungültig.",
    "Fr": "Le mot de passe à usage unique saisi est invalide.",
    "It": "La password monouso inserita non è valida.",
    "En": "The One-Time-Password entered is invalid."
  },
  {
    "Key": "RigOtpMaxAllowedLoginAttemptsExeeded",
    "De": "Die maximale Anzahl an OTP-Anmeldeversuchen wurde überschritten.",
    "Fr": "Le nombre maximum de tentatives de connexion OTP a été dépassé.",
    "It": "Il numero massimo di tentativi di accesso OTP è stato superato.",
    "En": "The maximum number of OTP login attempts has been exceeded."
  },
  {
    "Key": "RigLocationValidationFailed",
    "De": "Der aktuelle Standort ist nicht erlaubt.",
    "Fr": "L'emplacement actuel n'est pas autorisé.",
    "It": "La posizione attuale non è consentita.",
    "En": "The user's current country code is not allowed."
  }
]
```

### Supported Error Codes

The following error codes can be used in both the I18N error message configuration and the error notification events:

#### Mobile ID Errors

| Error Code | Description |
|------------|-------------|
| `Mid_{code}` | Any 3-digit Mobile ID API error code (e.g., `Mid_401`, `Mid_404`). Refer to the Mobile ID Client Reference Guide. |
| `MidGeo_{code}` | Any 3-digit Mobile ID Geofencing error code (e.g., `MidGeo_100`). Refer to the Mobile ID Client Reference Guide. |
| `MidInvalidSerialNumber` | The Mobile ID serial number from the signature response is invalid |

#### LDAP Errors

| Error Code | Description |
|------------|-------------|
| `LdapInvalidCredentials` | LDAP user authentication failed (wrong password) |
| `LdapUserNotFound` | User not found in the LDAP directory |
| `LdapMissingMsisdnAttribute` | The configured MSISDN attribute is missing for the user |
| `LdapMissingSerialNrAttribute` | The configured serial number attribute is missing for the user |
| `LdapInvalidMsisdn` | The MSISDN value from LDAP is not a valid phone number |
| `LdapInvalidSerialNumber` | The serial number value from LDAP is invalid |
| `LdapMissingPassword` | The user's password attribute is missing in LDAP |
| `LdapNoReachableHost` | No LDAP host is reachable (all configured hosts failed) |
| `LdapGeofencingGroupMissing` | User is not a member of any geofencing LDAP group |
| `LdapCheckUserAccountControlFailed` | Active Directory User Account Control check failed |
| `LdapNoClassMatchingWithGroupDn` | No Class attribute mapping found for the user's LDAP groups |

#### RIG Errors

| Error Code | Description |
|------------|-------------|
| `RigMissingCustomerConfiguration` | No matching customer configuration found for the incoming request |
| `RigOtpMaxAllowedLoginAttemptsExeeded` | Maximum OTP login attempts exceeded |
| `RigOtpNotStored` | OTP session data not found (session may have expired) |
| `RigOtpMismatch` | The OTP entered by the user does not match |
| `RigNoMfaMethodFound` | No valid MFA method found for the user (method not available or not allowed by configuration) |
| `RigLocationValidationFailed` | The user's country code is not allowed by geofencing rules |
| `RigLocationDeviceConfidenceTooLow` | The device confidence score is below the configured threshold |
| `RigLocationLocationConfidenceTooLow` | The location confidence score is below the configured threshold |
| `RigGeofencingConfigError` | Geofencing configuration error |
| `RigOtpInvalidMsisdn` | No valid MSISDN could be extracted from the User-Name value |
| `RigInvalidMsisdn` | The MSISDN is invalid |
| `RigSerialNumberMismatch` | The serial number from the signature response does not match the LDAP value |
| `RigInvalidSerialNumber` | The serial number is invalid |
| `RigInvalidCustomerConfig` | The customer configuration is invalid |
| `FortinetGroupNotFound` | No matching Fortinet group found for the user |

#### Geofencing-Specific Codes

| Error Code | Description |
|------------|-------------|
| `MidGeo_100` | Geofencing toggle not enabled in the Mobile ID App |
| `MidGeo_101` | Failed to retrieve user location (resources/timeout) |
| `MidGeo_102` | User has not responded to the location permission dialog |
| `MidGeo_103` | User has denied location access |
| `MidGeo_104` | Location services restricted (parental controls, corporate policy) |
| `MidGeo_105` | Location services turned off device-wide |
| `MidGeo_106` | Location unavailable (airplane mode) |
| `MidGeo_120` | Location failed for an unspecified reason |
| `MidGeo_122` | Application Provider not authorized for geofencing |
| `MidGeo_123` | User has a non-Swisscom SIM card |
| `MidGeo_200` | No location returned from mobile app |
| `MidGeo_201` | App outdated, geofencing not supported |

## Configuration via Environment Variables

When using `AppSettings` as the configuration source (single-node deployment without Redis), all customer settings are provided via indexed environment variables. The environment variable names follow the pattern `CustomerConfigs__<index>__<path>`.

### Example

```bash
# Customer General Configuration
CustomerConfigs__0__Customer=My Company XYZ
CustomerConfigs__0__ApId=mid://ap.mycompany.ch
CustomerConfigs__0__NasIdentifier=ch_mycompany
CustomerConfigs__0__SourceIps__0=10.1.1.22/32
CustomerConfigs__0__RadiusSharedSecret=MyVeryStrongSharedSecret
CustomerConfigs__0__UseLdap=true
CustomerConfigs__0__DefaultLanguage=en
CustomerConfigs__0__ValidateSerialNr=false
CustomerConfigs__0__UseUserLanguage=true
CustomerConfigs__0__UseUserMfaMethod=true
CustomerConfigs__0__MfaMethods__0=SIM
CustomerConfigs__0__MfaMethods__1=APP
CustomerConfigs__0__MfaMethods__2=OTP
CustomerConfigs__0__MfaMethods__3=NONE

# LDAP Configuration
CustomerConfigs__0__Ldap__Hosts__Primary=10.0.0.5
CustomerConfigs__0__Ldap__Hosts__Secondary=
CustomerConfigs__0__Ldap__Hosts__Tertiary=
CustomerConfigs__0__Ldap__Port=389
CustomerConfigs__0__Ldap__ConnectionTimeoutSeconds=20
CustomerConfigs__0__Ldap__EnableSsl=false
CustomerConfigs__0__Ldap__AdminUser=cn=admin,dc=mycompany,dc=ch
CustomerConfigs__0__Ldap__AdminPassword=MyAdminPassword
CustomerConfigs__0__Ldap__UseClientCredentialsForConnection=false
CustomerConfigs__0__Ldap__FollowReferrals=false
CustomerConfigs__0__Ldap__DefaultSearchScope=LDAP_SCOPE_SUBTREE
CustomerConfigs__0__Ldap__CheckUserAccountControl=false
CustomerConfigs__0__Ldap__UserSearchBase=ou=users,dc=mycompany,dc=ch
CustomerConfigs__0__Ldap__UserSearchFilter=(&(objectclass=person)(|(sAMAccountName={username})(userPrincipalName={username})))
CustomerConfigs__0__Ldap__UserGroupSearchFilter=(&(objectClass=groupOfNames)(member={userdn}))
CustomerConfigs__0__Ldap__ValidateUserPassword=true
CustomerConfigs__0__Ldap__MobileNrAttribute=mobile
CustomerConfigs__0__Ldap__LanguageAttribute=preferredLanguage
CustomerConfigs__0__Ldap__SerialNrAttribute=msNPCallingStationID

# MFA Method Mapping
CustomerConfigs__0__Ldap__MfaMethod__MappingType=Attribute
CustomerConfigs__0__Ldap__MfaMethod__AttributeName=mfa_type
CustomerConfigs__0__Ldap__MfaMethod__Mappings__Sim=LDAP_SIM_VALUE
CustomerConfigs__0__Ldap__MfaMethod__Mappings__App=LDAP_APP_VALUE
CustomerConfigs__0__Ldap__MfaMethod__Mappings__Otp=LDAP_OTP_VALUE
CustomerConfigs__0__Ldap__MfaMethod__Mappings__None=LDAP_NONE_VALUE

# Geofencing
CustomerConfigs__0__Geofencing__Activate=true
CustomerConfigs__0__Geofencing__Whitelist__0=CH
CustomerConfigs__0__Geofencing__Whitelist__1=DE
CustomerConfigs__0__Geofencing__MinimalDeviceConfidence=0.7
CustomerConfigs__0__Geofencing__MinimalLocationConfidence=0.7

# SIM/APP Display Text
CustomerConfigs__0__SimApp__DisplayText__Default=MobileID: Please Authenticate
CustomerConfigs__0__SimApp__DisplayText__De=MobileID: Bitte mit Mobile ID authentifizieren
CustomerConfigs__0__SimApp__DisplayText__Fr=MobileID: Veuillez vous authentifier avec votre ID mobile
CustomerConfigs__0__SimApp__DisplayText__It=MobileID: Si prega di autenticarsi con il Mobile ID
CustomerConfigs__0__SimApp__DisplayText__En=MobileID: Please authenticate with Mobile ID

# OTP Configuration
CustomerConfigs__0__Otp__Length=5
CustomerConfigs__0__Otp__Mode=Text

# OTP SMS Text ({0} is replaced with the OTP value)
CustomerConfigs__0__Otp__SmsText__Default=Your MobileID code is {0}
CustomerConfigs__0__Otp__SmsText__De=Ihr MobileID Code ist {0}
CustomerConfigs__0__Otp__SmsText__Fr=Le code de votre MobileID est {0}
CustomerConfigs__0__Otp__SmsText__It=Il tuo codice MobileID è {0}
CustomerConfigs__0__Otp__SmsText__En=Your MobileID code is {0}

CustomerConfigs__0__Otp__ReplyMessageText__Default=Enter the code you have received by SMS
CustomerConfigs__0__Otp__ReplyMessageText__De=Geben Sie den Code ein, den Sie per SMS erhalten haben
CustomerConfigs__0__Otp__ReplyMessageText__Fr=Saisissez le code que vous avez reçu par SMS
CustomerConfigs__0__Otp__ReplyMessageText__It=Inserisci il codice che hai ricevuto via SMS
CustomerConfigs__0__Otp__ReplyMessageText__En=Enter the code you have received by SMS

# I18N Error Messages (AppSettings mode)
I18nMessages__0__Key=DefaultErrorMessage
I18nMessages__0__De=Authentifizierung fehlgeschlagen
I18nMessages__0__Fr=Échec de l'authentification
I18nMessages__0__It=Autenticazione non riuscita
I18nMessages__0__En=Authentication failed

I18nMessages__1__Key=Mid_401
I18nMessages__1__De=Die MobileID-Authentifizierung wurde vom Benutzer abgebrochen.
I18nMessages__1__Fr=L'authentification MobileID a été annulée par l'utilisateur.
I18nMessages__1__It=L'autenticazione MobileID è stata annullata dall'utente.
I18nMessages__1__En=The MobileID authentication was cancelled by the user.

# Additional customers can be added with incrementing index:
# CustomerConfigs__1__Customer=...
# CustomerConfigs__1__ApId=...
```

::: tip Docker Secrets
For sensitive values like certificates and passwords, you can use the `_FILE` suffix convention. Instead of setting the value directly, point to a file:

```bash
MID_CLIENT_CERTIFICATE_FILE=/run/secrets/mid_certificate
```

RIG reads the file content and uses it as the value for `MID_CLIENT_CERTIFICATE`.
:::

## Multi-Language Support

All user-facing text messages support four languages:

| Code | Language |
|------|----------|
| `De` | German |
| `Fr` | French |
| `It` | Italian |
| `En` | English |

The `Default` key is used as a fallback when the user's language is not available. The user's language is determined by:

1. The `LanguageAttribute` from LDAP (if `UseUserLanguage` is `true`)
2. The `DefaultLanguage` setting for the customer
