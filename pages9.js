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
      <div class="tp-mr"><small>${L('ข้อมูลแบบเครื่องอ่านได้ (1 บรรทัด)','Machine-readable (one line)')}</small><code>${esc(mrLine(b))}</code></div>`}
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
    h=h.replace('<h4>',`<h4 data-tipk="item:${b.d.code}" tabindex="0">`);
    const mr=`<div class="stb-mr"><span class="mr-l">${L('เครื่องอ่านได้','Machine-readable')}</span><code title="${L('คลิกเพื่อคัดลอก','Click to copy')}">${esc(mrLine(b))}</code>
      <button type="button" class="ib" data-mr="copy" title="${L('คัดลอกบรรทัดข้อมูล','Copy line')}">${ic('copy')}</button>
      <button type="button" class="ib${rid?' on':''}" data-mr="api" title="${L('เชื่อม API จากระบบบัญชีข้อมูล (วาง resource_id)','Link catalog API (paste resource_id)')}">${ic('api')}</button></div>
      <form class="stb-api" hidden><label>${ic('db')}<span>${L('วาง resource_id หรือลิงก์ชุดข้อมูลจาก','Paste a resource_id or dataset link from')} <b>gdcatalog</b></span></label>
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
