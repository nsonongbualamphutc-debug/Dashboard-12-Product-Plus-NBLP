/* =====================================================================
   12 Plus+ · fx.js — ลูกเล่นดิจิทัล
   reveal · count-up · tilt 3D · spotlight · particles · parallax
   swipe เปลี่ยนสินค้า · แถบนำทางล่างบนมือถือ · progress bar · กราฟไล่สี
   ===================================================================== */
const FX=(()=>{
  const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const FINE=matchMedia('(pointer:fine)').matches;
  let io=null,cuIO=null,dusts=[],once=false;

  /* ---------- reveal on scroll ---------- */
  function reveal(page){
    if(io)io.disconnect();
    if(RM||!('IntersectionObserver'in window))return;
    io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{rootMargin:'0px 0px -6% 0px'});
    const sel='.card,.kpi,.tile,.chap,.gal figure,.shop,.teaser,.ql,.now-c,.pn a,.tick,.live-bn,.vcard';
    const vh=innerHeight;
    $$(sel,page).forEach(el=>{
      if(el.closest('.rv:not(.in)')&&!el.classList.contains('vcard'))return;
      const r=el.getBoundingClientRect();if(r.top<vh*.92)return;
      const sib=el.parentElement?[...el.parentElement.children].indexOf(el):0;
      el.style.setProperty('--d',Math.min(sib%8,7)*60+'ms');el.classList.add('rv');io.observe(el);
    });
  }

  /* ---------- count-up ---------- */
  function numNode(el){for(const n of el.childNodes){if(n.nodeType===3&&/\d/.test(n.nodeValue))return n}return null}
  function countUp(page){
    if(cuIO)cuIO.disconnect();
    const els=$$('.cu,.kpi .v,.cv-stats b,.ov-stats b',page);
    const run=el=>{const n=numNode(el);if(!n||el.dataset.cu)return;el.dataset.cu=1;
      const raw=n.nodeValue,m=raw.match(/-?[\d,]*\.?\d+/);if(!m)return;
      const tgt=parseFloat(m[0].replace(/,/g,''));if(!isFinite(tgt)||tgt===0)return;
      const dec=(m[0].split('.')[1]||'').length,fmt=new Intl.NumberFormat('en-US',{minimumFractionDigits:dec,maximumFractionDigits:dec});
      const t0=performance.now(),D=1100+Math.min(900,Math.log10(Math.abs(tgt)+1)*120);
      const tick=t=>{const k=Math.min(1,(t-t0)/D),e=1-Math.pow(1-k,4);n.nodeValue=raw.replace(m[0],fmt.format(tgt*e));if(k<1)requestAnimationFrame(tick);else n.nodeValue=raw};
      requestAnimationFrame(tick)};
    if(RM||!('IntersectionObserver'in window))return;
    cuIO=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){run(e.target);cuIO.unobserve(e.target)}}),{threshold:.4});
    els.forEach(el=>cuIO.observe(el));
  }

  /* ---------- tilt 3D ---------- */
  function tilt(page){
    if(RM||!FINE)return;
    $$('[data-tilt],.tile,.teaser,.now-c',page).forEach(el=>{
      el.classList.add('tl3');
      el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
        const a=el.hasAttribute('data-tilt')?7:9;el.style.setProperty('--ry',(x*a).toFixed(2)+'deg');el.style.setProperty('--rx',(-y*a).toFixed(2)+'deg');el.style.setProperty('--gx',(x+.5)*100+'%');el.style.setProperty('--gy',(y+.5)*100+'%')});
      el.addEventListener('pointerleave',()=>{el.style.setProperty('--ry','0deg');el.style.setProperty('--rx','0deg')});
    });
  }

  /* ---------- particles ---------- */
  function dust(page){
    dusts.forEach(d=>d.stop());dusts=[];
    if(RM)return;
    $$('canvas.fx-dust',page).forEach(cv=>{
      const ctx=cv.getContext('2d');let W=0,H=0,ps=[],raf=0,vis=true,alive=true;
      const dpr=Math.min(2,devicePixelRatio||1);
      const size=()=>{const r=cv.getBoundingClientRect();W=r.width;H=r.height;cv.width=W*dpr;cv.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);
        const n=Math.round(Math.min(80,W*H/9000));ps=Array.from({length:n},()=>mk(true))};
      const mk=init=>({x:Math.random()*W,y:init?Math.random()*H:H+6,r:Math.random()*1.8+.4,v:Math.random()*.35+.08,dx:(Math.random()-.5)*.25,a:Math.random()*.6+.2,g:Math.random()<.35});
      const draw=()=>{if(!alive)return;raf=requestAnimationFrame(draw);if(!vis||document.hidden)return;
        ctx.clearRect(0,0,W,H);
        for(const p of ps){p.y-=p.v;p.x+=p.dx;if(p.y<-6||p.x<-6||p.x>W+6)Object.assign(p,mk(false));
          ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,6.283);ctx.fillStyle=p.g?`rgba(232,190,104,${p.a})`:`rgba(255,255,255,${p.a*.8})`;ctx.shadowBlur=p.g?8:0;ctx.shadowColor='rgba(232,190,104,.8)';ctx.fill()}
        /* เส้นเชื่อมจุดใกล้กัน — ความรู้สึก data network */
        ctx.shadowBlur=0;ctx.lineWidth=.6;
        for(let i=0;i<ps.length;i++)for(let j=i+1;j<ps.length;j++){const a=ps[i],b=ps[j],dx=a.x-b.x,dy=a.y-b.y,d=dx*dx+dy*dy;if(d<6400){ctx.strokeStyle=`rgba(255,255,255,${(1-d/6400)*.13})`;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke()}}
      };
      size();draw();
      const ro=new ResizeObserver(size);ro.observe(cv);
      const vio=new IntersectionObserver(es=>{vis=es[0].isIntersecting});vio.observe(cv);
      dusts.push({stop(){alive=false;cancelAnimationFrame(raf);ro.disconnect();vio.disconnect()}});
    });
  }

  /* ---------- global, ติดตั้งครั้งเดียว ---------- */
  function setup(){
    if(once)return;once=true;
    /* spotlight ตามเมาส์ */
    if(FINE)document.addEventListener('pointermove',e=>{const c=e.target.closest&&e.target.closest('.card,.kpi,.st,.ql,.shop');if(!c)return;const r=c.getBoundingClientRect();c.style.setProperty('--mx',e.clientX-r.left+'px');c.style.setProperty('--my',e.clientY-r.top+'px')},{passive:true});
    /* progress bar + parallax */
    const pbg=document.createElement('div');pbg.className='pbg';pbg.setAttribute('aria-hidden','true');document.body.prepend(pbg);
    const bar=document.createElement('div');bar.className='sprog';bar.setAttribute('aria-hidden','true');document.body.appendChild(bar);
    let tk=false;addEventListener('scroll',()=>{if(tk)return;tk=true;requestAnimationFrame(()=>{tk=false;const h=document.documentElement.scrollHeight-innerHeight;bar.style.transform=`scaleX(${h>0?scrollY/h:0})`;
      if(!RM){const bg=document.querySelector('.hx-bg,.cv .bg,.ov-hero .bg');if(bg)bg.style.translate=`0 ${Math.min(scrollY,900)*.18}px`}
      document.body.classList.toggle('scrolled',scrollY>40)})},{passive:true});
    /* swipe ซ้าย/ขวา เปลี่ยนสินค้าบนจอสัมผัส */
    let sx=0,sy=0,st=0,ok=false;
    document.addEventListener('touchstart',e=>{const t=e.touches[0];ok=R.page==='product'&&e.touches.length===1&&!e.target.closest('.scroll-x,.now-l,.gal,canvas,.tick,table,.seg,.marq,input,select,textarea,.side,.ovl,.lb,.bnav,.mchips,.hx-media');sx=t.clientX;sy=t.clientY;st=Date.now()},{passive:true});
    document.addEventListener('touchend',e=>{if(!ok)return;const t=e.changedTouches[0],dx=t.clientX-sx,dy=t.clientY-sy;if(Date.now()-st<600&&Math.abs(dx)>90&&Math.abs(dy)<Math.abs(dx)*.45){const i=P.indexOf(byId(R.pid)),n=P[(i+(dx<0?1:-1)+P.length)%P.length];go(pFile(n.id))}},{passive:true});
    /* แถบนำทางล่าง (มือถือ/แท็บเล็ต) */
    const bn=document.createElement('nav');bn.className='bnav';bn.setAttribute('aria-label','เมนูหลัก');document.body.appendChild(bn);
    /* กราฟ: ไล่สีแท่ง/พื้นที่ใต้เส้น */
    if(window.Chart)Chart.register({id:'fxGrad',beforeUpdate(ch){const type=ch.config.type;ch.data.datasets.forEach(ds=>{if(ds._fx)return;const t=ds.type||type,c=ds.backgroundColor;
      if(typeof c!=='string'||!/^#[0-9a-f]{6}$/i.test(c))return;
      if(t==='bar'){ds._fx=1;ds.backgroundColor=x=>{const ca=x.chart.chartArea;if(!ca)return c;const hz=x.chart.options.indexAxis==='y';const g=hz?x.chart.ctx.createLinearGradient(ca.left,0,ca.right,0):x.chart.ctx.createLinearGradient(0,ca.bottom,0,ca.top);g.addColorStop(0,c+'59');g.addColorStop(1,c);return g};if(ds.borderRadius==null)ds.borderRadius=6}
      else if(t==='line'&&ds.fill){ds._fx=1;ds.backgroundColor=x=>{const ca=x.chart.chartArea;if(!ca)return c+'22';const g=x.chart.ctx.createLinearGradient(0,ca.top,0,ca.bottom);g.addColorStop(0,c+'55');g.addColorStop(1,c+'00');return g}}})}});
  }
  function bnav(){
    const bn=$('.bnav');if(!bn)return;const pg=R.page;
    const it=[['index.html','home',L('หน้าแรก','Home'),pg==='cover'],['overview.html','grid',L('ภาพรวม','Overview'),pg==='overview'],[pg==='cover'?'p01.html':null,'star',L('สินค้า','Products'),pg==='product','menu'],['brief.html?v=book','report',L('หนังสือ','Lookbook'),pg==='brief'],[null,'search',L('ค้นหา','Search'),false,'search']];
    bn.innerHTML=it.map(([h,i,t,a,act])=>h?`<a href="${h}"${a?' aria-current="page"':''}>${ic(i)}<span>${t}</span></a>`:`<button type="button" data-act="${act}"${a?' aria-current="page"':''}>${ic(i)}<span>${t}</span></button>`).join('');
  }

  /* ---------- จัดคำไทยไม่ให้ขาดผิดที่ ---------- */
  const WJ='⁠',NB=' ';
  const RE=[[/(การ|ความ|ผู้|นัก|ช่าง)(?=[ก-ฮเแโใไ])/g,'$1'+WJ],[/(ของ)(?=(ฝาก|ขวัญ|ดี))/g,'$1'+WJ],
    [/(\d)\s+(?=(กก\.|ก\.|ตัน|ตัว|ปี|บาท|ราย|ชิ้น|ผืน|วัน|เดือน|หลอด|แห่ง|ลบ\.|ล้าน|พัน|ไร่|สนาม|กระถาง|หัว|แพ็ก|อำเภอ|รายการ|สินค้า|ดาว|กลุ่ม|ร้าน|หน่วยงาน))/g,'$1'+NB],
    [/(ปี|พ\.ศ\.|ค\.ศ\.|หมู่|ต\.|อ\.|จ\.)\s(?=[\dก-ฮ])/g,'$1'+NB],[/([ก-๙])\/(?=[ก-๙])/g,'$1'+WJ+'/'+WJ]];
  const COMP=['ส่งค่าจริงแล้ว','การจำหน่ายรวม','ส่งออก','ซื้อขาย','ล้านบาท','พันบาท','หนองบัวลำภู','ลุ่มภู','ศรีบุญเรือง','ภูซาง','เพาะเห็ด','แปรรูป','วิสาหกิจ','ประกวด','พ่อแม่พันธุ์','น้ำเชื้อ','ไนโตรเจนเหลว','ของฝาก','ของขวัญ','ภูมิปัญญา','สิ่งบ่งชี้ทางภูมิศาสตร์'];
  let GL=null;
  function glueList(){if(GL)return GL;GL=[];const sg=window.Intl&&Intl.Segmenter?new Intl.Segmenter('th',{granularity:'word'}):null;
    const words=[...new Set([...COMP,...(typeof P!=='undefined'?P.map(p=>p.name):[])])].sort((x,y)=>y.length-x.length);
    for(const w of words){const g=sg?[...sg.segment(w)].map(x=>x.segment).join(WJ):w.split('').join(WJ);if(g!==w)GL.push([w,g])}return GL}
  RE.push([/\s\/\s(?=\S{1,6}$)/g,NB+'/'+NB],[/(\d)-(?=\d)/g,'$1\u2011'],[/([ก-๙\)])\s(?=[A-Z][A-Z0-9.]{1,6}(\b|$))/g,'$1'+NB],[/(\d)\s+(?=(ซม\.|มม\.|ม\.|กม\.|ล้านบาท))/g,'$1'+NB]);
  function glue(root){
    const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:n=>{const p=n.parentElement;return p&&!p.closest('script,style,textarea,input,select,option,svg,code,pre,.qr,.marq,.tick')&&/[ก-๙]/.test(n.nodeValue)?1:2}});
    const L=[];while(w.nextNode())L.push(w.currentNode);
    for(const n of L){let v=n.nodeValue;if(v.includes(WJ))continue;for(const[w,g]of glueList())if(v.includes(w))v=v.split(w).join(g);for(const[a,b]of RE)v=v.replace(a,b);if(v!==n.nodeValue)n.nodeValue=v}
  }
  return{glueNode:glue,init(page){glue(page);setup();document.body.dataset.pid=R.page==='product'?String(R.pid).padStart(2,'0'):'';bnav();reveal(page);countUp(page);tilt(page);dust(page)}};
})();
