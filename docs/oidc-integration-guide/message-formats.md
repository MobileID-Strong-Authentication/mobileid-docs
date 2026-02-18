# Message Formats on the Mobile ID App

Mobile ID App screens can present the Data-To-Be-Displayed (DTBD) in two formats.

::: tip
Use **Classic DTBD** for short confirmations and when you must support SIM users. Keep messages concise and always include the "DTBD Prefix".

Use **Transaction Approval** when readability matters (e.g., [PSD2](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=celex%3A32015L2366) payments, contract consent, step up login verification). Force the App method with Device LoA4, keep within byte limits, and generate the escaped JSON programmatically.
:::

1. **Classic DTBD** (single text line) uses a plain UTF-8 string that is also signed (DTBS).

   Supported by SIM and App methods.

   Length limited and no formatting options.

   <img src="/img/message-formats-classic.png" alt="message-formats-classic" width="350">


2. **Transaction Approval** (key/value pairs) is a structured App-only format that renders a title (type) and one or more key and value rows for improved readability.

   Approve/Cancel becomes active only after the user scrolls to the end if content exceeds one screen.

   RPs request this by sending a JSON object in the dtbd authorization parameter.

   <img src="/img/message-formats-transaction-approval.png" alt="message-formats-transaction-approval" width="350">


## Classic DTBD

A single UTF-8 string shown on the device. The classic DTBD must include the AP-specific DTBD prefix (e.g., `Bank ACME:`) and is supported by both SIM and App methods.

::: warning
Keep the DTBD short. Maximum **239 characters**; if any character falls outside the [GSM 03.38](https://en.wikipedia.org/wiki/GSM_03.38) set, effective maximum is **119 characters**.
:::

Parameter: `dtbd` with a plain string. The OP renders the classic one-line message.

Typical request excerpt:

```bash
...&dtbd=Please%20confirm%20your%20login%20to%20MyBank%20eBanking
```


## Transaction Approval

A structured DTBD that the Mobile ID App renders as a title and rows of key/value pairs. If content overflows, the user must scroll to the bottom; only then are Approve/Cancel enabled.

::: warning
SIM does not support this format. Always select an App ACR (e.g., `mid_al3_mobileapp`).
:::

How to request it: Send a JSON object via the `dtbd` authorization request parameter; the value must be URL-encoded (percent-encoding). If the decoded value starts with `{` and validates against the schema/limits below and the user has an active App, the OP renders the key/value screen.

```json
{
  "type": "<ascii>",
  "dtbd": [
    { "key": "<ascii>", "value": "<ascii>" }
    /* up to 20 pairs */
  ]
}
```

**Limits** (in bytes):

- `type` ≤ 100
- ≤ 20 pairs
- each `key` ≤ 100, each `value` ≤ 2000
- sum(keys+values) ≤ 2000 (bytes; non-ASCII uses 2–4 bytes)
- **DTBD Prefix** (required): your configured prefix must be in the value of the first pair
  e.g., `{"key":"Company","value":"Acme AG: ..."}`

## Transaction Approval Example

### Pretty JSON

Build this first.

```json
{
  "type": "Address Change Confirmation",
  "dtbd": [
    { "key": "Company",             "value": "Acme AG" },
    { "key": "Full Name",           "value": "Philipp Haupt" },
    { "key": "Old Address",         "value": "Bahnhofstrasse 1, 8001 Zürich" },
    { "key": "New Address",         "value": "Sihlquai 55, 8005 Zürich" },
    { "key": "Effective Date",      "value": "01 June 2025" },
    { "key": "Consent Instruction", "value": "Reply APPROVE to consent or CANCEL" }
  ]
}
```

### Single-line

What you URL-encode as `dtbd=`

```json
{"type":"Address Change Confirmation","dtbd":[{"key":"Company","value":"Acme AG"},{"key":"Full Name","value":"Philipp Haupt"},{"key":"Old Address","value":"Bahnhofstrasse 1, 8001 Zürich"},{"key":"New Address","value":"Sihlquai 55, 8005 Zürich"},{"key":"Effective Date","value":"01 June 2025"},{"key":"Consent Instruction","value":"Reply APPROVE to consent or CANCEL"}]}
```

Below is another example that includes the keywords `#CLIENT#` and `#SESSION#`, as described in section [DTBD Parameter](/oidc-integration-guide/getting-started#dtbd-parameter).

```bash
{"type":"LOGIN","dtbd":[{"key":"Company","value":"#CLIENT#"},{"key":"Session","value":"#SESSION#"}]}
```

### Authorization request (excerpt)

::: tip
Use PAR to avoid URL length limits and keep parameters confidential.
:::

Or pass `dtbd` directly on the authorize URL:

```http
GET /oidc/authorize?
  response_type=code
  &scope=openid
  &client_id=YOUR_CLIENT_ID
  &state=...
  &redirect_uri=https%3A%2F%2Fclient.example%2Fcb
  &acr_values=mid_al3_mobileapp
  &dtbd=%7B%22type%22%3A%22Address%20Change%20Confirmation%22%2C%22dtbd%22%3A%5B%7B%22key%22%3A%22Company%22%2C%22value%22%3A%22Acme%20AG%22%7D%2C...%5D%7D
```

::: warning
Request an App ACR (e.g., `mid_al3_mobileapp`) if you want to ensure the App method is selected.
:::

## Signed Data Comparison

**Classic DTBD:** the service signs the visible text string.

**Transaction Approval:** the App signs a normalized JSON object of the form:

```json
{"format_version":1,"content_string":"[{\"key\":\"Company\",\"value\":\"Test\"}]"}
```

i.e., the `dtbd` array only; the `type` label is not part of the signed bytes.

## Best practices

::: info
- **Build → URL-encode → send:** generate the JSON with your library, then URL-encode as `dtbd`. Avoid hand-crafted strings. (Use PAR for large payloads/confidentiality.)
- **Select App method:** use `acr_values` (e.g., `mid_al3_mobileapp`) when you want to ensure App UX.
- **Prefix rule:** include your DTBD prefix in the value of the first pair.
- **Respect byte limits:** limits are in bytes, not characters; UTF-8 non-ASCII uses 2–4 bytes.
- **Number-matching & keywords:** `#SESSION#` and `#CLIENT#` keywords are supported in `type`, `key`, or `value` and can be used to implement number matching.
:::
