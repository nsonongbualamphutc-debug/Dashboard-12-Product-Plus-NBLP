/* =====================================================================
   12 Plus+ · pages6.js — โหมดยึดข้อมูลจริง (DATA_ONLY)
   แสดงเฉพาะข้อมูลจากไฟล์ที่หน่วยงานส่ง (ทะเบียน DATASETS ใน data.js)
   ตัวเลข/กราฟที่มาจากค่าจำลองถูกตัดออก · ชุดข้อมูลที่ยังว่างแสดงเป็น "โครง"
   ===================================================================== */
if(typeof SET!=='undefined'&&SET.side)document.documentElement.dataset.side=SET.side;
if(DATA_ONLY){
const nItems=()=>sum(P.map(p=>p.inds.length));
const dsFilled=ds=>{const st=DSX.store[ds.code];return!!(st&&st.rows.some(r=>r.value!=null))};
const dsRowsExp=ds=>ds.years.length*(ds.district?6:1)*Math.max(1,(ds.types||[]).length);
const dsRowsHave=ds=>{const st=DSX.store[ds.code];return st?st.rows.filter(r=>r.value!=null).length:0};
const F=()=>{const n=DATASETS.length,f=DATASETS.filter(dsFilled).length,exp=sum(DATASETS.map(dsRowsExp)),have=sum(DATASETS.map(dsRowsHave));return{n,f,exp,have,items:nItems(),prods:new Set(DATASETS.map(d=>d.pid)).size}};
const stPill=ds=>dsFilled(ds)?pill(DSX.store[ds.code].src==='api'?'api':'has'):`<span class="pill wait">${L('โครง · รอค่าข้อมูล','Frame · awaiting values')}</span>`;
const pStat=p=>{const L0=dsOf(p.id);return{n:L0.length,f:L0.filter(dsFilled).length}};

/* ---------- เมนูซ้าย: ไม่มีตัวเลขจำลอง ---------- */
const _nav=navRender;
navRender=function(){_nav();
  $('#navMain').innerHTML=['cover','overview','map','brief','buyer'].map(k=>`<a href="${PAGES[k].f}"${R.page===k?' aria-current="page"':''}>${ic(PAGES[k].ic)}${PT(k)}</a>`).join('');
  $('#navP').innerHTML=P.map(p=>{const s=pStat(p);return`<a href="${pFile(p.id)}"${R.page==='product'&&R.pid===p.id?' aria-current="page"':''}><span class="no">${pad2(p.id)}</span>${badge(p,{label:false})}<span class="n">${esc(pname(p))}${giTag(p,'sm')}<span class="v">${s.n?L(`ชุดข้อมูล ${s.n}`,`${s.n} dataset${s.n>1?'s':''}`):L('รอไฟล์ข้อมูล','Awaiting file')}</span></span><span class="g ds-dot ${s.f?'ok':s.n?'frame':''}" title="${s.f?L('มีข้อมูล','Has data'):s.n?L('มีโครงตาราง','Frame ready'):L('ยังไม่มีไฟล์','No file yet')}"></span></a>`}).join('');
  $('#period').innerHTML='';
  const sf=$('.side-foot');if(sf&&!$('.side-pick')){const cur=document.documentElement.dataset.side||'00';sf.insertAdjacentHTML('beforeend',`<div class="side-pick" role="group" aria-label="${L('ภาพแถบข้าง','Sidebar art')}"><span>${L('ภาพแถบข้าง','Sidebar')}</span>${['00','01','02','none'].map(k=>`<button type="button" class="${k==='none'?'none':''}" data-side="${k}" aria-pressed="${k===cur}" title="${k==='none'?L('ไม่มีภาพ','None'):'SIDE '+k}" ${k==='none'?'':`style="background-image:url(img/side-${k}.webp)"`}></button>`).join('')}</div>`);
    $$('.side-pick [data-side]').forEach(b=>b.onclick=e=>{e.stopPropagation();SET.side=b.dataset.side;saveSet();document.documentElement.dataset.side=SET.side;$$('.side-pick [data-side]').forEach(x=>x.setAttribute('aria-pressed',x===b))})}
  const ao=$('#asofT');if(ao)ao.textContent=L('ข้อมูลจากระบบบัญชีข้อมูลจังหวัด','From the provincial data catalog');const as2=ao&&ao.nextElementSibling;if(as2)as2.textContent=L(`ชุดข้อมูล ${DATASETS.length} ชุด · ยึดตามไฟล์ของหน่วยงาน`,`${DATASETS.length} dataset(s) · agency files only`);
};
PAGES.map.t='แผนที่ข้อมูลรายอำเภอ';PAGES.map.en='District data map';
PAGES.report.t='รายงานความพร้อมข้อมูล';PAGES.report.en='Data readiness report';

/* ---------- หน้าปก ---------- */
const _cover=PAGE_R.cover;
PAGE_R.cover=page=>{_cover(page);const f=F();
  const st=$('.cv-stats',page);if(st)st.innerHTML=`<div><b>14</b><span>${L('สินค้าอัตลักษณ์','identity products')}</span></div><div><b>${P.filter(x=>x.gi).length}</b><span>${L('สินค้า GI','GI products')}</span></div><div><b>${f.n}</b><span>${L('ชุดข้อมูลจากหน่วยงาน','agency datasets')}</span></div><div><b>${f.items}</b><span>${L('รายการตามแบบสำรวจ','survey items')}</span></div>`;
  const lead=$('.cv-lead',page);if(lead)lead.innerHTML=L('<span class="nw">ของดี 14 รายการของจังหวัด</span> <span class="nw">เล่าด้วยภาพ เรื่องราว และร้านที่ซื้อได้</span><br><span class="nw">ตัวเลขทุกตัวมาจากไฟล์ของหน่วยงานเจ้าของข้อมูล</span> <span class="nw">ผ่านระบบบัญชีข้อมูลจังหวัด</span>','The province’s 14 signature products — told through images, stories and where to buy. Every figure comes from the owning agency’s file via the provincial data catalog.');
  $$('.tick',page).forEach(e=>e.remove());$$('.now',page).forEach(e=>e.closest('.cv-sec')?.remove());
  $$('.tile',page).forEach((t,i)=>{const p=P[i];const e=[...t.querySelectorAll('.tx > span')].filter(x=>!x.classList.contains('gi')).pop();if(!p||!e)return;const s=pStat(p);e.innerHTML=s.n?L(`ชุดข้อมูล ${s.n}`,`${s.n} dataset(s)`):L('รอไฟล์ข้อมูล','Awaiting file')});
  const ql=$('.qlinks',page);if(ql){ql.querySelector('a[href="insights.html"]')?.remove();const m=ql.querySelector('a[href="map.html"]');if(m)m.querySelector('span').textContent=L('ข้อมูลรายอำเภอจากไฟล์ของหน่วยงาน','District data from agency files');const r=ql.querySelector('a[href="report.html"]');if(r){r.querySelector('b').textContent=PT('report');r.querySelector('span').textContent=L('สินค้าไหนมีไฟล์แล้ว ไหนยังรอ','Which products have files and which are pending')}
    const b=ql.querySelector('a[href="buyer.html"]');if(b)b.querySelector('span').textContent=L('มาตรฐาน GI และขอใบเสนอราคา','GI standards and request a quote')}
};

/* ---------- ภาพรวม ---------- */
PAGE_R.overview=page=>{const f=F();
  page.innerHTML=`
  <section class="ov-hero"><div class="bg"></div><div class="hx-grid" aria-hidden="true"></div><canvas class="fx-dust" aria-hidden="true"></canvas><div class="ov-txt">
    <span class="eyebrow">${L('ภาพรวม · ข้อมูลจากหน่วยงาน','Overview · agency data')}</span>
    <h1>${L('ของดี <em>14 อย่าง</em><br>จากแผ่นดินหนองบัวลำภู','<em>14 signature</em><br>products of Nong Bua Lam Phu')}</h1>
    <p>${L('แสดงเฉพาะข้อมูลจากไฟล์ที่หน่วยงานเจ้าของข้อมูลส่งขึ้นระบบบัญชีข้อมูลจังหวัด ชุดที่ยังไม่มีค่าแสดงเป็นโครงตาราง เพื่อให้เห็นว่าจะนำเสนออย่างไรเมื่อข้อมูลมาถึง','Only figures from files the owning agencies publish to the provincial catalog. Empty datasets appear as frames showing how they will be presented.')}</p>
    <div class="cta"><a class="btn btn-f" href="${pFile(1)}">${L('เริ่มชมสินค้าชิ้นแรก','Start the tour')} ${ic('arrowR')}</a><a class="btn btn-glass" href="sources.html">${ic('db')} ${L('ทะเบียนชุดข้อมูล','Dataset register')}</a></div></div></section>
  <div class="kpis">
    ${kpi(L('ชุดข้อมูลจากหน่วยงาน','Agency datasets'),f.n,L('ชุด','sets'),L('ครอบคลุม ','Covering ')+f.prods+L(' สินค้า',' product(s)'),'',pill('has'))}
    ${kpi(L('ชุดข้อมูลที่มีค่าแล้ว','Datasets with values'),f.f,'/ '+f.n,f.f?L('พร้อมแสดงผล','Ready'):L('รอค่าของข้อมูล','Awaiting values'),'',f.f?pill('real'):pill('wait'))}
    ${kpi(L('แถวข้อมูลที่กรอกแล้ว','Rows filled'),nf.format(f.have),'/ '+nf.format(f.exp),L('ตามโครงตารางที่ส่งมา','per submitted tables'),'',pill('wait'))}
    ${kpi(L('รายการตามแบบสำรวจ','Survey items'),f.items,L('รายการ','items'),L('ยังไม่มีไฟล์ ','Without a file: ')+(f.items-f.n),'',pill('wait'))}
  </div>
  <section class="card"><div class="card-h"><h3>${L('ความพร้อมข้อมูลรายสินค้า','Data readiness by product')}</h3><span class="note">${L('แตะการ์ดเพื่อดูโครงข้อมูลของสินค้า','Tap a card for its data frame')}</span></div>
    <div class="rdy">${P.map(p=>{const L0=dsOf(p.id),s=pStat(p),pc=L0.length/p.inds.length;return`<a class="rdy-c" href="${pFile(p.id)}#dsx" style="--pa:${p.pa}"><div class="ph" style="background-image:url(${IMG('kv',p.id)})"></div>
      <div class="b"><span class="h">${badge(p,{label:false})}<b>${pad2(p.id)} ${esc(pname(p))}</b></span>
      <span class="bar"><i style="width:${Math.max(pc*100,L0.length?6:0)}%"></i></span>
      <span class="m">${L0.length?`${L0.length} / ${p.inds.length} ${L('รายการมีไฟล์','items with a file')}`:`0 / ${p.inds.length} ${L('รายการ · รอไฟล์','items · awaiting')}`}</span>
      <span class="s">${s.f?pill('real'):L0.length?`<span class="pill wait">${L('มีโครงตาราง','Frame ready')}</span>`:`<span class="pill none">${L('ยังไม่มีไฟล์','No file yet')}</span>`}</span></div></a>`}).join('')}</div></section>
  <section class="card dsx-sec"><div class="card-h"><h3>${L('ชุดข้อมูลที่ส่งมาแล้ว','Datasets received')}</h3><span class="note">${f.n} ${L('ชุด · ภาพปรับตามโครงสร้างตาราง','sets · visuals follow table structure')}</span></div>
    ${DATASETS.map(ds=>dsCard(ds,byId(ds.pid))).join('')}</section>`;
  DATASETS.map(d=>d.pid).filter((v,i,a)=>a.indexOf(v)===i).forEach(pid=>dsBind(byId(pid),page));
};

/* ---------- หน้าสินค้า: ตัดส่วนค่าจำลอง ---------- */
const _prod=PAGE_R.product;
PAGE_R.product=(page,p)=>{_prod(page,p);
  $$('.hx .ar, .grid-2, .grid-3, #vs, #buyer, .va',page).forEach(e=>{(e.classList.contains('va')?e.closest('section'):e)?.remove()});
  const L0=dsOf(p.id),s=pStat(p),ags=[...new Set(p.inds.map(d=>d.ag))];
  const hs=$('.hx-stats',page);if(hs)hs.innerHTML=`
    <div class="st"><small>${L('ชุดข้อมูลจากหน่วยงาน','Agency datasets')}</small><b><span class="cu">${s.n}</span><em>${L('ชุด','sets')}</em></b><span class="d">${s.f?L('มีค่าแล้ว ','With values: ')+s.f:s.n?L('มีโครงตาราง รอค่าข้อมูล','Frame ready, awaiting values'):L('ยังไม่มีไฟล์','No file yet')}</span></div>
    <div class="st"><small>${L('รายการตามแบบสำรวจ','Survey items')}</small><b><span class="cu">${p.inds.length}</span><em>${L('รายการ','items')}</em></b><span class="d">${L('มีไฟล์แล้ว ','With a file: ')+L0.length}</span></div>
    <div class="st"><small>${L('แถวข้อมูลที่กรอกแล้ว','Rows filled')}</small><b><span class="cu">${nf.format(sum(L0.map(dsRowsHave)))}</span><em>/ ${nf.format(sum(L0.map(dsRowsExp)))}</em></b><span class="d">${L('ตามโครงตาราง','per table frame')}</span></div>
    <div class="st"><small>${L('หน่วยงานเจ้าของข้อมูล','Data owners')}</small><b><span class="cu">${ags.length}</span><em>${L('หน่วยงาน','agencies')}</em></b><span class="d">${esc(L0[0]?.source||ags[0]||'')}</span></div>`;
  const cta=$('.hx .cta',page);cta?.querySelector('[data-jump="vs"]')?.setAttribute('data-jump','dsx');cta?.querySelector('[href="#vs"]')?.setAttribute('href','#dsx');
  $$('[data-jump]',page).forEach(a=>a.onclick=e=>{e.preventDefault();document.getElementById(a.dataset.jump)?.scrollIntoView({behavior:'smooth',block:'start'})});
  $$('.t-long',page).forEach(e=>e.textContent=L('ข้อมูลจากหน่วยงาน','Agency data'));$$('.t-short',page).forEach(e=>e.textContent=L('ข้อมูล','Data'));
};

/* ---------- วิเคราะห์: ยังไม่มีข้อมูลรองรับ ---------- */
PAGE_R.insights=page=>{page.innerHTML=`<div class="ph-title"><div><span class="eyebrow">Insights</span><h1>${PT('insights')}</h1><p>${L('หน้านี้จะเปิดเมื่อหน่วยงานส่งไฟล์มูลค่า ราคา และผลผลิตครบทุกสินค้า เพราะการเปรียบเทียบต้องใช้ข้อมูลจริงชุดเดียวกัน','This page opens once agencies submit value, price and output files for all products.')}</p></div></div>
  <section class="card"><div class="sk-note" style="margin:0">${ic('db')}<span><b>${L('ยังไม่มีข้อมูลรองรับ','No supporting data yet')}</b> ${L('ดูความพร้อมข้อมูลได้ที่','See readiness on')} <a href="overview.html">${PT('overview')}</a> · <a href="report.html">${PT('report')}</a></span></div></section>`};

/* ---------- แผนที่: เฉพาะชุดข้อมูลที่มีมิติอำเภอ ---------- */
PAGE_R.map=page=>{const L0=DATASETS.filter(d=>d.district);let code=(R.q&&R.q.get('d'))||store.sget('nbl12-mapds',(L0.find(dsFilled)||L0[0])?.code);if(!L0.some(d=>d.code===code))code=(L0.find(dsFilled)||L0[0])?.code;store.sset('nbl12-mapds',code);
  const ds=L0.find(d=>d.code===code);
  page.innerHTML=`<div class="ph-title"><div><span class="eyebrow">District data</span><h1>${PT('map')}</h1><p>${L('แผนที่ 6 อำเภอ จากชุดข้อมูลที่มีคอลัมน์ "อำเภอ" เลือกชุดข้อมูลด้านล่าง','Six-district map from datasets with a district column.')}</p></div></div>
  <div class="mchips">${L0.map(d=>{const p=byId(d.pid);return`<button type="button" class="chip${d.code===code?' on':''}" data-md="${d.code}" style="--pa:${p.pa}">${badge(p,{label:false})}${esc(d.item)}</button>`}).join('')||`<span class="note">${L('ยังไม่มีชุดข้อมูลรายอำเภอ','No district datasets yet')}</span>`}</div>
  <section class="card dsx-sec">${ds?dsCard(ds,byId(ds.pid)):''}</section>`;
  if(ds){page.style.setProperty('--pa',byId(ds.pid).pa);dsBind(byId(ds.pid),page)}
  $$('[data-md]',page).forEach(b=>b.onclick=()=>{store.sset('nbl12-mapds',b.dataset.md);render(true)});
};

/* ---------- รายงาน: ความพร้อมข้อมูล ---------- */
PAGE_R.report=page=>{const f=F();
  page.innerHTML=`<div class="ph-title"><div><span class="eyebrow">Data readiness</span><h1>${PT('report')}</h1><p>${L('สรุปว่าแต่ละสินค้ามีไฟล์ข้อมูลจากหน่วยงานแล้วกี่รายการ เทียบกับแบบสำรวจรายการข้อมูล','Files received per product versus the survey.')}</p></div><div class="row"><button class="btn btn-f" type="button" data-act="print">${ic('print')} ${L('พิมพ์ / PDF','Print / PDF')}</button></div></div>
  <div class="kpis">${kpi(L('ชุดข้อมูล','Datasets'),f.n,L('ชุด','sets'),'','',pill('has'))}${kpi(L('มีค่าแล้ว','With values'),f.f,'/ '+f.n,'','',f.f?pill('real'):pill('wait'))}${kpi(L('สินค้าที่มีไฟล์','Products with files'),f.prods,'/ 14','','','')}${kpi(L('รายการที่ยังไม่มีไฟล์','Items without a file'),f.items-f.n,L('รายการ','items'),'','',pill('wait'))}</div>
  <section class="card"><div class="scroll-x"><table class="t"><thead><tr><th>${L('สินค้า','Product')}</th><th class="r">${L('รายการตามแบบสำรวจ','Survey items')}</th><th class="r">${L('มีไฟล์','With file')}</th><th class="r">${L('มีค่าแล้ว','With values')}</th><th>${L('ชุดข้อมูล','Datasets')}</th><th>${L('สถานะ','Status')}</th></tr></thead><tbody>
  ${P.map(p=>{const L0=dsOf(p.id),s=pStat(p);return`<tr><td><a class="sw-p" href="${pFile(p.id)}#dsx">${badge(p,{label:false})}<span>${pad2(p.id)} ${esc(pname(p))}</span></a></td><td class="r num">${p.inds.length}</td><td class="r num">${L0.length}</td><td class="r num">${s.f}</td><td>${L0.map(d=>`<code>${d.code}</code> ${esc(d.item)}`).join('<br>')||'–'}</td><td>${s.f?pill('real'):L0.length?`<span class="pill wait">${L('มีโครงตาราง','Frame ready')}</span>`:`<span class="pill none">${L('ยังไม่มีไฟล์','No file yet')}</span>`}</td></tr>`}).join('')}
  </tbody></table></div></section>`};

/* ---------- สื่อนำเสนอ: สรุป A4 / แนะนำสินค้า / หนังสือ ---------- */
const _brief=PAGE_R.brief;
PAGE_R.brief=page=>{_brief(page);const v=$('#bv',page);if(!v)return;
  if(v.classList.contains('bv-brief')){const pid=+(R.q&&R.q.get('p'))||store.sget('nbl12-brief',1),p=byId(pid)||P[0],L0=dsOf(p.id),s=pStat(p);
    const k=$('.a4-k',v);if(k)k.innerHTML=`<div><span>${L('ชุดข้อมูลจากหน่วยงาน','Agency datasets')}</span><b>${s.n}</b><small>${L('มีค่าแล้ว ','with values ')+s.f}</small></div><div><span>${L('รายการตามแบบสำรวจ','Survey items')}</span><b>${p.inds.length}</b><small>${L('รายการ','items')}</small></div><div><span>${L('สถานะ','Status')}</span><b style="font-size:16px">${p.gi?'GI':'–'}</b><small>${L('สิ่งบ่งชี้ทางภูมิศาสตร์','Geographical indication')}</small></div><div><span>${L('หน่วยงาน','Agency')}</span><b style="font-size:13px;line-height:1.3">${esc(p.agency)}</b><small></small></div>`;
    const g=$('.a4-g',v);if(g)g.innerHTML=`<div><h4>${L('เรื่องราว','Story')}</h4><p style="margin:0;font-size:12.5px;line-height:1.6">${esc(pen(p,'s',p.story))}</p></div>
      <div><h4>${L('จุดขาย','Selling points')}</h4><ul class="a4-l">${pen(p,'hl',p.hl).map(h=>`<li>${esc(h)}</li>`).join('')}</ul>
      <h4>${L('ข้อมูลจากหน่วยงาน','Agency data')}</h4><ul class="a4-l">${L0.map(d=>`<li>${esc(d.item)} · ${dsFilled(d)?L('มีค่าแล้ว','filled'):L('รอค่าข้อมูล','awaiting values')}</li>`).join('')||`<li>${L('รอไฟล์จากหน่วยงาน','Awaiting agency file')}</li>`}</ul></div>`;
    const ft=$('.a4-f div',v);if(ft)ft.innerHTML=`<b>${L('แหล่งที่มา','Source')}:</b> ${esc(L0[0]?.source||p.agency)} · ${L('ระบบบัญชีข้อมูลจังหวัดหนองบัวลำภู','NBL provincial data catalog')}<br>© 2569 ${L('สำนักงานสถิติจังหวัดหนองบัวลำภู','Nong Bua Lam Phu Provincial Statistical Office')}`;
  }
  if(v.classList.contains('bv-promo')){$$('.pr-price',v).forEach(e=>e.remove());$$('.pr-flow,.pr-two',v).forEach(e=>e.closest('.pr-sec')?.remove());$$('#buyer',v).forEach(e=>e.remove());
    let n=1;$$('.pr-n',v).forEach(e=>e.textContent=pad2(n++))}
};
const _faces=bkFaces;
bkFaces=function(){return _faces().map(h=>{if(!/pb-va|pb-ss|in-st|in-map/.test(h))return h;const t=document.createElement('template');t.innerHTML=h;
  t.content.querySelectorAll('.pb-va,.pb-ss,.in-map').forEach(e=>e.remove());
  const st=t.content.querySelector('.in-st');if(st)st.innerHTML=`<div><b>14</b><span>${L('สินค้าอัตลักษณ์','products')}</span></div><div><b>${P.filter(x=>x.gi).length}</b><span>${L('สินค้า GI','GI products')}</span></div><div><b>6</b><span>${L('อำเภอ','districts')}</span></div><div><b>${DATASETS.length}</b><span>${L('ชุดข้อมูล','datasets')}</span></div>`;
  return t.innerHTML})};

/* ---------- มุมผู้ซื้อ: เหลือเฉพาะที่ยืนยันแล้ว ---------- */
const _buyer=PAGE_R.buyer;
PAGE_R.buyer=page=>{store.sset('nbl12-bf',['all','gi'].includes(store.sget('nbl12-bf','all'))?store.sget('nbl12-bf','all'):'all');_buyer(page);
  $$('[data-bf]',page).forEach(b=>{if(!['all','gi'].includes(b.dataset.bf))b.remove()});
  const st=$('.by-st',page);if(st)st.innerHTML=`<div><b>14</b><span>${L('สินค้า','products')}</span></div><div><b>${P.filter(x=>x.gi).length}</b><span>${L('สินค้า GI (ยืนยันแล้ว)','verified GI')}</span></div>`;
  const w=$('.by-warn',page);if(w)w.innerHTML=`${ic('help')} ${L('สเปกสินค้า กำลังผลิต และมาตรฐานอื่นนอกจาก GI รอข้อมูลจากหน่วยงาน จึงแสดงเป็นโครงไว้ก่อน','Specs, capacity and non-GI standards await agency data and are shown as frames.')}`;
  $('#byCsv')?.remove();
};
}
