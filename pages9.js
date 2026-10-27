/* =====================================================================
   12 Plus+ · pages9.js — TOOLTIP + MACHINE-READABLE + เชื่อม API รายรายการ
   · tooltip สวยทุกจุด: รายการข้อมูล · สินค้า · KPI · ปุ่มทุกปุ่ม (แทน title เดิม) · กราฟ
   · ทุกรายการมี "บรรทัดข้อมูลเครื่องอ่านได้" 1 บรรทัด + คัดลอก
   · วาง resource_id / ลิงก์ชุดข้อมูลจากระบบบัญชีข้อมูล → ดึง API แล้ววาดใหม่ทันที
   ===================================================================== */
const TIP=(()=>{
  const H=document.documentElement;
  /* ภาพพื้นหลัง tooltip รายสินค้า (img/tip-XX.webp) — เปิดเมื่อมีไฟล์ */
  const ASSETS={tips:true};if(ASSETS.tips)H.classList.add('has-tips');
  const REG=new Map();let box=null,cur=null,hideT=0,showT=0;
  const DIM_TH={year:'ปี',dist:'อำเภอ',type:'ประเภท'},DIM_EN={year:'year',dist:'district',type:'type'};
  const FORM_HELP={rank:['เรียงอำเภอจากมากไปน้อยในปีล่าสุด เห็นทันทีว่าอำเภอไหนเป็นแหล่งหลัก','Districts ranked for the latest year'],
    stack:['แท่งรายปี แต่ละสีคืออำเภอ เห็นทั้งยอดรวมและส่วนของแต่ละอำเภอ','Yearly bars split by district'],
    flow:['เส้นแนวโน้มมูลค่ารายปี ดูการเติบโตต่อเนื่อง','Value trend by year'],
    band:['เส้นกลางคือราคาเฉลี่ย แถบรอบคือช่วงต่ำสุด–สูงสุด','Average price with low–high band'],
    cost:['แท่งต้นทุนแยกองค์ประกอบ ดูว่าส่วนไหนกินต้นทุนมากที่สุด','Cost broken down by component'],
    share:['วงแหวนสัดส่วนของแต่ละกลุ่มในปีล่าสุด','Share of each group, latest year'],
    tally:['จำนวนรายปี เปรียบเทียบความเปลี่ยนแปลง','Count by year'],
    tallyd:['การกระจายรายอำเภอ ยิ่งกลีบใหญ่ยิ่งมาก','Spread across districts'],
    growth:['เปรียบเทียบรายปี พร้อมอัตราเปลี่ยนแปลง','Year-on-year comparison'],
    cal:['ปฏิทิน 12 เดือน สีเข้มคือช่วงพีค','12-month calendar, darker = peak'],
    status:['ขั้นตอนการดำเนินงาน วงเต็มคือผ่านแล้ว','Milestones, filled = done']};

  /* ---------- กล่อง tooltip ---------- */
  function ensure(){if(box)return box;box=document.createElement('div');box.className='tipbox';box.setAttribute('role','tooltip');box.id='tipbox';document.body.appendChild(box);
    box.addEventListener('pointerenter',()=>clearTimeout(hideT));box.addEventListener('pointerleave',()=>hide(120));return box}
  function place(el){const b=ensure(),r=el.getBoundingClientRect(),bw=b.offsetWidth,bh=b.offsetHeight,M=10;
    let top=r.top-bh-12,arrow='down';if(top<70){top=r.bottom+12;arrow='up'}
    let left=Math.min(Math.max(M,r.left+r.width/2-bw/2),innerWidth-bw-M);
    b.style.top=Math.max(M,top)+'px';b.style.left=left+'px';b.dataset.arrow=arrow;b.style.setProperty('--ax',Math.min(bw-18,Math.max(18,r.left+r.width/2-left))+'px')}
  function content(el){const k=el.dataset.tipk;if(k&&REG.has(k))return REG.get(k)();if(k&&k.startsWith('item:'))return itemTip(k.slice(5));if(k&&k.startsWith('prod:'))return prodTip(+k.slice(5));
    const t=el.dataset.tip;return t?`<div class="tp-s">${esc(t)}</div>`:''}
  function show(el,now){clearTimeout(hideT);clearTimeout(showT);showT=setTimeout(()=>{const html=content(el);if(!html)return;const b=ensure();cur=el;
      b.innerHTML=html;b.dataset.pid=el.closest('[data-tip-pid]')?.dataset.tipPid||el.dataset.tipPid||document.body.dataset.pid||'';
      b.classList.toggle('rich',!!el.dataset.tipk);b.style.setProperty('--pa',el.closest('[style*="--pa"]')?getComputedStyle(el.closest('[style*="--pa"]')).getPropertyValue('--pa'):css('--pa'));
      b.classList.add('on');place(el);el.setAttribute('aria-describedby','tipbox')},now?0:(el.dataset.tipk?260:420))}
  function hide(ms=80){clearTimeout(showT);hideT=setTimeout(()=>{if(box)box.classList.remove('on');if(cur)cur.removeAttribute('aria-describedby');cur=null},ms)}
  /* แปลง title เดิมเป็น tooltip สวย */
  const adopt=el=>{if(el.hasAttribute('title')&&!el.dataset.tip){el.dataset.tip=el.getAttribute('title');if(!el.getAttribute('aria-label'))el.setAttribute('aria-label',el.getAttribute('title'));el.removeAttribute('title')}};
  const target=e=>{const t=e.target.closest&&e.target.closest('[data-tip],[data-tipk],[title]');if(t&&!t.closest('.tipbox')&&!t.closest('svg.bdg')){adopt(t);return t}return null};
  document.addEventListener('pointerover',e=>{if(e.pointerType==='touch')return;const t=target(e);if(t&&t!==cur)show(t)});
  document.addEventListener('pointerout',e=>{if(e.pointerType==='touch')return;const t=target(e);if(t&&(!e.relatedTarget||!t.contains(e.relatedTarget)))hide(t.dataset.tipk?220:60)});
  document.addEventListener('focusin',e=>{const t=target(e);if(t)show(t,true)});document.addEventListener('focusout',()=>hide());
  /* มือถือ: แตะปุ่ม ⓘ เพื่อเปิด แตะที่อื่นเพื่อปิด */
  document.addEventListener('click',e=>{const i=e.target.closest('.tip-i');if(i){e.preventDefault();e.stopPropagation();if(cur===i&&box?.classList.contains('on'))hide(0);else show(i,true);return}if(!e.target.closest('.tipbox'))hide(0)},true);
  addEventListener('scroll',()=>{if(cur&&box?.classList.contains('on'))place(cur)},{passive:true});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')hide(0)});

  /* ---------- เนื้อหา tooltip ---------- */
  function itemOf(code){const b=(typeof STY!=='undefined'&&STY.list||[]).find(x=>x.d.code===code);if(b)return b;
    for(const p of P){const d=p.inds.find(x=>x.code===code);if(d){const form=styForm(d,p,DATASETS.find(x=>x.code===code));const rows=stySim(d,p,form);return{d,p,form,item:d.n.replace(/\s*\(จำแนกอำเภอ\)/,''),en:ITEM_EN[d.n]||'',rows,unit:rows.unit||d.u,real:false,agency:d.ag}}}return null}
  function dims(b){const A=styAgg(b.rows);const ds=['year'];if(A.ds.length)ds.push('dist');if(A.ts.length>1||!(A.ts[0]==='รวม'))ds.push('type');return{ds,A}}
  function mrLine(b){const {ds,A}=dims(b);const rid=((SET.dsres||{})[b.d.code]||b.ds?.resource||'').trim();
    return[b.d.code,b.item,b.en,'unit='+b.unit,'dims='+ds.map(k=>DIM_EN[k]).join(','),'years='+(A.ys.length?yCE(A.ys[0])+'-'+yCE(A.ly):'-'),
      A.ts.length>1?'types='+A.ts.length:null,'agency='+(b.agency||''),'status='+(b.real?(rid?'api':'file'):'simulated'),'resource_id='+(rid||'-')].filter(Boolean).join(' | ')}
  function itemTip(code){const b=itemOf(code);if(!b)return'';const p=b.p,{ds,A}=dims(b),k=styKpi(b),ch=CH_META[b.d.s];const help=FORM_HELP[b.form]||['',''];
    const rid=((SET.dsres||{})[b.d.code]||b.ds?.resource||'').trim();
    const what=L(`${esc(b.item)}ของ${esc(p.name)} จังหวัดหนองบัวลำภู ${ds.length>1?'แยกตาม'+ds.slice(1).map(x=>DIM_TH[x]).join(' และ ')+' ':''}รายปี ${A.ys.length?yCE(A.ys[0])+'–'+yCE(A.ly):''} หน่วยเป็น “${esc(b.unit)}”`,
      `${esc(b.en)} for ${esc(p.en)}, Nong Bua Lam Phu${ds.length>1?', by '+ds.slice(1).map(x=>DIM_EN[x]).join(' and '):''}, yearly ${A.ys.length?yCE(A.ys[0])+'–'+yCE(A.ly):''}, unit “${esc(uLab(b.unit))}”`);
    const st=b.real?`<span class="pill real">${L('ข้อมูลจริง','Real data')}${rid?' · API':''}</span>`:`<span class="pill sim">${L('ข้อมูลจำลอง','Simulated')}</span>`;
    return`<div class="tp-h"><span class="tp-code">${b.d.code}</span><span class="tp-ch">0${b.d.s+1} · ${ch.k}</span>${st}</div>
      <div class="tp-t">${esc(L(b.item,b.en))}</div><div class="tp-en">${esc(L(b.en,b.item))}</div>
      <p class="tp-what">${what}</p>
      <div class="tp-big"><b>${k.v}</b><span>${k.u} · ${L('ปี','')} ${yCE(A.ly||2569)}</span></div>
      <dl class="tp-dl">
        <div><dt>${L('ภาพนี้บอกอะไร','How to read')}</dt><dd>${L(help[0],help[1])}</dd></div>
        <div><dt>${L('มิติข้อมูล','Dimensions')}</dt><dd>${ds.map(x=>L(DIM_TH[x],DIM_EN[x])).join(' · ')}${A.ts.length>1?` <small>(${A.ts.length} ${L('ประเภท','types')})</small>`:''}</dd></div>
        <div><dt>${L('เจ้าของข้อมูล','Data owner')}</dt><dd>${esc(b.agency||'–')}</dd></div>
        <div><dt>resource_id</dt><dd class="mono">${esc(rid||L('ยังไม่เชื่อม','not linked'))}</dd></div>
      </dl>
`}
  function prodTip(id){const p=byId(id);if(!p)return'';const ch=[0,1,2].map(s=>p.inds.filter(d=>d.s===s).length);const ds=DATASETS.filter(d=>d.pid===id).length;const ags=[...new Set(p.inds.map(d=>d.ag))];
    return`<div class="tp-h"><span class="tp-code">No. ${pad2(id)}</span>${p.gi?'<span class="pill gi">GI</span>':''}<span class="pill ${ds?'real':'wait'}">${ds?L('มีไฟล์ ','Files: ')+ds:L('รอไฟล์ข้อมูล','Awaiting files')}</span></div>
      <div class="tp-t">${esc(pname(p))}</div><div class="tp-en">${esc(L(p.en,p.name))}</div>
      <div class="tp-chs">${ch.map((n,i)=>`<span><b>${n}</b><small>${CH_META[i].k}</small></span>`).join('')}</div>
      <dl class="tp-dl"><div><dt>${L('รายการตามแบบสำรวจ','Survey items')}</dt><dd>${p.inds.length} ${L('รายการ','items')}</dd></div>
        <div><dt>${L('หน่วยงานเจ้าของข้อมูล','Data owners')}</dt><dd>${ags.slice(0,3).map(esc).join(' · ')}${ags.length>3?` <small>+${ags.length-3}</small>`:''}</dd></div></dl>`}

  /* ---------- Chart.js tooltip สวย + ท้ายบอกชื่อรายการ/หน่วย/แหล่ง ---------- */
  function chartTheme(){if(!window.Chart)return;const dk=isDark();const T=Chart.defaults.plugins.tooltip;
    Object.assign(T,{backgroundColor:dk?'rgba(29,15,25,.96)':'rgba(255,255,255,.97)',titleColor:dk?'#FFD9EA':'#2C1A23',bodyColor:dk?'#F8E9F1':'#3A1F2E',footerColor:dk?'#C7A3B7':'#8C6F7D',
      borderColor:dk?'rgba(255,140,194,.35)':'rgba(232,85,154,.35)',borderWidth:1,padding:{x:14,y:12},cornerRadius:14,caretSize:8,caretPadding:8,boxPadding:6,usePointStyle:true,
      titleFont:{family:'Kanit, Sarabun, sans-serif',size:15,weight:'600'},bodyFont:{family:'Sarabun, Kanit, sans-serif',size:14.5},footerFont:{family:'Sarabun, Kanit, sans-serif',size:12.5,weight:'400'},titleMarginBottom:8,footerMarginTop:10})}
  if(typeof styCfg==='function'){const _sc=styCfg;styCfg=function(b,big){const c=_sc(b,big);if(!c)return c;c.options=c.options||{};c.options.plugins=c.options.plugins||{};const tp=c.options.plugins.tooltip=c.options.plugins.tooltip||{};tp.callbacks=tp.callbacks||{};
    tp.callbacks.footer=()=>[`${b.d.code} · ${L(b.item,b.en)}`,`${L('หน่วย','Unit')}: ${uLab(b.unit)} · ${b.real?L('ข้อมูลจริง','Real data'):L('ข้อมูลจำลอง','Simulated')}`];
    if(!tp.callbacks.title)tp.callbacks.title=items=>items[0]?.label?String(items[0].label):'';return c}}

  /* ---------- บรรทัดเครื่องอ่านได้ + เชื่อม API ในทุกบล็อก ---------- */
  if(typeof styBlock==='function'){const _sb=styBlock;styBlock=function(b,i){let h=_sb(b,i);const rid=((SET.dsres||{})[b.d.code]||'').trim();
    h=h.replace(/(<div class="stb-tools"[^>]*>)/,`$1<button type="button" class="ib tip-i" data-tipk="item:${b.d.code}" aria-label="${L('รายละเอียดข้อมูล','Data details')}">${ic('help')}</button>`);
    h=h.replace(/(<label class="ib"[^>]*>)/,`<button type="button" class="ib api-b${rid?' on':''}" data-mr="api" title="${L('เชื่อม API จากระบบบัญชีข้อมูล (วาง resource_id)','Link catalog API (paste resource_id)')}">${ic('api')}</button>$1`);
    h=h.replace('<h4>',`<h4 data-tipk="item:${b.d.code}" tabindex="0">`);
    const mr=`<form class="stb-api" hidden><label>${ic('db')}<span>${L('วาง resource_id หรือลิงก์ชุดข้อมูลจาก','Paste a resource_id or dataset link from')} <b>gdcatalog</b></span></label>
      <div><input type="text" inputmode="url" spellcheck="false" value="${esc(rid)}" placeholder="เช่น 3f2a…-…  หรือ  https://nongbualamphu.gdcatalog.go.th/dataset/…/resource/…"><button type="submit" class="btn btn-p sm">${L('ดึงข้อมูล','Fetch')}</button>${rid?`<button type="button" class="btn btn-o sm" data-mr="unlink">${L('ยกเลิก','Unlink')}</button>`:''}</div>
      <p class="mr-hint">${L('ตารางต้องมีคอลัมน์: ปี · จังหวัด · อำเภอ · รายการ · ประเภท · ค่าของข้อมูล · หน่วย · แหล่งที่มา — ดึงสำเร็จแล้วภาพและตาราง “เปลี่ยนเป็นข้อมูลจริง” ทันที','Columns: year · province · district · item · type · value · unit · source — visuals switch to real data instantly')}</p></form>`;
    return h.replace(/<\/article>\s*$/,mr+'</article>')}}
  const ridOf=v=>{v=(v||'').trim();const m=v.match(/resource\/([0-9a-f-]{8,})/i)||v.match(/resource_id=([0-9a-f-]{8,})/i);return m?m[1]:v};
  async function fetchItem(code){const rid=((SET.dsres||{})[code]||'').trim();if(!rid)return false;
    try{const d=await DS.get(`/datastore_search?resource_id=${encodeURIComponent(rid)}&limit=10000`);const rec=d?.result?.records||[];
      const rows=dsNorm(rec).filter(r=>r.value!=null);if(!rows.length)throw new Error(L('ไม่พบแถวที่มีค่าในคอลัมน์ “ค่าของข้อมูล”','No rows with values'));rows.forEach(r=>{if(!r.dist)r.dist='รวมทั้งจังหวัด'});
      const it=STY.list.find(x=>x.d.code===code);STY.real[code]=Object.assign(rows,{unit:rows.find(r=>r.unit)?.unit||it?.unit,name:'API · '+rec.length+L(' แถว',' rows')});
      if(typeof logAdd==='function')logAdd(`${code}: ดึงจาก API ${rec.length} แถว`,'api');return true}
    catch(e){toast(L('ดึงข้อมูลไม่สำเร็จ: ','Fetch failed: ')+(e.message||e));return false}}
  if(typeof styBind1==='function'){const _b1=styBind1;styBind1=function(el){_b1(el);if(!el)return;const code=el.dataset.code;
    const line=$('.stb-mr code',el),f=$('.stb-api',el);
    const copy=()=>{const t=line.textContent;(navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(()=>toast(L('คัดลอกบรรทัดข้อมูลแล้ว','Copied'))).catch(()=>{const r=document.createRange();r.selectNodeContents(line);getSelection().removeAllRanges();getSelection().addRange(r);toast(L('เลือกข้อความแล้ว กด Ctrl+C','Selected — press Ctrl+C'))})};
    if(line)line.onclick=copy;$$('[data-mr]',el).forEach(bt=>bt.onclick=async()=>{const k=bt.dataset.mr;
      if(k==='copy')copy();else if(k==='api'){f.hidden=!f.hidden;if(!f.hidden)$('input',f).focus()}
      else if(k==='unlink'){SET.dsres=SET.dsres||{};delete SET.dsres[code];saveSet();delete STY.real[code];toast(L('ยกเลิกการเชื่อมแล้ว','Unlinked'));styRe(code)}});
    if(f)f.onsubmit=async e=>{e.preventDefault();const rid=ridOf($('input',f).value);if(!rid){toast(L('กรุณาวาง resource_id','Paste a resource_id'));return}
      SET.dsres=SET.dsres||{};SET.dsres[code]=rid;saveSet();toast(L('กำลังดึงข้อมูลจาก API…','Fetching…'));if(await fetchItem(code)){toast(L('วาดจากข้อมูลจริงแล้ว','Redrawn with real data'));styRe(code)}}}}
  /* โหลดอัตโนมัติ: รายการที่เคยวาง resource_id ไว้ */
  if(typeof styBind==='function'){const _sb2=styBind;styBind=function(p,root){_sb2(p,root);Object.keys(SET.dsres||{}).forEach(code=>{if(code.startsWith(p.code+'-')&&!STY.real[code]&&!(STY.list.find(b=>b.d.code===code)?.ds))fetchItem(code).then(ok=>{if(ok)styRe(code)})})}}

  /* ---------- ติด tooltip สินค้า/KPI หลัง render ---------- */
  function decorate(){const page=$('#page');
    $$('#navP a').forEach(a=>{const m=(a.getAttribute('href')||'').match(/p(\d+)\.html/);if(m){a.dataset.tipk='prod:'+(+m[1]);a.dataset.tipPid=pad2(+m[1])}});
    $$('.rdy-c,.tile,.pn a,.chip-no',page||document).forEach(a=>{const m=(a.getAttribute('href')||'').match(/p(\d+)\.html/);if(m&&!a.dataset.tipk){a.dataset.tipk='prod:'+(+m[1]);a.dataset.tipPid=pad2(+m[1])}});
    $$('.sh-k',page||document).forEach(a=>{const c=(a.getAttribute('href')||'').replace('#sb-','');if(c)a.dataset.tipk='item:'+c});
    $$('.kpi',page||document).forEach(k=>{if(k.dataset.tip)return;const l=k.querySelector('.l')?.textContent||'',v=k.querySelector('.v')?.textContent||'',d=k.querySelector('.d')?.textContent||'',s=k.querySelector('.src')?.textContent||'';k.dataset.tip=[l+': '+v,d,s].filter(x=>x&&x.trim()).join(' — ')});
    $$('.stb-tools [data-sbv]').forEach(b=>{if(!b.dataset.tip)b.dataset.tip=b.textContent.trim()});
    chartTheme()}
  chartTheme();
  const _r=render;render=function(k){try{chartTheme()}catch(e){}_r(k);try{decorate()}catch(e){console.warn(e)}};
  /* เปิดลิงก์ที่มี #รายการ ตรง ๆ (เช่น p04.html#sb-P04-205) ให้เลื่อนไปที่รายการนั้นหลังวาดเสร็จ */
  document.addEventListener('DOMContentLoaded',()=>{const h=location.hash.slice(1);if(h)setTimeout(()=>{const el=document.getElementById(h);if(el)el.scrollIntoView({block:'start'})},600)});
  return{show,hide,REG,mrLine,itemTip}
})();

/* side mini: คืนค่าที่จำไว้ + ใส่ tooltip ให้เมนูเมื่อพับ */
(function(){try{if(localStorage.getItem('nbl12-mini')==='1')document.documentElement.classList.add('side-mini')}catch(e){}
  const hook=()=>{const sd=document.getElementById('side');if(!sd){setTimeout(hook,120);return}
    try{sideMini(document.documentElement.classList.contains('side-mini'))}catch(e){}
    let t;new MutationObserver(()=>{clearTimeout(t);t=setTimeout(()=>{try{sideTips()}catch(e){}},30)}).observe(sd,{childList:true,subtree:true})};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',hook);else hook()})();

/* รายชื่อประกอบ (แบรนด์ / มาตรการ ฯลฯ) จากแผ่นงาน "รายชื่อ" ในไฟล์ของหน่วยงาน → แสดงใต้ภาพของรายการนั้น */
if(typeof styBlock==='function'){const _sbL=styBlock;styBlock=function(b,i){const h=_sbL(b,i);const ds=b.ds;if(!ds||!ds.list||!ds.list.rows.length)return h;
  const isGps=c=>/GPS|พิกัด/.test(c);
  const isUrl=v=>/^https?:\/\//.test(String(v||''));
  const t=`<details class="stb-list"${ds.list.rows.length<=8?' open':''}><summary>${ic('table')} ${L('รายชื่อประกอบจากหน่วยงาน','Detail list from agency')} <b>${ds.list.rows.length}</b> ${L('รายการ','items')}</summary>
    <div class="tbl-wrap"><table class="tbl"><thead><tr>${ds.list.cols.map(c=>`<th>${esc(c)}</th>`).join('')}</tr></thead><tbody>${ds.list.rows.map(r=>`<tr>${r.map((v,k)=>{const c=ds.list.cols[k];
      if(isGps(c)&&v&&/\d/.test(String(v))){const q=String(v).replace(/\s/g,'');return`<td><a href="https://www.google.com/maps?q=${encodeURIComponent(q)}" target="_blank" rel="noopener">${ic('map')} ${esc(v)}</a></td>`}
      if(isUrl(v)){let h='';try{h=new URL(v).hostname.replace(/^www\./,'')}catch(e){}return`<td><a href="${esc(v)}" target="_blank" rel="noopener">${ic('ext')} ${esc(h||L('เปิดลิงก์','Open'))}</a></td>`}
      return`<td>${typeof v==='number'&&/ปี/.test(c)?yCE(v):esc(v==null?'–':v)}</td>`}).join('')}</tr>`).join('')}</tbody></table></div>
    <p class="stb-ln">${L('แหล่งที่มา','Source')}: ${esc(ds.source)}</p></details>`;
  return h.replace(/(<form class="stb-api"|<\/article>\s*$)/,t+'$1')}}
/* คำแปลประเภท/หน่วยจากไฟล์อ้อย */
try{Object.assign(CAT_EN,{'โรงงานน้ำตาล':'Sugar mills','จุดรับซื้อ':'Buying points','อ้อยสด':'Fresh cane','อ้อยไฟไหม้':'Burnt cane','กากอ้อย':'Bagasse','กากน้ำตาล':'Molasses','ราคาอ้อยขั้นต้น':'Initial price','ราคาอ้อยขั้นสุดท้าย':'Final price','คล้าสด':'Fresh khla','ข้าวเจ้า':'Non-glutinous rice','รายเดี่ยว':'Individual growers','ผักหวานป่าสด':'Fresh leaves','ผักหวานป่าแปรรูป':'Processed','รูปแบบอื่น ๆ':'Other forms','สด · ในจังหวัด':'Fresh · in province','สด · ต่างจังหวัด':'Fresh · out of province','สด · ต่างประเทศ':'Fresh · abroad','แปรรูป · ในจังหวัด':'Processed · in province','แปรรูป · ต่างจังหวัด':'Processed · out of province','แปรรูป · ต่างประเทศ':'Processed · abroad','พ่อค้าคนกลาง':'Middlemen','ร้านค้าปลีก':'Retailers','ผู้ประกอบการแปรรูป':'Processors','นักท่องเที่ยวและตลาดของฝาก':'Tourists & souvenir markets','โรงเรือน':'Greenhouse','เพาะกลางแจ้ง':'Open-field','ระบบอื่น ๆ':'Other systems','ซื้อ':'Purchased','ผลิตเอง':'Self-produced','เห็ดฟาง':'Straw mushroom','เห็ดนางฟ้า':'Grey oyster','เห็ดขอนขาว':'Lentinus','เห็ดชนิดอื่น ๆ':'Other species','ขี้เลื่อย':'Sawdust','ฟางข้าว/ซังข้าวโพด':'Rice straw / corn cobs','อื่น ๆ (กากมันสำปะหลัง)':'Other (cassava pulp)','เห็ดสด':'Fresh mushrooms','ผลิตภัณฑ์แปรรูป':'Processed products','ต่างประเทศ':'Abroad','ข้าวเหนียว':'Glutinous rice','ต่างจังหวัด':'Out of province','ราคาขายปลีก':'Retail price','ราคาขายส่ง':'Wholesale price','เกษตรกร':'Farmers','กลุ่มเกษตรกร':'Farmer groups','ข้าวฮาง':'Khao Hang (GABA rice)','น้ำอ้อยสด':'Fresh cane juice','อื่น ๆ (วัสดุปลูกไบโอชา จากชานอ้อย, สุรากลั่นชุมชน)':'Other (bagasse biochar, community spirits)','กระติบข้าว · ในจังหวัด':'Rice baskets · in-province','ตะกร้า · ในจังหวัด':'Baskets · in-province','กระเป๋า · ในจังหวัด':'Bags · in-province','กระติบข้าว · ต่างจังหวัด':'Rice baskets · out-of-province','ตะกร้า · ต่างจังหวัด':'Baskets · out-of-province','กระเป๋า · ต่างจังหวัด':'Bags · out-of-province'});
  Object.assign(UNIT_EN,{'มาตรการ':'measures','แบรนด์':'brands','สายพันธุ์':'varieties','โครงการ':'programmes','ช่องทาง':'channels','ครั้ง':'times'})}catch(e){}

/* ---------- รูปแบบภาพเพิ่มสำหรับข้อมูลจริงแยกประเภท ----------
   mix  = แท่งซ้อนรายปีแยกประเภท (เห็นยอดรวม + สัดส่วน เช่น อ้อยสด/อ้อยไฟไหม้)
   pair = แท่งคู่รายปีแยกประเภท (เปรียบเทียบตรง ๆ เช่น ราคาขั้นต้น/ขั้นสุดท้าย)
   กำหนดใน DATASETS ด้วย form:'mix' | 'pair' */
(function(){if(typeof styForm!=='function')return;
  Object.assign(FORM_EN,{mix:'Mix by type',pair:'Side-by-side'});Object.assign(FORM_TH,{mix:'องค์ประกอบรายปี',pair:'เปรียบเทียบคู่รายปี'});
  if(typeof FORM_HELP!=='undefined')Object.assign(FORM_HELP,{mix:['แท่งรายปี แต่ละสีคือประเภท ความสูงรวมคือยอดทั้งหมด','Yearly bars split by type'],pair:['แท่งคู่รายปี เทียบแต่ละประเภทแบบตรง ๆ','Paired yearly bars by type']});
  const _f=styForm;styForm=function(d,p,ds){if(ds&&ds.form)return ds.form;if(ds&&ds.district&&ds.years&&ds.years.length===1)return'rank';return _f(d,p,ds)};
  const _c=styCfg0;styCfg0=function(b,big){if(b.form!=='mix'&&b.form!=='pair')return _c(b,big);
    const c=_c(Object.assign({},b,{form:'cost'}),big);if(!c)return c;
    if(b.form==='pair'){const pal=['#B79CC9',PA(b.p),'#E8559A',rgba(PA(b.p),.5)];c.data.datasets.forEach((d,i)=>{delete d.stack;d.backgroundColor=pal[i%pal.length];d.borderRadius={topLeft:8,topRight:8};d.maxBarThickness=big?60:34});
      c.options.scales.x.stacked=false;c.options.scales.y.stacked=false;c.options.plugins.legend.display=true}
    return c};
  const A_=b=>styAgg(b.rows);
  const _i=styInsight;styInsight=function(b){if(b.form!=='mix'&&b.form!=='pair')return _i(b);const A=A_(b),u=b.unit;
    if(b.form==='mix'){const t=A.v(r=>r.year===A.ly)||1;const L0=A.ts.map(k=>[k,A.v(r=>r.year===A.ly&&r.type===k)]).sort((x,y)=>y[1]-x[1]);
      let s=L(`ปี ${yCE(A.ly)} รวม <b>${fv(t,u)}</b> ${uLab(u)} · <b>${esc(L0[0][0])}</b> ${(L0[0][1]/t*100).toFixed(1)}%`,`${yCE(A.ly)} total <b>${fv(t,u)}</b> ${uLab(u)} · <b>${esc(tLab(L0[0][0]))}</b> ${(L0[0][1]/t*100).toFixed(1)}%`);
      if(A.py){const a=A.v(r=>r.year===A.py);if(a){const g=(t-a)/a*100;s+=L(` · ${g>=0?'เพิ่มขึ้น':'ลดลง'} ${Math.abs(g).toFixed(1)}% จากปีก่อน`,` · ${g>=0?'+':'−'}${Math.abs(g).toFixed(1)}% YoY`)}}return s}
    const L0=A.ts.map(k=>[k,A.v(r=>r.year===A.ly&&r.type===k)]);
    return L(`ปี ${yCE(A.ly)} `,`${yCE(A.ly)}: `)+L0.map(([k,v])=>`${esc(tLab(k))} <b>${fv(v,u)}</b>`).join(' · ')+` ${uLab(u)}`};
  const _k=styKpi;styKpi=function(b){if(b.form==='pair'){const A=A_(b);const k=A.ts[0];const v=A.v(r=>r.year===A.ly&&r.type===k);return{v:fv(v,b.unit),u:uLab(b.unit)}}return _k(b)};
  const _fa=styFacts;styFacts=function(b){if(b.form!=='mix'&&b.form!=='pair')return _fa(b);const A=A_(b),u=b.unit,U=' '+uLab(u);const F=[];
    const t=A.v(r=>r.year===A.ly)||1;
    A.ts.forEach(k=>{const v=A.v(r=>r.year===A.ly&&r.type===k);const pv=A.py?A.v(r=>r.year===A.py&&r.type===k):0;const g=pv?(v-pv)/pv*100:null;
      F.push([esc(tLab(k)),fv(v,u)+U+(b.form==='mix'?` <small>(${(v/t*100).toFixed(1)}%)</small>`:g==null?'':` <small class="${g>=0?'up':'dn'}">${g>=0?'▲':'▼'}${Math.abs(g).toFixed(1)}%</small>`)])});
    if(b.form==='mix'&&A.py){const a=A.v(r=>r.year===A.py),g=a?(t-a)/a*100:0;F.push([L('รวมเทียบปีก่อน','Total vs prior'),`<span class="${g>=0?'up':'dn'}">${g>=0?'▲':'▼'} ${Math.abs(g).toFixed(1)}%</span>`])}
    return F};
})();
if(typeof styTable==='function'){const _t=styTable;styTable=function(b){return _t(b.form==='pair'?Object.assign({},b,{form:'band'}):b)}}

try{Object.assign(CAT_EN,{'ปลานิล':'Nile tilapia','ปลาดุก':'Catfish','ปลาตะเพียน':'Silver barb','ปลาหมอไทย':'Climbing perch','ปลาน้ำจืดชนิดอื่น ๆ':'Other freshwater fish'});Object.assign(UNIT_EN,{'ฟาร์ม':'farms','ผลิตภัณฑ์':'products','ชนิด':'species','กิจกรรม':'events'})}catch(e){}

/* ---------- แท่ง/กลีบกราฟทึบ: ไม่ให้เส้นวัดค่าโผล่ทะลุแท่งสีโปร่ง ----------
   วาดรูปทรงเดียวกันด้วยสีพื้นการ์ดไว้ใต้แท่งจริงก่อน (ใช้ได้กับ bar / polarArea ทุกกราฟ) */
(function(){if(!window.Chart)return;
  const bgOf=el=>{let n=el;while(n&&n!==document.documentElement){const c=getComputedStyle(n).backgroundColor;const m=c&&c.match(/rgba?\(([^)]+)\)/);if(m){const a=m[1].split(',').map(s=>+s.trim());if(a.length<4||a[3]>=.85)return`rgb(${a[0]},${a[1]},${a[2]})`}n=n.parentElement}
    return isDark()?'#1D0F19':'#FFFFFF'};
  const lift=(c,k)=>{const m=c.match(/\d+/g);if(!m)return c;return`rgb(${m.slice(0,3).map(v=>Math.round(+v+(255-+v)*k)).join(',')})`};
  Chart.register({id:'solidUnder',beforeDatasetsDraw(ch){const types=['bar','polarArea'];let bg=null;const ctx=ch.ctx;
    ch.data.datasets.forEach((ds,i)=>{const m=ch.getDatasetMeta(i);if(!m||m.hidden||!types.includes(m.type||ch.config.type))return;bg=bg||(isDark()?lift(bgOf(ch.canvas),.3):bgOf(ch.canvas));
      m.data.forEach(el=>{if(!el||!el.options)return;const o=el.options,keep=[o.backgroundColor,o.borderColor,o.borderWidth];
        try{o.backgroundColor=bg;o.borderColor=bg;o.borderWidth=0;ctx.save();el.draw(ctx,ch.chartArea);ctx.restore()}catch(e){}finally{o.backgroundColor=keep[0];o.borderColor=keep[1];o.borderWidth=keep[2]}})})}});
  /* ให้กราฟที่สร้างไปแล้ววาดใหม่ */
  try{Object.values(Chart.instances||{}).forEach(c=>c.update('none'))}catch(e){}
})();

/* ---------- ตัวเลขบนแท่ง (กราฟใน Data Story + สไลด์) ---------- */
(function(){if(!window.Chart||typeof styCfg!=='function')return;
  const _c=styCfg;styCfg=function(b,big){const c=_c(b,big);if(!c||c.type!=='bar')return c;c.options=c.options||{};c.options.plugins=c.options.plugins||{};
    const hz=c.options.indexAxis==='y';c.options.plugins.vlab={u:b.unit,big:!!big};c.options.layout=Object.assign({},c.options.layout,{padding:Object.assign({top:hz?4:(big?30:22),right:hz?(big?70:56):6},(c.options.layout||{}).padding||{})});return c};
  Chart.register({id:'vlab',afterDatasetsDraw(ch){const o=ch.options.plugins&&ch.options.plugins.vlab;if(!o||ch.config.type!=='bar')return;
    const ctx=ch.ctx,hz=ch.options.indexAxis==='y',stacked=!!(ch.options.scales&&ch.options.scales.x&&ch.options.scales.x.stacked);
    const metas=ch.data.datasets.map((_,i)=>ch.getDatasetMeta(i)).filter(m=>!m.hidden&&m.visible!==false);if(!metas.length)return;
    const n=ch.data.labels.length,fs=o.big?17:13;const dark=isDark();
    const txt=v=>{try{return fv(v,o.u)}catch(e){return String(v)}};
    ctx.save();ctx.font=`600 ${fs}px Kanit, Sarabun, sans-serif`;ctx.fillStyle=dark?'#FBE9F2':'#3A1F2E';ctx.textAlign=hz?'left':'center';ctx.textBaseline=hz?'middle':'bottom';
    if(stacked){for(let j=0;j<n;j++){let tot=0,top=null;metas.forEach(m=>{const el=m.data[j];const v=ch.data.datasets[m.index].data[j];if(el&&v!=null){tot+=+v||0;const y=el.y;if(top==null||(hz?el.x>top.x:y<top.y))top=el}});
        if(top&&tot){const t=txt(tot);hz?ctx.fillText(t,top.x+6,top.y):ctx.fillText(t,top.x,top.y-6)}}}
    else{const many=metas.length*n>24;metas.forEach(m=>m.data.forEach((el,j)=>{const v=ch.data.datasets[m.index].data[j];if(v==null||el.skip)return;if(many&&!v)return;
        const w=hz?el.height:el.width;if(!hz&&w<18&&metas.length>1)return;const t=txt(v);if(!hz&&ctx.measureText(t).width>w*2.2&&metas.length>1)return;
        hz?ctx.fillText(t,el.x+6,el.y):ctx.fillText(t,el.x,el.y-6)}))}
    ctx.restore()}});
})();

/* ---------- ข้อมูลแยกอำเภอที่มีหลายประเภท: แถบสัดส่วนตามประเภท (ปีล่าสุด) ใต้ภาพ ---------- */
if(typeof styBlock==='function'){const _sbM=styBlock;styBlock=function(b,i){const h=_sbM(b,i);const ds=b.ds;if(!b.real||!ds||!ds.district||!ds.types||ds.types.length<2)return h;
  const A=styAgg(b.rows);const T=A.ts.map(t=>[t,A.v(r=>r.year===A.ly&&r.type===t)]).filter(x=>x[1]>0).sort((x,y)=>y[1]-x[1]);const S=sum(T.map(x=>x[1]))||1;const pal=styPal(b.p,T.length);
  const bar=`<section class="stb-mix" aria-label="${L('สัดส่วนตามประเภท','Share by type')}"><h5>${L('สัดส่วนตามประเภท','Share by type')} · ${yCE(A.ly)} <small>${L('รวม','total')} ${fv(S,b.unit)} ${uLab(b.unit)}</small></h5>
    <div class="mx-bar">${T.map(([t,v],k)=>`<i style="flex:${v};background:${pal[k]}" data-tip="${esc(tLab(t))}: ${fv(v,b.unit)} ${esc(uLab(b.unit))} (${(v/S*100).toFixed(1)}%)"></i>`).join('')}</div>
    <ul class="mx-lg">${T.map(([t,v],k)=>`<li><i style="background:${pal[k]}"></i><span>${esc(tLab(t))}</span><b>${(v/S*100).toFixed(1)}%</b><small>${fv(v,b.unit)}</small></li>`).join('')}</ul></section>`;
  return h.replace(/(<details class="stb-list"|<form class="stb-api"|<\/article>\s*$)/,bar+'$1')}}

/* ค่าเฉลี่ยรายอำเภอ (ต้นทุน/ผลผลิตต่อไร่): KPI = ค่าเฉลี่ยของอำเภอที่มีข้อมูล ไม่ใช่ผลรวม */
if(typeof styKpi==='function'){const _k=styKpi;styKpi=function(b){if(b.ds&&b.ds.agg==='avg'){const A=styAgg(b.rows);const L0=b.rows.filter(r=>r.year===A.ly&&r.value);const av=L0.length?L0.reduce((a,r)=>a+r.value,0)/L0.length:0;return{v:fv(av,b.unit),u:L('เฉลี่ย ','avg ')+uLab(b.unit)}}return _k(b)}}
if(typeof styInsight==='function'){const _i=styInsight;styInsight=function(b){if(b.ds&&b.ds.agg==='avg'){const A=styAgg(b.rows);const L0=b.rows.filter(r=>r.year===A.ly&&r.value).sort((x,y)=>y.value-x.value);if(!L0.length)return'';const av=L0.reduce((a,r)=>a+r.value,0)/L0.length;
  return L(`ปี ${yCE(A.ly)} เฉลี่ย <b>${fv(av,b.unit)}</b> ${uLab(b.unit)} จาก ${L0.length} อำเภอ · สูงสุด อ.${dShort(L0[0].dist)} <b>${fv(L0[0].value,b.unit)}</b>`,`${yCE(A.ly)} average <b>${fv(av,b.unit)}</b> ${uLab(b.unit)} across ${L0.length} districts · highest ${dShort(L0[0].dist)} <b>${fv(L0[0].value,b.unit)}</b>`)}return _i(b)}}

/* =====================================================================
   นำเสนอให้อ่านง่าย: แสดงเฉพาะรายการที่มีข้อมูลจริง และเรียงค่าจากมากไปน้อย
   - รายการที่ยังไม่มีข้อมูล / ค่าเป็น 0 ทั้งชุด → ไม่แสดง
   - อำเภอ/ประเภทในกราฟเรียงตามค่ารวมจากมากไปน้อย · ตัดอำเภอ/ประเภทที่เป็น 0 ทั้งหมด
   ===================================================================== */
function styTidy(b){const R=b.rows;if(!R||!R.length||b.form==='cal'||b.form==='status')return b;const tot={},tt={};
  R.forEach(r=>{const v=+r.value||0;tot[r.dist]=(tot[r.dist]||0)+v;tt[r.type||'รวม']=(tt[r.type||'รวม']||0)+v});
  const ly=Math.max(...R.filter(r=>+r.value).map(r=>r.year));
  const lyd={};R.forEach(r=>{if(r.year===ly)lyd[r.dist]=(lyd[r.dist]||0)+(+r.value||0)});
  let rows=R.filter(r=>(r.dist==='รวมทั้งจังหวัด'||!r.dist||tot[r.dist]>0)&&tt[r.type||'รวม']>0);
  if((b.form==='rank'||b.form==='tallyd')&&rows.some(r=>r.dist&&r.dist!=='รวมทั้งจังหวัด'))rows=rows.filter(r=>!r.dist||r.dist==='รวมทั้งจังหวัด'||lyd[r.dist]>0);
  rows=rows.slice().sort((x,y)=>x.year-y.year||(tot[y.dist]||0)-(tot[x.dist]||0)||(tt[y.type||'รวม']||0)-(tt[x.type||'รวม']||0));
  b.rows=Object.assign(rows,{unit:R.unit,src:R.src,name:R.name});return b}
const styHasData=b=>b.real&&b.rows&&b.rows.some(r=>+r.value>0);
/* รายการที่ยังไม่มีข้อมูล: แสดงบล็อกเป็น "โครงการนำเสนอ" ค่าเป็น 0 ทั้งหมด (ไม่ใช้ค่าจำลอง) */
function styZero(b){const R=b.rows||[];const z=R.map(r=>Object.assign({},r,{value:0}));b.rows=Object.assign(z,{unit:R.unit,src:'empty'});b.real=false;b.empty=true;b.srcName='';return b}
if(typeof styItems==='function'){const _si=styItems;styItems=function(p){return _si(p).map(b=>styHasData(b)?styTidy(b):(b.real?(b.empty=true,b):styZero(b)))}}
if(typeof storySection==='function'){const _ss=storySection;storySection=function(p){const list=styItems(p);
  if(false)return`<section class="sty sty-empty" id="dsx" style="--pa:${p.pa}"><div class="card" style="padding:28px;text-align:center"><h3 style="margin:0 0 6px">${L('เส้นทางข้อมูล','Data journey')} · ${esc(pname(p))}</h3><p class="note" style="margin:0">${L('อยู่ระหว่างรอข้อมูลจากหน่วยงานเจ้าของข้อมูล · จะแสดงทันทีเมื่อได้รับไฟล์','Awaiting data from the owning agency · will appear as soon as files arrive')}</p></div></section>`;
  const h=_ss(p);return h.replace(/<p class="sty-note">[\s\S]*?<\/p>/,`<p class="sty-note"><span class="sdot ${list.some(b=>!b.empty)?'real':'sim'}" aria-hidden="true"></span> ${L(`มีข้อมูลจริงจากหน่วยงาน ${list.filter(b=>!b.empty).length} จาก ${p.inds.length} รายการ · เรียงค่าจากมากไปน้อย · รายการที่ยังไม่มีข้อมูลแสดงเป็นโครงการนำเสนอ (ค่า 0)`,`Agency data: ${list.filter(b=>!b.empty).length} of ${p.inds.length} items · sorted high to low · items without data show the presentation frame (zero)`)}</p>`)}}
/* ค่าเฉลี่ยรายอำเภอ: รายการข้างกราฟไม่แสดง % ส่วนแบ่ง (ไม่มีความหมายกับค่าเฉลี่ย) */
if(typeof styFacts==='function'){const _sf=styFacts;styFacts=function(b){const F=_sf(b);return b.ds&&b.ds.agg==='avg'?F.map(f=>[f[0],String(f[1]).replace(/\s*<small>\(\d+%\)<\/small>/,'')]):F}}

/* ปีที่ไม่มีข้อมูล = เว้นว่าง (ไม่วาดแท่ง 0) */
if(typeof styCfg0==='function'){const _c2=styCfg0;styCfg0=function(b,big){const c=_c2(b,big);if(b.empty)return c;try{const A=styAgg(b.rows);const ys=A.ys;
  if(c&&c.data&&c.data.datasets&&c.data.labels&&c.data.labels.length===ys.length&&b.form!=='cal'){c.data.datasets.forEach(d=>{if(!Array.isArray(d.data)||d.data.length!==ys.length)return;
    const kt=A.ts.find(t=>tLab(t)===d.label),kd=A.ds.find(x=>dShort(x)===d.label);
    d.data=d.data.map((v,i)=>{const y=ys[i];const has=b.rows.some(r=>r.year===y&&+r.value>0&&(kt==null||r.type===kt)&&(kd==null||r.dist===kd)&&(kt!=null||kd!=null||true));return has?v:null})})}}catch(e){}return c}}
/* ไม่โชว์อันดับที่เป็น 0 และบอกเมื่อปีล่าสุดยังมีข้อมูลไม่ครบทุกอำเภอ (ไม่คำนวณ % เปลี่ยนแปลงที่ทำให้เข้าใจผิด) */
if(typeof styFacts==='function'){const _sf0=styFacts;styFacts=function(b){return _sf0(b).filter(f=>!/^0(\s|$|<)/.test(String(f[1]).trim()))}}
if(typeof styInsight==='function'){const _si0=styInsight;styInsight=function(b){let h=_si0(b);try{if(b.form==='cal'||!b.rows)return h;const A=styAgg(b.rows);if(!A.ds.length||!A.py)return h;
  const nd=y=>new Set(b.rows.filter(r=>r.year===y&&+r.value>0&&r.dist&&r.dist!=='รวมทั้งจังหวัด').map(r=>r.dist)).size;const a=nd(A.ly),p=nd(A.py);
  if(a<p){h=String(h).replace(/\s*·?\s*ปี \d{4} (เพิ่มขึ้น|ลดลง) <b>[^<]*<\/b> จากปีก่อน/,'').replace(/\s*·?\s*\d{4}: (up|down) <b>[^<]*<\/b>[^·]*/,'').replace(/\s*· เฉลี่ย [^·]*ต่อปี/,'');
    h+=L(` · <span class="note">ปี ${yCE(A.ly)} มีข้อมูล ${a} จาก ${p} อำเภอ</span>`,` · <span class="note">${yCE(A.ly)}: ${a} of ${p} districts reported</span>`)}}catch(e){}return h}}

/* =====================================================================
   ไม่มีข้อมูล = เว้นว่าง (ไม่มีค่าจำลอง/โครงตัวอย่างให้สับสน)
   ===================================================================== */
if(typeof DATA_ONLY!=='undefined'&&DATA_ONLY){
  const dsHas=ds=>{const st=typeof DSX!=='undefined'&&DSX.store[ds.code];return!!(st&&st.rows.some(r=>+r.value>0))};
  /* การ์ดชุดข้อมูล: ซ่อนชุดที่ยังไม่มีค่า · ตัดปุ่ม "โครง / ดูตัวอย่าง" */
  if(typeof dsData==='function'){const _dd=dsData;dsData=function(ds,p){const D=_dd(ds,p);return D&&D.src==='demo'?null:D}}
  if(typeof dsCard==='function'){const _dc=dsCard;dsCard=function(ds,p){if(!dsHas(ds))return'';return _dc(ds,p).replace(/<div class="seg sm" role="group"><button type="button" data-dsm=[\s\S]*?<\/div>/,'')}}
  /* มุมผู้ซื้อ: สเปกที่ยังไม่มีข้อมูลจริง ไม่แสดงช่องว่าง */
  if(typeof specDl==='function'){specDl=function(){return''}}
}

/* บล็อกที่ยังไม่มีข้อมูล: ข้อความ/ป้ายบอกชัดว่า "รอข้อมูล" และจะนำเสนอรูปแบบไหน */
if(typeof styInsight==='function'){const _ie=styInsight;styInsight=function(b){if(b.empty&&b.real)return L(`<span class="note">หน่วยงานรายงานค่าเป็น 0</span>`,`<span class="note">Agency reported zero</span>`);if(b.empty)return L(`<span class="note">รอข้อมูลจากหน่วยงาน · จะนำเสนอแบบ “${FORM_TH[b.form]||''}”</span>`,`<span class="note">Awaiting agency data · will be shown as “${FORM_EN[b.form]||''}”</span>`);return _ie(b)}}
if(typeof styKpi==='function'){const _ke=styKpi;styKpi=function(b){if(b.empty)return{v:'0',u:b.real?uLab(b.unit):L('รอข้อมูล','awaiting')};return _ke(b)}}
if(typeof sDot==='function'){const _sd=sDot;sDot=function(b){if(b.empty&&!b.real)return`<span class="sdot sim" tabindex="0" role="img" aria-label="${L('รอข้อมูลจากหน่วยงาน','Awaiting agency data')}" data-tip="${L('รอข้อมูลจากหน่วยงาน · แสดงเป็นโครงการนำเสนอ (ค่า 0)','Awaiting agency data · presentation frame (zero)')}"></span>`;return _sd(b)}}
if(typeof styBlock==='function'){const _be=styBlock;styBlock=function(b,i){const h=_be(b,i);return b.empty?h.replace('<article class="stb','<article class="stb stb-empty'):h}}

if(typeof styHeadline==='function'){const _hl=styHeadline;styHeadline=function(list){const L0=list.filter(b=>!b.empty);return L0.length?_hl(L0):''}}
/* ป้ายวงเล็บข้างจุดสถานะ: (ข้อมูลจริง) / (ข้อมูลจำลอง) */
if(typeof sDot==='function'){const _sdl=sDot;sDot=function(b){const real=!!b.real;return _sdl(b)+`<span class="sdot-l ${real?'real':'sim'}">(${real?L('ข้อมูลจริง','real data'):L('ข้อมูลจำลอง','simulated')})</span>`}}
try{Object.assign(CAT_EN,{'กล้วยน้ำว้า':'Namwa banana','กล้วยหอม':'Hom banana','กล้วยสด':'Fresh bananas','เกษตรกร/ผู้ประกอบการ':'Farmers / makers','กลุ่ม':'Groups','ช่างทอผ้า (ราย)':'Weavers (persons)','วิชชาลัย (แห่ง)':'Weaving schools (sites)','อื่น ๆ (ราย)':'Other (persons)','เสื้อผ้าสำเร็จรูป':'Ready-made garments','กระเป๋า':'Bags','ผ้าพันคอ':'Scarves','ของตกแต่งบ้าน':'Home décor','ของที่ระลึก':'Souvenirs','อื่น ๆ':'Other','อื่น ๆ (ผ้าผืน)':'Other (fabric)','ผ้าฉนวนลุ่มภู':'Chanuan fabric','ผ้าทอ · ในจังหวัด (ผืน)':'Woven fabric · in province (pieces)','ผ้าทอ · ต่างจังหวัด (ผืน)':'Woven fabric · out of province (pieces)','ผลิตภัณฑ์แปรรูป · ในจังหวัด (ชิ้น)':'Processed products · in province (pieces)','ผ้าทอ · ต่างประเทศ (ผืน)':'Woven fabric · abroad (pieces)','ผลิตภัณฑ์แปรรูป · ต่างจังหวัด (ชิ้น)':'Processed products · out of province (pieces)','ผลิตภัณฑ์แปรรูป · ต่างประเทศ (ชิ้น)':'Processed products · abroad (pieces)','ผ้าทอ · ในจังหวัด':'Woven fabric · in province','ผ้าทอ · ต่างจังหวัด':'Woven fabric · out of province','ผลิตภัณฑ์แปรรูป · ในจังหวัด':'Processed products · in province','ผ้าทอ · ต่างประเทศ':'Woven fabric · abroad','ผลิตภัณฑ์แปรรูป · ต่างจังหวัด':'Processed products · out of province','ผลิตภัณฑ์แปรรูป · ต่างประเทศ':'Processed products · abroad','รายย่อย':'Smallholders','เชิงพาณิชย์':'Commercial','หัวพันธุ์ (หัว)':'Rhizomes (rhizomes)','ต้นพันธุ์ (ต้น)':'Seedlings (plants)','ต้นไม้กระถาง (ต้น)':'Potted plants (plants)','หัวพันธุ์ที่ผ่านการคัดเกรด (หัว)':'Graded rhizomes (rhizomes)','ว่านอุษาลำภู':'Usa Lamphu','หัวพันธุ์ ต้นสด ดอกสด · ในจังหวัด':'Rhizomes, plants & flowers · in province','หัวพันธุ์ ต้นสด ดอกสด · ต่างจังหวัด':'Rhizomes, plants & flowers · out of province','ราคาต่อต้น/กระถาง':'Per plant / pot','เกรดแชมป์ / ยอดเยี่ยม':'Champion grade','เกรดรางวัล / ไม้ติดรางวัล':'Award grade','เกรดฟอร์มประกวด / ไม้พร้อมประกวด':'Show-ready grade','เกรดสะสมพิเศษ / ไม้กลายพันธุ์หายาก':'Rare collector grade','เกษตรกรรายย่อย':'Smallholders','ตลาดต้นไม้':'Plant markets','ร้านค้าไม้ดอกไม้ประดับ':'Ornamental plant shops','เมล็ดกาแฟดิบ':'Green beans','เมล็ดกาแฟคั่ว':'Roasted beans','ในจังหวัด':'in province','เมล็ดกาแฟ · ในจังหวัด':'Coffee beans · in province','เมล็ดกาแฟ · ต่างจังหวัด':'Coffee beans · out of province','ด้านลายผ้าและอัตลักษณ์ (ลวดลาย)':'Patterns & identity','ด้านเทคนิคการทอและอุปกรณ์ (เทคนิค)':'Weaving techniques & tools','อื่น ๆ (องค์ความรู้)':'Other knowledge','เครื่องแต่งกายสำเร็จรูป':'Ready-made apparel','ของแต่งบ้าน':'Home décor','ของฝาก':'Gifts','ผ้าทอขิดสลับหมี่ · ในจังหวัด (ผืน)':'Khit-Mudmee fabric · in province (pieces)','เสื้อผ้าตัดเย็บสำเร็จรูป · ในจังหวัด (ชุด)':'Tailored garments · in province (sets)','ผ้าทอขิดสลับหมี่ · ในจังหวัด':'Khit-Mudmee fabric · in province','เสื้อผ้าตัดเย็บสำเร็จรูป · ในจังหวัด':'Tailored garments · in province','ผลิตภัณฑ์แปรรูปอื่นๆ · ในจังหวัด':'Other processed goods · in province','ศูนย์ OTOP':'OTOP centres','ผู้ประกอบการสินค้าแฟชั่น/หัตถกรรม':'Fashion & craft businesses','ผู้บริโภคทั่วไป':'General consumers'});Object.assign(UNIT_EN,{'ตัว':'head','มาตรการ':'measures','สายพันธุ์':'breeds','ต้น':'plants','หัว':'rhizomes','ชิ้นงาน':'pieces','หน่วย':'units','หัว/ต้น/ดอก':'units','บาท/ต้น':'THB/plant','แบรนด์':'brands'})}catch(e){}
