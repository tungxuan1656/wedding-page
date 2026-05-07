# Hướng dẫn tích hợp Google Sheets + Apps Script

## Tổng quan

Hệ thống dùng **1 Google Spreadsheet** chứa 2 tab, và **1 Apps Script project** với 3 file `.gs`:

| Tab | Mục đích |
|---|---|
| `guests` | Danh sách khách mời — fetch lúc build |
| `rsvp` | Lưu xác nhận tham dự — đọc/ghi lúc runtime |

| File Apps Script | Nội dung |
|---|---|
| `Code.gs` | Entry point: `doGet`, `doPost`, helper `json()` |
| `guests.gs` | Handler `getGuests()` |
| `rsvp.gs` | Handler `getRsvp()`, `postRsvp()` |

**1 URL deployment duy nhất** — routing bằng query param `?sheet=` và body field `sheet:`.

---

## Phần 1 — Tạo Spreadsheet và 2 tab

### 1.1 Tạo spreadsheet

1. Vào [sheets.google.com](https://sheets.google.com) → **Blank spreadsheet**
2. Đặt tên file: `Wedding`

### 1.2 Tab `guests`

1. Click phải tab mặc định `Sheet1` → **Rename** → gõ `guests`
2. Nhập header vào **hàng 1**:

| A | B | C |
|---|---|---|
| `name` | `slug` | `image` |

3. Nhập dữ liệu từ hàng 2 trở đi:

| A (name) | B (slug) | C (image) |
|---|---|---|
| Anh Tú | anhtu | /guests/anh-tu.svg |
| Thu Hà | thuha | |
| Minh Khoa | minhkhoa | /guests/minh-khoa.jpg |
| Gia đình chú Hùng | giadinhhung | |

> **Quy tắc slug**: chỉ dùng chữ thường `a–z`, số `0–9`, dấu `-`. Không dấu, không space.
> Slug phải khớp với URL mời: `https://yourdomain.com?g=<slug>`.

### 1.3 Tab `rsvp`

1. Click dấu **`+`** ở thanh tab phía dưới → tab mới tạo ra
2. Click phải tab mới → **Rename** → gõ `rsvp`
3. Nhập header vào **hàng 1**:

| A | B | C | D | E |
|---|---|---|---|---|
| `submittedAt` | `slug` | `name` | `eventDaiKhach` | `eventThanhHon` |

> Không cần nhập data — script tự append khi khách submit form.

---

## Phần 2 — Tạo Apps Script project

### 2.1 Mở Apps Script

Trong spreadsheet `Wedding`:
1. Menu **Extensions → Apps Script**
2. Tab mới mở ra với 1 file mặc định `Code.gs`

### 2.2 Tạo 3 file

Hiện tại chỉ có `Code.gs`. Cần thêm 2 file nữa:

1. Click dấu **`+`** bên cạnh "Files" ở panel trái → **Script**
2. Gõ tên: `guests` → Enter → file `guests.gs` tạo ra
3. Lặp lại → tên: `rsvp` → file `rsvp.gs` tạo ra

Kết quả panel trái:
```
📄 Code.gs
📄 guests.gs
📄 rsvp.gs
```

### 2.3 Nội dung `Code.gs`

Click vào `Code.gs`, **xóa toàn bộ** code mặc định, dán code sau:

```javascript
// Code.gs — Entry point duy nhất chứa doGet, doPost, và helper json()

function doGet(e) {
  var sheetParam = e && e.parameter && e.parameter.sheet;

  if (sheetParam === 'guests') return getGuests();
  if (sheetParam === 'rsvp')   return getRsvp(e.parameter.slug);

  return json({ status: 'error', message: 'Missing ?sheet=guests|rsvp' });
}

function doPost(e) {
  var data = JSON.parse(e.postData.contents);

  if (data.sheet === 'rsvp') return postRsvp(data);

  return json({ status: 'error', message: 'Missing sheet: "rsvp" in body' });
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
```

### 2.4 Nội dung `guests.gs`

Click vào `guests.gs`, **xóa toàn bộ** code mặc định, dán:

```javascript
// guests.gs — Đọc danh sách khách từ tab 'guests'

var GUEST_SHEET = 'guests';

function getGuests() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(GUEST_SHEET);
  var rows = sheet.getDataRange().getValues();
  var data = rows.slice(1); // bỏ hàng header

  var guests = data
    .filter(function(row) { return row[1]; }) // bỏ row không có slug
    .map(function(row) {
      return {
        name:  row[0],
        slug:  String(row[1]).trim().toLowerCase(),
        image: row[2] || null,
      };
    });

  return json({ guests: guests });
}
```

### 2.5 Nội dung `rsvp.gs`

Click vào `rsvp.gs`, **xóa toàn bộ** code mặc định, dán:

```javascript
// rsvp.gs — Đọc và ghi RSVP từ tab 'rsvp'

var RSVP_SHEET = 'rsvp';

// GET: trả về RSVP cuối cùng của slug
function getRsvp(slug) {
  if (!slug) {
    return json({ status: 'error', message: 'Missing slug' });
  }

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(RSVP_SHEET);
  var rows = sheet.getDataRange().getValues();

  // Scan từ cuối lên để lấy submission mới nhất
  var result = null;
  for (var i = rows.length - 1; i >= 1; i--) {
    if (rows[i][1] === slug) {
      result = {
        submittedAt:   rows[i][0],
        slug:          rows[i][1],
        name:          rows[i][2],
        eventDaiKhach: rows[i][3] === true || rows[i][3] === 'TRUE',
        eventThanhHon: rows[i][4] === true || rows[i][4] === 'TRUE',
      };
      break;
    }
  }

  return json({ status: 'success', data: result });
}

// POST: append RSVP mới vào sheet
function postRsvp(data) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(RSVP_SHEET);

  sheet.appendRow([
    new Date().toISOString(),
    data.slug || '',
    data.name,
    data.eventDaiKhach,
    data.eventThanhHon,
  ]);

  return json({ status: 'success' });
}
```

---

## Phần 3 — Deploy Apps Script

### 3.1 Các bước deploy

1. Click **Deploy** (góc trên phải) → **New deployment**
2. Click biểu tượng bánh răng ⚙ bên cạnh "Select type" → chọn **Web app**
3. Điền thông tin:
   - **Description**: `Wedding App Script v1`
   - **Execute as**: `Me`
   - **Who has access**: `Anyone`
4. Click **Deploy**
5. Google yêu cầu authorize → click **Authorize access** → chọn tài khoản Google → **Allow**
6. Sau khi deploy thành công → **copy URL** (dạng `https://script.google.com/macros/s/.../exec`)

### 3.2 Lưu URL vào env

URL deploy là **1 URL duy nhất** dùng cho cả 2 mục đích. Thêm vào `.env.local`:

```bash
NEXT_PUBLIC_APPS_SCRIPT_URL=https://script.google.com/macros/s/<ID>/exec
```

> ⚠️ **Không commit `.env.local` lên git.** File này đã có trong `.gitignore`.

Thêm vào Vercel:
- Dashboard → Project → Settings → **Environment Variables**
- Key: `NEXT_PUBLIC_APPS_SCRIPT_URL`, Value: URL trên
- Environments: Production, Preview, Development

---

## Phần 4 — Test và verify

### 4.1 Test GET guests

Mở trình duyệt, truy cập:

```
https://script.google.com/macros/s/<ID>/exec?sheet=guests
```

Kết quả mong đợi:
```json
{"guests":[{"name":"Anh Tú","slug":"anhtu","image":"/guests/anh-tu.svg"},{"name":"Thu Hà","slug":"thuha","image":null}]}
```

### 4.2 Chạy fetch script

```bash
pnpm fetch-guests
# Expected: ✓ Wrote 4 guests to lib/guests-generated.json
```

Sau đó commit:
```bash
git add lib/guests-generated.json
git commit -m "chore: update guest list from sheet"
git push
# → Vercel auto-deploy
```

### 4.3 Test GET rsvp

```
https://script.google.com/macros/s/<ID>/exec?sheet=rsvp&slug=anhtu
```

Kết quả (chưa có submission):
```json
{"status":"success","data":null}
```

### 4.4 Test POST rsvp

```bash
curl -L -X POST \
  "https://script.google.com/macros/s/<ID>/exec" \
  -H "Content-Type: application/json" \
  -d '{"sheet":"rsvp","slug":"anhtu","name":"Anh Tú","eventDaiKhach":true,"eventThanhHon":true}'

# Expected:
{"status":"success"}
```

> Sau khi POST, mở tab `rsvp` trong spreadsheet — phải có row mới xuất hiện.

Gọi lại GET để verify pre-fill:
```
https://script.google.com/macros/s/<ID>/exec?sheet=rsvp&slug=anhtu
```
```json
{"status":"success","data":{"submittedAt":"...","slug":"anhtu","name":"Anh Tú","eventDaiKhach":true,"eventThanhHon":true}}
```

---

## Phần 5 — Cập nhật guest list khi có khách mới

```bash
# 1. Thêm khách vào tab guests trong spreadsheet (name, slug, image)

# 2. Chạy fetch script
pnpm fetch-guests
# → ✓ Wrote N guests to lib/guests-generated.json

# 3. (Tùy chọn) Thêm message cá nhân vào lib/guests.ts
# Tìm GUEST_MESSAGES và thêm entry mới:
# minhkhoa: 'Nhớ đến sớm nhé anh Khoa!',

# 4. Commit và push
git add lib/guests-generated.json lib/guests.ts
git commit -m "chore: add new guest minhkhoa"
git push
# → Vercel auto-deploy với guest data mới
```

---

## Phần 6 — Cập nhật Apps Script (khi sửa code)

Sau khi sửa code bất kỳ file `.gs` nào:

1. Vào Apps Script editor
2. Click **Deploy** → **Manage deployments**
3. Tìm deployment hiện tại → click **Edit** (bút chì ✏)
4. **Version** → chọn **New version**
5. Click **Deploy**

> URL của deployment **không thay đổi** — không cần cập nhật env var.

---

## Phần 7 — Checklist hoàn thiện

### Spreadsheet setup
- [ ] Tạo spreadsheet `Wedding`
- [ ] Tab `guests`: header `name | slug | image`, nhập danh sách khách
- [ ] Tab `rsvp`: header `submittedAt | slug | name | eventDaiKhach | eventThanhHon`

### Apps Script
- [ ] Mở Apps Script từ spreadsheet
- [ ] Tạo `guests.gs` và `rsvp.gs` (ngoài `Code.gs` mặc định)
- [ ] Dán code vào cả 3 file đúng theo hướng dẫn
- [ ] Deploy → chọn **Web app**, Execute as **Me**, Access **Anyone**
- [ ] Copy URL deployment

### Env vars
- [ ] Set `NEXT_PUBLIC_APPS_SCRIPT_URL=<url>` trong `.env.local`
- [ ] Set `NEXT_PUBLIC_APPS_SCRIPT_URL=<url>` trong Vercel Environment Variables

### Verify
- [ ] `?sheet=guests` → JSON guests list
- [ ] `pnpm fetch-guests` → `lib/guests-generated.json` được ghi
- [ ] `?sheet=rsvp&slug=anhtu` → `{"status":"success","data":null}`
- [ ] Submit RSVP form trên site với `?g=anhtu` → sheet `rsvp` có row mới
- [ ] Mở lại `/?g=anhtu` → form pre-fill đúng tên và checkbox
