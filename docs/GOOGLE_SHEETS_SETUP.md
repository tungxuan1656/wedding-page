# Hướng dẫn tích hợp Google Sheets + Apps Script

## Tổng quan

Hệ thống dùng 2 Google Sheets riêng biệt, mỗi sheet có 1 Apps Script deployment:

| Sheet | Script | Mục đích |
|---|---|---|
| `guests` | AppScript 1 — GET | Danh sách khách mời, fetch lúc build |
| `rsvp` | AppScript 2 — GET + POST | Lưu xác nhận tham dự, đọc trạng thái theo slug |

---

## Phần 1 — Sheet `guests`

### 1.1 Tạo sheet

1. Vào [sheets.google.com](https://sheets.google.com) → **Blank spreadsheet**
2. Đặt tên file: `Wedding Guests`
3. Sheet tab mặc định (Sheet1) → đổi tên thành `guests` (click phải tab → Rename)

### 1.2 Cấu trúc cột

| Cột | Header | Kiểu | Bắt buộc |
|---|---|---|---|
| A | `name` | Text | Có |
| B | `slug` | Text, lowercase, không dấu, không space | Có |
| C | `image` | Đường dẫn ảnh (bắt đầu bằng `/`) hoặc để trống | Không |

**Hàng 1 là header** — script bỏ qua hàng này khi đọc data.

### 1.3 Dữ liệu mẫu

| A (name) | B (slug) | C (image) |
|---|---|---|
| name | slug | image |
| Anh Tú | anhtu | /guests/anh-tu.svg |
| Thu Hà | thuha | |
| Minh Khoa | minhkhoa | /guests/minh-khoa.jpg |
| Gia đình chú Hùng | giadinhhung | |

> **Quy tắc slug**: chỉ dùng chữ thường a–z, số 0–9, dấu gạch ngang `-`. Không dấu, không space.
> Slug phải khớp với URL mời: `https://yourdomain.com?g=<slug>`.

---

## Phần 2 — Apps Script 1: Guest List GET

### 2.1 Mở Apps Script

1. Trong spreadsheet `Wedding Guests`, chọn menu **Extensions → Apps Script**
2. Một tab mới mở ra với editor code

### 2.2 Xóa code mặc định và dán code sau

```javascript
function doGet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const rows = sheet.getDataRange().getValues();
  const [, ...data] = rows; // bỏ qua hàng header

  const guests = data
    .filter(function(row) { return row[1]; }) // bỏ row không có slug
    .map(function(row) {
      return {
        name: row[0],
        slug: String(row[1]).trim().toLowerCase(),
        image: row[2] || null,
      };
    });

  return ContentService
    .createTextOutput(JSON.stringify({ guests: guests }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

### 2.3 Deploy

1. Click **Deploy** (góc trên phải) → **New deployment**
2. Click biểu tượng bánh răng ⚙ bên cạnh "Select type" → chọn **Web app**
3. Điền thông tin:
   - **Description**: `Guest list GET`
   - **Execute as**: `Me`
   - **Who has access**: `Anyone`
4. Click **Deploy**
5. Google yêu cầu authorize → click **Authorize access** → chọn tài khoản Google → **Allow**
6. Sau khi deploy thành công, copy URL hiện ra (dạng `https://script.google.com/macros/s/.../exec`)

### 2.4 Lưu URL

Thêm vào file `.env.local` ở root project:

```bash
GUEST_SCRIPT_URL=https://script.google.com/macros/s/<ID>/exec
```

> ⚠️ **Không commit `.env.local` lên git.** File này đã có trong `.gitignore`.

### 2.5 Test

```bash
# Test thủ công — mở URL trực tiếp trên trình duyệt
# Kết quả mong đợi:
{"guests":[{"name":"Anh Tú","slug":"anhtu","image":"/guests/anh-tu.svg"},{"name":"Thu Hà","slug":"thuha","image":null}]}
```

### 2.6 Chạy fetch script

```bash
pnpm fetch-guests
# Expected: ✓ Wrote 4 guests to lib/guests-generated.json
```

Sau khi chạy thành công:

```bash
git add lib/guests-generated.json
git commit -m "chore: update guest list from sheet"
git push
```

> Vercel sẽ auto-deploy với guest data mới.

---

## Phần 3 — Sheet `rsvp`

### 3.1 Tạo sheet

**Tùy chọn A** — Tạo sheet mới trong cùng spreadsheet `Wedding Guests`:
1. Click dấu `+` ở thanh tab phía dưới
2. Đổi tên tab thành `rsvp`
3. Trong Apps Script, cần chỉ định sheet theo tên (xem code ở mục 4)

**Tùy chọn B** — Tạo spreadsheet mới riêng:
1. Vào [sheets.google.com](https://sheets.google.com) → **Blank spreadsheet**
2. Đặt tên: `Wedding RSVP`
3. Sheet tab mặc định đổi tên thành `rsvp`

> **Khuyến nghị**: Tùy chọn B — spreadsheet riêng dễ quản lý và phân quyền hơn.

### 3.2 Cấu trúc cột

| Cột | Header | Kiểu | Ghi chú |
|---|---|---|---|
| A | `submittedAt` | ISO 8601 timestamp | Tự động điền bởi script |
| B | `slug` | Text | Slug của khách, có thể trống nếu không có link mời |
| C | `name` | Text | Tên khách nhập vào form |
| D | `eventDaiKhach` | TRUE/FALSE | Tham dự tiệc đãi khách 08/06 |
| E | `eventThanhHon` | TRUE/FALSE | Tham dự lễ thành hôn 09/06 |

**Nhập header vào hàng 1**: gõ từng giá trị vào A1, B1, C1, D1, E1.

### 3.3 Dữ liệu mẫu (sau khi có submission)

| A (submittedAt) | B (slug) | C (name) | D (eventDaiKhach) | E (eventThanhHon) |
|---|---|---|---|---|
| submittedAt | slug | name | eventDaiKhach | eventThanhHon |
| 2026-06-01T10:00:00.000Z | anhtu | Anh Tú | TRUE | TRUE |
| 2026-06-01T11:30:00.000Z | thuha | Thu Hà | TRUE | FALSE |
| 2026-06-02T09:15:00.000Z | | Nguyễn Văn X | FALSE | TRUE |

---

## Phần 4 — Apps Script 2: RSVP GET + POST

### 4.1 Mở Apps Script

**Nếu dùng Tùy chọn B** (spreadsheet riêng):
- Trong spreadsheet `Wedding RSVP` → **Extensions → Apps Script**

**Nếu dùng Tùy chọn A** (cùng spreadsheet):
- Trong spreadsheet `Wedding Guests` → **Extensions → Apps Script**
- Code cần chỉ định sheet theo tên (xem ghi chú trong code)

### 4.2 Code Apps Script

```javascript
// Tên sheet chứa RSVP data
var RSVP_SHEET_NAME = 'rsvp';

function getSheet() {
  return SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName(RSVP_SHEET_NAME);
}

// GET: trả về RSVP cuối cùng của slug
function doGet(e) {
  var slug = e && e.parameter && e.parameter.slug;

  if (!slug) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: 'Missing slug' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  var sheet = getSheet();
  var rows = sheet.getDataRange().getValues();

  // Scan từ cuối lên để lấy submission mới nhất
  var result = null;
  for (var i = rows.length - 1; i >= 1; i--) {
    if (rows[i][1] === slug) {
      result = {
        submittedAt: rows[i][0],
        slug:        rows[i][1],
        name:        rows[i][2],
        eventDaiKhach: rows[i][3] === true || rows[i][3] === 'true' || rows[i][3] === 'TRUE',
        eventThanhHon: rows[i][4] === true || rows[i][4] === 'true' || rows[i][4] === 'TRUE',
      };
      break;
    }
  }

  return ContentService
    .createTextOutput(JSON.stringify({ status: 'success', data: result }))
    .setMimeType(ContentService.MimeType.JSON);
}

// POST: append RSVP mới vào sheet
function doPost(e) {
  var sheet = getSheet();
  var data = JSON.parse(e.postData.contents);

  sheet.appendRow([
    new Date().toISOString(),
    data.slug  || '',
    data.name,
    data.eventDaiKhach,
    data.eventThanhHon,
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ status: 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

> **Ghi chú**: `RSVP_SHEET_NAME = 'rsvp'` — đổi nếu tab sheet có tên khác.

### 4.3 Deploy

1. Click **Deploy** → **New deployment**
2. Click ⚙ → **Web app**
3. Điền:
   - **Description**: `RSVP GET POST with slug`
   - **Execute as**: `Me`
   - **Who has access**: `Anyone`
4. Click **Deploy** → **Authorize access** → **Allow**
5. Copy URL deployment

### 4.4 Lưu URL

Thêm vào `.env.local`:

```bash
NEXT_PUBLIC_RSVP_SCRIPT_URL=https://script.google.com/macros/s/<ID>/exec
```

Thêm vào Vercel:
- Dashboard → Project → Settings → **Environment Variables**
- Key: `NEXT_PUBLIC_RSVP_SCRIPT_URL`
- Value: URL vừa copy
- Environments: Production, Preview, Development

### 4.5 Test GET

```bash
# Mở trên trình duyệt (thay slug tương ứng)
https://script.google.com/macros/s/<ID>/exec?slug=anhtu

# Nếu chưa có submission:
{"status":"success","data":null}

# Nếu đã có submission:
{"status":"success","data":{"submittedAt":"2026-06-01T10:00:00.000Z","slug":"anhtu","name":"Anh Tú","eventDaiKhach":true,"eventThanhHon":true}}
```

### 4.6 Test POST

```bash
curl -X POST \
  "https://script.google.com/macros/s/<ID>/exec" \
  -H "Content-Type: application/json" \
  -d '{"slug":"test","name":"Test Guest","eventDaiKhach":true,"eventThanhHon":false}'

# Expected:
{"status":"success"}
```

> Sau khi POST, kiểm tra sheet `rsvp` — phải có row mới xuất hiện.

---

## Phần 5 — Cập nhật guest list khi có khách mới

```bash
# 1. Thêm khách vào Google Sheet guests (name, slug, image)

# 2. Chạy fetch script
pnpm fetch-guests
# → ✓ Wrote N guests to lib/guests-generated.json

# 3. Thêm message cá nhân (nếu cần) vào lib/guests.ts
# Tìm GUEST_MESSAGES và thêm entry mới:
# minhkhoa: 'Nhớ đến sớm nhé anh Khoa!',

# 4. Commit và push
git add lib/guests-generated.json lib/guests.ts
git commit -m "chore: add new guest minhkhoa"
git push
# → Vercel auto-deploy
```

---

## Phần 6 — Cập nhật Apps Script (khi cần sửa code)

Khi sửa code Apps Script, **phải tạo deployment mới** để code mới có hiệu lực:

1. Vào Apps Script editor
2. Sửa code
3. Click **Deploy** → **Manage deployments**
4. Tìm deployment hiện tại → click **Edit** (bút chì)
5. **Version** → chọn **New version**
6. Click **Deploy**

> URL của deployment **không thay đổi** khi update version — không cần cập nhật env var.

---

## Phần 7 — Checklist hoàn thiện

### Sheet `guests`
- [ ] Tạo spreadsheet `Wedding Guests`
- [ ] Tạo tab `guests` với header: `name | slug | image`
- [ ] Nhập danh sách khách mời
- [ ] Deploy AppScript GET → lấy URL
- [ ] Set `GUEST_SCRIPT_URL` trong `.env.local`
- [ ] Chạy `pnpm fetch-guests` → commit `lib/guests-generated.json`

### Sheet `rsvp`
- [ ] Tạo spreadsheet `Wedding RSVP` (hoặc tab mới)
- [ ] Tạo tab `rsvp` với header: `submittedAt | slug | name | eventDaiKhach | eventThanhHon`
- [ ] Deploy AppScript GET+POST → lấy URL
- [ ] Set `NEXT_PUBLIC_RSVP_SCRIPT_URL` trong `.env.local` và Vercel

### Verify
- [ ] Test GET guests URL trên trình duyệt → JSON trả về
- [ ] Test GET rsvp `?slug=anhtu` → `{"status":"success","data":null}`
- [ ] Test submit RSVP form trên site với `?g=anhtu`
- [ ] Kiểm tra sheet rsvp có row mới
- [ ] Test lại `?g=anhtu` → form pre-fill đúng
