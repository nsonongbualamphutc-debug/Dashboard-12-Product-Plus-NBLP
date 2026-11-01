/* ---------- ระบบค้นหาครอบคลุม (Ctrl K / ปุ่มค้นหา) ---------- */
(function(){
if(typeof palette!=='function')return;
const STG=['ต้นน้ำ','กลางน้ำ','ปลายน้ำ'];
const norm=s=>String(s==null?'':s).toLowerCase().replace(/[\s​·\-_/(),.“”"']+/g,'').replace(/ํา/g,'ำ');
let IDX=null;
function build(){
  const X=[];const add=o=>{o.n=norm(o.t);o.ns=norm((o.s||'')+' '+(o.x||''));X.push(o)};
  Object.keys(PAGES).forEach(k=>add({k:'page',t:PT(k),s:PAGES[k].en||'',h:PAGES[k].f,i:PAGES[k].ic}));
  P.forEach(p=>add({k:'prod',t:`${pad2(p.id)} ${p.name}`,s:[p.en,p.agency,p.gi?'GI':''].filter(Boolean).join(' · '),x:[p.tagline,(p.hl||[]).join(' '),p.code].join(' '),h:pFile(p.id),p}));
  const DSI={};DATASETS.forEach(d=>DSI[d.code]=d);
  P.forEach(p=>p.inds.forEach(d=>{const ds=DSI[d.code];
    const types=ds?ds.types||[]:[];const real=!!(ds&&((ds.rows||[]).some(r=>+r[3])||(ds.list&&ds.list.rows.length)));
    add({k:'ind',t:d.n,s:`${p.name} · ${d.code} · ${STG[d.s]}${d.u?' · '+d.u:''}`,x:[d.code,d.ag,ds&&ds.source,ds&&ds.item,ds&&ds.file,types.join(' '),(ds&&ds.years||[]).join(' '),CHAPTERS[d.s]&&CHAPTERS[d.s].t,typeof ITEM_EN!=='undefined'?ITEM_EN[d.n]:''].filter(Boolean).join(' '),h:pFile(p.id)+'#sb-'+d.code,p,code:d.code,real,types});
    if(ds&&ds.list&&ds.list.rows){const L=ds.list,ni=L.cols.findIndex(c=>/^รายชื่อ|ชื่อ/.test(c)),ai=L.cols.findIndex(c=>/ที่อยู่|ที่ตั้ง|สถานที่/.test(c)),di=L.cols.indexOf('อำเภอ');
      const seen=new Set();L.rows.forEach(r=>{const nm=ni>=0?r[ni]:null;if(!nm||typeof nm!=='string'||seen.has(nm))return;seen.add(nm);
        add({k:'list',t:nm,s:`${d.n} · ${p.name}${di>=0&&r[di]?' · อ.'+r[di]:''}`,x:[ai>=0?r[ai]:'',r.filter(v=>typeof v==='string').join(' ')].join(' '),h:pFile(p.id)+'#sb-'+d.code,p,code:d.code})})}
  }));
  Object.entries(typeof SHOPS!=='undefined'?SHOPS:{}).forEach(([id,L])=>{const p=P.find(x=>x.id==id);(L||[]).forEach(s=>add({k:'shop',t:s.nick||s.name,s:`${s.name&&s.name!==s.nick?s.name+' · ':''}${p?p.name:''}`,x:[s.addr,s.tel,s.fbName].join(' '),h:pFile(+id)+'#shops',p}))});
  (typeof DISTRICTS!=='undefined'?DISTRICTS:[]).forEach(d=>add({k:'dist',t:'อำเภอ'+d.replace(/^อำเภอ/,''),s:'แผนที่ข้อมูลรายอำเภอ',x:d,h:PAGES.map?PAGES.map.f:'map.html',i:'map'}));
  return X}
const KL={page:['หน้า','Page'],prod:['สินค้า','Product'],ind:['รายการข้อมูล','Data item'],list:['รายชื่อ','Listing'],shop:['ร้านค้า','Shop'],dist:['อำเภอ','District']};
const ORD={ind:0,prod:1,list:2,shop:3,dist:4,page:5};
function search(q,f){if(!IDX)IDX=build();const raw=q.trim();
  if(!raw)return IDX.filter(x=>x.k==='page'||x.k==='prod').slice(0,30);
  const toks=raw.split(/\s+/).map(norm).filter(Boolean);const nq=norm(raw);
  const out=[];
  for(const x of IDX){if(f&&f!=='all'&&x.k!==f)continue;
    let sc=0,hit=true,why='';
    for(const t of toks){if(x.n.includes(t))sc+=x.n.startsWith(t)?30:20;else if(x.ns.includes(t))sc+=8;else{hit=false;break}}
    if(!hit){/* ลองแบบไม่สนช่องว่าง */if(nq.length>=2&&(x.n+x.ns).includes(nq))sc=6;else continue}
    if(x.n===nq||(x.k==="dist"&&x.n.includes(nq)))sc+=60;if(x.code&&norm(x.code)===nq)sc+=80;
    if(x.types&&x.types.length){const m=x.types.find(t=>toks.every(k=>norm(t).includes(k)));if(m){why=m;sc+=4}}
    out.push({x,sc,why})}
  out.sort((a,b)=>b.sc-a.sc||ORD[a.x.k]-ORD[b.x.k]);return out.slice(0,80)}
function hl(t,q){let s=esc(t);q.trim().split(/\s+/).filter(Boolean).forEach(w=>{const i=s.toLowerCase().indexOf(w.toLowerCase());if(i>=0&&w.length>0)s=s.slice(0,i)+'<mark>'+s.slice(i,i+w.length)+'</mark>'+s.slice(i+w.length)});return s}
const css=`.pal2 .pal-top{display:flex;align-items:center;gap:8px;border-bottom:1px solid var(--line);padding-right:12px}
.pal2 .pal-in{border-bottom:0;flex:1}
.pal2 .pal-cnt{font-size:12px;color:var(--muted);white-space:nowrap}
.pal2 .pal-f{display:flex;gap:6px;flex-wrap:wrap;padding:10px 12px 4px}
.pal2 .pal-f button{font:inherit;font-size:12.5px;padding:5px 11px;border-radius:99px;border:1px solid var(--line);background:var(--surface);color:var(--ink);cursor:pointer}
.pal2 .pal-f button[aria-pressed="true"]{background:var(--pink-500);border-color:var(--pink-500);color:#fff}
.pal2 .pal-f button b{font-weight:600;opacity:.75;margin-left:4px}
.pal2 .pal-l{max-height:min(60vh,560px)}
.pal2 .pal-l mark{background:color-mix(in srgb,var(--gold) 35%,transparent);color:inherit;border-radius:3px;padding:0 1px}
.pal2 .pal-l .pal-why{display:inline-block;margin-top:3px;font-size:11px;padding:1px 7px;border-radius:99px;background:var(--surface-3);color:var(--ink)}
.pal2 .pal-l .pal-dt{display:inline-block;width:7px;height:7px;border-radius:50%;margin-right:5px;vertical-align:middle}
.pal2 .pal-tip{padding:8px 14px 12px;font-size:12px;color:var(--muted);border-top:1px solid var(--line)}
@keyframes palFlash{0%{box-shadow:0 0 0 4px var(--gold)}100%{box-shadow:0 0 0 0 transparent}}
.pal-flash{animation:palFlash 2.2s ease-out}`;
function jump(it){closeOverlay();const h=it.x.h;
  try{if(it.x.code&&it.why&&typeof STY!=='undefined'){const parts=it.why.replace(/ \(([^()]+)\)$/,'').split(' · ');STY.tsel=STY.tsel||{};STY.tsel[it.x.code]=parts}}catch(e){}
  const hash=h.includes('#')?h.split('#')[1]:'';const samePage=location.pathname.endsWith(h.split('#')[0]);
  const focus=()=>{const el=hash&&document.getElementById(hash);if(!el)return;
    if(it.why&&typeof styRe==='function'&&el.classList.contains('stb'))try{styRe(it.x.code)}catch(e){}
    const e2=document.getElementById(hash);e2.scrollIntoView({behavior:'smooth',block:'start'});e2.classList.remove('pal-flash');void e2.offsetWidth;e2.classList.add('pal-flash')};
  if(samePage&&hash){focus();return}
  go(h);if(hash){setTimeout(focus,700);setTimeout(focus,1500)}}
palette=function(){
  if(!document.getElementById('pal2-css')){const s=document.createElement('style');s.id='pal2-css';s.textContent=css;document.head.appendChild(s)}
  overlay(`<div class="pal-top"><input class="pal-in" id="palIn" placeholder="${L('ค้นหาสินค้า รายการข้อมูล รหัส ประเภท หน่วยงาน ร้านค้า อำเภอ…','Search products, items, codes, types, agencies, shops…')}" autocomplete="off" aria-label="${L('ค้นหา','Search')}"><span class="pal-cnt" id="palC"></span></div>
    <div class="pal-f" id="palF"></div><ul class="pal-l" id="palL" role="listbox"></ul>
    <div class="pal-tip">${L('พิมพ์หลายคำเว้นวรรคเพื่อค้นหาให้แคบลง เช่น “ราคา เห็ด” · ค้นด้วยรหัสได้ เช่น P07-104 · ↑↓ เลือก · Enter เปิด','Use several words to narrow, e.g. “price mushroom” · codes like P07-104 · ↑↓ · Enter')}</div>`,'dlg pal2');
  let sel=0,list=[],f='all';const inp=$('#palIn');
  const draw=()=>{const q=inp.value;const all=search(q,'all');const cnt={};all.forEach(r=>{const k=r.x?r.x.k:r.k;cnt[k]=(cnt[k]||0)+1});
    const res=q.trim()?all.filter(r=>f==='all'||r.x.k===f).map(r=>r):all.map(x=>({x,sc:0,why:''}));list=res;sel=0;
    $('#palC').textContent=q.trim()?L(`พบ ${all.length}${all.length>=80?'+':''} รายการ`,`${all.length} results`):'';
    $('#palF').innerHTML=q.trim()?[['all',L('ทั้งหมด','All'),all.length],...Object.keys(KL).filter(k=>cnt[k]).sort((a,b)=>ORD[a]-ORD[b]).map(k=>[k,L(...KL[k]),cnt[k]])].map(([k,t,n])=>`<button type="button" data-pf="${k}" aria-pressed="${k===f}">${t}<b>${n}</b></button>`).join(''):'';
    $('#palL').innerHTML=list.length?list.map((r,i)=>{const x=r.x;
      return`<li><a href="${x.h}" data-i="${i}" aria-selected="${i===sel}">${x.p?badge(x.p,{label:false}):ic(x.i||'search')}<span>${x.real===undefined?'':`<i class="pal-dt" style="background:${x.real?'#1f9d55':'#e0a800'}"></i>`}${hl(x.t,q)}${x.s?`<br><small>${hl(x.s,q)}</small>`:''}${r.why?`<br><span class="pal-why">${L('ประเภท','Type')}: ${esc(r.why)}</span>`:''}</span><span class="k">${L(...KL[x.k])}</span></a></li>`}).join('')
      :`<li style="padding:16px;color:var(--muted)">${L('ไม่พบรายการ ลองใช้คำสั้นลง หรือค้นด้วยชื่อสินค้า/รหัส','No match — try fewer or shorter words')}</li>`;
    $$('#palL .bdg').forEach(b=>{b.style.width='26px';b.style.height='26px'});
    $$('#palF [data-pf]').forEach(b=>b.onclick=()=>{f=b.dataset.pf;draw();inp.focus()})};
  draw();inp.focus();
  let t=null;inp.oninput=()=>{clearTimeout(t);t=setTimeout(()=>{f='all';draw()},80)};
  inp.onkeydown=e=>{if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();if(!list.length)return;sel=(sel+(e.key==='ArrowDown'?1:-1)+list.length)%list.length;$$('#palL a').forEach((a,i)=>a.setAttribute('aria-selected',i===sel));$$('#palL a')[sel]?.scrollIntoView({block:'nearest'})}
    if(e.key==='Enter'&&list[sel]){e.preventDefault();jump(list[sel])}};
  $('#palL').addEventListener('click',e=>{const a=e.target.closest('a[data-i]');if(!a)return;e.preventDefault();e.stopPropagation();jump(list[+a.dataset.i])},true);
};
})();
