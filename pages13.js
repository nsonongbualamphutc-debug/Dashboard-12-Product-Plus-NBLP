/* ---------- แหล่งซื้อ: รวมร้านค้า กลุ่มผู้ผลิต แบรนด์ ช่องทาง จากตารางข้อมูลจริง ---------- */
(function(){
if(typeof P==='undefined'||typeof DATASETS==='undefined')return;
const nz=s=>String(s||'').toLowerCase().replace(/[\s​"'“”.,()\-_/]+/g,'');
const PERSON=/^(นาย|นาง|นางสาว|น\.ส\.|ด\.ช\.|ด\.ญ\.)\s*\S/;
const GENERIC=/^(หน้าบ้าน|บ้าน|ตลาด|-|–|ไม่มี|ร้านค้า)$/;
const PLAT=/^(facebook|fb|เพจ\s*fb|เพจ facebook|เพจ|shopee|lazada|tiktok|line|line oa|website|เว็บไซต์|instagram|ig|youtube)/i;
const ROLE={prod:['กลุ่มผู้ผลิต','Producer'],brand:['แบรนด์','Brand'],outlet:['จุดจำหน่าย','Outlet'],online:['ออนไลน์','Online']};
function roleOf(item){
  if(/กิจกรรม|หน่วยงาน|ผู้รับซื้อ|ตลาดเป้าหมาย|ได้รับการส่งเสริม|อบรม|ผู้ส่งออก/.test(item))return null;
  if(/ออนไลน์/.test(item))return'online';
  if(/แบรนด์|ตราสินค้า/.test(item))return'brand';
  if(/ช่องทาง|ตลาด|จุด|แหล่งจำหน่าย|เขียง|ร้านกาแฟ/.test(item))return'outlet';
  if(/กลุ่ม|วิสาหกิจ|สหกรณ์|ฟาร์ม|สถานประกอบการ|โรงสี|โรงคั่ว|ผู้ผลิต/.test(item))return'prod';
  return null}
const ci=(C,re,ex)=>C.findIndex(c=>re.test(c)&&!(ex&&ex.test(c)));
function gpsOf(v){const m=String(v||'').match(/(1[5-9]\.\d{3,})\s*,\s*(10[0-4]\.\d{3,})/);return m?[+m[1],+m[2]]:null}
const isUrl=v=>/^https?:\/\//i.test(String(v||'').trim());
let CACHE={};
function dirOf(p){if(CACHE[p.id])return CACHE[p.id];
  const M=new Map();
  DATASETS.filter(d=>d.pid===p.id&&d.list&&d.list.rows&&d.list.rows.length).forEach(d=>{
    const role=roleOf(d.item);if(!role)return;const C=d.list.cols;
    const iN=ci(C,/^รายชื่อ/,/ผู้รับซื้อ/),iA=ci(C,/ที่อยู่|ที่ตั้ง|สถานที่/),iG=ci(C,/พิกัด|GPS/i),iP=ci(C,/ชนิดผลิตภัณฑ์|^ผลิตภัณฑ์|ชนิดสินค้า|ประเภทการแปรรูป|ชนิด\/ประเภท/),iT=ci(C,/^ประเภท \(/),iH=ci(C,/วัน.*เวลา|เปิดทำการ/),iM=ci(C,/จำนวนสมาชิก/),iO=C.indexOf('กลุ่ม'),iD=C.indexOf('อำเภอ');
    if(iN<0)return;
    d.list.rows.forEach(r=>{let name=r[iN],plat=iT>=0?r[iT]:'';
      if(typeof name!=='string')return;name=name.trim();
      if(PLAT.test(name)&&plat&&!PLAT.test(String(plat))){const t=name;name=String(plat).trim();plat=t}
      if(!name||GENERIC.test(name)||PERSON.test(name)||name.length<2)return;
      const url=r.find(v=>isUrl(v));const addr=iA>=0&&r[iA]&&!isUrl(r[iA])?String(r[iA]).trim():'';
      const g=iG>=0?gpsOf(r[iG]):null;const dist=iD>=0?r[iD]||'':'';
      const key=nz(name)+'|'+(role==='online'?'':nz(dist));
      let e=M.get(key);if(!e){e={name,roles:new Set(),dist,addr:'',gps:null,link:'',plat:'',prods:new Set(),hours:'',members:null,owner:'',codes:new Set(),year:0};M.set(key,e)}
      e.roles.add(role);e.codes.add(d.code);e.year=Math.max(e.year,+r[0]||0);
      if(addr&&addr.length>e.addr.length)e.addr=addr;if(g&&!e.gps)e.gps=g;if(url&&!e.link)e.link=String(url).trim();
      if(plat&&!e.plat&&typeof plat==='string')e.plat=plat.trim();
      if(iP>=0&&r[iP])String(r[iP]).split(/[,،\n]/).map(x=>x.trim()).filter(x=>x&&x!=='-').forEach(x=>e.prods.add(x));
      if(iH>=0&&r[iH]&&!e.hours)e.hours=String(r[iH]);if(iM>=0&&+r[iM])e.members=+r[iM];if(iO>=0&&r[iO]&&!e.owner)e.owner=String(r[iO]);
      if(!e.dist&&dist)e.dist=dist})});
  // ผสานรายการออนไลน์เข้ากับชื่อเดียวกันที่มีที่ตั้ง
  const L=[...M.values()];const out=[];
  L.forEach(e=>{if(e.roles.has('online')&&e.roles.size===1){const t=L.find(x=>x!==e&&nz(x.name)===nz(e.name)&&!x.roles.has('online'));if(t){t.roles.add('online');t.link=t.link||e.link;t.plat=t.plat||e.plat;e.codes.forEach(c=>t.codes.add(c));return}}out.push(e)});
  const goodA=a=>!!a&&a.length>=8&&(/\d/.test(a)||/ต\.|ตำบล|อ\.|อำเภอ|ถนน|ถ\./.test(a));
  out.forEach(e=>{e.loc=!!(e.gps||e.addr);const onl=e.roles.has('online')&&e.roles.size===1;
    e.miss=onl?(e.link?[]:['link']):[...(goodA(e.addr)?[]:['addr']),...(e.gps?[]:['gps'])];
    e.ok=onl?!!e.link:goodA(e.addr)||(!!e.gps&&!!e.addr);
    e.score=(e.ok?100:0)+(e.gps?30:0)+(e.link?20:0)+(e.addr?10:0)+(e.roles.has('outlet')?8:0)+(e.roles.has('prod')?6:0)+(e.roles.has('brand')?4:0)+e.prods.size});
  out.sort((a,b)=>b.score-a.score||a.name.localeCompare(b.name,'th'));
  return CACHE[p.id]=out}
window.SHOP_DIR=dirOf;
const navUrl=e=>'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(e.gps?e.gps.join(','):[e.name,e.addr||'',e.dist?'อ.'+e.dist:'','หนองบัวลำภู'].filter(Boolean).join(' '));
const platName=e=>{const u=e.link||'';return /facebook|fb\./i.test(u)?'Facebook':/shopee/i.test(u)?'Shopee':/lazada/i.test(u)?'Lazada':/tiktok/i.test(u)?'TikTok':/line\.me|lin\.ee/i.test(u)?'LINE':/instagram/i.test(u)?'Instagram':e.plat||(u?'Website':'')};
/* เติม SHOPS ให้สื่อนำเสนอและการ์ดเด่น: ร้านที่กรอกเอง + รายการที่ข้อมูลครบที่สุด (รวมไม่เกิน 6) */
window.SHOPS0=window.SHOPS0||JSON.parse(JSON.stringify(SHOPS));
P.forEach(p=>{const base=(SHOPS0[p.id]||[]).slice();const have=new Set(base.map(s=>nz(s.nick))).add('');base.forEach(s=>have.add(nz(s.name)));
  dirOf(p).filter(e=>e.ok&&!have.has(nz(e.name))).slice(0,Math.max(0,6-base.length)).forEach(e=>{have.add(nz(e.name));
    const fb=/facebook/i.test(e.link)?e.link:'';
    base.push({nick:e.name,name:[...e.roles].map(r=>ROLE[r][0]).join(' · ')+(e.prods.size?' · '+[...e.prods].slice(0,3).join(', '):''),addr:e.addr||(e.dist?'อ.'+e.dist+' จ.หนองบัวลำภู':'จ.หนองบัวลำภู'),tel:'',line:'',fb:fb||'',fbName:fb?e.name:'',ig:'',map:e.gps?e.gps.join(','):[e.name,e.addr,'หนองบัวลำภู'].filter(Boolean).join(' '),web:fb?'':e.link,auto:1})});
  if(base.length)SHOPS[p.id]=base});
/* ---------- ไดเรกทอรีบนหน้าสินค้า ---------- */
const css=`.sdir{margin-top:20px;border-top:1px dashed var(--line);padding-top:18px}
.sdir-h{display:flex;flex-wrap:wrap;align-items:end;justify-content:space-between;gap:10px;margin-bottom:12px}
.sdir-h h4{margin:0;font:600 17px/1.3 var(--f-head)}
.sdir-h p{margin:3px 0 0;color:var(--muted);font-size:13px}
.sdir-st{display:flex;gap:14px;flex-wrap:wrap;font-size:13px;color:var(--muted)}
.sdir-st b{color:var(--ink);font-weight:600}
.sdir-f{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-bottom:12px}
.sdir-f button{font:inherit;font-size:12.5px;padding:6px 12px;border-radius:99px;border:1px solid var(--line);background:var(--surface);color:var(--ink);cursor:pointer}
.sdir-f button[aria-pressed="true"]{background:var(--pa);border-color:var(--pa);color:#fff}
.sdir-f button b{opacity:.7;margin-left:4px;font-weight:600}
.sdir-f select,.sdir-f input{font:inherit;font-size:13px;padding:7px 11px;border-radius:12px;border:1px solid var(--line);background:var(--surface);color:var(--ink);max-width:100%}
.sdir-f input{flex:1 1 180px}
.sdir-g{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:12px}
.sdc{border:1px solid var(--line);border-radius:14px;background:var(--surface);padding:13px 14px;display:flex;flex-direction:column;gap:7px;min-width:0}
.sdc h5{margin:0;font:600 15px/1.35 var(--f-head);overflow-wrap:anywhere}
.sdc .rl{display:flex;flex-wrap:wrap;gap:4px}
.sdc .rl span{font-size:11px;padding:2px 8px;border-radius:99px;background:color-mix(in srgb,var(--pa) 14%,var(--surface));color:var(--ink)}
.sdc .rl .sdst{margin-left:auto;display:inline-flex;align-items:center;gap:5px;background:none;padding:2px 0;color:var(--muted)}
.sdc .rl .sdst i{width:8px;height:8px;border-radius:50%;display:inline-block}
.sdc .ln{font-size:12.5px;color:var(--muted);margin:0;line-height:1.45;overflow-wrap:anywhere}
.sdc .ln b{color:var(--ink);font-weight:500}
.sdc .bt{display:flex;gap:6px;flex-wrap:wrap;margin-top:auto;padding-top:4px}
.sdc .bt a,.sdc .bt button{font:inherit;font-size:12.5px;padding:6px 11px;border-radius:99px;border:1px solid var(--line);background:var(--surface-2);color:var(--ink);text-decoration:none;cursor:pointer;display:inline-flex;align-items:center;gap:5px}
.sdc .bt a.pri{background:var(--pa);border-color:var(--pa);color:#fff}
.sdir-more{display:block;margin:14px auto 0}
.sqr{display:grid;justify-items:center;gap:10px;padding:22px 26px;text-align:center}
.sqr h3{margin:0;font:600 18px/1.35 var(--f-head)}
.sqr .q{background:#fff;padding:12px;border-radius:14px;border:1px solid var(--line)}
.sqr .sw{display:flex;gap:6px}
.sqr .sw button{font:inherit;font-size:13px;padding:6px 12px;border-radius:99px;border:1px solid var(--line);background:var(--surface);cursor:pointer;color:var(--ink)}
.sqr .sw button[aria-pressed="true"]{background:var(--pa,#c2386f);color:#fff;border-color:transparent}
.sqr small{color:var(--muted);max-width:320px;overflow-wrap:anywhere}
@media print{.sdir-f,.sdc .bt{display:none}}`;
function card(e,i){const st=e.ok?['#1f9d55',L('ข้อมูลครบ','Complete')]:['#e0a800',L('ข้อมูลบางส่วน','Partial')];
  return`<article class="sdc"><div class="rl">${[...e.roles].map(r=>`<span>${L(...ROLE[r])}</span>`).join('')}<span class="sdst"><i style="background:${st[0]}"></i>${st[1]}</span></div>
  <h5>${esc(e.name)}</h5>
  ${e.addr?`<p class="ln">${ic('map')} ${esc(e.addr)}</p>`:e.dist?`<p class="ln">${ic('map')} อ.${esc(e.dist)}</p>`:''}
  ${e.prods.size?`<p class="ln"><b>${L('สินค้า','Products')}:</b> ${esc([...e.prods].slice(0,6).join(', '))}</p>`:''}
  ${e.owner?`<p class="ln"><b>${L('กลุ่ม','Group')}:</b> ${esc(e.owner)}</p>`:''}
  ${e.hours?`<p class="ln"><b>${L('เปิด','Open')}:</b> ${esc(e.hours)}</p>`:''}
  ${e.ok?'':`<p class="ln" style="color:#a86b00"><b style="color:inherit">${L('ยังขาด','Missing')}:</b> ${e.miss.map(k=>({link:L('ลิงก์ร้านออนไลน์','store link'),addr:L('ที่อยู่','address'),gps:L('พิกัด GPS','GPS')})[k]).join(', ')}</p>`}
  ${e.members?`<p class="ln"><b>${L('สมาชิก','Members')}:</b> ${nf.format(e.members)} ${L('คน','people')}</p>`:''}
  <div class="bt">${e.loc?`<a class="pri" href="${navUrl(e)}" target="_blank" rel="noopener">${L('นำทาง','Navigate')} ${ic('ext')}</a>`:''}${e.link?`<a href="${esc(e.link)}" target="_blank" rel="noopener">${esc(platName(e))} ${ic('ext')}</a>`:''}${e.loc||e.link?`<button type="button" data-sqr="${i}">QR</button>`:''}</div></article>`}
function qrDlg(p,e){const opts=[];if(e.loc)opts.push(['nav',L('นำทาง','Navigate'),navUrl(e)]);if(e.link)opts.push(['link',platName(e),e.link]);
  const o=overlay(`<div class="sqr" style="--pa:${p.pa}"><h3>${esc(e.name)}</h3><div class="q" id="sqrQ"></div><small id="sqrC"></small>${opts.length>1?`<div class="sw">${opts.map((x,i)=>`<button type="button" data-k="${i}" aria-pressed="${i===0}">${esc(x[1])}</button>`).join('')}</div>`:''}<button class="btn btn-o sm" type="button" data-close>${L('ปิด','Close')}</button></div>`);
  const draw=i=>{const q=$('#sqrQ',o);q.innerHTML='';if(window.QRCode)new QRCode(q,{text:opts[i][2],width:220,height:220,correctLevel:QRCode.CorrectLevel.M});$('#sqrC',o).textContent=L('สแกนเพื่อ','Scan to ')+(opts[i][0]==='nav'?L('นำทางไปยังร้าน','navigate'):L('เปิด ','open ')+opts[i][1]);$$('.sw button',o).forEach(b=>b.setAttribute('aria-pressed',+b.dataset.k===i))};
  $$('.sw button',o).forEach(b=>b.onclick=()=>draw(+b.dataset.k));draw(0)}
function mount(page,p){const sec=$('#shops',page);if(!sec||$('.sdir',sec))return;
  if(!document.getElementById('sdir-css')){const s=document.createElement('style');s.id='sdir-css';s.textContent=css;document.head.appendChild(s)}
  const D=dirOf(p);const note=$('.card-h .note',sec);
  const ok=D.filter(e=>e.ok).length;
  if(note)note.textContent=D.length?L(`${D.length} รายการจากตารางข้อมูล · ครบ ${ok} · บางส่วน ${D.length-ok}`,`${D.length} listings · ${ok} complete`):L('รอข้อมูลร้านค้าจากหน่วยงาน','Awaiting shop data');
  if(!D.length)return;
  const cnt={};D.forEach(e=>e.roles.forEach(r=>cnt[r]=(cnt[r]||0)+1));const dists=[...new Set(D.map(e=>e.dist).filter(Boolean))];
  sec.insertAdjacentHTML('beforeend',`<div class="sdir" style="--pa:${p.pa}"><div class="sdir-h"><div><h4>${L('รายชื่อทั้งหมด · ร้านค้า กลุ่มผู้ผลิต แบรนด์ และช่องทางจำหน่าย','All listings · shops, producers, brands and channels')}</h4><p>${L('รวบรวมจากตารางข้อมูลของหน่วยงาน · กด QR เพื่อสแกนนำทางหรือเปิดเพจ','Compiled from agency tables · tap QR to scan')}</p></div>
    <div class="sdir-st"><span><i class="sdot real" style="display:inline-block;vertical-align:middle"></i> ${L('ข้อมูลครบ','Complete')} <b>${ok}</b></span><span>${L('ข้อมูลบางส่วน','Partial')} <b>${D.length-ok}</b></span></div></div>
    <div class="sdir-f"><button type="button" data-r="" aria-pressed="true">${L('ทั้งหมด','All')}<b>${D.length}</b></button>${Object.keys(ROLE).filter(r=>cnt[r]).map(r=>`<button type="button" data-r="${r}" aria-pressed="false">${L(...ROLE[r])}<b>${cnt[r]}</b></button>`).join('')}
      ${dists.length>1?`<select data-d aria-label="${L('อำเภอ','District')}"><option value="">${L('ทุกอำเภอ','All districts')}</option>${dists.map(d=>`<option>${esc(d)}</option>`).join('')}</select>`:''}<input type="search" data-q placeholder="${L('ค้นหาชื่อร้าน กลุ่ม สินค้า','Search name or product')}"></div>
    <div class="sdir-g"></div><button class="btn btn-o sm sdir-more" type="button" hidden>${L('แสดงเพิ่ม','Show more')}</button></div>`);
  const box=$('.sdir',sec),g=$('.sdir-g',box),more=$('.sdir-more',box);let r='',d='',q='',lim=12,F=[];
  const draw=()=>{F=D.filter(e=>(!r||e.roles.has(r))&&(!d||e.dist===d)&&(!q||nz(e.name+' '+e.addr+' '+[...e.prods].join(' ')+' '+e.owner).includes(nz(q))));
    g.innerHTML=F.slice(0,lim).map((e,i)=>card(e,i)).join('')||`<p class="note">${L('ไม่พบรายการ','No match')}</p>`;more.hidden=F.length<=lim;more.textContent=L(`แสดงเพิ่ม (${F.length-lim})`,`Show more (${F.length-lim})`)};
  $$('[data-r]',box).forEach(b=>b.onclick=()=>{r=b.dataset.r;lim=12;$$('[data-r]',box).forEach(x=>x.setAttribute('aria-pressed',x===b));draw()});
  const sd=$('[data-d]',box);if(sd)sd.onchange=()=>{d=sd.value;lim=12;draw()};
  $('[data-q]',box).oninput=e=>{q=e.target.value.trim();lim=12;draw()};
  more.onclick=()=>{lim+=24;draw()};
  g.onclick=e=>{const b=e.target.closest('[data-sqr]');if(b)qrDlg(p,F[+b.dataset.sqr])};
  draw()}

/* ---------- ตัวเลขสำคัญจากข้อมูลจริง สำหรับสื่อนำเสนอ ---------- */
const PRI=[/พื้นที่(เพาะปลูก|ผลิต|ปลูก)|พื้นที่เพาะเลี้ยง/,/^จำนวน(เกษตรกร|ช่างทอ)|ผู้เลี้ยง|ผู้ปลูก|ผู้เพาะ/,/^จำนวน(กระบือ|โคเนื้อ|ไก่|ว่าน)/,/ปริมาณผลผลิต|ผลผลิต.*รวม|ผลิตได้/,/มูลค่า.*จำหน่าย|มูลค่าการซื้อขาย/,/ราคา/,/กลุ่ม|วิสาหกิจ/,/แบรนด์|ตราสินค้า/,/ช่องทาง/];
const SFX2=/ \(([^()]+)\)$/;
function figOf(d,ds){const R=(ds.rows||[]).filter(r=>typeof r[3]==='number'&&r[3]);
  if(!R.length){if(ds.list&&ds.list.rows.length)return{v:ds.list.rows.length,u:ds.unit||'รายการ',y:Math.max(...ds.list.rows.map(r=>+r[0]||0))};return null}
  const ly=Math.max(...R.map(r=>r[0]));let L0=R.filter(r=>r[0]===ly);let u=ds.unit;let t='';
  const sx=[...new Set(L0.map(r=>(String(r[2]).match(SFX2)||[])[1]).filter(Boolean))];
  if(sx.length>1||u==='หน่วย'){const t0=L0[0][2];L0=L0.filter(r=>r[2]===t0);t=String(t0).replace(SFX2,'');u=(String(t0).match(SFX2)||[])[1]||u}
  if(ds.agg==='avg'||/ราคา|เฉลี่ย|ต้นทุน/.test(d.n)){const ts=[...new Set(L0.map(r=>r[2]))];if(ts.length>1){t=String(ts[0]);L0=L0.filter(r=>r[2]===ts[0])}return{v:L0.reduce((a,r)=>a+r[3],0)/L0.length,u,y:ly,t,avg:1}}
  return{v:L0.reduce((a,r)=>a+r[3],0),u,y:ly,t}}
window.KEYFIGS=function(p,n){const DSI={};DATASETS.forEach(x=>DSI[x.code]=x);const out=[],used=new Set();
  PRI.forEach(re=>{const d=p.inds.find(d=>!used.has(d.code)&&re.test(d.n)&&DSI[d.code]);if(!d)return;const f=figOf(d,DSI[d.code]);if(f&&f.v){used.add(d.code);out.push(Object.assign({n:d.n,code:d.code},f))}});
  p.inds.forEach(d=>{if(out.length>=(n||8)||used.has(d.code)||!DSI[d.code])return;const f=figOf(d,DSI[d.code]);if(f&&f.v){used.add(d.code);out.push(Object.assign({n:d.n,code:d.code},f))}});
  return out.slice(0,n||8)};
const fmtV=f=>(f.v>=1e6?(f.v/1e6).toLocaleString('th-TH',{maximumFractionDigits:2})+' ล้าน':f.v%1&&f.v<100?f.v.toLocaleString('th-TH',{maximumFractionDigits:2}):nf.format(Math.round(f.v)));
const css2=`.a4-fig{width:100%;border-collapse:collapse;font-size:11.5px;margin:2px 0 6px}
.a4-fig td{border-bottom:1px solid var(--line);padding:3px 4px;vertical-align:top}
.a4-fig td.v{text-align:right;white-space:nowrap;font-weight:600}
.a4-fig .y{font-weight:400;color:var(--muted);white-space:nowrap;font-size:10.5px}
.a4-sh{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin-top:4px}
.a4-sh div{border:1px solid var(--line);border-radius:8px;padding:6px;display:grid;grid-template-columns:64px minmax(0,1fr);gap:6px;align-items:center;font-size:10.5px;line-height:1.3}
.a4-sh .a4q{display:block;width:64px;height:64px;min-width:64px;background:#fff;overflow:hidden}.a4-sh .a4q img{display:block!important;width:64px!important;height:64px!important;max-width:none!important}.a4-sh .a4q canvas{display:none!important}
.a4-sh b{font-size:11px;display:block;overflow-wrap:anywhere}
.pr-fig{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:12px}
.pr-fig div{border:1px solid var(--line);border-radius:16px;padding:14px 16px;background:var(--surface)}
.pr-fig b{display:block;font:600 26px/1.15 var(--f-head);color:var(--pa)}
.pr-fig small{display:block;color:var(--muted);font-size:12px;margin-top:2px}
.pr-fig span{display:block;font-size:13px;margin-top:6px;line-height:1.4}`;
const _br=PAGE_R.brief;PAGE_R.brief=page=>{_br(page);const v=$('#bv',page);if(!v)return;
  if(!document.getElementById('sdir-css2')){const s=document.createElement('style');s.id='sdir-css2';s.textContent=css2;document.head.appendChild(s)}
  const pid=+(R.q&&R.q.get('p'))||store.sget('nbl12-brief',1),p=byId(pid)||P[0];const F=KEYFIGS(p,10);
  if(v.classList.contains('bv-brief')){const g=$('.a4-g',v);if(g){const hs=$$('h4',g).find(h=>/ข้อมูลจากหน่วยงาน|Agency data/.test(h.textContent));
      if(hs){const ul=hs.nextElementSibling;if(ul&&ul.tagName==='UL')ul.remove();hs.textContent=L('ตัวเลขสำคัญ (ข้อมูลจริงจากหน่วยงาน)','Key figures (agency data)');
        hs.insertAdjacentHTML('afterend',`<table class="a4-fig"><tbody>${F.map(f=>`<tr><td>${esc(f.n)}${f.t?` <span style="color:var(--muted)">(${esc(f.t)})</span>`:''}</td><td class="v">${fmtV(f)} ${esc(uLab(f.u))}${f.avg?L(' เฉลี่ย',' avg'):''}<br><span class="y">${L('ปี','')} ${yCE(f.y)}</span></td></tr>`).join('')}</tbody></table>`)}}
    const sh=(SHOPS[p.id]||[]).slice(0,3);const ft=$('.a4-f',v);
    if(sh.length&&ft&&!$('.a4-sh',v)){ft.insertAdjacentHTML('beforebegin',`<div><h4 style="font-family:var(--f-head);font-size:12.5px;margin:10px 0 4px;color:var(--pa)">${L('แหล่งซื้อ · สแกนนำทาง','Where to buy · scan to navigate')}</h4><div class="a4-sh">${sh.map((s,i)=>`<div><span class="a4q" id="a4q${i}"></span><span><b>${esc(s.nick)}</b>${esc(s.addr||'')}</span></div>`).join('')}</div></div>`);
      if(window.QRCode)sh.forEach((s,i)=>new QRCode(document.getElementById('a4q'+i),{text:mapUrl(s),width:128,height:128,correctLevel:QRCode.CorrectLevel.L}))}}
  if(v.classList.contains('bv-promo')&&F.length&&!$('#pr-fig',v)){const s=$('#pr-shops',v);if(s){s.insertAdjacentHTML('beforebegin',`<section class="pr-sec" id="pr-fig"><div class="pr-h"><span class="pr-n">★</span><div><span class="eyebrow">Key figures</span><h3>${L('ตัวเลขสำคัญจากหน่วยงาน','Key figures from agencies')}</h3></div></div>
      <div class="pr-fig">${F.slice(0,8).map(f=>`<div><b>${fmtV(f)}</b><small>${esc(uLab(f.u))}${f.avg?L(' (เฉลี่ย)',' (avg)'):''} · ${L('ปี','')} ${yCE(f.y)}</small><span>${esc(f.n)}${f.t?' · '+esc(f.t):''}</span></div>`).join('')}</div></section>`);
      let n=1;$$('.pr-n',v).forEach(e=>{if(e.textContent!=='★')e.textContent=pad2(n++)})}}};

const _pr=PAGE_R.product;PAGE_R.product=(page,p)=>{_pr(page,p);try{mount(page,p)}catch(e){console.error(e)}};
/* การ์ดเด่นที่สร้างอัตโนมัติ: เว็บไซต์/ช่องทางออนไลน์ที่ไม่ใช่ Facebook */
if(typeof shopCard==='function'){const _sc=shopCard;shopCard=function(p,s,k){let h=_sc(p,s,k);if(s.auto){h=h.replace('ร้านแนะนำ · ','ข้อมูลจากหน่วยงาน · ');if(s.web)h=h.replace('<li><b>IG</b><span>–</span></li>',`<li><b>${L('ลิงก์','Link')}</b><span><a href="${esc(s.web)}" target="_blank" rel="noopener">${L('เปิดร้านออนไลน์','Open store')} ${ic('ext')}</a></span></li>`)}return h}}
})();
