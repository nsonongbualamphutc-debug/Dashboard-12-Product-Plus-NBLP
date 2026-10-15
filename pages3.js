/* =====================================================================
   12 Plus+ · pages3.js — สื่อนำเสนอสินค้า (brief.html)
   slicer 3 มุมมอง:  สรุปสินค้า (A4) · แนะนำสินค้า (อินโฟขายของ) · หนังสือสินค้า (Lookbook พลิกหน้า)
   ===================================================================== */
const BV=[['brief','สรุปสินค้า','Summary','print'],['promo','แนะนำสินค้า','Showcase','star'],['book','หนังสือสินค้า','Lookbook','report'],['tag','ป้าย QR','QR tags','grid']];
const absUrl=q=>location.href.replace(/[?#].*$/,'').replace(/[^/]*$/,'')+q;
const vaP=p=>{const v=VA[p.id];return v?{s:v.slice(0,3).map(x=>({t:L(x[0],x[1]),v:x[2]})),u:L(v[3],v[4])}:null};
const fP=v=>v>=1000?nf.format(Math.round(v)):v>=10?nf.format(Math.round(v)):v.toFixed(2).replace(/\.?0+$/,'');
const shopsOf=p=>SHOPS[p.id]||[];

const _briefA4=PAGE_R.brief;
PAGE_R.brief=page=>{
  const q=R.q||new URLSearchParams();
  let v=q.get('v')||store.sget('nbl12-bv','brief');if(!BV.some(b=>b[0]===v))v='brief';store.sset('nbl12-bv',v);
  let pid=+q.get('p')||store.sget('nbl12-brief',1);if(!byId(pid))pid=1;
  const p=byId(pid);store.sset('nbl12-brief',pid);page.style.setProperty('--pa',p.pa);document.body.style.setProperty('--pa',p.pa);
  const sub={brief:L('สรุปสินค้าแผ่นเดียว ขนาด A4 พิมพ์หรือบันทึกเป็น PDF ส่งต่อได้ทันที','A single A4 summary to print or share'),
    promo:L('อินโฟกราฟิกแนะนำสินค้าสำหรับผู้ซื้อ พร้อมร้านค้า แชร์ LINE / Facebook และสร้างภาพโพสต์ได้ในคลิกเดียว','A buyer-facing showcase with shops, sharing and a one-click social post'),
    book:L('เปิดอ่านสินค้าทั้ง 14 อย่างแบบหนังสือ พลิกทีละหน้า ทุกสินค้าโยงไปยังร้านที่ซื้อได้','Flip through all 14 products like a book — every page links to where to buy'),
    tag:L('ป้าย QR ติดสินค้า หน้าร้าน หรือบูธ ลูกค้าสแกนแล้วเห็นเรื่องราว ที่มา และร้านที่ซื้อได้ พิมพ์บนกระดาษสติกเกอร์ A4','QR tags for products, shelves and booths — scan to see the story, origin and shops')}[v];
  page.innerHTML=`
  <div class="sx-head no-print">
    <div class="sx-t"><span class="eyebrow">Product showcase · 12 Plus+</span><h1>${L('สื่อนำเสนอสินค้า','Product showcase')}</h1><p>${sub}</p></div>
    <div class="sx-ctl">
      <div class="slicer" role="tablist" aria-label="${L('เลือกรูปแบบ','Choose view')}">${BV.map(([k,t,e,i])=>`<button type="button" role="tab" data-bv="${k}" aria-selected="${k===v}">${ic(i)}<span>${L(t,e)}</span></button>`).join('')}<i class="sl-ind" style="--i:${BV.findIndex(b=>b[0]===v)}"></i></div>
      ${v!=='book'&&v!=='tag'?`<select class="sel" id="bSel" aria-label="${L('เลือกสินค้า','Choose product')}">${P.map(x=>`<option value="${x.id}"${x.id===pid?' selected':''}>${pad2(x.id)} ${esc(pname(x))}${x.gi?' · GI':''}</option>`).join('')}</select>`:''}
    </div>
  </div>
  <div id="bv" class="bv-${v}"></div>`;
  $$('[data-bv]',page).forEach(b=>b.onclick=()=>go({page:'brief',q:new URLSearchParams('v='+b.dataset.bv+(b.dataset.bv==='book'||b.dataset.bv==='tag'?'':'&p='+pid))}));
  const sel=$('#bSel');if(sel)sel.onchange=e=>go({page:'brief',q:new URLSearchParams('v='+v+'&p='+e.target.value)});
  const box=$('#bv');
  if(v==='brief'){_briefA4(box);const t=$('.ph-title',box);if(t){$$('.row',t).forEach(r=>{r.querySelector('#bSel')?.remove()});const r=$('.row',t);t.replaceWith(Object.assign(document.createElement('div'),{className:'sx-act no-print',innerHTML:r?r.innerHTML:''}))}}
  else if(v==='promo')promoView(box,p);
  else if(v==='tag')tagView(box);
  else bookView(box,+q.get('p')||0);
};

/* ================= แนะนำสินค้า (Showcase infographic) ================= */
function promoView(box,p){
  const va=vaP(p),shops=shopsOf(p),hl=pen(p,'hl',p.hl),pk=p.season.indexOf(Math.max(...p.season));
  const best=p.season.map((_,k)=>k).filter(k=>inSeason(p,k+1));
  const dv=DISTRICTS.map((_,i)=>distVal(p,i)),top=dv.map((v,i)=>({i,v})).sort((a,b)=>b.v-a.v).slice(0,3);
  const link=absUrl(`brief.html?v=promo&p=${p.id}`);
  const icons=['M12 2l2.9 6.2 6.8.8-5 4.7 1.3 6.7L12 17l-6 3.4 1.3-6.7-5-4.7 6.8-.8z','M4 12l5 5L20 6','M12 21s-7-4.5-7-11a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 6.5-7 11-7 11z'];
  box.innerHTML=`
  <article class="promo" id="promo">
    <section class="pr-hero">
      <div class="pr-hero-bg" style="background-image:url(${IMG('kv',p.id)})"></div><div class="hx-grid" aria-hidden="true"></div><canvas class="fx-dust" aria-hidden="true"></canvas>
      <figure class="pr-photo" data-tilt><img src="${IMG('post',p.id)}" alt="${esc(pname(p))}"><i class="hud tl"></i><i class="hud tr"></i><i class="hud bl"></i><i class="hud br"></i><i class="scan"></i>${badge(p,{spin:true})}</figure>
      <div class="pr-copy">
        <span class="pr-k">Nong Bua Lam Phu · Local Identity <b>No.${pad2(p.id)}</b></span>
        ${p.gi?`<span class="gi lg">${ic('star')} ${L('สินค้าสิ่งบ่งชี้ทางภูมิศาสตร์ (GI)','Geographical Indication (GI)')}</span>`:''}
        <h2>${esc(pname(p))}</h2><span class="pr-en">${esc(EN_MODE()?p.name:p.en)}</span>
        <p class="pr-tag">${esc(pen(p,'t',p.tagline))}</p>
        ${va?`<div class="pr-price"><small>${L('ราคาสินค้าพร้อมขาย','Retail price')}</small><b>${fP(va.s[2].v)}</b><span>${esc(va.u)}</span><em>${esc(va.s[2].t)}</em></div>`:''}
        <div class="cta"><a class="btn btn-p" href="#pr-shops" data-jump="pr-shops">${L('ซื้อได้ที่ไหน','Where to buy')} ${ic('arrowR')}</a><a class="btn btn-glass" href="brief.html?v=book&p=${p.id}">${ic('report')} ${L('เปิดในหนังสือ','Open in lookbook')}</a></div>
        <div class="pr-share"><span>${L('แชร์','Share')}</span>
          <a class="sh line" href="https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(link)}" target="_blank" rel="noopener" aria-label="LINE">LINE</a>
          <a class="sh fb" href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}" target="_blank" rel="noopener" aria-label="Facebook">f</a>
          <button class="sh" type="button" id="prCopy" aria-label="${L('คัดลอกลิงก์','Copy link')}">${ic('link')}</button>
          <button class="sh wide" type="button" id="prPost">${ic('down')} ${L('สร้างภาพโพสต์','Make social post')}</button></div>
      </div>
    </section>

    <section class="pr-sec">
      <div class="pr-h"><span class="pr-n">01</span><div><span class="eyebrow">Why you'll love it</span><h3>${L('เหตุผลที่ต้องลอง','Why try it')}</h3></div></div>
      <div class="pr-why">${hl.slice(0,3).map((h,k)=>`<div class="why"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="${icons[k%3]}"/></svg><b>${pad2(k+1)}</b><p>${esc(h)}</p></div>`).join('')}</div>
      <p class="pr-story">${esc(pen(p,'s',p.story))}</p>
    </section>

    ${va?`<section class="pr-sec">
      <div class="pr-h"><span class="pr-n">02</span><div><span class="eyebrow">From source to you</span><h3>${L('จากต้นทางสู่มือคุณ','From the source to you')}</h3></div></div>
      <div class="pr-flow">${[['a',0],['pack',1],['b',2]].map(([k,j],n)=>`${n?`<div class="pr-x"><b>×${KX(va.s[j].v/va.s[j-1].v)}</b><span>${L('มูลค่าเพิ่ม','value')}</span></div>`:''}<figure class="pr-step"><div class="ph" style="background-image:url(${IMG(k,p.id)})"></div><figcaption><small>${pad2(j+1)} · ${[L('วัตถุดิบ','Raw'),L('แปรรูป','Processed'),L('พร้อมขาย','Ready to sell')][j]}</small><b>${esc(va.s[j].t)}</b><span><em>${fP(va.s[j].v)}</em> ${esc(va.u)}</span></figcaption></figure>`).join('')}</div>
    </section>`:''}

    <section class="pr-sec pr-two">
      <div class="pr-card">
        <div class="pr-h sm"><span class="pr-n">03</span><div><span class="eyebrow">Best season</span><h3>${L('ช่วงเวลาที่ดีที่สุด','Best time to buy')}</h3></div></div>
        <div class="pr-cal">${p.season.map((w,k)=>{const mx=Math.max(...p.season);return`<div class="${best.includes(k)?'on':''}${k===pk?' pk':''}"><i style="height:${(18+82*w/mx).toFixed(0)}%"></i><span>${MO()[k].replace('.','').slice(0,3)}</span></div>`}).join('')}</div>
        <p class="pr-note">${L('ผลผลิตเด่นช่วง','Peak around')} <b>${MOF()[pk]}</b> · ${esc(pen(p,'peak',p.peakTxt))}</p>
      </div>
      <div class="pr-card">
        <div class="pr-h sm"><span class="pr-n">04</span><div><span class="eyebrow">Where it's made</span><h3>${L('แหล่งผลิตหลัก','Main districts')}</h3></div></div>
        <div class="pr-map">${mapSVG(dv,p)}<ol>${top.map((t,k)=>`<li><b>${k+1}</b>${esc(L(DISTRICTS[t.i],DISTRICTS_EN[t.i]))}</li>`).join('')}</ol></div>
      </div>
    </section>

    <section class="pr-sec" id="pr-shops">
      <div class="pr-h"><span class="pr-n">05</span><div><span class="eyebrow">Where to buy</span><h3>${L('ซื้อได้ที่','Where to buy')}</h3></div><span class="note" style="margin-left:auto">${shops.length?L('สแกน QR เพื่อนำทางไปร้าน','Scan to navigate'):L('ข้อมูลร้านค้าจะเพิ่มเร็ว ๆ นี้','Shops coming soon')}</span></div>
      <div class="shops">${shops.map((s,k)=>shopCard(p,s,k)).join('')}${shops.length<3?shopPlaceholder(p):''}</div>
    </section>

    <footer class="pr-foot"><img src="img/seal.png" alt=""><div><b>12 Plus<sup>+</sup> · ${L('สินค้าอัตลักษณ์หนองบัวลำภู','Nong Bua Lam Phu identity products')}</b><span>${L('แหล่งข้อมูล ','Source ')}${esc(p.agency)} · © 2569 ${L('สำนักงานสถิติจังหวัดหนองบัวลำภู','Nong Bua Lam Phu Provincial Statistical Office')}</span></div><div class="qr" id="prQr"></div></footer>
  </article>`;
  if(window.QRCode){new QRCode($('#prQr'),{text:link,width:96,height:96,correctLevel:QRCode.CorrectLevel.M});shops.forEach((s,k)=>{const el=document.getElementById('qr'+k);if(el)new QRCode(el,{text:mapUrl(s),width:120,height:120,correctLevel:QRCode.CorrectLevel.M})})}
  $$('[data-jump]',box).forEach(a=>a.onclick=e=>{e.preventDefault();document.getElementById(a.dataset.jump).scrollIntoView({behavior:'smooth',block:'start'})});
  $('#prCopy').onclick=()=>copyText(link,L('คัดลอกลิงก์แล้ว','Link copied'));
  $('#prPost').onclick=()=>socialPost(p,link);
}

/* ---------- ภาพโพสต์โซเชียล 1080×1350 วาดด้วย canvas ---------- */
async function socialPost(p,link){
  overlay(`<div class="sp-wrap"><div class="sp-h"><b>${L('ภาพโพสต์ 1080 × 1350','Social post 1080 × 1350')}</b><span class="note">${L('ขนาดพอดี Facebook / Instagram / LINE VOOM','Fits Facebook, Instagram and LINE VOOM')}</span><button class="tb ic-only" type="button" data-close aria-label="ปิด">${ic('x')}</button></div><div class="sp-c"><canvas id="spC" width="1080" height="1350"></canvas></div><div class="sp-f"><a class="btn btn-p" id="spD" download="12plus-${pad2(p.id)}.png">${ic('down')} ${L('ดาวน์โหลด PNG','Download PNG')}</a></div></div>`,'dlg sp');
  $('[data-close]')?.addEventListener('click',closeOverlay);
  const c=$('#spC'),x=c.getContext('2d'),W=1080,H=1350,va=vaP(p);
  try{await Promise.all(['600 120px Kanit','500 40px Kanit','italic 400 44px Fraunces','400 30px Sarabun'].map(f=>document.fonts.load(f)))}catch(e){}
  const img=s=>new Promise(r=>{const i=new Image();i.onload=()=>r(i);i.onerror=()=>r(null);i.src=s});
  const ph=await img(IMG('post',p.id)),bd=await img('data:image/svg+xml;charset=utf-8,'+encodeURIComponent(badge(p).replace('<svg ','<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" ')));
  x.fillStyle='#07100c';x.fillRect(0,0,W,H);
  if(ph){const s=Math.max(W/ph.width,H/ph.height),w=ph.width*s,h=ph.height*s;x.drawImage(ph,(W-w)/2,(H-h)/2,w,h)}
  let g=x.createLinearGradient(0,H*.35,0,H);g.addColorStop(0,'rgba(6,12,9,0)');g.addColorStop(.55,'rgba(6,12,9,.82)');g.addColorStop(1,'rgba(6,12,9,.97)');x.fillStyle=g;x.fillRect(0,0,W,H);
  g=x.createLinearGradient(0,0,0,260);g.addColorStop(0,'rgba(6,12,9,.7)');g.addColorStop(1,'rgba(6,12,9,0)');x.fillStyle=g;x.fillRect(0,0,W,260);
  x.strokeStyle='rgba(232,190,104,.9)';x.lineWidth=5;[[40,40,1,1],[W-40,40,-1,1],[40,H-40,1,-1],[W-40,H-40,-1,-1]].forEach(([a,b,sx,sy])=>{x.beginPath();x.moveTo(a,b+60*sy);x.lineTo(a,b);x.lineTo(a+60*sx,b);x.stroke()});
  x.fillStyle='#E8BE68';x.font='500 30px "IBM Plex Mono",monospace';x.fillText('NONG BUA LAM PHU · LOCAL IDENTITY No.'+pad2(p.id),80,110);
  if(bd)x.drawImage(bd,W-280,70,200,200);
  if(p.gi){x.fillStyle='#E8BE68';const t='GI · สิ่งบ่งชี้ทางภูมิศาสตร์';x.font='600 30px Kanit';const tw=x.measureText(t).width;x.beginPath();x.roundRect(80,150,tw+44,54,27);x.fill();x.fillStyle='#1B1406';x.fillText(t,102,188)}
  let y=H-470;x.fillStyle='#fff';const nm=pname(p);let fs=nm.length>12?96:120;x.font=`600 ${fs}px Kanit`;while(x.measureText(nm).width>W-160&&fs>60){fs-=6;x.font=`600 ${fs}px Kanit`}x.fillText(nm,80,y);
  x.fillStyle='#E8BE68';x.font='italic 400 46px Fraunces';x.fillText(p.en,80,y+62);
  x.fillStyle='rgba(255,255,255,.9)';x.font='400 36px Sarabun';const words=[...(pen(p,'t',p.tagline))];let line='',ly=y+130;
  for(const ch of words){if(x.measureText(line+ch).width>W-160){x.fillText(line,80,ly);line=ch;ly+=48;if(ly>y+180)break}else line+=ch}if(ly<=y+180)x.fillText(line,80,ly);
  if(va){x.fillStyle='rgba(255,255,255,.12)';x.beginPath();x.roundRect(80,H-210,560,120,24);x.fill();x.fillStyle='rgba(255,255,255,.7)';x.font='400 26px Sarabun';x.fillText(va.s[2].t,108,H-170);x.fillStyle='#fff';x.font='600 52px Kanit';const pt=fP(va.s[2].v);x.fillText(pt,108,H-112);const pw=x.measureText(pt).width;x.font='400 28px Kanit';x.fillStyle='rgba(255,255,255,.75)';x.fillText(va.u,118+pw,H-112)}
  const qd=document.createElement('div');if(window.QRCode){new QRCode(qd,{text:link,width:180,height:180,correctLevel:QRCode.CorrectLevel.M});const qc=qd.querySelector('canvas');if(qc){x.fillStyle='#fff';x.beginPath();x.roundRect(W-300,H-300,220,220,22);x.fill();x.drawImage(qc,W-280,H-280,180,180)}}
  x.fillStyle='rgba(255,255,255,.75)';x.font='400 24px Kanit';x.textAlign='center';x.fillText(L('สแกนดูร้านค้า','Scan for shops'),W-190,H-48);x.textAlign='left';
  g=x.createLinearGradient(0,0,W,0);g.addColorStop(0,p.pa);g.addColorStop(.6,'#E8BE68');g.addColorStop(1,'#E26D8F');x.fillStyle=g;x.fillRect(0,H-12,W,12);
  x.fillStyle='rgba(255,255,255,.55)';x.font='400 22px Kanit';x.fillText('12 Plus+ · สินค้าอัตลักษณ์หนองบัวลำภู',80,H-48);
  try{$('#spD').href=c.toDataURL('image/png')}catch(e){$('#spD').remove();toast(L('เบราว์เซอร์ไม่อนุญาตให้บันทึกภาพ','Saving not allowed'))}
}

/* ================= หนังสือสินค้า (Lookbook) ================= */
const BK={cur:0,n:0,mode:'spread',auto:0,snd:true,busy:false};
function bkFaces(){
  const tot=sum(P.map(p=>periodVal(p,S.y))),prod=sum(P.map(p=>p.prodY[S.y]));
  const F=[];
  F.push(`<div class="pg dark cover"><div class="cv-ph" style="background-image:url(img/book-cover.webp),url(img/kv-00.webp)"></div><div class="hx-grid" aria-hidden="true"></div>
    <div class="cv-in"><div class="cv-org"><img src="img/seal.png" alt=""><span><b>${L('จังหวัดหนองบัวลำภู','Nong Bua Lam Phu')}</b>${L('Nong Bua Lam Phu Province','Thailand')}</span></div>
    <div class="cv-mid"><span class="big">14</span><span class="lp">Local<br>Products</span></div>
    <h1>${L('สินค้าอัตลักษณ์<br>หนองบัวลำภู','Signature products of<br>Nong Bua Lam Phu')}</h1><p>${L('จากแผ่นดินลุ่มภู สู่ตลาดโลก','From the Lam Phu plains to the world')}</p>
    <div class="cv-ft"><span>Lookbook ${yCE(2569)}</span><span>12 Plus<sup>+</sup></span></div></div><span class="tap">${L('แตะเพื่อเปิด','Tap to open')} ›</span></div>`);
  F.push(`<div class="pg intro"><span class="rh">12 Plus<sup>+</sup> · Lookbook</span>
    <span class="eyebrow">Welcome to Nong Bua Lam Phu</span><h2>${L('แผ่นดินลุ่มภู<br>ต้นทางของดี <em>14 อย่าง</em>','The Lam Phu plains,<br>home of <em>14 signatures</em>')}</h2>
    <p>${L('ภูเขาหินปูน ป่าต้นน้ำ และทุ่งนาลุ่มน้ำ ทำให้หนองบัวลำภูมีของดีที่ไม่เหมือนใคร ตั้งแต่ข้าวหอม กาแฟบนภู จนถึงผ้าทอและงานจักสาน GI ทุกหน้าในเล่มนี้พาไปรู้จักสินค้า และบอกว่าซื้อได้ที่ไหน','Limestone hills, headwater forests and river plains give Nong Bua Lam Phu its one-of-a-kind products — from fragrant rice and highland coffee to GI textiles and basketry. Every page shows the product and where to buy it.')}</p>
    <div class="in-st"><div><b>14</b><span>${L('สินค้าอัตลักษณ์','products')}</span></div><div><b>3</b><span>${L('สินค้า GI','GI products')}</span></div><div><b>${nf.format(prod)}</b><span>${L('เกษตรกรและผู้ผลิต','makers')}</span></div><div><b>6</b><span>${L('อำเภอ','districts')}</span></div></div>
    <div class="in-map">${mapSVG(DISTRICTS.map((_,i)=>sum(P.map(p=>distVal(p,i)))),null)}</div>
    <div class="in-how"><span>${ic('arrowR')} ${L('แตะขอบขวาหรือปัดเพื่อพลิกหน้า','Tap the right edge or swipe to turn')}</span><span>${ic('map')} ${L('สแกน QR เพื่อนำทางไปร้าน','Scan QR to navigate to shops')}</span></div><span class="pn">2</span></div>`);
  F.push(`<div class="pg toc"><span class="rh r">Contents</span><span class="eyebrow">Contents</span><h2>${L('สารบัญ','Contents')}</h2>
    <ol>${P.map((p,n)=>`<li><a href="#" data-go="${n+2}" data-gs="${3+2*n}"><span class="no">${pad2(p.id)}</span>${badge(p,{label:false})}<span class="nm"><b>${esc(pname(p))}${p.gi?' <i class="gi">GI</i>':''}</b><small>${esc(EN_MODE()?p.name:p.en)}</small></span><span class="pg-n">${4+2*n}</span></a></li>`).join('')}</ol><span class="pn">3</span></div>`);
  P.forEach((p,n)=>{
    const va=vaP(p),sh=shopsOf(p),s=sh[0],hl=pen(p,'hl',p.hl),pk=p.season.indexOf(Math.max(...p.season)),mx=Math.max(...p.season);
    F.push(`<div class="pg dark pa" style="--pa:${p.pa}"><img class="pa-ph" src="${IMG('post',p.id)}" alt="${esc(pname(p))}" loading="lazy"><div class="pa-sh"></div>
      <span class="rh">12 Plus<sup>+</sup> · No.${pad2(p.id)}</span><span class="pa-no">${pad2(p.id)}</span>${badge(p,{label:false})}
      <div class="pa-tx"><span class="eyebrow">${GN(p.g)}</span>${p.gi?`<span class="gi lg">${ic('star')} GI</span>`:''}<h2>${esc(pname(p))}</h2><span class="en">${esc(EN_MODE()?p.name:p.en)}</span><p>${esc(pen(p,'t',p.tagline))}</p>${typeof certRow==='function'?certRow(p,'mini'):''}</div><span class="pn">${4+2*n}</span></div>`);
    F.push(`<div class="pg pb" style="--pa:${p.pa}"><span class="rh r">No.${pad2(p.id)} · ${esc(pname(p))}</span>
      <div class="pb-ph">${['a','pack','b'].map(k=>`<img src="${IMG(k,p.id)}" alt="" loading="lazy">`).join('')}</div>
      <h3>${L('เรื่องราว','The story')}</h3><p class="pb-st">${esc(pen(p,'s',p.story))}</p>
      <ul class="pb-hl">${hl.slice(0,3).map(h=>`<li>${esc(h)}</li>`).join('')}</ul>
      ${va?`<div class="pb-va">${va.s.map((x,j)=>`${j?`<i>×${KX(x.v/va.s[j-1].v)}</i>`:''}<div><small>${esc(x.t)}</small><b>${fP(x.v)}</b></div>`).join('')}<span>${esc(va.u)}</span></div>`:''}
      <div class="pb-ss"><span>${L('ช่วงเด่น','Best')} <b>${MOF()[pk]}</b></span><div>${p.season.map((w,k)=>`<i class="${k===pk?'pk':''}" style="opacity:${(.18+.82*w/mx).toFixed(2)}"></i>`).join('')}</div></div>
      <div class="pb-shop${s?'':' empty'}">
        <div class="t"><span class="k">${L('ซื้อได้ที่','Where to buy')}</span>${s?`<b>${esc(s.nick)}</b><span class="of">${esc(s.name)}</span><span class="ad">${esc(s.addr)}</span>
          <div class="ct"><span><em>โทร</em>${esc(s.tel)}</span><span><em>LINE</em>${esc(s.line)}</span><span><em>FB</em>${esc(s.fb)}</span><span><em>IG</em>${esc(s.ig)}</span></div>`
          :`<b>${L('ร้านค้าแนะนำ','Featured shops')}</b><span class="of">${L('กำลังรวบรวมข้อมูลร้านค้า เร็ว ๆ นี้','Shop details coming soon')}</span><span class="ad">${L('ติดตามได้ที่หน้าสินค้าบนแดชบอร์ด','Follow the product page on the dashboard')}</span>`}
          <div class="bt">${s?`<a href="${mapUrl(s)}" target="_blank" rel="noopener">${L('นำทางไปร้าน','Navigate')} ${ic('ext')}</a>`:''}<a href="${pFile(p.id)}">${L('ดูข้อมูลสินค้า','Product page')} ${ic('arrowR')}</a>${sh.length>1?`<a href="${pFile(p.id)}#shops">+${sh.length-1} ${L('ร้าน','shops')}</a>`:''}</div></div>
        <div class="q"><div class="qr" data-qr="${esc(s?mapUrl(s):absUrl(pFile(p.id)))}"></div><small>${s?L('สแกนนำทาง','Scan to go'):L('สแกนดูสินค้า','Scan to view')}</small></div>
      </div><span class="pn">${5+2*n}</span></div>`);
  });
  F.push(`<div class="pg dark back"><div class="hx-grid" aria-hidden="true"></div><div class="bk-in">
    <span class="eyebrow">Thank you · ขอบคุณที่ร่วมสนับสนุนของดีหนองบัวลำภู</span>
    <h2>${L('ซื้อของดี<br>ช่วยชุมชนลุ่มภู','Buy local,<br>support Lam Phu')}</h2>
    <div class="bq"><div class="qr" data-qr="${esc(absUrl('index.html'))}"></div><span>${L('สแกนเพื่อชมแดชบอร์ด 12 Plus+','Scan for the 12 Plus+ dashboard')}</span></div>
    <div class="ad"><img src="img/seal.png" alt=""><span><b>สำนักงานจังหวัดหนองบัวลำภู</b>ศาลากลางจังหวัดหนองบัวลำภู ชั้น 4 ถ.หนองบัวลำภู – เลย<br>ต.ลำภู อ.เมือง จ.หนองบัวลำภู 39000</span><img class="gd" src="img/gd-catalog.png" alt="GD Catalog"></div>
    <span class="cp">© 2569 สำนักงานสถิติจังหวัดหนองบัวลำภู · 12 Plus<sup>+</sup> Lookbook</span></div></div>`);
  return F;
}
function bookView(box,startP){
  const F=bkFaces();BK.n=F.length;const leaves=Math.ceil(F.length/2);BK.leaves=leaves;
  const thumbs=[['0','cover',L('ปก','Cover')],...P.map((p,n)=>[n,'p',p]),['end','back',L('ปกหลัง','Back')]];
  box.innerHTML=`
  <div class="bk-wrap" id="bkWrap">
    <canvas class="fx-dust" aria-hidden="true"></canvas>
    <div class="bk-stage" id="bkStage">
      <div class="bk" id="bk"><i class="bk-sh"></i>${Array.from({length:leaves},(_,i)=>`<div class="leaf" data-l="${i}"><div class="face front">${F[2*i]||''}</div><div class="face back">${F[2*i+1]||'<div class="pg blank"></div>'}</div></div>`).join('')}</div>
      <div class="sp" id="bkSp">${F.map((f,i)=>`<div class="spg" data-i="${i}">${f}</div>`).join('')}</div>
    </div>
    <div class="bk-bar">
      <button class="bk-b" type="button" id="bkPrev" aria-label="${L('หน้าก่อน','Previous')}">${ic('arrowL')}</button>
      <div class="bk-info"><b id="bkT"></b><span id="bkN"></span><div class="bk-prog"><i id="bkPr"></i></div></div>
      <button class="bk-b" type="button" id="bkNext" aria-label="${L('หน้าถัดไป','Next')}">${ic('arrowR')}</button>
      <span class="bk-sp"></span>
      <button class="bk-b sm" type="button" id="bkAuto" title="${L('เล่นอัตโนมัติ','Autoplay')}" aria-label="${L('เล่นอัตโนมัติ','Autoplay')}">${ic('play')}</button>
      <button class="bk-b sm" type="button" id="bkSnd" title="${L('เสียงพลิกหน้า','Page sound')}" aria-label="${L('เสียงพลิกหน้า','Page sound')}">${ic(BK.snd?'vol':'mute')}</button>
      <button class="bk-b sm" type="button" id="bkShare" title="${L('คัดลอกลิงก์หน้านี้','Copy link to this page')}" aria-label="share">${ic('link')}</button>
      <button class="bk-b sm" type="button" id="bkFs" title="${L('เต็มจอ','Fullscreen')}" aria-label="${L('เต็มจอ','Fullscreen')}">${ic('monitor')}</button>
    </div>
    <div class="bk-th" id="bkTh">${thumbs.map(([k,t,x])=>t==='p'?`<button type="button" data-th="${k}" title="${esc(pname(x))}">${badge(x,{label:false})}<span>${pad2(x.id)}</span></button>`:`<button type="button" data-th="${k}" class="tx">${x}</button>`).join('')}</div>
  </div>`;
  const qrs=()=>{if(!window.QRCode)return;$$('.qr[data-qr]',box).forEach(el=>{if(el.dataset.done)return;el.dataset.done=1;new QRCode(el,{text:el.dataset.qr,width:180,height:180,correctLevel:QRCode.CorrectLevel.M})})};
  setTimeout(qrs,60);
  BK.cur=0;BK.auto&&clearInterval(BK.auto);BK.auto=0;
  bkLayout();
  if(startP&&byId(startP)){const n=P.indexOf(byId(startP));bkGo(BK.mode==='spread'?n+2:3+2*n,true)}else bkGo(0,true);
  $('#bkPrev').onclick=()=>bkStep(-1);$('#bkNext').onclick=()=>bkStep(1);
  $('#bkAuto').onclick=()=>{if(BK.auto){clearInterval(BK.auto);BK.auto=0;$('#bkAuto').innerHTML=ic('play')}else{BK.auto=setInterval(()=>{if(R.page!=='brief'||!$('#bk')){clearInterval(BK.auto);BK.auto=0;return}bkStep(1,true)},5200);$('#bkAuto').innerHTML=ic('pause');bkStep(1)}};
  $('#bkSnd').onclick=()=>{BK.snd=!BK.snd;$('#bkSnd').innerHTML=ic(BK.snd?'vol':'mute')};
  $('#bkShare').onclick=()=>{const p=bkProduct();copyText(absUrl('brief.html?v=book'+(p?'&p='+p.id:'')),L('คัดลอกลิงก์หน้านี้แล้ว','Link copied'))};
  $('#bkFs').onclick=()=>{const w=$('#bkWrap');if(document.fullscreenElement)document.exitFullscreen();else(w.requestFullscreen||w.webkitRequestFullscreen||(()=>w.classList.toggle('fs'))).call(w)};
  $$('[data-th]',box).forEach(b=>b.onclick=()=>{const k=b.dataset.th,sp=BK.mode==='spread';bkGo(k==='0'?0:k==='end'?(sp?BK.leaves:BK.n-1):(sp?+k+2:3+2*+k))});
  box.addEventListener('click',e=>{const a=e.target.closest('[data-go]');if(a){e.preventDefault();bkGo(BK.mode==='spread'?+a.dataset.go:+a.dataset.gs);return}
    if(e.target.closest('a,button,.bk-bar,.bk-th'))return;const st=e.target.closest('#bkStage');if(!st)return;
    const r=st.getBoundingClientRect();bkStep(e.clientX>r.left+r.width/2?1:-1)});
  let sx=0,sy=0;const stg=$('#bkStage');
  stg.addEventListener('touchstart',e=>{sx=e.touches[0].clientX;sy=e.touches[0].clientY},{passive:true});
  stg.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-sx,dy=e.changedTouches[0].clientY-sy;if(Math.abs(dx)>50&&Math.abs(dy)<Math.abs(dx)*.6)bkStep(dx<0?1:-1)},{passive:true});
  if(!BK.bound){BK.bound=1;
    addEventListener('keydown',e=>{if(R.page!=='brief'||!$('#bk')||e.target.closest('input,select,textarea'))return;
      if(e.key==='ArrowRight'||e.key==='PageDown'||e.key===' '){e.preventDefault();e.stopImmediatePropagation();bkStep(1)}
      else if(e.key==='ArrowLeft'||e.key==='PageUp'){e.preventDefault();e.stopImmediatePropagation();bkStep(-1)}
      else if(e.key==='Home'){bkGo(0)}else if(e.key==='End'){bkGo(BK.mode==='spread'?BK.leaves:BK.n-1)}},true);
    let t;addEventListener('resize',()=>{clearTimeout(t);t=setTimeout(()=>{if($('#bk')){const p=bkProduct(),was=BK.mode;bkLayout();if(was!==BK.mode){const n=p?P.indexOf(p):-1;bkGo(n<0?0:(BK.mode==='spread'?n+2:3+2*n),true)}}},150)});
    document.addEventListener('fullscreenchange',()=>setTimeout(()=>{if($('#bk'))bkLayout()},60));
  }
}
function bkLayout(){
  const w=$('#bkWrap'),st=$('#bkStage');if(!w)return;
  const fs=document.fullscreenElement===w||w.classList.contains('fs');
  const W=st.clientWidth-(innerWidth<640?0:24),Hs=fs?innerHeight-170:Math.max(420,innerHeight-250);
  const spread=W>=720;BK.mode=spread?'spread':'single';
  let pw=spread?Math.min(W/2,Hs/1.414):Math.min(W,560);pw=Math.floor(pw);
  w.style.setProperty('--pw',pw+'px');w.classList.toggle('single',!spread);w.classList.toggle('spread',spread);
}
function bkProduct(){const f=BK.mode==='spread'?2*BK.cur-1:BK.cur;const n=Math.floor((f-3)/2);return n>=0&&n<14?P[n]:null}
function bkStep(d,auto){const max=BK.mode==='spread'?BK.leaves:BK.n-1;let t=BK.cur+d;if(t>max)t=auto?0:max;if(t<0)t=0;bkGo(t)}
function bkSound(){if(!BK.snd)return;try{const A=BK.ac||(BK.ac=new(window.AudioContext||window.webkitAudioContext)());const len=A.sampleRate*.32,b=A.createBuffer(1,len,A.sampleRate),d=b.getChannelData(0);
  for(let i=0;i<len;i++){const t=i/len;d[i]=(Math.random()*2-1)*Math.pow(1-t,2.2)*Math.min(1,t*14)*.5}
  const s=A.createBufferSource(),f=A.createBiquadFilter(),g=A.createGain();f.type='bandpass';f.frequency.value=2400;f.Q.value=.6;g.gain.value=.22;s.buffer=b;s.connect(f).connect(g).connect(A.destination);s.start()}catch(e){}}
function bkGo(t,instant){
  const bk=$('#bk');if(!bk)return;const prev=BK.cur;BK.cur=t;
  if(BK.mode==='spread'){
    const L0=$$('.leaf',bk),N=L0.length;
    L0.forEach((lf,i)=>{const fl=i<t,was=i<prev,moving=fl!==was;
      const delay=instant||!moving?0:Math.abs(t>prev?i-prev:prev-1-i)*90;
      lf.style.transitionDuration=instant?'0s':'';lf.style.transitionDelay=delay+'ms';
      if(moving&&!instant){lf.style.zIndex=N+20+(t>prev?-i:i);lf.classList.add('mv');setTimeout(()=>{lf.classList.remove('mv');lf.style.zIndex=fl?i+1:N-i},delay+950)}
      else lf.style.zIndex=fl?i+1:N-i;
      lf.classList.toggle('fl',fl)});
    bk.style.transform=t===0?'translateX(-25%)':t>=N?'translateX(25%)':'none';
    bk.classList.toggle('closed',t===0||t>=N);bk.dataset.s=t===0?'front':t>=N?'back':'open';
  }else{
    $$('.spg',$('#bkSp')).forEach((pg,i)=>{pg.style.transitionDuration=instant?'0s':'';pg.classList.toggle('gone',i<t);pg.classList.toggle('cur',i===t);pg.style.zIndex=BK.n-i});
  }
  if(!instant&&t!==prev)bkSound();
  const p=bkProduct(),max=BK.mode==='spread'?BK.leaves:BK.n-1;
  const f=BK.mode==='spread'?(t===0?'1':t>=BK.leaves?String(BK.n):`${2*t}–${2*t+1}`):String(t+1);
  $('#bkT').textContent=p?`${pad2(p.id)} · ${pname(p)}`:t===0?L('ปกหน้า','Front cover'):t>=max?L('ปกหลัง','Back cover'):L('บทนำและสารบัญ','Intro & contents');
  $('#bkN').textContent=L('หน้า ','Page ')+f+' / '+BK.n;
  $('#bkPr').style.width=(t/max*100)+'%';
  $('#bkPrev').disabled=t===0;$('#bkNext').disabled=t>=max;
  const th=p?String(P.indexOf(p)):t===0?'0':t>=max?'end':'';
  $$('[data-th]').forEach(b=>b.setAttribute('aria-current',b.dataset.th===th?'true':'false'));
  const cb=$(`[data-th="${th}"]`);if(cb&&cb.scrollIntoView)cb.scrollIntoView({block:'nearest',inline:'center',behavior:instant?'auto':'smooth'});
  if(p){document.body.style.setProperty('--pa',p.pa);$('#page').style.setProperty('--pa',p.pa)}
  try{history.replaceState({},'','brief.html?v=book'+(p?'&p='+p.id:''))}catch(e){}
}
