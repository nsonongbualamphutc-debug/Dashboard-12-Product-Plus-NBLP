/* =====================================================================
   12 Plus+ · pages19.js — ใช้ง่ายสำหรับทุกคน (ผู้สูงอายุ / ไม่คุ้นคอมพิวเตอร์)
   1 แถบบนเรียบง่าย + คำกำกับ + เมนูเจ้าหน้าที่   2 ปุ่มขยายตัวอักษร ก ก+ ก++
   3 อธิบายศัพท์ (แตะคำที่ขีดเส้นประ)             4 ปุ่มลัดหน้าแรก "อยากทำอะไร"
   5 ทัวร์แนะนำครั้งแรก                          6 ปุ่มกลับ + บอกตำแหน่ง
   7 กราฟแบบง่าย (ซ่อนรายละเอียดไว้ใต้ "ดูละเอียด")  8 ปุ่ม/จุดแตะใหญ่
   9 อ่านออกเสียง                               10 ปุ่มติดต่อร้านชัดเจน
   11 ถามน้องกาบแก้วด้วยเสียง                     12 แจ้งเตือนเน็ตหลุด/โหลดช้า เป็นภาษาง่าย
   ===================================================================== */
(function boot(){
if(typeof R==='undefined'||!document.querySelector('header.top')||!document.getElementById('page')){boot.n=(boot.n||0)+1;if(boot.n<100)setTimeout(boot,100);return}
if(window.U19)return;
const HTML=document.documentElement;
const PC=matchMedia('(hover:hover) and (pointer:fine) and (min-width:761px)').matches;if(PC)HTML.classList.add('u19-pc');
const ls={get(k,d){try{const v=localStorage.getItem(k);return v==null?d:JSON.parse(v)}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const SV=(p,w=20)=>`<svg viewBox="0 0 24 24" width="${w}" height="${w}" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
const IC={back:SV('<path d="M15 5l-7 7 7 7"/>',22),staff:SV('<circle cx="12" cy="8" r="3.5"/><path d="M5 20c.8-3.6 3.6-5.5 7-5.5s6.2 1.9 7 5.5"/>'),
  aa:SV('<path d="M3 18 8 6l5 12M4.6 14h6.8"/><path d="M15 18l3-7.5 3 7.5M15.9 15.8h4.2"/>'),spk:SV('<path d="M4 9.5h3.5L12 5v14l-4.5-4.5H4z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/>'),
  stop:SV('<rect x="6" y="6" width="12" height="12" rx="2"/>'),mic:SV('<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/>')};

/* ---------- สไตล์ ---------- */
const css=`
/* 1) แถบบน */
html:not(.u19-pc) header.top .tb[data-act="edit"],html:not(.u19-pc) header.top .tb[data-act="kiosk"],html:not(.u19-pc) header.top .tb.api,html:not(.u19-pc) header.top .tb[data-act="link"],html:not(.u19-pc) header.top .tb[data-act="print"],html:not(.u19-pc) header.top .tb.lock,html:not(.u19-pc) header.top .tb[data-act="help"]{display:none!important}
html.u19-pc header.top .u19-staff{display:none!important}
header.top .tb[data-lab]{position:relative}
@media (min-width:761px){html:not(.u19-pc) header.top .tb.ic-only[data-lab],html:not(.u19-pc) header.top .tb.u19{width:auto!important;min-width:54px;height:56px!important;padding:5px 8px!important;display:inline-flex!important;flex-direction:column;align-items:center;justify-content:center;gap:2px}
  html:not(.u19-pc) header.top .tb.ic-only[data-lab]:after,html:not(.u19-pc) header.top .tb.u19:after{content:attr(data-lab);font:500 11px/1 Kanit,sans-serif;white-space:nowrap;opacity:.85}}
.u19-menu{position:fixed;z-index:2147482000;min-width:250px;padding:8px;border-radius:18px;background:var(--surface,#fff);color:var(--ink);box-shadow:0 24px 50px -18px rgba(60,10,40,.45);border:1px solid var(--line,#eed6e2);display:grid;gap:2px}
.u19-menu h6{margin:4px 10px 6px;font:600 11.5px Kanit,sans-serif;color:var(--muted)}
.u19-menu button,.u19-menu a{display:flex;align-items:center;gap:12px;padding:11px 12px;border-radius:12px;border:0;background:none;color:inherit;font:500 14.5px Kanit,sans-serif;text-decoration:none;cursor:pointer;text-align:left;min-height:46px}
.u19-menu button:hover,.u19-menu a:hover{background:var(--surface-3,#f6e8ef)}
.u19-menu .ic{width:20px;height:20px;flex:none}
/* 2) ขนาดตัวอักษร */
html[data-fz="1"] #page,html[data-fz="1"] #kk .kk-p{zoom:1.12}
html[data-fz="2"] #page,html[data-fz="2"] #kk .kk-p{zoom:1.25}
.u19-fz{display:flex;gap:6px;padding:4px}.u19-fz button{flex:1;justify-content:center;font-family:Kanit,sans-serif!important;border:1px solid var(--line)!important}
.u19-fz button[aria-pressed="true"]{background:var(--pink-500,#E8559A)!important;color:#fff!important;border-color:transparent!important}
.u19-fz button:nth-child(1){font-size:14px!important}.u19-fz button:nth-child(2){font-size:17px!important}.u19-fz button:nth-child(3){font-size:20px!important}
/* 3) อธิบายศัพท์ */
.gl{border-bottom:1.5px dotted currentColor;cursor:help;text-decoration:none}
.gl-pop{position:fixed;z-index:2147482500;max-width:min(320px,calc(100vw - 24px));padding:12px 14px;border-radius:14px;background:#2C1A23;color:#fff;font:15px/1.5 Sarabun,sans-serif;box-shadow:0 16px 40px -12px rgba(0,0,0,.5)}
.gl-pop b{display:block;font:600 15px Kanit,sans-serif;color:#FFB3D6;margin-bottom:2px}
/* 4) ปุ่มลัดหน้าแรก */
.qk{margin:18px 0 22px;padding:18px;border-radius:24px;background:var(--surface,#fff);border:1px solid var(--line);box-shadow:0 18px 40px -26px rgba(120,30,80,.45)}
.qk h2{margin:0 0 4px;font:600 clamp(20px,2.4vw,26px) Kanit,sans-serif;color:var(--ink)}
.qk p{margin:0 0 14px;color:var(--muted);font-size:15px}
.qk-g{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}
.qk-g a{display:flex;flex-direction:column;gap:6px;padding:18px 16px;border-radius:20px;text-decoration:none;color:#fff;min-height:128px;position:relative;overflow:hidden;box-shadow:0 14px 30px -18px rgba(0,0,0,.5);transition:transform .2s}
.qk-g a:hover{transform:translateY(-3px)}
.qk-g a i{font-style:normal;font-size:34px;line-height:1}
.qk-g a b{font:600 19px/1.2 Kanit,sans-serif}.qk-g a span{font-size:13.5px;opacity:.92;line-height:1.35}
.qk-g a:after{content:"›";position:absolute;right:14px;top:10px;font:600 28px Kanit,sans-serif;opacity:.6}
@media (max-width:760px){.qk{padding:14px;border-radius:20px}.qk-g{grid-template-columns:1fr 1fr;gap:10px}.qk-g a{min-height:112px;padding:14px}.qk-g a b{font-size:17px}}
/* 5) ทัวร์ */
.tour{position:fixed;inset:0;z-index:2147483400;pointer-events:auto}
.tour-hole{position:fixed;border-radius:16px;box-shadow:0 0 0 9999px rgba(15,5,12,.66),0 0 0 4px #FF8CC0;transition:all .35s cubic-bezier(.2,.8,.2,1);pointer-events:none}
.tour-c{position:fixed;width:min(340px,calc(100vw - 24px));padding:16px 16px 14px;border-radius:20px;background:var(--surface,#fff);color:var(--ink);box-shadow:0 30px 60px -20px rgba(0,0,0,.6);transition:all .35s cubic-bezier(.2,.8,.2,1)}
.tour-c .tw{display:flex;gap:12px;align-items:flex-start}.tour-c img{width:58px;height:58px;border-radius:50%;flex:none}
.tour-c b{display:block;font:600 17px Kanit,sans-serif;margin-bottom:2px}.tour-c p{margin:0;font-size:15px;line-height:1.5;color:var(--muted)}
.tour-c .tb2{display:flex;justify-content:space-between;align-items:center;margin-top:14px;gap:8px}
.tour-c .tb2>div{display:flex;gap:6px;align-items:center}.tour-c .tb2 span{font:500 13px Kanit,sans-serif;color:var(--muted)}
.tour-c button{border:0;border-radius:99px;padding:11px 18px;font:600 15px Kanit,sans-serif;cursor:pointer;min-height:44px}
.tour-c .nx{background:linear-gradient(135deg,#E8559A,#8E1F4A);color:#fff}.tour-c .sk{background:none;color:var(--muted)}
/* 6) ปุ่มกลับ + ตำแหน่ง */
.crumb{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin:4px 0 14px;font:500 14px Kanit,sans-serif;color:var(--muted)}
.crumb .bk{display:inline-flex;align-items:center;gap:4px;padding:9px 16px 9px 10px;min-height:44px;border-radius:99px;background:var(--surface,#fff);border:1px solid var(--line);color:var(--ink);font:600 15px Kanit,sans-serif;cursor:pointer;text-decoration:none;box-shadow:0 6px 16px -10px rgba(80,20,50,.4)}
.crumb nav{display:flex;align-items:center;gap:6px;flex-wrap:wrap;min-width:0}
.crumb nav a{color:inherit;text-decoration:none}.crumb nav a:hover{text-decoration:underline}
.crumb nav b{color:var(--ink);font-weight:600}
.crumb .sp{flex:1}
.crumb .say{display:inline-flex;align-items:center;gap:6px;padding:9px 14px;min-height:44px;border-radius:99px;border:1px solid var(--line);background:var(--surface,#fff);color:var(--ink);font:600 14px Kanit,sans-serif;cursor:pointer}
.crumb .say[aria-pressed="true"]{background:var(--pink-500,#E8559A);color:#fff;border-color:transparent}
/* 7) กราฟแบบง่าย */
.u19-pc .u19-adv{display:none!important}
html:not(.u19-pc) .stb:not(.adv) .stb-vm,html:not(.u19-pc) .stb:not(.adv) .tp-g,.stb:not(.adv) .tp-w{display:none!important}
.u19-adv{display:inline-flex;align-items:center;gap:6px;margin:10px 0 0;padding:8px 14px;min-height:40px;border-radius:99px;border:1px dashed color-mix(in srgb,var(--pa,#E8559A) 50%,transparent);background:none;color:var(--pa,#C2185B);font:600 13.5px Kanit,sans-serif;cursor:pointer}
html:not(.u19-pc) .tp-s{font-size:15.5px!important;line-height:1.7!important}
/* 8) จุดแตะใหญ่ (จอสัมผัส) */
@media (hover:none),(pointer:coarse){
  .stb-sl button,.sdir-f button,.pal-f button,.chip,.rs-f button,.kk-pg button,.kk-chips button{min-height:42px;padding-inline:14px!important;font-size:14px!important}
  .stb-tools button,.stb-tools a{min-width:44px;min-height:44px}
  .bnav a{min-height:56px}
}
/* 10) ติดต่อร้าน */
html:not(.u19-pc) .sdc a[href^="tel:"],html:not(.u19-pc) .shop a[href^="tel:"],.kk-shops a[href^="tel:"]{display:inline-flex;align-items:center;gap:6px;padding:8px 14px;min-height:42px;border-radius:99px;background:#1f9d55;color:#fff!important;font:600 14px Kanit,sans-serif;text-decoration:none!important}
html:not(.u19-pc) .sdc a[href*="line.me"],html:not(.u19-pc) .sdc a[href*="facebook.com"],.kk-shops a[href*="facebook.com"]{display:inline-flex;align-items:center;min-height:40px;padding:6px 12px;border-radius:99px;border:1px solid currentColor;text-decoration:none!important}
/* 11) ไมค์ */
.kk-mic{width:44px;height:44px;border-radius:50%;border:1px solid var(--line,#ecd0dd);background:var(--surface,#fff);color:#C2185B;display:grid;place-items:center;flex:none;cursor:pointer}
.kk-mic.on{background:#d64545;color:#fff;border-color:transparent;animation:kkPulse 1.2s infinite}
.kk-say{border:0;background:none;color:var(--muted,#8a6a78);cursor:pointer;padding:4px;margin-top:4px;display:inline-flex;align-items:center;gap:4px;font:500 12px Kanit,sans-serif}
/* 12) แจ้งเตือน */
.net{position:fixed;left:50%;top:max(12px,env(safe-area-inset-top));transform:translateX(-50%);z-index:2147483500;max-width:calc(100vw - 24px);padding:12px 18px;border-radius:14px;background:#2C1A23;color:#fff;font:500 15px Sarabun,sans-serif;box-shadow:0 16px 40px -12px rgba(0,0,0,.5);display:flex;gap:10px;align-items:center}
.net button{border:0;border-radius:99px;padding:8px 14px;background:#fff;color:#2C1A23;font:600 14px Kanit,sans-serif;white-space:nowrap}
@media (max-width:760px){header.top .tb[data-act="bell"],header.top .tb[data-act="theme"],header.top .u19-staff{display:none!important}
  .crumb{gap:8px;flex-wrap:nowrap;margin-bottom:10px}.crumb nav{flex-wrap:nowrap;overflow:hidden;white-space:nowrap;font-size:13.5px}.crumb nav>a:first-child,.crumb nav>a:first-child+*{display:none}
  .crumb .say{padding:9px 12px;font-size:0;gap:0}.crumb .say svg{width:22px;height:22px}.crumb .sp{display:none}}
@media print{.qk,.crumb,.tour,.u19-adv,.net{display:none!important}}`;
const st=document.createElement('style');st.id='p19-css';st.textContent=css;document.head.appendChild(st);

/* ---------- 1) แถบบน ---------- */
const top=document.querySelector('header.top .ctrls:last-child');
const lab={search:L('ค้นหา','Search'),lang:'',theme:L('สีพื้น','Theme'),bell:L('แจ้งเตือน','Alerts')};
top&&top.querySelectorAll('.tb[data-act]').forEach(b=>{const k=b.dataset.act;if(lab[k])b.dataset.lab=lab[k]});
let menu=null;const closeMenu=()=>{if(menu){menu.remove();menu=null}};
function popMenu(anchor,html){closeMenu();menu=document.createElement('div');menu.className='u19-menu';menu.setAttribute('role','menu');menu.innerHTML=html;document.body.appendChild(menu);
  const r=anchor.getBoundingClientRect(),w=menu.offsetWidth;menu.style.top=(r.bottom+8)+'px';menu.style.left=Math.max(8,Math.min(innerWidth-w-8,r.right-w))+'px';return menu}
document.addEventListener('click',e=>{if(menu&&!menu.contains(e.target)&&!e.target.closest('.u19'))closeMenu()},true);
addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});
function mkTop(cls,icon,label,fn){const b=document.createElement('button');b.type='button';b.className='tb ic-only u19 '+cls;b.dataset.lab=label;b.title=label;b.setAttribute('aria-label',label);b.innerHTML=icon;b.onclick=e=>{e.stopPropagation();fn(b)};return b}
/* 2) ขนาดตัวอักษร */
function setFz(n){HTML.dataset.fz=n;ls.set('nbl12-fz',n);setTimeout(()=>{try{dispatchEvent(new Event('resize'))}catch(e){}},60)}
setFz(ls.get('nbl12-fz',0));
const fzB=mkTop('u19-fzb',IC.aa,L('ตัวอักษร','Text size'),b=>{const sm=innerWidth<=760;const m=popMenu(b,`<h6>${L('ขนาดตัวอักษร','Text size')}</h6><div class="u19-fz">${['ก','ก+','ก++'].map((t,i)=>`<button type="button" data-fz="${i}" aria-pressed="${+HTML.dataset.fz===i}">${t}</button>`).join('')}</div>${sm?`<button type="button" data-act="theme">${ic('sun')}${L('สลับสีพื้น สว่าง/มืด','Light/dark')}</button><button type="button" data-u19="staff">${IC.staff}${L('สำหรับเจ้าหน้าที่','For staff')}</button><button type="button" data-u19="tour">✨ ${L('ดูทัวร์แนะนำ','Replay tour')}</button>`:''}`);
  m.addEventListener('click',e=>{const x=e.target.closest('[data-u19]');if(!x)return;e.stopPropagation();if(x.dataset.u19==='tour'){closeMenu();tour(true)}else stB.onclick({stopPropagation(){}})});
  m.onclick=e=>{const x=e.target.closest('[data-fz]');if(x){setFz(+x.dataset.fz);m.querySelectorAll('[data-fz]').forEach(y=>y.setAttribute('aria-pressed',y===x))}}});
const stB=mkTop('u19-staff',IC.staff,L('เจ้าหน้าที่','Staff'),b=>{const m=popMenu(b,`<h6>${L('สำหรับเจ้าหน้าที่','For staff')}</h6>
  <a href="entry.html">${ic('lock')}${L('กรอก / อัปเดตข้อมูล','Data entry')}</a>
  <button type="button" data-act="edit">${ic('edit')}${L('แก้ไขข้อมูลหน้านี้','Edit this page')}</button>
  <a href="report.html">${ic('grid')}${L('ติดตามสถานะข้อมูล','Data status')}</a>
  <a href="apistatus.html">${ic('db')}${L('สถานะการเชื่อมต่อ (API)','API status')}</a>
  <button type="button" data-act="kiosk">${ic('monitor')}${L('จอนำเสนอห้องประชุม','Kiosk mode')}</button>
  <button type="button" data-act="link">${ic('link')}${L('คัดลอกลิงก์หน้านี้','Copy link')}</button>
  <button type="button" data-act="print">${ic('print')}${L('พิมพ์หน้านี้','Print')}</button>
  <button type="button" data-act="help">${ic('help')}${L('คู่มือการใช้งาน','Help')}</button>
  <button type="button" data-u19="tour">✨ ${L('ดูทัวร์แนะนำอีกครั้ง','Replay tour')}</button>`);
  m.addEventListener('click',e=>{const t=e.target.closest('[data-act],[data-u19],a');if(t&&t.dataset.u19==='tour'){closeMenu();tour(true)}else if(t)setTimeout(closeMenu,10)})});
if(top){const more=top.querySelector('.tb-more');top.insertBefore(fzB,more);top.insertBefore(stB,more)}

/* ---------- 3) อธิบายศัพท์ ---------- */
const GL={'ต้นน้ำ':L('ช่วงการผลิต เช่น การปลูก การเลี้ยง จำนวนเกษตรกร พื้นที่','Production stage'),'กลางน้ำ':L('ช่วงแปรรูป เช่น โรงสี กลุ่มแปรรูป บรรจุภัณฑ์','Processing stage'),'ปลายน้ำ':L('ช่วงการขาย เช่น ราคา ตลาด ร้านค้า รายได้','Market stage'),
  'ชุดข้อมูล':L('เรื่องที่มีตัวเลขเก็บไว้ เช่น “พื้นที่ปลูกข้าว” นับเป็น 1 ชุด','A dataset = one topic with figures'),'GI':L('สินค้าที่ได้ขึ้นทะเบียนสิ่งบ่งชี้ทางภูมิศาสตร์ รับรองว่าเป็นของแท้จากถิ่นนี้','Geographical Indication'),
  'คาดการณ์':L('ตัวเลขประมาณจากแนวโน้มปีก่อน ๆ ไม่ใช่ตัวเลขจริง','Estimated from past trend'),'ทบต้น':L('คิดการเติบโตต่อยอดจากปีก่อนทุกปี เหมือนดอกเบี้ยทบต้น','Compounded growth'),'มูลค่า':L('จำนวนเงิน (บาท) ที่ขายได้หรือประเมินได้','Value in baht')};
const GRE=new RegExp('('+Object.keys(GL).sort((a,b)=>b.length-a.length).join('|')+')');
function gloss(root){const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:n=>{const p=n.parentElement;if(!p||p.closest('script,style,svg,button,a,input,textarea,select,.gl,canvas,.kk-p,.qk,.crumb,h1,.pg'))return 2;return GRE.test(n.nodeValue)?1:2}});
  const L0=[];while(w.nextNode())L0.push(w.currentNode);
  const done=new Set([...root.querySelectorAll('.gl')].map(x=>x.dataset.g));
  L0.forEach(n=>{const m=n.nodeValue.match(GRE);if(!m||done.has(m[0]))return;done.add(m[0]);const i=m.index,t=m[0];const a=n.splitText(i);a.splitText(t.length);const s=document.createElement('abbr');s.className='gl';s.dataset.g=t;s.tabIndex=0;s.textContent=t;a.replaceWith(s)})}
let pop=null;document.addEventListener('click',e=>{const g=e.target.closest('.gl');if(pop){pop.remove();pop=null}if(!g)return;e.preventDefault();
  pop=document.createElement('div');pop.className='gl-pop';pop.innerHTML=`<b>${esc(g.dataset.g)}</b>${esc(GL[g.dataset.g]||'')}`;document.body.appendChild(pop);
  const r=g.getBoundingClientRect();pop.style.left=Math.max(12,Math.min(innerWidth-pop.offsetWidth-12,r.left))+'px';pop.style.top=(r.bottom+8+pop.offsetHeight>innerHeight?r.top-pop.offsetHeight-8:r.bottom+8)+'px'});

/* ---------- 4) ปุ่มลัดหน้าแรก ---------- */
function quick(page){if(R.page!=='cover'||page.querySelector('.qk'))return;
  const first=page.firstElementChild;if(!first)return;
  const q=document.createElement('section');q.className='qk';
  q.innerHTML=`<h2>${L('วันนี้อยากทำอะไรคะ?','What would you like to do?')}</h2><p>${L('แตะปุ่มใหญ่ด้านล่างได้เลย','Tap a big button below')}</p><div class="qk-g">
    <a href="overview.html" style="background:linear-gradient(135deg,#E8559A,#8E1F4A)"><i>🛍️</i><b>${L('ดูสินค้า 14 อย่าง','See 14 products')}</b><span>${L('ภาพ เรื่องราว ตัวเลขสำคัญ','Photos, stories, key figures')}</span></a>
    <a href="#" data-u19="buy" style="background:linear-gradient(135deg,#1f9d55,#0F4A37)"><i>📍</i><b>${L('ซื้อได้ที่ไหน','Where to buy')}</b><span>${L('ร้าน เบอร์โทร แผนที่','Shops, phone, map')}</span></a>
    <a href="insights.html" style="background:linear-gradient(135deg,#2E6FD8,#1B3E80)"><i>📊</i><b>${L('ดูตัวเลขสำคัญ','Key numbers')}</b><span>${L('สรุปภาพรวมทั้งจังหวัด','Province summary')}</span></a>
    <a href="brief.html?v=book" style="background:linear-gradient(135deg,#C99A2E,#7A5410)"><i>📖</i><b>${L('อ่านหนังสือสินค้า','Read the lookbook')}</b><span>${L('พลิกอ่านทีละหน้า / ดาวน์โหลด PDF','Flip pages / PDF')}</span></a></div>`;
  first.after(q);
  q.querySelector('[data-u19="buy"]').onclick=e=>{e.preventDefault();pickProduct(L('อยากซื้อสินค้าอะไรคะ','Which product?'),p=>go(pFile(p.id)+'#shops'))}}
function pickProduct(title,fn){closeMenu();const d=document.createElement('div');d.className='bks';
  d.innerHTML=`<div class="bks-p"><div class="bks-h"><b>${title}</b><button type="button" data-x aria-label="${L('ปิด','Close')}">✕</button></div><div class="bks-g">${P.map(p=>`<button type="button" data-p="${p.id}" style="--pa:${p.pa}"><i style="background-image:url(img/cut-${pad2(p.id)}.webp),url(img/icon-${pad2(p.id)}.webp)"></i><span><small>${pad2(p.id)}</small>${esc(pname(p))}</span></button>`).join('')}</div></div>`;
  document.body.appendChild(d);d.onclick=e=>{if(e.target===d||e.target.closest('[data-x]'))return d.remove();const b=e.target.closest('[data-p]');if(b){d.remove();fn(byId(+b.dataset.p))}}}

/* ---------- 6) ปุ่มกลับ + ตำแหน่ง + 9) ฟัง ---------- */
function crumb(page){if(R.page==='cover'||page.querySelector(':scope>.crumb'))return;
  const p=R.page==='product'&&typeof byId==='function'?byId(R.pid):null;
  const c=document.createElement('div');c.className='crumb';
  c.innerHTML=`<a class="bk" href="index.html" data-u19="back">${IC.back}${L('กลับ','Back')}</a><nav aria-label="${L('ตำแหน่งปัจจุบัน','Breadcrumb')}"><a href="index.html">${L('หน้าแรก','Home')}</a>›${p?`<a href="overview.html">${L('สินค้า','Products')}</a>›<b>${esc(pname(p))}</b>`:`<b>${esc(PAGES[R.page]?PT(R.page):document.title.split('·')[0])}</b>`}</nav><span class="sp"></span>${'speechSynthesis' in window?`<button type="button" class="say" aria-pressed="false">${IC.spk}${L('ฟังเสียง','Listen')}</button>`:''}`;
  page.prepend(c);
  c.querySelector('[data-u19="back"]').onclick=e=>{const same=document.referrer&&new URL(document.referrer).origin===location.origin;if(same&&history.length>1){e.preventDefault();history.back()}};
  const say=c.querySelector('.say');if(say)say.onclick=()=>{if(speaking){stopSay();return}speak(readText(page,p),say)}}
let speaking=false;let sayBtn=null;
function stopSay(){try{speechSynthesis.cancel()}catch(e){}speaking=false;if(sayBtn){sayBtn.setAttribute('aria-pressed','false');sayBtn.innerHTML=(sayBtn.classList.contains('kk-say')?IC.spk:IC.spk+L('ฟังเสียง','Listen'))}}
function speak(text,btn){stopSay();if(!text)return;const v=speechSynthesis.getVoices().find(v=>/^th/i.test(v.lang));
  const parts=text.replace(/\s+/g,' ').match(/[^.!?。\n]{1,180}(\s|$)|.{1,180}/g)||[text];
  speaking=true;sayBtn=btn;if(btn){btn.setAttribute('aria-pressed','true');btn.innerHTML=IC.stop+(btn.classList.contains('kk-say')?'':L('หยุด','Stop'))}
  parts.forEach((s,i)=>{const u=new SpeechSynthesisUtterance(s);u.lang=EN_MODE&&EN_MODE()?'en-US':'th-TH';if(v&&!(EN_MODE&&EN_MODE()))u.voice=v;u.rate=.95;if(i===parts.length-1)u.onend=()=>stopSay();speechSynthesis.speak(u)})}
function readText(page,p){if(p){const F=(typeof KEYFIGS==='function'?KEYFIGS(p,3):[]).filter(f=>f.v);
    return [pname(p),p.tagline||'',...F.map(f=>`${f.n} ${fv(f.v,f.u)} ${uLab(f.u)}`),(page.querySelector('.story,.pr-story,.hx p')||{}).textContent||''].join('. ')}
  const t=[...page.querySelectorAll('h1,h2,.lead,.tp-s,p')].slice(0,8).map(e=>e.textContent.trim()).filter(Boolean);return t.join('. ')}
addEventListener('pagehide',stopSay);

/* ---------- 7) กราฟแบบง่าย ---------- */
const ADV=()=>ls.get('nbl12-adv',false);
function simple(page){page.querySelectorAll('.stb').forEach(b=>{b.classList.toggle('adv',ADV());if(b.querySelector('.u19-adv'))return;
  if(!b.querySelector('.stb-vm,.tp-g'))return;const fig=b.querySelector('figure.stb-viz');if(!fig)return;
  const bt=document.createElement('button');bt.type='button';bt.className='u19-adv';const upd=()=>bt.innerHTML=b.classList.contains('adv')?L('▴ ซ่อนรายละเอียด','▴ Less'):L('▾ ดูละเอียด (มุมมองอื่น / ตัวเลขวิเคราะห์)','▾ More detail');upd();
  bt.onclick=()=>{const on=!b.classList.contains('adv');ls.set('nbl12-adv',on);document.querySelectorAll('.stb').forEach(x=>x.classList.toggle('adv',on));document.querySelectorAll('.u19-adv').forEach(x=>x.innerHTML=on?L('▴ ซ่อนรายละเอียด','▴ Less'):L('▾ ดูละเอียด (มุมมองอื่น / ตัวเลขวิเคราะห์)','▾ More detail'))};
  fig.after(bt)})}

/* ---------- ผูกกับการแสดงผลหน้า ---------- */
const page=document.getElementById('page');let tm=null;
function run(){if(!page)return;try{if(PC)return;crumb(page);quick(page);simple(page);gloss(page)}catch(e){console.error('p19',e)}}
if(page){new MutationObserver(()=>{clearTimeout(tm);tm=setTimeout(run,120)}).observe(page,{childList:true,subtree:true});setTimeout(run,300)}

/* ---------- 5) ทัวร์ครั้งแรก ---------- */
function tour(force){if(!force&&(ls.get('nbl12-tour',0)||R.page!=='cover'))return;ls.set('nbl12-tour',1);
  const S=[[()=>document.querySelector('.qk-g'),L('เริ่มตรงนี้ได้เลย','Start here'),L('แตะปุ่มใหญ่เพื่อดูสินค้า หาร้านที่ขาย ดูตัวเลขสำคัญ หรืออ่านหนังสือสินค้า','Tap a big button to begin')],
    [()=>document.querySelector('.bnav')&&getComputedStyle(document.querySelector('.bnav')).display!=='none'?document.querySelector('.bnav'):document.querySelector('.side nav,#navMain'),L('เมนูหลัก','Main menu'),L('ใช้ไปหน้าต่าง ๆ กดกลับมาหน้าแรกได้ตลอด','Go anywhere, back home anytime')],
    [()=>document.querySelector('header.top [data-act="search"]'),L('ค้นหา','Search'),L('พิมพ์ชื่อสินค้าหรือเรื่องที่อยากรู้ เช่น “ราคาโคเนื้อ”','Type what you want to find')],
    [()=>document.querySelector('.u19-fzb'),L('ตัวหนังสือเล็กไป?','Text too small?'),L('แตะปุ่มนี้แล้วเลือก ก+ หรือ ก++ ตัวหนังสือจะใหญ่ขึ้นทั้งระบบ','Make all text bigger')],
    [()=>document.querySelector('#kk .kk-fab'),L('ถามน้องกาบแก้วได้','Ask Kab Kaew'),L('มีอะไรไม่เข้าใจ พิมพ์หรือกดไมค์พูดถามหนูได้เลยค่ะ','Type or speak your question')]];
  const steps=S.filter(s=>{const e=s[0]();return e&&e.getBoundingClientRect().width>0});if(!steps.length)return;
  const o=document.createElement('div');o.className='tour';o.innerHTML=`<div class="tour-hole"></div><div class="tour-c" role="dialog" aria-live="polite"></div>`;document.body.appendChild(o);
  const hole=o.firstChild,card=o.lastChild;let k=0;
  const show=()=>{const [f,t,d]=steps[k];const el=f();const r0=el.getBoundingClientRect();if(r0.top<60||r0.bottom>innerHeight-60)el.scrollIntoView({block:r0.height>innerHeight*.6?'start':'center',behavior:'auto'});
    setTimeout(()=>{const r=el.getBoundingClientRect(),pad=8;Object.assign(hole.style,{left:r.left-pad+'px',top:r.top-pad+'px',width:r.width+2*pad+'px',height:r.height+2*pad+'px'});
      card.innerHTML=`<div class="tw"><img src="img/mascot/kk-avatar.webp" alt=""><div><b>${t}</b><p>${d}</p></div></div><div class="tb2"><span>${k+1} / ${steps.length}</span><div><button type="button" class="sk">${L('ข้าม','Skip')}</button> <button type="button" class="nx">${k<steps.length-1?L('ถัดไป','Next'):L('เริ่มใช้งาน','Done')}</button></div></div>`;
      const ch=card.offsetHeight,cw=card.offsetWidth;const below=r.bottom+pad+12+ch<innerHeight;
      card.style.top=(below?r.bottom+pad+12:Math.max(12,r.top-pad-12-ch))+'px';card.style.left=Math.max(12,Math.min(innerWidth-cw-12,r.left+r.width/2-cw/2))+'px'},120)};
  o.onclick=e=>{if(e.target.closest('.sk'))return o.remove();if(e.target.closest('.nx')){k++;if(k>=steps.length)o.remove();else show()}};
  show()}
if(!PC)setTimeout(()=>tour(false),2200);

/* ---------- 11) น้องกาบแก้ว: ไมค์ + ฟังคำตอบ ---------- */
function kkPlus(){const f=document.getElementById('kkF');if(!f||f.querySelector('.kk-mic'))return!!f;
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(SR){const m=document.createElement('button');m.type='button';m.className='kk-mic';m.setAttribute('aria-label',L('พูดคำถาม','Speak'));m.title=m.getAttribute('aria-label');m.innerHTML=IC.mic;f.insertBefore(m,f.querySelector('button[type=submit]'));
    let rec=null;m.onclick=()=>{if(rec){rec.stop();return}rec=new SR();rec.lang=EN_MODE&&EN_MODE()?'en-US':'th-TH';rec.interimResults=true;rec.maxAlternatives=1;
      const inp=document.getElementById('kkQ');m.classList.add('on');inp.placeholder=L('กำลังฟัง… พูดได้เลยค่ะ','Listening…');
      rec.onresult=e=>{const r=e.results[e.results.length-1];inp.value=r[0].transcript;if(r.isFinal&&window.KK){KK.ask(inp.value)}};
      rec.onend=rec.onerror=()=>{m.classList.remove('on');inp.placeholder=L('พิมพ์คำถาม เช่น ผลผลิตกล้วย…','Ask…');rec=null};rec.start()}}
  if('speechSynthesis' in window){const bd=document.getElementById('kkBd');new MutationObserver(ms=>ms.forEach(x=>x.addedNodes.forEach(n=>{if(n.nodeType!==1||!n.classList.contains('ai')||n.querySelector('.kk-typing,.kk-say'))return;
    const bb=n.querySelector('.kk-bb');if(!bb)return;const b=document.createElement('button');b.type='button';b.className='kk-say';b.setAttribute('aria-label',L('ฟังคำตอบ','Listen'));b.innerHTML=IC.spk;
    b.onclick=()=>{if(speaking&&sayBtn===b){stopSay();return}const c=bb.cloneNode(true);c.querySelectorAll('a,button,.kk-pg,small').forEach(x=>x.remove());speak(c.textContent,b)};bb.appendChild(b)}))).observe(bd,{childList:true})}
  return true}
let kt=0;const ki=setInterval(()=>{if(kkPlus()||++kt>40)clearInterval(ki)},250);

/* ---------- 12) เน็ตหลุด / โหลดช้า ---------- */
let net=null;const banner=(msg,btn)=>{if(net)net.remove();net=document.createElement('div');net.className='net';net.setAttribute('role','alert');net.innerHTML=`<span>${msg}</span>${btn?`<button type="button">${btn}</button>`:''}`;document.body.appendChild(net);
  const b=net.querySelector('button');if(b)b.onclick=()=>location.reload()};
addEventListener('offline',()=>banner('📶 '+L('อินเทอร์เน็ตหลุด — ข้อมูลที่เปิดไว้ยังดูได้ เมื่อเน็ตกลับมาจะใช้งานต่อได้ทันที','You are offline')));
addEventListener('online',()=>{banner('✅ '+L('อินเทอร์เน็ตกลับมาแล้ว','Back online'));setTimeout(()=>{if(net){net.remove();net=null}},2500)});
setTimeout(()=>{const pg=document.getElementById('page');if(pg&&!pg.children.length)banner('⏳ '+L('โหลดช้ากว่าปกติ อาจเพราะสัญญาณอินเทอร์เน็ต','Loading slowly'),L('ลองใหม่','Retry'))},12000);
window.U19={tour,setFz,speak,stopSay,pickProduct};
})();
