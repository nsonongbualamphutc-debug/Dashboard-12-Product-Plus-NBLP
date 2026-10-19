/* =====================================================================
   12 Plus+ · pages5.js — ชุดข้อมูลจากระบบบัญชีข้อมูลจังหวัด (โครงตามตาราง tidy)
   ตาราง: ปี | จังหวัด | อำเภอ | รายการ | ประเภท | ค่าของข้อมูล | หน่วย | แหล่งที่มา
   ภาพปรับตามมิติของข้อมูล: มีหลายปี → แนวโน้ม · มีอำเภอ → แผนที่+แท่งรายอำเภอ · มีประเภท → สัดส่วน
   ยังไม่มีค่า → แสดง "โครง" (skeleton) ตามโครงสร้างจริง · กดดู "ตัวอย่าง" เพื่อเห็นหน้าตาเมื่อมีข้อมูล
   ===================================================================== */
const DSX={store:{},mode:{},view:{},year:{}};
const dsOf=pid=>DATASETS.filter(d=>d.pid===pid);
const dsRid=ds=>((SET.dsres||{})[ds.code]||ds.resource||'').trim();
const dmerge=(a,b)=>{for(const k in b){if(b[k]&&typeof b[k]==='object'&&!Array.isArray(b[k])&&typeof b[k]!=='function'&&a[k]&&typeof a[k]==='object')dmerge(a[k],b[k]);else a[k]=b[k]}return a};
const dsOpts=x=>dmerge(baseOpts(),x);
const DSCOL=['#E0598F','#B1832A','#5B8DB8','#3E8E41','#8A6440'];
function dsKey(k){k=String(k).replace(/^﻿/,'').trim().toLowerCase();
  if(/ปี|year/.test(k))return'year';if(/อำเภอ|district|amphoe/.test(k))return'dist';if(/จังหวัด|province/.test(k))return'prov';
  if(/ประเภท|type|category/.test(k))return'type';if(/ค่า|value/.test(k))return'value';if(/หน่วย|unit/.test(k))return'unit';
  if(/แหล่ง|source/.test(k))return'src';if(/รายการ|item/.test(k))return'item';return null}
function dsNorm(recs){return recs.map(r=>{const o={};for(const k in r){const m=dsKey(k);if(m&&o[m]==null)o[m]=r[k]}
  let y=parseInt(o.year,10);if(y&&y<2400)y+=543;const v=o.value===''||o.value==null?null:+String(o.value).replace(/,/g,'');
  return{year:y,dist:String(o.dist||'').trim().replace(/^อ\.\s*/,''),type:String(o.type||'').trim()||'รวม',value:isNaN(v)?null:v,unit:o.unit,src:o.src,item:o.item}}).filter(r=>r.year)}
function dsSim(ds,p){const r=rng(ds.code.split('').reduce((a,c)=>a*31+c.charCodeAt(0),7));const ind=p.inds.find(d=>d.code===ds.code);
  const base=ds.unit==='ไร่'?650000:(typeof ind?.val==='number'&&ind.val>0?ind.val:120000);const types=ds.types&&ds.types.length?ds.types:['รวม'];const tw=types.map((_,i)=>i?0.38/(types.length-1):0.62);
  const rows=[];ds.years.forEach((y,yi)=>DISTRICTS.forEach((d,di)=>types.forEach((t,ti)=>{
    const g=1+(yi-ds.years.length+1)*0.035+(r()-.5)*.04;rows.push({year:y,dist:d,type:t,value:Math.round(base*(p.dist[di]/sum(p.dist))*tw[ti]*g*(0.9+r()*.2))})})));return rows}
function dsData(ds,p){const st=DSX.store[ds.code];if(st&&st.rows.some(r=>r.value!=null))return{rows:st.rows,src:st.src,name:st.name};
  if(DSX.mode[ds.code]==='demo')return{rows:dsSim(ds,p),src:'demo'};return null}
function dsAgg(rows,ds){const ys=[...new Set(rows.map(r=>r.year))].sort();const ts=[...new Set([...(ds.types||[]),...rows.map(r=>r.type)])].filter(t=>rows.some(r=>r.type===t));
  const v=(f)=>rows.filter(f).reduce((a,r)=>a+(r.value||0),0);const has=(f)=>rows.some(r=>f(r)&&r.value!=null);return{ys,ts,v,has}}
const dsYears=ds=>ds.years.map(y=>yCE(y));
function dsTemplate(rows){download(rows.file+'.csv',[csvRow(TIDY_COLS),...rows.list.map(r=>csvRow(r))].join('\n'))}
function dsTemplateRows(ds){const L0=[];const types=ds.types&&ds.types.length?ds.types:[''];const dists=ds.district?DISTRICTS:['รวมทั้งจังหวัด'];
  ds.years.forEach(y=>dists.forEach(d=>types.forEach(t=>L0.push([y,'หนองบัวลำภู',d,ds.item,t,'',ds.unit,ds.source]))));return{file:ds.file||ds.code,list:L0}}

/* ---------- การ์ดชุดข้อมูล ---------- */
function dsCard(ds,p){
  const D=dsData(ds,p),mode=DSX.mode[ds.code]||'frame',view=DSX.view[ds.code]||'viz',rid=dsRid(ds);
  const types=ds.types&&ds.types.length?ds.types:['รวม'],nRows=ds.years.length*(ds.district?6:1)*types.length;
  const st=D?D.src:'frame';
  const pillH={api:`<span class="pill api">API</span>`,file:`<span class="pill has">${L('ไฟล์ทดลอง','Test file')}</span>`,demo:`<span class="pill sim">${L('ค่าตัวอย่าง','Sample')}</span>`,frame:`<span class="pill wait">${L('รอค่าข้อมูล','Awaiting values')}</span>`}[st];
  return`<article class="dsx" id="dsx-${ds.code}" style="--pa:${p.pa}">
  <header class="dsx-h">
    <div class="dsx-t"><span class="dsx-code">${ds.code}</span>${pillH}<h3>${esc(ds.item)}</h3>
      <p>${L('หน่วย','Unit')} <b>${esc(ds.unit)}</b> · ${L('แหล่งที่มา','Source')} <b>${esc(ds.source)}</b>${D&&D.name?` · ${L('ไฟล์','File')} <b>${esc(D.name)}</b>`:''}</p></div>
    <div class="dsx-a">
      ${D&&D.src!=='demo'?'':`<div class="seg sm" role="group"><button type="button" data-dsm="frame" aria-pressed="${mode==='frame'}">${L('โครง','Frame')}</button><button type="button" data-dsm="demo" aria-pressed="${mode==='demo'}">${L('ดูตัวอย่าง','Preview')}</button></div>`}
      <div class="seg sm" role="group"><button type="button" data-dsv="viz" aria-pressed="${view==='viz'}">${ic('chart')}</button><button type="button" data-dsv="table" aria-pressed="${view==='table'}">${ic('table')}</button></div>
    </div>
  </header>
  <div class="dsx-schema" aria-label="${L('โครงสร้างตาราง','Table structure')}">
    ${TIDY_COLS.map(c=>{const m={'ปี':`${yCE(ds.years[0])}–${yCE(ds.years[ds.years.length-1])}`,'จังหวัด':'หนองบัวลำภู','อำเภอ':ds.district?L('6 อำเภอ','6 districts'):L('รวมจังหวัด','Province'),'รายการ':ds.item,'ประเภท':types.join(' / '),'ค่าของข้อมูล':D?L('มีค่าแล้ว','filled'):L('รอกรอก','to fill'),'หน่วย':ds.unit,'แหล่งที่มา':ds.source.replace('จังหวัดหนองบัวลำภู','จ.')}[c];return`<span class="${c==='ค่าของข้อมูล'?(D?'ok':'todo'):''}"><b>${c}</b>${esc(m)}</span>`}).join('')}
    <span class="cnt"><b>${nRows}</b>${L('แถว','rows')}</span>
  </div>
  <div class="dsx-b">${view==='table'?dsTable(ds,p,D):D?dsViz(ds,p,D):dsSkel(ds)}</div>
  <footer class="dsx-f">
    <button class="btn btn-o sm" type="button" data-dst>${ic('down')} ${L('แม่แบบตาราง (CSV)','Template (CSV)')}</button>
    <label class="btn btn-o sm dsx-up">${ic('report')} ${L('ทดลองนำเข้าไฟล์','Try a file')}<input type="file" accept=".csv,.xlsx,.xls" hidden></label>
    ${ds.drive?`<a class="btn btn-g sm" href="${ds.drive}" target="_blank" rel="noopener">${ic('ext')} ${L('ไฟล์ต้นทาง','Source file')}</a>`:''}
    <span class="sp"></span>
    <label class="dsx-rid"><span>resource_id</span><input type="text" value="${esc(rid)}" placeholder="${L('วางรหัสจากระบบบัญชีข้อมูล','paste from data catalog')}" spellcheck="false"></label>
    <button class="btn btn-p sm" type="button" data-dsapi>${ic('api')} ${L('ดึงจาก API','Fetch')}</button>
  </footer></article>`}

function dsSkel(ds){const types=ds.types&&ds.types.length?ds.types:['รวม'];
  return`<div class="dsx-grid skel">
    <div class="dsx-kpis">${[L('รวมทั้งจังหวัด','Province total')+' · '+yCE(ds.years.at(-1)),L('เปลี่ยนแปลงจากปีก่อน','vs previous year'),L('อำเภอสูงสุด','Top district'),L('สัดส่วนตามประเภท','Share by type')].map(l=>`<div class="k"><small>${l}</small><b><i class="sk w60"></i></b><span>${esc(ds.unit)}</span></div>`).join('')}</div>
    <div class="dsx-c"><h4>${L('แนวโน้มรายปี','Yearly trend')}${types.length>1?L(' แยกประเภท',' by type'):''}</h4><div class="sk-bars">${ds.years.map((y,i)=>`<div><i class="sk" style="height:${35+i*12}%"></i><span>${yCE(y)}</span></div>`).join('')}</div></div>
    <div class="dsx-c"><h4>${L('สัดส่วนตามประเภท','Share by type')}</h4><div class="sk-donut"><i class="sk ring"></i><ul>${types.map((t,i)=>`<li><i style="background:${i?DSCOL[i%5]:'var(--pa)'}"></i>${esc(t)}</li>`).join('')}</ul></div></div>
    ${ds.district?`<div class="dsx-c wide"><h4>${L('รายอำเภอ','By district')}</h4><div class="dsx-dist"><div class="dsx-map sk-map">${mapSVG(DISTRICTS.map(()=>1),null)}</div><ul class="sk-list">${DISTRICTS.map((d,i)=>`<li><span>${esc(L(d,DISTRICTS_EN[i]))}</span><i class="sk" style="width:${70-i*8}%"></i></li>`).join('')}</ul></div></div>`:''}
    <div class="sk-note">${ic('db')}<span><b>${L('โครงพร้อมแล้ว','Frame is ready')}</b>${L(' รอค่าของข้อมูลจากหน่วยงาน · กด "ดูตัวอย่าง" เพื่อดูหน้าตาเมื่อมีข้อมูล',' — awaiting agency values · press "Preview" to see it with data')}</span></div>
  </div>`}

function dsViz(ds,p,D){const A=dsAgg(D.rows,ds);const ysd=A.ys.filter(y=>A.has(r=>r.year===y));const yl=ysd.at(-1),yp=ysd.at(-2);
  const sel=DSX.year[ds.code]&&ysd.includes(DSX.year[ds.code])?DSX.year[ds.code]:yl;
  const tot=A.v(r=>r.year===sel),prv=yp&&sel===yl?A.v(r=>r.year===yp):A.v(r=>r.year===sel-1);
  const dv=DISTRICTS.map(d=>A.v(r=>r.year===sel&&r.dist===d));const top=dv.indexOf(Math.max(...dv));
  const tv=A.ts.map(t=>A.v(r=>r.year===sel&&r.type===t));const tt=sum(tv)||1;
  return`<div class="dsx-grid">
    <div class="dsx-yr" role="group" aria-label="${L('เลือกปี','Year')}">${ysd.map(y=>`<button type="button" data-dsy="${y}" aria-pressed="${y===sel}">${yCE(y)}</button>`).join('')}</div>
    <div class="dsx-kpis">
      <div class="k"><small>${L('รวมทั้งจังหวัด','Province total')} · ${yCE(sel)}</small><b class="num">${nf.format(Math.round(tot))}</b><span>${esc(ds.unit)}</span></div>
      <div class="k"><small>${L('เปลี่ยนแปลงจากปีก่อน','vs previous year')}</small><b class="num ${tot>=prv?'pos':'neg'}">${prv?(tot>=prv?'▲ ':'▼ ')+pct(Math.abs(tot/prv-1)).slice(1):'–'}</b><span>${prv?L('จาก ','from ')+nf.format(Math.round(prv)):''}</span></div>
      <div class="k"><small>${L('อำเภอสูงสุด','Top district')}</small><b>${ds.district?esc(L(DISTRICTS[top],DISTRICTS_EN[top])):'–'}</b><span>${ds.district?nf.format(Math.round(dv[top]))+' '+esc(ds.unit)+' · '+pct(dv[top]/(tot||1)).slice(1):''}</span></div>
      <div class="k"><small>${L('สัดส่วนตามประเภท','Share by type')}</small><b>${A.ts.length>1?A.ts.map((t,i)=>`<em style="color:${i?DSCOL[i%5]:p.pa}">${Math.round(tv[i]/tt*100)}%</em>`).join(' / '):'100%'}</b><span>${A.ts.map(esc).join(' / ')}</span></div>
    </div>
    <div class="dsx-c"><h4>${L('แนวโน้มรายปี','Yearly trend')}${A.ts.length>1?L(' แยกประเภท',' by type'):''}</h4><div class="chart-box sm"><canvas id="dsT-${ds.code}"></canvas></div></div>
    <div class="dsx-c"><h4>${L('สัดส่วนตามประเภท','Share by type')} · ${yCE(sel)}</h4><div class="chart-box sm"><canvas id="dsD-${ds.code}"></canvas></div></div>
    ${ds.district?`<div class="dsx-c wide"><h4>${L('รายอำเภอ','By district')} · ${yCE(sel)}</h4><div class="dsx-dist"><div class="dsx-map">${mapSVG(dv,p)}</div><div class="chart-box sm"><canvas id="dsB-${ds.code}"></canvas></div></div></div>`:''}
  </div>`}
function dsDraw(ds,p){const D=dsData(ds,p);if(!D||(DSX.view[ds.code]||'viz')!=='viz')return;const A=dsAgg(D.rows,ds);const ysd=A.ys.filter(y=>A.has(r=>r.year===y));
  const sel=DSX.year[ds.code]&&ysd.includes(DSX.year[ds.code])?DSX.year[ds.code]:ysd.at(-1);const col=i=>i===0?p.pa:DSCOL[i%5];
  const tip={callbacks:{label:c=>` ${c.dataset.label||c.label}: ${nf.format(Math.round(c.raw))} ${ds.unit}`}};
  mk('dsT-'+ds.code,{type:'bar',data:{labels:ysd.map(yCE),datasets:A.ts.map((t,i)=>({label:t,data:ysd.map(y=>A.v(r=>r.year===y&&r.type===t)),backgroundColor:col(i),borderRadius:6,stack:'s',maxBarThickness:46}))},
    options:dsOpts({plugins:{legend:{display:A.ts.length>1,position:'bottom'},tooltip:tip},scales:{x:{stacked:true,grid:{display:false}},y:{stacked:true,ticks:{callback:v=>fShort(v).replace(' ลบ.','M')}}}})});
  mk('dsD-'+ds.code,{type:'doughnut',data:{labels:A.ts,datasets:[{data:A.ts.map(t=>A.v(r=>r.year===sel&&r.type===t)),backgroundColor:A.ts.map((_,i)=>col(i)),borderWidth:2,borderColor:css('--surface')}]},options:{maintainAspectRatio:false,cutout:'62%',plugins:{legend:{position:'bottom'},tooltip:tip}}});
  if(ds.district)mk('dsB-'+ds.code,{type:'bar',data:{labels:DISTRICTS.map((d,i)=>L(d.replace('เมืองหนองบัวลำภู','เมืองฯ'),DISTRICTS_EN[i])),datasets:A.ts.map((t,i)=>({label:t,data:DISTRICTS.map(d=>A.v(r=>r.year===sel&&r.dist===d&&r.type===t)),backgroundColor:col(i),borderRadius:5,stack:'s'}))},
    options:dsOpts({indexAxis:'y',plugins:{legend:{display:false},tooltip:tip},scales:{x:{stacked:true,ticks:{callback:v=>fShort(v).replace(' ลบ.','M')}},y:{stacked:true,grid:{display:false},ticks:{callback:function(v){return this.getLabelForValue(v)}}}}})});
}
function dsTable(ds,p,D){const types=ds.types&&ds.types.length?ds.types:['รวม'];const dists=ds.district?DISTRICTS:['รวมทั้งจังหวัด'];
  const A=D?dsAgg(D.rows,ds):null;const cell=(y,d,t)=>{if(!A)return'<td class="r todo">·</td>';const has=A.has(r=>r.year===y&&(d==='รวมทั้งจังหวัด'||r.dist===d)&&r.type===t);return`<td class="r num">${has?nf.format(Math.round(A.v(r=>r.year===y&&(d==='รวมทั้งจังหวัด'||r.dist===d)&&r.type===t))):'–'}</td>`};
  return`<div class="scroll-x"><table class="t dsx-tb"><thead><tr><th>${L('อำเภอ','District')}</th><th>${L('ประเภท','Type')}</th>${ds.years.map(y=>`<th class="r">${yCE(y)}</th>`).join('')}</tr></thead><tbody>
  ${dists.map(d=>types.map((t,ti)=>`<tr>${ti===0?`<td rowspan="${types.length}"><b>${esc(d)}</b></td>`:''}<td><i class="dot" style="background:${ti?DSCOL[ti%5]:p.pa}"></i>${esc(t)}</td>${ds.years.map(y=>cell(y,d,t)).join('')}</tr>`).join('')).join('')}
  </tbody></table></div>${A?'':`<p class="note" style="margin:8px 0 0">${L('ช่อง · คือช่องที่รอหน่วยงานกรอกค่า ตรงกับคอลัมน์ "ค่าของข้อมูล" ในไฟล์','Each · is a value the agency will fill in the "ค่าของข้อมูล" column')}</p>`}`}

/* ---------- ส่วนในหน้าสินค้า ---------- */
function dsSection(p){const L0=dsOf(p.id);const codes=new Set(L0.map(d=>d.code));const wait=p.inds.filter(d=>!codes.has(d.code));
  return`<section class="card dsx-sec" id="dsx">
    <div class="card-h"><h3>${L('ข้อมูลจากระบบบัญชีข้อมูลจังหวัด','From the provincial data catalog')}</h3><span class="note">${L('ภาพปรับตามโครงสร้างตาราง: ปี · อำเภอ · ประเภท','Visuals follow the table: year · district · type')}</span></div>
    ${L0.length?L0.map(ds=>dsCard(ds,p)).join(''):`<p class="note">${L('ยังไม่มีชุดข้อมูลของสินค้านี้ในทะเบียน · ใช้แม่แบบด้านล่างเพื่อเตรียมไฟล์','No datasets registered yet · use the templates below')}</p>`}
    <details class="dsx-wait"${L0.length?'':' open'}><summary>${L('รายการตามแบบสำรวจที่ยังไม่มีไฟล์','Survey items without a file yet')} <b>${wait.length}</b> ${L('รายการ · ดาวน์โหลดแม่แบบได้','· templates available')}</summary>
      <div class="dsx-chips">${wait.map(d=>`<button type="button" class="dsx-chip" data-dstw="${d.code}" title="${L('ดาวน์โหลดแม่แบบตาราง','Download template')}"><code>${d.code}</code>${esc(d.n)}${d.vt==='district'?`<i>${L('รายอำเภอ','by district')}</i>`:''}${ic('down')}</button>`).join('')}</div></details>
  </section>`}
function dsBind(p,root){
  dsOf(p.id).forEach(ds=>{const el=$('#dsx-'+ds.code,root);if(!el)return;
    const re=()=>{el.outerHTML=dsCard(ds,p);dsBind1(ds,p)};
    function dsBind1(ds,p){const e=$('#dsx-'+ds.code);if(!e)return;
      $$('[data-dsm]',e).forEach(b=>b.onclick=()=>{DSX.mode[ds.code]=b.dataset.dsm;re2()});
      $$('[data-dsv]',e).forEach(b=>b.onclick=()=>{DSX.view[ds.code]=b.dataset.dsv;re2()});
      $$('[data-dsy]',e).forEach(b=>b.onclick=()=>{DSX.year[ds.code]=+b.dataset.dsy;re2()});
      $('[data-dst]',e).onclick=()=>dsTemplate(dsTemplateRows(ds));
      $('.dsx-up input',e).onchange=async ev=>{const f=ev.target.files[0];if(!f)return;try{const rows=await dsReadFile(f);DSX.store[ds.code]={rows:dsNorm(rows),src:'file',name:f.name};toast(L('นำเข้าไฟล์แล้ว ','Loaded ')+rows.length+L(' แถว (แสดงเฉพาะเครื่องนี้)',' rows (this device only)'));re2()}catch(err){toast(L('อ่านไฟล์ไม่ได้: ','Cannot read file: ')+err.message)}};
      $('[data-dsapi]',e).onclick=async()=>{const v=$('.dsx-rid input',e).value.trim();SET.dsres=SET.dsres||{};SET.dsres[ds.code]=v;saveSet();if(!v){toast(L('กรุณาวาง resource_id','Paste a resource_id'));return}await dsFetch(ds);re2()};
      $$('.dsx [data-act],.dsx a').forEach(()=>{});
      if(typeof FX!=='undefined'&&FX.glueNode)FX.glueNode(e);
      dsDraw(ds,p)}
    function re2(){const e=$('#dsx-'+ds.code);if(!e)return;killDs(ds);e.outerHTML=dsCard(ds,p);dsBind1(ds,p)}
    dsBind1(ds,p);
    if(dsRid(ds)&&!DSX.store[ds.code])dsFetch(ds).then(ok=>{if(ok)re2()});
  });
  $$('[data-dstw]',root).forEach(b=>b.onclick=()=>{const d=p.inds.find(x=>x.code===b.dataset.dstw);dsTemplate(dsTemplateRows({code:d.code,file:d.code+'_'+d.n.replace(/[\\/:*?"<>|()]/g,'').replace(/\s+/g,''),item:d.n.replace(/\s*\(จำแนกอำเภอ\)/,''),unit:d.u,source:d.ag,years:[2566,2567,2568,2569],district:d.vt==='district',types:[]}))});
}
function killDs(ds){for(let i=charts.length-1;i>=0;i--){const c=charts[i];const id=c.canvas&&c.canvas.id||'';if(/^ds[TDB]-/.test(id)&&id.endsWith(ds.code)){try{c.destroy()}catch(e){}charts.splice(i,1)}}}
async function dsFetch(ds){const rid=dsRid(ds);if(!rid)return false;
  try{const d=await DS.get(`/datastore_search?resource_id=${encodeURIComponent(rid)}&limit=10000`);const rec=d?.result?.records||[];
    DSX.store[ds.code]={rows:dsNorm(rec),src:'api',name:'API · '+rec.length+L(' แถว',' rows')};logAdd(`${ds.code} ${ds.item}: ดึงจาก API ${rec.length} แถว`,'api');return true}
  catch(e){toast(L('ดึงข้อมูลไม่สำเร็จ: ','Fetch failed: ')+(e.message||e));return false}}
async function dsReadFile(f){
  if(/\.csv$/i.test(f.name)){const t=(await f.text()).replace(/^﻿/,'');const lines=t.split(/\r?\n/).filter(Boolean);const parse=l=>{const o=[];let cur='',q=false;for(let i=0;i<l.length;i++){const c=l[i];if(q){if(c==='"'&&l[i+1]==='"'){cur+='"';i++}else if(c==='"')q=false;else cur+=c}else if(c==='"')q=true;else if(c===','){o.push(cur);cur=''}else cur+=c}o.push(cur);return o};
    const h=parse(lines[0]);return lines.slice(1).map(l=>{const v=parse(l);const o={};h.forEach((k,i)=>o[k]=v[i]);return o})}
  if(!window.XLSX)await new Promise((res,rej)=>{const s=document.createElement('script');s.src='https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';s.onload=res;s.onerror=()=>rej(new Error('โหลดตัวอ่าน Excel ไม่ได้'));document.head.appendChild(s)});
  const wb=XLSX.read(await f.arrayBuffer(),{type:'array'});const ws=wb.Sheets[wb.SheetNames[0]];
  /* หาแถวหัวตารางที่มีคำว่า "ปี" */
  const aoa=XLSX.utils.sheet_to_json(ws,{header:1,defval:''});const hi=aoa.findIndex(r=>r.some(c=>/ปี|year/i.test(String(c))));const h=aoa[hi<0?0:hi].map(String);
  return aoa.slice((hi<0?0:hi)+1).filter(r=>r.some(c=>c!=='')).map(r=>{const o={};h.forEach((k,i)=>o[k]=r[i]);return o})}

/* ---------- เสียบเข้าหน้าสินค้า ---------- */
const _prodR5=PAGE_R.product;
PAGE_R.product=(page,p)=>{_prodR5(page,p);const vs=$('#vs',page);if(vs){vs.insertAdjacentHTML('beforebegin',dsSection(p));dsBind(p,page)}};

/* ---------- ทะเบียนชุดข้อมูลในหน้าแหล่งข้อมูล ---------- */
const _srcR5=PAGE_R.sources;
PAGE_R.sources=(page,p)=>{_srcR5(page,p);page.insertAdjacentHTML('afterbegin',`<section class="card dsx-reg"><div class="card-h"><h3>${L('ทะเบียนชุดข้อมูล (โครงสร้างตารางที่นำขึ้นระบบบัญชีข้อมูล)','Dataset register (tables for the data catalog)')}</h3><span class="note">${DATASETS.length} ${L('ชุดข้อมูล','datasets')}</span></div>
  <div class="dsx-schema" style="margin-bottom:12px">${TIDY_COLS.map(c=>`<span><b>${c}</b></span>`).join('')}</div>
  <div class="scroll-x"><table class="t"><thead><tr><th>${L('รหัส','Code')}</th><th>${L('สินค้า','Product')}</th><th>${L('ไฟล์ / รายการ','File / item')}</th><th>${L('มิติ','Dimensions')}</th><th>${L('หน่วย','Unit')}</th><th>${L('แหล่งที่มา','Source')}</th><th>${L('สถานะ','Status')}</th><th></th></tr></thead><tbody>
  ${DATASETS.map(ds=>{const pp=byId(ds.pid);return`<tr><td><code>${ds.code}</code></td><td><a href="${pFile(ds.pid)}#dsx">${esc(pname(pp))}</a></td><td>${esc(ds.file)}</td><td>${L('ปี','Year')} ${yCE(ds.years[0])}–${yCE(ds.years.at(-1))}${ds.district?L(' · 6 อำเภอ',' · 6 districts'):''}${ds.types?.length?' · '+ds.types.map(esc).join('/'):''}</td><td>${esc(ds.unit)}</td><td>${esc(ds.source)}</td><td>${dsRid(ds)?pill('api'):pill('wait')}</td><td><button class="btn btn-o sm" type="button" data-regt="${ds.code}">${ic('down')} CSV</button></td></tr>`}).join('')}
  </tbody></table></div></section>`);
  $$('[data-regt]',page).forEach(b=>b.onclick=()=>dsTemplate(dsTemplateRows(DATASETS.find(d=>d.code===b.dataset.regt))));
};
