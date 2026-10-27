/* ---------- ติดตามสถานะข้อมูล (หน้า report) ---------- */
(function(){
if(typeof PAGE_R==='undefined')return;
PAGES.report.t='ติดตามสถานะข้อมูล';PAGES.report.en='Data status tracker';
const STG=[['ต้นน้ำ','Upstream'],['กลางน้ำ','Midstream'],['ปลายน้ำ','Downstream']];
const AGN=a=>a.replace(/^สนง\./,'สำนักงาน').trim();
const agShort=a=>a.replace(/^สำนักงาน/,'สนง.');
function rowsAll(){
  const DSI={};DATASETS.forEach(x=>DSI[x.code]=x);
  return P.flatMap(p=>p.inds.map(d=>{const ds=DSI[d.code];
    const real=!!(ds&&((ds.rows||[]).some(r=>+r[3])||(ds.list&&ds.list.rows&&ds.list.rows.length)));
    const ags=[...new Set(String(d.ag||p.agency).split(/\s*[\/,]\s*/).filter(Boolean).map(AGN))];
    return{p,d,ds,real,ags,stage:d.s}}))}
const KEY='nbl12-follow';
const fGet=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch(e){return{}}};
const fSet=o=>{try{localStorage.setItem(KEY,JSON.stringify(o))}catch(e){}};
const thDate=t=>{try{return new Date(t).toLocaleDateString('th-TH',{day:'numeric',month:'short',year:'2-digit'})}catch(e){return''}};
const css=`
.dst-hero{display:grid;grid-template-columns:minmax(220px,300px) 1fr;gap:16px;align-items:stretch}
.dst-ring{display:flex;align-items:center;gap:18px;padding:20px}
.dst-ring svg{width:120px;height:120px;flex:none}
.dst-ring b{font:600 34px/1 var(--f-head);color:var(--ink)}
.dst-ring small{display:block;color:var(--muted);margin-top:6px;font-size:13px;line-height:1.45}
.dst-k{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px}
.dst-kc{padding:16px 18px;border-radius:16px;background:var(--surface);border:1px solid var(--line);cursor:pointer;text-align:left;font:inherit;color:inherit}
.dst-kc:hover{border-color:var(--pink-300)}
.dst-kc[aria-pressed="true"]{outline:2px solid var(--pink-500);outline-offset:-1px}
.dst-kc span{display:flex;align-items:center;gap:8px;color:var(--muted);font-size:13px}
.dst-kc b{display:block;font:600 30px/1.1 var(--f-head);margin-top:6px;color:var(--ink)}
.dst-kc small{color:var(--muted);font-size:12px}
.dst-dot{width:10px;height:10px;border-radius:50%;display:inline-block;flex:none}
.dst-dot.r{background:#1f9d55;box-shadow:0 0 0 3px color-mix(in srgb,#1f9d55 22%,transparent)}
.dst-dot.w{background:#e0a800;box-shadow:0 0 0 3px color-mix(in srgb,#e0a800 25%,transparent)}
.dst-h{display:flex;align-items:end;justify-content:space-between;gap:12px;flex-wrap:wrap;margin:26px 0 12px}
.dst-h h2{margin:0;font:600 20px/1.3 var(--f-head)}
.dst-h p{margin:4px 0 0;color:var(--muted);font-size:13.5px}
.dst-ag{display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:12px}
.dst-a{padding:16px;border-radius:16px;background:var(--surface);border:1px solid var(--line);display:flex;flex-direction:column;gap:10px}
.dst-a.done{opacity:.85}
.dst-a h3{margin:0;font:600 15.5px/1.35 var(--f-head)}
.dst-a .n{display:flex;align-items:baseline;gap:8px}
.dst-a .n b{font:600 28px/1 var(--f-head);color:#b7791f}
.dst-a.done .n b{color:#1f9d55}
.dst-a .n span{color:var(--muted);font-size:13px}
.dst-bar{height:8px;border-radius:99px;background:color-mix(in srgb,#e0a800 28%,var(--surface-2));overflow:hidden}
.dst-bar i{display:block;height:100%;background:#1f9d55;border-radius:99px}
.dst-a .m{font-size:12.5px;color:var(--muted);display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap}
.dst-a .acts{display:flex;gap:6px;flex-wrap:wrap}
.dst-a .acts button{font:inherit;font-size:12.5px;padding:6px 10px;border-radius:99px;border:1px solid var(--line);background:var(--surface-2);color:var(--ink);cursor:pointer}
.dst-a .acts button:hover{border-color:var(--pink-500)}
.dst-a .acts button.pri{background:var(--pink-500);border-color:var(--pink-500);color:#fff}
.dst-fu{font-size:12px;color:var(--muted)}
.dst-fu b{color:var(--ink);font-weight:500}
.dst-mx{width:100%;border-collapse:separate;border-spacing:4px}
.dst-mx th{font-size:12.5px;color:var(--muted);font-weight:500;text-align:left;padding:4px 6px}
.dst-mx td.c{text-align:center;border-radius:10px;padding:8px 4px;cursor:pointer;font-size:13px;min-width:86px;border:1px solid transparent}
.dst-mx td.c:hover{border-color:var(--pink-500)}
.dst-mx td.c b{display:block;font:600 15px/1.2 var(--f-head)}
.dst-mx td.p a>:first-child{width:30px!important;height:30px!important;min-width:0!important;flex:none;overflow:hidden;border-radius:50%}
.dst-mx td.p a>:first-child img,.dst-mx td.p a>:first-child svg{width:100%!important;height:100%!important;object-fit:cover}
.dst-mx td.c small{color:var(--muted);font-size:11.5px}
.dst-mx td.p a{display:flex;align-items:center;gap:8px;color:var(--ink);text-decoration:none;font-size:13.5px;white-space:nowrap}
.dst-f{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:12px}
.dst-f select,.dst-f input{font:inherit;font-size:13.5px;padding:8px 12px;border-radius:12px;border:1px solid var(--line);background:var(--surface);color:var(--ink);max-width:100%}
.dst-f input{flex:1 1 200px}
.dst-seg{display:inline-flex;border:1px solid var(--line);border-radius:99px;overflow:hidden;background:var(--surface)}
.dst-seg button{font:inherit;font-size:13px;padding:8px 14px;border:0;background:none;color:var(--ink);cursor:pointer;display:flex;align-items:center;gap:6px}
.dst-seg button[aria-pressed="true"]{background:var(--pink-500);color:#fff}
.dst-t td,.dst-t th{vertical-align:top}
.dst-t .dst-st{white-space:nowrap;display:flex;align-items:center;gap:8px;font-size:13px}
.dst-t .nm a{color:var(--ink);text-decoration:none}
.dst-t .nm a:hover{text-decoration:underline}
.dst-t .sub{display:block;color:var(--muted);font-size:12px;margin-top:3px}
.dst-t .stg{display:inline-block;font-size:12px;padding:2px 8px;border-radius:99px;background:var(--surface-2);white-space:nowrap}
.dst-cnt{color:var(--muted);font-size:13px}
.dst-empty{padding:28px;text-align:center;color:var(--muted)}
@media (max-width:720px){.dst-hero{grid-template-columns:1fr}.dst-t .hide-s{display:none}}
@media print{.dst-f,.dst-a .acts,.dst-tools{display:none!important}.dst-a,.dst-kc{break-inside:avoid}}
`;
PAGE_R.report=page=>{
  if(!document.getElementById('dst-css')){const s=document.createElement('style');s.id='dst-css';s.textContent=css;document.head.appendChild(s)}
  const A=rowsAll(),N=A.length,R0=A.filter(x=>x.real).length,W=N-R0,pct=N?Math.round(R0/N*100):0;
  const agM={};A.forEach(x=>x.ags.forEach(a=>{const m=agM[a]||(agM[a]={a,n:0,r:0,prods:new Set()});m.n++;if(x.real)m.r++;else m.prods.add(x.p.id)}));
  const AG=Object.values(agM).sort((a,b)=>(b.n-b.r)-(a.n-a.r)||b.n-a.n);
  const agPend=AG.filter(a=>a.n>a.r).length;
  const st={s:'all',q:'',p:'',a:'',g:''};
  try{const q=new URLSearchParams(location.search);['s','p','a','g'].forEach(k=>{if(q.get(k))st[k]=q.get(k)})}catch(e){}
  const C=2*Math.PI*48;
  page.innerHTML=`<div class="ph-title"><div><span class="eyebrow">Data status tracker</span><h1>${L('ติดตามสถานะข้อมูล','Data status tracker')}</h1><p>${L(`ตรวจว่ารายการข้อมูลไหนได้รับข้อมูลจริงแล้ว และรายการไหนยังรอหน่วยงานส่ง · ${N} รายการ จาก 14 สินค้า`,`Which items have real data and which still await agencies · ${N} items across 14 products`)}</p></div></div>
  <div class="dst-hero">
    <div class="card dst-ring"><svg viewBox="0 0 120 120" role="img" aria-label="${pct}%"><circle cx="60" cy="60" r="48" fill="none" stroke="color-mix(in srgb,#e0a800 30%,transparent)" stroke-width="14"/><circle cx="60" cy="60" r="48" fill="none" stroke="#1f9d55" stroke-width="14" stroke-linecap="round" stroke-dasharray="${C*pct/100} ${C}" transform="rotate(-90 60 60)"/><text x="60" y="66" text-anchor="middle" style="font:600 22px var(--f-head);fill:var(--ink)">${pct}%</text></svg>
      <div><b>${R0}<span style="font-size:18px;color:var(--muted)"> / ${N}</span></b><small>${L('รายการที่มีข้อมูลจริงแล้ว','items with real data')}<br>${L('ปรับปรุงล่าสุด','Updated')} ${esc(DATASETS.map(x=>x.asof).filter(Boolean).sort((a,b)=>b.localeCompare(a))[0]||APP.asOf||'')}</small></div></div>
    <div class="dst-k">
      <button class="dst-kc" type="button" data-s="real"><span><i class="dst-dot r"></i>${L('ข้อมูลจริง','Real data')}</span><b>${R0}</b><small>${L('รายการ','items')}</small></button>
      <button class="dst-kc" type="button" data-s="wait"><span><i class="dst-dot w"></i>${L('ยังไม่ดำเนินการ','Not yet received')}</span><b>${W}</b><small>${L('รายการ รอหน่วยงานส่ง','items awaiting agencies')}</small></button>
      <button class="dst-kc" type="button" data-s="all"><span>${ic('db')}${L('รายการทั้งหมด','All items')}</span><b>${N}</b><small>${L('ตามแบบสำรวจ','per survey')}</small></button>
      <div class="dst-kc" style="cursor:default"><span>${ic('bell')}${L('หน่วยงานที่ต้องติดตาม','Agencies to follow up')}</span><b>${agPend}</b><small>${L('จาก ','of ')+AG.length+L(' หน่วยงาน',' agencies')}</small></div>
    </div>
  </div>

  <div class="dst-h"><div><h2>${L('หน่วยงานที่ต้องติดตาม','Agencies to follow up')}</h2><p>${L('เรียงจากหน่วยงานที่ค้างส่งมากที่สุด · กด “ดูรายการค้าง” เพื่อดูชื่อข้อมูล หรือ “คัดลอกหนังสือทวงถาม” เพื่อส่งต่อ','Sorted by most outstanding · open the list or copy a follow-up note')}</p></div></div>
  <div class="dst-ag" id="dstAg"></div>

  <div class="dst-h"><div><h2>${L('ความครบถ้วนรายสินค้า × หมวด','Completeness by product × stage')}</h2><p>${L('ตัวเลข = มีข้อมูลจริง / ทั้งหมด · กดช่องเพื่อกรองตารางด้านล่าง','Real / total · click a cell to filter')}</p></div></div>
  <section class="card"><div class="scroll-x"><table class="dst-mx" id="dstMx"></table></div></section>

  <div class="dst-h" id="dstList"><div><h2>${L('รายการข้อมูลทั้งหมด','All data items')}</h2><p class="dst-cnt" id="dstCnt"></p></div>
    <div class="dst-tools" style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn btn-o sm" type="button" id="dstCsv">${ic('table')} ${L('ดาวน์โหลด CSV','Download CSV')}</button><button class="btn btn-o sm" type="button" id="dstPrint">${ic('print')} ${L('พิมพ์','Print')}</button></div></div>
  <div class="dst-f">
    <div class="dst-seg" role="group" aria-label="${L('สถานะ','Status')}"><button type="button" data-seg="all">${L('ทั้งหมด','All')}</button><button type="button" data-seg="real"><i class="dst-dot r"></i>${L('ข้อมูลจริง','Real')}</button><button type="button" data-seg="wait"><i class="dst-dot w"></i>${L('ยังไม่ดำเนินการ','Pending')}</button></div>
    <select id="dstP" aria-label="${L('สินค้า','Product')}"><option value="">${L('ทุกสินค้า','All products')}</option>${P.map(p=>`<option value="${p.id}">${pad2(p.id)} ${esc(pname(p))}</option>`).join('')}</select>
    <select id="dstA" aria-label="${L('หน่วยงาน','Agency')}"><option value="">${L('ทุกหน่วยงาน','All agencies')}</option>${AG.map(a=>`<option value="${esc(a.a)}">${esc(agShort(a.a))}</option>`).join('')}</select>
    <select id="dstG" aria-label="${L('หมวด','Stage')}"><option value="">${L('ทุกหมวด','All stages')}</option>${STG.map((s,i)=>`<option value="${i}">${L(s[0]+' · '+CHAPTERS[i].t,s[1])}</option>`).join('')}</select>
    <input id="dstQ" type="search" placeholder="${L('ค้นหาชื่อข้อมูล / รหัส','Search item / code')}">
  </div>
  <section class="card"><div class="scroll-x"><table class="t dst-t"><thead><tr><th>${L('สถานะ','Status')}</th><th>${L('ชื่อข้อมูล','Data item')}</th><th>${L('สินค้า','Product')}</th><th>${L('หมวด','Stage')}</th><th>${L('หน่วยงานรับผิดชอบ','Responsible agency')}</th><th class="hide-s">${L('ไฟล์ / ปีข้อมูล','File / years')}</th></tr></thead><tbody id="dstT"></tbody></table></div></section>`;

  const fu=fGet();
  const pendOf=a=>A.filter(x=>!x.real&&x.ags.includes(a));
  const drawAg=()=>{$('#dstAg',page).innerHTML=AG.map((m,i)=>{const w=m.n-m.r,pc=Math.round(m.r/m.n*100),f=fu[m.a];
    return`<div class="dst-a${w?'':' done'}"><h3>${esc(agShort(m.a))}</h3>
      <div class="n"><b>${w}</b><span>${w?L('รายการค้างส่ง','pending'):L('ส่งครบแล้ว','complete')} · ${L('มีข้อมูลจริง','real')} ${m.r}/${m.n}</span></div>
      <div class="dst-bar" title="${pc}%"><i style="width:${pc}%"></i></div>
      <div class="m"><span>${L('สินค้าที่ค้าง','Products pending')}: ${[...m.prods].sort((a,b)=>a-b).map(id=>esc(pname(byId(id)))).join(', ')||'–'}</span></div>
      <div class="dst-fu">${f?L('ทวงถามล่าสุด','Last followed up')+` <b>${thDate(f)}</b>`:L('ยังไม่บันทึกการทวงถาม','No follow-up logged')}</div>
      ${w?`<div class="acts"><button type="button" class="pri" data-ag="${i}">${L('ดูรายการค้าง','Show pending')}</button><button type="button" data-cp="${i}">${L('คัดลอกหนังสือทวงถาม','Copy follow-up')}</button><button type="button" data-fu="${i}">${L('บันทึกว่าทวงถามแล้ว','Log follow-up')}</button></div>`:''}</div>`}).join('')};
  drawAg();

  const cellCol=(r,n)=>{if(!n)return'transparent';const k=r/n;return`color-mix(in srgb,${k>=1?'#1f9d55':k>=.5?'#5bb974':k>0?'#e0a800':'#e0a800'} ${k>=1?32:k>0?22+k*20:16}%,var(--surface))`};
  $('#dstMx',page).innerHTML=`<thead><tr><th>${L('สินค้า','Product')}</th>${STG.map((s,i)=>`<th>${L(s[0],s[1])}<br><span style="font-size:11px">${L(CHAPTERS[i].t,CHAPTERS[i].en)}</span></th>`).join('')}<th>${L('รวม','Total')}</th></tr></thead><tbody>${P.map(p=>{
    const X=A.filter(x=>x.p===p);const cell=(L0,g)=>{const n=L0.length,r=L0.filter(x=>x.real).length;return`<td class="c" style="background:${cellCol(r,n)}" data-mp="${p.id}" data-mg="${g}" title="${r}/${n}"><b>${r}/${n}</b><small>${n?Math.round(r/n*100):0}%</small></td>`};
    return`<tr><td class="p"><a href="${pFile(p.id)}">${badge(p,{label:false})}<span>${pad2(p.id)} ${esc(pname(p))}</span></a></td>${[0,1,2].map(g=>cell(X.filter(x=>x.stage===g),g)).join('')}${cell(X,'')}</tr>`}).join('')}</tbody>`;

  const filt=()=>A.filter(x=>(st.s==='all'||(st.s==='real')===x.real)&&(!st.p||x.p.id==st.p)&&(!st.a||x.ags.includes(st.a))&&(st.g===''||x.stage==st.g)&&(!st.q||(x.d.n+' '+x.d.code+' '+pname(x.p)).toLowerCase().includes(st.q.toLowerCase())));
  const draw=()=>{const F=filt();
    $$('[data-seg]',page).forEach(b=>b.setAttribute('aria-pressed',b.dataset.seg===st.s));
    $$('.dst-kc[data-s]',page).forEach(b=>b.setAttribute('aria-pressed',b.dataset.s===st.s&&!st.p&&!st.a&&st.g===''));
    $('#dstP',page).value=st.p;$('#dstA',page).value=st.a;$('#dstG',page).value=st.g;
    const fr=F.filter(x=>x.real).length;
    $('#dstCnt',page).textContent=L(`แสดง ${F.length} รายการ · ข้อมูลจริง ${fr} · ยังไม่ดำเนินการ ${F.length-fr}`,`${F.length} items · ${fr} real · ${F.length-fr} pending`);
    $('#dstT',page).innerHTML=F.length?F.map(x=>{const ds=x.ds;
      return`<tr><td><span class="dst-st"><i class="dst-dot ${x.real?'r':'w'}"></i>${x.real?L('ข้อมูลจริง','Real data'):L('ยังไม่ดำเนินการ','Pending')}</span></td>
      <td class="nm"><a href="${pFile(x.p.id)}#sb-${x.d.code}">${esc(x.d.n)}</a><span class="sub"><code>${x.d.code}</code>${x.d.u?' · '+L('หน่วย','unit')+' '+esc(x.d.u):''}</span></td>
      <td style="white-space:nowrap">${esc(pname(x.p))}</td>
      <td><span class="stg">${L(STG[x.stage][0],STG[x.stage][1])}</span><span class="sub">${L(CHAPTERS[x.stage].t,CHAPTERS[x.stage].en)}</span></td>
      <td>${x.ags.map(a=>esc(agShort(a))).join('<br>')}</td>
      <td class="hide-s">${x.real&&ds?`<span title="${esc(ds.file)}">${esc(ds.file.length>34?ds.file.slice(0,34)+'…':ds.file)}</span><span class="sub">${L('ปี','Years')} ${(ds.years||[]).join(', ')||'–'}</span>`:`<span class="sub">${L('รอหน่วยงานส่งข้อมูล','Awaiting agency')}</span>`}</td></tr>`}).join(''):`<tr><td colspan="6" class="dst-empty">${L('ไม่พบรายการตามเงื่อนไข','No matching items')}</td></tr>`;
    try{const q=new URLSearchParams();['s','p','a','g'].forEach(k=>{if(st[k]!==''&&!(k==='s'&&st.s==='all'))q.set(k,st[k])});history.replaceState(null,'',location.pathname+(q.toString()?'?'+q:''))}catch(e){}};
  const go=()=>{draw();$('#dstList',page).scrollIntoView({behavior:'smooth',block:'start'})};
  $$('[data-seg]',page).forEach(b=>b.onclick=()=>{st.s=b.dataset.seg;draw()});
  $$('.dst-kc[data-s]',page).forEach(b=>b.onclick=()=>{Object.assign(st,{s:b.dataset.s,p:'',a:'',g:'',q:''});$('#dstQ',page).value='';go()});
  $('#dstP',page).onchange=e=>{st.p=e.target.value;draw()};
  $('#dstA',page).onchange=e=>{st.a=e.target.value;draw()};
  $('#dstG',page).onchange=e=>{st.g=e.target.value;draw()};
  $('#dstQ',page).oninput=e=>{st.q=e.target.value.trim();draw()};
  $('#dstMx',page).onclick=e=>{const c=e.target.closest('td.c');if(!c)return;Object.assign(st,{p:c.dataset.mp,g:c.dataset.mg,a:'',s:'all'});go()};
  const toast=t=>{const d=document.createElement('div');d.textContent=t;d.style.cssText='position:fixed;left:50%;bottom:24px;transform:translateX(-50%);background:var(--ink);color:var(--surface);padding:10px 16px;border-radius:12px;z-index:9999;font-size:14px';document.body.appendChild(d);setTimeout(()=>d.remove(),2200)};
  $('#dstAg',page).onclick=e=>{const b=e.target.closest('button');if(!b)return;
    if(b.dataset.ag){Object.assign(st,{a:AG[+b.dataset.ag].a,s:'wait',p:'',g:''});go()}
    if(b.dataset.cp){const m=AG[+b.dataset.cp],L0=pendOf(m.a);
      const by={};L0.forEach(x=>(by[x.p.id]=by[x.p.id]||[]).push(x));
      const t=`เรียน ${m.a}\n\nสำนักงานสถิติจังหวัดหนองบัวลำภู ขอความอนุเคราะห์ส่งข้อมูลเพื่อปรับปรุงแดชบอร์ด 12 Plus+ สินค้าอัตลักษณ์หนองบัวลำภู ซึ่งยังไม่ได้รับข้อมูล จำนวน ${L0.length} รายการ ดังนี้\n`+
        Object.keys(by).sort((a,b)=>a-b).map(id=>`\n■ ${pname(byId(+id))}\n`+by[id].map((x,i)=>`  ${i+1}. ${x.d.n} (${STG[x.stage][0]}${x.d.u?' · หน่วย '+x.d.u:''})`).join('\n')).join('\n')+
        `\n\nสามารถกรอกข้อมูลตามแบบฟอร์มตารางข้อมูลเดิม แล้วส่งกลับมายังสำนักงานสถิติจังหวัดหนองบัวลำภู\nขอบคุณครับ`;
      (navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(()=>toast(L('คัดลอกหนังสือทวงถามแล้ว','Copied'))).catch(()=>{download(`ทวงถาม_${agShort(m.a)}.txt`,t,'text/plain')})}
    if(b.dataset.fu){fu[AG[+b.dataset.fu].a]=Date.now();fSet(fu);drawAg();toast(L('บันทึกวันที่ทวงถามแล้ว','Follow-up logged'))}};
  $('#dstCsv',page).onclick=()=>download('12plus_data_status.csv','﻿'+[csvRow(['สถานะ','รหัส','ชื่อข้อมูล','หน่วย','สินค้า','หมวด','หน่วยงานรับผิดชอบ','ไฟล์','ปีข้อมูล']),...filt().map(x=>csvRow([x.real?'ข้อมูลจริง':'ยังไม่ดำเนินการ',x.d.code,x.d.n,x.d.u,pname(x.p),STG[x.stage][0]+' · '+CHAPTERS[x.stage].t,x.ags.join(' / '),x.real&&x.ds?x.ds.file:'',x.real&&x.ds?(x.ds.years||[]).join(' '):'']))].join('\n'));
  $('#dstPrint',page).onclick=()=>print();
  draw();
};
})();
