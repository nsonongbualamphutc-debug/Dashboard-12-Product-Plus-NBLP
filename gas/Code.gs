/**
 * 12 Plus+ · Virtual Expo — ที่เก็บนิทรรศการของผู้ใช้ (Google Sheets + Apps Script)
 *
 * วิธีติดตั้ง (ทำครั้งเดียว ~5 นาที)
 *  1) สร้าง Google Sheets ใหม่ด้วยบัญชีสำนักงาน ตั้งชื่อเช่น "12Plus Virtual Expo"
 *  2) เมนู ส่วนขยาย → Apps Script → ลบโค้ดเดิม แล้ววางไฟล์นี้ทั้งหมด → บันทึก
 *  3) กด "ทำให้ใช้งานได้" (Deploy) → การทำให้ใช้งานได้รายการใหม่ → ประเภท: เว็บแอป
 *       - ดำเนินการในฐานะ: ฉัน (Me)
 *       - ผู้ที่มีสิทธิ์เข้าถึง: ทุกคน (Anyone)
 *     กด Deploy → อนุญาตสิทธิ์ → คัดลอก "URL ของเว็บแอป" (ลงท้ายด้วย /exec)
 *  4) เปิด exhibit.html หาบรรทัด  const GAS_URL='';  ใส่ URL ไว้ในเครื่องหมาย ' '
 *  5) อัป exhibit.html ขึ้น GitHub → ปุ่ม "เผยแพร่" และแท็บ "นิทรรศการทั้งหมด" ใช้งานได้ทันที
 *
 * ชีต "Exhibitions" จะถูกสร้างอัตโนมัติ: id | name | by | p | theme | views | created | status
 * ซ่อนนิทรรศการที่ไม่เหมาะสม: เปลี่ยนคอลัมน์ status เป็น hide
 *
 * v3: เพิ่ม action=votes (จอกลางลาน: โหวตบูธ + อันดับ) · ภารกิจ/ควิซ/รางวัล บันทึกใน Events
 * v2 (สถิติการเข้าชม + แต้ม + อันดับ) — อัปเดตโค้ดแล้วต้อง Deploy ใหม่:
 *   ทำให้ใช้งานได้ → จัดการการทำให้ใช้งานได้ → แก้ไข (ไอคอนดินสอ) → เวอร์ชัน: เวอร์ชันใหม่ → ทำให้ใช้งานได้
 *   (URL เดิมใช้ต่อได้ ไม่ต้องเปลี่ยนใน exhibit.html)
 * ชีตที่สร้างเพิ่มอัตโนมัติ:
 *   Players : pid | name | pts | stamps | lotus | secs | visits | device | first | last | date   (1 แถว/คน/วัน)
 *   Events  : time | pid | name | ev | booth | ex                                               (ทุกการกระทำ)
 *   Summary : ตัวเลขสรุปรายวัน (สร้างด้วยสูตร — เปิดดูได้ทันที)
 */
const SHEET = 'Exhibitions';
const HEAD = ['id', 'name', 'by', 'p', 'theme', 'views', 'created', 'status'];

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET);
  if (!sh) { sh = ss.insertSheet(SHEET); sh.appendRow(HEAD); sh.setFrozenRows(1); }
  return sh;
}
function out_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
function clean_(s, n) { return String(s || '').replace(/[<>]/g, '').trim().slice(0, n); }
function rows_() {
  const v = sheet_().getDataRange().getValues(); v.shift();
  return v.map((r, i) => ({ row: i + 2, id: r[0], name: r[1], by: r[2], p: r[3], theme: r[4], views: r[5], created: r[6], status: r[7] }));
}

function sh_(name, head) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(name);
  if (!sh) { sh = ss.insertSheet(name); sh.appendRow(head); sh.setFrozenRows(1); }
  return sh;
}
const PHEAD = ['pid', 'name', 'pts', 'stamps', 'lotus', 'secs', 'visits', 'device', 'first', 'last', 'date'];
function today_() { return Utilities.formatDate(new Date(), 'Asia/Bangkok', 'yyyy-MM-dd'); }
function summary_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (ss.getSheetByName('Summary')) return;
  const s = ss.insertSheet('Summary');
  s.getRange('A1:B1').setValues([['ตัวชี้วัด', 'ค่า']]);
  s.getRange('A2:B9').setFormulas([
    ['="ผู้เข้าชมทั้งหมด (คน-วัน)"', '=MAX(0,COUNTA(Players!A:A)-1)'],
    ['="ผู้เข้าชมวันนี้"', '=COUNTIF(Players!K:K,TEXT(TODAY(),"yyyy-mm-dd"))'],
    ['="เวลาเฉลี่ยต่อคน (นาที)"', '=IFERROR(ROUND(AVERAGE(Players!F2:F)/60,1),0)'],
    ['="แสตมป์เฉลี่ยต่อคน"', '=IFERROR(ROUND(AVERAGE(Players!D2:D),1),0)'],
    ['="เก็บแสตมป์ครบ (คน)"', '=COUNTIF(Players!D2:D,">=14")'],
    ['="เก็บบัวทองครบ (คน)"', '=COUNTIF(Players!E2:E,">=5")'],
    ['="ใช้มือถือ/iPad (%)"', '=IFERROR(ROUND(COUNTIF(Players!H2:H,"mobile")/(COUNTA(Players!A:A)-1)*100,1),0)'],
    ['="ออกใบประกาศ (ครั้ง)"', '=COUNTIF(Events!D:D,"certificate")']]);
  s.getRange('D1:E1').setValues([['บูธ (เลขสินค้า)', 'จำนวนครั้งที่เปิดดู']]);
  const rows = []; for (let i = 1; i <= 14; i++) rows.push([i, '=COUNTIFS(Events!D:D,"booth",Events!E:E,' + i + ')']);
  s.getRange(2, 4, 14, 2).setFormulas(rows.map(r => ['=' + r[0], r[1]]));
  s.setColumnWidth(1, 220);
}

function doGet(e) {
  const a = (e.parameter.action || 'list');
  if (a === 'votes') {
    const d = today_();
    const E = sh_('Events', ['time', 'pid', 'name', 'ev', 'booth', 'ex']).getDataRange().getValues(); E.shift();
    const votes = {}; E.forEach(r => { if (r[3] === 'vote' && String(r[0]).slice(0, 10) === d) votes[r[4]] = (votes[r[4]] || 0) + 1; });
    const v = sh_('Players', PHEAD).getDataRange().getValues(); v.shift();
    const top = v.filter(r => String(r[10]) === d).sort((x, y) => Number(y[2]) - Number(x[2])).slice(0, 6).map(r => ({ name: r[1], pts: r[2] }));
    return out_({ ok: true, votes, top });
  }
  if (a === 'top') {
    const v = sh_('Players', PHEAD).getDataRange().getValues(); v.shift();
    const d = today_();
    const items = v.filter(r => String(r[10]) === d).sort((x, y) => Number(y[2]) - Number(x[2])).slice(0, 20)
      .map(r => ({ pid: r[0], name: r[1], pts: r[2], stamps: r[3], lotus: r[4] }));
    return out_({ ok: true, items });
  }
  if (a === 'list') {
    const items = rows_().filter(r => r.status !== 'hide').sort((x, y) => String(y.created).localeCompare(String(x.created))).slice(0, 200)
      .map(r => ({ id: r.id, name: r.name, by: r.by, p: r.p, theme: r.theme, views: r.views, created: r.created }));
    return out_({ ok: true, items });
  }
  if (a === 'get' || a === 'view') {
    const lock = LockService.getScriptLock(); lock.tryLock(5000);
    try {
      const r = rows_().find(x => String(x.id) === String(e.parameter.id));
      if (!r || r.status === 'hide') return out_({ ok: false });
      if (a === 'view') sheet_().getRange(r.row, 6).setValue(Number(r.views || 0) + 1);
      return out_({ ok: true, item: { id: r.id, name: r.name, by: r.by, p: r.p, theme: r.theme, views: r.views } });
    } finally { lock.releaseLock(); }
  }
  return out_({ ok: false, error: 'unknown action' });
}

function log_(b) {
  const pid = clean_(b.pid, 24); if (!pid) return out_({ ok: false });
  const name = clean_(b.name, 24) || 'ผู้เข้าชม', d = today_(), now = new Date().toISOString();
  const lock = LockService.getScriptLock(); lock.tryLock(8000);
  try {
    summary_();
    const P = sh_('Players', PHEAD); const v = P.getDataRange().getValues();
    let row = -1; for (let i = v.length - 1; i >= 1; i--) { if (v[i][0] === pid && String(v[i][10]) === d) { row = i + 1; break; } }
    const pts = Math.min(5000, Number(b.pts) || 0), st = Math.min(14, Number(b.stamps) || 0), lo = Math.min(5, Number(b.lotus) || 0), secs = Math.min(86400, Number(b.secs) || 0);
    if (row < 0) P.appendRow([pid, name, pts, st, lo, secs, 1, b.ua === 'mobile' ? 'mobile' : 'desktop', now, now, d]);
    else {
      const r = v[row - 1]; const isEnter = (b.events || []).some(x => x.ev === 'enter');
      P.getRange(row, 2, 1, 9).setValues([[name, Math.max(pts, Number(r[2]) || 0), Math.max(st, Number(r[3]) || 0), Math.max(lo, Number(r[4]) || 0), Math.max(secs, Number(r[5]) || 0), (Number(r[6]) || 1) + (isEnter ? 1 : 0), r[7], r[8], now]]);
    }
    const ev = (b.events || []).slice(0, 50).map(x => [clean_(x.t, 30) || now, pid, name, clean_(x.ev, 20), Number(x.b || '') || '', clean_(b.ex, 12)]);
    if (ev.length) { const E = sh_('Events', ['time', 'pid', 'name', 'ev', 'booth', 'ex']); E.getRange(E.getLastRow() + 1, 1, ev.length, 6).setValues(ev); }
  } finally { lock.releaseLock(); }
  return out_({ ok: true });
}

function doPost(e) {
  let b = {}; try { b = JSON.parse(e.postData.contents || '{}'); } catch (err) { return out_({ ok: false }); }
  if (b.action === 'log') return log_(b);
  if (b.action !== 'save') return out_({ ok: false });
  const name = clean_(b.name, 60); if (!name) return out_({ ok: false, error: 'name' });
  const p = String(b.p || '').split(',').map(x => parseInt(x, 10)).filter(x => x >= 1 && x <= 14).join(',');
  const theme = ['lotus', 'gold', 'night'].indexOf(b.theme) >= 0 ? b.theme : 'lotus';
  const id = Utilities.getUuid().slice(0, 8);
  const lock = LockService.getScriptLock(); lock.tryLock(5000);
  try { sheet_().appendRow([id, name, clean_(b.by, 60), p, theme, 0, new Date().toISOString(), 'show']); }
  finally { lock.releaseLock(); }
  return out_({ ok: true, id });
}
