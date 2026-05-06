# feat-004: RSVP System — Product Spec & Deployment Guide

## Overview

Guests confirm attendance from the landing page `#rsvp` section. Form collects name and event attendance, POSTs to a Google Apps Script endpoint, and stores submissions in Google Sheets.

## Field Labels

| Field | Label | Type | Required |
|---|---|---|---|
| `name` | Họ tên | text | yes |
| `eventDaiKhach` | Đi ăn ngày 8/6 dương lịch (23/4 âm lịch Bính Ngọ) | checkbox | at least one |
| `eventThanhHon` | Đi đưa đón dâu ngày 9/6 dương lịch (24/4 âm lịch) | checkbox | at least one |

## Validation Rules

- `name` must be non-empty after trim.
- At least one of `eventDaiKhach` or `eventThanhHon` must be `true`.
- Validation runs client-side before any network request.

## POST Contract

### Request

```json
{
  "name": "Nguyễn Văn A",
  "eventDaiKhach": true,
  "eventThanhHon": false
}
```

URL: `NEXT_PUBLIC_APPS_SCRIPT_URL` (env var, required at runtime)
Method: `POST`
Content-Type: `application/json`

### Response (success)

```json
{ "status": "success" }
```

### Response (error)

```json
{ "status": "error", "message": "Optional error detail" }
```

## Google Sheets Column Order

| Column | Value |
|---|---|
| A | `submittedAt` (ISO 8601 timestamp) |
| B | `name` |
| C | `eventDaiKhach` (true/false) |
| D | `eventThanhHon` (true/false) |

## Google Apps Script Deployment

1. Open the target Google Sheet.
2. **Extensions → Apps Script**.
3. Replace default code with the snippet below.
4. **Deploy → New deployment → Web app**:
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Copy the deployment URL.
6. Set `NEXT_PUBLIC_APPS_SCRIPT_URL=<deployment-url>` in Vercel environment variables (and local `.env.local`).

### Apps Script Code

```javascript
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = JSON.parse(e.postData.contents);

  sheet.appendRow([
    new Date().toISOString(),
    data.name,
    data.eventDaiKhach,
    data.eventThanhHon,
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ status: 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

> **Note**: Apps Script deployment URL is stable across re-deployments as long as you use the same script project. Use a dedicated test sheet tab for local verification to avoid polluting the production sheet.

## Acceptance Verification

Run from repo root:

```bash
pnpm lint
pnpm typecheck
pnpm build
./init.sh
```

Manual checks:
1. Open `/` → click **Xác nhận tham dự** → page scrolls to form.
2. Submit empty → name error + event error appear, no network request.
3. Name only, no checkbox → event error appears.
4. Valid submit (name + checkbox) → loading state → success message.
5. Missing env var → error banner with retry button.
