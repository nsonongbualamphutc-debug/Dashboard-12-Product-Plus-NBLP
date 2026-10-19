/* =====================================================================
   12 Plus+ · pages8.js — ตกแต่ง (Decor layer)
   1 หน้าโหลดดอกบัวบาน · 2 เปลี่ยนหน้าแบบนุ่ม (View Transitions, CSS)
   3 กลีบบัวลอย · 4 ตัวเลขนับขึ้น + เส้นกราฟวาดตัว · 5 แสงตามเคอร์เซอร์
   6 แถบอ่านเป็นก้านบัว · 7 ตัวคั่นลายผ้าขิด · 8 ภาพ "รอข้อมูล" · 9 ไอคอน 3D
   ทุกอย่างปิดเองเมื่อผู้ใช้ตั้ง "ลดการเคลื่อนไหว" และไม่แสดงตอนพิมพ์
   ===================================================================== */
const DECO=(()=>{
  const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const FINE=matchMedia('(hover:hover) and (pointer:fine)').matches;
  const H=document.documentElement;
  const probe=(src,cls)=>{const im=new Image();im.onload=()=>H.classList.add(cls);im.src=src};

  /* ---------- 9 ไอคอน 3D: ใช้เมื่อมีไฟล์ img/icon-XX.webp ---------- */
  /* เปิดใช้เมื่อมีไฟล์จริงแล้ว (กันการเรียกไฟล์ที่ยังไม่มี) — icons: ไอคอน 3D img/icon-XX.webp · empty: img/empty.webp */
  const ASSETS={icons:true,empty:true};
  if(ASSETS.icons)for(let i=1;i<=14;i++)H.classList.add('i3d-'+pad2(i));
  if(ASSETS.empty)H.classList.add('has-empty');
  let nb=0;const _badge=badge;
  if(ASSETS.icons)badge=function(p,o={}){let s=_badge(p,o);const id=pad2(p.id),lab=o.label!==false,sz=lab?70:112,cy=lab?79:100,k=++nb;
    s=s.replace('<svg class="bdg','<svg data-i="'+id+'" class="bdg');
    return s.replace(/<\/svg>$/,`<clipPath id="ci${k}"><circle cx="100" cy="100" r="61"/></clipPath><image class="i3d" href="img/icon-${id}.webp" x="${100-sz/2}" y="${cy-sz/2}" width="${sz}" height="${sz}" clip-path="url(#ci${k})" preserveAspectRatio="xMidYMid slice"/></svg>`)};

  /* ---------- 1 หน้าโหลดดอกบัวบาน (ครั้งแรกของการเปิดเว็บ) ---------- */
  function intro(){let seen=false;try{seen=sessionStorage.getItem('nbl12-intro')}catch(e){}
    if(RM||seen||matchMedia('print').matches)return;try{sessionStorage.setItem('nbl12-intro','1')}catch(e){}
    const petals=[0,45,90,135,180,225,270,315].map((r,i)=>`<ellipse class="lp" style="--r:${r}deg;--d:${(i%4)*70}ms" cx="60" cy="38" rx="13" ry="30"/>`).join('');
    const inner=[22,67,112,157,202,247,292,337].map((r,i)=>`<ellipse class="lp in" style="--r:${r}deg;--d:${280+(i%4)*60}ms" cx="60" cy="44" rx="9" ry="20"/>`).join('');
    const o=document.createElement('div');o.className='intro';o.setAttribute('aria-hidden','true');
    o.innerHTML=`<div class="intro-c"><svg viewBox="0 0 120 120" width="132" height="132"><defs><linearGradient id="lg1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FF9CD2"/><stop offset="1" stop-color="#D50654"/></linearGradient><linearGradient id="lg2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE3F1"/><stop offset="1" stop-color="#F36FAB"/></linearGradient></defs>
      <g fill="url(#lg1)" opacity=".9">${petals}</g><g fill="url(#lg2)">${inner}</g><circle class="lc" cx="60" cy="60" r="7" fill="#F4C64E"/></svg>
      <b>12 Plus<sup>+</sup></b><span>NONG BUA LAM PHU · LOCAL IDENTITY</span></div>`;
    document.body.appendChild(o);setTimeout(()=>o.classList.add('out'),1250);setTimeout(()=>o.remove(),1900)}

  /* ---------- 3 กลีบบัวลอย ---------- */
  function petals(){if(RM||$('.petals'))return;const w=document.createElement('div');w.className='petals';w.setAttribute('aria-hidden','true');
    w.innerHTML=Array.from({length:7},(_,i)=>`<i style="--x:${8+i*13+(i%2)*4}vw;--s:${.6+((i*37)%10)/14};--t:${22+(i*7)%14}s;--dl:-${(i*5.3).toFixed(1)}s;--rz:${(i*53)%360}deg"></i>`).join('');document.body.appendChild(w)}

  /* ---------- 5 แสงตามเคอร์เซอร์ (เฉพาะจอที่ใช้เมาส์) ---------- */
  function spot(){if(!FINE||RM||$('.spot'))return;const s=document.createElement('div');s.className='spot';s.setAttribute('aria-hidden','true');document.body.appendChild(s);
    let x=0,y=0,raf=0;const SEL='.stb,.card,.sh-k,.kpi,.tile,.rdy a,.rdy>div,.dsx,.vcard,.sty-hero';
    addEventListener('pointermove',e=>{x=e.clientX;y=e.clientY;const on=!!(e.target.closest&&e.target.closest(SEL));s.classList.toggle('on',on);
      if(!raf)raf=requestAnimationFrame(()=>{s.style.transform=`translate(${x-190}px,${y-190}px)`;raf=0})},{passive:true});
    addEventListener('pointerleave',()=>s.classList.remove('on'))}

  /* ---------- 6 แถบอ่านเป็นก้านบัว ---------- */
  function lprog(){if($('.lprog'))return;const b=document.createElement('div');b.className='lprog';b.setAttribute('aria-hidden','true');
    b.innerHTML=`<i class="stem"></i><svg class="head" viewBox="0 0 40 40"><g fill="#F36FAB"><ellipse cx="20" cy="13" rx="5" ry="11"/><ellipse cx="20" cy="13" rx="5" ry="11" transform="rotate(-42 20 26)"/><ellipse cx="20" cy="13" rx="5" ry="11" transform="rotate(42 20 26)"/></g><g fill="#D50654"><ellipse cx="20" cy="15" rx="4" ry="9" transform="rotate(-80 20 26)"/><ellipse cx="20" cy="15" rx="4" ry="9" transform="rotate(80 20 26)"/></g><circle cx="20" cy="24" r="3" fill="#F4C64E"/></svg>`;
    document.body.appendChild(b);let raf=0;const up=()=>{raf=0;const h=document.documentElement.scrollHeight-innerHeight;const p=h>40?Math.min(1,Math.max(0,scrollY/h)):0;
      b.style.setProperty('--p',p);b.classList.toggle('bloom',p>.985);b.classList.toggle('show',p>.01)};
    addEventListener('scroll',()=>{if(!raf)raf=requestAnimationFrame(up)},{passive:true});addEventListener('resize',up);up()}

  /* ---------- 7 ตัวคั่นลายผ้าขิด ---------- */
  function khit(page){$$('.sty-ch',page).forEach(c=>{if(!c.previousElementSibling||!c.previousElementSibling.classList.contains('khit'))c.insertAdjacentHTML('beforebegin','<div class="khit" aria-hidden="true"></div>')});
    const f=$('#foot');if(f&&!(f.previousElementSibling&&f.previousElementSibling.classList.contains('khit')))f.insertAdjacentHTML('beforebegin','<div class="khit wide" aria-hidden="true"></div>')}

  /* ---------- 8 ภาพ "รอข้อมูล" ---------- */
  function empty(page){$$('.sk-note',page).forEach(n=>{if(!n.querySelector('.empty-art'))n.insertAdjacentHTML('afterbegin','<i class="empty-art" aria-hidden="true"></i>')})}

  /* ---------- 4 ตัวเลขนับขึ้น ---------- */
  function countEl(el){if(!el||RM||el.dataset.counted)return;el.dataset.counted=1;const full=el.textContent;const m=full.match(/^([\d,]+(?:\.\d+)?)(.*)$/s);if(!m)return;
    const tgt=parseFloat(m[1].replace(/,/g,''));if(!isFinite(tgt)||tgt===0)return;const dec=(m[1].split('.')[1]||'').length,suf=m[2];const t0=performance.now(),D=900;
    const f=new Intl.NumberFormat('en-US',{minimumFractionDigits:dec,maximumFractionDigits:dec});
    const tick=t=>{const k=Math.min(1,(t-t0)/D),e=1-Math.pow(1-k,3);el.textContent=f.format(tgt*e)+suf;if(k<1)requestAnimationFrame(tick);else el.textContent=full};requestAnimationFrame(tick)}
  if(typeof styDraw==='function'){const _sd=styDraw;styDraw=function(code){const was=STY.drawn.has(code);_sd(code);if(!was)countEl($('#sb-'+code+' .stb-kpi b'))}}
  /* เส้นกราฟค่อย ๆ ลากตัว */
  if(typeof styCfg==='function'){const _sc=styCfg;styCfg=function(b,big){const c=_sc(b,big);if(!c||RM||c.type!=='line')return c;
    const n=Math.max(1,c.data.labels.length),step=(big?1300:1000)/n;
    const prevY=ctx=>{const sc=ctx.chart.scales.y;if(ctx.index===0||!sc)return sc?sc.getPixelForValue(sc.min):0;const pt=ctx.chart.getDatasetMeta(ctx.datasetIndex).data[ctx.index-1];return pt?pt.getProps(['y'],true).y:sc.getPixelForValue(sc.min)};
    c.options=c.options||{};c.options.animations=Object.assign({},c.options.animations,{
      x:{type:'number',easing:'easeOutQuad',duration:step,from:NaN,delay(ctx){if(ctx.type!=='data'||ctx.xStarted)return 0;ctx.xStarted=true;return ctx.index*step}},
      y:{type:'number',easing:'easeOutQuad',duration:step,from:prevY,delay(ctx){if(ctx.type!=='data'||ctx.yStarted)return 0;ctx.yStarted=true;return ctx.index*step}}});return c}}

  /* ---------- ผูกกับการ render ทุกหน้า ---------- */
  function apply(){const page=$('#page');if(!page)return;khit(page);empty(page);petals();spot();lprog()}
  const _render=render;render=function(k){_render(k);try{apply()}catch(e){console.warn(e)}};
  document.addEventListener('DOMContentLoaded',intro);
  return{apply,countEl};
})();
