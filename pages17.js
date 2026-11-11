/* =====================================================================
   12 Plus+ · pages17.js — หนังสือสินค้า → PDF (A4 แนวตั้ง 1 หน้า = 1 แผ่น)
   ปุ่ม "PDF" ในแถบหนังสือ → เปิดหน้าต่างพิมพ์ เลือก "บันทึกเป็น PDF"
   ===================================================================== */
(function(){
if(typeof bookView!=='function'||typeof bkFaces!=='function')return;
const css=`/* แก้หน้า 2 (บทนำ) ของหนังสือที่ชนกับคลาส .intro ของหน้าโหลด */
.pg.intro{position:absolute!important;inset:0!important;z-index:auto!important;display:flex!important;flex-direction:column;gap:2.2cqw;place-items:normal!important;background:#FBF8F1!important;opacity:1!important;visibility:visible!important;transition:none!important}
.pg.intro span,.pg.intro b{opacity:1!important;animation:none!important}
.pg.intro .eyebrow{letter-spacing:.14em!important;color:#B1832A!important;font-family:Kanit,Sarabun,system-ui,sans-serif!important}
.pg.intro .in-st b{font-style:normal!important;background:none!important;-webkit-background-clip:border-box!important;background-clip:border-box!important;color:#0F4A37!important;-webkit-text-fill-color:#0F4A37!important;font-family:var(--f-head)!important;font-size:clamp(12px,5cqw,28px)!important}
.pg.intro .in-st span,.pg.intro .in-how span{letter-spacing:normal!important;font-family:inherit!important;font-size:clamp(7px,2.1cqw,12px)!important;color:#6b7268!important}
.pg.intro .in-grid{flex:1 1 auto;display:flex;flex-wrap:wrap;justify-content:center;gap:1.8cqw;align-content:center;margin-top:.5cqw;min-height:0}.pg.intro .ig{flex:0 0 calc((100% - 6.6cqw)/4)}
.pg.intro .ig{position:relative;display:flex;flex-direction:column;align-items:center;text-align:center;gap:.4cqw;padding:1.4cqw 1cqw 1.2cqw;border-radius:3cqw;background:#fff;box-shadow:0 1cqw 3cqw -1.4cqw rgba(0,0,0,.18);border-bottom:.7cqw solid var(--pa)}
.pg.intro .ig i{width:12cqw;height:8.5cqw;background:center/contain no-repeat}
.pg.intro .ig b{position:absolute;top:1.4cqw;left:2cqw;font:600 clamp(7px,2cqw,12px) "IBM Plex Mono",monospace;color:var(--pa);opacity:1!important}
.pg.intro .ig span{font:500 clamp(7px,2.3cqw,13px)/1.25 Kanit,sans-serif!important;color:#24302a!important;letter-spacing:normal!important}
#bkPrint{display:none}
.pg.intro .in-map{flex:1 1 auto;min-height:70cqw;display:flex;justify-content:center;align-items:center}.pg.intro .in-map svg{height:100%;width:auto;max-width:100%;max-height:100%}
@media print{
  @page{size:A4 portrait;margin:0}
  html.bk-printing,html.bk-printing body{background:#fff!important;margin:0!important;padding:0!important;overflow:visible!important}
  html.bk-printing body>*:not(#bkPrint){display:none!important}
  html.bk-printing #bkPrint{display:block!important}
  #bkPrint .pp{position:relative;width:459px;height:649px;zoom:1.7298;overflow:hidden;container-type:inline-size;break-after:page;page-break-after:always;background:#FBF8F1;-webkit-print-color-adjust:exact;print-color-adjust:exact}
  #bkPrint .pp:last-child{break-after:auto;page-break-after:auto}
  #bkPrint .pp>.pg{position:absolute;inset:0;border-radius:0!important;box-shadow:none!important}
  #bkPrint .tap,#bkPrint .fx-dust,#bkPrint .in-how{display:none!important}
  #bkPrint *{animation:none!important;transition:none!important;-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}
  html.bk-spread #bkPrint .ps{width:420mm;height:297mm;display:flex;align-items:center;justify-content:center;break-after:page;page-break-after:always;background:radial-gradient(120% 90% at 50% 40%,#3a1530 0%,#1a0a14 70%);-webkit-print-color-adjust:exact;print-color-adjust:exact;overflow:hidden}
  html.bk-spread #bkPrint .ps:last-child{break-after:auto}
  html.bk-spread #bkPrint .bkw{display:flex;position:relative;zoom:.93;box-shadow:0 30px 60px -20px rgba(0,0,0,.7)}
  html.bk-spread #bkPrint .ps:not(.one) .bkw:after{content:"";position:absolute;left:50%;top:0;bottom:0;width:60px;transform:translateX(-50%);background:linear-gradient(90deg,rgba(0,0,0,0),rgba(0,0,0,.22) 45%,rgba(0,0,0,.32) 50%,rgba(0,0,0,.22) 55%,rgba(0,0,0,0));pointer-events:none;z-index:5}
  html.bk-spread #bkPrint .ps .pp{break-after:auto;page-break-after:auto}
}`;
const s=document.createElement('style');s.id='bkpdf-css';s.textContent=css;document.head.appendChild(s);

function build(mode){let el=document.getElementById('bkPrint');if(el)el.remove();
  el=document.createElement('div');el.id='bkPrint';el.setAttribute('aria-hidden','true');
  const F=bkFaces();const pg=f=>`<section class="pp">${f}</section>`;
  let ps=document.getElementById('bkpage');if(ps)ps.remove();
  if(mode==='spread'){ps=document.createElement('style');ps.id='bkpage';ps.textContent='@media print{@page{size:420mm 297mm;margin:0}}';document.head.appendChild(ps);document.documentElement.classList.add('bk-spread');const S=[[F[0]]];for(let i=1;i<F.length-1;i+=2)S.push([F[i],F[i+1]].filter(Boolean));if(F.length>1)S.push([F[F.length-1]]);
    el.innerHTML=S.map(s=>`<section class="ps${s.length<2?' one':''}"><div class="bkw">${s.map(pg).join('')}</div></section>`).join('')}
  else{document.documentElement.classList.remove('bk-spread');el.innerHTML=F.map(pg).join('')}
  document.body.appendChild(el);
  if(window.QRCode)el.querySelectorAll('.qr[data-qr]').forEach(q=>{q.innerHTML='';new QRCode(q,{text:q.dataset.qr,width:180,height:180,correctLevel:QRCode.CorrectLevel.M})});
  el.querySelectorAll('img').forEach(i=>{i.loading='eager';i.decoding='sync'});
  return el}
const ready=el=>Promise.all([document.fonts?document.fonts.ready:0,...[...el.querySelectorAll('img')].map(i=>i.complete?0:new Promise(r=>{i.onload=i.onerror=r})),
  ...[...el.querySelectorAll('[style*="background-image"]')].flatMap(d=>(d.style.backgroundImage.match(/url\(["']?([^"')]+)/g)||[]).map(u=>new Promise(r=>{const im=new Image();im.onload=im.onerror=r;im.src=u.replace(/^url\(["']?/,'')})))]);
let busy=false;
/* ย่อ/แปลงภาพเป็น JPEG ก่อนพิมพ์ ให้ไฟล์ PDF เล็ก (ภาพมีพื้นโปร่งใสคงไว้ตามเดิม) */
const JC={};
function toJpeg(u){if(JC[u])return JC[u];return JC[u]=new Promise(res=>{const im=new Image();im.crossOrigin='anonymous';im.onload=()=>{try{
    const s=Math.min(1,1400/Math.max(im.naturalWidth,im.naturalHeight));const w=Math.round(im.naturalWidth*s),h=Math.round(im.naturalHeight*s);
    const t=document.createElement('canvas');t.width=24;t.height=24;const tx=t.getContext('2d');tx.drawImage(im,0,0,24,24);const d=tx.getImageData(0,0,24,24).data;let al=false;for(let i=3;i<d.length;i+=4)if(d[i]<250){al=true;break}
    const s2=al?Math.min(1,420/Math.max(im.naturalWidth,im.naturalHeight)):s;const W=Math.round(im.naturalWidth*s2),H=Math.round(im.naturalHeight*s2);
    if(al&&s2>=1)return res(u);
    const c=document.createElement('canvas');c.width=W;c.height=H;c.getContext('2d').drawImage(im,0,0,W,H);c.toBlob(b=>res(b?URL.createObjectURL(b):u),al?'image/png':'image/jpeg',.82)}catch(e){res(u)}};im.onerror=()=>res(u);im.src=u})}
async function slim(el){const jobs=[];
  el.querySelectorAll('img').forEach(i=>{const u=i.getAttribute('src');if(u&&!/^data:|^blob:|\.svg/.test(u))jobs.push(toJpeg(u).then(n=>{i.src=n}))});
  el.querySelectorAll('[style*="background-image"]').forEach(d=>{const bg=d.style.backgroundImage;const us=[...bg.matchAll(/url\(["']?([^"')]+)["']?\)/g)].map(m=>m[1]);if(!us.length)return;
    jobs.push(Promise.all(us.map(u=>/^data:|^blob:|\.svg/.test(u)?u:toJpeg(u))).then(ns=>{let s=bg;us.forEach((u,k)=>{s=s.split(u).join(ns[k])});d.style.backgroundImage=s}))});
  await Promise.race([Promise.all(jobs),new Promise(r=>setTimeout(r,15000))])}
async function printBook(mode){if(busy)return;busy=true;const el=build(mode);const H=document.documentElement;H.classList.add('bk-printing');
  const t=document.title;document.title=L('หนังสือสินค้า 12Plus หนองบัวลำภู','12Plus Lookbook Nong Bua Lam Phu')+(mode==='spread'?L(' (กางคู่)',' (spread)'):'')+' – '+L('ข้อมูล ณ ','as of ')+(APP&&APP.asOf||'');
  const tip=document.getElementById('bkMsg');if(tip){tip.hidden=false;tip.textContent=L('กำลังเตรียมหนังสือ…','Preparing…')}
  try{await slim(el);await Promise.race([ready(el),new Promise(r=>setTimeout(r,12000))])}catch(e){}
  if(tip)tip.textContent=L('ในหน้าต่างพิมพ์: ปลายทาง = “บันทึกเป็น PDF” · ขอบ = ไม่มี · เปิด “กราฟิกพื้นหลัง”','In the print dialog: Save as PDF · Margins none · Background graphics on');
  const clean=()=>{H.classList.remove('bk-printing','bk-spread');document.title=t;el.remove();const ps=document.getElementById('bkpage');if(ps)ps.remove();busy=false;window.removeEventListener('afterprint',clean);if(tip)setTimeout(()=>tip.hidden=true,6000)};
  window.addEventListener('afterprint',clean);
  setTimeout(()=>{window.print();setTimeout(()=>{if(busy)clean()},1500)},200)}
window.BK_PDF={build,ready,printBook,slim};
/* เติมหน้าบทนำ: กริด 14 สินค้า (ภาพตัดพื้น) */
const _bf=bkFaces;bkFaces=function(){const F=_bf();const i=F.findIndex(f=>f.indexOf('class="pg intro"')>=0);
  if(i>=0&&F[i].indexOf('in-grid')<0){const g=`<div class="in-grid">${P.map(p=>`<div class="ig" style="--pa:${p.pa}"><i style="background-image:url(img/cut-${pad2(p.id)}.webp),url(img/icon-${pad2(p.id)}.webp)"></i><b>${pad2(p.id)}</b><span>${esc(pname(p))}</span></div>`).join('')}</div>`;
    const k=F[i].lastIndexOf('</div>');F[i]=F[i].slice(0,k)+g+F[i].slice(k)}
  return F};

const PDF_I=`<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M14 3v5h5M12 11v6m-3-3 3 3 3-3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const mcss=`.bkpdf{position:relative}.bkpdf>.bk-b{width:auto!important;padding:0 14px!important;font:600 12.5px Kanit,sans-serif;display:inline-flex;align-items:center;gap:6px}
.bkpdf-m{position:absolute;right:0;bottom:calc(100% + 10px);width:310px;padding:8px;border-radius:18px;background:var(--surface,#fff);color:var(--ink,#2C1A23);box-shadow:0 24px 50px -18px rgba(60,10,40,.45),0 2px 8px rgba(60,10,40,.08);border:1px solid var(--line,#eed6e2);z-index:50;display:grid;gap:4px}
.bkpdf-m[hidden]{display:none}
.bkpdf-m h6{margin:4px 8px 2px;font:600 11px Kanit,sans-serif;color:var(--muted,#8a6a78);letter-spacing:.04em}
.bkpdf-m button,.bkpdf-m a{display:grid;grid-template-columns:34px 1fr;gap:2px 10px;align-items:center;text-align:left;padding:9px 10px;border-radius:12px;border:0;background:none;color:inherit;font:inherit;cursor:pointer;text-decoration:none}
.bkpdf-m button:hover,.bkpdf-m a:hover{background:color-mix(in srgb,var(--pink-500,#E8559A) 9%,transparent)}
.bkpdf-m i{grid-row:span 2;width:34px;height:34px;border-radius:10px;display:grid;place-items:center;background:color-mix(in srgb,var(--pink-500,#E8559A) 12%,transparent);color:var(--pink-600,#C2185B);font-style:normal;font-size:16px}
.bkpdf-m b{font:600 13.5px Kanit,sans-serif}.bkpdf-m small{font-size:11.5px;color:var(--muted,#8a6a78);line-height:1.35}
.bkpdf-m .new{display:inline-block;margin-left:6px;padding:1px 7px;border-radius:99px;background:#1f9d55;color:#fff;font:600 10px Kanit,sans-serif;vertical-align:1px}
.bkpdf-m hr{border:0;border-top:1px dashed var(--line,#eed6e2);margin:2px 6px}
#bkMsg{position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:9999;max-width:min(560px,calc(100vw - 32px));padding:12px 18px;border-radius:14px;background:#2C1A23;color:#fff;font:500 13.5px Sarabun,sans-serif;box-shadow:0 16px 40px -12px rgba(0,0,0,.5)}
#bkMsg[hidden]{display:none}
@media print{#bkMsg{display:none!important}}`;
const ms=document.createElement('style');ms.textContent=mcss;document.head.appendChild(ms);
const _bv=bookView;bookView=function(box,startP){_bv(box,startP);const bar=box.querySelector('.bk-bar');if(!bar||bar.querySelector('.bkpdf'))return;
  if(!document.getElementById('bkMsg')){const m=document.createElement('div');m.id='bkMsg';m.hidden=true;m.setAttribute('role','status');document.body.appendChild(m)}
  const w=document.createElement('div');w.className='bkpdf';
  w.innerHTML=`<button type="button" class="bk-b sm" aria-haspopup="menu" aria-expanded="false" title="${L('บันทึก / ดาวน์โหลด PDF','Save / download PDF')}">${PDF_I}PDF</button>
  <div class="bkpdf-m" role="menu" hidden>
    <h6>${L('สร้างจากข้อมูลล่าสุดในแดชบอร์ด','From the latest dashboard data')}</h6>
    <button type="button" role="menuitem" data-pm="a4"><i>📄</i><b>${L('ทีละหน้า A4','A4 pages')}<span class="new">${L('ล่าสุด','live')}</span></b><small>${L('32 หน้า · เหมาะสำหรับสั่งพิมพ์','32 pages · print-ready')}</small></button>
    <button type="button" role="menuitem" data-pm="spread"><i>📖</i><b>${L('แบบกางคู่','Two-page spreads')}<span class="new">${L('ล่าสุด','live')}</span></b><small>${L('เหมือนหนังสือบนจอ · เหมาะเปิดอ่าน/ส่งต่อ','Looks like the on-screen book')}</small></button>
    <hr><h6>${L('ไฟล์สำเร็จรูป (ดาวน์โหลดทันที)','Ready-made files (instant)')}</h6>
    <a role="menuitem" href="book/lookbook-12plus.pdf" download><i>⬇</i><b>${L('PDF ทีละหน้า A4','A4 PDF')}</b><small>${L('ข้อมูล ณ วันที่จัดทำไฟล์','Data as of file date')}</small></a>
    <a role="menuitem" href="book/lookbook-12plus-spread.pdf" download><i>⬇</i><b>${L('PDF แบบกางคู่','Spread PDF')}</b><small>${L('ข้อมูล ณ วันที่จัดทำไฟล์','Data as of file date')}</small></a>
  </div>`;
  const bt=w.firstElementChild,mn=w.querySelector('.bkpdf-m');
  const tog=v=>{mn.hidden=!v;bt.setAttribute('aria-expanded',v)};
  bt.onclick=e=>{e.stopPropagation();tog(mn.hidden)};
  mn.addEventListener('click',e=>{const x=e.target.closest('[data-pm]');tog(false);if(x)printBook(x.dataset.pm)});
  document.addEventListener('click',e=>{if(!w.contains(e.target))tog(false)});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')tog(false)});
  const ref=bar.querySelector('#bkFs');bar.insertBefore(w,ref)};
})();

/* ---------- แก้หนังสือกระพริบบนมือถือ/แท็บเล็ต ----------
   1) แสดงเฉพาะหน้าที่มองเห็น (หน้าอื่นซ่อน) ลดจำนวนเลเยอร์ 3D ที่ GPU มือถือต้องวาด
   2) ไม่จัดหน้าใหม่เมื่อแถบที่อยู่ของเบราว์เซอร์ยืด/หด (ความสูงเปลี่ยนแต่ความกว้างเท่าเดิม)
   3) ปิดฝุ่นแสงเคลื่อนไหวและลดเงาบนจอสัมผัส */
(function(){
if(typeof bkGo!=='function'||typeof bkLayout!=='function')return;
const TOUCH=matchMedia('(hover:none),(pointer:coarse)').matches;
const st=document.createElement('style');st.textContent=`.spg.far,.leaf.far{visibility:hidden}
.spg,.leaf,.face{-webkit-transform-style:preserve-3d}
.face,.spg{-webkit-backface-visibility:hidden;backface-visibility:hidden}
@media (hover:none),(pointer:coarse){.bk-wrap>.fx-dust{display:none!important}.spg{box-shadow:0 12px 26px -16px rgba(0,0,0,.55)}.leaf.fl .pa-ph,.spg.cur .pa-ph{transform:none!important}.leaf:not(.fl) .face.front .pg::after{display:none}}`;
document.head.appendChild(st);
let tmr=null;
function cull(t,wait){clearTimeout(tmr);const run=()=>{
    if(BK.mode==='spread'){const L0=document.querySelectorAll('#bk .leaf');L0.forEach((lf,i)=>lf.classList.toggle('far',!(i===t-1||i===t)&&!lf.classList.contains('mv')))}
    else{const S=document.querySelectorAll('#bkSp .spg');S.forEach((pg,i)=>pg.classList.toggle('far',i<t-1||i>t+1))}};
  if(wait){/* ระหว่างพลิก: เปิดทุกหน้าที่อยู่ในช่วงที่เคลื่อน */
    if(BK.mode==='spread')document.querySelectorAll('#bk .leaf').forEach(l=>l.classList.remove('far'));
    else document.querySelectorAll('#bkSp .spg').forEach((pg,i)=>{if(Math.abs(i-t)<=Math.abs(wait.span)+1)pg.classList.remove('far')});
    tmr=setTimeout(run,wait.ms)}else run()}
const _go=bkGo;bkGo=function(t,instant){const prev=BK.cur;
  if(!instant&&t!==prev)cull(t,{span:t-prev,ms:Math.min(4000,1100+Math.abs(t-prev)*90)});
  _go(t,instant);if(instant||t===prev)cull(t)};
let lastK='',lastPW='',lastEl=null;const _ly=bkLayout;bkLayout=function(){const w=document.getElementById('bkWrap'),st=document.getElementById('bkStage');
  const fs=w&&(document.fullscreenElement===w||w.classList.contains('fs'));const K=st?st.clientWidth+'x'+innerWidth:'';
  /* จอสัมผัส: ถ้าความกว้างเท่าเดิม (แค่แถบที่อยู่ยืด/หด) ไม่ต้องจัดหน้าใหม่ */
  if(TOUCH&&w&&!fs&&w===lastEl&&K===lastK&&lastPW){if(w.style.getPropertyValue('--pw')!==lastPW)w.style.setProperty('--pw',lastPW);return}
  _ly();if(w){lastEl=w;lastK=K;lastPW=w.style.getPropertyValue('--pw')}};
})();
