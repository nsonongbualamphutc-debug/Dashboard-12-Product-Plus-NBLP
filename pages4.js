/* =====================================================================
   12 Plus+ · pages4.js — มุมผู้ซื้อ (Buyer Corner) · มาตรฐานและการรับรอง · ป้าย QR ติดสินค้า
   ข้อมูลอยู่ใน data.js (B2B, CERT, CERT_OK, BUYER_DESK) — เป็นค่าตัวอย่าง รอหน่วยงานยืนยัน
   ===================================================================== */
const XP={ready:['พร้อมส่งออก','Export-ready','#1E8A52'],dev:['กำลังพัฒนาสู่ส่งออก','Export in development','#B1832A'],local:['ตลาดในประเทศ','Domestic market','#5B6B62']};
const b2b=p=>B2B[p.id]||{cap:['–','–'],moq:['–','–'],shelf:['–','–'],pack:['–','–'],lead:['–','–'],exp:'local',hs:'–',certs:[]};
const LL=a=>Array.isArray(a)?L(a[0],a[1]):a;
const certsOf=p=>(b2b(p).certs||[]).map(s=>{const m=s.match(/^([A-Z]+)(\d)?$/);const k=m?m[1]:s;return{k,st:m&&m[2]?+m[2]:0,ok:(CERT_OK[p.id]||[]).includes(k),d:CERT[k]}}).filter(c=>c.d);
function medal(c){
  const a=c.d.a,fs=a.length>5?10.5:a.length>3?13:16,ttl=`${L(c.d.th,c.d.en)}${c.st?' · '+c.st+L(' ดาว',' stars'):''} · ${c.ok?L('ยืนยันแล้ว','verified'):L('ค่าตัวอย่าง รอหน่วยงานยืนยัน','sample, awaiting agency confirmation')}`;
  return`<span class="md ${c.ok?'ok':'smp'}" style="--mc:${c.d.c}" title="${esc(ttl)}" aria-label="${esc(ttl)}"><svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="30" class="o"/><circle cx="32" cy="32" r="24" class="i"/><text x="32" y="${c.st?31:37.5}" text-anchor="middle" class="a" style="font-size:${fs}px">${esc(a)}</text>${c.st?`<text x="32" y="45" text-anchor="middle" class="s">${'★'.repeat(c.st)}</text>`:''}</svg>${c.ok?'<i class="ck" aria-hidden="true">✓</i>':''}</span>`;
}
function certRow(p,mode){
  const cs=certsOf(p);if(!cs.length)return'';
  if(mode==='mini')return`<div class="cmini">${cs.map(c=>`<span class="${c.ok?'ok':''}" style="--mc:${c.d.c}">${esc(c.d.a)}${c.st?' '+'★'.repeat(c.st):''}</span>`).join('')}</div>`;
  return`<div class="certs c-${mode||"n"}">${cs.map(medal).join('')}</div>`;
}
const xpPill=p=>{const x=XP[b2b(p).exp]||XP.local;return`<span class="xp" style="--xc:${x[2]}"><i></i>${L(x[0],x[1])}</span>`};
function specDl(p){const b=b2b(p);return`<dl class="spec">
  <div><dt>${L('กำลังผลิต','Capacity')}</dt><dd>${esc(LL(b.cap))}</dd></div>
  <div><dt>${L('สั่งขั้นต่ำ','MOQ')}</dt><dd>${esc(LL(b.moq))}</dd></div>
  <div><dt>${L('อายุสินค้า','Shelf life')}</dt><dd>${esc(LL(b.shelf))}</dd></div>
  <div><dt>${L('บรรจุภัณฑ์','Packaging')}</dt><dd>${esc(LL(b.pack))}</dd></div>
  <div><dt>${L('ระยะเวลาส่งมอบ','Lead time')}</dt><dd>${esc(LL(b.lead))}</dd></div>
  <div><dt>${L('พิกัดศุลกากร (HS)','HS code')}</dt><dd class="num">${esc(b.hs)}</dd></div></dl>`}
function buyerBlock(p,cls=''){
  return`<section class="card byr ${cls}" id="buyer">
    <div class="card-h"><h3>${L('สำหรับผู้ซื้อรายใหญ่','For trade buyers')} · <em>Buyer corner</em></h3><span class="note">${L('ค่าตัวอย่าง รอหน่วยงานยืนยัน','Sample values, awaiting agency confirmation')}</span></div>
    <div class="byr-g">
      <div class="byr-l">${xpPill(p)}${specDl(p)}</div>
      <div class="byr-r"><h4>${L('มาตรฐานและการรับรอง','Standards & certifications')}</h4>${certRow(p)}
        <p class="cleg"><span class="md-k ok">✓</span>${L('ยืนยันแล้ว','Verified')}<span class="md-k smp"></span>${L('ค่าตัวอย่าง รอยืนยัน','Sample, to be confirmed')}</p>
        <div class="byr-cta"><button class="btn btn-p" type="button" data-rfq="${p.id}">${ic('report')} ${L('ขอใบเสนอราคา','Request a quote')}</button><a class="btn btn-o" href="buyer.html">${ic('globe')} ${L('มุมผู้ซื้อทั้ง 14 สินค้า','All 14 products for buyers')}</a></div></div>
    </div></section>`}

/* ---------- ขอใบเสนอราคา (RFQ) ---------- */
function rfq(pid){
  const p=byId(pid)||P[0];const D=BUYER_DESK,has=D.tel||D.email||D.line;
  overlay(`<div class="dlg-h"><h3>${ic('report')} ${L('ขอใบเสนอราคา','Request for quotation')}</h3><button class="tb ic-only" type="button" data-close aria-label="${L('ปิด','Close')}">${ic('x')}</button></div>
  <div class="dlg-b rfq-b">
    <p class="note" style="margin:0 0 12px">${L('กรอกข้อมูลแล้วเลือกส่งทาง LINE หรืออีเมล ระบบจะเรียบเรียงข้อความให้ ผู้ประสานจะติดต่อกลับ','Fill in the form and send by LINE or email — we compose the message for you and the buyer desk will reply.')}</p>
    <div class="rf">
      <label class="w2">${L('สินค้า','Product')}<select class="sel" id="rfP">${P.map(x=>`<option value="${x.id}"${x.id===p.id?' selected':''}>${pad2(x.id)} ${esc(pname(x))} · ${esc(x.en)}</option>`).join('')}</select></label>
      <label>${L('ชื่อ / บริษัท','Name / company')}<input id="rfN" autocomplete="organization" placeholder="${L('เช่น บริษัท ตัวอย่าง จำกัด','e.g. Example Trading Co.')}"></label>
      <label>${L('ประเทศ / จังหวัด','Country / province')}<input id="rfC" autocomplete="country-name" placeholder="${L('เช่น ไทย, ญี่ปุ่น','e.g. Japan')}"></label>
      <label>${L('จำนวนที่ต้องการ','Quantity')} *<input id="rfQ" placeholder="${esc(LL(b2b(p).moq))}"></label>
      <label>${L('ช่องทางติดต่อกลับ','Contact')} *<input id="rfT" autocomplete="email" placeholder="${L('อีเมล / โทร / LINE','Email / phone / LINE')}"></label>
      <label class="w2">${L('รายละเอียดเพิ่มเติม','Details')}<textarea id="rfM" rows="3" placeholder="${L('บรรจุภัณฑ์ที่ต้องการ กำหนดส่ง เงื่อนไขอื่น','Packaging, delivery date, other terms')}"></textarea></label>
    </div>
    <div class="rf-desk">${ic('globe')}<span><b>${L('ผู้ประสานผู้ซื้อ','Buyer desk')}:</b> ${esc(L(D.org,D.orgEn))}${D.name?' · '+esc(D.name):''}${D.tel?' · '+esc(D.tel):''}${D.email?' · '+esc(D.email):''}${D.line?' · LINE '+esc(D.line):''}${has?'':` <em>${L('(รอระบุช่องทางติดต่อ)','(contact details pending)')}</em>`}</span></div>
    <div class="rf-act"><button class="btn rf-line" type="button" id="rfLine">LINE</button><button class="btn btn-p" type="button" id="rfMail">${ic('ext')} ${L('ส่งอีเมล','Email')}</button><button class="btn btn-o" type="button" id="rfCopy">${ic('copy')} ${L('คัดลอกข้อความ','Copy text')}</button></div>
  </div>`,'dlg rfq');
  $('[data-close]')?.addEventListener('click',closeOverlay);
  const msg=()=>{const x=byId(+$('#rfP').value),q=$('#rfQ').value.trim(),t=$('#rfT').value.trim();
    if(!q||!t){toast(L('กรุณากรอกจำนวนและช่องทางติดต่อกลับ','Please enter quantity and contact'));(!q?$('#rfQ'):$('#rfT')).focus();return null}
    return[`[12 Plus+ · ${L('ขอใบเสนอราคา','Request for quotation')}]`,`${L('สินค้า','Product')}: ${pad2(x.id)} ${pname(x)} (${x.en})`,`${L('จำนวน','Quantity')}: ${q}`,
      `${L('ผู้ติดต่อ','From')}: ${$('#rfN').value.trim()||'-'} · ${$('#rfC').value.trim()||'-'}`,`${L('ติดต่อกลับ','Reply to')}: ${t}`,$('#rfM').value.trim()?`${L('รายละเอียด','Details')}: ${$('#rfM').value.trim()}`:'',
      `${L('ลิงก์สินค้า','Product link')}: ${absUrl(pFile(x.id))}`].filter(Boolean).join('\n')};
  $('#rfLine').onclick=()=>{const m=msg();if(!m)return;const id=(D.line||'').trim();window.open(id?`https://line.me/R/oaMessage/${encodeURIComponent(id)}/?${encodeURIComponent(m)}`:`https://line.me/R/share?text=${encodeURIComponent(m)}`,'_blank','noopener')};
  $('#rfMail').onclick=()=>{const m=msg();if(!m)return;location.href=`mailto:${D.email||''}?subject=${encodeURIComponent('[12 Plus+] RFQ · '+byId(+$('#rfP').value).en)}&body=${encodeURIComponent(m)}`};
  $('#rfCopy').onclick=()=>{const m=msg();if(m)copyText(m,L('คัดลอกข้อความแล้ว','Copied'))};
}
document.addEventListener('click',e=>{const b=e.target.closest('[data-rfq]');if(b){e.preventDefault();rfq(+b.dataset.rfq)}});

/* ---------- เสริมหน้าสินค้า / หน้าแนะนำสินค้า ---------- */
const _prodR=PAGE_R.product;
PAGE_R.product=(page,p)=>{_prodR(page,p);
  const hl=$('.hx-txt .hl',page);if(hl)hl.insertAdjacentHTML('afterend',certRow(p,'hero'));
  const sh=$('#shops',page);if(sh)sh.insertAdjacentHTML('beforebegin',buyerBlock(p));
};
const _promoV=promoView;
promoView=(box,p)=>{_promoV(box,p);
  const t=$('.pr-tag',box);if(t)t.insertAdjacentHTML('afterend',certRow(p,'hero'));
  const s=$('#pr-shops',box);if(s)s.insertAdjacentHTML('beforebegin',buyerBlock(p,'pr-byr'));
};

/* ================= หน้า มุมผู้ซื้อ ================= */
PAGE_R.buyer=page=>{
  const f=store.sget('nbl12-bf','all');
  const fit=p=>f==='all'||(f==='gi'?p.gi:b2b(p).exp===f);
  const L0=P.filter(fit),nReady=P.filter(p=>b2b(p).exp==='ready').length,nCert=sum(P.map(p=>certsOf(p).length));
  const codes=Object.keys(CERT);
  page.innerHTML=`
  <section class="by-hero">
    <div class="by-bg" style="background-image:url(img/buyer-00.webp),url(img/kv-00.webp)"></div><div class="hx-grid" aria-hidden="true"></div><canvas class="fx-dust" aria-hidden="true"></canvas>
    <div class="by-tx">
      <span class="pr-k">Sourcing from Nong Bua Lam Phu · <b>Buyer corner</b></span>
      <h1>${L('มุมผู้ซื้อรายใหญ่','Buyer corner')}<span>${L('สั่งของดีหนองบัวลำภูจากแหล่งผลิตโดยตรง','Source signature products direct from origin')}</span></h1>
      <p>${L('สเปกสินค้า กำลังผลิต จำนวนสั่งขั้นต่ำ มาตรฐาน และพิกัดศุลกากรของทั้ง 14 สินค้าในที่เดียว สำหรับห้าง ร้านค้า โรงแรม ผู้ส่งออก และผู้นำเข้า','Specs, capacity, MOQ, certifications and HS codes for all 14 products — for retailers, hotels, exporters and importers.')}</p>
      <div class="by-st"><div><b>14</b><span>${L('สินค้า','products')}</span></div><div><b>${nReady}</b><span>${L('พร้อมส่งออก','export-ready')}</span></div><div><b>3</b><span>${L('สินค้า GI','GI products')}</span></div><div><b>${nCert}</b><span>${L('มาตรฐานรวม','certifications')}</span></div></div>
      <div class="cta"><button class="btn btn-p" type="button" data-rfq="1">${ic('report')} ${L('ขอใบเสนอราคา','Request a quote')}</button><button class="btn btn-glass" type="button" id="byCsv">${ic('down')} ${L('แคตตาล็อก CSV','Catalog CSV')}</button><button class="btn btn-glass" type="button" data-act="print">${ic('print')} ${L('พิมพ์แคตตาล็อก','Print catalog')}</button></div>
    </div>
  </section>
  <p class="by-warn no-print">${ic('help')} ${L('ตัวเลขในหน้านี้เป็นค่าตัวอย่าง รอยืนยันจากหน่วยงาน ยกเว้นสินค้า GI ที่ยืนยันแล้ว','Figures on this page are samples awaiting agency confirmation, except verified GI status.')}</p>
  <div class="by-f no-print" role="group" aria-label="${L('กรองสินค้า','Filter')}">${[['all',L('ทั้งหมด','All'),14],['ready',L('พร้อมส่งออก','Export-ready'),nReady],['dev',L('กำลังพัฒนา','In development'),P.filter(p=>b2b(p).exp==='dev').length],['local',L('ตลาดในประเทศ','Domestic'),P.filter(p=>b2b(p).exp==='local').length],['gi','GI',3]].map(([k,t,n])=>`<button type="button" data-bf="${k}" aria-pressed="${f===k}">${t}<small>${n}</small></button>`).join('')}</div>
  <div class="by-grid">${L0.map(p=>`<article class="byc" style="--pa:${p.pa}">
    <a class="byc-ph" href="${pFile(p.id)}"><img src="${IMG('pack',p.id)}" alt="${esc(pname(p))}" loading="lazy">${badge(p,{label:false})}<span class="no">${pad2(p.id)}</span>${p.gi?'<span class="gi lg">GI</span>':''}</a>
    <div class="byc-b"><div class="byc-t"><h3>${esc(pname(p))}</h3><span class="en">${esc(p.en)}</span></div>${xpPill(p)}
      ${specDl(p)}${certRow(p,'sm')}
      <div class="byc-a"><button class="btn btn-p sm" type="button" data-rfq="${p.id}">${L('ขอใบเสนอราคา','Request quote')}</button><a class="btn btn-o sm" href="${pFile(p.id)}">${L('ดูสินค้า','Details')}</a><a class="btn btn-o sm" href="brief.html?v=book&p=${p.id}">${ic('report')}</a></div></div></article>`).join('')||`<p class="note">${L('ไม่พบสินค้า','No products')}</p>`}</div>

  <section class="card"><div class="card-h"><h3>${L('ผนังมาตรฐานและการรับรอง','Standards wall')}</h3><span class="note"><span class="md-k ok">✓</span> ${L('ยืนยันแล้ว','verified')} · <span class="md-k smp"></span> ${L('ค่าตัวอย่าง','sample')}</span></div>
    <div class="scroll-x"><table class="t swall"><thead><tr><th>${L('สินค้า','Product')}</th>${codes.map(k=>`<th class="c" title="${esc(L(CERT[k].th,CERT[k].en))}"><span class="sw-h" style="--mc:${CERT[k].c}">${esc(CERT[k].a)}</span></th>`).join('')}</tr></thead>
    <tbody>${P.map(p=>{const cs=certsOf(p);return`<tr><td><a href="${pFile(p.id)}" class="sw-p">${badge(p,{label:false})}<span>${pad2(p.id)} ${esc(pname(p))}</span></a></td>${codes.map(k=>{const c=cs.find(x=>x.k===k);return`<td class="c">${c?medal(c):'<span class="sw-x">·</span>'}</td>`}).join('')}</tr>`}).join('')}</tbody></table></div></section>

  <section class="by-how">
    <div class="card-h"><h3>${L('สั่งซื้ออย่างไร','How to order')}</h3></div>
    <ol>${[[L('เลือกสินค้า','Choose products'),L('ดูสเปก มาตรฐาน และจำนวนขั้นต่ำ','Check specs, standards and MOQ')],[L('ส่งคำขอใบเสนอราคา','Send an RFQ'),L('ผ่าน LINE หรืออีเมล ในคลิกเดียว','By LINE or email in one click')],[L('ผู้ประสานติดต่อกลับ','Buyer desk replies'),L('จับคู่กับกลุ่มผู้ผลิตที่เหมาะสม','Matched with the right producer group')],[L('ทดลองสินค้าและส่งมอบ','Sample & delivery'),L('ส่งตัวอย่าง ตกลงเงื่อนไข และจัดส่ง','Samples, terms and shipping')]].map((s,i)=>`<li><b>${pad2(i+1)}</b><span><strong>${s[0]}</strong>${s[1]}</span></li>`).join('')}</ol>
  </section>`;
  $$('[data-bf]',page).forEach(b=>b.onclick=()=>{store.sset('nbl12-bf',b.dataset.bf);render(true)});
  $('#byCsv').onclick=()=>{const h=['id','product_th','product_en','export_status','capacity','moq','shelf_life','packaging','lead_time','hs_code','certifications','gi','page'];
    download('12plus-buyer-catalog.csv',[csvRow(h),...P.map(p=>{const b=b2b(p);return csvRow([p.id,p.name,p.en,b.exp,b.cap[1],b.moq[1],b.shelf[1],b.pack[1],b.lead[1],b.hs,certsOf(p).map(c=>c.k+(c.st?c.st+'*':'')+(c.ok?'(verified)':'(sample)')).join(' '),p.gi?'GI':'',absUrl(pFile(p.id))])})].join('\n'))};
};

/* ================= ป้าย QR ติดสินค้า (มุมมองที่ 4 ของสื่อนำเสนอสินค้า) ================= */
const TAGSZ={sticker:{t:'สติกเกอร์ 5×5 ซม.',e:'Sticker 5×5 cm',n:15},card:{t:'การ์ด 9×5.5 ซม.',e:'Card 9×5.5 cm',n:10},shelf:{t:'ป้ายตั้งโต๊ะ A6',e:'Shelf talker A6',n:4}};
function tagHtml(p,sz){
  const u=absUrl(pFile(p.id))+'?src=qr',nm=esc(pname(p)),en=esc(p.en);
  if(sz==='card')return`<div class="tg tcard" style="--pa:${p.pa}"><div class="l">${badge(p,{label:false})}<b>${nm}</b><i>${en}</i>${p.gi?'<span class="g">GI</span>':''}<small>No.${pad2(p.id)} · 12 Plus+ · Nong Bua Lam Phu</small></div><div class="r"><div class="qr" data-tq="${esc(u)}"></div><span>สแกนดูที่มาและร้านค้า<br><em>Scan for origin & shops</em></span></div></div>`;
  if(sz==='shelf')return`<div class="tg shelf" style="--pa:${p.pa}"><div class="ph" style="background-image:url(${IMG('post',p.id)})">${badge(p,{label:false})}<span class="no">${pad2(p.id)}</span></div><div class="bd"><b>${nm}</b><i>${en}</i><p>${esc(p.tagline)}</p>${certRow(p,'mini')}<div class="qq"><div class="qr" data-tq="${esc(u)}"></div><span>สแกนดูเรื่องราว ที่มา<br>และร้านที่ซื้อได้<br><em>Scan for story & shops</em></span></div></div><div class="ft">12 Plus<sup>+</sup> · สินค้าอัตลักษณ์หนองบัวลำภู</div></div>`;
  return`<div class="tg sticker" style="--pa:${p.pa}"><div class="hd">${badge(p,{label:false})}<span><b>${nm}</b><i>${en}</i></span>${p.gi?'<span class="g">GI</span>':''}</div><div class="qr" data-tq="${esc(u)}"></div><span class="cap">สแกนดูที่มา · Scan for origin</span><div class="ft">12 Plus<sup>+</sup> · Nong Bua Lam Phu</div></div>`;
}
function tagView(box,pid){
  const sz=store.sget('nbl12-tsz','sticker'),sel=store.sget('nbl12-tp','all');const Z=TAGSZ[sz];
  const list=sel==='all'?P.slice():Array(Z.n).fill(byId(+sel)||P[0]);
  const pages=[];for(let i=0;i<list.length;i+=Z.n)pages.push(list.slice(i,i+Z.n));
  box.innerHTML=`<div class="tag-ctl no-print">
      <select class="sel" id="tgP" aria-label="${L('เลือกสินค้า','Product')}"><option value="all"${sel==='all'?' selected':''}>${L('ทั้ง 14 สินค้า (อย่างละ 1)','All 14 products (one each)')}</option>${P.map(x=>`<option value="${x.id}"${String(x.id)===String(sel)?' selected':''}>${pad2(x.id)} ${esc(pname(x))} · ${L('เต็มแผ่น','full sheet')}</option>`).join('')}</select>
      <div class="seg" role="group" aria-label="${L('ขนาด','Size')}">${Object.entries(TAGSZ).map(([k,z])=>`<button type="button" data-tz="${k}" aria-pressed="${k===sz}">${L(z.t,z.e)}</button>`).join('')}</div>
      <button class="btn btn-p" type="button" data-act="print">${ic('print')} ${L('พิมพ์ A4','Print A4')}</button>
      <span class="note">${L('QR พาไปหน้าสินค้า เรื่องราว และร้านที่ซื้อได้ · พิมพ์ขนาดจริง 100% บนสติกเกอร์ A4','QR opens the product page · print at 100% on A4 sticker paper')}</span></div>
    <div class="tsw">${pages.map(pg=>`<div class="tsheet ${sz}">${pg.map(p=>tagHtml(p,sz)).join('')}</div>`).join('')}</div>`;
  $('#tgP').onchange=e=>{store.sset('nbl12-tp',e.target.value);tagView(box)};
  $$('[data-tz]',box).forEach(b=>b.onclick=()=>{store.sset('nbl12-tsz',b.dataset.tz);tagView(box)});
  if(window.QRCode)$$('[data-tq]',box).forEach(el=>new QRCode(el,{text:el.dataset.tq,width:200,height:200,correctLevel:QRCode.CorrectLevel.M}));
  const fit=()=>{const w=$('.tsw',box);if(!w)return;const k=Math.min(1,(w.clientWidth-4)/793.7);$$('.tsheet',box).forEach(s=>s.style.zoom=k)};fit();
  if(!tagView.b){tagView.b=1;addEventListener('resize',()=>{const b=$('.bv-tag');if(b){const w=$('.tsw',b);if(w){const k=Math.min(1,(w.clientWidth-4)/793.7);$$('.tsheet',b).forEach(s=>s.style.zoom=k)}}})}
}
