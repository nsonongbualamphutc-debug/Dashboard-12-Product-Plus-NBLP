/* =====================================================================
   12 Plus+ · pages2.js — หน้าปก ภาพรวม หน้าสินค้า (2 ภาษา)
   วิเคราะห์เชิงกลยุทธ์ · แผนที่แหล่งผลิต · สรุป 1 หน้า A4
   ===================================================================== */
const MON_NOW=new Date().getMonth()+1;
const GN=id=>{const g=GROUPS.find(x=>x.id===id);return g?L(g.name,g.en):''};
const inSeason=(p,m)=>{const w=p.season,avg=sum(w)/12;return w[m-1]>=avg*1.12||w[m-1]===Math.max(...w)};
const nowProducts=()=>P.filter(p=>inSeason(p,MON_NOW)).sort((a,b)=>b.season[MON_NOW-1]/sum(b.season)-a.season[MON_NOW-1]/sum(a.season));
const distVal=(p,i)=>periodVal(p,S.y)*p.dist[i]/sum(p.dist);
const vaMult=p=>{const v=VA[p.id];return v?v[2][2]/v[0][2]:null};
const KX=v=>v>=100?Math.round(v):v>=10?v.toFixed(0):v.toFixed(1);
const yCE=y=>EN_MODE()?y-543:y;
function ticker(){const it=P.map(p=>{const c=periodVal(p,S.y),q=periodVal(p,S.y-1),g=q?c/q-1:0;return`<a href="${pFile(p.id)}"><b>${pad2(p.id)}</b>${esc(pname(p))}<span class="num">${fShort(c)}</span><i class="${g>=0?'up':'dn'}">${g>=0?'▲':'▼'} ${pct(Math.abs(g)).slice(1)}</i></a>`}).join('');
  return`<div class="tick" aria-label="${L('มูลค่าจำหน่ายรายสินค้า','Sales by product')}"><span class="tick-l"><i></i>LIVE · ${periodLabel()}</span><div class="tick-w"><div class="tick-in">${it}${it}</div></div></div>`}

function tile(p){const c=periodVal(p,S.y),q=periodVal(p,S.y-1),g=q?c/q-1:null;
  return`<a class="tile" href="${pFile(p.id)}"><div class="ph" style="background-image:url(${IMG('kv',p.id)})"></div>${badge(p,{label:false})}<span class="no">${pad2(p.id)}</span>
  <span class="tx">${p.gi?'<span class="gi on-dark">GI</span>':''}<b>${esc(pname(p))}</b><span>${fB(c)} ${g==null?'':`<em style="font-style:normal;color:${g>=0?'#7BE0A6':'#FFA597'}">${g>=0?'▲':'▼'}${Math.abs(g*100).toFixed(1)}%</em>`}</span></span></a>`}
function nowStrip(){const L0=nowProducts();
  return`<section class="now"><div class="now-h"><span class="eyebrow">${L('ของดีประจำเดือน','In season now')}</span><h2>${L('เดือน'+MONTHS_FULL[MON_NOW-1]+' มีอะไรดี','What’s good in '+MONTHS_EN[MON_NOW-1])}</h2><a class="note" href="insights.html#heat">${L('ดูปฏิทินทั้งปี ›','Full-year calendar ›')}</a></div>
  <div class="now-l">${L0.map(p=>`<a class="now-c" href="${pFile(p.id)}"><div class="ph" style="background-image:url(${IMG('kv',p.id)})"></div><span>${badge(p,{label:false})}<b>${esc(pname(p))}${giTag(p)}</b><small>${esc(pen(p,'peak',p.peakTxt))}</small></span></a>`).join('')}</div></section>`}

/* ================= หน้าหลัก (ปก) ================= */
PAGE_R.cover=page=>{
  const tot=sum(P.map(p=>periodVal(p,S.y))),prod=sum(P.map(p=>p.prodY[S.y])),R0=readyAll();
  const chip=p=>`<a href="${pFile(p.id)}">${badge(p,{label:false})}${pad2(p.id)} · ${esc(pname(p))}${p.gi?' <span class="gi">GI</span>':''}</a>`;
  const lt='';
  page.innerHTML=`
  <section class="cv">
    <div class="bg" role="img" aria-label="${L('สินค้าอัตลักษณ์ 14 รายการของจังหวัดหนองบัวลำภู','14 identity products of Nong Bua Lam Phu')}"></div><div class="hx-grid" aria-hidden="true"></div><canvas class="fx-dust" aria-hidden="true"></canvas>
    <div class="cv-top"><img src="img/seal.png" alt="ตราจังหวัดหนองบัวลำภู"><span class="org"><b>${L('จังหวัดหนองบัวลำภู','Nong Bua Lam Phu Province')}</b><span>${L('Nong Bua Lam Phu Province','Thailand')}</span></span><span class="x">×</span><img class="gd" src="img/gd-catalog.png" alt="GD Catalog"><span class="sp"></span>
      <button class="btn btn-glass" type="button" data-act="lang">${ic('globe')} ${L('English','ภาษาไทย')}</button>
      <a class="btn btn-glass" href="apistatus.html">${ic('db')} ${L('สถานะข้อมูล','Data status')}</a></div>
    <div class="cv-main">
      <span class="eyebrow">${L('Dashboard เกษตรมูลค่าสูง · '+APP.fy,'High-value agriculture dashboard · FY2026')}</span>
      <div class="wm" data-text="12 Plus+">12 Plus<sup>+</sup></div>
      <h1>${L('สินค้าอัตลักษณ์หนองบัวลำภู<br>จากแผ่นดินลุ่มภู สู่ตลาดทั่วโลก','Identity products of Nong Bua Lam Phu<br>from the Lam Phu plains to the world')}</h1>
      <p>${L('ติดตามการผลิตและการขายของดี 14 รายการของจังหวัด ตั้งแต่แหล่งผลิต การแปรรูป ไปจนถึงมือผู้ซื้อ พร้อมแหล่งที่มาของข้อมูลทุกตัวเลข','Follow production and sales of the province’s 14 signature products — from farm and loom to the buyer — with a source for every figure.')}</p>
      <div class="cv-stats"><div><b>14</b><span>${L('สินค้าอัตลักษณ์','identity products')}</span></div><div><b>3</b><span>${L('สินค้า GI','GI products')}</span></div><div><b>${fmtBaht(tot).n}</b><span>${fmtBaht(tot).u} · ${periodLabel()}</span></div><div><b>${nf.format(prod)}</b><span>${L('เกษตรกรและผู้ผลิต','farmers & makers')}</span></div></div>
      <div class="cta"><a class="btn btn-f" href="overview.html" style="padding:12px 22px;font-size:15px">${L('เข้าสู่แดชบอร์ด','Enter dashboard')} ${ic('arrowR')}</a><a class="btn btn-glass" href="${pFile(1)}">${ic('play')} ${L('เริ่มชมสินค้าชิ้นแรก','Start the tour')}</a></div>
    </div>
    <div class="marq" aria-label="${L('สินค้าอัตลักษณ์ทั้ง 14 รายการ','All 14 products')}"><div class="marq-in">${P.map(chip).join('')}${P.map(chip).join('')}</div></div>
  </section>
  ${ticker()}
  <section class="cv-sec">${nowStrip()}</section>
  <section class="cv-sec" style="padding-top:0">
    <div class="ph-title"><div><span class="eyebrow">${L('เลือกชมสินค้า','Browse products')}</span><h1>${L('ของดี 14 อย่าง เรียงตามแบบสำรวจรายการข้อมูล','14 products, in survey order')}</h1></div><a class="btn btn-o" href="overview.html">${L('ดูภาพรวมทั้งหมด','See the overview')} ${ic('arrowR')}</a></div>
    <div class="tiles">${P.map(tile).join('')}</div>
  </section>
  <section class="cv-sec" style="padding-top:0">
    <div class="qlinks">
      <a class="ql" href="insights.html">${ic('chart')}<b>${PT('insights')}</b><span>${L('ดาวเด่น ดาวรุ่ง มูลค่าเพิ่ม และปฏิทินของดี','Stars, risers, value added and the seasonal calendar')}</span></a>
      <a class="ql" href="map.html">${ic('map')}<b>${PT('map')}</b><span>${L('มูลค่าและสินค้าเด่นรายอำเภอ','Value and leading products by district')}</span></a>
      <a class="ql" href="brief.html">${ic('print')}<b>${PT('brief')}</b><span>${L('สรุปสินค้าแผ่นเดียว พิมพ์หรือส่งต่อได้ทันที','A one-sheet summary to print or share')}</span></a>
      <a class="ql" href="report.html">${ic('report')}<b>${PT('report')}</b><span>${L('สรุปผู้บริหาร ตารางตัวชี้วัด','Executive summary and indicators')}</span></a>
      <a class="ql" href="apistatus.html">${ic('api')}<b>${PT('apistatus')}</b><span>${L('ตัวเลขไหนมาจาก API และสดแค่ไหน','Where every figure comes from')}</span></a>
    </div>
    <div class="live-bn"><span class="lg"><img src="img/seal.png" alt=""><span style="color:#8A6420;font-family:var(--f-latin)">×</span><img src="img/gd-catalog.png" alt=""></span><span><b>${L('เชื่อมต่อระบบบัญชีข้อมูลจังหวัด (GD Catalog)','Connected to the provincial data catalog (GD Catalog)')}</b><span>${L('รอข้อมูลเข้าระบบ · เมื่อหน่วยงานนำข้อมูลขึ้นระบบ ตัวเลขบนแดชบอร์ดจะอัปเดตอัตโนมัติ','Awaiting data · figures update automatically once agencies publish to the catalog')}</span></span><a class="btn" href="apistatus.html" style="background:#fff;color:#0F4A37">${L('ดูสถานะ','View status')} ${ic('arrowR')}</a></div>
  </section>`;
};

/* ================= ภาพรวม ================= */
PAGE_R.overview=page=>{
  const tot=sum(P.map(p=>periodVal(p,S.y))),pre=sum(P.map(p=>periodVal(p,S.y-1)||0)),prod=sum(P.map(p=>p.prodY[S.y])),R0=readyAll();
  const ex=tot-periodVal(byId(2),S.y),exp=pre-(periodVal(byId(2),S.y-1)||0);
  page.innerHTML=`
  <section class="ov-hero"><div class="bg"></div><div class="hx-grid" aria-hidden="true"></div><canvas class="fx-dust" aria-hidden="true"></canvas><div class="ov-txt">
    <span class="eyebrow">${L('ภาพรวม','Overview')} · ${periodLabel()}</span>
    <h1>${L('ของดี <em>14 อย่าง</em><br>จากแผ่นดินหนองบัวลำภู','<em>14 signature</em><br>products of Nong Bua Lam Phu')}</h1>
    <p>${L('มูลค่าการจำหน่าย การเติบโต และความพร้อมของข้อมูลทุกสินค้าในหน้าเดียว แตะการ์ดสินค้าเพื่อดูเรื่องราว ตัวเลข และแหล่งซื้อ','Sales value, growth and data readiness for every product on one page. Tap a card for its story, figures and where to buy.')}</p>
    <div class="cta"><a class="btn btn-f" href="${pFile(1)}">${L('เริ่มชมสินค้าชิ้นแรก','Start the tour')} ${ic('arrowR')}</a><button class="btn btn-glass" type="button" data-act="present">${ic('play')} ${L('นำเสนอเต็มจอ','Present full screen')}</button></div></div></section>
  ${ticker()}
  <div class="kpis">
    ${kpi(L('มูลค่าจำหน่ายรวม 14 สินค้า','Total sales, 14 products'),fmtBaht(tot).n,fmtBaht(tot).u,grTxt(tot,pre),tot>=pre?'pos':'neg',pill('sim'))}
    ${kpi(L('มูลค่ารวม ไม่รวมอ้อย','Total excluding sugarcane'),fmtBaht(ex).n,fmtBaht(ex).u,grTxt(ex,exp),ex>=exp?'pos':'neg',L('ดูสินค้าชุมชนโดยไม่ถูกอ้อยกลบ','Community products without the sugarcane effect'))}
    ${kpi(L('เกษตรกร ช่างทอ และผู้ผลิต','Farmers, weavers & makers'),nf.format(prod),L('ราย','people'),L('รวม 14 สินค้า · ปี ','All 14 products · ')+yCE(S.y),'',pill('sim'))}
    ${kpi(L('รายการข้อมูลที่หน่วยงานมี','Data items available'),R0.ok,'/ '+R0.n,L('ส่งค่าจริงแล้ว ','Actual values received: ')+R0.real,'',pill('real'))}
  </div>
  ${nowStrip()}
  <section><div class="card-h"><h3 style="font-size:18px">${L('สินค้าอัตลักษณ์ 14 รายการ','14 identity products')}</h3><span class="note">${L('เรียงตามแบบสำรวจรายการข้อมูล · แตะเพื่อดูรายละเอียด','In survey order · tap for details')}</span></div><div class="tiles">${P.map(tile).join('')}</div></section>
  <div class="grid-2">
    <div class="card"><div class="card-h"><h3>${L('มูลค่ารวมรายเดือน','Monthly total value')}</h3><span class="note">${yCE(S.y)} vs ${yCE(S.y-1)}</span></div><div class="chart-box"><canvas id="oMonth"></canvas></div></div>
    <div class="card"><div class="card-h"><h3>${L('อันดับมูลค่า (ไม่รวมอ้อย)','Ranking by value (excl. sugarcane)')}</h3><span class="note">${periodLabel()}</span></div><div class="chart-box" style="height:330px"><canvas id="oRank"></canvas></div></div>
  </div>
  <div class="grid-2e">
    <a class="teaser" href="insights.html"><span class="eyebrow">${L('วิเคราะห์เชิงกลยุทธ์','Strategic insights')}</span><b>${L('สินค้าไหนเป็นดาวเด่น ดาวรุ่ง หรือต้องเร่งพัฒนา','Which products are stars, risers or need a push')}</b><span>${L('พร้อมมูลค่าเพิ่มจากการแปรรูป และปฏิทินของดีทั้งปี','Plus value added by processing and the seasonal calendar')} ${ic('arrowR')}</span></a>
    <a class="teaser map" href="map.html"><span class="eyebrow">${L('แผนที่แหล่งผลิต','Production map')}</span><b>${L('แต่ละอำเภอเด่นสินค้าอะไร','What each district is known for')}</b><span>${L('มูลค่ารายอำเภอ 6 อำเภอ','Value across 6 districts')} ${ic('arrowR')}</span></a>
  </div>
  <section class="card"><div class="card-h"><h3>${L('ความพร้อมข้อมูลรายสินค้า','Data readiness by product')}</h3><span class="note">${L('รายการที่หน่วยงานแจ้งว่ามีข้อมูล / รายการทั้งหมด','Items available / total items')}</span></div>
    <div class="scroll-x"><table class="t"><thead><tr><th>${L('สินค้า','Product')}</th><th>${L('หน่วยงานหลัก','Lead agency')}</th>${CHAPTERS.map(c=>`<th class="r">${L(c.t,c.en)}</th>`).join('')}<th class="r">${L('ส่งค่าจริง','Actual')}</th></tr></thead>
    <tbody>${P.map(p=>`<tr><td><a href="${pFile(p.id)}" style="font-family:var(--f-head)">${pad2(p.id)} ${esc(pname(p))}</a> ${giTag(p)}</td><td style="color:var(--muted)">${esc(p.agency)}</td>${p.ready.map(r=>{const x=r.ok/r.n;return`<td class="r"><span class="cell num" style="background:${x?`color-mix(in srgb,var(--good) ${Math.round(15+x*70)}%,var(--surface))`:'var(--surface-3)'};color:${x>.6?'#fff':'var(--ink)'}">${r.ok}/${r.n}</span></td>`}).join('')}<td class="r num">${sum(p.ready.map(r=>r.real))||'–'}</td></tr>`).join('')}</tbody></table></div></section>`;
  const ms=S.y===LAST.y?LAST.m:12;
  mk('oMonth',{type:'bar',data:{labels:MO(),datasets:[{type:'bar',label:String(yCE(S.y)),data:MONTHS.map((_,k)=>k>=ms?null:sum(P.map(p=>p.m[S.y][k]))),backgroundColor:css('--forest')||'#0F4A37',borderRadius:6,maxBarThickness:28,order:2},
    {type:'line',label:String(yCE(S.y-1)),data:MONTHS.map((_,k)=>sum(P.map(p=>p.m[S.y-1]?.[k]))),borderColor:css('--gold'),backgroundColor:css('--gold'),borderWidth:2,pointRadius:2.5,tension:.35,order:1}]},options:baseOpts()});
  const rk=[...P].filter(p=>p.id!==2).sort((a,b)=>periodVal(b,S.y)-periodVal(a,S.y));
  mk('oRank',{type:'bar',data:{labels:rk.map(p=>pname(p)),datasets:[{label:L('มูลค่า','Value'),data:rk.map(p=>periodVal(p,S.y)),backgroundColor:rk.map(p=>p.pa),borderRadius:5,maxBarThickness:18}]},
    options:baseOpts({indexAxis:'y',onClick:(e,els)=>{if(els[0])go(pFile(rk[els[0].index].id))},plugins:{legend:{display:false},tooltip:{callbacks:{label:c=>' '+fB(c.raw)}}},scales:{x:{grid:{color:css('--line')},border:{display:false},ticks:{color:css('--muted'),callback:v=>fShort(v),font:{family:'Kanit',size:10}}},y:{grid:{display:false},border:{display:false},ticks:{color:css('--ink'),font:{family:'Kanit',size:12}}}}})});
};

/* ================= มูลค่าเพิ่มจากการแปรรูป ================= */
function vaBlock(p,compact){const v=VA[p.id];if(!v)return'';const mx=v[2][2],m=vaMult(p);
  return`<div class="va${compact?' cmpct':''}">${v.slice(0,3).map((s,i)=>`<div class="va-s"><span class="va-k">${['01','02','03'][i]} · ${L(['วัตถุดิบ','แปรรูป','สินค้าพร้อมขาย'][i],['Raw','Processed','Retail-ready'][i])}</span><b>${esc(L(s[0],s[1]))}</b><span class="va-p num">${nf.format(s[2])} <small>${esc(L(v[3],v[4]))}</small></span><i style="width:${Math.max(4,s[2]/mx*100)}%"></i></div>${i<2?`<span class="va-x">×${KX(v[i+1][2]/s[2])}</span>`:''}`).join('')}
  <div class="va-m"><b>×${KX(m)}</b><span>${L('มูลค่าเพิ่มจากวัตถุดิบถึงสินค้าพร้อมขาย','value added from raw to retail')}</span>${pill('sim')}</div></div>`}

/* ================= หน้าสินค้า ================= */
function vsBody2(p){
  const view=store.get('nbl12-vsview','viz');
  if(view==='table')return`<div class="scroll-x"><table class="t"><thead><tr><th>${L('รหัส','Code')}</th><th>${L('รายการข้อมูล','Indicator')}</th><th class="r">${L('ค่า','Value')}</th><th>${L('หน่วย','Unit')}</th><th>${L('ปีข้อมูล','Year')}</th><th>${L('หน่วยงานเจ้าของข้อมูล','Data owner')}</th><th>${L('สถานะ','Status')}</th></tr></thead><tbody>
    ${CHAPTERS.map(c=>`<tr class="grp"><td colspan="7">${pad2(c.k+1)} · ${L(c.t,c.en)} <span style="font-weight:400;color:var(--muted)">— ${c.d}</span></td></tr>`+p.inds.filter(d=>d.s===c.k).map(d=>`<tr id="ind-${d.code}"><td><code>${d.code}</code></td><td>${esc(d.n)}</td><td class="r num">${d.val==null?'–':typeof d.val==='string'?esc(d.val):nf.format(d.val)}</td><td>${esc(d.u)}</td><td>${d.per||ANCHOR}</td><td>${esc(d.ag)}</td><td>${pill(DS.status(d))}</td></tr>`).join('')).join('')}</tbody></table></div>`;
  return CHAPTERS.map(c=>{const Ls=p.inds.filter(d=>d.s===c.k),r=p.ready[c.k];const fi=Ls.findIndex(d=>['money','qty','area','people'].includes(d.vt));
    return`<div class="chap"><div class="chap-h"><span class="chap-no">${pad2(c.k+1)}</span><div><h3>${EN_MODE()?c.en:c.t+`<em>${c.en}</em>`}</h3><p>${c.d} · ${Ls.length} ${L('รายการ','items')}</p></div><div class="ringw">${ring(r.ok,r.n)}<span>${L('หน่วยงานมีข้อมูล','Available')}<br>${r.ok} / ${r.n}</span></div></div>
    <div class="vgrid">${Ls.map((d,i)=>vcard(d,p,i===fi)).join('')}</div></div>`}).join('');
}
PAGE_R.product=(page,p)=>{
  const cur=periodVal(p,S.y),pre=periodVal(p,S.y-1),gr=pre?cur/pre-1:null;
  const price=S.mode==='M'?p.priceY[S.y]*(1+(p.season[S.m-1]-8)/-200):p.priceY[S.y],vol=cur/price;
  const isReal=p.real&&S.y===ANCHOR&&S.mode==='Y';const peakIdx=p.season.indexOf(Math.max(...p.season));
  const R0=p.ready.reduce((a,r)=>({n:a.n+r.n,ok:a.ok+r.ok,real:a.real+r.real}),{n:0,ok:0,real:0});
  const shops=SHOPS[p.id]||[];const ags=[...new Set(p.inds.map(d=>d.ag))];
  const i=P.indexOf(p),prv=P[(i+P.length-1)%P.length],nxt=P[(i+1)%P.length];
  const vid=SET.video&&!matchMedia('(prefers-reduced-motion: reduce)').matches,api=DS.cache[p.id];
  const hl=pen(p,'hl',p.hl);const vsv=store.get('nbl12-vsview','viz');
  page.innerHTML=`
  <section class="hx" aria-label="${esc(pname(p))}">
    <div class="hx-bg" aria-hidden="true" style="background-image:url(${IMG('kv',p.id)})"></div>
    <div class="hx-shade" aria-hidden="true"></div><div class="hx-grid" aria-hidden="true"></div><canvas class="fx-dust" aria-hidden="true"></canvas>
    <span class="hx-no" aria-hidden="true">${pad2(p.id)}</span>
    <div class="hx-in">
      <div class="hx-txt">
        <div class="rank"><span class="chip-no">${L('สินค้าอัตลักษณ์','Identity product')} ${pad2(p.id)}/14</span>${p.gi?`<span class="gi lg" title="สิ่งบ่งชี้ทางภูมิศาสตร์">${ic('star')} ${L('สินค้า GI','GI product')}</span>`:''}<span class="eyebrow">${GN(p.g)}</span></div>
        <h1>${esc(pname(p))}<span class="en">${esc(EN_MODE()?p.name:p.en)}</span></h1>
        <div class="tagline">${esc(pen(p,'t',p.tagline))}</div><p class="story">${esc(pen(p,'s',p.story))}</p>
        <div class="hl">${hl.map(h=>`<span>${esc(h)}</span>`).join('')}</div>
        <div class="cta"><a class="btn btn-p" href="#shops" data-jump="shops">${L('ซื้อได้ที่ไหน','Where to buy')} ${ic('arrowR')}</a><a class="btn btn-glass" href="#vs" data-jump="vs">${L('เส้นทางจากแหล่งผลิตถึงผู้ซื้อ','From source to buyer')}</a><a class="btn btn-glass" href="brief.html?p=${p.id}">${ic('print')} ${L('สรุป 1 หน้า','One-page brief')}</a></div>
      </div>
      <div class="hx-media" data-tilt>
        <div class="media-frame" style="background-image:url(${IMG('poster',p.id)})">${vid?`<video src="video/clip-${pad2(p.id)}.mp4" poster="${IMG('poster',p.id)}" autoplay muted loop playsinline preload="metadata" aria-label="${esc(pname(p))}"></video>`:''}
          <i class="hud tl"></i><i class="hud tr"></i><i class="hud bl"></i><i class="hud br"></i><i class="scan"></i>
          <span class="live"><i></i>Showcase · No.${pad2(p.id)}</span></div>
        <div class="ar ar1"><small>YoY</small><b class="${gr>=0?'up':'dn'}">${gr==null?'–':(gr>=0?'▲ ':'▼ ')+pct(Math.abs(gr)).slice(1)}</b></div>
        <div class="ar ar2"><small>${L('ราคาเฉลี่ย','Avg price')}</small><b><span class="cu">${nf.format(Math.round(p.priceY[S.y]))}</span> <em>${esc(pen(p,'priceU',p.priceU))}</em></b></div>
        <div class="ar ar3"><small>${L('ฤดูกาลเด่น','Peak')}</small><b>${MOF()[peakIdx]}</b></div>
        ${badge(p,{spin:true})}${vid?`<button class="vbtn" type="button" id="vBtn" aria-label="${L('หยุดวิดีโอ','Pause video')}">${ic('pause')}</button>`:''}
      </div>
    </div>
    <div class="hx-stats">
      <div class="st"><small>${L('มูลค่าการจำหน่าย','Sales value')} · ${periodLabel()}</small><b><span class="cu">${fmtBaht(cur).n}</span><em>${fmtBaht(cur).u}</em></b><span class="d ${gr>=0?'pos':'neg'}">${grTxt(cur,pre)}</span><span class="src">${(isReal&&p.real.v?pill('real'):pill('sim'))} ${esc(p.agency)}</span></div>
      <div class="st"><small>${L('ปริมาณผลผลิต/จำหน่าย','Volume')}</small><b><span class="cu">${nf.format(Math.round(vol))}</span><em>${esc(p.volU)}</em></b><span class="d">${S.mode==='Y'?periodLabel():MOF()[S.m-1]}</span><span class="src">${isReal&&p.real.vol?pill('real'):pill('sim')}</span></div>
      <div class="st"><small>${esc(pen(p,'prodL',p.prodL))}</small><b><span class="cu">${nf.format(p.prodY[S.y])}</span><em>${L('ราย','people')}</em></b><span class="d pos">${p.prodY[S.y-1]?'▲ '+pct(p.prodY[S.y]/p.prodY[S.y-1]-1)+L(' จากปีก่อน',' YoY'):''}</span><span class="src">${isReal&&p.real.prod?pill('real'):pill('sim')}</span></div>
      <div class="st"><small>${L('รายการข้อมูลที่หน่วยงานมี','Data items available')}</small><b><span class="cu">${R0.ok}</span><em>/ ${R0.n}</em></b><span class="d">${R0.real?L('ส่งค่าจริงแล้ว ','Actual values: ')+R0.real:L('รอหน่วยงานส่งค่า','Awaiting agency data')}</span><span class="src">${api&&api.n?pill('api'):pill('wait')}</span></div>
    </div>
  </section>
  <div class="grid-2">
    <div class="card"><div class="card-h"><h3>${S.mode==='Y'?L('มูลค่าจำหน่ายรายเดือน','Monthly sales value'):L('มูลค่ารายเดือน · ไฮไลต์ ','Monthly value · highlight ')+MOF()[S.m-1]}</h3><span class="note">${yCE(S.y)} vs ${yCE(S.y-1)}</span></div><div class="chart-box"><canvas id="cMonth"></canvas></div></div>
    <div class="card"><div class="card-h"><h3>${S.mode==='Y'?L('มูลค่ารายปี','Yearly value'):MOF()[S.m-1]+L(' ย้อนหลัง',' by year')}</h3><span class="note">${S.mode==='Y'&&S.y===LAST.y?L('ปีล่าสุดถึง ','Latest year to ')+MO()[LAST.m-1]:''}</span></div><div class="chart-box"><canvas id="cYear"></canvas></div></div>
  </div>
  <section class="card"><div class="card-h"><h3>${L('มูลค่าเพิ่มจากการแปรรูป','Value added by processing')}</h3><span class="note">${L('ราคาต่อหน่วยในแต่ละขั้น · ค่าจำลอง รอข้อมูลราคาจริงจากหน่วยงาน','Unit price at each stage · simulated, awaiting agency prices')}</span></div>${vaBlock(p)}</section>
  <section class="card" id="vs">
    <div class="vs-head"><div><span class="eyebrow">Value story</span><h2>${L('เส้นทางของ','The journey of ')}${esc(pname(p))}</h2><p>${L('จากแหล่งผลิต สู่การแปรรูป และถึงมือผู้ซื้อ · ','From source to processing to the buyer · ')}${p.inds.length} ${L('รายการข้อมูลตามแบบสำรวจ','survey indicators')}${EN_MODE()?' · indicator names in Thai':''}</p></div>
      <div class="row"><div class="seg" role="group" aria-label="รูปแบบการแสดงผล"><button type="button" data-vs="viz" aria-pressed="${vsv==='viz'}">${ic('chart')} ${L('ภาพ','Visual')}</button><button type="button" data-vs="table" aria-pressed="${vsv==='table'}">${ic('table')} ${L('ตาราง','Table')}</button></div>
      <button class="btn btn-g sm" type="button" id="vsCsv">${ic('down')} CSV</button></div></div>
    <div id="vsBody" style="margin-top:16px">${vsBody2(p)}</div>
    <div class="src-line" style="margin-top:16px"><span><b>${L('แหล่งที่มา','Source')}</b> ${ags.map(esc).join(' · ')}</span><span><b>${L('อ้างอิง','Reference')}</b> ${APP.survey}</span><span><b>${L('การเชื่อมต่อ','Connection')}</b> ${api&&api.n?`API ${api.n} · ${new Date(api.t).toLocaleDateString('th-TH')}`:L('รอข้อมูลเข้าระบบบัญชีข้อมูลจังหวัด','Awaiting provincial data catalog')}</span><a href="sources.html">${L('ทะเบียนข้อมูลทั้งหมด ›','All data sources ›')}</a></div>
  </section>
  <section><div class="card-h"><h3 style="font-size:18px">${L('แกลเลอรีสินค้า','Gallery')}</h3><span class="note">${L('แตะเพื่อดูภาพขยาย','Tap to enlarge')}</span></div>
    <div class="gal" id="gal">${[['b','พร้อมเสิร์ฟถึงมือคุณ','Ready for you','3/4'],['post','ภาพประชาสัมพันธ์','Promotional','2/3'],['pack','บรรจุภัณฑ์','Packaging','1/1'],['a','ต้นทางที่หนองบัวลำภู','At the source','16/9'],['shop','หน้าร้าน','Storefront','3/2'],['kv','Key Visual','Key visual','16/9']].map(([k,t,e,r],j)=>`<figure data-i="${j}" style="aspect-ratio:${r}"><img src="${IMG(k,p.id)}" alt="${esc(pname(p))} · ${L(t,e)}" decoding="async"><figcaption>${L(t,e)}</figcaption></figure>`).join('')}</div></section>
  <div class="grid-3">
    <div class="card"><div class="card-h"><h3>${L('แหล่งผลิตรายอำเภอ','Production by district')}</h3><a class="note" href="map.html?p=${p.id}">${L('ดูแผนที่ ›','Map ›')}</a></div><div class="chart-box sm"><canvas id="cDist"></canvas></div></div>
    <div class="card"><div class="card-h"><h3>${L('ช่องทางการจำหน่าย','Sales channels')}</h3><span class="note">%</span></div><div class="chart-box sm"><canvas id="cCh"></canvas></div></div>
    <div class="card"><div class="card-h"><h3>${L('ปฏิทินฤดูกาล','Seasonal calendar')}</h3><span class="note">${esc(pen(p,'peak',p.peakTxt))}</span></div>
      <div class="season">${p.season.map((w,k)=>{const mx=Math.max(...p.season);return`<div class="${w===mx?'pk':''}${k+1===MON_NOW?' now':''}"><i style="opacity:${(.15+.85*w/mx).toFixed(2)}" title="${MOF()[k]}"></i>${MO()[k].replace('.','').slice(0,3)}</div>`}).join('')}</div>
      <p class="note" style="font-size:13px;margin:12px 0 0">${L('ช่วงสีเข้มคือช่วงที่มีสินค้ามาก เหมาะกับการสั่งซื้อ จัดกิจกรรมส่งเสริมการขาย และวางแผนรับซื้อล่วงหน้า','Darker months have the most supply — best for ordering, promotions and forward buying.')}</p></div>
  </div>
  <section class="card" id="shops"><div class="card-h"><h3>${L('แหล่งซื้อ · ร้านค้าและกลุ่มผู้ผลิต','Where to buy · shops and producer groups')}</h3><span class="note">${shops.length?shops.length+L(' ร้าน (ข้อมูลจริง)',' shop(s)'):L('รอข้อมูลร้านค้าจากหน่วยงาน','Awaiting shop data')}</span></div>
    <div class="shops">${shops.map((s,k)=>shopCard(p,s,k)).join('')}${shops.length<3?shopPlaceholder(p):''}</div></section>
  <nav class="pn" aria-label="${L('สินค้าก่อนหน้าและถัดไป','Previous and next')}"><a href="${pFile(prv.id)}" style="background-image:url(${IMG('kv',prv.id)})"><small>← ${L('สินค้าก่อนหน้า','Previous')} · ${pad2(prv.id)}</small><b>${esc(pname(prv))}</b></a><a class="nx" href="${pFile(nxt.id)}" style="background-image:url(${IMG('kv',nxt.id)})"><small>${L('สินค้าถัดไป','Next')} · ${pad2(nxt.id)} →</small><b>${esc(pname(nxt))}</b></a></nav>`;
  $$('[data-jump]',page).forEach(a=>a.onclick=e=>{e.preventDefault();document.getElementById(a.dataset.jump).scrollIntoView({behavior:'smooth',block:'start'})});
  $$('[data-vs]',page).forEach(b=>b.onclick=()=>{store.set('nbl12-vsview',b.dataset.vs);$$('[data-vs]',page).forEach(x=>x.setAttribute('aria-pressed',x===b));$('#vsBody').innerHTML=vsBody2(p)});
  $('#vsCsv').onclick=()=>download(`12plus_${pad2(p.id)}_${p.name}.csv`,[csvRow(['code','chapter','indicator','value','unit','year','agency','status']),...p.inds.map(d=>csvRow([d.code,CHAPTERS[d.s].t,d.n,d.val,d.u,d.per||ANCHOR,d.ag,ST_LABEL[DS.status(d)]]))].join('\n'));
  const vb=$('#vBtn');if(vb)vb.onclick=()=>{const v=$('.media-frame video');if(!v)return;if(v.paused){v.play();vb.innerHTML=ic('pause')}else{v.pause();vb.innerHTML=ic('play')}};
  $$('#gal figure').forEach(f=>f.onclick=()=>lightbox($$('#gal img').map(x=>[x.src,x.alt]),+f.dataset.i));
  shops.forEach((s,k)=>{const el=document.getElementById('qr'+k);if(el&&window.QRCode)new QRCode(el,{text:mapUrl(s),width:120,height:120,correctLevel:QRCode.CorrectLevel.M})});
  drawProductCharts(p);
  if((SET.res||{})[p.id]&&!p._loaded){p._loaded=1;DS.loadProduct(p).then(r=>{if(R.page==='product'&&R.pid===p.id&&r.state==='ok')$('#vsBody').innerHTML=vsBody2(p)})}
};
function drawProductCharts(p){
  const pa=p.pa,soft=isDark()?'rgba(255,255,255,.18)':'rgba(20,40,30,.16)',gold=css('--gold'),cur=p.m[S.y],prev=p.m[S.y-1];
  mk('cMonth',{type:'bar',data:{labels:MO(),datasets:[{type:'bar',label:String(yCE(S.y)),data:cur,backgroundColor:cur.map((_,k)=>S.mode==='M'&&k!==S.m-1?hexMix(pa,.55):pa),borderRadius:6,maxBarThickness:28,order:2},
    ...(prev?[{type:'line',label:String(yCE(S.y-1)),data:prev,borderColor:gold,backgroundColor:gold,borderWidth:2,pointRadius:2.5,tension:.35,order:1}]:[])]},options:baseOpts()});
  const ys=S.mode==='Y'?YEARS.filter(y=>y<=S.y):YEARS.filter(y=>p.m[y]&&p.m[y][S.m-1]!=null);
  mk('cYear',{type:'bar',data:{labels:ys.map(y=>S.mode==='Y'?(y===LAST.y?yCE(y)+L(' (9 ด.)',' (9 mo)'):''+yCE(y)):MO()[S.m-1]+' '+yCE(y)),datasets:[{label:L('มูลค่า','Value'),data:ys.map(y=>S.mode==='Y'?sum(p.m[y]):p.m[y][S.m-1]),backgroundColor:ys.map(y=>y===S.y?pa:hexMix(pa,.6)),borderRadius:8,maxBarThickness:56}]},options:baseOpts({plugins:{legend:{display:false},tooltip:{callbacks:{label:c=>' '+fB(c.raw)}}}})});
  const tot=periodVal(p,S.y),ds=sum(p.dist),DN=EN_MODE()?DISTRICTS_EN:DISTRICTS.map(d=>d.replace('หนองบัวลำภู',''));
  const order=DN.map((d,i)=>({d,v:tot*p.dist[i]/ds})).sort((a,b)=>b.v-a.v);
  mk('cDist',{type:'bar',data:{labels:order.map(o=>o.d),datasets:[{label:L('มูลค่า','Value'),data:order.map(o=>o.v),backgroundColor:order.map((_,i)=>i===0?pa:hexMix(pa,.25+i*.1)),borderRadius:5,maxBarThickness:18}]},
    options:baseOpts({indexAxis:'y',plugins:{legend:{display:false},tooltip:{callbacks:{label:c=>' '+fB(c.raw)+' ('+(c.raw/tot*100).toFixed(0)+'%)'}}},scales:{x:{grid:{color:css('--line')},ticks:{color:css('--muted'),callback:v=>fShort(v),font:{family:'Kanit',size:10}},border:{display:false}},y:{grid:{display:false},ticks:{color:css('--ink'),font:{family:'Kanit',size:12}},border:{display:false}}}})});
  const cs=sum(p.ch),CH=EN_MODE()?['Shop / community','Wholesale','Online','Fairs & souvenirs','Out of province / export']:CHANNELS;
  mk('cCh',{type:'doughnut',data:{labels:CH,datasets:[{data:p.ch.map(v=>v/cs*100),backgroundColor:[pa,hexMix(pa,.3),gold,hexMix(pa,.6),soft],borderColor:css('--surface'),borderWidth:2}]},
    options:{responsive:true,maintainAspectRatio:false,cutout:'62%',plugins:{legend:{position:'right',labels:{color:css('--muted'),font:{family:'Kanit',size:11},boxWidth:10,usePointStyle:true}},tooltip:{callbacks:{label:c=>' '+c.label+': '+c.raw.toFixed(0)+'%'}}}}});
}

/* ================= วิเคราะห์เชิงกลยุทธ์ ================= */
PAGE_R.insights=page=>{
  const rows=P.map(p=>{const c=periodVal(p,S.y),q=periodVal(p,S.y-1);return{p,c,g:q?c/q-1:0}});
  const med=a=>{const s=[...a].sort((x,y)=>x-y);return s[Math.floor(s.length/2)]};
  const mg=med(rows.map(r=>r.g)),mv=med(rows.map(r=>r.c));
  const quad=r=>r.c>=mv?(r.g>=mg?0:1):(r.g>=mg?2:3);
  const Q=[{t:'ดาวเด่น',e:'Stars',d:'มูลค่าสูง เติบโตเร็ว · รักษาโมเมนตัม ขยายตลาดใหม่',de:'High value, fast growth · keep momentum, open new markets',c:'#1E8A52'},
    {t:'ทำรายได้หลัก',e:'Cash earners',d:'มูลค่าสูง เติบโตช้า · ยกระดับมาตรฐาน เพิ่มมูลค่าแปรรูป',de:'High value, slow growth · lift standards and processing',c:'#B1832A'},
    {t:'ดาวรุ่ง',e:'Rising stars',d:'มูลค่ายังน้อย เติบโตเร็ว · ลงทุนสร้างแบรนด์ ช่องทางออนไลน์',de:'Smaller value, fast growth · invest in brand and online channels',c:'#22789B'},
    {t:'ต้องเร่งพัฒนา',e:'Needs a push',d:'มูลค่าน้อย เติบโตช้า · หาจุดขายใหม่ จับคู่ผู้ซื้อ',de:'Smaller value, slow growth · new selling points, buyer matching',c:'#C2386F'}];
  const vaR=[...P].filter(p=>VA[p.id]).sort((a,b)=>vaMult(b)-vaMult(a));
  page.innerHTML=`
  <div class="ph-title"><div><span class="eyebrow">Strategic insights · ${periodLabel()}</span><h1>${PT('insights')}</h1><p>${L('จัดกลุ่มสินค้าตามมูลค่าและการเติบโต ดูมูลค่าเพิ่มจากการแปรรูป และปฏิทินของดีทั้งปี เพื่อวางแผนส่งเสริมให้ตรงจุด','Group products by value and growth, see the value added by processing, and plan promotions with the seasonal calendar.')}</p></div></div>
  <section class="card"><div class="card-h"><h3><span class="sec-no">1</span>${L('แผนภาพจัดกลุ่มสินค้า','Product portfolio matrix')}</h3><span class="note">${L('แกนนอน = การเติบโต · แกนตั้ง = มูลค่า (สเกลลอการิทึม) · ขนาดวง = จำนวนผู้ผลิต','x = growth · y = value (log) · size = producers')}</span></div>
    <div class="grid-2"><div class="chart-box" style="height:460px"><canvas id="qChart"></canvas></div>
    <div class="qleg">${Q.map((q,k)=>`<div class="q" style="--qc:${q.c}"><b>${L(q.t,q.e)}</b><span>${L(q.d,q.de)}</span><div class="qp">${rows.filter(r=>quad(r)===k).map(r=>`<a href="${pFile(r.p.id)}">${badge(r.p,{label:false})}${esc(pname(r.p))}</a>`).join('')||'<span class="note">–</span>'}</div></div>`).join('')}</div></div>
    <p class="note" style="margin:10px 0 0">${L('เส้นแบ่งใช้ค่ามัธยฐานของ 14 สินค้า · ตัวเลขจำลอง รอข้อมูลจริง','Dividers at the median of 14 products · simulated figures')}</p></section>
  <section class="card"><div class="card-h"><h3><span class="sec-no">2</span>${L('มูลค่าเพิ่มจากการแปรรูป','Value added by processing')}</h3><span class="note">${L('ราคาสินค้าพร้อมขาย ÷ ราคาวัตถุดิบ · ค่าจำลอง','Retail price ÷ raw price · simulated')}</span></div>
    <div class="grid-2"><div class="chart-box" style="height:420px"><canvas id="vaChart"></canvas></div><div style="display:grid;gap:10px;align-content:start"><p style="margin:0">${L('สินค้าที่แปรรูปแล้วราคาเพิ่มขึ้นหลายเท่า คือโอกาสสร้างรายได้ให้ชุมชน ','Products whose price multiplies after processing are the strongest income opportunities — ')}<b>${esc(pname(vaR[0]))}</b> ${L('เพิ่มมูลค่าได้สูงสุด','leads at')} ×${KX(vaMult(vaR[0]))}</p>${vaBlock(vaR[0],true)}<div class="row">${vaR.slice(1,6).map(p=>`<a class="chipx" href="${pFile(p.id)}">${esc(pname(p))} <b>×${KX(vaMult(p))}</b></a>`).join('')}</div></div></div></section>
  <section class="card" id="heat"><div class="card-h"><h3><span class="sec-no">3</span>${L('ปฏิทินของดีทั้งปี','Seasonal calendar')}</h3><span class="note">${L('สีเข้ม = ช่วงที่มีสินค้ามาก · กรอบ = เดือนนี้','Darker = more supply · outlined = this month')}</span></div>
    <div class="scroll-x"><table class="heat"><thead><tr><th>${L('สินค้า','Product')}</th>${MO().map((m,k)=>`<th class="${k+1===MON_NOW?'now':''}">${m}</th>`).join('')}</tr></thead><tbody>
    ${P.map(p=>{const mx=Math.max(...p.season);return`<tr><td><a href="${pFile(p.id)}">${pad2(p.id)} ${esc(pname(p))}</a></td>${p.season.map((w,k)=>`<td class="${k+1===MON_NOW?'now':''}"><i style="background:${p.pa};opacity:${(.08+.92*Math.pow(w/mx,1.6)).toFixed(2)}" title="${esc(pname(p))} · ${MOF()[k]}"></i></td>`).join('')}</tr>`}).join('')}</tbody></table></div></section>`;
  const pts=rows.map(r=>({x:r.g*100,y:r.c,r:Math.max(6,Math.sqrt(r.p.prodY[S.y])/3.2),p:r.p}));
  const labelPlugin={id:'lbl',afterDatasetsDraw(ch){const ctx=ch.ctx;ctx.save();ctx.font='12px Kanit, sans-serif';ctx.fillStyle=css('--ink');ctx.textBaseline='middle';
    ch.getDatasetMeta(0).data.forEach((el,k)=>{ctx.fillText(pname(pts[k].p),el.x+pts[k].r+4,el.y)});
    const xs=ch.scales.x,ys=ch.scales.y;ctx.strokeStyle=css('--muted');ctx.setLineDash([4,4]);ctx.globalAlpha=.5;ctx.beginPath();ctx.moveTo(xs.getPixelForValue(mg*100),ys.top);ctx.lineTo(xs.getPixelForValue(mg*100),ys.bottom);ctx.moveTo(xs.left,ys.getPixelForValue(mv));ctx.lineTo(xs.right,ys.getPixelForValue(mv));ctx.stroke();
    ctx.globalAlpha=.55;ctx.setLineDash([]);ctx.font='600 13px Kanit, sans-serif';ctx.fillStyle=Q[0].c;ctx.textAlign='right';ctx.fillText(L(Q[0].t,Q[0].e),xs.right-6,ys.top+12);ctx.fillStyle=Q[1].c;ctx.textAlign='left';ctx.fillText(L(Q[1].t,Q[1].e),xs.left+6,ys.top+12);
    ctx.fillStyle=Q[2].c;ctx.textAlign='right';ctx.fillText(L(Q[2].t,Q[2].e),xs.right-6,ys.bottom-12);ctx.fillStyle=Q[3].c;ctx.textAlign='left';ctx.fillText(L(Q[3].t,Q[3].e),xs.left+6,ys.bottom-12);ctx.restore()}};
  mk('qChart',{type:'bubble',data:{datasets:[{data:pts,backgroundColor:pts.map(d=>d.p.pa+'CC'),borderColor:pts.map(d=>d.p.pa),borderWidth:1.5}]},plugins:[labelPlugin],
    options:{responsive:true,maintainAspectRatio:false,layout:{padding:{right:70}},onClick:(e,els)=>{if(els[0])go(pFile(pts[els[0].index].p.id))},plugins:{legend:{display:false},tooltip:{callbacks:{label:c=>' '+pname(pts[c.dataIndex].p)+': '+fB(pts[c.dataIndex].y)+' · '+pct(pts[c.dataIndex].x/100)}}},
      scales:{x:{title:{display:true,text:L('การเติบโตเทียบปีก่อน (%)','Growth YoY (%)'),color:css('--muted'),font:{family:'Kanit'}},grid:{color:css('--line')},ticks:{color:css('--muted'),callback:v=>v+'%'}},y:{type:'logarithmic',title:{display:true,text:L('มูลค่าจำหน่าย','Sales value'),color:css('--muted'),font:{family:'Kanit'}},grid:{color:css('--line')},ticks:{color:css('--muted'),callback:v=>[1e6,1e7,1e8,1e9].includes(v)?fShort(v):''}}}}});
  mk('vaChart',{type:'bar',data:{labels:vaR.map(p=>pname(p)),datasets:[{label:'×',data:vaR.map(vaMult),backgroundColor:vaR.map(p=>p.pa),borderRadius:5,maxBarThickness:18}]},
    options:baseOpts({indexAxis:'y',onClick:(e,els)=>{if(els[0])go(pFile(vaR[els[0].index].id))},plugins:{legend:{display:false},tooltip:{callbacks:{label:c=>' ×'+KX(c.raw)}}},scales:{x:{type:'logarithmic',grid:{color:css('--line')},border:{display:false},ticks:{color:css('--muted'),callback:v=>[1,2,5,10,20,50,100].includes(v)?'×'+v:''}},y:{grid:{display:false},border:{display:false},ticks:{color:css('--ink'),font:{family:'Kanit',size:12}}}}})});
};

/* ================= แผนที่แหล่งผลิต ================= */
function mapSVG(vals,sel){
  const F=NBL_GEO.features;let x0=999,x1=-999,y0=999,y1=-999;
  const each=(g,f)=>{const polys=g.type==='Polygon'?[g.coordinates]:g.coordinates;polys.forEach(pl=>pl.forEach(r=>r.forEach(f)))};
  F.forEach(ft=>each(ft.geometry,([x,y])=>{x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y)}));
  const k=Math.cos((y0+y1)/2*Math.PI/180),W=600,sc=W/((x1-x0)*k),H=(y1-y0)*sc;
  const pr=([x,y])=>[(x-x0)*k*sc,(y1-y)*sc];
  const mx=Math.max(...vals);const pa=sel?sel.pa:'#0F4A37';
  const out=F.map(ft=>{const i=DISTRICTS.indexOf(ft.properties.th);const polys=ft.geometry.type==='Polygon'?[ft.geometry.coordinates]:ft.geometry.coordinates;
    const d=polys.map(pl=>pl.map(r=>'M'+r.map(c=>pr(c).map(n=>n.toFixed(1)).join(',')).join('L')+'Z').join('')).join('');
    const big=polys.map(pl=>pl[0]).sort((a,b)=>b.length-a.length)[0];const cx=big.reduce((s,c)=>s+pr(c)[0],0)/big.length,cy=big.reduce((s,c)=>s+pr(c)[1],0)/big.length;
    const t=vals[i]/mx;return{i,d,cx,cy,t}});
  return`<svg viewBox="-10 -10 ${W+20} ${H+20}" class="nblmap" role="img" aria-label="${L('แผนที่ 6 อำเภอ จังหวัดหนองบัวลำภู','Map of 6 districts')}">
    ${out.map(o=>`<path d="${o.d}" data-d="${o.i}" fill="${pa}" fill-opacity="${(.12+.78*o.t).toFixed(2)}" stroke="var(--surface)" stroke-width="2"/>`).join('')}
    ${out.map(o=>`<g class="lbl" transform="translate(${o.cx.toFixed(0)} ${o.cy.toFixed(0)})"><text text-anchor="middle" y="-4" class="dn">${esc(L(DISTRICTS[o.i].replace('เมืองหนองบัวลำภู','เมืองฯ'),DISTRICTS_EN[o.i]))}</text><text text-anchor="middle" y="14" class="dv">${fShort(vals[o.i])}</text></g>`).join('')}</svg>`;
}
PAGE_R.map=page=>{
  let sel=+(R.q&&R.q.get('p'))||0,di=store.sget('nbl12-mapd',3);
  const draw=()=>{
    const p=sel?byId(sel):null;const L0=p?[p]:P;
    const vals=DISTRICTS.map((_,i)=>sum(L0.map(x=>distVal(x,i))));const tot=sum(vals);
    const top=P.map(x=>({p:x,v:distVal(x,di)})).sort((a,b)=>b.v-a.v);const tv=sum(top.map(t=>t.v));
    page.style.setProperty('--pa',p?p.pa:'#0F4A37');
    page.innerHTML=`
    <div class="ph-title"><div><span class="eyebrow">Production map · ${periodLabel()}</span><h1>${PT('map')}</h1><p>${L('มูลค่าการจำหน่ายแยกตามอำเภอ เลือกสินค้าเพื่อดูแหล่งผลิต หรือแตะอำเภอเพื่อดูสินค้าเด่น','Sales value by district. Pick a product to see where it is made, or tap a district to see its leading products.')}</p></div></div>
    <div class="mchips"><button type="button" data-s="0" aria-pressed="${!sel}">${L('ทั้ง 14 สินค้า','All 14 products')}</button>${P.map(x=>`<button type="button" data-s="${x.id}" aria-pressed="${sel===x.id}" style="--c:${x.pa}">${badge(x,{label:false})}${esc(pname(x))}</button>`).join('')}</div>
    <div class="grid-2">
      <section class="card map-card"><div class="card-h"><h3>${p?esc(pname(p)):L('มูลค่ารวม 14 สินค้า','Total of 14 products')}</h3><span class="note">${fB(tot)}</span></div>${mapSVG(vals,p)}
        <div class="mleg"><span>${L('น้อย','Low')}</span><i style="background:linear-gradient(90deg,color-mix(in srgb,var(--pa) 14%,transparent),var(--pa))"></i><span>${L('มาก','High')}</span></div></section>
      <section class="card"><div class="card-h"><h3>${ic('map')} ${esc(L(DISTRICTS[di],'Amphoe '+DISTRICTS_EN[di]))}</h3><span class="note">${L('สัดส่วน','Share')} ${(vals[di]/tot*100).toFixed(1)}%</span></div>
        <div class="kpis" style="grid-template-columns:1fr 1fr;margin-bottom:14px">${kpi(L('มูลค่าในอำเภอ','Value in district'),fmtBaht(vals[di]).n,fmtBaht(vals[di]).u,p?esc(pname(p)):L('รวม 14 สินค้า','All products'),'',pill('sim'))}${kpi(L('สินค้าเด่นอันดับ 1','Top product'),esc(pname(top[0].p)),'',fB(top[0].v),'',top[0].p.gi?'<span class="gi">GI</span>':'')}</div>
        <h4 style="font-family:var(--f-head);font-size:14px;margin:0 0 8px">${L('สินค้าเด่นของอำเภอ (ไม่รวมอ้อย)','Leading products (excl. sugarcane)')}</h4>
        <div class="dlist">${top.filter(t=>t.p.id!==2).slice(0,8).map(t=>`<a href="${pFile(t.p.id)}"><span>${badge(t.p,{label:false})}${esc(pname(t.p))}</span><i style="width:${t.v/top.filter(x=>x.p.id!==2)[0].v*100}%;background:${t.p.pa}"></i><b class="num">${fShort(t.v)}</b></a>`).join('')}</div></section>
    </div>
    <section class="card"><div class="card-h"><h3>${L('ตารางรายอำเภอ','District table')}</h3><span class="note">${L('ค่าจำลองจากสัดส่วนแหล่งผลิต รอข้อมูลรายอำเภอจริง','Simulated from production shares')}</span></div>
      <div class="scroll-x"><table class="t"><thead><tr><th>${L('อำเภอ','District')}</th><th class="r">${p?esc(pname(p)):L('มูลค่ารวม','Total')}</th><th class="r">%</th><th>${L('สินค้าเด่น 3 อันดับ (ไม่รวมอ้อย)','Top 3 (excl. sugarcane)')}</th></tr></thead><tbody>
      ${DISTRICTS.map((d,i)=>{const t3=P.filter(x=>x.id!==2).map(x=>({x,v:distVal(x,i)})).sort((a,b)=>b.v-a.v).slice(0,3);return`<tr${i===di?' style="background:var(--surface-3)"':''}><td><button class="linkb" type="button" data-di="${i}">${esc(L(d,DISTRICTS_EN[i]))}</button></td><td class="r num">${fB(vals[i])}</td><td class="r num">${(vals[i]/tot*100).toFixed(1)}</td><td>${t3.map(t=>esc(pname(t.x))).join(' · ')}</td></tr>`}).join('')}</tbody></table></div></section>`;
    $$('[data-s]',page).forEach(b=>b.onclick=()=>{sel=+b.dataset.s;draw()});
    $$('.nblmap path,[data-di]',page).forEach(el=>el.addEventListener('click',()=>{di=+(el.dataset.d??el.dataset.di);store.sset('nbl12-mapd',di);draw()}));
    $$('.nblmap path',page).forEach(el=>{if(+el.dataset.d===di)el.classList.add('on')});
  };
  draw();
};

/* ================= สรุป 1 หน้า A4 ================= */
PAGE_R.brief=page=>{
  let pid=+(R.q&&R.q.get('p'))||store.sget('nbl12-brief',1);if(!byId(pid))pid=1;
  const p=byId(pid);store.sset('nbl12-brief',pid);page.style.setProperty('--pa',p.pa);
  const cur=periodVal(p,S.y),pre=periodVal(p,S.y-1),R0=p.ready.reduce((a,r)=>({n:a.n+r.n,ok:a.ok+r.ok}),{n:0,ok:0});
  const top3=DISTRICTS.map((d,i)=>({d:L(d,DISTRICTS_EN[i]),v:distVal(p,i)})).sort((a,b)=>b.v-a.v).slice(0,3);
  const url=location.href.replace(/[^/]*$/,'')+pFile(p.id);
  page.innerHTML=`
  <div class="ph-title no-print"><div><span class="eyebrow">One-page brief</span><h1>${PT('brief')}</h1><p>${L('สรุปสินค้าแผ่นเดียว ขนาด A4 กดพิมพ์หรือบันทึกเป็น PDF แล้วส่งต่อได้ทันที','A single A4 summary — print or save as PDF to share.')}</p></div>
    <div class="row"><select class="sel" id="bSel" aria-label="${L('เลือกสินค้า','Choose product')}">${P.map(x=>`<option value="${x.id}"${x.id===pid?' selected':''}>${pad2(x.id)} ${esc(pname(x))}</option>`).join('')}</select><button class="btn btn-o" type="button" data-act="link">${ic('link')} ${L('คัดลอกลิงก์','Copy link')}</button><button class="btn btn-f" type="button" data-act="print">${ic('print')} ${L('พิมพ์ / บันทึก PDF','Print / PDF')}</button></div></div>
  <article class="a4">
    <header class="a4-h"><img src="img/seal.png" alt=""><div><b>12 Plus<sup>+</sup> · ${L('สินค้าอัตลักษณ์หนองบัวลำภู','Nong Bua Lam Phu identity products')}</b><span>${L('สรุปข้อมูลสินค้า · ','Product brief · ')}${periodLabel()}</span></div><span class="a4-no">No.${pad2(p.id)}</span></header>
    <div class="a4-t">${badge(p)}<div><h2>${esc(pname(p))} ${p.gi?'<span class="gi lg">GI</span>':''}</h2><span class="en">${esc(EN_MODE()?p.name:p.en)}</span><p>${esc(pen(p,'t',p.tagline))}</p></div></div>
    <div class="a4-img" style="background-image:url(${IMG('kv',p.id)})"></div>
    <div class="a4-k">
      <div><span>${L('มูลค่าจำหน่าย','Sales value')}</span><b>${fmtBaht(cur).n}</b><small>${fmtBaht(cur).u} · ${pre?pct(cur/pre-1):''}</small></div>
      <div><span>${L('ราคาเฉลี่ย','Avg price')}</span><b>${nf.format(Math.round(p.priceY[S.y]))}</b><small>${esc(pen(p,'priceU',p.priceU))}</small></div>
      <div><span>${esc(pen(p,'prodL',p.prodL))}</span><b>${nf.format(p.prodY[S.y])}</b><small>${L('ราย','people')}</small></div>
      <div><span>${L('มูลค่าเพิ่มแปรรูป','Value added')}</span><b>×${KX(vaMult(p))}</b><small>${L('วัตถุดิบ → พร้อมขาย','raw → retail')}</small></div>
    </div>
    <div class="a4-g">
      <div><h4>${L('มูลค่ารายเดือน','Monthly value')} ${yCE(S.y)}</h4><div style="height:150px;position:relative"><canvas id="bChart"></canvas></div>
        <h4>${L('มูลค่าเพิ่มจากการแปรรูป','Value added by processing')}</h4>${vaBlock(p,true)}</div>
      <div><h4>${L('จุดขาย','Selling points')}</h4><ul class="a4-l">${pen(p,'hl',p.hl).map(h=>`<li>${esc(h)}</li>`).join('')}</ul>
        <h4>${L('ฤดูกาล','Season')}</h4><div class="season sm">${p.season.map((w,k)=>{const mx=Math.max(...p.season);return`<div><i style="opacity:${(.15+.85*w/mx).toFixed(2)}"></i>${MO()[k].replace('.','').slice(0,3)}</div>`}).join('')}</div>
        <h4>${L('แหล่งผลิตหลัก','Main districts')}</h4><ol class="a4-l">${top3.map(t=>`<li>${esc(t.d)} · ${fShort(t.v)}</li>`).join('')}</ol>
        <h4>${L('ความพร้อมข้อมูล','Data readiness')}</h4><p class="note" style="margin:0">${R0.ok}/${R0.n} ${L('รายการ','items')} · ${esc(p.agency)}</p></div>
    </div>
    <footer class="a4-f"><div><b>${L('แหล่งที่มา','Source')}:</b> ${esc(p.agency)} · ${APP.survey}<br>${L('ตัวเลขบางรายการเป็นค่าจำลอง รอข้อมูลจริงจากหน่วยงาน','Some figures are simulated pending agency data')} · © 2569 ${L('สำนักงานสถิติจังหวัดหนองบัวลำภู','Nong Bua Lam Phu Provincial Statistical Office')}</div><div class="qr" id="bQr"></div></footer>
  </article>`;
  $('#bSel').onchange=e=>go({page:'brief',q:new URLSearchParams('p='+e.target.value)});
  if(window.QRCode)new QRCode($('#bQr'),{text:url,width:110,height:110,correctLevel:QRCode.CorrectLevel.M});
  mk('bChart',{type:'bar',data:{labels:MO(),datasets:[{label:String(yCE(S.y)),data:p.m[S.y],backgroundColor:p.pa,borderRadius:3},{type:'line',label:String(yCE(S.y-1)),data:p.m[S.y-1],borderColor:css('--gold'),borderWidth:1.5,pointRadius:0,tension:.35}]},options:baseOpts({animation:false,plugins:{legend:{display:false}},scales:{x:{grid:{display:false},ticks:{font:{size:9},color:css('--muted')}},y:{grid:{color:css('--line')},ticks:{font:{size:9},color:css('--muted'),callback:v=>fShort(v)},border:{display:false}}}})});
};
