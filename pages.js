/* =====================================================================
   12 Plus+ · pages.js — ตัวแสดงผลแต่ละหน้า
   ===================================================================== */
const PAGE_R={};
const GNAME=id=>GROUPS.find(g=>g.id===id)?.name||'';
const totalItems=()=>sum(P.map(p=>p.inds.length));
const readyAll=()=>P.reduce((a,p)=>{p.ready.forEach(r=>{a.n+=r.n;a.ok+=r.ok;a.real+=r.real});return a},{n:0,ok:0,real:0});
const kpi=(l,v,u,d,dcls,src)=>`<div class="kpi"><span class="l">${l}</span><span class="v">${v}<small>${u||''}</small></span><span class="d ${dcls||''}">${d||''}</span><span class="src">${src||''}</span></div>`;
const grTxt=(c,q)=>q?`${c>=q?'▲':'▼'} ${pct(c/q-1)} เทียบ${prevLabel()}`:'ไม่มีข้อมูลเปรียบเทียบ';

/* ================= หน้าหลัก (ปก) ================= */
PAGE_R.cover=page=>{
  const tot=sum(P.map(p=>periodVal(p,S.y))),prod=sum(P.map(p=>p.prodY[S.y])),R0=readyAll();
  const chip=p=>`<a href="${pFile(p.id)}">${badge(p,{label:false})}${pad2(p.id)} · ${esc(p.name)}</a>`;
  page.innerHTML=`
  <section class="cv">
    <div class="bg" role="img" aria-label="สินค้าอัตลักษณ์ 14 รายการของจังหวัดหนองบัวลำภู"></div>
    <div class="cv-top"><img src="img/seal.png" alt="ตราจังหวัดหนองบัวลำภู"><span class="org"><b>จังหวัดหนองบัวลำภู</b><span>Nong Bua Lam Phu Province</span></span><span class="x">×</span><img class="gd" src="img/gd-catalog.png" alt="ระบบบัญชีข้อมูลจังหวัด"><span class="sp"></span>
      <a class="btn btn-o" href="apistatus.html" style="background:rgba(255,255,255,.7);color:#10211A;border-color:rgba(20,35,28,.15)">${ic('db')} สถานะข้อมูล</a></div>
    <div class="cv-main">
      <span class="eyebrow" style="color:#8A6420">Dashboard เกษตรมูลค่าสูง</span>
      <div class="wm">12 Plus<sup>+</sup></div>
      <h1>สินค้าอัตลักษณ์หนองบัวลำภู<br>จากแผ่นดินลุ่มภู สู่ตลาดทั่วโลก</h1>
      <p>ติดตามการผลิตและการขายของดี 14 รายการของจังหวัด ตั้งแต่แหล่งผลิต การแปรรูป ไปจนถึงมือผู้ซื้อ พร้อมแหล่งที่มาของข้อมูลทุกตัวเลข</p>
      <div class="cv-stats"><div><b>14</b><span>สินค้าอัตลักษณ์</span></div><div><b>${fmtBaht(tot).n}</b><span>${fmtBaht(tot).u} · ${periodLabel()}</span></div><div><b>${nf.format(prod)}</b><span>เกษตรกรและผู้ผลิต</span></div><div><b>${R0.ok}/${R0.n}</b><span>รายการข้อมูลที่หน่วยงานมี</span></div></div>
      <div class="cta"><a class="btn btn-f" href="overview.html" style="padding:12px 22px;font-size:15px">เข้าสู่แดชบอร์ด ${ic('arrowR')}</a><a class="btn btn-o" href="${pFile(1)}" style="background:rgba(255,255,255,.7);color:#10211A;border-color:rgba(20,35,28,.15)">${ic('play')} เริ่มชมสินค้าชิ้นแรก</a></div>
    </div>
    <div class="marq" aria-label="สินค้าอัตลักษณ์ทั้ง 14 รายการ"><div class="marq-in">${P.map(chip).join('')}${P.map(chip).join('')}</div></div>
  </section>
  <section class="cv-sec">
    <div class="ph-title"><div><span class="eyebrow">เลือกชมสินค้า</span><h1>ของดี 14 อย่าง เรียงตามแบบสำรวจรายการข้อมูล</h1></div><a class="btn btn-o" href="overview.html">ดูภาพรวมทั้งหมด ${ic('arrowR')}</a></div>
    <div class="tiles">${P.map(tile).join('')}</div>
  </section>
  <section class="cv-sec" style="padding-top:0">
    <div class="qlinks">
      <a class="ql" href="overview.html">${ic('grid')}<b>ภาพรวม 14 สินค้า</b><span>มูลค่า การเติบโต และความพร้อมข้อมูล</span></a>
      <a class="ql" href="report.html">${ic('report')}<b>รายงานและบทวิเคราะห์</b><span>สรุปผู้บริหาร ตารางตัวชี้วัด และข้อมูลที่ต้องเติม</span></a>
      <a class="ql" href="sources.html">${ic('source')}<b>แหล่งข้อมูลและที่มา</b><span>ทะเบียนรายการข้อมูลและหน่วยงานเจ้าของ</span></a>
      <a class="ql" href="apistatus.html">${ic('api')}<b>สถานะการเชื่อมต่อ</b><span>ตัวเลขไหนมาจาก API และสดแค่ไหน</span></a>
      <a class="ql" href="entry.html">${ic('lock')}<b>กรอกข้อมูล</b><span>สำหรับหน่วยงานเจ้าของข้อมูล</span></a>
    </div>
    <div class="live-bn"><span class="lg"><img src="img/seal.png" alt=""><span style="color:#8A6420;font-family:var(--f-latin)">×</span><img src="img/gd-catalog.png" alt=""></span><span><b>เชื่อมต่อระบบบัญชีข้อมูลจังหวัด (GD Catalog)</b><span>รอข้อมูลเข้าระบบ · เมื่อหน่วยงานนำข้อมูลขึ้นระบบ ตัวเลขบนแดชบอร์ดจะอัปเดตอัตโนมัติ</span></span><a class="btn" href="apistatus.html" style="background:#fff;color:#0F4A37">ดูสถานะ ${ic('arrowR')}</a></div>
  </section>`;
};
function tile(p){const c=periodVal(p,S.y),q=periodVal(p,S.y-1),g=q?c/q-1:null;
  return`<a class="tile" href="${pFile(p.id)}"><div class="ph" style="background-image:url(${IMG('kv',p.id)})"></div>${badge(p,{label:false})}<span class="no">${pad2(p.id)}</span>
  <span class="tx"><b>${esc(p.name)}</b><span>${fB(c)} ${g==null?'':`<em style="font-style:normal;color:${g>=0?'#7BE0A6':'#FFA597'}">${g>=0?'▲':'▼'}${Math.abs(g*100).toFixed(1)}%</em>`}</span></span></a>`}

/* ================= ภาพรวม ================= */
PAGE_R.overview=page=>{
  const tot=sum(P.map(p=>periodVal(p,S.y))),pre=sum(P.map(p=>periodVal(p,S.y-1)||0)),prod=sum(P.map(p=>p.prodY[S.y])),R0=readyAll();
  const ex=tot-periodVal(byId(2),S.y),exp=pre-(periodVal(byId(2),S.y-1)||0);
  page.innerHTML=`
  <section class="ov-hero"><div class="bg"></div><div class="ov-txt">
    <span class="eyebrow">ภาพรวม · ${periodLabel()}</span>
    <h1>ของดี <em>14 อย่าง</em><br>จากแผ่นดินหนองบัวลำภู</h1>
    <p>มูลค่าการจำหน่าย การเติบโต และความพร้อมของข้อมูลทุกสินค้าในหน้าเดียว แตะการ์ดสินค้าเพื่อดูเรื่องราว ตัวเลข และแหล่งซื้อ</p>
    <div class="cta"><a class="btn btn-f" href="${pFile(1)}">เริ่มชมสินค้าชิ้นแรก ${ic('arrowR')}</a><button class="btn btn-o" type="button" data-act="present" style="background:rgba(255,255,255,.7);color:#10211A">${ic('play')} นำเสนอเต็มจอ</button></div></div></section>
  <div class="kpis">
    ${kpi('มูลค่าจำหน่ายรวม 14 สินค้า',fmtBaht(tot).n,fmtBaht(tot).u,grTxt(tot,pre),tot>=pre?'pos':'neg',pill('sim'))}
    ${kpi('มูลค่ารวม ไม่รวมอ้อย',fmtBaht(ex).n,fmtBaht(ex).u,grTxt(ex,exp),ex>=exp?'pos':'neg','ดูสินค้าชุมชนโดยไม่ถูกอ้อยกลบ')}
    ${kpi('เกษตรกร ช่างทอ และผู้ผลิต',nf.format(prod),'ราย','รวม 14 สินค้า · ปี '+S.y,'',pill('sim'))}
    ${kpi('รายการข้อมูลที่หน่วยงานมี',R0.ok,'/ '+R0.n,'ส่งค่าจริงแล้ว '+R0.real+' รายการ','',pill('real')+' จากแบบสำรวจ')}
  </div>
  <section><div class="card-h"><h3 style="font-size:18px">สินค้าอัตลักษณ์ 14 รายการ</h3><span class="note">เรียงตามแบบสำรวจรายการข้อมูล · แตะเพื่อดูรายละเอียด</span></div><div class="tiles">${P.map(tile).join('')}</div></section>
  <div class="grid-2">
    <div class="card"><div class="card-h"><h3>มูลค่ารวมรายเดือน</h3><span class="note">ปี ${S.y} เทียบ ${S.y-1}</span></div><div class="chart-box"><canvas id="oMonth"></canvas></div></div>
    <div class="card"><div class="card-h"><h3>อันดับมูลค่า (ไม่รวมอ้อย)</h3><span class="note">${periodLabel()}</span></div><div class="chart-box" style="height:330px"><canvas id="oRank"></canvas></div></div>
  </div>
  <section class="card"><div class="card-h"><h3>ความพร้อมข้อมูลรายสินค้า</h3><span class="note">รายการที่หน่วยงานแจ้งว่ามีข้อมูล / รายการทั้งหมด</span></div>
    <div class="scroll-x"><table class="t"><thead><tr><th>สินค้า</th><th>หน่วยงานหลัก</th>${CHAPTERS.map(c=>`<th class="r">${c.t}</th>`).join('')}<th class="r">ส่งค่าจริง</th></tr></thead>
    <tbody>${P.map(p=>`<tr><td><a href="${pFile(p.id)}" style="font-family:var(--f-head)">${pad2(p.id)} ${esc(p.name)}</a></td><td style="color:var(--muted)">${esc(p.agency)}</td>${p.ready.map(r=>{const x=r.ok/r.n;return`<td class="r"><span class="cell num" style="background:${x?`color-mix(in srgb,var(--good) ${Math.round(15+x*70)}%,var(--surface))`:'var(--surface-3)'};color:${x>.6?'#fff':'var(--ink)'}">${r.ok}/${r.n}</span></td>`}).join('')}<td class="r num">${sum(p.ready.map(r=>r.real))||'–'}</td></tr>`).join('')}</tbody></table></div></section>`;
  const ms=S.y===LAST.y?LAST.m:12;
  mk('oMonth',{type:'bar',data:{labels:MONTHS,datasets:[{type:'bar',label:'ปี '+S.y,data:MONTHS.map((_,k)=>k>=ms?null:sum(P.map(p=>p.m[S.y][k]))),backgroundColor:css('--forest')||'#0F4A37',borderRadius:6,maxBarThickness:28,order:2},
    {type:'line',label:'ปี '+(S.y-1),data:MONTHS.map((_,k)=>sum(P.map(p=>p.m[S.y-1]?.[k]))),borderColor:css('--gold'),backgroundColor:css('--gold'),borderWidth:2,pointRadius:2.5,tension:.35,order:1}]},options:baseOpts()});
  const rk=[...P].filter(p=>p.id!==2).sort((a,b)=>periodVal(b,S.y)-periodVal(a,S.y));
  mk('oRank',{type:'bar',data:{labels:rk.map(p=>p.name),datasets:[{label:'มูลค่า',data:rk.map(p=>periodVal(p,S.y)),backgroundColor:rk.map(p=>p.pa),borderRadius:5,maxBarThickness:18}]},
    options:baseOpts({indexAxis:'y',onClick:(e,els)=>{if(els[0])go(pFile(rk[els[0].index].id))},plugins:{legend:{display:false},tooltip:{callbacks:{label:c=>' '+fB(c.raw)}}},scales:{x:{grid:{color:css('--line')},border:{display:false},ticks:{color:css('--muted'),callback:v=>fShort(v),font:{family:'Kanit',size:10}}},y:{grid:{display:false},border:{display:false},ticks:{color:css('--ink'),font:{family:'Kanit',size:12}}}}})});
};

/* ================= หน้าสินค้า ================= */
function vizOf(d,p){
  const v=d.val;
  switch(d.vt){
  case'money':{if(d.src==='real'||!d.hist)return`<div class="note">มูลค่าปี ${ANCHOR}</div>`;const ys=[2566,2567,2568],vals=ys.map(y=>d.hist[y]),mx=Math.max(...vals),mn=Math.min(...vals)*.9;
    const pt=vals.map((x,i)=>[i*100,40-((x-mn)/(mx-mn||1))*34]);const path=pt.map((q,i)=>(i?'L':'M')+q[0]+' '+q[1]).join(' ');const g=vals[2]/vals[1]-1;
    return`<svg viewBox="-4 0 208 46" preserveAspectRatio="none"><path d="${path} L200 46 L0 46Z" fill="var(--pa)" opacity=".12"/><path d="${path}" fill="none" stroke="var(--pa)" stroke-width="2.4" vector-effect="non-scaling-stroke"/>${pt.map((q,i)=>`<circle cx="${q[0]}" cy="${q[1]}" r="${i===2?4:2.6}" fill="${i===2?'var(--pa)':'var(--surface)'}" stroke="var(--pa)" stroke-width="2" vector-effect="non-scaling-stroke"/>`).join('')}</svg><span class="note" style="margin-left:8px;white-space:nowrap">${g>=0?'▲':'▼'} ${pct(g)}</span>`}
  case'price':{const mn=v*.8,mx=v*1.25,pos=(v-mn)/(mx-mn)*100;return`<div class="rng"><div class="bar"></div><i class="mk" style="left:${pos}%"></i><span style="left:0">${nf.format(Math.round(mn))}</span><span style="right:0">${nf.format(Math.round(mx))} บาท</span></div>`}
  case'area':{const pit=v/4.46;const per=pit<=30?1:Math.ceil(pit/30);const n=Math.max(1,Math.round(pit/per));return`<div style="display:grid;gap:4px;width:100%"><div class="fields">${'<i></i>'.repeat(Math.min(n,30))}</div><span class="note">≈ ${nf.format(Math.round(pit))} สนามฟุตบอล${per>1?` · 1 ช่อง = ${per} สนาม`:''}</span></div>`}
  case'people':{const per=Math.max(1,Math.ceil(v/50));const f=Math.min(50,Math.round(v/per));return`<div style="display:grid;gap:4px;width:100%"><div class="dots">${Array.from({length:50},(_,i)=>`<i${i<f?'':' class="o"'}></i>`).join('')}</div><span class="note">1 จุด = ${nf.format(per)} ${d.u}</span></div>`}
  case'qty':{if(d.src==='real'||!d.hist)return`<div class="note">ปริมาณปี ${ANCHOR}</div>`;const a=d.hist[2567],b=v,mx=Math.max(a,b);return`<div class="cmp"><div><span>2567</span><b style="width:${a/mx*100}%"></b></div><div><span>2568</span><b style="width:${b/mx*100}%"></b></div></div>`}
  case'count':{const n=Math.min(v,24);return`<div class="pips">${Array.from({length:n},()=>'<i></i>').join('')}${v>24?`<span class="note">+${nf.format(v-24)}</span>`:''}</div>`}
  case'district':{const mx=Math.max(...d.byDist);return`<div class="dist">${DISTRICTS.map((x,i)=>({x,v:d.byDist[i]})).sort((a,b)=>b.v-a.v).map(o=>`<div><span>${o.x.replace('เมืองหนองบัวลำภู','เมือง')}</span><b style="width:${o.v/mx*100}%"></b><span class="num">${nf.format(o.v)}</span></div>`).join('')}</div>`}
  case'text':return`<span class="note">ระบุเป็นรายชื่อหน่วยงาน</span>`;
  default:return`<span class="note">รอหน่วยงานส่งข้อมูล</span>`;
  }
}
function valOf(d){if(d.val==null)return'<span style="color:var(--bad);font-size:20px">ยังไม่มีข้อมูล</span>';if(typeof d.val==='string')return`<span class="txtv">${esc(d.val)}</span>`;
  if(d.u==='บาท'){const o=fmtBaht(d.val);return`${o.n}<small>${o.u}</small>`}return`${nf.format(d.val)}<small>${esc(d.u)}</small>`}
function vcard(d,p,feat){const st=DS.status(d);
  return`<article class="vcard ${feat?'feat':''} ${d.vt==='none'?'none':''}" id="ind-${d.code}"><div class="vc-top"><code>${d.code}</code>${pill(st)}</div>
  <div class="vc-n">${esc(d.n)}</div><div class="vc-v">${valOf(d)}</div><div class="vc-viz">${vizOf(d,p)}</div>
  <div class="vc-f"><span title="${esc(d.ag)}">${esc(d.ag)}</span><span>${d.per||'ปี '+(d.apiYear||ANCHOR)}</span></div></article>`}
function ring(ok,n){const r=18,c=2*Math.PI*r,x=n?ok/n:0;return`<svg viewBox="0 0 46 46"><circle cx="23" cy="23" r="${r}" fill="none" stroke="var(--surface-3)" stroke-width="6"/><circle cx="23" cy="23" r="${r}" fill="none" stroke="var(--pa)" stroke-width="6" stroke-linecap="round" stroke-dasharray="${c*x} ${c}" transform="rotate(-90 23 23)"/><text x="23" y="27" text-anchor="middle" font-family="Kanit" font-size="11" fill="currentColor">${Math.round(x*100)}%</text></svg>`}
function vsBody(p){
  const view=store.get('nbl12-vsview','viz');
  if(view==='table')return`<div class="scroll-x"><table class="t"><thead><tr><th>รหัส</th><th>รายการข้อมูล</th><th class="r">ค่า</th><th>หน่วย</th><th>ปีข้อมูล</th><th>หน่วยงานเจ้าของข้อมูล</th><th>สถานะ</th></tr></thead><tbody>
    ${CHAPTERS.map(c=>`<tr class="grp"><td colspan="7">${pad2(c.k+1)} · ${c.t} <span style="font-weight:400;color:var(--muted)">— ${c.d}</span></td></tr>`+p.inds.filter(d=>d.s===c.k).map(d=>`<tr id="ind-${d.code}"><td><code>${d.code}</code></td><td>${esc(d.n)}</td><td class="r num">${d.val==null?'–':typeof d.val==='string'?esc(d.val):nf.format(d.val)}</td><td>${esc(d.u)}</td><td>${d.per||ANCHOR}</td><td>${esc(d.ag)}</td><td>${pill(DS.status(d))}</td></tr>`).join('')).join('')}</tbody></table></div>`;
  return CHAPTERS.map(c=>{const L=p.inds.filter(d=>d.s===c.k),r=p.ready[c.k];
    const fi=L.findIndex(d=>['money','qty','area','people'].includes(d.vt));
    return`<div class="chap"><div class="chap-h"><span class="chap-no">${pad2(c.k+1)}</span><div><h3>${c.t}<em>${c.en}</em></h3><p>${c.d} · ${L.length} รายการ</p></div><div class="ringw">${ring(r.ok,r.n)}<span>หน่วยงานมีข้อมูล<br>${r.ok} จาก ${r.n} รายการ</span></div></div>
    <div class="vgrid">${L.map((d,i)=>vcard(d,p,i===fi)).join('')}</div></div>`}).join('');
}
PAGE_R.product=(page,p)=>{
  const cur=periodVal(p,S.y),pre=periodVal(p,S.y-1),gr=pre?cur/pre-1:null;
  const price=S.mode==='M'?p.priceY[S.y]*(1+(p.season[S.m-1]-8)/-200):p.priceY[S.y],vol=cur/price;
  const isReal=p.real&&S.y===ANCHOR&&S.mode==='Y';const peakIdx=p.season.indexOf(Math.max(...p.season));
  const R0=p.ready.reduce((a,r)=>({n:a.n+r.n,ok:a.ok+r.ok,real:a.real+r.real}),{n:0,ok:0,real:0});
  const shops=SHOPS[p.id]||[];const ags=[...new Set(p.inds.map(d=>d.ag))];
  const i=P.indexOf(p),prv=P[(i+P.length-1)%P.length],nxt=P[(i+1)%P.length];
  const vid=SET.video&&!matchMedia('(prefers-reduced-motion: reduce)').matches;
  const api=DS.cache[p.id];
  page.innerHTML=`
  <section class="hero" aria-label="${esc(p.name)}">
    <div class="hero-bg" aria-hidden="true" style="background-image:url(${IMG('kv',p.id)})"></div>
    <div class="hero-txt"><span class="big-no" aria-hidden="true">${pad2(p.id)}</span>
      <div class="rank"><span class="chip-no">สินค้าอัตลักษณ์ ${pad2(p.id)}/14</span><span class="eyebrow">${GNAME(p.g)}</span></div>
      <h1>${esc(p.name)}<span class="en">${esc(p.en)}</span></h1>
      <div class="tagline">${esc(p.tagline)}</div><p class="story">${esc(p.story)}</p>
      <div class="hl">${p.hl.map(h=>`<span>${esc(h)}</span>`).join('')}</div>
      <div class="price-row">
        <div class="price"><small>ราคาเฉลี่ย ${S.y}</small><b class="num">${nf.format(Math.round(p.priceY[S.y]))}</b> <small style="display:inline">${esc(p.priceU)}</small></div>
        <div class="price"><small>มูลค่าจำหน่าย ${periodLabel()}</small><b class="num">${fmtBaht(cur).n}</b> <small style="display:inline">${fmtBaht(cur).u}</small></div>
        <div class="price"><small>ฤดูกาลเด่น</small><b class="s">${MONTHS_FULL[peakIdx]}</b> <small style="display:inline">${esc(p.peakTxt)}</small></div>
      </div>
      <div class="cta"><a class="btn btn-p" href="#shops" data-jump="shops">ซื้อได้ที่ไหน ${ic('arrowR')}</a><a class="btn btn-o" href="#vs" data-jump="vs">เส้นทางจากแหล่งผลิตถึงผู้ซื้อ</a></div>
    </div>
    <div class="hero-media"><div class="media-frame" style="background-image:url(${IMG('poster',p.id)})">${vid?`<video src="video/clip-${pad2(p.id)}.mp4" poster="${IMG('poster',p.id)}" autoplay muted loop playsinline preload="metadata" aria-label="วิดีโอสินค้า ${esc(p.name)}"></video>`:''}<span class="live"><i></i>Showcase · No.${pad2(p.id)}</span></div>
      ${badge(p,{spin:true})}${vid?`<button class="vbtn" type="button" id="vBtn" aria-label="หยุดวิดีโอ">${ic('pause')}</button>`:''}</div>
  </section>
  <div class="kpis">
    ${kpi('มูลค่าการจำหน่าย · '+periodLabel(),fmtBaht(cur).n,fmtBaht(cur).u,grTxt(cur,pre),gr>=0?'pos':'neg',(isReal&&p.real.v?pill('real'):pill('sim'))+' '+esc(p.agency))}
    ${kpi('ปริมาณผลผลิต/จำหน่าย',nf.format(Math.round(vol)),esc(p.volU),S.mode==='Y'?'สะสม '+periodLabel():'เดือน'+MONTHS_FULL[S.m-1],'',isReal&&p.real.vol?pill('real'):pill('sim'))}
    ${kpi(esc(p.prodL),nf.format(p.prodY[S.y]),'ราย',p.prodY[S.y-1]?'▲ '+pct(p.prodY[S.y]/p.prodY[S.y-1]-1)+' จากปีก่อน':'ข้อมูลรายปี','pos',(isReal&&p.real.prod?pill('real'):pill('sim'))+' ข้อมูลรายปี')}
    ${kpi('รายการข้อมูลที่หน่วยงานมี',R0.ok,'/ '+R0.n+' รายการ',R0.real?`ส่งค่าจริงแล้ว ${R0.real} รายการ`:'รอหน่วยงานส่งค่า','',`${api&&api.n?pill('api'):pill('wait')} ระบบบัญชีข้อมูลจังหวัด`)}
  </div>
  <div class="grid-2">
    <div class="card"><div class="card-h"><h3>${S.mode==='Y'?'มูลค่าจำหน่ายรายเดือน':'มูลค่ารายเดือน · ไฮไลต์ '+MONTHS_FULL[S.m-1]}</h3><span class="note">ปี ${S.y} เทียบ ${S.y-1}</span></div><div class="chart-box"><canvas id="cMonth"></canvas></div></div>
    <div class="card"><div class="card-h"><h3>${S.mode==='Y'?'มูลค่ารายปี':'เดือน'+MONTHS_FULL[S.m-1]+' ย้อนหลัง'}</h3><span class="note">${S.mode==='Y'&&S.y===LAST.y?'ปีล่าสุดถึง '+MONTHS[LAST.m-1]:''}</span></div><div class="chart-box"><canvas id="cYear"></canvas></div></div>
  </div>
  <section class="card" id="vs">
    <div class="vs-head"><div><span class="eyebrow">Value story</span><h2>เส้นทางของ${esc(p.name)}</h2><p>จากแหล่งผลิต สู่การแปรรูป และถึงมือผู้ซื้อ · ${p.inds.length} รายการข้อมูลตามแบบสำรวจ</p></div>
      <div class="row"><div class="seg" role="group" aria-label="รูปแบบการแสดงผล"><button type="button" data-vs="viz" aria-pressed="${store.get('nbl12-vsview','viz')==='viz'}">${ic('chart')} ภาพ</button><button type="button" data-vs="table" aria-pressed="${store.get('nbl12-vsview','viz')==='table'}">${ic('table')} ตาราง</button></div>
      <button class="btn btn-g sm" type="button" id="vsCsv">${ic('down')} CSV</button></div></div>
    <div id="vsBody" style="margin-top:16px">${vsBody(p)}</div>
    <div class="src-line" style="margin-top:16px"><span><b>แหล่งที่มา</b> ${ags.map(esc).join(' · ')}</span><span><b>อ้างอิง</b> ${APP.survey}</span><span><b>การเชื่อมต่อ</b> ${api&&api.n?`API ${api.n} รายการ · ${new Date(api.t).toLocaleDateString('th-TH')}`:'รอข้อมูลเข้าระบบบัญชีข้อมูลจังหวัด'}</span><a href="sources.html">ทะเบียนข้อมูลทั้งหมด ›</a></div>
  </section>
  <section><div class="card-h"><h3 style="font-size:18px">แกลเลอรีสินค้า</h3><span class="note">แตะเพื่อดูภาพขยาย</span></div>
    <div class="gal" id="gal">${[['b','พร้อมเสิร์ฟถึงมือคุณ','3/4'],['post','ภาพประชาสัมพันธ์','2/3'],['pack','บรรจุภัณฑ์','1/1'],['a','ต้นทางที่หนองบัวลำภู','16/9'],['shop','นำเสนอ','3/2'],['kv','Key Visual','16/9']].map(([k,t,r],j)=>`<figure data-i="${j}" style="aspect-ratio:${r}"><img src="${IMG(k,p.id)}" alt="${esc(p.name)} · ${t}" decoding="async"><figcaption>${t}</figcaption></figure>`).join('')}</div></section>
  <div class="grid-3">
    <div class="card"><div class="card-h"><h3>แหล่งผลิตรายอำเภอ</h3><span class="note">สัดส่วนมูลค่า</span></div><div class="chart-box sm"><canvas id="cDist"></canvas></div></div>
    <div class="card"><div class="card-h"><h3>ช่องทางการจำหน่าย</h3><span class="note">% ของมูลค่า</span></div><div class="chart-box sm"><canvas id="cCh"></canvas></div></div>
    <div class="card"><div class="card-h"><h3>ปฏิทินฤดูกาล</h3><span class="note">${esc(p.peakTxt)}</span></div>
      <div class="season">${p.season.map((w,k)=>{const mx=Math.max(...p.season);return`<div class="${w===mx?'pk':''}"><i style="opacity:${(.15+.85*w/mx).toFixed(2)}" title="${MONTHS_FULL[k]}"></i>${MONTHS[k].replace('.','').slice(0,3)}</div>`}).join('')}</div>
      <p class="note" style="font-size:13px;margin:12px 0 0">ช่วงสีเข้มคือช่วงที่มีสินค้ามาก เหมาะกับการสั่งซื้อ จัดกิจกรรมส่งเสริมการขาย และวางแผนรับซื้อล่วงหน้า</p></div>
  </div>
  <section class="card" id="shops"><div class="card-h"><h3>แหล่งซื้อ · ร้านค้าและกลุ่มผู้ผลิต</h3><span class="note">${shops.length?shops.length+' ร้าน (ข้อมูลจริง)':'รอข้อมูลร้านค้าจากหน่วยงาน'}</span></div>
    <div class="shops">${shops.map((s,k)=>shopCard(p,s,k)).join('')}${shops.length<3?shopPlaceholder(p):''}</div></section>
  <nav class="pn" aria-label="สินค้าก่อนหน้าและถัดไป"><a href="${pFile(prv.id)}" style="background-image:url(${IMG('kv',prv.id)})"><small>← สินค้าก่อนหน้า · ${pad2(prv.id)}</small><b>${esc(prv.name)}</b></a><a class="nx" href="${pFile(nxt.id)}" style="background-image:url(${IMG('kv',nxt.id)})"><small>สินค้าถัดไป · ${pad2(nxt.id)} →</small><b>${esc(nxt.name)}</b></a></nav>`;
  $$('[data-jump]',page).forEach(a=>a.onclick=e=>{e.preventDefault();document.getElementById(a.dataset.jump).scrollIntoView({behavior:'smooth',block:'start'})});
  $$('[data-vs]',page).forEach(b=>b.onclick=()=>{store.set('nbl12-vsview',b.dataset.vs);$$('[data-vs]',page).forEach(x=>x.setAttribute('aria-pressed',x===b));$('#vsBody').innerHTML=vsBody(p)});
  $('#vsCsv').onclick=()=>download(`12plus_${pad2(p.id)}_${p.name}.csv`,[csvRow(['code','chapter','indicator','value','unit','year','agency','status']),...p.inds.map(d=>csvRow([d.code,CHAPTERS[d.s].t,d.n,d.val,d.u,d.per||ANCHOR,d.ag,ST_LABEL[DS.status(d)]]))].join('\n'));
  const vb=$('#vBtn');if(vb)vb.onclick=()=>{const v=$('.media-frame video');if(!v)return;if(v.paused){v.play();vb.innerHTML=ic('pause')}else{v.pause();vb.innerHTML=ic('play')}};
  $$('#gal figure').forEach(f=>f.onclick=()=>lightbox($$('#gal img').map(i=>[i.src,i.alt]),+f.dataset.i));
  shops.forEach((s,k)=>{const el=document.getElementById('qr'+k);if(el&&window.QRCode)new QRCode(el,{text:mapUrl(s),width:120,height:120,correctLevel:QRCode.CorrectLevel.M})});
  drawProductCharts(p);
  if((SET.res||{})[p.id]&&!p._loaded){p._loaded=1;DS.loadProduct(p).then(r=>{if(R.page==='product'&&R.pid===p.id&&r.state==='ok')$('#vsBody').innerHTML=vsBody(p)})}
};
function lightbox(list,i){closeOverlay();const d=document.createElement('div');d.className='lb';d.setAttribute('role','dialog');
  const draw=()=>{d.innerHTML=`<img src="${list[i][0]}" alt="${esc(list[i][1])}"><button class="x" aria-label="ปิด">${ic('x')}</button><button style="left:16px" data-d="-1" aria-label="ก่อนหน้า">‹</button><button style="right:16px" data-d="1" aria-label="ถัดไป">›</button>`};
  draw();d.onclick=e=>{const b=e.target.closest('button');if(!b){if(e.target===d)d.remove();return}if(b.classList.contains('x'))d.remove();else{i=(i+ +b.dataset.d+list.length)%list.length;draw()}};document.body.appendChild(d)}
function mapUrl(s){return'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(s.map||s.name)}
/* ช่องติดต่อร้าน: ว่าง = –, FB ที่เป็นลิงก์ = คลิกเปิดเพจได้ */
/* สลับ QR การ์ดร้าน: นำทาง ⇄ เพจ Facebook */
document.addEventListener('click',e=>{const b=e.target.closest('.qr-sw button');if(!b)return;const w=b.parentElement,k=w.dataset.k,el=document.getElementById('qr'+k);if(!el||!window.QRCode)return;const fb=b.dataset.q==='fb';
  el.innerHTML='';new QRCode(el,{text:fb?w.dataset.fb:w.dataset.map,width:120,height:120,correctLevel:QRCode.CorrectLevel.M});w.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',x===b));const c=document.getElementById('qrc'+k);if(c)c.textContent=fb?'สแกนเปิดเพจ':'สแกนนำทาง';el.title=fb?'สแกนเพื่อเปิดเพจ Facebook':'สแกนเพื่อนำทาง'});
function shopV(v){return esc(v==null||v===''?'–':v)}
function fbLink(s){if(!s.fb)return'–';return/^https?:\/\//.test(s.fb)?`<a href="${esc(s.fb)}" target="_blank" rel="noopener">${esc(s.fbName||'Facebook')} ${ic('ext')}</a>`:esc(s.fb)}
function shopCard(p,s,k){return`<article class="shop"><div class="sb" style="background-image:url(${IMG('shop',p.id)})">${badge(p,{label:false})}<span class="k">ร้านแนะนำ · ${esc(p.name)}</span><span class="nm${/[ก-๙]/.test(s.nick)?' th':''}">${esc(s.nick)}</span><span class="of">${esc(s.name)}</span></div>
  <div class="shop-b"><div style="min-width:0"><p class="addr">${esc(s.addr)}</p><ul><li><b>โทร</b><span class="num">${shopV(s.tel)}</span></li><li><b>LINE</b><span>${shopV(s.line)}</span></li><li><b>FB</b><span>${fbLink(s)}</span></li><li><b>IG</b><span>${shopV(s.ig)}</span></li></ul></div>
  <div><div class="qr" id="qr${k}" title="สแกนเพื่อนำทาง"></div><div class="qr-cap" id="qrc${k}">สแกนนำทาง</div>${/^https?:\/\//.test(s.fb||'')?`<div class="qr-sw" role="group" aria-label="เลือก QR" data-k="${k}" data-map="${esc(mapUrl(s))}" data-fb="${esc(s.fb)}"><button type="button" data-q="map" aria-pressed="true">นำทาง</button><button type="button" data-q="fb" aria-pressed="false">เพจ FB</button></div>`:''}</div></div>
  <a class="btn btn-p nav" href="${mapUrl(s)}" target="_blank" rel="noopener">นำทางไปยังร้าน ${ic('ext')}</a></article>`}
function shopPlaceholder(p){return`<article class="shop placeholder"><div class="sb" style="background-image:url(${IMG('shop',p.id)})">${badge(p,{label:false})}<span class="k">ช่องสำหรับร้านค้าถัดไป</span><span class="nm th">ชื่อร้านที่คนรู้จัก</span><span class="of">ชื่อร้านทางการ</span></div>
  <div class="shop-b"><div><p class="addr">หมู่ · ตำบล · อำเภอ · จังหวัดหนองบัวลำภู</p><ul><li><b>โทร</b><span>–</span></li><li><b>LINE</b><span>–</span></li><li><b>FB</b><span>–</span></li><li><b>IG</b><span>–</span></li></ul></div><div><div class="qr empty">QR<br>นำทาง</div></div></div>
  <a class="btn btn-g nav" href="entry.html?p=${p.id}">เพิ่มร้านค้าผ่านหน้า กรอกข้อมูล</a></article>`}
function drawProductCharts(p){
  const pa=p.pa,soft=isDark()?'rgba(255,255,255,.18)':'rgba(20,40,30,.16)',gold=css('--gold'),cur=p.m[S.y],prev=p.m[S.y-1];
  mk('cMonth',{type:'bar',data:{labels:MONTHS,datasets:[{type:'bar',label:'ปี '+S.y,data:cur,backgroundColor:cur.map((_,k)=>S.mode==='M'&&k!==S.m-1?hexMix(pa,.55):pa),borderRadius:6,maxBarThickness:28,order:2},
    ...(prev?[{type:'line',label:'ปี '+(S.y-1),data:prev,borderColor:gold,backgroundColor:gold,borderWidth:2,pointRadius:2.5,tension:.35,order:1}]:[])]},options:baseOpts()});
  const ys=S.mode==='Y'?YEARS.filter(y=>y<=S.y):YEARS.filter(y=>p.m[y]&&p.m[y][S.m-1]!=null);
  mk('cYear',{type:'bar',data:{labels:ys.map(y=>S.mode==='Y'?(y===LAST.y?y+' (9 ด.)':''+y):MONTHS[S.m-1]+' '+y),datasets:[{label:'มูลค่า',data:ys.map(y=>S.mode==='Y'?sum(p.m[y]):p.m[y][S.m-1]),backgroundColor:ys.map(y=>y===S.y?pa:hexMix(pa,.6)),borderRadius:8,maxBarThickness:56}]},options:baseOpts({plugins:{legend:{display:false},tooltip:{callbacks:{label:c=>' '+fB(c.raw)}}}})});
  const tot=periodVal(p,S.y),ds=sum(p.dist),order=DISTRICTS.map((d,i)=>({d,v:tot*p.dist[i]/ds})).sort((a,b)=>b.v-a.v);
  mk('cDist',{type:'bar',data:{labels:order.map(o=>o.d.replace('หนองบัวลำภู','')),datasets:[{label:'มูลค่า',data:order.map(o=>o.v),backgroundColor:order.map((_,i)=>i===0?pa:hexMix(pa,.25+i*.1)),borderRadius:5,maxBarThickness:18}]},
    options:baseOpts({indexAxis:'y',plugins:{legend:{display:false},tooltip:{callbacks:{label:c=>' '+fB(c.raw)+' ('+(c.raw/tot*100).toFixed(0)+'%)'}}},scales:{x:{grid:{color:css('--line')},ticks:{color:css('--muted'),callback:v=>fShort(v),font:{family:'Kanit',size:10}},border:{display:false}},y:{grid:{display:false},ticks:{color:css('--ink'),font:{family:'Kanit',size:12}},border:{display:false}}}})});
  const cs=sum(p.ch);
  mk('cCh',{type:'doughnut',data:{labels:CHANNELS,datasets:[{data:p.ch.map(v=>v/cs*100),backgroundColor:[pa,hexMix(pa,.3),gold,hexMix(pa,.6),soft],borderColor:css('--surface'),borderWidth:2}]},
    options:{responsive:true,maintainAspectRatio:false,cutout:'62%',plugins:{legend:{position:'right',labels:{color:css('--muted'),font:{family:'Kanit',size:11},boxWidth:10,usePointStyle:true}},tooltip:{callbacks:{label:c=>' '+c.label+': '+c.raw.toFixed(0)+'%'}}}}});
}

/* ================= รายงานและบทวิเคราะห์ ================= */
PAGE_R.report=page=>{
  const rows=P.map(p=>{const c=periodVal(p,S.y),q=periodVal(p,S.y-1);const r=p.ready.reduce((a,x)=>({n:a.n+x.n,ok:a.ok+x.ok,real:a.real+x.real}),{n:0,ok:0,real:0});return{p,c,q,g:q?c/q-1:null,r}});
  const tot=sum(rows.map(x=>x.c)),pre=sum(rows.map(x=>x.q||0)),R0=readyAll();
  const byV=[...rows].sort((a,b)=>b.c-a.c),byG=[...rows].sort((a,b)=>b.g-a.g),comm=rows.filter(x=>x.p.id!==2);
  const lowR=[...rows].sort((a,b)=>a.r.ok/a.r.n-b.r.ok/b.r.n).slice(0,4);
  const gaps=P.flatMap(p=>p.inds.filter(d=>d.st!=='R').map(d=>({p,d,pr:d.st==='N'?1:d.st===''?2:3})));
  const byAg={};gaps.forEach(x=>{const k=x.d.ag;(byAg[k]=byAg[k]||[]).push(x)});
  const agList=Object.entries(byAg).sort((a,b)=>b[1].filter(x=>x.pr<3).length-a[1].filter(x=>x.pr<3).length);
  page.innerHTML=`
  <div class="ph-title"><div><span class="eyebrow">Executive report</span><h1>รายงานและบทวิเคราะห์</h1><p>สรุปสถานการณ์สินค้าอัตลักษณ์ 14 รายการ สร้างอัตโนมัติจากข้อมูลล่าสุด · ${periodLabel()}</p></div>
    <div class="row no-print"><button class="btn btn-g" type="button" id="rCsv">${ic('down')} CSV</button><button class="btn btn-g" type="button" id="rJson">${ic('down')} JSON</button><button class="btn btn-f" type="button" data-act="print">${ic('print')} พิมพ์ / บันทึก PDF</button></div></div>
  <section class="card"><div class="card-h"><h3><span class="sec-no">1</span>บทสรุปสำหรับผู้บริหาร</h3><span class="note">สร้างจากข้อมูลล่าสุด · ตัวเลขที่ยังเป็นค่าจำลองแสดงรูปแบบรายงาน</span></div>
    <div class="grid-2"><div class="rep-sum">
      <p>${periodLabel()} สินค้าอัตลักษณ์ 14 รายการของจังหวัดหนองบัวลำภูมีมูลค่าการจำหน่ายรวม <b>${fB(tot)}</b> ${pre?`${tot>=pre?'เพิ่มขึ้น':'ลดลง'} <b>${pct(tot/pre-1)}</b> เมื่อเทียบ${prevLabel()}`:''} โดยไม่รวมอ้อยมีมูลค่า <b>${fB(sum(comm.map(x=>x.c)))}</b></p>
      <p>สินค้าที่มีมูลค่าสูงสุด 3 อันดับ ได้แก่ ${byV.slice(0,3).map(x=>`<b>${esc(x.p.name)}</b> (${fB(x.c)})`).join(', ')} ส่วนสินค้าที่เติบโตเร็วที่สุดคือ ${byG.slice(0,3).map(x=>`<b>${esc(x.p.name)}</b> (${pct(x.g)})`).join(', ')}</p>
      <p>ด้านข้อมูล หน่วยงานแจ้งว่ามีข้อมูล <b>${R0.ok} จาก ${R0.n} รายการ</b> และส่งค่าจริงแล้ว <b>${R0.real} รายการ</b> สินค้าที่ยังต้องเร่งจัดเก็บข้อมูล ได้แก่ ${lowR.map(x=>esc(x.p.name)).join(', ')}</p></div>
      <div><h3 style="font-size:15px;margin-bottom:10px">ข้อเสนอเชิงนโยบาย</h3><ol class="recs">
        <li><i>1</i><span>ส่งเสริมการตลาดออนไลน์และของฝากสำหรับ ${byG.slice(0,2).map(x=>esc(x.p.name)).join(' และ ')} ซึ่งเติบโตเร็ว เพื่อขยายฐานผู้ซื้อนอกจังหวัด</span></li>
        <li><i>2</i><span>ยกระดับมาตรฐาน (อย./มผช./GI) ให้สินค้าแปรรูปที่ยังไม่มีการรับรอง เพื่อเข้าห้างและตลาดส่งออก</span></li>
        <li><i>3</i><span>ประสานหน่วยงานเจ้าของข้อมูลนำข้อมูลขึ้นระบบบัญชีข้อมูลจังหวัด เพื่อให้แดชบอร์ดอัปเดตอัตโนมัติ</span></li>
        <li><i>4</i><span>วางแผนกิจกรรมส่งเสริมการขายตามปฏิทินฤดูกาลของแต่ละสินค้า</span></li></ol></div></div></section>
  <section class="card"><div class="card-h"><h3><span class="sec-no">2</span>ตัวชี้วัดทั้งหมด</h3><span class="note">ค่าล่าสุดและการเปลี่ยนแปลงเทียบปีก่อน</span></div>
    <div class="scroll-x"><table class="t"><thead><tr><th>#</th><th>สินค้า</th><th class="r">มูลค่า</th><th class="r">เปลี่ยนแปลง</th><th class="r">ราคาเฉลี่ย</th><th class="r">ผู้ผลิต (ราย)</th><th class="r">ความพร้อมข้อมูล</th><th>สถานะ</th><th>หน่วยงานหลัก</th></tr></thead>
    <tbody>${rows.map(x=>`<tr><td>${pad2(x.p.id)}</td><td><a href="${pFile(x.p.id)}">${esc(x.p.name)}</a></td><td class="r num">${fB(x.c)}</td><td class="r num" style="color:${x.g>=0?'var(--good)':'var(--bad)'}">${x.g==null?'–':pct(x.g)}</td><td class="r num">${nf.format(Math.round(x.p.priceY[S.y]))} <span class="note">${esc(x.p.priceU)}</span></td><td class="r num">${nf.format(x.p.prodY[S.y])}</td><td class="r num">${x.r.ok}/${x.r.n}</td><td>${x.r.real?pill('real'):pill('sim')}</td><td class="note">${esc(x.p.agency)}</td></tr>`).join('')}
    <tr class="grp"><td></td><td>รวม</td><td class="r num">${fB(tot)}</td><td class="r num">${pre?pct(tot/pre-1):'–'}</td><td></td><td class="r num">${nf.format(sum(P.map(p=>p.prodY[S.y])))}</td><td class="r num">${R0.ok}/${R0.n}</td><td></td><td></td></tr></tbody></table></div></section>
  <section class="card"><div class="card-h"><h3><span class="sec-no">3</span>ข้อมูลที่ต้องบูรณาการเพิ่ม</h3><span class="note">เรียงตามหน่วยงาน · ไม่มีข้อมูลก่อน แล้วจึงรอยืนยัน</span></div>
    <div style="display:grid;gap:10px">${agList.map(([ag,L])=>{const n1=L.filter(x=>x.pr===1).length,n2=L.filter(x=>x.pr===2).length,n3=L.filter(x=>x.pr===3).length;
      return`<details class="acc"><summary><span class="cell" style="background:${n1?'color-mix(in srgb,var(--bad) 15%,transparent)':'var(--surface-3)'}">${L.length}</span><b>${esc(ag)}</b><span class="note">${n1?`ไม่มีข้อมูล ${n1} · `:''}รอยืนยัน ${n2} · มีข้อมูลรอส่งค่า ${n3}</span><span>${ic('arrowR')}</span></summary>
      <div class="scroll-x"><table class="t"><tbody>${L.sort((a,b)=>a.pr-b.pr).map(x=>`<tr><td><code>${x.d.code}</code></td><td>${esc(x.p.name)}</td><td>${esc(x.d.n)}</td><td>${pill(DS.status(x.d))}</td></tr>`).join('')}</tbody></table></div></details>`}).join('')}</div></section>
  <div class="src-line"><span><b>ที่มาของตัวเลข</b> ${APP.survey} และหน่วยงานเจ้าของข้อมูล 14 สินค้า</span><a href="sources.html">ดูทะเบียนชุดข้อมูลทั้งหมด ›</a></div>`;
  $('#rCsv').onclick=()=>download('12plus_report.csv',[csvRow(['no','product','value','change','price','price_unit','producers','ready','total_items','agency']),...rows.map(x=>csvRow([x.p.id,x.p.name,Math.round(x.c),x.g==null?'':(x.g*100).toFixed(2),Math.round(x.p.priceY[S.y]),x.p.priceU,x.p.prodY[S.y],x.r.ok,x.r.n,x.p.agency]))].join('\n'));
  $('#rJson').onclick=()=>download('12plus_report.json',JSON.stringify({period:periodLabel(),asOf:APP.asOf,products:rows.map(x=>({no:x.p.id,name:x.p.name,value:Math.round(x.c),change:x.g,producers:x.p.prodY[S.y],indicators:x.p.inds.map(d=>({code:d.code,name:d.n,value:d.val,unit:d.u,agency:d.ag,status:DS.status(d)}))}))},null,2),'application/json');
};

/* ================= แหล่งข้อมูลและที่มา ================= */
PAGE_R.sources=page=>{
  const agCount={};P.forEach(p=>p.inds.forEach(d=>{d.ag.split(/\s*\/\s*|,\s*/).forEach(a=>{a=a.replace(/^พช\.?$/,'สนง.พัฒนาชุมชนจังหวัด');agCount[a]=(agCount[a]||0)+1})}));
  const agE=Object.entries(agCount).sort((a,b)=>b[1]-a[1]);
  page.innerHTML=`
  <div class="ph-title"><div><span class="eyebrow">Data provenance</span><h1>แหล่งข้อมูลและที่มา</h1><p>ทุกตัวเลขบนแดชบอร์ดระบุเจ้าของข้อมูล รหัสรายการ ปีข้อมูล และสถานะได้ ผู้ดูแลระบบ: สำนักงานจังหวัดหนองบัวลำภู และ สำนักงานสถิติจังหวัดหนองบัวลำภู</p></div>
    <a class="btn btn-f" href="apistatus.html">${ic('db')} สถานะการเชื่อมต่อระบบบัญชีข้อมูลจังหวัด</a></div>
  <div class="grid-2">
    <div class="card"><div class="card-h"><h3><span class="sec-no">1</span>ความพร้อมของข้อมูลรายสินค้า</h3><span class="note">แตะแถบเพื่อเปิดหน้าสินค้า</span></div><div class="chart-box" style="height:380px"><canvas id="sReady"></canvas></div></div>
    <div class="card"><div class="card-h"><h3><span class="sec-no">2</span>หน่วยงานเจ้าของข้อมูล</h3><span class="note">จำนวนรายการข้อมูลที่รับผิดชอบ</span></div><div class="chart-box" style="height:380px"><canvas id="sAg"></canvas></div></div>
  </div>
  <section class="card"><div class="card-h"><h3><span class="sec-no">3</span>ทะเบียนชุดข้อมูล</h3><a class="note" href="${APP.portal}/dataset" target="_blank" rel="noopener">ค้นหาในระบบบัญชีข้อมูล ↗</a></div>
    <div class="scroll-x"><table class="t"><thead><tr><th>รหัส</th><th>ชุดข้อมูล</th><th>หน่วยงานรับผิดชอบหลัก</th><th class="r">รายการ</th><th class="r">มีข้อมูล</th><th class="r">ค่าจริง</th><th>ช่วงปีข้อมูล</th><th>รอบปรับปรุง</th><th>การเชื่อมต่อ</th></tr></thead>
    <tbody>${P.map(p=>{const r=p.ready.reduce((a,x)=>({n:a.n+x.n,ok:a.ok+x.ok,real:a.real+x.real}),{n:0,ok:0,real:0});const per=[...new Set(p.inds.map(d=>d.per).filter(Boolean))].join(', ')||(r.real?String(ANCHOR):'รอยืนยัน');
      return`<tr><td><code>${p.code}</code></td><td><a href="${pFile(p.id)}" style="font-family:var(--f-head)">${esc(p.name)}</a></td><td>${esc(p.agency)}</td><td class="r num">${r.n}</td><td class="r num">${r.ok}</td><td class="r num">${r.real||'–'}</td><td>${esc(per)}</td><td>รายปี · มูลค่ารายเดือน</td><td>${(SET.res||{})[p.id]?pill('api'):pill('wait')}</td></tr>`}).join('')}</tbody></table></div></section>
  <div class="grid-2e">
    <section class="card"><div class="card-h"><h3><span class="sec-no">4</span>วิธีอ่านข้อมูล</h3></div><div style="display:grid;gap:10px;font-size:14px">
      <div>• มูลค่าและปริมาณแสดงเป็นรายปีและรายเดือน การเปลี่ยนแปลงเทียบกับช่วงเดียวกันของปีก่อน</div>
      <div>• ปี ${LAST.y} เป็นข้อมูลสะสมถึงเดือน${MONTHS_FULL[LAST.m-1]} จึงเทียบกับช่วงเดียวกันของปี ${LAST.y-1}</div>
      <div>• รายการข้อมูลแต่ละสินค้าแบ่งเป็น 3 หมวด คือ ${CHAPTERS.map(c=>c.t).join(' · ')} ตามแบบสำรวจรายการข้อมูล</div>
      <div>• รหัสรายการ เช่น <code>P01-104</code> = สินค้า 01 · หมวด 1 · ลำดับ 04 ใช้เป็นคีย์เมื่อนำข้อมูลขึ้นระบบบัญชีข้อมูล</div>
      <div style="display:flex;flex-wrap:wrap;gap:8px">${['real','api','has','sim','none'].map(pill).join('')}</div></div></section>
    <section class="card"><div class="card-h"><h3><span class="sec-no">5</span>ลิงก์อ้างอิงและช่องทางติดต่อ</h3></div><div style="display:grid;gap:8px;font-size:14px">
      <a href="${APP.portal}" target="_blank" rel="noopener">${ic('ext')} ระบบบัญชีข้อมูลจังหวัดหนองบัวลำภู (GD Catalog)</a>
      <a href="https://gdcatalog.go.th" target="_blank" rel="noopener">${ic('ext')} ระบบบัญชีข้อมูลภาครัฐ</a>
      <a href="${APP.sheet}" target="_blank" rel="noopener">${ic('ext')} ${APP.survey}</a>
      <a href="https://github.com/chingchai/OpenGISData-Thailand" target="_blank" rel="noopener">${ic('ext')} ขอบเขตการปกครองรายอำเภอ (OpenGISData-Thailand)</a>
      <div class="src-line" style="margin-top:6px"><span><b>สำนักงานจังหวัดหนองบัวลำภู</b> ศาลากลางจังหวัดหนองบัวลำภู ชั้น 4 ถ.หนองบัวลำภู – เลย ต.ลำภู อ.เมือง จ.หนองบัวลำภู 39000</span></div>
      <div class="src-line"><span><b>สำนักงานสถิติจังหวัดหนองบัวลำภู</b> ศาลากลางจังหวัดหนองบัวลำภู ชั้น 2 · โทร 0 4231 6736 · saraban_nblamphu@nso.mail.go.th</span></div></div></section>
  </div>`;
  const ln=css('--line'),mu=css('--muted');
  mk('sReady',{type:'bar',data:{labels:P.map(p=>p.name),datasets:[{label:'ค่าจริง',data:P.map(p=>sum(p.ready.map(r=>r.real))),backgroundColor:css('--good')},{label:'มีข้อมูลรอส่งค่า',data:P.map(p=>sum(p.ready.map(r=>r.ok-r.real))),backgroundColor:css('--gold')},{label:'รอยืนยัน / ไม่มีข้อมูล',data:P.map(p=>sum(p.ready.map(r=>r.n-r.ok))),backgroundColor:isDark()?'#2B4037':'#D9E1D4'}]},
    options:baseOpts({indexAxis:'y',onClick:(e,els)=>{if(els[0])go(pFile(P[els[0].index].id))},plugins:{legend:{labels:{color:mu,font:{family:'Kanit'},usePointStyle:true}},tooltip:{callbacks:{label:c=>' '+c.dataset.label+': '+c.raw+' รายการ'}}},scales:{x:{stacked:true,grid:{color:ln},ticks:{color:mu}},y:{stacked:true,grid:{display:false},ticks:{color:css('--ink'),font:{family:'Kanit',size:12}}}}})});
  const pal=['#0F4A37','#B1832A','#C2386F','#22789B','#7E9A1E','#9C3F27','#4A5878','#C2671B','#2C8A57','#8A6440','#7A4528','#B92C75'];
  mk('sAg',{type:'doughnut',data:{labels:agE.map(a=>a[0]),datasets:[{data:agE.map(a=>a[1]),backgroundColor:agE.map((_,i)=>pal[i%pal.length]),borderColor:css('--surface'),borderWidth:2}]},options:{responsive:true,maintainAspectRatio:false,cutout:'58%',plugins:{legend:{position:'right',labels:{color:mu,font:{family:'Kanit',size:11},boxWidth:10,usePointStyle:true}}}}});
};

/* ================= สถานะการเชื่อมต่อข้อมูล (API) ================= */
PAGE_R.apistatus=page=>{
  const all=P.flatMap(p=>p.inds),n=all.length,api=all.filter(d=>d.src==='api').length,R0=readyAll();
  const linked=P.filter(p=>(SET.res||{})[p.id]).length;const log=store.get('nbl12-log',[]).slice(0,30);
  const sample=`${DS.base()}/datastore_search?resource_id=<RESOURCE_ID>&limit=5000`;
  const schema=`code,year,month,value,unit,agency,note\nP01-104,2569,,535000,กก.,สนง.เกษตรจังหวัด,ผลผลิตรวมรายปี\nP08-116,2569,,1092000,บาท,สนง.พัฒนาชุมชนจังหวัด,มูลค่าการจัดจำหน่ายทั้งสิ้น`;
  page.innerHTML=`
  <div class="ap-hero">
    <section class="ap-main"><div class="lgs"><img src="img/seal.png" alt="ตราจังหวัด"><span style="font-family:var(--f-latin);font-size:20px;color:#F0D58E">×</span><img src="img/gd-catalog.png" alt="GD Catalog"><span class="pill api" style="background:rgba(91,155,255,.2);color:#cfe0ff;margin-left:auto">${linked?'LIVE':'รอข้อมูลเข้าระบบ'}</span></div>
      <h1>ทุกตัวเลขของ 12 Plus+<br>มาจากไหน สดแค่ไหน</h1>
      <p>เมื่อหน่วยงานนำข้อมูลขึ้นระบบบัญชีข้อมูลจังหวัด แดชบอร์ดจะดึงผ่าน API อัตโนมัติ อัปเดตที่เดียว ทุกหน้าเปลี่ยนตาม</p>
      <div class="endpoint"><i></i>${esc(DS.base())}</div>
      <div class="ap-chips"><span>เปิดเผย ใช้ฟรี</span><span>เชื่อม API แบบเรียลไทม์</span><span>อัปเดตครั้งเดียว ทุกระบบเปลี่ยนตาม</span></div>
      <div class="ap-btns"><button class="btn w" type="button" id="apCheck">${ic('refresh')} ตรวจทั้งหมดตอนนี้</button><a class="btn" href="${APP.portal}" target="_blank" rel="noopener">${ic('ext')} เข้าสู่ระบบบัญชีข้อมูล</a><button class="btn" type="button" id="apSample">${ic('copy')} คัดลอกตัวอย่าง API</button><button class="btn" type="button" id="apCsv">${ic('down')} ส่งออก CSV</button></div>
      <p id="apMsg" style="margin:12px 0 0;font-size:13px">ยังไม่ได้ตรวจในรอบนี้</p></section>
    <div class="counters">
      <div class="ctr"><b class="num">${Math.round(api/n*100)}%</b><span>ข้อมูลบนแดชบอร์ดที่ดึงจาก API</span><div class="bar"><i style="width:${api/n*100}%"></i></div></div>
      <div class="ctr"><b class="num">${linked}/14</b><span>สินค้าที่ผูกชุดข้อมูล API แล้ว</span><div class="bar"><i style="width:${linked/14*100}%"></i></div></div>
      <div class="ctr"><b class="num">${R0.ok}</b><span>รายการที่หน่วยงานแจ้งว่ามีข้อมูล (จาก ${R0.n})</span><div class="bar"><i style="width:${R0.ok/R0.n*100}%;background:var(--gold)"></i></div></div>
      <div class="ctr"><b class="num">${n-api}</b><span>รายการที่รอข้อมูลเข้าระบบ</span><div class="bar"><i style="width:${(n-api)/n*100}%;background:var(--wait)"></i></div></div>
    </div>
  </div>
  <section class="card"><div class="card-h"><h3>สถานะรายสินค้า</h3><div class="legend note" style="display:flex;gap:10px;flex-wrap:wrap">${['api','real','has','sim','none'].map(pill).join('')}</div></div>
    <div class="scroll-x"><table class="mx"><thead><tr><th>สินค้า</th>${CHAPTERS.map(c=>`<th>${c.t}</th>`).join('')}<th>ชุดข้อมูล API</th><th>ตรวจล่าสุด</th></tr></thead><tbody>
    ${P.map(p=>{const seg=s=>{const L=p.inds.filter(d=>d.s===s),c={api:0,real:0,has:0,sim:0,none:0};L.forEach(d=>c[DS.status(d)]++);const col={api:'var(--api)',real:'var(--good)',has:'var(--gold)',sim:'color-mix(in srgb,var(--wait) 45%,transparent)',none:'var(--bad)'};return`<div class="seg5" title="${Object.entries(c).filter(x=>x[1]).map(x=>ST_LABEL[x[0]]+' '+x[1]).join(' · ')}">${Object.entries(c).map(([k,v])=>v?`<i style="width:${v/L.length*100}%;background:${col[k]}"></i>`:'').join('')}</div>`};
      const rid=(SET.res||{})[p.id],ca=DS.cache[p.id];
      return`<tr><td><a class="pr" href="${pFile(p.id)}">${badge(p,{label:false})}${pad2(p.id)} ${esc(p.name)}</a></td>${[0,1,2].map(s=>`<td>${seg(s)}</td>`).join('')}<td>${rid?`<code style="font-size:11px">${esc(rid.slice(0,12))}…</code>`:pill('wait')}</td><td class="note">${ca?(ca.err?'เชื่อมต่อไม่ได้':`${ca.n} รายการ`)+' · '+new Date(ca.t).toLocaleString('th-TH'):'–'}</td></tr>`}).join('')}</tbody></table></div></section>
  <div class="grid-2">
    <section class="card"><div class="card-h"><h3>รายการข้อมูลรายสินค้า</h3><span class="note">รหัสรายการใช้จับคู่กับชุดข้อมูลบนระบบ</span></div>
      ${P.map(p=>`<details class="acc"><summary>${badge(p,{label:false})}<b>${pad2(p.id)} ${esc(p.name)}</b><span class="note">${p.inds.length} รายการ</span><span>${ic('arrowR')}</span></summary><div class="scroll-x"><table class="t"><tbody>${p.inds.map(d=>`<tr><td><code>${d.code}</code></td><td>${esc(d.n)}</td><td class="note">${esc(d.ag)}</td><td>${pill(DS.status(d))}</td></tr>`).join('')}</tbody></table></div></details>`).join('')}</section>
    <div style="display:grid;gap:20px;align-content:start">
      <section class="card"><div class="card-h"><h3>รูปแบบชุดข้อมูลที่ต้องนำขึ้นระบบ</h3><button class="btn btn-g sm" type="button" id="apSchema">${ic('copy')} คัดลอกโครงสร้าง</button></div>
        <p class="note" style="font-size:13px;margin:0 0 10px">นำขึ้นระบบบัญชีข้อมูลจังหวัดเป็นไฟล์ CSV หนึ่งชุดต่อหนึ่งสินค้า แล้วนำ Resource ID ไปกรอกที่หน้า ตั้งค่าระบบ</p><pre class="code">${esc(schema)}</pre>
        <p class="note" style="font-size:13px;margin:10px 0 6px">ตัวอย่างการเรียก API</p><pre class="code">${esc(sample)}</pre></section>
      <section class="card"><div class="card-h"><h3>ความเคลื่อนไหวล่าสุด</h3><span class="note">บันทึกในเครื่องนี้</span></div>
        ${log.length?`<ul class="log">${log.map(x=>`<li><time>${new Date(x.t).toLocaleString('th-TH')}</time><span>${esc(x.msg)}</span></li>`).join('')}</ul>`:'<p class="note" style="font-size:13px;margin:0">ยังไม่มีความเคลื่อนไหว · กด “ตรวจทั้งหมดตอนนี้” เพื่อเริ่มตรวจ</p>'}</section>
      <section class="card"><div class="card-h"><h3>สแกนเข้าระบบบัญชีข้อมูล</h3></div><div class="row"><div class="qr" id="apQr"></div><p class="note" style="font-size:13px;flex:1;min-width:160px;margin:0">ส่งต่อให้หน่วยงานและประชาชนเข้าถึงระบบบัญชีข้อมูลจังหวัดหนองบัวลำภู</p></div></section>
    </div></div>
  <p class="note">ชุดข้อมูลที่มีป้าย “จำลอง” แสดงรูปแบบการนำเสนอเท่านั้น ห้ามใช้อ้างอิง · ระบบตรวจซ้ำทุกครั้งที่เปิดหน้าสินค้าที่ผูกชุดข้อมูลไว้</p>`;
  if(window.QRCode)new QRCode($('#apQr'),{text:APP.portal,width:120,height:120});
  $('#apSample').onclick=()=>copyText(sample,'คัดลอกตัวอย่าง API แล้ว');
  $('#apSchema').onclick=()=>copyText(schema,'คัดลอกโครงสร้างแล้ว');
  $('#apCsv').onclick=()=>download('12plus_api_status.csv',[csvRow(['code','product','indicator','unit','agency','status','resource_id']),...P.flatMap(p=>p.inds.map(d=>csvRow([d.code,p.name,d.n,d.u,d.ag,ST_LABEL[DS.status(d)],(SET.res||{})[p.id]||''])))].join('\n'));
  $('#apCheck').onclick=async()=>{const m=$('#apMsg');m.textContent='กำลังตรวจการเชื่อมต่อ…';
    try{const r=await DS.ping();m.textContent=r.ok?`เชื่อมต่อระบบบัญชีข้อมูลได้ · ${nf.format(r.count)} ชุดข้อมูลบนระบบ · ${r.ms} ms`:'ระบบตอบกลับแต่ไม่สำเร็จ';logAdd(m.textContent,'api')}
    catch(e){m.textContent='ยังเชื่อมต่อระบบบัญชีข้อมูลจากเครื่องนี้ไม่ได้ ('+e.message+') · ตรวจที่อยู่ API ในหน้า ตั้งค่าระบบ';logAdd('ตรวจ API ไม่สำเร็จ: '+e.message,'err')}
    const L=P.filter(p=>(SET.res||{})[p.id]);for(const p of L){m.textContent=`กำลังดึง ${p.name}…`;await DS.loadProduct(p)}
    if(L.length){m.textContent=`ตรวจครบ ${L.length} สินค้าที่ผูกชุดข้อมูล`;setTimeout(()=>render(true),600)}};
};

/* ================= ตั้งค่าระบบ ================= */
PAGE_R.settings=page=>{
  const colors=['#0F4A37','#1F5F8B','#6B3FA0','#9C3F27','#3F3F46'];
  page.innerHTML=`
  <div class="ph-title"><div><span class="eyebrow">Settings</span><h1>ตั้งค่าระบบ</h1><p>ค่าที่บันทึกเก็บในเบราว์เซอร์เครื่องนี้ ไม่กระทบผู้ใช้อื่น · ผู้ดูแลระบบ: สำนักงานจังหวัดหนองบัวลำภู และ สำนักงานสถิติจังหวัดหนองบัวลำภู</p></div></div>
  <div class="grid-2e">
    <section class="card"><div class="card-h"><h3>การแสดงผล</h3></div><div class="form">
      <div class="fld"><label>ธีม</label><div class="seg" role="group"><button type="button" data-th="auto" aria-pressed="${SET.theme==='auto'}">ตามเครื่อง</button><button type="button" data-th="light" aria-pressed="${SET.theme==='light'}">สว่าง</button><button type="button" data-th="dark" aria-pressed="${SET.theme==='dark'}">มืด</button></div></div>
      <div class="fld"><label>สีหลักของระบบ</label><div class="swatches">${colors.map(c=>`<button type="button" data-col="${c}" style="background:${c}" aria-label="สี ${c}" aria-pressed="${SET.accent===c}"></button>`).join('')}</div><span class="hint">ใช้กับปุ่ม เมนูที่เลือก และกราฟหลัก (ธีมสว่าง)</span></div>
      <div class="fld"><label><input type="checkbox" id="sVid" ${SET.video?'checked':''}> เล่นวิดีโอสินค้าในส่วนหัว</label><span class="hint">ปิดเพื่อประหยัดอินเทอร์เน็ตบนมือถือ</span></div>
      <div class="fld"><label for="sMode">มุมมองเริ่มต้น</label><select class="inp" id="sMode"><option value="Y"${SET.mode==='Y'?' selected':''}>รายปี</option><option value="M"${SET.mode==='M'?' selected':''}>รายเดือน</option></select></div></div></section>
    <section class="card"><div class="card-h"><h3>โหมดจอนำเสนอ</h3></div><div class="form">
      <div class="fld"><label for="sK">เปลี่ยนหน้าทุก (วินาที)</label><input class="inp" id="sK" type="number" min="8" max="120" value="${SET.kioskSec}"><span class="hint">เริ่มด้วยปุ่ม “จอนำเสนอ” บนแถบด้านบน หมุนภาพรวมและสินค้าทั้ง 14 รายการ เหมาะกับจอห้องประชุมหรือโถงต้อนรับ</span></div>
      <div class="row"><button class="btn btn-f" type="button" data-act="kiosk">${ic('monitor')} เริ่มจอนำเสนอตอนนี้</button><button class="btn btn-o" type="button" data-act="present">${ic('play')} นำเสนอเต็มจอ</button></div></div></section>
  </div>
  <section class="card"><div class="card-h"><h3>การเชื่อมต่อระบบบัญชีข้อมูลจังหวัด (API)</h3><a class="note" href="apistatus.html">ศูนย์ควบคุมแหล่งข้อมูล ›</a></div><div class="form">
    <div class="fld"><label for="sApi">ที่อยู่ API (CKAN action)</label><input class="inp" id="sApi" value="${esc(SET.apiBase)}"><span class="hint">ค่าเริ่มต้น ${APP.apiBase}</span></div>
    <div class="fld"><label>Resource ID ของชุดข้อมูลแต่ละสินค้า</label><div class="res-grid">${P.map(p=>`<label><span>${pad2(p.id)} ${esc(p.name)}</span><input class="inp" data-res="${p.id}" value="${esc((SET.res||{})[p.id]||'')}" placeholder="รอข้อมูลเข้าระบบ"></label>`).join('')}</div></div>
    <div class="fld"><label for="sGas">Google Apps Script Web App (รับข้อมูลจากหน้า กรอกข้อมูล)</label><input class="inp" id="sGas" value="${esc(SET.gas)}" placeholder="https://script.google.com/macros/s/…/exec"><span class="hint">ต้องลงท้ายด้วย /exec · ตรวจรหัสหน่วยงาน (PIN) ฝั่งเซิร์ฟเวอร์</span></div>
    <div class="row"><button class="btn btn-f" type="button" id="sSave">${ic('check')} บันทึกการตั้งค่า</button><button class="btn btn-o" type="button" id="sTest">${ic('refresh')} ทดสอบการเชื่อมต่อ</button><span class="note" id="sMsg"></span></div></div></section>
  <div class="grid-2e">
    <section class="card"><div class="card-h"><h3>หน่วยความจำเบราว์เซอร์</h3></div><div class="row">
      <button class="btn btn-g" type="button" id="sClear">${ic('refresh')} ล้างแคชข้อมูล API</button><button class="btn btn-g" type="button" id="sExp">${ic('down')} ส่งออกการตั้งค่า (JSON)</button>
      <label class="btn btn-g" style="cursor:pointer">${ic('copy')} นำเข้าการตั้งค่า<input type="file" id="sImp" accept=".json" hidden></label><button class="btn btn-o" type="button" id="sReset">คืนค่าเริ่มต้นทั้งหมด</button></div>
      <p class="note" style="font-size:13px;margin:10px 0 0">ล้างแคชไม่ลบการตั้งค่าและร่างข้อมูลที่กรอกไว้</p></section>
    <section class="card"><div class="card-h"><h3>พื้นที่ผู้ดูแลระบบ</h3></div><p style="margin:0;font-size:14px">การจัดการรหัสหน่วยงาน (สุ่มรหัสใหม่ ปลดล็อก เปิด/ปิดหน่วยงาน) ทำผ่าน Google Apps Script ที่เชื่อมไว้ด้านบน ระบบเก็บเฉพาะค่าแฮชของรหัส จึงไม่มีรหัสอยู่ในหน้าเว็บนี้</p>
      <div class="row" style="margin-top:12px"><a class="btn btn-f" href="entry.html">${ic('lock')} ไปหน้ากรอกข้อมูล</a></div></section>
  </div>`;
  $$('[data-th]',page).forEach(b=>b.onclick=()=>{SET.theme=b.dataset.th;saveSet();render(true)});
  $$('[data-col]',page).forEach(b=>b.onclick=()=>{SET.accent=b.dataset.col;saveSet();render(true)});
  $('#sVid').onchange=e=>{SET.video=e.target.checked;saveSet();toast('บันทึกแล้ว')};
  $('#sMode').onchange=e=>{SET.mode=e.target.value;S.mode=e.target.value;savePeriod();saveSet();toast('บันทึกแล้ว')};
  $('#sK').onchange=e=>{SET.kioskSec=Math.max(8,+e.target.value||20);saveSet();toast('บันทึกแล้ว')};
  $('#sSave').onclick=()=>{SET.apiBase=$('#sApi').value.trim()||APP.apiBase;SET.gas=$('#sGas').value.trim();SET.res={};$$('[data-res]').forEach(i=>{if(i.value.trim())SET.res[i.dataset.res]=i.value.trim()});saveSet();logAdd('บันทึกการตั้งค่าการเชื่อมต่อ');$('#sMsg').textContent='บันทึกแล้ว';P.forEach(p=>p._loaded=0)};
  $('#sTest').onclick=async()=>{const m=$('#sMsg');m.textContent='กำลังทดสอบ…';SET.apiBase=$('#sApi').value.trim()||APP.apiBase;try{const r=await DS.ping();m.textContent=r.ok?`เชื่อมต่อได้ · ${nf.format(r.count)} ชุดข้อมูล · ${r.ms} ms`:'ระบบตอบกลับแต่ไม่สำเร็จ'}catch(e){m.textContent='เชื่อมต่อไม่ได้: '+e.message}};
  $('#sClear').onclick=()=>{DS.cache={};store.set('nbl12-cache',{});P.forEach(p=>p._loaded=0);toast('ล้างแคชข้อมูล API แล้ว')};
  $('#sExp').onclick=()=>download('12plus_settings.json',JSON.stringify(SET,null,2),'application/json');
  $('#sImp').onchange=e=>{const f=e.target.files[0];if(!f)return;f.text().then(t=>{try{SET=Object.assign({},DEF_SET,JSON.parse(t));saveSet();toast('นำเข้าการตั้งค่าแล้ว');render(true)}catch(x){toast('ไฟล์ไม่ถูกต้อง')}})};
  $('#sReset').onclick=e=>{const b=e.currentTarget;if(!b.dataset.arm){b.dataset.arm=1;b.textContent='กดอีกครั้งเพื่อยืนยัน';setTimeout(()=>{delete b.dataset.arm;b.textContent='คืนค่าเริ่มต้นทั้งหมด'},2500);return}SET=Object.assign({},DEF_SET);saveSet();toast('คืนค่าเริ่มต้นแล้ว');render(true)};
};

/* ================= กรอกข้อมูล ================= */
PAGE_R.entry=page=>{
  const qp=+(R.q&&R.q.get('p'))||store.sget('nbl12-entry-p',0);let pid=byId(qp)?qp:0,ch=store.sget('nbl12-entry-c',0);
  const draftKey=id=>'nbl12-draft-'+id;
  const draw=()=>{
    const p=pid?byId(pid):null;const draft=p?store.get(draftKey(p.id),{}):{};
    page.style.setProperty('--pa',p?p.pa:'#0F4A37');
    page.innerHTML=`
    <div class="ph-title"><div><span class="eyebrow">Data entry</span><h1>กรอกข้อมูล</h1><p>สำหรับหน่วยงานเจ้าของข้อมูล กรอกทีละสินค้า ทีละหมวด เพื่อลดความผิดพลาด บันทึกร่างไว้ในเครื่องได้ แล้วส่งเข้าระบบหรือดาวน์โหลด CSV ไปนำขึ้นระบบบัญชีข้อมูลจังหวัด</p></div>
      <button class="btn btn-g" type="button" id="eTpl">${ic('down')} แม่แบบ CSV ทั้ง 14 สินค้า</button></div>
    <div class="steps"><span class="${!p?'on':''}">1 เลือกสินค้า</span><span class="${p?'on':''}">2 เลือกหมวดและกรอกค่า</span><span>3 ตรวจและส่ง</span></div>
    <section class="card"><div class="card-h"><h3>เลือกสินค้า</h3>${p?`<span class="note">หน่วยงานหลัก: ${esc(p.agency)}</span>`:''}</div>
      <div class="pick">${P.map(x=>`<button type="button" data-p="${x.id}" aria-pressed="${x.id===pid}">${badge(x,{label:false})}<span>${pad2(x.id)} ${esc(x.name)}</span></button>`).join('')}</div></section>
    ${p?`<section class="card"><div class="card-h"><h3>${esc(p.name)} · กรอกค่ารายการข้อมูล</h3><div class="tabs" role="tablist" style="margin:0">${CHAPTERS.map(c=>`<button type="button" role="tab" data-c="${c.k}" aria-selected="${c.k===ch}">${pad2(c.k+1)} ${c.t}</button>`).join('')}</div></div>
      <div class="scroll-x"><table class="t etable"><thead><tr><th>รหัส</th><th>รายการข้อมูล</th><th>หน่วย</th><th>ค่า</th><th>ปีข้อมูล</th><th>หมายเหตุ</th><th>ค่าปัจจุบัน</th></tr></thead><tbody>
      ${p.inds.filter(d=>d.s===ch).map(d=>{const v=draft[d.code]||{};return`<tr><td><code>${d.code}</code></td><td>${esc(d.n)}<br><span class="note">${esc(d.ag)}</span></td><td>${esc(d.u)}</td><td><input class="inp" data-k="${d.code}" data-f="v" value="${esc(v.v??'')}" inputmode="decimal" aria-label="ค่า ${esc(d.n)}"></td><td><input class="inp" data-k="${d.code}" data-f="y" value="${esc(v.y??LAST.y)}" style="max-width:90px" aria-label="ปีข้อมูล"></td><td><input class="inp" data-k="${d.code}" data-f="n" value="${esc(v.n??'')}" aria-label="หมายเหตุ"></td><td>${pill(DS.status(d))}</td></tr>`}).join('')}</tbody></table></div>
      ${ch===2?`<div class="card" style="box-shadow:none;margin-top:14px;background:var(--surface-2)"><div class="card-h"><h3>ร้านค้า / แหล่งซื้อ (ไม่บังคับ)</h3></div><div class="res-grid">${[['nick','ชื่อร้านที่คนรู้จัก'],['name','ชื่อร้านทางการ'],['addr','ที่อยู่'],['tel','โทร'],['line','LINE'],['fb','Facebook'],['ig','Instagram'],['map','คำค้นแผนที่']].map(([k,t])=>`<label><span>${t}</span><input class="inp" data-shop="${k}" value="${esc((draft._shop||{})[k]||'')}"></label>`).join('')}</div></div>`:''}
    </section>
    <section class="card"><div class="card-h"><h3>ตรวจและส่ง</h3><span class="note" id="eCnt"></span></div><div class="form">
      <div class="res-grid"><label><span>หน่วยงานผู้ส่ง</span><select class="inp" id="eAg">${AGENCIES.map(a=>`<option${p.agency.includes(a.replace('สนง.',''))?' selected':''}>${a}</option>`).join('')}</select></label><label><span>รหัสหน่วยงาน (PIN)</span><input class="inp" id="ePin" type="password" autocomplete="off" placeholder="ใช้เมื่อส่งเข้าระบบ"></label></div>
      <div class="row"><button class="btn btn-g" type="button" id="eSave">${ic('check')} บันทึกร่าง (เครื่องนี้)</button><button class="btn btn-g" type="button" id="eCsv">${ic('down')} ดาวน์โหลด CSV สำหรับนำขึ้นระบบบัญชีข้อมูล</button><button class="btn btn-p" type="button" id="eSend">${ic('db')} ส่งเข้าระบบ</button><span class="note" id="eMsg"></span></div>
      <p class="note" style="font-size:13px;margin:0">${SET.gas?'ส่งไปยัง Google Apps Script ที่ตั้งค่าไว้ ระบบตรวจรหัสหน่วยงานฝั่งเซิร์ฟเวอร์':'ยังไม่ได้ตั้งค่า Google Apps Script · ใช้ “ดาวน์โหลด CSV” แล้วนำขึ้นระบบบัญชีข้อมูลจังหวัด หรือตั้งค่าที่หน้า ตั้งค่าระบบ'}</p></div></section>`:''}`;
    $$('[data-p]',page).forEach(b=>b.onclick=()=>{pid=+b.dataset.p;store.sset('nbl12-entry-p',pid);ch=0;draw()});
    $('#eTpl').onclick=()=>download('12plus_template_all.csv',[csvRow(['code','product','chapter','indicator','unit','agency','year','month','value','note']),...P.flatMap(x=>x.inds.map(d=>csvRow([d.code,x.name,CHAPTERS[d.s].t,d.n,d.u,d.ag,LAST.y,'','',''])))].join('\n'));
    if(!p)return;
    const collect=()=>{const dr=store.get(draftKey(p.id),{});$$('[data-k]',page).forEach(i=>{const o=dr[i.dataset.k]=dr[i.dataset.k]||{};o[i.dataset.f]=i.value.trim()});
      const sh=$$('[data-shop]',page);if(sh.length){dr._shop=dr._shop||{};sh.forEach(i=>dr._shop[i.dataset.shop]=i.value.trim())}store.set(draftKey(p.id),dr);return dr};
    const count=()=>{const dr=store.get(draftKey(p.id),{});const n=Object.keys(dr).filter(k=>k!=='_shop'&&dr[k].v).length;$('#eCnt').textContent=`กรอกแล้ว ${n} จาก ${p.inds.length} รายการ`};
    count();
    $$('[data-c]',page).forEach(b=>b.onclick=()=>{collect();ch=+b.dataset.c;store.sset('nbl12-entry-c',ch);draw()});
    $$('[data-k],[data-shop]',page).forEach(i=>i.onchange=()=>{collect();count()});
    $('#eSave').onclick=()=>{collect();count();toast('บันทึกร่างในเครื่องนี้แล้ว')};
    const rows=()=>{const dr=collect();return p.inds.filter(d=>dr[d.code]&&dr[d.code].v).map(d=>({code:d.code,year:dr[d.code].y||LAST.y,month:'',value:dr[d.code].v,unit:d.u,agency:d.ag,note:dr[d.code].n||''}))};
    $('#eCsv').onclick=()=>{const L=rows();if(!L.length){toast('ยังไม่มีค่าที่กรอก');return}download(`12plus_${p.code}_${p.name}.csv`,[csvRow(['code','year','month','value','unit','agency','note']),...L.map(r=>csvRow([r.code,r.year,r.month,r.value,r.unit,r.agency,r.note]))].join('\n'))};
    $('#eSend').onclick=async()=>{const L=rows(),m=$('#eMsg');if(!L.length){m.textContent='ยังไม่มีค่าที่กรอก';return}
      if(!SET.gas){m.textContent='ยังไม่ได้ตั้งค่าปลายทาง · ดาวน์โหลด CSV แทน';return}if(!$('#ePin').value){m.textContent='กรุณากรอกรหัสหน่วยงาน';return}
      m.textContent='กำลังส่ง…';try{await fetch(SET.gas,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain'},body:JSON.stringify({action:'submit',product:p.code,agency:$('#eAg').value,pin:$('#ePin').value,rows:L,shop:store.get(draftKey(p.id),{})._shop||null})});
        m.textContent=`ส่ง ${L.length} รายการแล้ว · ระบบจะตรวจรหัสและบันทึก`;logAdd(`${p.name}: ส่งข้อมูล ${L.length} รายการเข้าระบบ`);$('#ePin').value=''}catch(e){m.textContent='ส่งไม่สำเร็จ: '+e.message}};
  };
  draw();
};
