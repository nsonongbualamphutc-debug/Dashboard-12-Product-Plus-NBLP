/* =====================================================================
   12 Plus+ · pages16.js — น้องกาบแก้ว ผู้ช่วยข้อมูล (แชตบอทด้านข้าง)
   ตอบจากข้อมูลจริงในระบบ: ตัวเลขรายการข้อมูล · แนวโน้ม · รายอำเภอ · แหล่งซื้อ/ร้านค้า · สถานะข้อมูล · นำทางหน้า
   ไม่ส่งข้อมูลออกนอกเครื่อง (ประมวลผลในเบราว์เซอร์ทั้งหมด)
   ===================================================================== */
(function(){
if(typeof P==='undefined'||typeof DATASETS==='undefined'||document.getElementById('kk'))return;
const IMG='img/mascot/';
const UA=navigator.userAgent;const SAF=/^((?!chrome|android|crios|fxios|edg).)*safari/i.test(UA)||/iPad|iPhone|iPod/.test(UA);
const RM=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
const ST=['hello','think','talk'];
const ss={get(k,d){try{const v=sessionStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}},set(k,v){try{sessionStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const H=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const norm=s=>String(s==null?'':s).toLowerCase().replace(/[\s​·\-_/(),.“”"'?!]+/g,'').replace(/ํา/g,'ำ');

/* ---------- มาสคอต (วิดีโอโปร่งใส / ภาพเคลื่อนไหว / ภาพนิ่ง) ---------- */
function mascotHTML(cls){return`<div class="kk-m ${cls||''}" data-st="hello">${ST.map(s=>RM?`<img data-s="${s}" src="${IMG}kk-${s}-still.webp" alt="">`:SAF?`<img data-s="${s}" ${s==='hello'?`src="${IMG}kk-${s}.webp"`:`data-src="${IMG}kk-${s}.webp"`} alt="">`
  :`<video data-s="${s}" muted playsinline loop preload="${s==='hello'?'auto':'none'}" poster="${IMG}kk-${s}-still.webp"${s==='hello'?' autoplay':''}><source src="${IMG}kk-${s}.webm" type="video/webm"></video>`).join('')}</div>`}
function setSt(root,s){root.querySelectorAll('.kk-m').forEach(m=>{if(m.dataset.st===s)return;m.dataset.st=s;
  m.querySelectorAll('[data-s]').forEach(el=>{const on=el.dataset.s===s;
    if(el.tagName==='VIDEO'){if(on){el.preload='auto';const pr=el.play();if(pr&&pr.catch)pr.catch(()=>{})}else el.pause()}
    else if(on&&el.dataset.src&&!el.src)el.src=el.dataset.src})})}

/* ---------- ดัชนีความรู้ ---------- */
const ALIAS={1:['ข้าวหอมมรกต','หอมมรกต','ข้าว'],2:['อ้อย','น้ำตาล'],3:['ควายงาม','ควาย','กระบือ'],4:['โคเนื้อ','โค','วัว'],5:['ไก่พื้นเมือง','ไก่'],6:['ปลาน้ำจืด','ปลา'],7:['เห็ด'],8:['ผักหวานป่า','ผักหวาน'],9:['กล้วย'],
  10:['ผ้าฉนวนลุ่มภู','ผ้าฉนวน','ฉนวน'],11:['ว่านอุษาลำภู','ว่านอุษา','ว่าน','อุษา'],12:['กาแฟภูซาง','กาแฟ','ภูซาง'],13:['คล้าศรีบุญเรือง','คล้า','จักสาน','เสื่อ'],14:['ผ้าขิดสลับหมี่','ผ้าขิด','ขิด','มัดหมี่']};
const AL=[];Object.entries(ALIAS).forEach(([id,a])=>a.forEach(w=>AL.push([norm(w),+id])));AL.sort((a,b)=>b[0].length-a[0].length);
const prodOf=q=>{const n=norm(q);for(const [w,id] of AL){if(w==='ศรีบุญเรือง')continue;if(n.includes(w)){if(id===1&&/ข้าวโพด/.test(n))continue;return P.find(p=>p.id===id)}}return null};
const DIST=(typeof DISTRICTS!=='undefined'?DISTRICTS:[]);
const distOf=q=>{const n=norm(q).replace(/คล้าศรีบุญเรือง/g,'');return DIST.find(d=>n.includes(norm(d))||n.includes(norm(d.replace('เมืองหนองบัวลำภู','เมือง'))+'')&&(d!=='เมืองหนองบัวลำภู'||/อ\.?เมือง|อำเภอเมือง|เมืองหนองบัว/.test(q)))};
const DSI={};DATASETS.forEach(d=>DSI[d.code]=d);
const IND=[];P.forEach(p=>p.inds.forEach(d=>IND.push({p,d,n:norm(d.n),x:norm([(DSI[d.code]||{}).item,(DSI[d.code]&&DSI[d.code].types||[]).join(' ')].join(' '))})));
const STOP=/ข้อมูล|เท่าไร|เท่าไหร่|เท่าใด|กี่|มีไหม|ไหม|มั้ย|บ้าง|ของ|จังหวัด|หนองบัวลำภู|ล่าสุด|ช่วย|บอก|หน่อย|ครับ|ค่ะ|คะ|นะ|จ้า|อยาก|รู้|ดู|ขอ|ทั้งหมด|ปี25\d\d|ปีนี้|ตอนนี้|ปัจจุบัน|คือ|อะไร|อย่างไร|ยังไง|แสดง|เปิด|ด้วย|อำเภอ(ไหน|ใด)?|แต่ละ|ราย|เทียบ|มากที่สุด|มากสุด|น้อยที่สุด|น้อยสุด|สูงสุด|ต่ำสุด|ที่สุด|แนวโน้ม|ซื้อ|ได้ที่ไหน|ที่ไหน|ร้านไหน|ไหน/g;
function lcs(q,s){let sc=0,qq=q;for(let k=Math.min(s.length,14);k>=2;k--){for(let i=0;i+k<=s.length;i++){const w=s.slice(i,i+k);const j=qq.indexOf(w);if(j>=0){sc+=k>=3?Math.pow(k,1.6):1;qq=qq.slice(0,j)+'#'.repeat(k)+qq.slice(j+k)}}}return sc}
function findInd(q,p){let n=norm(q).replace(STOP,'');AL.forEach(([w])=>{if(w.length>=3)n=n.replace(w,'')});DIST.forEach(d=>n=n.replace(norm(d),''));
  if(n.length<2)return[];const L0=(p?IND.filter(x=>x.p===p):IND).map(x=>({x,s:lcs(n,x.n)+lcs(n,x.x)*.35})).filter(r=>r.s>=4).sort((a,b)=>b.s-a.s);return L0.slice(0,5)}
const BC={};const blockOf=(p,code)=>{try{BC[p.id]=BC[p.id]||styItems(p);return BC[p.id].find(b=>b.d.code===code)}catch(e){return null}};
const isReal=ds=>!!(ds&&((ds.rows||[]).some(r=>+r[3])||(ds.list&&ds.list.rows&&ds.list.rows.length)));
const link=(h,t)=>`<a class="kk-a" href="${h}">${t} <span aria-hidden="true">›</span></a>`;
const pLink=p=>pFile(p.id);
const g=x=>`<b class="${x>=0?'up':'dn'}">${x>=0?'▲':'▼'} ${Math.abs(x).toFixed(Math.abs(x)<10?1:0)}%</b>`;

/* ---------- ทักษะการตอบ ---------- */
const CTX={p:null,code:null};
function ansProduct(p){const F=(typeof KEYFIGS==='function'?KEYFIGS(p,4):[]).filter(f=>f.v);CTX.p=p;CTX.code=null;
  return{html:`<div class="kk-card" style="--pa:${p.pa}"><div class="kk-ch">${typeof badge==='function'?badge(p,{label:false}):''}<div><b>${H(p.name)}</b><small>${H(p.en)} · ${H(p.agency)}</small></div></div>
    ${p.tagline?`<p>${H(p.tagline)}</p>`:''}${F.length?`<div class="kk-kv">${F.map(f=>`<div><span>${H(f.n)}</span><b>${fv(f.v,f.u)} <small>${H(uLab(f.u))}${f.y?' · '+yCE(f.y):''}</small></b></div>`).join('')}</div>`:''}
    <p class="kk-sm">${L('มีข้อมูลทั้งหมด','')} ${p.inds.length} ${L('รายการ ครอบคลุมต้นน้ำ–กลางน้ำ–ปลายน้ำ','items')}</p>${link(pLink(p),L('เปิดหน้า','Open ')+H(p.name))}</div>`,
    chips:[`แนวโน้ม${p.name}`,`ซื้อ${p.name}ได้ที่ไหน`,`${p.name} อำเภอไหนมากที่สุด`]}}
function ansInd(r,dist){const {p,d}=r;CTX.p=p;CTX.code=d.code;const ds=DSI[d.code];const b=blockOf(p,d.code);const href=pLink(p)+'#sb-'+d.code;
  if(!ds||!isReal(ds)||!b||b.empty)return{html:`<b>${H(d.n)}</b> (${d.code})<br>${L('ยังไม่มีข้อมูลในระบบค่ะ หน่วยงานที่รับผิดชอบ: ','No data yet. Owner: ')}${H(d.ag||p.agency)}<br>${link('report.html',L('ดูสถานะข้อมูล','Data status'))}`};
  if(ds.list&&ds.list.rows&&ds.list.rows.length&&!(ds.rows||[]).some(r=>+r[3])){const C=ds.list.cols,ni=C.findIndex(c=>/^รายชื่อ|ชื่อ/.test(c)),di=C.indexOf('อำเภอ');
    let R=ds.list.rows;if(dist&&di>=0)R=R.filter(x=>x[di]===dist);const names=[...new Set(R.map(x=>x[ni]).filter(x=>typeof x==='string'))];
    return{html:`<b>${H(d.n)}</b>${dist?' · อ.'+H(dShort(dist)):''}<br>${L('มีทั้งหมด','Total')} <b class="kk-big">${names.length}</b> ${L('รายการ','entries')}${names.length?`<ul class="kk-ul">${names.slice(0,6).map(x=>`<li>${H(x)}</li>`).join('')}</ul>${names.length>6?`<small class="kk-sm">${L('และอีก','and')} ${names.length-6} ${L('รายการ','more')}</small>`:''}`:''}<br>${link(href,L('ดูรายละเอียด','Details'))}`,chips:[`ซื้อ${p.name}ได้ที่ไหน`]}}
  const A=styAgg(b.rows);const u=b.unit,U=H(uLab(u));let T=null;try{T=window.STY_TREND?STY_TREND(b):null}catch(e){}
  if(dist){const dv=y=>A.v(r=>r.year===y&&r.dist===dist);const v=dv(A.ly),pv=A.py?dv(A.py):0;
    const rank=A.ds.map(x=>[x,A.v(r=>r.year===A.ly&&r.dist===x)]).filter(x=>x[1]>0).sort((a,b)=>b[1]-a[1]);const k=rank.findIndex(x=>x[0]===dist);
    return{html:`<b>${H(d.n)}</b><br>อ.${H(dShort(dist))} ${L('ปี','')} ${yCE(A.ly)}: <b class="kk-big">${v?fv(v,u):'—'}</b> ${v?U:L('ยังไม่มีรายงาน','not reported')}${pv&&v?' '+g((v-pv)/pv*100)+` <small>${L('จากปี','vs')} ${yCE(A.py)}</small>`:''}${k>=0?`<br><small class="kk-sm">${L('อันดับ','Rank')} ${k+1} ${L('จาก','of')} ${rank.length} ${L('อำเภอที่มีข้อมูล','districts')}</small>`:''}<br>${link(href,L('ดูกราฟ','Chart'))}`,chips:[`${d.n} รายอำเภอ`,`แนวโน้ม ${d.n}`]}}
  const k=styKpi(b);const ly=A.ly;
  const top=A.ds.map(x=>[x,A.v(r=>r.year===ly&&r.dist===x)]).filter(x=>x[1]>0).sort((a,b)=>b[1]-a[1]);
  const tot=top.reduce((a,x)=>a+x[1],0);
  let h=`<b>${H(d.n)}</b> <small class="kk-sm">${d.code}</small><div class="kk-hl"><b>${k.v}</b> <span>${H(k.u||'')}</span><small>${L('ปี','Year')} ${yCE(ly)}${b.ds&&b.ds.agg==='avg'?L(' · ค่าเฉลี่ย',' · avg'):''}</small></div>`;
  if(T&&!T.weak)h+=`<p>📈 ${L('แนวโน้ม','Trend')} ${yCE(T.y0)}–${yCE(T.y1)}: <b>${H(T.dir)}</b> ${T.cagr!=null?L('เฉลี่ยปีละ ','')+g(T.cagr):g(T.all)}${T.best?`<br>▲ ${L('โตเร็วสุด','fastest')}: อ.${H(T.best.n.replace(/^อ\./,''))} ${g(T.best.g)}`:''}${T.worst?`<br>▼ ${L('ลดลงมากสุด','largest drop')}: อ.${H(T.worst.n.replace(/^อ\./,''))} ${g(T.worst.g)}`:''}${T.fc!=null&&T.r2>=.4?`<br>🔮 ${L('คาดการณ์ปี','Projected')} ${yCE(T.nx)} ~<b>${fv(T.fc,u)}</b> ${U}`:''}</p>`;
  else if(T&&T.weak)h+=`<p class="kk-warn">⚠ ${L('ปีล่าสุดรายงานไม่ครบทุกอำเภอ ยังสรุปแนวโน้มไม่ได้ค่ะ','Latest year incomplete — trend inconclusive')}</p>`;
  if(top.length>=2&&!(b.ds&&b.ds.agg==='avg'))h+=`<div class="kk-bars">${top.slice(0,3).map(([x,v])=>`<div><span>อ.${H(dShort(x))}</span><i style="width:${Math.max(4,v/top[0][1]*100)}%"></i><b>${fv(v,u)}</b><small>${tot?Math.round(v/tot*100)+'%':''}</small></div>`).join('')}</div>`;
  h+=`<small class="kk-sm">${L('แหล่งที่มา: ','Source: ')}${H(d.ag||ds.source||p.agency)}</small><br>${link(href,L('ดูกราฟและตาราง','Chart & table'))}`;
  return{html:h,chips:[top.length>=2?`${d.n} รายอำเภอ`:null,`ซื้อ${p.name}ได้ที่ไหน`,`แนวโน้ม${p.name}`].filter(Boolean)}}
function ansDistList(r){const {p,d}=r;const b=blockOf(p,d.code);if(!b||b.empty)return ansInd(r);const A=styAgg(b.rows),u=b.unit;
  const L0=A.ds.map(x=>[x,A.v(r=>r.year===A.ly&&r.dist===x)]).sort((a,b)=>b[1]-a[1]);if(!L0.length)return ansInd(r);const mx=L0[0][1]||1;CTX.p=p;CTX.code=d.code;
  return{html:`<b>${H(d.n)}</b> · ${L('ปี','')} ${yCE(A.ly)} ${L('รายอำเภอ','by district')}<div class="kk-bars">${L0.map(([x,v])=>`<div><span>อ.${H(dShort(x))}</span><i style="width:${v?Math.max(3,v/mx*100):0}%"></i><b>${v?fv(v,u):'—'}</b><small>${v?'':L('ไม่รายงาน','n/a')}</small></div>`).join('')}</div><small class="kk-sm">${L('หน่วย','Unit')}: ${H(uLab(u))}</small><br>${link(pLink(p)+'#sb-'+d.code,L('ดูกราฟเทียบอำเภอ','Compare chart'))}`}}
function ansTrendP(p){CTX.p=p;CTX.code=null;const out=[];BC[p.id]=BC[p.id]||styItems(p);
  BC[p.id].forEach(b=>{try{if(b.empty)return;const T=STY_TREND&&STY_TREND(b);if(T&&!T.weak&&T.n>=2)out.push({b,T,r:T.cagr!=null?T.cagr:T.all})}catch(e){}});
  if(!out.length)return{html:`${H(p.name)} ${L('ยังมีข้อมูลไม่ถึง 2 ปี จึงยังวิเคราะห์แนวโน้มไม่ได้ค่ะ','has <2 years of data')}<br>${link(pLink(p),L('เปิดหน้า ','Open ')+H(p.name))}`};
  const up=out.filter(x=>x.r>2).sort((a,b)=>b.r-a.r).slice(0,3),dn=out.filter(x=>x.r<-2).sort((a,b)=>a.r-b.r).slice(0,3),fl=out.length-up.length-dn.length;
  const row=x=>`<li><a href="${pLink(p)}#sb-${x.b.d.code}">${H(x.b.d.n)}</a> ${g(x.r)}<small>/${L('ปี','yr')}</small></li>`;
  return{html:`<b>${L('แนวโน้ม','Trends:')} ${H(p.name)}</b> <small class="kk-sm">${L('จาก','from')} ${out.length} ${L('รายการที่มีข้อมูลหลายปี','multi-year items')}</small>
    ${up.length?`<p class="kk-t up">↗ ${L('เติบโตเด่น','Growing')}</p><ul class="kk-ul">${up.map(row).join('')}</ul>`:''}${dn.length?`<p class="kk-t dn">↘ ${L('ลดลง ควรติดตาม','Declining')}</p><ul class="kk-ul">${dn.map(row).join('')}</ul>`:''}
    ${fl>0?`<small class="kk-sm">→ ${L('ทรงตัว','stable')} ${fl} ${L('รายการ','items')}</small><br>`:''}${link(pLink(p),L('ดูแผงวิเคราะห์แนวโน้ม','Trend panels'))}`,chips:[`ซื้อ${p.name}ได้ที่ไหน`,p.name]}}
const RL={prod:L('ผู้ผลิต','Producer'),brand:L('แบรนด์','Brand'),outlet:L('จุดจำหน่าย','Outlet'),online:L('ออนไลน์','Online')};
function ansShops(p,dist){CTX.p=p;let L0=(typeof SHOP_DIR==='function'?SHOP_DIR(p):[])||[];if(dist)L0=L0.filter(e=>e.dist===dist||(e.addr||'').includes(dist));
  if(!L0.length)return{html:`${L('ยังไม่พบรายชื่อร้าน/กลุ่มผู้ผลิต','No shops found for')} ${H(p.name)}${dist?' อ.'+H(dShort(dist)):''} ${L('ในระบบค่ะ','')}<br>${link(pLink(p)+'#shops',L('ดูหน้าแหล่งซื้อ','Where to buy'))}`};
  const map=e=>e.gps?`https://www.google.com/maps/search/?api=1&query=${e.gps[0]},${e.gps[1]}`:(e.addr?`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(e.name+' '+e.addr)}`:'');
  return{html:`<b>${L('ซื้อ','Buy')} ${H(p.name)} ${L('ได้ที่','at')}</b>${dist?' · อ.'+H(dShort(dist)):''} <small class="kk-sm">(${L('ทั้งหมด','total')} ${L0.length} ${L('แห่ง','places')})</small>
    <ul class="kk-shops">${L0.slice(0,5).map(e=>{const tel=(e.tel||'').split(/[,/]/)[0].trim();const m=map(e);
      return`<li><b>${H(e.name)}</b><small>${[...e.roles].map(r=>RL[r]||r).join(' · ')}${e.dist?' · อ.'+H(dShort(e.dist)):''}</small><span>${tel?`<a href="tel:${H(tel.replace(/[^\d+]/g,''))}">📞 ${H(tel)}</a>`:''}${e.fb?`<a href="${H(e.fb)}" target="_blank" rel="noopener">Facebook</a>`:''}${e.link&&!e.fb?`<a href="${H(e.link)}" target="_blank" rel="noopener">${L('ร้านออนไลน์','Online')}</a>`:''}${m?`<a href="${m}" target="_blank" rel="noopener">📍 ${L('แผนที่','Map')}</a>`:''}</span></li>`}).join('')}</ul>
    ${link(pLink(p)+'#shops',L('ดูทั้งหมด + QR','All shops + QR'))}`,chips:[`แนวโน้ม${p.name}`,p.name]}}
function ansStatus(){const by={};let real=0,all=0;P.forEach(p=>p.inds.forEach(d=>{all++;const ok=isReal(DSI[d.code]);if(ok)real++;const a=d.ag||p.agency;by[a]=by[a]||[0,0];by[a][1]++;if(ok)by[a][0]++}));
  const pend=Object.entries(by).filter(x=>x[1][0]<x[1][1]).sort((a,b)=>(b[1][1]-b[1][0])-(a[1][1]-a[1][0]));
  return{html:`<b>${L('สถานะข้อมูล ณ','Data status as of')} ${H(APP.asOf||'')}</b><div class="kk-hl"><b>${real}/${all}</b> <span>${L('รายการมีข้อมูลจริง','items with real data')}</span><small>${Math.round(real/all*100)}%</small></div>
    ${pend.length?`<p>${L('หน่วยงานที่ยังค้างส่ง','Pending agencies')}:</p><ul class="kk-ul">${pend.slice(0,6).map(([a,[r,t]])=>`<li>${H(a)} — ${L('ค้าง','pending')} <b>${t-r}</b></li>`).join('')}</ul>`:`<p>🎉 ${L('ครบทุกรายการแล้วค่ะ','All items complete')}</p>`}${link('report.html',L('เปิดระบบติดตามสถานะ','Open status tracker'))}`}}
function ansOverview(){return{html:`<b>12 Plus+ ${L('สินค้าอัตลักษณ์หนองบัวลำภู','Identity products')}</b><p>${L('มี','')} <b>${P.length}</b> ${L('สินค้า','products')} · <b>${IND.length}</b> ${L('รายการข้อมูล','data items')} · ${L('ข้อมูล ณ','as of')} ${H(APP.asOf||'')}</p>
  <div class="kk-pg">${P.map(p=>`<button type="button" data-q="${H(p.name)}" style="--pa:${p.pa}">${H(p.name)}</button>`).join('')}</div>${link('overview.html',L('เปิดภาพรวม 14 สินค้า','Overview'))}`}}
function ansNav(q){const n=norm(q);const k=Object.keys(PAGES).find(k=>{const t=norm(PAGES[k].t);return n.includes(t)||t.length>4&&n.includes(t.slice(0,5))||norm(PAGES[k].en).length>3&&n.includes(norm(PAGES[k].en))});
  return k?{html:`${L('ไปที่','Go to')} ${link(PAGES[k].f,H(PT(k)))}`}:null}
function help(){return{html:`${L('สวัสดีค่ะ หนูชื่อ <b>น้องกาบแก้ว</b> 🪷 ผู้ช่วยข้อมูล 12 Plus+ สินค้าอัตลักษณ์หนองบัวลำภู','Hi! I\'m <b>Kab Kaew</b> 🪷, your 12 Plus+ data assistant.')}
  <p>${L('ถามหนูได้เลยนะคะ เช่น','Try asking:')}</p><ul class="kk-ul"><li>${L('ตัวเลข: “ผลผลิตข้าวหอมมรกต”','Figures')}</li><li>${L('รายอำเภอ: “โคเนื้อ อำเภอไหนมากที่สุด”','By district')}</li><li>${L('แนวโน้ม: “แนวโน้มปลาน้ำจืด”','Trends')}</li><li>${L('แหล่งซื้อ: “ซื้อผ้าฉนวนได้ที่ไหน”','Where to buy')}</li><li>${L('สถานะ: “ข้อมูลหน่วยงานไหนยังไม่ส่ง”','Data status')}</li></ul>
  <small class="kk-sm">${L('หนูตอบจากข้อมูลจริงในระบบเท่านั้น ไม่เดาตัวเลขค่ะ','I only answer from real data in this system.')}</small>`,chips:['ภาพรวม 14 สินค้า','แนวโน้มโคเนื้อ','ซื้อกาแฟภูซางได้ที่ไหน','สถานะข้อมูล']}}

function answer(raw){const q=String(raw||'').trim();if(!q)return null;const n=norm(q);
  if(/^(สวัสดี|หวัดดี|ดีจ้า|ดีค่ะ|ดีครับ|hello|hi\b|ช่วยอะไร|ทำอะไรได้|เมนู|เริ่ม|help)/i.test(q))return help();
  if(/ขอบคุณ|thank/i.test(q))return{html:L('ยินดีค่ะ 🪷 มีอะไรถามน้องกาบแก้วได้ตลอดนะคะ','You\'re welcome! 🪷')};
  if(/สถานะ|ค้างส่ง|ยังไม่ส่ง|ไม่ครบ|ครบไหม|ติดตามข้อมูล|หน่วยงานไหน.*(ส่ง|ข้อมูล)/.test(q))return ansStatus();
  if(/^(เปิด|ไป|พาไป).*หน้า|^หน้า/.test(q)){const r=ansNav(q);if(r)return r}
  if(/ภาพรวม|ทั้งหมดกี่|มีสินค้าอะไร|สินค้าอะไรบ้าง|14 ?สินค้า|12 ?plus/i.test(q)&&!prodOf(q))return ansOverview();
  const p=prodOf(q)||null,dist=distOf(q);const pp=p||CTX.p;
  if(/ซื้อ|ร้าน|แหล่งจำหน่าย|จุดจำหน่าย|ติดต่อ|เบอร์|โทร|เฟส|facebook|ช่องทาง|ผู้ผลิต.*ที่ไหน|กลุ่มผู้ผลิต/i.test(q)){if(pp)return ansShops(pp,dist);return{html:L('อยากซื้อสินค้าตัวไหนคะ เลือกได้เลย','Which product?')+ansOverview().html.split('</p>')[1],chips:[]}}
  if(/แนวโน้ม|เติบโต|โตขึ้น|เพิ่มขึ้นไหม|ลดลงไหม|ทิศทาง|trend/i.test(q)){const r=findInd(q,pp);if(r.length&&r[0].s>=9)return ansInd(r[0].x);if(pp)return ansTrendP(pp)}
  if(/รายอำเภอ|แต่ละอำเภอ|อำเภอไหน|อำเภอใด|เทียบอำเภอ/.test(q)){const hasD=x=>{const b=blockOf(x.p,x.d.code);return b&&!b.empty&&b.rows&&styAgg(b.rows).ds.length>=2};
    let r=findInd(q,pp).filter(x=>hasD(x.x));if(r.length&&r[0].s<9)r=[];
    if(!r.length&&CTX.code&&(!p||CTX.p===p)){const c=IND.find(x=>x.d.code===CTX.code);if(c&&hasD(c))r=[{x:c,s:9}]}
    if(!r.length&&pp){const al=(ALIAS[pp.id]||[]).map(norm);const C=IND.filter(x=>x.p===pp&&hasD(x)).map(x=>({x,s:(al.some(w=>x.n.includes(w))?5:0)+(/^จำนวน(?!เกษตรกร|ผู้|กลุ่ม|หน่วย|ร้าน|โรง)/.test(x.d.n)?3:0)+(/ผลผลิต|พื้นที่เพาะปลูก|พื้นที่ปลูก/.test(x.d.n)?3:0)+(x.d.s===0?1:0)})).sort((a,b)=>b.s-a.s);if(C.length)r=[{x:C[0].x,s:9}]}if(!r.length&&CTX.code){const c=IND.find(x=>x.d.code===CTX.code);if(c)r=[{x:c,s:9}]}
    if(!r.length&&pp){const b=(BC[pp.id]=BC[pp.id]||styItems(pp)).find(b=>!b.empty&&styAgg(b.rows).ds.length>=2);if(b)r=[{x:IND.find(x=>x.d.code===b.d.code),s:9}]}if(r.length)return ansDistList(r[0].x)}
  const code=q.match(/P\d{2}-\d{3}/i);if(code){const c=IND.find(x=>x.d.code.toUpperCase()===code[0].toUpperCase());if(c)return ansInd(c,dist)}
  const r=findInd(q,pp);
  if(r.length&&(r[0].s>=6||p)){const best=r[0];const more=r.slice(1,4).filter(x=>x.s>=best.s*.6);const a=ansInd(best.x,dist);
    if(more.length)a.html+=`<p class="kk-sm">${L('หรือหมายถึง','Or did you mean')}:</p><div class="kk-pg">${more.map(m=>`<button type="button" data-q="${H(m.x.d.code)}">${H(m.x.d.n)}</button>`).join('')}</div>`;return a}
  if(p)return ansProduct(p);
  if(dist&&CTX.code){const c=IND.find(x=>x.d.code===CTX.code);if(c)return ansInd(c,dist)}
  const nv=ansNav(q);if(nv)return nv;
  return{html:`${L('ขอโทษค่ะ หนูยังหาข้อมูลที่ตรงกับ','Sorry, I couldn\'t find')} “${H(q)}” ${L('ไม่เจอ ลองระบุชื่อสินค้าหรือชื่อรายการข้อมูลอีกนิดนะคะ เช่น “พื้นที่ปลูกกล้วย” หรือ “ราคาโคเนื้อ”','— try naming a product or data item.')}`,chips:['ภาพรวม 14 สินค้า','ช่วยอะไรได้บ้าง']}}

/* ---------- UI ---------- */
const css=`@supports (overflow:clip){html,body{overflow-x:clip}}
#kk{--kk:#E8559A;--kk2:#8E1F4A;position:fixed;right:18px;bottom:18px;z-index:9000;font:14px/1.5 Sarabun,Kanit,sans-serif;color:var(--ink,#2C1A23)}
#kk *{box-sizing:border-box}
.kk-fab{position:relative;display:flex;flex-direction:column;align-items:center;gap:0;border:0;background:none;padding:0;cursor:pointer;filter:drop-shadow(0 14px 22px rgba(142,31,74,.28));transition:transform .3s cubic-bezier(.2,.8,.2,1)}
.kk-fab:hover{transform:translateY(-4px) scale(1.03)}
.kk-fab .kk-m{width:150px;height:178px}
.kk-fab:before{content:"";position:absolute;bottom:30px;left:50%;width:96px;height:18px;transform:translateX(-50%);border-radius:50%;background:radial-gradient(closest-side,rgba(232,85,154,.35),transparent);z-index:-1}
.kk-pill{margin-top:-8px;display:inline-flex;align-items:center;gap:7px;padding:8px 14px 8px 11px;border-radius:99px;background:linear-gradient(135deg,var(--kk),var(--kk2));color:#fff;font:600 13px Kanit,sans-serif;box-shadow:0 8px 20px -8px rgba(142,31,74,.6);white-space:nowrap}
.kk-pill i{width:8px;height:8px;border-radius:50%;background:#7CFFB2;box-shadow:0 0 0 3px rgba(124,255,178,.3);animation:kkPulse 2s infinite}
@keyframes kkPulse{50%{box-shadow:0 0 0 6px rgba(124,255,178,0)}}
.kk-m{position:relative}
.kk-m>*{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;object-position:center bottom;opacity:0;transition:opacity .25s;pointer-events:none}
.kk-m[data-st="hello"]>[data-s="hello"],.kk-m[data-st="think"]>[data-s="think"],.kk-m[data-st="talk"]>[data-s="talk"]{opacity:1}
.kk-tip{position:absolute;right:150px;bottom:110px;width:230px;padding:12px 30px 12px 14px;border-radius:18px 18px 4px 18px;background:var(--surface,#fff);box-shadow:0 18px 40px -16px rgba(80,20,50,.45);border:1px solid rgba(232,85,154,.25);opacity:0;transform:translateY(8px) scale(.96);transform-origin:right bottom;transition:.35s cubic-bezier(.2,.8,.2,1);pointer-events:none}
.kk-tip.on{opacity:1;transform:none;pointer-events:auto}
.kk-tip b{display:block;font:600 14px Kanit,sans-serif;color:var(--kk2)}
.kk-tip span{font-size:13px;color:var(--muted,#7a5a68)}
.kk-tip button{position:absolute;top:6px;right:8px;border:0;background:none;font-size:16px;color:var(--muted,#999);cursor:pointer}
.kk-p{position:absolute;right:0;bottom:0;width:min(410px,calc(100vw - 24px));height:min(650px,calc(100vh - 36px));display:flex;flex-direction:column;border-radius:26px;overflow:visible;
  background:color-mix(in srgb,var(--surface,#fff) 94%,transparent);-webkit-backdrop-filter:blur(18px) saturate(1.4);backdrop-filter:blur(18px) saturate(1.4);border:1px solid rgba(232,85,154,.22);
  box-shadow:0 40px 80px -30px rgba(80,20,50,.55),0 4px 14px rgba(80,20,50,.08);opacity:0;transform:translateY(20px) scale(.96);transform-origin:right bottom;pointer-events:none;transition:.35s cubic-bezier(.2,.8,.2,1)}
#kk.open .kk-p{opacity:1;transform:none;pointer-events:auto}
#kk.open .kk-fab,#kk.open .kk-tip{opacity:0;pointer-events:none;transform:scale(.8)}
.kk-hd{position:relative;display:flex;align-items:flex-end;gap:10px;padding:14px 14px 12px 112px;min-height:84px;border-radius:26px 26px 0 0;color:#fff;
  background:radial-gradient(120% 140% at 0% 0%,#FF8CC0 0%,var(--kk) 38%,var(--kk2) 100%)}
.kk-hd:after{content:"";position:absolute;inset:0;border-radius:inherit;background:repeating-linear-gradient(45deg,rgba(255,255,255,.06) 0 8px,transparent 8px 16px);pointer-events:none}
.kk-hd .kk-m{position:absolute;left:0;bottom:-8px;width:112px;height:140px;z-index:2;filter:drop-shadow(0 8px 10px rgba(60,10,30,.35))}
.kk-hd div{flex:1;min-width:0;position:relative;z-index:1}
.kk-hd b{display:block;font:600 17px/1.2 Kanit,sans-serif}
.kk-hd small{display:flex;align-items:center;gap:6px;font-size:12px;opacity:.92}
.kk-hd small i{width:7px;height:7px;border-radius:50%;background:#7CFFB2}
.kk-hd button{position:relative;z-index:1;width:34px;height:34px;border-radius:50%;border:0;background:rgba(255,255,255,.18);color:#fff;font-size:18px;cursor:pointer;flex:none}
.kk-hd button:hover{background:rgba(255,255,255,.3)}
.kk-bd{flex:1;overflow-y:auto;padding:16px 14px 6px;display:flex;flex-direction:column;gap:10px;scroll-behavior:smooth}
.kk-msg{display:flex;gap:8px;align-items:flex-end;max-width:100%;animation:kkIn .35s cubic-bezier(.2,.8,.2,1)}
@keyframes kkIn{from{opacity:0;transform:translateY(8px)}}
.kk-msg.me{justify-content:flex-end}
.kk-msg>img{width:30px;height:30px;border-radius:50%;flex:none;box-shadow:0 2px 6px rgba(80,20,50,.2)}
.kk-bb{max-width:86%;padding:10px 13px;border-radius:18px 18px 18px 6px;background:var(--surface-2,#FFF4F9);border:1px solid rgba(232,85,154,.14);overflow-wrap:anywhere}
.kk-msg.me .kk-bb{border-radius:18px 18px 6px 18px;background:linear-gradient(135deg,var(--kk),var(--kk2));color:#fff;border:0}
.kk-bb p{margin:6px 0}
.kk-bb .up{color:#1f9d55}.kk-bb .dn{color:#d64545}
.kk-sm{color:var(--muted,#8a6a78);font-size:12px}
.kk-big{font:600 20px Kanit,sans-serif;color:var(--kk2)}
.kk-hl{display:flex;align-items:baseline;flex-wrap:wrap;gap:6px;margin:6px 0;padding:8px 12px;border-radius:14px;background:var(--surface,#fff);border:1px solid var(--line,#f1d6e3)}
.kk-hl>b{font:600 26px/1.1 Kanit,sans-serif;color:var(--kk2);font-variant-numeric:tabular-nums}
.kk-hl small{margin-left:auto;color:var(--muted,#8a6a78);font-size:12px}
.kk-bars{display:grid;gap:5px;margin:8px 0}
.kk-bars div{display:grid;grid-template-columns:84px minmax(40px,1fr) 64px 34px;align-items:center;gap:6px;font-size:12.5px}
.kk-bars span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.kk-bars i{display:block;height:8px;border-radius:8px;background:linear-gradient(90deg,var(--kk),var(--kk2));min-width:0}
.kk-bars b{font:600 12.5px Kanit,sans-serif;font-variant-numeric:tabular-nums;text-align:right}
.kk-bars small{color:var(--muted,#8a6a78);font-size:11px;text-align:right}
.kk-ul{margin:4px 0;padding-left:18px}.kk-ul li{margin:2px 0}
.kk-ul a{color:inherit}
.kk-t{margin:8px 0 2px!important;font-weight:600}.kk-t.up{color:#1f9d55}.kk-t.dn{color:#d64545}
.kk-warn{color:#B7791F}
.kk-a{display:inline-flex;align-items:center;gap:4px;margin-top:6px;padding:6px 12px;border-radius:99px;background:color-mix(in srgb,var(--kk) 12%,transparent);color:var(--kk2);font-weight:600;font-size:12.5px;text-decoration:none}
.kk-a:hover{background:color-mix(in srgb,var(--kk) 22%,transparent)}
.kk-card .kk-ch{display:flex;gap:10px;align-items:center}
.kk-card .kk-ch .bdg{width:40px!important;height:40px!important;flex:none}
.kk-card .kk-ch small{display:block;color:var(--muted,#8a6a78);font-size:11.5px}
.kk-kv{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin:8px 0}
.kk-kv div{padding:7px 9px;border-radius:12px;background:var(--surface,#fff);border:1px solid var(--line,#f1d6e3);min-width:0}
.kk-kv span{display:block;font-size:11px;color:var(--muted,#8a6a78);line-height:1.3;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}
.kk-kv b{font:600 15px Kanit,sans-serif;color:var(--pa,var(--kk2))}.kk-kv b small{font:400 10.5px Sarabun,sans-serif;color:var(--muted,#8a6a78)}
.kk-shops{list-style:none;margin:8px 0;padding:0;display:grid;gap:6px}
.kk-shops li{padding:8px 10px;border-radius:12px;background:var(--surface,#fff);border:1px solid var(--line,#f1d6e3)}
.kk-shops li>b{display:block;font-size:13.5px}.kk-shops li>small{display:block;color:var(--muted,#8a6a78);font-size:11.5px}
.kk-shops li>span{display:flex;flex-wrap:wrap;gap:8px;margin-top:3px}.kk-shops a{font-size:12px;color:var(--kk2);font-weight:600;text-decoration:none}
.kk-pg{display:flex;flex-wrap:wrap;gap:5px;margin:6px 0}
.kk-pg button,.kk-chips button{font:inherit;font-size:12.5px;padding:6px 11px;border-radius:99px;border:1px solid color-mix(in srgb,var(--pa,var(--kk)) 40%,transparent);background:var(--surface,#fff);color:var(--ink,#2C1A23);cursor:pointer;transition:.2s}
.kk-pg button:hover,.kk-chips button:hover{background:color-mix(in srgb,var(--pa,var(--kk)) 14%,transparent)}
.kk-chips{display:flex;gap:6px;overflow-x:auto;padding:6px 14px 4px;scrollbar-width:none}.kk-chips::-webkit-scrollbar{display:none}
.kk-chips button{white-space:nowrap;flex:none}
.kk-typing{display:inline-flex;gap:4px;padding:4px 2px}.kk-typing i{width:7px;height:7px;border-radius:50%;background:var(--kk);animation:kkDot 1.1s infinite}
.kk-typing i:nth-child(2){animation-delay:.15s}.kk-typing i:nth-child(3){animation-delay:.3s}
@keyframes kkDot{0%,80%,100%{opacity:.25;transform:translateY(0)}40%{opacity:1;transform:translateY(-4px)}}
.kk-in{display:flex;gap:8px;padding:10px 12px 12px;border-top:1px solid var(--line,#f1d6e3)}
.kk-in input{flex:1;min-width:0;font:inherit;font-size:14px;padding:11px 15px;border-radius:99px;border:1px solid var(--line,#ecd0dd);background:var(--surface,#fff);color:var(--ink,#2C1A23);outline:none}
.kk-in input:focus{border-color:var(--kk);box-shadow:0 0 0 3px rgba(232,85,154,.18)}
.kk-in button{width:44px;height:44px;border-radius:50%;border:0;background:linear-gradient(135deg,var(--kk),var(--kk2));color:#fff;cursor:pointer;flex:none;display:grid;place-items:center}
.kk-in button svg{width:18px;height:18px;fill:none;stroke:#fff;stroke-width:2.2;stroke-linejoin:round}
.kk-ft{padding:0 14px 8px;font-size:10.5px;color:var(--muted,#9a7a88);text-align:center}
@media (max-width:640px){#kk{right:10px;bottom:84px}.kk-fab .kk-m{width:96px;height:114px}.kk-pill{font-size:12px;padding:6px 11px}.kk-tip{right:100px;bottom:70px;width:200px}
  #kk.open{right:0;bottom:0;left:0;top:0}#kk.open .kk-p{width:100vw;height:100%;border-radius:0}.kk-p{right:0;bottom:0}.kk-hd{border-radius:0;padding-left:96px;padding-top:max(14px,env(safe-area-inset-top))}.kk-hd .kk-m{width:90px;height:108px;bottom:-6px}.kk-hd small{font-size:11px}}
@media print{#kk{display:none}}`;
const st=document.createElement('style');st.id='kk-css';st.textContent=css;document.head.appendChild(st);
const w=document.createElement('div');w.id='kk';w.setAttribute('aria-live','polite');
w.innerHTML=`<div class="kk-tip" role="status"><button type="button" aria-label="${L('ปิด','Close')}">×</button><b>${L('สวัสดีค่ะ หนูน้องกาบแก้ว 🪷','Hi, I\'m Kab Kaew 🪷')}</b><span>${L('อยากรู้ตัวเลข แนวโน้ม หรือแหล่งซื้อสินค้า ถามหนูได้เลยนะคะ','Ask me about figures, trends or where to buy.')}</span></div>
<button type="button" class="kk-fab" aria-label="${L('ถามน้องกาบแก้ว ผู้ช่วยข้อมูล','Ask Kab Kaew')}">${mascotHTML()}<span class="kk-pill"><i></i>${L('ถามน้องกาบแก้ว','Ask Kab Kaew')}</span></button>
<section class="kk-p" role="dialog" aria-label="${L('น้องกาบแก้ว ผู้ช่วยข้อมูล','Kab Kaew assistant')}">
  <header class="kk-hd">${mascotHTML()}<div><b>${L('น้องกาบแก้ว','Kab Kaew')}</b><small><i></i>${L('ผู้ช่วยข้อมูล 12 Plus+ · ตอบจากข้อมูลจริง','12 Plus+ data assistant · real data')}</small></div><button type="button" class="kk-x" aria-label="${L('ปิด','Close')}">×</button></header>
  <div class="kk-bd" id="kkBd"></div><div class="kk-chips" id="kkCh"></div>
  <form class="kk-in" id="kkF" autocomplete="off"><input id="kkQ" placeholder="${L('พิมพ์คำถาม เช่น ผลผลิตกล้วย…','Ask e.g. banana output…')}" aria-label="${L('คำถาม','Question')}"><button type="submit" aria-label="${L('ส่ง','Send')}"><svg viewBox="0 0 24 24"><path d="M4 12 20 4l-5 16-3.5-6.5z"/></svg></button></form>
  <div class="kk-ft">${L('ข้อมูล ณ ','Data as of ')}${H(APP&&APP.asOf||'')} · ${L('สำนักงานสถิติจังหวัดหนองบัวลำภู','NSO Nong Bua Lam Phu')}</div>
</section>`;
document.body.appendChild(w);
const bd=w.querySelector('#kkBd'),ch=w.querySelector('#kkCh'),inp=w.querySelector('#kkQ'),tip=w.querySelector('.kk-tip');
let HIST=ss.get('kk-hist',[]),busy=false,idle=null;
const AV=`<img src="${IMG}kk-avatar.webp" alt="">`;
function add(who,html,save=true){const d=document.createElement('div');d.className='kk-msg '+who;d.innerHTML=(who==='ai'?AV:'')+`<div class="kk-bb">${html}</div>`;bd.appendChild(d);bd.scrollTop=who==='ai'&&d.offsetHeight>bd.clientHeight*.7?d.offsetTop-10:bd.scrollHeight;
  if(save){HIST.push([who,html]);HIST=HIST.slice(-40);ss.set('kk-hist',HIST)}return d}
function chips(L0){ch.innerHTML=(L0||[]).filter(Boolean).slice(0,4).map(t=>`<button type="button" data-q="${H(t)}">${H(t)}</button>`).join('')}
function mood(s,ms){setSt(w,s);clearTimeout(idle);if(ms)idle=setTimeout(()=>setSt(w,'hello'),ms)}
function ask(q){q=String(q||'').trim();if(!q||busy)return;busy=true;add('me',H(q));inp.value='';chips([]);mood('think');
  const t=add('ai','<span class="kk-typing"><i></i><i></i><i></i></span>',false);
  setTimeout(()=>{let r=null;try{r=answer(q)}catch(e){console.error(e)}r=r||{html:L('ขอโทษค่ะ เกิดข้อผิดพลาด ลองใหม่อีกครั้งนะคะ','Sorry, something went wrong.')};
    t.remove();add('ai',r.html);chips(r.chips||['ช่วยอะไรได้บ้าง']);mood('talk',4500);busy=false},650+Math.random()*450)}
function open(v){w.classList.toggle('open',v);ss.set('kk-open',v);tip.classList.remove('on');
  if(v){if(!bd.children.length){if(HIST.length)HIST.forEach(([a,h])=>add(a,h,false));else{const r=help();add('ai',r.html);chips(r.chips)}}mood('talk',3500);setTimeout(()=>inp.focus({preventScroll:true}),300)}
  else mood('hello')}
w.querySelector('.kk-fab').onclick=()=>open(true);w.querySelector('.kk-x').onclick=()=>open(false);
tip.querySelector('button').onclick=e=>{e.stopPropagation();tip.classList.remove('on');ss.set('kk-tip',1)};
tip.onclick=()=>open(true);
w.querySelector('#kkF').onsubmit=e=>{e.preventDefault();ask(inp.value)};
w.addEventListener('click',e=>{const b=e.target.closest('[data-q]');if(b){e.preventDefault();ask(b.dataset.q)}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&w.classList.contains('open'))open(false)});
if(ss.get('kk-open',false))open(true);
else if(!ss.get('kk-tip',0))setTimeout(()=>{if(!w.classList.contains('open')){tip.classList.add('on');setTimeout(()=>tip.classList.remove('on'),9000);ss.set('kk-tip',1)}},1800);
window.KK={ask,open,answer};
})();
