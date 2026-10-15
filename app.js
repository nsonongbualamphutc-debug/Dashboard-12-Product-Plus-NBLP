/* =====================================================================
   12 Plus+ · app.js — โครงหน้า เมนู แถบเครื่องมือ ค้นหา แจ้งเตือน โหมดนำเสนอ
   และการนำทางแบบไร้รอยต่อ (เปลี่ยนหน้าโดยไม่โหลดใหม่)
   ===================================================================== */
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const nf=new Intl.NumberFormat('th-TH');
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const sum=a=>a.reduce((x,y)=>x+(y||0),0);
const pct=x=>(x>=0?'+':'')+(x*100).toFixed(1)+'%';
const pad2=n=>String(n).padStart(2,'0');
const css=n=>getComputedStyle(document.documentElement).getPropertyValue(n).trim();
const isDark=()=>document.documentElement.dataset.theme==='dark'||(!document.documentElement.dataset.theme&&matchMedia('(prefers-color-scheme: dark)').matches);
const EN_MODE=()=>(typeof SET!=='undefined'&&SET.lang==='en');
const L=(th,en)=>EN_MODE()&&en!=null?en:th;
function fmtBaht(v){if(v==null)return{n:'–',u:''};const a=Math.abs(v);
  if(a>=1e9)return{n:(v/1e6).toLocaleString('th-TH',{maximumFractionDigits:0}),u:L('ล้านบาท','M THB')};
  if(a>=1e6)return{n:(v/1e6).toLocaleString('th-TH',{maximumFractionDigits:2}),u:L('ล้านบาท','M THB')};
  if(a>=1e4)return{n:(v/1e3).toLocaleString('th-TH',{maximumFractionDigits:1}),u:L('พันบาท','K THB')};
  return{n:nf.format(Math.round(v)),u:L('บาท','THB')}}
const fB=v=>{const o=fmtBaht(v);return o.n+(o.u?' '+o.u:'')};
const fShort=v=>Math.abs(v)>=1e6?(v/1e6).toLocaleString('th-TH',{maximumFractionDigits:1})+L(' ลบ.','M'):Math.abs(v)>=1e3?(v/1e3).toLocaleString('th-TH',{maximumFractionDigits:0})+L(' พัน','K'):nf.format(v);
const MO=()=>EN_MODE()?MONTHS_EN:MONTHS, MOF=()=>EN_MODE()?MONTHS_EN:MONTHS_FULL;
const pname=p=>L(p.name,p.en);
const pen=(p,k,th)=>EN_MODE()&&EN[p.id]?EN[p.id][k]:th;
const giTag=(p,cls='')=>p.gi?`<span class="gi ${cls}" title="สิ่งบ่งชี้ทางภูมิศาสตร์ (Geographical Indication)">GI</span>`:'';
function hexMix(hex,amt){const n=parseInt(hex.slice(1),16);let r=n>>16,g=n>>8&255,b=n&255;const t=amt<0?0:255,p=Math.abs(amt);r=Math.round((t-r)*p+r);g=Math.round((t-g)*p+g);b=Math.round((t-b)*p+b);return'#'+((1<<24)+(r<<16)+(g<<8)+b).toString(16).slice(1)}
const store={get(k,d){try{const v=localStorage.getItem(k);return v==null?d:JSON.parse(v)}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}},
  sget(k,d){try{const v=sessionStorage.getItem(k);return v==null?d:JSON.parse(v)}catch(e){return d}},sset(k,v){try{sessionStorage.setItem(k,JSON.stringify(v))}catch(e){}}};

/* ---------- settings ---------- */
const DEF_SET={theme:'auto',accent:'#0F4A37',video:true,kioskSec:20,mode:'Y',apiBase:APP.apiBase,res:{},gas:'',lang:'th'};
let SET=Object.assign({},DEF_SET,store.get('nbl12-set',{}));
function saveSet(){store.set('nbl12-set',SET);applyTheme()}
function applyTheme(){const r=document.documentElement;if(SET.theme==='auto')delete r.dataset.theme;else r.dataset.theme=SET.theme;
  r.style.setProperty('--forest',SET.accent&&SET.accent!=='#0F4A37'&&!isDark()?SET.accent:'')}
applyTheme();

/* ---------- log & notifications ---------- */
function logAdd(msg,kind='info'){const L=store.get('nbl12-log',[]);L.unshift({t:Date.now(),msg,kind});store.set('nbl12-log',L.slice(0,80));updateBell()}
function notices(){
  const out=[];const realP=P.filter(p=>p.ready.some(r=>r.real));
  realP.forEach(p=>out.push({t:0,msg:`${p.name}: หน่วยงานส่งค่าจริงแล้ว ${sum(p.ready.map(r=>r.real))} รายการ`,kind:'real'}));
  const wait=P.filter(p=>!p.ready.some(r=>r.real)).length;
  out.push({t:0,msg:`รอข้อมูลเข้าระบบ ${wait} สินค้า · ตัวเลขที่มีป้าย “จำลอง” แสดงรูปแบบการนำเสนอ`,kind:'wait'});
  const res=Object.values(SET.res||{}).filter(Boolean).length;
  out.push({t:0,msg:res?`ตั้งค่าเชื่อม API แล้ว ${res} สินค้า`:'ยังไม่ได้ผูกชุดข้อมูล API · ตั้งค่าได้ที่หน้า ตั้งค่าระบบ',kind:'api'});
  return store.get('nbl12-log',[]).concat(out);
}
function unread(){const seen=store.get('nbl12-seen',0);return store.get('nbl12-log',[]).filter(x=>x.t>seen).length+(seen?0:1)}
function updateBell(){const d=$('#bellDot');if(d)d.hidden=!unread()}

/* ---------- icons ---------- */
const IC={
 search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
 edit:'<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="m13.5 6.5 4 4"/>',
 sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
 moon:'<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
 monitor:'<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>',
 play:'<path d="M7 5v14l12-7z"/>',
 db:'<ellipse cx="12" cy="5.5" rx="7.5" ry="2.5"/><path d="M4.5 5.5v6c0 1.4 3.4 2.5 7.5 2.5s7.5-1.1 7.5-2.5v-6M4.5 11.5v6c0 1.4 3.4 2.5 7.5 2.5s7.5-1.1 7.5-2.5v-6"/>',
 bell:'<path d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15z"/><path d="M10 20a2 2 0 0 0 4 0"/>',
 link:'<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
 print:'<path d="M7 9V3h10v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M7 14h10v7H7z"/>',
 lock:'<rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
 help:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6v.6M12 17h.01"/>',
 home:'<path d="M3 11 12 4l9 7"/><path d="M5 10v10h14V10"/>',
 grid:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
 report:'<path d="M6 3h9l4 4v14H6z"/><path d="M14 3v5h5M9 13h7M9 17h5"/>',
 source:'<path d="M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3z"/><path d="M4 6v12c0 1.7 3.6 3 8 3"/><path d="m15 17 2 2 4-4"/>',
 api:'<path d="M5 12h4l2-5 2 10 2-5h4"/>',
 gear:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
 menu:'<path d="M4 7h16M4 12h16M4 17h16"/>', more:'<circle cx="5" cy="12" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="19" cy="12" r="1.3"/>',
 x:'<path d="M6 6l12 12M18 6 6 18"/>', down:'<path d="M12 4v12M6 11l6 6 6-6M5 20h14"/>', copy:'<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>',
 table:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M3 15h18M9 4v16"/>', chart:'<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
 refresh:'<path d="M20 11a8 8 0 1 0-2.3 5.7"/><path d="M20 4v7h-7"/>', check:'<path d="m5 12 4 4 10-10"/>',
 mute:'<path d="M4 9h4l5-4v14l-5-4H4z"/><path d="m16 9 5 6M21 9l-5 6"/>', vol:'<path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16 9a4 4 0 0 1 0 6"/>', pause:'<path d="M8 5v14M16 5v14"/>',
 arrowL:'<path d="M15 6l-6 6 6 6"/>', map:'<path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14M15 6v14"/>', globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 3 2.5 15 0 18M12 3c-2.5 3-2.5 15 0 18"/>', star:'<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>', arrowR:'<path d="M9 6l6 6-6 6"/>', ext:'<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>'
};
const ic=(n,c='')=>`<svg class="ic ${c}" viewBox="0 0 24 24" aria-hidden="true">${IC[n]||''}</svg>`;

/* ---------- identity: brand mark & product badges ---------- */
const MARK=(c1='#0F4A37',c2='#C2386F')=>`<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M20 3.5C25 11 25.5 19 20 26C14.5 19 15 11 20 3.5Z" fill="${c1}"/><path d="M20 26C13.5 24.5 8.5 18.5 7.5 10.5C14 12.5 18.5 18 20 26Z" fill="${c2}"/><path d="M20 26C26.5 24.5 31.5 18.5 32.5 10.5C26 12.5 21.5 18 20 26Z" fill="${c2}"/><path d="M6 31.5q3.5-2.2 7 0t7 0t7 0t7 0M10 36q3.5-2.2 7 0t7 0t6 0" fill="none" stroke="${c1}" stroke-width="2" stroke-linecap="round"/></svg>`;
const ICON={ /* ไอคอนสินค้า ใช้รหัสตามลำดับแบบสำรวจ */
 1:'<path d="M24 44C25 32 27 20 30 7M24 40C18 34 14 32 9 32"/><g fill="currentColor" stroke="none"><ellipse cx="27" cy="12" rx="2.2" ry="4.2" transform="rotate(-30 27 12)"/><ellipse cx="33" cy="15" rx="2.2" ry="4.2" transform="rotate(35 33 15)"/><ellipse cx="25.5" cy="19.5" rx="2.2" ry="4.2" transform="rotate(-30 25.5 19.5)"/><ellipse cx="31.5" cy="22.5" rx="2.2" ry="4.2" transform="rotate(35 31.5 22.5)"/><ellipse cx="24.5" cy="27" rx="2.2" ry="4.2" transform="rotate(-30 24.5 27)"/><ellipse cx="30" cy="30" rx="2.2" ry="4.2" transform="rotate(35 30 30)"/></g>',
 2:'<path d="M18 44V9M28 44V13M15 17h6M15 27h6M15 37h6M25 21h6M25 31h6M25 41h6M28 13C31 7 37 4 42 4C38 9 33 11 28 15M18 9C15 5 10 3 6 4C9 8 14 9 18 11"/>',
 3:'<path d="M5 12C7 21 15 22 18 18M43 12C41 21 33 22 30 18M18 18h12l-1.5 17q-4.5 6.5-9 0z"/><path d="M18 21l-6 2.5M30 21l6 2.5"/><circle cx="20.8" cy="25" r=".9" fill="currentColor"/><circle cx="27.2" cy="25" r=".9" fill="currentColor"/>',
 4:'<path d="M9 21C9 11 23 6 34 10C44 14 43 30 34 35C26 39 21 43 14 39C8 35 9 28 9 21Z"/><path d="M19 13L24 31M23 21L34 17"/><path d="M29 29q3-2 6 0M14 28q2-1.5 4 0"/>',
 5:'<circle cx="16" cy="15" r="4"/><path d="M13 10.5q1-4 3-1q1-4 3 0q2-3 3 1.5M12 14.5l-4 1.5l4 1.5M14 19q-1 3 1 4M19 18C21 25 15 31 22 35C28 38 36 34 38 28M30 27C32 17 38 13 43 15M33 28C38 21 44 23 44 27M22 36v6M28 36v6M19 42h6M25 42h6"/>',
 6:'<path d="M5 24C11 14 28 12 36 24C28 36 11 34 5 24Z"/><path d="M36 24L44 16L42 24L44 32Z"/><path d="M19 18q-3.5 6 0 12M25 21q2 3 0 6"/><circle cx="12.5" cy="22" r="1.4" fill="currentColor"/>',
 7:'<path d="M7 25C7 11 41 11 41 25Z"/><path d="M19 25C18 32 18 38 17 43H31C30 38 30 32 29 25"/><circle cx="17" cy="19" r="2" fill="currentColor" stroke="none"/><circle cx="28" cy="17.5" r="1.6" fill="currentColor" stroke="none"/><circle cx="33" cy="21.5" r="1.2" fill="currentColor" stroke="none"/>',
 8:'<path d="M24 45V6"/><path d="M24 13C19 12 15 9 14 5C19 5 23 8 24 13ZM24 13C29 12 33 9 34 5C29 5 25 8 24 13Z"/><path d="M24 24C17 23 11 19 10 13C17 13 22 17 24 24ZM24 24C31 23 37 19 38 13C31 13 26 17 24 24Z"/><path d="M24 36C16 35 9 31 7 24C15 24 21 28 24 36ZM24 36C32 35 39 31 41 24C33 24 27 28 24 36Z"/>',
 9:'<path d="M9 16C13 33 30 40 41 33C30 33 18 28 14 14Z"/><path d="M14 13C21 27 33 30 43 26C34 24 24 21 19 11Z"/><path d="M11 15l-1-6h7l-1 5"/>',
 10:'<rect x="8" y="30" width="32" height="9" rx="1.5"/><rect x="10.5" y="21" width="27" height="9" rx="1.5"/><rect x="13" y="12" width="22" height="9" rx="1.5"/><path d="M8 34.5l4-2.4l4 2.4l4-2.4l4 2.4l4-2.4l4 2.4l4-2.4l4 2.4M10.5 25.5l3.4-2l3.4 2l3.4-2l3.4 2l3.4-2l3.4 2l3.4-2M13 16.5l3.7-2l3.7 2l3.7-2l3.7 2l3.7-2"/>',
 11:'<path d="M24 7C28.5 11 28.5 15.5 24 18C19.5 15.5 19.5 11 24 7Z"/><path d="M24 16C30.5 19.5 30.5 25 24 27.5C17.5 25 17.5 19.5 24 16Z"/><path d="M24 25.5C31.5 29 31.5 34 24 36.5C16.5 34 16.5 29 24 25.5Z"/><path d="M24 36.5V45M24 45C14 41 8 33 7 25C14 29 20 35 24 45ZM24 45C34 41 40 33 41 25C34 29 28 35 24 45Z"/>',
 12:'<g transform="rotate(30 24 24)"><ellipse cx="24" cy="24" rx="11.5" ry="17"/><path d="M24 7.5C18 17 30 31 24 40.5"/></g>',
 13:'<path d="M9 20H39L35 43H13Z"/><path d="M17 20L18 43M24 20V43M31 20L30 43M10.5 28H37.5M11.8 35.5H36.2"/><path d="M14 20C14 5 34 5 34 20"/>',
 14:'<rect x="7" y="7" width="34" height="34" rx="2"/><path d="M24 11L33 24L24 37L15 24Z"/><path d="M24 18L28 24L24 30L20 24Z"/><path d="M7 15l8 9l-8 9M41 15l-8 9l8 9"/>'
};
let _bid=0;
function badge(p,{spin=false,label=true}={}){
  const k=++_bid,pa=p.pa,nm=p.name,fs=nm.length>11?12.5:nm.length>8?14:16;
  return`<svg class="bdg${spin?' spin':''}" viewBox="0 0 200 200" role="img" aria-label="ตราสินค้า ${esc(nm)}">
  <defs><path id="rp${k}" d="M100,100m-80,0a80,80 0 1,1 160,0a80,80 0 1,1 -160,0"/></defs>
  <circle cx="100" cy="100" r="99" fill="${pa}"/><circle cx="100" cy="100" r="93" fill="none" stroke="#fff" stroke-opacity=".35"/>
  <g class="ring"><text fill="#fff" font-family="Kanit, sans-serif" font-weight="500" font-size="12.5" letter-spacing="2"><textPath href="#rp${k}" textLength="492" lengthAdjust="spacing">NONG BUA LAM PHU · LOCAL IDENTITY · 12 PLUS+ · </textPath></text></g>
  <circle cx="100" cy="100" r="66" fill="#FBF7EE"/><circle cx="100" cy="100" r="61" fill="none" stroke="${pa}" stroke-opacity=".25"/>
  <g transform="translate(100 ${label?80:100}) scale(${label?1.45:1.9}) translate(-24 -24)" fill="none" stroke="${pa}" color="${pa}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${ICON[p.id]}</g>
  ${label?`<text x="100" y="134" text-anchor="middle" font-family="Kanit, sans-serif" font-weight="600" font-size="${fs}" fill="#16241D">${esc(nm)}</text>
  <text x="100" y="150" text-anchor="middle" font-family="Fraunces, Georgia, serif" font-style="italic" font-size="11" fill="${pa}">No. ${pad2(p.id)}</text>`:''}</svg>`;
}
const IMG=(kind,id)=>`img/${kind}-${pad2(id)}.webp`;

/* ---------- period ---------- */
const S=Object.assign({mode:SET.mode||'Y',y:LAST.y,m:LAST.m},store.sget('nbl12-period',{}));
function savePeriod(){store.sset('nbl12-period',{mode:S.mode,y:S.y,m:S.m})}
function months(){if(S.mode==='M')return[S.m-1];const n=S.y===LAST.y?LAST.m:12;return[...Array(n).keys()]}
function periodVal(p,y){if(!p.m[y])return null;return sum(months().map(k=>p.m[y][k]))}
function periodLabel(){const ce=y=>EN_MODE()?y-543:y;if(S.mode==='M')return MOF()[S.m-1]+' '+ce(S.y);return S.y===LAST.y?L('ปี ','')+ce(S.y)+' ('+MO()[0]+'–'+MO()[LAST.m-1]+')':L('ปี ','')+ce(S.y)}
function prevLabel(){const ce=y=>EN_MODE()?y-543:y;return S.mode==='M'?MO()[S.m-1]+' '+ce(S.y-1):(S.y===LAST.y?L('ช่วงเดียวกันปี ','same period ')+ce(S.y-1):L('ปี ','')+ce(S.y-1))}

/* ---------- routing (ไร้รอยต่อ) ---------- */
const PAGES={cover:{f:'index.html',t:'หน้าหลัก',en:'Home',ic:'home'},overview:{f:'overview.html',t:'ภาพรวม 14 สินค้า',en:'Overview',ic:'grid'},
  insights:{f:'insights.html',t:'วิเคราะห์เชิงกลยุทธ์',en:'Strategic insights',ic:'chart'},map:{f:'map.html',t:'แผนที่แหล่งผลิต',en:'Production map',ic:'map'},brief:{f:'brief.html',t:'สรุป 1 หน้า (A4)',en:'One-page brief',ic:'print'},
  report:{f:'report.html',t:'รายงานและบทวิเคราะห์',en:'Report & analysis',ic:'report'},sources:{f:'sources.html',t:'แหล่งข้อมูลและที่มา',en:'Data sources',ic:'source'},
  apistatus:{f:'apistatus.html',t:'สถานะการเชื่อมต่อข้อมูล (API)',en:'API status',ic:'api'},entry:{f:'entry.html',t:'กรอกข้อมูล',en:'Data entry',ic:'lock'},settings:{f:'settings.html',t:'ตั้งค่าระบบ',en:'Settings',ic:'gear'}};
const PT=k=>L(PAGES[k].t,PAGES[k].en);
const pFile=id=>`p${pad2(id)}.html`;
function parse(href){
  let u;try{u=new URL(href,location.href)}catch(e){return null}
  const f=(u.pathname.split('/').pop()||'index.html').replace(/\.html$/,'');
  const m=f.match(/^p(\d{2})$/);if(m&&byId(+m[1]))return{page:'product',pid:+m[1],q:u.searchParams};
  const pg=Object.keys(PAGES).find(k=>PAGES[k].f===f+'.html');return pg?{page:pg,q:u.searchParams}:null;
}
let R=parse(location.href)||{page:document.body.dataset.page||'cover',pid:+document.body.dataset.pid||0,q:new URLSearchParams()};
if(document.body.dataset.page&&R.page!==document.body.dataset.page){R={page:document.body.dataset.page,pid:+document.body.dataset.pid||0,q:new URLSearchParams(location.search)}}
function hrefFor(r){return r.page==='product'?pFile(r.pid):PAGES[r.page].f}
function go(href,push=true){
  const r=typeof href==='string'?parse(href):href;if(!r){location.href=href;return}
  const run=()=>{R=r;if(push){try{history.pushState({},'',hrefFor(r)+(r.q&&String(r.q)?'?'+r.q:''))}catch(e){}}render();window.scrollTo(0,0)};
  document.body.classList.remove('nav-open');
  if(document.startViewTransition&&!matchMedia('(prefers-reduced-motion: reduce)').matches)document.startViewTransition(run);else run();
}
document.addEventListener('click',e=>{
  const a=e.target.closest('a[href]');if(!a||a.target||e.ctrlKey||e.metaKey||e.shiftKey||a.hasAttribute('download'))return;
  const h=a.getAttribute('href');if(/^(https?:|mailto:|tel:|#)/.test(h))return;
  const r=parse(h);if(!r)return;e.preventDefault();go(r);
});
addEventListener('popstate',()=>{const r=parse(location.href);if(r){R=r;render()}});

/* ---------- charts registry ---------- */
const charts=[];
function killCharts(){while(charts.length)charts.pop().destroy()}
function mk(id,cfg){const c=document.getElementById(id);if(!c||!window.Chart)return;charts.push(new Chart(c,cfg))}
function baseOpts(extra={}){const ink=css('--muted'),line=css('--line');
  return Object.assign({responsive:true,maintainAspectRatio:false,animation:{duration:500},
    plugins:{legend:{labels:{color:ink,font:{family:'Kanit',size:12},boxWidth:12,boxHeight:12,usePointStyle:true}},
      tooltip:{titleFont:{family:'Kanit'},bodyFont:{family:'Sarabun'},callbacks:{label:c=>' '+c.dataset.label+': '+fB(c.raw)}}},
    scales:{x:{grid:{display:false},ticks:{color:ink,font:{family:'Kanit',size:11}},border:{color:line}},
      y:{grid:{color:line},border:{display:false},ticks:{color:ink,font:{family:'Kanit',size:11},callback:v=>fShort(v)}}}},extra)}

/* ---------- shell ---------- */
function shell(){
  if($('.app'))return;
  document.body.insertAdjacentHTML('afterbegin',`
  <div class="app">
    <aside class="side" id="side" aria-label="เมนูหลัก">
      <a class="brand" href="index.html"><img src="img/seal.png" alt="ตราจังหวัดหนองบัวลำภู"><span><span class="wm">12 Plus<sup>+</sup></span><span class="th">สินค้าอัตลักษณ์หนองบัวลำภู</span><span class="sub">Dashboard เกษตรมูลค่าสูง</span></span></a>
      <button class="side-search" type="button" data-act="search">${ic('search')}<span id="sideSearchT">ค้นหาสินค้า ข้อมูล หน้า</span><kbd>Ctrl K</kbd></button>
      <nav class="nav" id="navMain"></nav>
      <div class="nav-t"><span id="navT1">สินค้าอัตลักษณ์</span><span>14</span></div>
      <nav class="nav pnav" id="navP"></nav>
      <div class="nav-t"><span id="navT2">ข้อมูลและระบบ</span></div>
      <nav class="nav" id="navSys"></nav>
      <div class="side-foot">จัดทำโดย สำนักงานสถิติจังหวัดหนองบัวลำภู<br>ร่วมกับหน่วยงานเจ้าของข้อมูล 14 สินค้า<br>© 2569 สงวนลิขสิทธิ์</div>
    </aside>
    <div class="scrim" id="scrim"></div>
    <div class="main">
      <header class="top">
        <button class="tb ic-only menu-btn" type="button" data-act="menu" aria-label="เปิดเมนู">${ic('menu')}</button>
        <div class="asof"><b id="asofT">ข้อมูล ณ ${APP.asOf}</b><span>${APP.fy} · build ${APP.build}</span></div>
        <div class="ctrls" id="period"></div>
        <div class="ctrls">
          <button class="tb ic-only" type="button" data-act="search" title="ค้นหา (Ctrl K)" aria-label="ค้นหา">${ic('search')}</button>
          <button class="tb ic-only tb-hide" type="button" data-act="edit" title="แก้ไขข้อมูลหน้านี้" aria-label="แก้ไขข้อมูล">${ic('edit')}</button>
          <button class="tb keep" type="button" data-act="lang" title="ภาษาไทย / English (L)" aria-label="สลับภาษา">${ic('globe')}<span>TH</span></button>
          <button class="tb ic-only keep" type="button" data-act="theme" title="สลับธีม (T)" aria-label="สลับธีม">${ic('sun')}</button>
          <button class="tb tb-hide" type="button" data-act="kiosk" title="เปลี่ยนหน้าอัตโนมัติสำหรับจอห้องประชุม (K)">${ic('monitor')}<span class="lbl" data-l="จอนำเสนอ" data-e="Kiosk">จอนำเสนอ</span></button>
          <button class="tb tb-hide keep" type="button" data-act="present" title="นำเสนอเต็มจอ ใช้ลูกศรเปลี่ยนหน้า (P)">${ic('play')}<span class="lbl" data-l="นำเสนอ" data-e="Present">นำเสนอ</span></button>
          <a class="tb api tb-hide" href="apistatus.html" title="สถานะการเชื่อมต่อข้อมูล">${ic('db')}<span class="lbl">API</span></a>
          <button class="tb ic-only" type="button" data-act="bell" title="การแจ้งเตือน" aria-label="การแจ้งเตือน">${ic('bell')}<i class="dot" id="bellDot" hidden></i></button>
          <button class="tb ic-only tb-hide" type="button" data-act="link" title="คัดลอกลิงก์หน้านี้" aria-label="คัดลอกลิงก์">${ic('link')}</button>
          <button class="tb ic-only tb-hide" type="button" data-act="print" title="พิมพ์ / บันทึก PDF" aria-label="พิมพ์">${ic('print')}</button>
          <a class="tb lock tb-hide" href="entry.html">${ic('lock')}<span class="lbl" data-l="กรอกข้อมูล" data-e="Data entry">กรอกข้อมูล</span></a>
          <button class="tb ic-only tb-hide" type="button" data-act="help" title="คู่มือและคีย์ลัด (?)" aria-label="คู่มือ">${ic('help')}</button>
          <button class="tb ic-only tb-more" type="button" data-act="more" aria-label="เมนูเพิ่มเติม">${ic('more')}</button>
        </div>
      </header>
      <main class="page" id="page"></main>
      <footer class="foot" id="foot"></footer>
    </div>
  </div>`);
  $('#foot').innerHTML=`<div class="foot-in">
    <div class="who"><img src="img/seal.png" alt=""><div>
      <b>สำนักงานจังหวัดหนองบัวลำภู</b><br>
      ศาลากลางจังหวัดหนองบัวลำภู ชั้น 4 ถ.หนองบัวลำภู – เลย<br>
      ต.ลำภู อ.เมือง จ.หนองบัวลำภู 39000</div></div>
    <div><b>หน่วยงานเจ้าของข้อมูล</b><div class="ag">${AGENCIES.map(a=>`<span>${a}</span>`).join('')}</div></div>
    <div class="copy">© 2569 สำนักงานสถิติจังหวัดหนองบัวลำภู สงวนลิขสิทธิ์</div></div>`;
  document.addEventListener('click',onAct);
  $('#scrim').onclick=()=>document.body.classList.remove('nav-open');
  updateBell();
}
function navRender(){
  const cur=R.page;
  $('#navMain').innerHTML=['cover','overview','insights','map'].map(k=>`<a href="${PAGES[k].f}"${cur===k?' aria-current="page"':''}>${ic(PAGES[k].ic)}${PT(k)}</a>`).join('');
  $('#navT1').textContent=L('สินค้าอัตลักษณ์','Identity products');$('#navT2').textContent=L('ข้อมูลและระบบ','Data & system');
  document.documentElement.lang=EN_MODE()?'en':'th';
  $('#navP').innerHTML=P.map(p=>{const c=periodVal(p,S.y),q=periodVal(p,S.y-1),g=q?c/q-1:null;
    return`<a href="${pFile(p.id)}"${R.page==='product'&&R.pid===p.id?' aria-current="page"':''}><span class="no">${pad2(p.id)}</span>${badge(p,{label:false})}<span class="n">${esc(pname(p))}${giTag(p,'sm')}<span class="v num">${fB(c)}</span></span>${g==null?'':`<span class="g ${g>=0?'up':'down'}">${g>=0?'▲':'▼'}${Math.abs(g*100).toFixed(1)}%</span>`}</a>`}).join('');
  $('#navSys').innerHTML=['report','brief','sources','apistatus','entry','settings'].map(k=>`<a href="${PAGES[k].f}"${cur===k?' aria-current="page"':''}>${ic(PAGES[k].ic)}${PT(k)}</a>`).join('');
  const per=['overview','product','report','insights','map','brief'].includes(cur);
  const maxM=S.y===LAST.y?LAST.m:12;if(S.m>maxM)S.m=maxM;
  $('#period').innerHTML=per?`<div class="seg" role="group" aria-label="มุมมอง"><button type="button" data-act="mY" aria-pressed="${S.mode==='Y'}">${L('รายปี','Yearly')}</button><button type="button" data-act="mM" aria-pressed="${S.mode==='M'}">${L('รายเดือน','Monthly')}</button></div>
    <select class="sel" id="selY" aria-label="ปี">${YEARS.slice(1).map(y=>`<option value="${y}"${y===S.y?' selected':''}>${L('ปี '+y,String(y-543))}</option>`).join('')}</select>
    ${S.mode==='M'?`<select class="sel" id="selM" aria-label="เดือน">${MOF().slice(0,maxM).map((m,i)=>`<option value="${i+1}"${i+1===S.m?' selected':''}>${m}</option>`).join('')}</select>`:''}`:'';
  if(per){$('#selY').onchange=e=>{S.y=+e.target.value;savePeriod();render(true)};const sm=$('#selM');if(sm)sm.onchange=e=>{S.m=+e.target.value;savePeriod();render(true)}}
  const th=$('[data-act="theme"]');if(th)th.innerHTML=ic(isDark()?'moon':'sun');
  const lg=$('[data-act="lang"]');if(lg)lg.innerHTML=`${ic('globe')}<span>${EN_MODE()?'EN':'TH'}</span>`;
  $('#asofT').textContent=L('ข้อมูล ณ '+APP.asOf,'Data as of 30 Sep 2026');
  $$('.tb [data-l]').forEach(x=>x.textContent=L(x.dataset.l,x.dataset.e));
  const cp=$('.pnav a[aria-current]');if(cp&&cp.scrollIntoViewIfNeeded)cp.scrollIntoViewIfNeeded(false);
}

/* ---------- actions ---------- */
function onAct(e){
  const b=e.target.closest('[data-act]');if(!b)return;const a=b.dataset.act;
  if(a==='menu')document.body.classList.add('nav-open');
  else if(a==='search')palette();
  else if(a==='theme'){SET.theme=isDark()?'light':'dark';saveSet();render(true)}
  else if(a==='lang'){SET.lang=EN_MODE()?'th':'en';saveSet();render(true);toast(EN_MODE()?'English · indicator names remain in Thai':'ภาษาไทย')}
  else if(a==='kiosk')kioskStart();
  else if(a==='present')presentToggle();
  else if(a==='bell')drawer();
  else if(a==='link')copyText(location.href,'คัดลอกลิงก์หน้านี้แล้ว');
  else if(a==='print')window.print();
  else if(a==='help')help();
  else if(a==='edit')go('entry.html'+(R.page==='product'?'?p='+R.pid:''));
  else if(a==='more')moreMenu();
  else if(a==='mY'){S.mode='Y';savePeriod();render(true)}
  else if(a==='mM'){S.mode='M';savePeriod();render(true)}
}
function toast(msg){$$('.toast').forEach(t=>t.remove());const t=document.createElement('div');t.className='toast';t.textContent=msg;document.body.appendChild(t);setTimeout(()=>t.remove(),2200)}
async function copyText(txt,ok='คัดลอกแล้ว'){try{await navigator.clipboard.writeText(txt);toast(ok)}catch(e){const ta=document.createElement('textarea');ta.value=txt;document.body.appendChild(ta);ta.select();try{document.execCommand('copy');toast(ok)}catch(x){toast('คัดลอกไม่สำเร็จ กรุณาคัดลอกด้วยตนเอง')}ta.remove()}}
function download(name,text,type='text/csv'){const b=new Blob([type.includes('csv')?'﻿'+text:text],{type:type+';charset=utf-8'});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500);toast('กำลังดาวน์โหลด '+name)}
const csvRow=a=>a.map(v=>{v=v==null?'':String(v);return/[",\n]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v}).join(',');
function overlay(html,cls='dlg'){closeOverlay();const o=document.createElement('div');o.className='ovl';o.innerHTML=`<div class="${cls}" role="dialog" aria-modal="true">${html}</div>`;o.addEventListener('click',e=>{if(e.target===o||e.target.closest('[data-close]'))closeOverlay()});document.body.appendChild(o);return o}
function closeOverlay(){$$('.ovl,.drawer,.lb').forEach(x=>x.remove())}

function palette(){
  const items=[...Object.keys(PAGES).map(k=>({t:PT(k),k:'หน้า',h:PAGES[k].f,i:PAGES[k].ic})),
    ...P.map(p=>({t:`${pad2(p.id)} ${p.name}`,s:p.en+' · '+p.agency+(p.gi?' · GI':''),k:'สินค้า',h:pFile(p.id),p})),
    ...P.flatMap(p=>p.inds.map(d=>({t:d.n,s:`${p.name} · ${d.code}`,k:'รายการข้อมูล',h:pFile(p.id)+'#ind-'+d.code})))];
  const o=overlay(`<input class="pal-in" id="palIn" placeholder="พิมพ์ชื่อสินค้า รายการข้อมูล หรือหน้า…" autocomplete="off" aria-label="ค้นหา"><ul class="pal-l" id="palL" role="listbox"></ul>`);
  let sel=0,list=[];
  const draw=q=>{q=q.trim().toLowerCase();list=(q?items.filter(x=>(x.t+' '+(x.s||'')).toLowerCase().includes(q)):items.slice(0,22)).slice(0,40);sel=0;
    $('#palL').innerHTML=list.length?list.map((x,i)=>`<li><a href="${x.h}" aria-selected="${i===sel}">${x.p?badge(x.p,{label:false}):ic(x.i||'report')}<span>${esc(x.t)}${x.s?`<br><small>${esc(x.s)}</small>`:''}</span><span class="k">${x.k}</span></a></li>`).join(''):'<li style="padding:14px;color:var(--muted)">ไม่พบรายการที่ค้นหา</li>';
    $$('#palL .bdg').forEach(b=>{b.style.width='26px';b.style.height='26px'})};
  const inp=$('#palIn');draw('');inp.focus();
  inp.oninput=()=>draw(inp.value);
  inp.onkeydown=e=>{if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();sel=(sel+(e.key==='ArrowDown'?1:-1)+list.length)%list.length;$$('#palL a').forEach((a,i)=>a.setAttribute('aria-selected',i===sel));$$('#palL a')[sel]?.scrollIntoView({block:'nearest'})}
    if(e.key==='Enter'&&list[sel]){e.preventDefault();closeOverlay();const h=list[sel].h;go(h.split('#')[0]);if(h.includes('#'))setTimeout(()=>{const el=document.getElementById(h.split('#')[1]);if(el){el.scrollIntoView({behavior:'smooth',block:'center'});el.animate([{boxShadow:'0 0 0 3px var(--gold)'},{boxShadow:'0 0 0 0 transparent'}],{duration:1800})}},450)}};
  $('#palL').addEventListener('click',()=>closeOverlay());
}
function help(tab='use'){
  const T={use:`<ol style="margin:0;padding-left:20px;display:grid;gap:8px">
      <li>เลือกสินค้าจากเมนูซ้าย หรือกดการ์ดในหน้า <b>ภาพรวม</b></li>
      <li>เลือก <b>รายปี/รายเดือน</b> และปีที่แถบด้านบน ตัวเลขทุกหน้าจะเปลี่ยนตาม</li>
      <li>ในหน้าสินค้า ส่วน <b>เส้นทางของสินค้า</b> สลับดูเป็น <b>ภาพ</b> หรือ <b>ตาราง</b> ได้ และดาวน์โหลด CSV</li>
      <li>ปุ่ม <b>นำเสนอ</b> เปิดเต็มจอ ใช้ลูกศรซ้าย/ขวาเปลี่ยนสินค้า · ปุ่ม <b>จอนำเสนอ</b> เปลี่ยนหน้าอัตโนมัติสำหรับจอห้องประชุม</li>
      <li>ปุ่ม <b>API</b> ดูว่าตัวเลขแต่ละรายการมาจากไหน และเชื่อมต่อระบบบัญชีข้อมูลจังหวัดแล้วหรือยัง</li>
      <li>หน่วยงานส่งข้อมูลได้ที่ <b>กรอกข้อมูล</b> ทีละสินค้า ทีละหมวด</li></ol>`,
    keys:`<div class="keys"><span><kbd>Ctrl</kbd> + <kbd>K</kbd> หรือ <kbd>/</kbd></span><span>ค้นหา</span><span><kbd>?</kbd></span><span>เปิดคู่มือนี้</span><span><kbd>T</kbd></span><span>สลับธีมสว่าง/มืด</span><span><kbd>L</kbd></span><span>สลับภาษาไทย / English</span><span><kbd>P</kbd></span><span>เริ่ม/หยุดโหมดนำเสนอ</span><span><kbd>K</kbd></span><span>เริ่มจอนำเสนออัตโนมัติ</span><span><kbd>←</kbd> <kbd>→</kbd></span><span>สินค้าก่อนหน้า/ถัดไป</span><span><kbd>G</kbd> แล้ว <kbd>O</kbd></span><span>ไปหน้าภาพรวม</span><span><kbd>Esc</kbd></span><span>ปิดหน้าต่าง / หยุดนำเสนอ</span></div>`,
    legend:`<div style="display:grid;gap:10px;font-size:14px"><div><span class="pill real">ข้อมูลจริง</span> ค่าที่หน่วยงานส่งมาแล้ว</div><div><span class="pill api">API</span> ดึงจากระบบบัญชีข้อมูลจังหวัดอัตโนมัติ</div><div><span class="pill has">มีข้อมูล</span> หน่วยงานยืนยันว่ามีข้อมูล รอส่งค่า (แสดงค่าจำลอง)</div><div><span class="pill sim">จำลอง</span> รอหน่วยงานยืนยัน แสดงค่าจำลองเพื่อดูรูปแบบ</div><div><span class="pill none">ไม่มีข้อมูล</span> หน่วยงานแจ้งว่ายังไม่มีข้อมูล</div></div>`};
  const o=overlay(`<div class="dlg-h"><h3>คู่มือการใช้งาน</h3><button class="tb ic-only" data-close aria-label="ปิด">${ic('x')}</button></div><div class="dlg-b"><div class="tabs" role="tablist">${[['use','วิธีใช้'],['keys','คีย์ลัด'],['legend','ความหมายสถานะ']].map(([k,t])=>`<button role="tab" data-tab="${k}" aria-selected="${k===tab}">${t}</button>`).join('')}</div><div id="helpB">${T[tab]}</div></div>`);
  $$('[data-tab]',o).forEach(b=>b.onclick=()=>{$$('[data-tab]',o).forEach(x=>x.setAttribute('aria-selected',x===b));$('#helpB').innerHTML=T[b.dataset.tab]});
}
function drawer(){closeOverlay();const seen=store.get('nbl12-seen',0);const L=notices();
  const d=document.createElement('aside');d.className='drawer';d.setAttribute('aria-label','การแจ้งเตือน');
  d.innerHTML=`<div class="dlg-h"><h3>การแจ้งเตือน</h3><button class="tb ic-only" data-close aria-label="ปิด">${ic('x')}</button></div><ul>${L.map(x=>`<li class="${x.t>seen?'new':''}"><i></i><span>${esc(x.msg)}${x.t?`<time>${new Date(x.t).toLocaleString('th-TH')}</time>`:''}</span></li>`).join('')}</ul>`;
  d.addEventListener('click',e=>{if(e.target.closest('[data-close]'))d.remove()});document.body.appendChild(d);store.set('nbl12-seen',Date.now());updateBell()}
function moreMenu(){const acts=[['edit','แก้ไขข้อมูลหน้านี้','edit'],['kiosk','จอนำเสนออัตโนมัติ','monitor'],['present','นำเสนอเต็มจอ','play'],['link','คัดลอกลิงก์','link'],['print','พิมพ์ / บันทึก PDF','print'],['help','คู่มือและคีย์ลัด','help']];
  overlay(`<div class="dlg-h"><h3>เครื่องมือ</h3><button class="tb ic-only" data-close aria-label="ปิด">${ic('x')}</button></div><div class="dlg-b" style="display:grid;gap:8px">
  <a class="btn btn-f" href="apistatus.html" data-close>${ic('db')} สถานะการเชื่อมต่อข้อมูล (API)</a><a class="btn btn-o" href="entry.html" data-close>${ic('lock')} กรอกข้อมูล</a>
  ${acts.map(([a,t,i])=>`<button class="btn btn-g" type="button" data-act="${a}" data-close>${ic(i)} ${t}</button>`).join('')}</div>`)}

/* ---------- kiosk & present ---------- */
const SEQ=()=>[{page:'overview'},{page:'insights'},{page:'map'},...P.map(p=>({page:'product',pid:p.id}))];
function seqIndex(){const s=SEQ();return Math.max(0,s.findIndex(x=>x.page===R.page&&(x.pid||0)===(R.pid||0)))}
function step(d){const s=SEQ();const i=(seqIndex()+d+s.length)%s.length;go(Object.assign({q:new URLSearchParams()},s[i]))}
let kT=null;
function kioskStart(){store.sset('nbl12-kiosk',1);document.body.classList.add('kiosk');kioskTick();toast(`จอนำเสนอ: เปลี่ยนหน้าทุก ${SET.kioskSec} วินาที · กด Esc เพื่อหยุด`)}
function kioskTick(){clearTimeout(kT);$$('.kbar,.kstop').forEach(x=>x.remove());if(!store.sget('nbl12-kiosk',0))return;
  document.body.classList.add('kiosk');
  document.body.insertAdjacentHTML('beforeend',`<div class="kbar"><i></i></div><button class="btn btn-f kstop no-print" type="button" id="kStop">${ic('pause')} หยุดจอนำเสนอ</button>`);
  const bar=$('.kbar i');bar.animate([{width:'0%'},{width:'100%'}],{duration:SET.kioskSec*1000,fill:'forwards'});
  $('#kStop').onclick=kioskStop;kT=setTimeout(()=>step(1),SET.kioskSec*1000)}
function kioskStop(){store.sset('nbl12-kiosk',0);clearTimeout(kT);document.body.classList.remove('kiosk');$$('.kbar,.kstop').forEach(x=>x.remove());toast('หยุดจอนำเสนอแล้ว')}
function presentToggle(){if(document.body.classList.contains('present')){document.body.classList.remove('present');if(document.fullscreenElement)document.exitFullscreen().catch(()=>{});return}
  document.body.classList.add('present');document.documentElement.requestFullscreen?.().catch(()=>{});if(R.page==='cover')go('overview.html');toast('โหมดนำเสนอ: ใช้ลูกศร ← → เปลี่ยนหน้า · Esc เพื่อออก')}
document.addEventListener('fullscreenchange',()=>{if(!document.fullscreenElement)document.body.classList.remove('present')});
let gKey=0;
document.addEventListener('keydown',e=>{
  const typing=/INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName)||document.activeElement?.isContentEditable;
  if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();palette();return}
  if(e.key==='Escape'){if($('.ovl,.drawer,.lb')){closeOverlay();return}if(store.sget('nbl12-kiosk',0))kioskStop();if(document.body.classList.contains('present'))presentToggle();return}
  if(typing)return;
  if(e.key==='/'){e.preventDefault();palette()}else if(e.key==='?')help();else if(e.key==='t'||e.key==='T'){SET.theme=isDark()?'light':'dark';saveSet();render(true)}
  else if(e.key==='p'||e.key==='P')presentToggle();else if(e.key==='k'||e.key==='K')kioskStart();
  else if((e.key==='ArrowRight'||e.key==='ArrowLeft')&&!$('.lb')&&['overview','product','insights','map'].includes(R.page)){step(e.key==='ArrowRight'?1:-1)}
  else if(e.key==='l'||e.key==='L'){SET.lang=EN_MODE()?'th':'en';saveSet();render(true)}
  else if(e.key==='g'){gKey=Date.now()}else if(e.key==='o'&&Date.now()-gKey<900)go('overview.html');
});

/* ---------- data source (API ระบบบัญชีข้อมูลจังหวัด / CKAN) ---------- */
const DS={
  cache:store.get('nbl12-cache',{}),
  base(){return(SET.apiBase||APP.apiBase).replace(/\/$/,'')},
  jsonp(url,ms=9000){return new Promise((res,rej)=>{const cb='__cb'+Math.random().toString(36).slice(2);const s=document.createElement('script');const t=setTimeout(()=>{clean();rej(new Error('timeout'))},ms);
    function clean(){clearTimeout(t);delete window[cb];s.remove()}window[cb]=d=>{clean();res(d)};s.onerror=()=>{clean();rej(new Error('network'))};s.src=url+(url.includes('?')?'&':'?')+'callback='+cb;document.head.appendChild(s)})},
  /* ระบบบัญชีข้อมูลจังหวัดให้บริการแบบ JSONP เป็นหลัก (เลี่ยงปัญหา CORS) ถ้าไม่สำเร็จจึงลอง fetch */
  async get(path){const url=this.base()+path;
    try{return await this.jsonp(url)}
    catch(e){const c=new AbortController();const t=setTimeout(()=>c.abort(),9000);const r=await fetch(url,{signal:c.signal});clearTimeout(t);if(!r.ok)throw new Error('HTTP '+r.status);return await r.json()}},
  async ping(){const t0=performance.now();const d=await this.get('/package_search?rows=0');return{ok:!!d?.success,count:d?.result?.count??null,ms:Math.round(performance.now()-t0)}},
  /* รูปแบบชุดข้อมูลที่คาดหวัง: code, year, month, value, unit, agency  (code ตามรหัสรายการ เช่น P01-104) */
  async loadProduct(p){const rid=(SET.res||{})[p.id];if(!rid)return{state:'wait'};
    try{const d=await this.get(`/datastore_search?resource_id=${encodeURIComponent(rid)}&limit=5000`);const rec=d?.result?.records||[];let n=0;
      rec.forEach(r=>{const code=r.code||r.indicator_code;const ind=p.inds.find(x=>x.code===code);if(ind&&r.value!==''&&r.value!=null){const v=+r.value;ind.val=isNaN(v)?r.value:v;ind.src='api';ind.apiYear=r.year;n++}});
      this.cache[p.id]={t:Date.now(),n,total:rec.length};store.set('nbl12-cache',this.cache);logAdd(`${p.name}: ดึงจาก API ${n} รายการ`,'api');return{state:'ok',n}}
    catch(e){this.cache[p.id]={t:Date.now(),err:String(e.message||e)};store.set('nbl12-cache',this.cache);return{state:'err',err:e.message}}},
  status(d){return d.src==='api'?'api':d.st==='R'?'real':d.st==='H'?'has':d.st==='N'?'none':'sim'}
};
const ST_LABEL={api:'API',real:'ข้อมูลจริง',has:'มีข้อมูล',sim:'จำลอง',none:'ไม่มีข้อมูล',wait:'รอข้อมูลเข้าระบบ'};
const pill=k=>`<span class="pill ${k}">${ST_LABEL[k]}</span>`;

/* ---------- render ---------- */
function render(keepScroll){
  killCharts();closeOverlay();
  const cover=R.page==='cover';document.body.classList.toggle('cover',cover);document.body.dataset.page=R.page;
  shell();navRender();
  const p=R.page==='product'?byId(R.pid):null;
  document.title=(p?`${pad2(p.id)} ${pname(p)}`:PT(R.page))+L(' · 12 Plus+ หนองบัวลำภู',' · 12 Plus+ Nong Bua Lam Phu');
  const sst=$('#sideSearchT');if(sst)sst.textContent=L('ค้นหาสินค้า ข้อมูล หน้า','Search products, data, pages');
  const page=$('#page');page.style.setProperty('--pa',p?p.pa:css('--forest')||'#0F4A37');page.style.setProperty('--pa-ink',p?(isDark()?hexMix(p.pa,.35):hexMix(p.pa,-.12)):'');
  (PAGE_R[R.page]||PAGE_R.cover)(page,p);
  if(store.sget('nbl12-kiosk',0))kioskTick();
}
document.addEventListener('DOMContentLoaded',()=>{if(window.Chart){Chart.defaults.font.family='Kanit, Sarabun, sans-serif'}render();
  matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change',()=>render(true));
  if(document.fonts)document.fonts.ready.then(()=>{if(['overview','product','report','sources','apistatus','insights','map','brief'].includes(R.page))render(true)});
});
