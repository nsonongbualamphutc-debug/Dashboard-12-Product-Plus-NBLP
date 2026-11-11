/* =====================================================================
   12 Plus+ · pages18.js — หนังสือสินค้า: อ่านง่ายบนโทรศัพท์ / แท็บเล็ต / iPad
   1 ซูม (แตะสองครั้ง · ถ่างสองนิ้ว · ปุ่มแว่นขยาย)   2 โหมดอ่านเต็มจอ (ใช้ได้บน iPhone)
   3 แถบควบคุม 2 แถว ปุ่มใหญ่                        4 ย่อน้องกาบแก้วเมื่อเปิดหนังสือ
   5 สารบัญแผ่นเลื่อนขึ้น                              6 หมุนจอแล้วจัดขนาดพอดีจอ
   7 จำหน้าที่อ่านค้าง                                8 โหลดหน้าถัดไปล่วงหน้า
   9 เพิ่มลงหน้าจอโฮม (เหมือนแอป)                     10 แชร์หน้านี้ด้วยระบบแชร์ของมือถือ
   ===================================================================== */
(function(){
if(typeof bookView!=='function'||typeof bkGo!=='function')return;
const TOUCH=matchMedia('(hover:none),(pointer:coarse)').matches;
const HTML=document.documentElement;
const ls={get(k,d){try{const v=localStorage.getItem(k);return v==null?d:JSON.parse(v)}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const SV=(p,w=20)=>`<svg viewBox="0 0 24 24" width="${w}" height="${w}" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
const IC={zoom:SV('<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2M11 8.5v5M8.5 11h5"/>'),toc:SV('<rect x="4" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5"/>'),
  read:SV('<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>'),exit:SV('<path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"/>'),share:SV('<path d="M12 3v12M7.5 7.5 12 3l4.5 4.5"/><path d="M5 12v6.5A2.5 2.5 0 0 0 7.5 21h9a2.5 2.5 0 0 0 2.5-2.5V12"/>'),
  x:SV('<path d="M6 6l12 12M18 6 6 18"/>',22),plus:SV('<path d="M12 5v14M5 12h14"/>'),minus:SV('<path d="M5 12h14"/>'),home:SV('<path d="M12 4v11M7.5 10.5 12 15l4.5-4.5"/><path d="M5 19h14"/>')};

/* ---------- สไตล์ ---------- */
const css=`
/* 3) แถบควบคุม */
.bk-bar .bk-b.x18{background:rgba(255,255,255,.12)}
@media (max-width:760px){
  .bk-bar{display:grid!important;grid-template-columns:auto 1fr auto;align-items:center;gap:8px 6px!important;padding:8px 10px!important;border-radius:22px!important;width:100%!important}
  .bk-bar>#bkPrev{grid-column:1;grid-row:1}.bk-bar>.bk-info{grid-column:2;grid-row:1;text-align:center;align-items:center}.bk-bar>#bkNext{grid-column:3;grid-row:1}
  .bk-bar>.bk-info b{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%;font-size:15px}
  .bk-bar>.bk-info .bk-prog{width:100%}
  .bk-bar>.bk-tools{grid-column:1/-1;grid-row:2;display:flex;justify-content:space-around;gap:4px;padding-top:6px;border-top:1px solid rgba(255,255,255,.14)}
  .bk-bar>.bk-sp{display:none}
  .bk-b{width:48px!important;height:48px!important}
  .bk-tools .bk-b.sm{width:44px!important;height:44px!important}
  .bk-tools .bkpdf>.bk-b{height:44px!important}
  .bk-th{display:none!important}
}
@media (min-width:761px){.bk-tools{display:contents}}
.bk-tools .bk-lab{display:none}
@media (max-width:760px){.bk-tools .bk-b{width:auto!important;min-width:46px;height:52px!important;border-radius:14px!important;padding:4px 6px!important;display:flex!important;flex-direction:column;align-items:center;justify-content:center;gap:2px;font-size:0}.bk-tools .bk-b svg{width:20px;height:20px}.bk-tools .bk-b,.bk-tools .bkpdf>.bk-b{background:rgba(255,255,255,.12)!important;color:#fff}.bk-tools .bk-b svg{color:#FF8CC0}.bk-tools .bkpdf>.bk-b{font:600 0px Kanit,sans-serif!important}.bk-tools .bk-lab{display:block;font:500 10.5px/1 Kanit,sans-serif;color:inherit;opacity:.85;white-space:nowrap}}

/* 2) โหมดอ่านเต็มจอ */
html.bk-read,html.bk-read body{overflow:hidden!important;overscroll-behavior:none}
html.bk-read .bnav,html.bk-read .khit,html.bk-read .bk-resume{display:none!important}
html.bk-read .bk-wrap{position:fixed!important;inset:0!important;z-index:2147483000!important;margin:0!important;border-radius:0!important;padding:max(10px,env(safe-area-inset-top)) 8px max(8px,env(safe-area-inset-bottom))!important;display:flex;flex-direction:column;justify-content:center;gap:10px;background:radial-gradient(120% 90% at 50% 30%,#3a1530,#14070f 75%)!important}
html.bk-read .bk-wrap .bk-bar{color:#fff;background:rgba(255,255,255,.08);border-color:rgba(255,255,255,.14)}
html.bk-read .bk-wrap .bk-tools .bk-lab{color:rgba(255,255,255,.75)}
html.bk-read #kk{display:none!important}
html.bk-read .bk-th{display:none!important}
/* 4) น้องกาบแก้วย่อเมื่อเปิดหนังสือ */
html.bk-on #kk:not(.open) .kk-fab .kk-m,html.bk-on #kk:not(.open) .kk-tip{display:none}
html.bk-on #kk:not(.open) .kk-pill{margin:0;padding:6px 12px 6px 6px}
html.bk-on #kk:not(.open) .kk-pill:before{content:"";width:30px;height:30px;border-radius:50%;background:url(img/mascot/kk-avatar.webp) center/cover;flex:none}
html.bk-on #kk:not(.open) .kk-pill i{display:none}
@media (max-width:760px){html.bk-on #kk:not(.open) .kk-pill{font-size:0;gap:0;padding:5px}html.bk-on #kk:not(.open) .kk-pill:before{width:38px;height:38px}}
/* 1) ซูม */
.bkz{position:fixed;inset:0;z-index:2147483100;background:#100609;display:flex;flex-direction:column;touch-action:none;animation:bkzIn .25s ease}
@keyframes bkzIn{from{opacity:0}}
.bkz-v{position:relative;flex:1;overflow:hidden;touch-action:none}
.bkz-c{position:absolute;left:0;top:0;transform-origin:0 0;will-change:transform}
.bkz-c .bkz-pg{position:relative;width:var(--zw);height:calc(var(--zw)*1.4142);container-type:inline-size;overflow:hidden;background:#FBF8F1;border-radius:6px;box-shadow:0 20px 50px rgba(0,0,0,.6)}
.bkz-c .bkz-pg>.pg{position:absolute;inset:0}
.bkz-c .bkz-pg .tap{display:none}
.bkz-t{display:flex;align-items:center;gap:8px;padding:max(10px,env(safe-area-inset-top)) 12px 10px;color:#fff;font:600 14px Kanit,sans-serif}
.bkz-t span{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.bkz-t button,.bkz-b button{width:44px;height:44px;border-radius:50%;border:0;background:rgba(255,255,255,.14);color:#fff;display:grid;place-items:center;cursor:pointer;flex:none}
.bkz-b{display:flex;justify-content:center;align-items:center;gap:14px;padding:10px 12px max(12px,env(safe-area-inset-bottom));color:rgba(255,255,255,.8);font:500 12.5px Sarabun,sans-serif}
.bkz-b b{min-width:52px;text-align:center;font:600 14px Kanit,sans-serif;color:#fff}
.bkz-hint{position:absolute;left:50%;bottom:16px;transform:translateX(-50%);padding:8px 14px;border-radius:99px;background:rgba(0,0,0,.6);color:#fff;font:500 12.5px Sarabun,sans-serif;pointer-events:none;transition:opacity .6s;white-space:nowrap}
/* 5) สารบัญ */
.bks{position:fixed;inset:0;z-index:2147483200;display:flex;flex-direction:column;justify-content:flex-end;background:rgba(10,4,8,.5);-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px);animation:bkzIn .2s ease}
.bks-p{max-height:82vh;display:flex;flex-direction:column;border-radius:24px 24px 0 0;background:var(--surface,#fff);color:var(--ink,#2C1A23);padding:8px 14px max(14px,env(safe-area-inset-bottom));box-shadow:0 -20px 50px -10px rgba(0,0,0,.4);animation:bksUp .32s cubic-bezier(.2,.8,.2,1)}
@keyframes bksUp{from{transform:translateY(100%)}}
.bks-p:before{content:"";width:42px;height:5px;border-radius:5px;background:var(--line,#ddd);margin:2px auto 10px}
.bks-h{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}
.bks-h b{font:600 18px Kanit,sans-serif}
.bks-h button{width:40px;height:40px;border-radius:50%;border:0;background:var(--surface-3,#f3e6ed);color:inherit;display:grid;place-items:center}
.bks-q{display:flex;gap:6px;margin-bottom:10px}
.bks-q button{flex:1;padding:10px 6px;border-radius:14px;border:1px solid var(--line,#eed6e2);background:var(--surface,#fff);color:inherit;font:600 13px Kanit,sans-serif}
.bks-g{overflow-y:auto;display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:8px;padding-bottom:4px}
.bks-g button{display:flex;align-items:center;gap:10px;padding:8px;border-radius:16px;border:1px solid var(--line,#eed6e2);background:var(--surface,#fff);color:inherit;text-align:left;min-height:64px}
.bks-g button[aria-current="true"]{border-color:var(--pa);box-shadow:0 0 0 2px color-mix(in srgb,var(--pa) 35%,transparent)}
.bks-g i{width:48px;height:48px;flex:none;border-radius:12px;background:#f6f1e8 center/contain no-repeat}
.bks-g span{display:flex;flex-direction:column;min-width:0;font:500 13.5px/1.25 Kanit,sans-serif}
.bks-g small{font:500 11px "IBM Plex Mono",monospace;color:var(--pa)}
/* 7) อ่านต่อ */
.bk-resume{position:fixed;left:50%;bottom:calc(96px + env(safe-area-inset-bottom));transform:translateX(-50%);z-index:2147483050;display:flex;align-items:center;gap:10px;padding:8px 8px 8px 16px;border-radius:99px;background:#2C1A23;color:#fff;font:500 13px Sarabun,sans-serif;box-shadow:0 14px 34px -10px rgba(0,0,0,.55);animation:bkzIn .3s ease;max-width:calc(100vw - 24px)}
.bk-resume button{border:0;border-radius:99px;padding:8px 12px;background:rgba(255,255,255,.14);color:#fff;font:600 12.5px Kanit,sans-serif;white-space:nowrap}
/* 9) เพิ่มลงหน้าจอโฮม */
.a2hs{position:fixed;inset:0;z-index:2147483300;display:flex;align-items:flex-end;justify-content:center;background:rgba(10,4,8,.5)}
.a2hs>div{width:min(420px,100%);margin:12px;padding:18px;border-radius:22px;background:var(--surface,#fff);color:var(--ink,#2C1A23);box-shadow:0 30px 60px -20px rgba(0,0,0,.5)}
.a2hs b{display:block;font:600 17px Kanit,sans-serif;margin-bottom:6px}.a2hs ol{margin:8px 0 14px;padding-left:20px;line-height:1.7}
.a2hs button{width:100%;padding:12px;border:0;border-radius:14px;background:linear-gradient(135deg,#E8559A,#8E1F4A);color:#fff;font:600 14px Kanit,sans-serif}
@media print{.bkz,.bks,.bk-resume,.a2hs{display:none!important}}`;
const s=document.createElement('style');s.id='p18-css';s.textContent=css;document.head.appendChild(s);

/* ---------- ช่วย: หน้าที่เห็น ---------- */
const faceIdx=t=>BK.mode==='spread'?(t===0?0:2*t-1):t;
const toT=f=>BK.mode==='spread'?(f<=0?0:Math.floor((f+1)/2)):f;
function visibleFaces(){const t=BK.cur;if(BK.mode!=='spread')return[t];if(t===0)return[0];if(t>=BK.leaves)return[BK.n-1];return[2*t-1,2*t].filter(i=>i<BK.n)}
function faceEl(i){const sp=document.querySelector(`#bkSp .spg[data-i="${i}"]`);return sp}
function faceTitle(i){const n=Math.floor((i-3)/2);const p=n>=0&&n<14?P[n]:null;return p?`${pad2(p.id)} · ${pname(p)}`:i===0?L('ปกหน้า','Cover'):i===BK.n-1?L('ปกหลัง','Back cover'):i===1?L('บทนำ','Introduction'):i===2?L('สารบัญ','Contents'):L('หน้า ','Page ')+(i+1)}

/* ---------- 1) ซูม ---------- */
function openZoom(fi){fi=fi==null?visibleFaces()[0]:fi;const src=faceEl(fi);if(!src)return;
  const z=document.createElement('div');z.className='bkz';z.setAttribute('role','dialog');z.setAttribute('aria-label',L('ซูมหน้า','Zoom page'));
  z.innerHTML=`<div class="bkz-t"><span>${esc(faceTitle(fi))} · ${L('หน้า','p.')} ${fi+1}/${BK.n}</span><button type="button" data-z="prev" aria-label="prev">${ic('arrowL')}</button><button type="button" data-z="next" aria-label="next">${ic('arrowR')}</button><button type="button" data-z="x" aria-label="${L('ปิด','Close')}">${IC.x}</button></div>
  <div class="bkz-v"><div class="bkz-c"><div class="bkz-pg">${src.innerHTML}</div></div><div class="bkz-hint">${L('ถ่างสองนิ้วเพื่อซูม · แตะสองครั้งเพื่อขยาย/ย่อ · ลากเพื่อเลื่อน','Pinch to zoom · double-tap · drag')}</div></div>
  <div class="bkz-b"><button type="button" data-z="out" aria-label="zoom out">${IC.minus}</button><b id="bkzP">100%</b><button type="button" data-z="in" aria-label="zoom in">${IC.plus}</button></div>`;
  document.body.appendChild(z);HTML.classList.add('bkz-on');
  if(window.QRCode)z.querySelectorAll('.qr[data-qr]').forEach(q=>{q.innerHTML='';new QRCode(q,{text:q.dataset.qr,width:180,height:180,correctLevel:QRCode.CorrectLevel.M})});
  const v=z.querySelector('.bkz-v'),c=z.querySelector('.bkz-c'),pg=z.querySelector('.bkz-pg');
  let base=1,sc=1,x=0,y=0;
  const fit=()=>{const W=v.clientWidth,H=v.clientHeight;const zw=Math.min(W-16,(H-16)/1.4142);pg.style.setProperty('--zw',Math.round(Math.max(zw,280))+'px');const pw=pg.offsetWidth,ph=pg.offsetHeight;base=1;sc=1;x=(W-pw)/2;y=(H-ph)/2;apply()};
  const clamp=()=>{const W=v.clientWidth,H=v.clientHeight,pw=pg.offsetWidth*sc,ph=pg.offsetHeight*sc;
    x=pw<=W?(W-pw)/2:Math.min(0,Math.max(W-pw,x));y=ph<=H?(H-ph)/2:Math.min(0,Math.max(H-ph,y))};
  const apply=()=>{clamp();c.style.transform=`translate(${x}px,${y}px) scale(${sc})`;z.querySelector('#bkzP').textContent=Math.round(sc*100)+'%'};
  const zoomAt=(ns,cx,cy)=>{ns=Math.max(1,Math.min(5,ns));const k=ns/sc;x=cx-(cx-x)*k;y=cy-(cy-y)*k;sc=ns;apply()};
  fit();const ro=()=>fit();addEventListener('resize',ro);
  const hint=z.querySelector('.bkz-hint');setTimeout(()=>hint.style.opacity=0,2600);
  /* สัมผัส: ลาก · ถ่าง · แตะสองครั้ง */
  let P0=null,D0=0,S0=1,M0=null,lastTap=0;const pts=new Map();
  const rel=e=>{const r=v.getBoundingClientRect();return[e.clientX-r.left,e.clientY-r.top]};
  v.addEventListener('pointerdown',e=>{v.setPointerCapture(e.pointerId);pts.set(e.pointerId,rel(e));
    if(pts.size===1){P0=[x,y,...rel(e)];const now=Date.now();if(now-lastTap<300){const [cx,cy]=rel(e);zoomAt(sc>1.2?1:2.5,cx,cy);if(sc===1)fit();lastTap=0}else lastTap=now}
    if(pts.size===2){const [a,b]=[...pts.values()];D0=Math.hypot(a[0]-b[0],a[1]-b[1]);S0=sc;M0=[(a[0]+b[0])/2,(a[1]+b[1])/2,x,y]}});
  v.addEventListener('pointermove',e=>{if(!pts.has(e.pointerId))return;pts.set(e.pointerId,rel(e));
    if(pts.size===2&&D0){const [a,b]=[...pts.values()];const d=Math.hypot(a[0]-b[0],a[1]-b[1]);const ns=Math.max(1,Math.min(5,S0*d/D0));const mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2;
      x=mx-(M0[0]-M0[2])*ns/S0;y=my-(M0[1]-M0[3])*ns/S0;sc=ns;apply()}
    else if(pts.size===1&&P0){const [cx,cy]=rel(e);x=P0[0]+cx-P0[2];y=P0[1]+cy-P0[3];apply()}});
  const up=e=>{pts.delete(e.pointerId);if(pts.size<2)D0=0;if(pts.size===1){const p=[...pts.values()][0];P0=[x,y,...p]}if(!pts.size)P0=null};
  v.addEventListener('pointerup',up);v.addEventListener('pointercancel',up);
  v.addEventListener('wheel',e=>{e.preventDefault();const [cx,cy]=rel(e);zoomAt(sc*(e.deltaY<0?1.15:1/1.15),cx,cy)},{passive:false});
  const close=()=>{removeEventListener('resize',ro);removeEventListener('keydown',kd,true);z.remove();HTML.classList.remove('bkz-on')};
  const kd=e=>{if(e.key==='Escape'){e.stopImmediatePropagation();close()}else if(e.key==='+'||e.key==='='){zoomAt(sc*1.3,v.clientWidth/2,v.clientHeight/2)}else if(e.key==='-'){zoomAt(sc/1.3,v.clientWidth/2,v.clientHeight/2)}};
  addEventListener('keydown',kd,true);
  z.addEventListener('click',e=>{const b=e.target.closest('[data-z]');if(!b)return;const k=b.dataset.z;
    if(k==='x')close();else if(k==='in')zoomAt(sc*1.4,v.clientWidth/2,v.clientHeight/2);else if(k==='out'){zoomAt(sc/1.4,v.clientWidth/2,v.clientHeight/2)}
    else{const nf=Math.max(0,Math.min(BK.n-1,fi+(k==='next'?1:-1)));if(nf!==fi){close();bkGo(toT(nf),true);openZoom(nf)}}});
}

/* ---------- 2) โหมดอ่าน ---------- */
function setRead(on){const w=document.getElementById('bkWrap');if(!w)return;const f=faceIdx(BK.cur);
  HTML.classList.toggle('bk-read',on);w.classList.toggle('fs',on);
  const b=document.getElementById('bkRead');if(b){b.innerHTML=(on?IC.exit:IC.read)+`<span class="bk-lab">${on?L('ออก','Exit'):L('อ่านเต็มจอ','Read')}</span>`;b.setAttribute('aria-pressed',on)}
  requestAnimationFrame(()=>{const was=BK.mode;bkLayout();bkGo(toT(f),true)})}

/* ---------- 5) สารบัญ ---------- */
function openToc(){const sp=BK.mode==='spread';const curF=visibleFaces();
  const go=f=>{bkGo(toT(f));close()};
  const d=document.createElement('div');d.className='bks';d.setAttribute('role','dialog');d.setAttribute('aria-label',L('สารบัญ','Contents'));
  d.innerHTML=`<div class="bks-p"><div class="bks-h"><b>${L('สารบัญ','Contents')}</b><button type="button" data-x aria-label="${L('ปิด','Close')}">${IC.x}</button></div>
    <div class="bks-q"><button type="button" data-f="0">${L('ปกหน้า','Cover')}</button><button type="button" data-f="1">${L('บทนำ','Intro')}</button><button type="button" data-f="${BK.n-1}">${L('ปกหลัง','Back')}</button></div>
    <div class="bks-g">${P.map((p,n)=>{const f=3+2*n;return`<button type="button" data-f="${f}" style="--pa:${p.pa}" aria-current="${curF.includes(f)||curF.includes(f+1)}"><i style="background-image:url(img/cut-${pad2(p.id)}.webp),url(img/icon-${pad2(p.id)}.webp)"></i><span><small>${pad2(p.id)} · ${L('หน้า','p.')} ${f+1}</small>${esc(pname(p))}</span></button>`}).join('')}</div></div>`;
  document.body.appendChild(d);const close=()=>d.remove();
  d.addEventListener('click',e=>{if(e.target===d||e.target.closest('[data-x]'))return close();const b=e.target.closest('[data-f]');if(b)go(+b.dataset.f)});
  const cur=d.querySelector('[aria-current="true"]');if(cur)cur.scrollIntoView({block:'nearest'})}

/* ---------- 9) เพิ่มลงหน้าจอโฮม ---------- */
let bip=null;addEventListener('beforeinstallprompt',e=>{e.preventDefault();bip=e});
function addHome(){if(bip){bip.prompt();bip=null;return}
  const ios=/iPad|iPhone|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
  const d=document.createElement('div');d.className='a2hs';
  d.innerHTML=`<div><b>${L('เพิ่มหนังสือลงหน้าจอโฮม','Add to Home Screen')}</b>${L('เปิดอ่านได้จากไอคอนบนหน้าจอ เต็มจอเหมือนแอป','Open from your home screen like an app')}
    <ol>${ios?`<li>${L('แตะปุ่ม <b style="display:inline">แชร์</b> (สี่เหลี่ยมมีลูกศรขึ้น) ของ Safari','Tap Safari’s Share button')}</li><li>${L('เลือก “เพิ่มไปยังหน้าจอโฮม”','Choose “Add to Home Screen”')}</li><li>${L('แตะ “เพิ่ม”','Tap “Add”')}</li>`
      :`<li>${L('แตะเมนู ⋮ ของเบราว์เซอร์','Open the browser menu ⋮')}</li><li>${L('เลือก “เพิ่มลงในหน้าจอหลัก” หรือ “ติดตั้งแอป”','Choose “Add to Home screen” / “Install app”')}</li>`}</ol>
    <button type="button">${L('เข้าใจแล้ว','Got it')}</button></div>`;
  document.body.appendChild(d);d.addEventListener('click',e=>{if(e.target===d||e.target.tagName==='BUTTON')d.remove()})}
/* เปิดจากไอคอน → เข้าหนังสือทันที */
try{const m=document.querySelector('link[rel="manifest"]');if(m&&/brief\.html/.test(location.pathname)&&/v=book/.test(location.search)){const meta=document.createElement('meta');meta.name='apple-mobile-web-app-capable';meta.content='yes';document.head.appendChild(meta);
  const t=document.createElement('meta');t.name='apple-mobile-web-app-title';t.content='12Plus Book';document.head.appendChild(t)}}catch(e){}

/* ---------- 10) แชร์ ---------- */
function share(){const f=faceIdx(BK.cur);const p=typeof bkProduct==='function'?bkProduct():null;const url=absUrl('brief.html?v=book'+(p?'&p='+p.id:''));
  const title=(p?pname(p)+' · ':'')+L('หนังสือสินค้าอัตลักษณ์หนองบัวลำภู','Nong Bua Lam Phu Lookbook');
  if(navigator.share)navigator.share({title,text:title,url}).catch(()=>{});else copyText(url,L('คัดลอกลิงก์หน้านี้แล้ว','Link copied'))}

/* ---------- 6) ขนาดพอดีจอ (หมุนจอ / แท็บเล็ตแนวตั้ง / มือถือแนวนอน) ---------- */
let lyK='',lyPW='';const _ly=bkLayout;bkLayout=function(){const w0=document.getElementById('bkWrap'),st0=document.getElementById('bkStage');
  const K=st0&&w0?st0.clientWidth+'|'+innerWidth+'|'+(w0.classList.contains('fs')?1:0)+'|'+w0.dataset.k18:'';
  if(TOUCH&&K&&K===lyK&&lyPW){w0.style.setProperty('--pw',lyPW);return}
  _ly();const w=document.getElementById('bkWrap'),st=document.getElementById('bkStage');if(!w||!st)return;
  if(TOUCH&&BK.mode==='spread'&&innerHeight>innerWidth){BK.mode='single';w.classList.add('single');w.classList.remove('spread')}
  const fs=w.classList.contains('fs')||document.fullscreenElement===w;const W=st.clientWidth-(innerWidth<640?0:24);
  const bar=TOUCH&&innerWidth<=760?150:110;const H=innerHeight-(fs?bar+30:(TOUCH?bar+90:250));
  let pw;if(BK.mode==='spread')pw=Math.min(W/2,Math.max(fs?200:300,H)/1.414);else pw=Math.min(W,Math.max(fs?260:360,H)/1.414,fs?9999:(TOUCH?760:560));
  pw=Math.floor(pw);if(pw>120)w.style.setProperty('--pw',pw+'px');if(!w.dataset.k18)w.dataset.k18=Math.random().toString(36).slice(2,7);lyK=st.clientWidth+'|'+innerWidth+'|'+(w.classList.contains('fs')?1:0)+'|'+w.dataset.k18;lyPW=w.style.getPropertyValue('--pw')};

/* ---------- 7) จำหน้า + 8) โหลดล่วงหน้า ---------- */
let saveT=null;
function preload(t){const f=faceIdx(t);for(let i=f-1;i<=f+4;i++){const el=faceEl(i);if(!el)continue;el.querySelectorAll('img[loading="lazy"]').forEach(im=>{im.loading='eager'});
  document.querySelectorAll(`#bk .leaf[data-l="${Math.floor(i/2)}"] img[loading="lazy"]`).forEach(im=>{im.loading='eager'})}}
const _go=bkGo;bkGo=function(t,instant){_go(t,instant);try{preload(t);clearTimeout(saveT);saveT=setTimeout(()=>ls.set('nbl12-bk-last',faceIdx(BK.cur)),400)}catch(e){}};

/* ---------- ติดตั้งเข้าหนังสือ ---------- */
const _bv=bookView;bookView=function(box,startP){_bv(box,startP);HTML.classList.add('bk-on');
  const bar=box.querySelector('.bk-bar');if(!bar||bar.querySelector('.bk-tools'))return;
  /* รวมปุ่มเครื่องมือเป็นกลุ่ม (แถวที่ 2 บนมือถือ) */
  const tools=document.createElement('div');tools.className='bk-tools';
  const mk=(id,icon,lab,fn)=>{const b=document.createElement('button');b.type='button';b.className='bk-b sm x18';b.id=id;b.title=lab;b.setAttribute('aria-label',lab);b.innerHTML=icon+`<span class="bk-lab">${lab}</span>`;b.onclick=fn;return b};
  const tocB=mk('bkToc',IC.toc,L('สารบัญ','Contents'),openToc);
  const zB=mk('bkZoom',IC.zoom,L('ซูม','Zoom'),()=>openZoom());
  const rB=mk('bkRead',IC.read,L('อ่านเต็มจอ','Read'),()=>setRead(!HTML.classList.contains('bk-read')));
  const shB=mk('bkShare2',IC.share,L('แชร์','Share'),share);
  const hB=mk('bkHome',IC.home,L('ติดตั้ง','Install'),addHome);
  const old=id=>bar.querySelector('#'+id);
  [tocB,zB,rB].forEach(b=>tools.appendChild(b));
  if(TOUCH){const sn=old('bkSnd');if(sn)sn.remove()}
  ['bkAuto','bkSnd'].forEach(id=>{const bb=old(id);if(!bb)return;const b=old(id);if(b){const lab=document.createElement('span');lab.className='bk-lab';lab.textContent=id==='bkAuto'?L('เล่นเอง','Auto'):L('เสียง','Sound');b.appendChild(lab);const oc=b.onclick;b.onclick=function(e){oc&&oc.call(this,e);if(!b.querySelector('.bk-lab'))b.appendChild(lab)};tools.appendChild(b)}});
  const pdf=bar.querySelector('.bkpdf');if(pdf)tools.appendChild(pdf);
  tools.appendChild(shB);if(TOUCH)tools.appendChild(hB);
  ['bkShare','bkFs'].forEach(id=>{const b=old(id);if(b)b.remove()});
  bar.appendChild(tools);
  /* 1) แตะสองครั้ง = ซูม (จอสัมผัส): หน่วงการพลิกหน้าเพื่อรอดูว่าแตะสองครั้งไหม */
  const stg=box.querySelector('#bkStage');let tapT=null,lastX=0,lastT=0;
  stg.addEventListener('click',e=>{if(e.target.closest('a,button,[data-go],.qr'))return;e.stopPropagation();
    const r=stg.getBoundingClientRect(),now=Date.now();
    if(now-lastT<320&&Math.abs(e.clientX-lastX)<40){clearTimeout(tapT);lastT=0;const vf=visibleFaces();openZoom(vf.length>1&&e.clientX>r.left+r.width/2?vf[1]:vf[0]);return}
    lastT=now;lastX=e.clientX;clearTimeout(tapT);tapT=setTimeout(()=>bkStep(e.clientX>r.left+r.width/2?1:-1),TOUCH?300:0)},true);
  stg.addEventListener('dblclick',e=>e.preventDefault());
  /* 7) อ่านต่อจากหน้าที่ค้าง */
  const last=ls.get('nbl12-bk-last',0);
  if(!startP&&last>2&&last<BK.n-1){bkGo(toT(last),true);
    const t=document.createElement('div');t.className='bk-resume';t.innerHTML=`<span>${L('อ่านต่อจาก','Resumed at')} ${esc(faceTitle(last))}</span><button type="button">${L('เริ่มจากปก','From cover')}</button>`;
    document.body.appendChild(t);t.querySelector('button').onclick=()=>{bkGo(0);t.remove()};setTimeout(()=>t.remove(),6000)}
  /* เปิดอ่านเต็มจออัตโนมัติเมื่อเปิดจากไอคอนหน้าจอโฮม */
  if(matchMedia('(display-mode: standalone)').matches||navigator.standalone)setRead(true);
  setTimeout(()=>{bkLayout();bkGo(BK.cur,true)},50)};
/* ออกจากหน้าหนังสือ → คืนน้องกาบแก้ว */
setInterval(()=>{if(!document.getElementById('bk')){HTML.classList.remove('bk-on','bk-read')}},800);
addEventListener('keydown',e=>{if(e.key==='Escape'&&HTML.classList.contains('bk-read')&&!document.querySelector('.bkz,.bks')){setRead(false)}});
window.BK_UX={openZoom,openToc,setRead,share,addHome};
})();
