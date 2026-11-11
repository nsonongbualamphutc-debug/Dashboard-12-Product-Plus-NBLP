/* =====================================================================
   12 Plus+ · pages15.js — ออกแบบภาพข้อมูลใหม่ (อ่านง่าย · มีตัวเลขบนกราฟ · tooltip การ์ด)
   - แนวโน้มรายปี = กราฟเส้น "รวมทั้งจังหวัด" + ตัวเลขทุกจุด + ป้าย % เปลี่ยนแปลง
   - สลับมุมมองได้: รวมทั้งจังหวัด | แนวโน้มรายอำเภอ (เส้น + ป้ายชื่อปลายเส้น) | เทียบอำเภอ (แท่งปีนี้ vs ปีก่อน)
   - ไม่ใช้แท่งซ้อนที่ไม่มีตัวเลขอีกต่อไป
   - tooltip แบบการ์ดกระจก: ค่า · หน่วย · % ของทั้งหมด · เทียบปีก่อน ▲▼
   - ตัดปีหัว/ท้ายที่ไม่มีข้อมูล (ปีล่าสุด = ปีล่าสุดที่มีค่าจริง)
   ===================================================================== */
(function(){
if(typeof styCfg0!=='function'||typeof STY==='undefined')return;
STY.mode=STY.mode||{};
const FONT='Kanit, Sarabun, sans-serif';
const TOT='รวมทั้งจังหวัด';
const isAvg=b=>!!(b.ds&&b.ds.agg==='avg');
const tk=(v,u)=>u==='%'?v+'%':Math.abs(v)>=1e6?fShort(v):nf.format(Math.round(v*100)/100);
const pct=(a,b)=>b?(a-b)/Math.abs(b)*100:null;
const pf=g=>Math.abs(g)>=300?'×'+(1+g/100).toLocaleString('th-TH',{maximumFractionDigits:1}):(g>=0?'+':'−')+Math.abs(g).toFixed(Math.abs(g)<10?1:0)+'%';
const chg=g=>Math.abs(g)<.05?['= '+L('เท่าเดิม','flat'),'#8C6F7D']:[(g>=0?'▲ ':'▼ ')+pf(g).replace(/^[+−]/,''),g>=0?'#1f9d55':'#d64545'];

/* ---------- 1) ตัดปีหัว/ท้ายที่ไม่มีข้อมูล + ธงตัวเลขเดี่ยว ---------- */
const _si=styItems;styItems=function(p){return _si(p).map(b=>{try{
  if(b.empty||!b.rows||b.form==='cal'||b.form==='status')return b;
  const yy=b.rows.filter(r=>+r.value>0).map(r=>r.year);if(!yy.length)return b;
  const a=Math.min(...yy),z=Math.max(...yy);
  if(b.rows.some(r=>r.year<a||r.year>z))b.rows=Object.assign(b.rows.filter(r=>r.year>=a&&r.year<=z),{unit:b.rows.unit,src:b.rows.src,name:b.rows.name});
  const A=styAgg(b.rows);b.one=A.ys.length===1&&!A.ds.length&&A.ts.filter(t=>t!=='รวม').length<=1&&!['share','pair','band','cost'].includes(b.form);
 }catch(e){}return b})};

/* ---------- 2) ชุดข้อมูลสำหรับวาด ---------- */
function series(b){const A=styAgg(b.rows),R=b.rows,avg=isAvg(b);
  const agg=L0=>{L0=L0.filter(r=>r.value!=null&&+r.value>0);if(!L0.length)return null;const s=L0.reduce((a,r)=>a+(+r.value),0);return avg?s/L0.length:s};
  const yr=y=>{const Y=R.filter(r=>r.year===y);const T=Y.filter(r=>r.dist===TOT&&+r.value>0);return T.length&&A.ds.length?T:Y.filter(r=>r.dist!==TOT||!A.ds.length)};
  const distV=(y,d)=>{const Y=R.filter(r=>r.year===y&&r.dist===d&&+r.value>0);if(!Y.length)return null;const s=Y.reduce((a,r)=>a+(+r.value),0);return avg?s/Y.length:s};
  const tot=A.ys.map(y=>{if(avg&&A.ds.length){const v=A.ds.map(d=>distV(y,d)).filter(x=>x!=null);return v.length?v.reduce((a,x)=>a+x,0)/v.length:null}return agg(yr(y))});
  const last=v=>{for(let i=v.length-1;i>=0;i--)if(v[i]!=null)return v[i];return 0};
  const dist=A.ds.map(d=>({k:d,label:dShort(d),v:A.ys.map(y=>distV(y,d))})).filter(s=>s.v.some(x=>x!=null)).sort((x,y)=>last(y.v)-last(x.v));
  const types=A.ts.filter(t=>t!=='รวม').map(t=>({k:t,label:tLab(t),v:A.ys.map(y=>agg(yr(y).filter(r=>(r.type||'รวม')===t)))})).filter(s=>s.v.some(x=>x!=null)).sort((x,y)=>last(y.v)-last(x.v));
  const nd=A.ys.map(y=>new Set(R.filter(r=>r.year===y&&+r.value>0&&r.dist&&r.dist!==TOT).map(r=>r.dist)).size);const mx=Math.max(0,...nd);
  const K=nd.length-1,pm=Math.max(0,...nd.slice(0,K));const part=A.ys.map((_,i)=>A.ds.length>=2&&i===K&&K>0&&nd[K]>0&&nd[K]<pm*.7?nd[K]+'/'+pm:null);
  return{A,ys:A.ys,ysL:A.ys.map(yCE),tot,dist,types,avg,part}}

/* ---------- 2b) วิเคราะห์แนวโน้ม ---------- */
function linfit(xs,ys){const n=xs.length;if(n<2)return null;const mx=xs.reduce((a,x)=>a+x,0)/n,my=ys.reduce((a,y)=>a+y,0)/n;let sxy=0,sxx=0,syy=0;xs.forEach((x,i)=>{sxy+=(x-mx)*(ys[i]-my);sxx+=(x-mx)**2;syy+=(ys[i]-my)**2});
  const m=sxx?sxy/sxx:0,c=my-m*mx;return{m,c,r2:syy?(sxy*sxy)/(sxx*syy):1,f:x=>m*x+c}}
function trend(b,S){S=S||series(b);const ys=S.ys;if(ys.length<2)return null;
  const ok=S.tot.map((v,i)=>v!=null&&!S.part[i]);let I=ys.map((_,i)=>i).filter(i=>ok[i]);let weak=false;if(I.length<2){weak=true;I=ys.map((_,i)=>i).filter(i=>S.tot[i]!=null)}if(I.length<2)return null;
  const v=I.map(i=>S.tot[i]),y=I.map(i=>ys[i]);const f=v[0],l=v[v.length-1],span=y[y.length-1]-y[0];
  const all=(l-f)/Math.abs(f||1)*100,cagr=span>=2&&f>0&&l>0?(Math.pow(l/f,1/span)-1)*100:null;
  const steps=v.slice(1).map((x,k)=>x-v[k]);const up=steps.filter(d=>d>0).length,dn=steps.filter(d=>d<0).length;
  const rate=cagr!=null?cagr:all;let dir,ic;
  if(weak){dir=L('ยังสรุปไม่ได้','Inconclusive');ic='flat'}
  else if(Math.abs(rate)<2&&Math.abs(all)<5){dir=L('ทรงตัว','Stable');ic='flat'}
  else if(up===steps.length){dir=L('เพิ่มขึ้นต่อเนื่อง','Rising steadily');ic='up'}
  else if(dn===steps.length){dir=L('ลดลงต่อเนื่อง','Falling steadily');ic='dn'}
  else if(all>0){dir=L('มีแนวโน้มเพิ่มขึ้น (ผันผวน)','Up, with swings');ic='up'}
  else{dir=L('มีแนวโน้มลดลง (ผันผวน)','Down, with swings');ic='dn'}
  let hi=0,lo=0;v.forEach((x,k)=>{if(x>v[hi])hi=k;if(x<v[lo])lo=k});
  const fit=I.length>=3?linfit(y,v):null;const nx=ys[ys.length-1]+1;const fc=fit?Math.max(0,fit.f(nx)):null;
  const D=(S.dist||[]).map(s=>{const a=I.map(i=>s.v[i]);const k0=a.findIndex(x=>x>0),k1=a.length-1-[...a].reverse().findIndex(x=>x>0);if(k0<0||k1<=k0)return null;return{n:s.label,g:(a[k1]-a[k0])/a[k0]*100}}).filter(Boolean).sort((a,b)=>b.g-a.g);
  const partY=ys.map((yy,i)=>S.part[i]?yCE(yy)+' ('+S.part[i]+')':null).filter(Boolean);
  return{dir,ic,all,cagr,f,l,y0:y[0],y1:y[y.length-1],hi:{y:y[hi],v:v[hi]},lo:{y:y[lo],v:v[lo]},fit,fc,nx,r2:fit?fit.r2:null,best:D[0]&&D[0].g>0?D[0]:null,worst:D.length&&D[D.length-1].g<0?D[D.length-1]:null,partY,n:I.length,weak}}

/* ---------- 3) มุมมองที่เลือกได้ ---------- */
const TREND=['stack','rank','growth','flow','tally','mix','tallyd','cost'];
function modes(b){if(b.empty||b.one||!b.rows||!TREND.includes(b.form))return null;const S=series(b);const m=[];
  if(S.ys.length>=2)m.push(['total',S.avg?L('ค่าเฉลี่ยจังหวัด','Province avg'):L('รวมทั้งจังหวัด','Province total'),'trend']);
  if(S.dist.length>=2&&S.ys.length>=2)m.push(['dist',L('แนวโน้มรายอำเภอ','By district'),'lines']);
  if(S.dist.length>=2)m.push(['cmp',S.ys.length>=2?L('เทียบอำเภอ','Compare districts'):L('จัดอันดับอำเภอ','District ranking'),'bars']);
  if(S.types.length>=2&&!b.tMix)m.push(['type',L('แยกประเภท','By type'),S.ys.length>=2?'lines':'bars']);
  return m.length?m:null}
function curMode(b){const m=modes(b);if(!m)return null;const k=STY.mode[b.d.code];if(k&&m.some(x=>x[0]===k))return k;
  if(b.form==='rank'&&m.some(x=>x[0]==='cmp'))return'cmp';if(m.some(x=>x[0]==='type')&&!m.some(x=>x[0]==='dist')&&series(b).ys.length>=2)return'type';return m[0][0]}

/* ---------- 4) ตัวเลือกพื้นฐาน ---------- */
const grad=(c0,a0=.34,a1=0)=>ctx=>{const ch=ctx.chart,ca=ch.chartArea;if(!ca)return rgba(c0,a0*.5);const g=ch.ctx.createLinearGradient(0,ca.top,0,ca.bottom);g.addColorStop(0,rgba(c0,a0));g.addColorStop(1,rgba(c0,a1));return g};
function opts(b,big,o){const intg=(b.rows||[]).every(r=>r.value==null||Number.isInteger(+r.value))&&!isAvg(b);const u=b.unit,fs=big?16:12.5,mut=css('--muted'),grid=isDark()?'rgba(255,255,255,.08)':'rgba(70,20,45,.08)';
  return dmerge({responsive:true,maintainAspectRatio:false,animation:{duration:850,easing:'easeOutQuart'},interaction:{mode:'index',intersect:false},
    layout:{padding:{top:big?40:32,right:big?28:18,left:2,bottom:0}},
    plugins:{legend:{display:false},plab:{unit:uLab(u),big:!!big,u}},
    scales:{x:{offset:true,grid:{display:false},border:{display:false},ticks:{color:mut,padding:6,font:{family:FONT,size:fs}}},
      y:{beginAtZero:true,grace:'14%',border:{display:false},grid:{color:grid,drawTicks:false},ticks:{color:mut,padding:10,maxTicksLimit:6,precision:intg?0:undefined,font:{family:FONT,size:fs-1},callback:v=>tk(v,u)}}}},o||{})}
const ptStyle=(c,big,main)=>({borderColor:c,pointRadius:main?(big?7:5.5):(big?5:3.6),pointHoverRadius:main?(big?10:8):(big?8:6),pointBackgroundColor:'#fff',pointBorderColor:c,pointBorderWidth:main?3:2,pointHoverBorderWidth:3,tension:.34,cubicInterpolationMode:'monotone',spanGaps:true,_fx:1});

function cfgTotal(b,big,S){const c0=PA(b.p);const T=trend(b,S);const fc=T&&T.fit&&T.n>=3&&T.r2>=.2;
  const labels=fc?S.ysL.concat(yCE(T.nx)):S.ysL;const pad=a=>fc?a.concat([null]):a;
  const tl=fc?{label:L('เส้นแนวโน้ม / คาดการณ์','Trend / projection'),data:labels.map((_,i)=>i>=S.ys.length?T.fc:(i===0||i===S.ys.length-1?Math.max(0,T.fit.f(S.ys[0]+i)):null)),
    borderColor:rgba(c0,.55),borderDash:[3,5],borderWidth:2,pointRadius:labels.map((_,i)=>i===labels.length-1?(big?7:5.5):0),pointStyle:'circle',pointBackgroundColor:isDark()?'#1D0F19':'#fff',pointBorderColor:rgba(c0,.7),pointBorderWidth:2,pointHoverRadius:labels.map((_,i)=>i===labels.length-1?8:0),fill:false,spanGaps:true,tension:0,_fx:1,_trend:1}:null;
  return{type:'line',data:{labels,datasets:[Object.assign({label:S.avg?L('ค่าเฉลี่ยจังหวัด','Province average'):(S.dist.length?L('รวมทั้งจังหวัด','Province total'):L('รวม','Total')),data:S.tot,backgroundColor:grad(c0),fill:'origin',borderWidth:big?4.5:3.4,order:1,segment:{borderDash:ctx=>S.part[ctx.p1DataIndex]||S.part[ctx.p0DataIndex]?[7,6]:undefined}},ptStyle(c0,big,true),{data:pad(S.tot)})].concat(tl?[Object.assign(tl,{order:2})]:[])},
    options:opts(b,big,{layout:{padding:{right:fc?(big?40:26):undefined}},plugins:{plab:{mode:'all',yoy:true,part:S.part,fc:fc?{v:T.fc,lab:L('คาดการณ์','Projected')}:null}}})}}
function cfgLines(b,big,S,list){const pal=styPal(b.p,list.length);const many=list.length>4;
  return{type:'line',data:{labels:S.ysL,datasets:list.map((s,i)=>Object.assign({label:s.label,data:s.v,backgroundColor:pal[i],fill:false,borderWidth:i===0?(big?4.2:3.2):(big?2.6:2)},ptStyle(pal[i],big,i===0)))},
    options:opts(b,big,{layout:{padding:{right:big?170:(many?128:118)}},plugins:{plab:{mode:'end'}}})}}
function cfgBars(b,big,S,list,kind){/* แท่งแนวนอน ปีล่าสุด (สี) ทับปีก่อน (จาง) */
  const n=S.ys.length,cur=list.map(s=>s.v[n-1]),prv=n>=2?list.map(s=>s.v[n-2]):null;
  const keep=list.map((s,i)=>(cur[i]||0)>0||(prv&&(prv[i]||0)>0));const L0=list.filter((_,i)=>keep[i]),C=cur.filter((_,i)=>keep[i]),Pv=prv&&prv.filter((_,i)=>keep[i]);
  const ramp=styRamp(b.p,Math.max(2,L0.length));const th=big?30:Math.max(12,Math.min(22,220/Math.max(1,L0.length)));
  const ds=[];if(Pv&&Pv.some(v=>v))ds.push({label:yCE(S.ys[n-2]),data:Pv,backgroundColor:rgba(PA(b.p),.16),borderColor:rgba(PA(b.p),.35),borderWidth:{right:2},borderSkipped:false,borderRadius:8,grouped:false,barThickness:th+10,order:2,_fx:1,_prev:1});
  ds.push({label:yCE(S.ys[n-1]),data:C,backgroundColor:L0.map((_,i)=>ramp[i]),borderRadius:8,grouped:false,barThickness:th,order:1,_fx:1});
  const vals=C.filter(v=>v>0);const av=vals.length>=3&&Math.max(...vals)>Math.min(...vals)*1.05?vals.reduce((a,v)=>a+v,0)/vals.length:null;
  const o=opts(b,big,{indexAxis:'y',interaction:{mode:'index',axis:'y',intersect:false},layout:{padding:{right:big?150:120,top:big?36:28}},
    plugins:{plab:{mode:'hbar',avg:av,avgLab:S.avg||kind==='type'?L('ค่าเฉลี่ย','Average'):L('เฉลี่ยต่ออำเภอ','District avg')}},
    scales:{x:{grid:{color:isDark()?'rgba(255,255,255,.08)':'rgba(70,20,45,.07)',drawTicks:false},border:{display:false},beginAtZero:true,grace:'4%',ticks:{color:css('--muted'),maxTicksLimit:6,precision:(b.rows||[]).every(r=>r.value==null||Number.isInteger(+r.value))&&!isAvg(b)?0:undefined,font:{family:FONT,size:big?14:11.5},callback:v=>tk(v,b.unit)}},
      y:{grid:{display:false},border:{display:false},ticks:{color:css('--ink'),font:{family:FONT,size:big?16:13,weight:'500'},padding:6,callback:function(v){return this.getLabelForValue(v)}}}}});
  return{type:'bar',data:{labels:L0.map(s=>s.label),datasets:ds},options:o,_bullet:ds.length>1}}

const pairU=(b,t)=>b.form==='pair'&&/กลุ่ม/.test(t)&&/ราย|คน/.test(b.unit)?'กลุ่ม':null;
function mine(b,big){if(b.empty||b.one)return null;
  if(b.form==='pair'){const S=series(b);if(S.types.length<2)return null;
    const c=S.ys.length>=3?cfgLines(b,big,S,S.types):cfgBars(b,big,S,S.types,'type');
    const um={};S.types.forEach(s=>{const x=pairU(b,s.k);um[s.label]=uLab(x||b.unit)});c.options.plugins.plab.um=um;c._um=um;
    if(Object.values(um).some(x=>x!==uLab(b.unit)))c.options.plugins.plab.unit=[...new Set(Object.values(um))].join(' / ');return c}
  if(b.form==='share'||b.form==='tallyd'&&false)return null;
  if(!TREND.includes(b.form))return null;const S=series(b);const m=curMode(b);
  if(m==='total')return cfgTotal(b,big,S);
  if(m==='dist')return cfgLines(b,big,S,S.dist);
  if(m==='cmp')return cfgBars(b,big,S,S.dist,'dist');
  if(m==='type')return S.ys.length>=2?cfgLines(b,big,S,S.types):cfgBars(b,big,S,S.types,'type');
  if(!m&&S.types.length>=2)return cfgBars(b,big,S,S.types,'type');
  return null}

const _c0=styCfg0;styCfg0=function(b,big){try{const c=mine(b,big);if(c){c._own=1;return c}}catch(e){console.error('pages15',e)}return _c0(b,big)};

/* ---------- 5) ชั้นนอก: tooltip การ์ด + ปิดป้ายแท่งเดิมสำหรับกราฟชุดใหม่ ---------- */
const _sc=styCfg;styCfg=function(b,big){const c=_sc(b,big);if(!c)return c;c.options=c.options||{};const P=c.options.plugins=c.options.plugins||{};
  P.tooltip=Object.assign({},P.tooltip,{enabled:false,external:extTip});
  P.ctip={um:c._um||null,code:b.d.code,u:b.unit,src:b.agency||'',real:!!b.real,avg:isAvg(b),bullet:!!c._bullet,big:!!big};
  if(c._own){P.vlab=false}
  if(c.type==='doughnut'||c.type==='polarArea'){c.options.interaction={mode:'nearest',intersect:true};P.plab=Object.assign({},P.plab,{mode:'arc',u:b.unit})}
  else if(!c._own){P.plab=Object.assign({unit:uLab(b.unit),u:b.unit,big:!!big},P.plab);c.options.layout=dmerge(c.options.layout||{},{padding:{top:big?40:30}})}
  return c};

/* ---------- 6) ปลั๊กอินวาดตัวเลข / ป้าย ---------- */
if(window.Chart){
const halo=()=>isDark()?'rgba(29,15,25,.92)':'rgba(255,255,255,.94)';
const txt=(ctx,s,x,y,col,font)=>{ctx.font=font;ctx.lineJoin='round';ctx.lineWidth=4;ctx.strokeStyle=halo();ctx.strokeText(s,x,y);ctx.fillStyle=col;ctx.fillText(s,x,y)};
const pill=(ctx,s,x,y,col,font)=>{ctx.font=font;const w=ctx.measureText(s).width+14,h=parseInt(font.match(/(\d+)px/)[1])+8;ctx.save();ctx.beginPath();(ctx.roundRect?ctx.roundRect(x-w/2,y-h/2,w,h,h/2):ctx.rect(x-w/2,y-h/2,w,h));
  ctx.fillStyle=isDark()?'rgba(20,10,18,.88)':'#fff';ctx.shadowColor='rgba(60,20,40,.18)';ctx.shadowBlur=6;ctx.fill();ctx.shadowBlur=0;ctx.strokeStyle=col;ctx.globalAlpha=.55;ctx.lineWidth=1;ctx.stroke();ctx.globalAlpha=1;ctx.fillStyle=col;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(s,x,y+.5);ctx.restore()};
const UP='#1f9d55',DN='#d64545';
const colOf=ds=>typeof ds.borderColor==='string'?ds.borderColor:(typeof ds.backgroundColor==='string'?ds.backgroundColor:'#E8559A');
Chart.register({id:'plab',afterDatasetsDraw(ch,_a,o){if(!o||(!o.mode&&!o.unit))return;const ctx=ch.ctx,ca=ch.chartArea,big=o.big,fs=big?16:12.5,u=o.u;const ink=isDark()?'#FBE9F2':'#2C1A23',mut=css('--muted')||'#8C6F7D';
  const F=w=>`${w} ${fs}px ${FONT}`,Fs=w=>`${w} ${Math.round(fs*.86)}px ${FONT}`;
  ctx.save();
  if(o.unit&&o.mode!=='arc'){ctx.textAlign='left';ctx.textBaseline='bottom';ctx.font=Fs(400);ctx.fillStyle=mut;ctx.fillText(L('หน่วย: ','Unit: ')+o.unit,ca.left-(ch.options.indexAxis==='y'?0:4),ca.top-(big?18:14))}
  const vis=ch.data.datasets.map((d,i)=>({d,i,m:ch.getDatasetMeta(i)})).filter(x=>!x.m.hidden&&x.m.visible!==false);
  if(o.mode==='all'&&o.fc){const tv=vis.find(x=>x.d._trend);if(tv){const el=tv.m.data[tv.m.data.length-1];if(el){ctx.textAlign='center';ctx.textBaseline='bottom';txt(ctx,'~'+fv(o.fc.v,u),el.x,el.y-(big?14:11),mut,F(500));ctx.textBaseline='top';txt(ctx,o.fc.lab,el.x,el.y+(big?12:9),mut,Fs(400))}}}
  if(o.mode==='all'&&vis[0]){const {d,m}=vis[0];const pts=m.data;const col=colOf(d);const sp=pts.length>1?Math.abs(pts[1].x-pts[0].x):999;const dense=sp<(big?110:78);const vdense=sp<(big?70:48);
    let prev=null;pts.forEach((el,j)=>{const v=d.data[j];if(v==null||el.skip)return;
      if(o.yoy&&!dense&&prev&&!(o.part&&(o.part[j]||o.part[prev.j]))){const g=pct(v,prev.v);if(g!=null&&isFinite(g)){const mx=(prev.el.x+el.x)/2,my=(prev.el.y+el.y)/2-(big?24:19);{const [s,c]=chg(g);pill(ctx,s,mx,Math.max(ca.top+8,my),c,Fs(600))}}}
      prev={v,el,j}});
    ctx.textAlign='center';ctx.textBaseline='bottom';const nn=d.data.map((v,j)=>v!=null?j:-1).filter(j=>j>=0);let jmx=nn[0];nn.forEach(j=>{if(d.data[j]>d.data[jmx])jmx=j});
    pts.forEach((el,j)=>{const v=d.data[j];if(v==null||el.skip)return;if(vdense&&j!==nn[0]&&j!==nn[nn.length-1]&&j!==jmx)return;ctx.font=F(600);if(dense&&!vdense&&j>0&&ctx.measureText(fv(v,u)).width>sp-4&&j%2)return;txt(ctx,fv(v,u),el.x,el.y-(big?14:11),ink,F(600));if(o.part&&o.part[j]){ctx.textBaseline='top';txt(ctx,L('รายงาน ','')+o.part[j]+L(' อำเภอ',' districts'),el.x,el.y+(big?14:11),'#B7791F',Fs(500));ctx.textBaseline='bottom'}})}
  if(o.mode==='end'){const L0=[];vis.forEach(({d,m})=>{for(let j=d.data.length-1;j>=0;j--){if(d.data[j]!=null&&m.data[j]){L0.push({y:m.data[j].y,x:m.data[j].x,name:d.label,v:d.data[j],c:colOf(d)});break}}});
    L0.sort((a,b)=>a.y-b.y);const gap=fs+5;for(let k=1;k<L0.length;k++)if(L0[k].y-L0[k-1].y<gap)L0[k].y=L0[k-1].y+gap;
    const over=L0.length?L0[L0.length-1].y-(ca.bottom+fs):0;if(over>0)L0.forEach(x=>x.y-=over);
    ctx.textBaseline='middle';L0.forEach(x=>{const X=ca.right+12;ctx.strokeStyle=x.c;ctx.globalAlpha=.5;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x.x+6,x.y);ctx.lineTo(X-3,x.y);ctx.stroke();ctx.globalAlpha=1;
      ctx.textAlign='left';ctx.font=F(600);ctx.fillStyle=x.c;let nm=x.name;while(ctx.measureText(nm).width>(big?96:68)&&nm.length>3)nm=nm.slice(0,-2)+'…';ctx.fillText(nm,X,x.y);const w=ctx.measureText(nm).width;ctx.font=F(500);ctx.fillStyle=ink;ctx.fillText(' '+fv(x.v,u),X+w,x.y)})}
  if(o.mode==='hbar'){const curI=vis.findIndex(x=>!x.d._prev);const cur=vis[curI],pr=vis.find(x=>x.d._prev);if(cur){ctx.textBaseline='middle';ctx.textAlign='left';
    if(o.avg!=null&&ch.scales.x){const X=ch.scales.x.getPixelForValue(o.avg);ctx.save();ctx.setLineDash([5,5]);ctx.strokeStyle=mut;ctx.globalAlpha=.8;ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(X,ca.top-4);ctx.lineTo(X,ca.bottom);ctx.stroke();ctx.restore();
      ctx.textAlign='center';ctx.textBaseline='bottom';txt(ctx,`${o.avgLab} ${fv(o.avg,u)}`,X,ca.top-6,mut,Fs(500));ctx.textAlign='left';ctx.textBaseline='middle'}
    cur.m.data.forEach((el,j)=>{const v=cur.d.data[j];const pv=pr?pr.d.data[j]:null;const pe=pr?pr.m.data[j]:null;const end=Math.max(el.x,pe&&pv?pe.x:0)+8;
      if(v==null||!(v>0)){if(pv){ctx.font=Fs(400);ctx.fillStyle=mut;ctx.fillText(L('ยังไม่รายงาน','not reported'),end,el.y)}return}
      ctx.font=F(600);ctx.fillStyle=ink;const um=o.um&&o.um[ch.data.labels[j]];const s=fv(v,u)+(um?' '+um:'');ctx.fillText(s,end,el.y);const g=pv?pct(v,pv):null;
      if(g!=null&&isFinite(g)){const w=ctx.measureText(s).width;const [cs,cc]=chg(g);ctx.font=Fs(600);ctx.fillStyle=cc;ctx.fillText('  '+cs,end+w+2,el.y)}})}}
  if(o.mode==='arc'){const m=ch.getDatasetMeta(0),d=ch.data.datasets[0];if(m&&d){const S=d.data.reduce((a,v)=>a+(+v||0),0)||1;ctx.textAlign='center';ctx.textBaseline='middle';
    m.data.forEach((el,j)=>{const v=+d.data[j]||0;if(v/S<.05||el.hidden)return;const p=el.tooltipPosition();ctx.font=`700 ${big?17:13}px ${FONT}`;ctx.lineWidth=3;ctx.strokeStyle='rgba(0,0,0,.25)';ctx.strokeText(Math.round(v/S*100)+'%',p.x,p.y);ctx.fillStyle='#fff';ctx.fillText(Math.round(v/S*100)+'%',p.x,p.y)})}}
  ctx.restore()},
 afterDraw(ch){/* เส้นแนวตั้งตามเมาส์ (กราฟเส้น) */const a=ch.tooltip&&ch.tooltip.getActiveElements&&ch.tooltip.getActiveElements();if(!a||!a.length||ch.config.type!=='line')return;
  const x=a[0].element.x,ca=ch.chartArea,ctx=ch.ctx;ctx.save();const g=ctx.createLinearGradient(0,ca.top,0,ca.bottom);g.addColorStop(0,'rgba(232,85,154,0)');g.addColorStop(.5,'rgba(232,85,154,.45)');g.addColorStop(1,'rgba(232,85,154,0)');ctx.strokeStyle=g;ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x,ca.top);ctx.lineTo(x,ca.bottom);ctx.stroke();ctx.restore()}});
}

/* ---------- 7) tooltip การ์ดกระจก ---------- */
function extTip(ctx){const ch=ctx.chart,t=ctx.tooltip;const host=ch.canvas.parentNode;if(!host)return;let el=host.querySelector(':scope>.ctip');
  if(!el){el=document.createElement('div');el.className='ctip';el.setAttribute('aria-hidden','true');host.appendChild(el);if(getComputedStyle(host).position==='static')host.style.position='relative'}
  if(!t||t.opacity===0||!t.dataPoints||!t.dataPoints.length){el.classList.remove('on');return}
  const M=(ch.options.plugins&&ch.options.plugins.ctip)||{};const u=M.u||'',U=u==='%'?'':' '+esc(uLab(u));const type=ch.config.type,hz=ch.options.indexAxis==='y';const uu=k=>M.um&&M.um[k]?' '+esc(M.um[k]):U;const mixU=M.um&&new Set(Object.values(M.um)).size>1;
  const val=d=>typeof d.raw==='number'?d.raw:(hz?d.parsed.x:(d.parsed&&d.parsed.y!=null?d.parsed.y:+d.raw));
  let pts=t.dataPoints.filter(d=>{const v=val(d);return v!=null&&!isNaN(v)});const trendOnly=pts.length&&pts.every(d=>d.dataset._trend);if(!trendOnly)pts=pts.filter(d=>!d.dataset._trend);if(!pts.length){el.classList.remove('on');return}
  const col=(d,i)=>{const c=t.labelColors&&t.labelColors[t.dataPoints.indexOf(d)];const x=c&&(type==='line'?c.borderColor:c.backgroundColor);return typeof x==='string'?x:colOfDs(d.dataset,d.dataIndex)};
  const title=type==='doughnut'||type==='polarArea'?esc(pts[0].label):esc(pts[0].label);
  let body='',sub='';
  if(type==='doughnut'||type==='polarArea'){const d=pts[0];const S=d.dataset.data.reduce((a,v)=>a+(+v||0),0)||1;const v=val(d);
    body=`<li><i style="background:${col(d)}"></i><span>${esc(d.label)}</span><b>${fv(v,u)}${U}</b><div class="bar" style="color:${col(d)}"><s style="width:${v/S*100}%"></s></div><div class="m"><span>${(v/S*100).toFixed(1)}% ${L('ของทั้งหมด','of total')}</span></div></li>`;sub=L('รวม ','Total ')+fv(S,u)+U}
  else if(M.bullet){const cur=pts.find(d=>!d.dataset._prev),pv=pts.find(d=>d.dataset._prev);const v=cur?val(cur):null,p=pv?val(pv):null;const g=v!=null&&p?pct(v,p):null;
    const all=cur?cur.dataset.data.filter(x=>x>0):[];const S=all.reduce((a,x)=>a+x,0)||1;
    body=(cur?`<li><i style="background:${col(cur)}"></i><span>${L('ปี','')} ${esc(cur.dataset.label)}</span><b>${v>0?fv(v,u)+uu(cur.label):'—'}</b>${!M.avg&&!mixU&&v>0?`<div class="bar" style="color:${col(cur)}"><s style="width:${v/S*100}%"></s></div><div class="m"><span>${(v/S*100).toFixed(1)}% ${L('ของทั้งจังหวัด','of province')}</span></div>`:''}</li>`:'')+
      (pv?`<li class="pv"><i style="background:${rgba(PA(STY.p||{pa:'#E8559A'}),.35)}"></i><span>${L('ปี','')} ${esc(pv.dataset.label)}</span><b>${p>0?fv(p,u)+uu(pv.label):'—'}</b></li>`:'');
    if(g!=null&&isFinite(g))sub=`<span class="${g>=0?'up':'dn'}">${g>=0?'▲':'▼'} ${pf(g).replace(/^[+−]/,'')}</span> ${L('จากปีก่อน','vs prior year')}`}
  else{const multi=pts.length>1;if(multi)pts=pts.slice().sort((a,b)=>val(b)-val(a));const S=pts.reduce((a,d)=>a+val(d),0);const share=multi&&!M.avg&&!mixU&&u!=='%'&&S>0;
    const prevOf=d=>{if(hz)return null;const a=d.dataset.data;for(let k=d.dataIndex-1;k>=0;k--)if(a[k]!=null&&!isNaN(a[k]))return{v:+a[k],l:ch.data.labels[k]};return null};
    const show=pts.slice(0,8);
    body=show.map(d=>{const v=val(d),p=prevOf(d),g=p?pct(v,p.v):null;
      return`<li><i style="background:${col(d)}"></i><span>${esc(d.dataset.label||d.label||'')}</span><b>${fv(v,u)}${uu(d.dataset.label)}</b>${share?`<div class="bar" style="color:${col(d)}"><s style="width:${v/S*100}%"></s></div>`:''}${share||g!=null?`<div class="m">${share?`<span>${(v/S*100).toFixed(1)}%</span>`:''}${g!=null&&isFinite(g)?`<span class="${g>=0?'up':'dn'}">${g>=0?'▲':'▼'} ${pf(g).replace(/^[+−]/,'')} ${L('จาก','vs')} ${esc(p.l)}</span>`:''}</div>`:''}</li>`}).join('')+
      (pts.length>8?`<li class="more">+${pts.length-8} ${L('รายการ','more')}</li>`:'');
    if(trendOnly)sub=L('ประมาณการจากเส้นแนวโน้มเชิงเส้น ไม่ใช่ข้อมูลจริง','Linear-trend estimate, not reported data');else if(share)sub=`${L('รวม','Total')} <b>${fv(S,u)}${U}</b>`;else if(multi&&M.avg)sub=`${L('เฉลี่ย','Average')} <b>${fv(S/pts.length,u)}${U}</b>`}
  el.innerHTML=`<h6><span>${title}</span>${M.real===false?`<small>${L('ข้อมูลจำลอง','simulated')}</small>`:''}</h6><ul>${body}</ul>${sub?`<div class="tt">${sub}</div>`:''}<footer>${esc(M.code||'')}${M.src?' · '+esc(M.src):''}</footer>`;
  el.classList.toggle('big',!!M.big);
  const cv=ch.canvas,ox=cv.offsetLeft,oy=cv.offsetTop,W=host.clientWidth,H=host.clientHeight;const w=el.offsetWidth,h=el.offsetHeight;
  let x=ox+t.caretX+16,y=oy+t.caretY-h/2;if(x+w>W-4)x=ox+t.caretX-w-16;if(x<4)x=4;y=Math.max(4,Math.min(H-h-4,y));
  el.style.setProperty('--x',Math.round(x)+'px');el.style.setProperty('--y',Math.round(y)+'px');el.classList.add('on')}
const colOfDs=(ds,i)=>{const c=Array.isArray(ds.backgroundColor)?ds.backgroundColor[i]:(typeof ds.borderColor==='string'?ds.borderColor:ds.backgroundColor);return typeof c==='string'?c:'#E8559A'};
window.STY_TIP=extTip;

/* หน่วยของ "กลุ่ม" ในรายการคู่ (ราย/กลุ่ม) */
const _fa=styFacts;styFacts=function(b){const F=_fa(b);if(b.form!=='pair'||!/ราย|คน/.test(b.unit))return F;return F.map(f=>/กลุ่ม/.test(f[0])?[f[0],String(f[1]).replace(' '+uLab(b.unit),' '+uLab('กลุ่ม'))]:f)};
const _in=styInsight;styInsight=function(b){const h=_in(b);if(b.form!=='pair'||!/ราย|คน/.test(b.unit))return h;try{const A=styAgg(b.rows);
  return L(`ปี ${yCE(A.ly)} `,`${yCE(A.ly)}: `)+A.ts.map(k=>[k,A.v(r=>r.year===A.ly&&r.type===k)]).filter(x=>x[1]>0).map(([k,v])=>`${esc(tLab(k))} <b>${fv(v,b.unit)}</b> ${uLab(pairU(b,k)||b.unit)}`).join(' · ')}catch(e){return h}};
const _kp=styKpi;styKpi=function(b){const k=_kp(b);if(b.form==='pair'&&/ราย|คน/.test(b.unit)){const A=styAgg(b.rows);if(pairU(b,A.ts[0]))k.u=uLab('กลุ่ม')}return k};

/* ---------- 8) ตัวเลขเดี่ยว (ปีเดียว ไม่มีอำเภอ/ประเภท) ---------- */
const _hv=styHtmlViz;styHtmlViz=function(b){if(!b.one)return _hv(b);const A=styAgg(b.rows),v=A.v(r=>r.year===A.ly);
  return`<div class="sty-one" style="--pa:${b.p.pa}"><em>${L('ปี','Year')} ${yCE(A.ly)}</em><b>${fv(v,b.unit)}</b><span>${esc(uLab(b.unit))}</span><small>${esc(L(b.item,b.en))}</small><i>${L('ข้อมูลปีเดียว · จะแสดงเป็นกราฟแนวโน้มเมื่อมีข้อมูลปีถัดไป','Single year · a trend appears once more years arrive')}</i></div>`};

/* ---------- 8b) แผงวิเคราะห์แนวโน้ม ---------- */
function trendPanel(b){if(b.empty||b.one||!b.rows||!TREND.concat(['pair']).includes(b.form))return'';const S=series(b);const T=trend(b,S);if(!T)return'';const u=b.unit,U=' '+esc(uLab(u));
  const ar=T.ic==='up'?'↗':T.ic==='dn'?'↘':'→';const cl=T.ic==='up'?'up':T.ic==='dn'?'dn':'fl';
  const g=x=>`<b class="${x>=0?'up':'dn'}">${x>=0?'+':'−'}${Math.abs(x).toFixed(Math.abs(x)<10?1:0)}%</b>`;
  const card=(k,v,s)=>`<div class="tp-c"><span>${k}</span>${v}${s?`<small>${s}</small>`:''}</div>`;
  const C=[card(L('ทิศทาง','Direction'),`<b class="tp-dir ${cl}"><i>${ar}</i>${T.dir}</b>`,`${yCE(T.y0)}–${yCE(T.y1)} · ${T.n} ${L('ปี','yrs')}`),
    card(L('เปลี่ยนแปลงทั้งช่วง','Total change'),g(T.all),`${fv(T.f,u)} → ${fv(T.l,u)}${U}`)];
  if(T.cagr!=null)C.push(card(L('โตเฉลี่ยต่อปี','Avg growth per year'),g(T.cagr),L('คิดแบบทบต้นทุกปี','compounded yearly')));
  C.push(card(L('สูงสุด / ต่ำสุด','Peak / low'),`<b>${yCE(T.hi.y)}</b>`,`${fv(T.hi.v,u)} / ${yCE(T.lo.y)}: ${fv(T.lo.v,u)}${U}`));
  if(T.best||T.worst)C.push(card(L('อำเภอที่น่าจับตา','Districts to watch'),`<b class="tp-ds">${T.best?`<em class="up">▲ ${esc(T.best.n)} ${g(T.best.g)}</em>`:''}${T.worst?`<em class="dn">▼ ${esc(T.worst.n)} ${g(T.worst.g)}</em>`:''}</b>`,L('เทียบปีแรก–ปีล่าสุดที่มีข้อมูล','first vs latest year')));
  if(T.fc!=null&&T.r2>=.2)C.push(card(L('คาดการณ์ปี ','Projected ')+yCE(T.nx),`<b>~${fv(T.fc,u)}</b>`,L('ประมาณจากแนวโน้มเดิม · ความแม่นยำ ','trend estimate · reliability ')+(T.r2>=.7?L('สูง','high'):T.r2>=.4?L('ปานกลาง','medium'):L('ต่ำ','low'))));
  const nm=esc(L(b.item,b.en)).replace(/^(จำนวน|ปริมาณ|มูลค่า)/,m=>m);
  if(T.weak){return`<section class="tp"><header>${L('วิเคราะห์แนวโน้ม','Trend analysis')}</header><p class="tp-s">${L(`<b>${nm}</b> ปีล่าสุดยังรายงานไม่ครบทุกอำเภอ จึง<b>ยังสรุปแนวโน้มไม่ได้</b> — ตัวเลขที่ลดลง/เพิ่มขึ้นอาจเกิดจากข้อมูลยังไม่ครบ ไม่ใช่การเปลี่ยนแปลงจริง`,`<b>${nm}</b>: latest year is incomplete, so no trend can be concluded yet.`)}</p>${T.partY.length?`<p class="tp-w">⚠ ${L('รอข้อมูล: ','Pending: ')}${esc(T.partY.join(', '))}</p>`:''}</section>`}
  let say=L(`<b>${nm}</b> ช่วงปี ${yCE(T.y0)}–${yCE(T.y1)} ${T.dir}`,`<b>${nm}</b> ${yCE(T.y0)}–${yCE(T.y1)}: ${T.dir.toLowerCase()}`)+(T.cagr!=null?L(` เฉลี่ยปีละ ${g(T.cagr)}`,`, ${g(T.cagr)}/yr`):L(` ${g(T.all)}`,` ${g(T.all)}`));
  if(T.hi.y!==T.y1&&T.n>=3)say+=L(` · จุดสูงสุดอยู่ที่ปี ${yCE(T.hi.y)}`,` · peaked in ${yCE(T.hi.y)}`);
  if(T.best)say+=L(` · อ.${esc(T.best.n.replace(/^อ\./,''))} โตเร็วที่สุด`,` · ${esc(T.best.n)} grew fastest`);
  if(T.worst)say+=L(` · อ.${esc(T.worst.n.replace(/^อ\./,''))} ลดลงมากที่สุด ควรติดตาม`,` · ${esc(T.worst.n)} fell most — watch`);
  const warn=T.partY.length?`<p class="tp-w">⚠ ${L('ปีที่รายงานไม่ครบทุกอำเภอ: ','Incomplete district reporting: ')}${esc(T.partY.join(', '))} — ${L('ไม่นำมาคิดแนวโน้ม','excluded from trend')}</p>`:'';
  return`<section class="tp" aria-label="${L('วิเคราะห์แนวโน้ม','Trend analysis')}"><header><svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M3 17l6-6 4 4 8-8M15 7h6v6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>${L('วิเคราะห์แนวโน้ม','Trend analysis')}</header><p class="tp-s">${say}</p><div class="tp-g">${C.join('')}</div>${warn}</section>`}
window.STY_TREND=trend;

/* ---------- 9) ปุ่มสลับมุมมองในบล็อก ---------- */
const MI={trend:'<path d="M3 17l5-5 4 3 8-8" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="8" cy="12" r="1.6" fill="currentColor"/><circle cx="12" cy="15" r="1.6" fill="currentColor"/>',
  lines:'<path d="M3 18l5-6 4 3 8-9M3 20l6-3 5 1 7-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  bars:'<path d="M4 6h12M4 12h16M4 18h8" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>'};
const _sb=styBlock;styBlock=function(b,i){let h=_sb(b,i);try{const tp=trendPanel(b);if(tp){const k=h.indexOf('<figure class="stb-viz">');const e=k<0?-1:h.indexOf('</figure>',k);if(e>0)h=h.slice(0,e)+tp+h.slice(e)}}catch(e){console.error(e)}if(b.form==='pair'&&/ราย|คน/.test(b.unit)&&styAgg(b.rows||[]).ts.some(t=>/กลุ่ม/.test(t)))h=h.replace(/<section class="stb-mix"[\s\S]*?<\/section>/,'');const m=modes(b);if(!m||m.length<2)return h;const cur=curMode(b);
  const seg=`<div class="stb-vm" role="group" aria-label="${L('มุมมองกราฟ','Chart view')}">${m.map(([k,t,icn])=>`<button type="button" data-vm="${k}" aria-pressed="${k===cur}"><svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">${MI[icn]}</svg>${t}</button>`).join('')}</div>`;
  return h.replace('<figure class="stb-viz">','<figure class="stb-viz">'+seg)};
const _b1=styBind1;styBind1=function(el){_b1(el);if(!el)return;const code=el.dataset.code;
  el.querySelectorAll('[data-vm]').forEach(bt=>bt.onclick=()=>{STY.mode[code]=bt.dataset.vm;el.querySelectorAll('[data-vm]').forEach(x=>x.setAttribute('aria-pressed',x===bt));
    const tip=el.querySelector('.ctip');if(tip)tip.remove();styKill(code);styDraw(code)})};

/* ---------- 10) สไตล์ ---------- */
const css0=`.stb-vm{display:flex;flex-wrap:wrap;gap:4px;padding:4px;margin:0 0 10px;border-radius:14px;background:color-mix(in srgb,var(--pa) 7%,transparent);border:1px solid color-mix(in srgb,var(--pa) 16%,transparent);width:max-content;max-width:100%}
.stb-vm button{font:inherit;font-size:12.5px;display:inline-flex;align-items:center;gap:6px;padding:6px 12px;border-radius:10px;border:0;background:transparent;color:var(--muted);cursor:pointer;transition:background .2s,color .2s,box-shadow .2s}
.stb-vm button:hover{color:var(--ink)}
.stb-vm button[aria-pressed="true"]{background:var(--surface,#fff);color:var(--pa);font-weight:600;box-shadow:0 2px 8px -2px color-mix(in srgb,var(--pa) 40%,transparent)}
.stb-cv,.ss-viz{position:relative}
.ctip{position:absolute;left:0;top:0;z-index:40;pointer-events:none;min-width:200px;max-width:290px;padding:12px 14px 10px;border-radius:16px;
  background:color-mix(in srgb,var(--surface,#fff) 86%,transparent);-webkit-backdrop-filter:blur(16px) saturate(1.5);backdrop-filter:blur(16px) saturate(1.5);
  border:1px solid color-mix(in srgb,var(--pa,#E8559A) 26%,transparent);box-shadow:0 22px 44px -20px rgba(50,10,35,.5),0 3px 8px rgba(50,10,35,.08);
  font:13px/1.35 Sarabun,Kanit,sans-serif;color:var(--ink);opacity:0;transform:translate(var(--x,0),var(--y,0)) scale(.96);transform-origin:left center;transition:opacity .16s ease,transform .24s cubic-bezier(.2,.8,.2,1)}
.ctip.on{opacity:1;transform:translate(var(--x,0),var(--y,0)) scale(1)}
.ctip.big{font-size:15px;min-width:240px;max-width:340px}
.ctip h6{margin:0 0 9px;font:600 14.5px/1.2 Kanit,sans-serif;display:flex;justify-content:space-between;align-items:baseline;gap:10px;color:var(--ink)}
.ctip.big h6{font-size:17px}
.ctip h6 small{font:400 11px Sarabun,sans-serif;color:var(--muted);padding:2px 7px;border-radius:99px;background:var(--surface-3,rgba(0,0,0,.05))}
.ctip ul{list-style:none;margin:0;padding:0;display:grid;gap:7px}
.ctip li{display:grid;grid-template-columns:10px 1fr auto;align-items:center;column-gap:8px;row-gap:3px}
.ctip li>i{width:10px;height:10px;border-radius:3px}
.ctip li>span{color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ctip li>b{font:600 14.5px Kanit,sans-serif;font-variant-numeric:tabular-nums;color:var(--ink);white-space:nowrap}
.ctip.big li>b{font-size:17px}
.ctip li.pv>b{font-weight:500;color:var(--muted)}
.ctip li.more{display:block;color:var(--muted);font-size:12px;padding-left:18px}
.ctip .bar{grid-column:2/4;height:4px;border-radius:4px;background:color-mix(in srgb,currentColor 14%,transparent);overflow:hidden}.ctip .bar>s{display:block;height:100%;border-radius:4px;background:currentColor}
.ctip .m{grid-column:2/4;display:flex;justify-content:space-between;gap:8px;font-size:11.5px;color:var(--muted)}
.ctip .up{color:#1f9d55;font-weight:600}.ctip .dn{color:#d64545;font-weight:600}
.ctip .tt{border-top:1px dashed color-mix(in srgb,var(--muted) 40%,transparent);margin-top:9px;padding-top:8px;font-size:12.5px;color:var(--muted)}
.ctip .tt b{color:var(--ink);font:600 14px Kanit,sans-serif}
.ctip footer{margin-top:7px;font-size:10.5px;color:var(--muted);opacity:.8;letter-spacing:.02em}
.sty-one{height:100%;min-height:260px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:2px;padding:20px;border-radius:20px;
  background:radial-gradient(120% 90% at 50% 0%,color-mix(in srgb,var(--pa) 14%,transparent),transparent 70%)}
.sty-one em{font:italic 500 13px/1 var(--f-latin,serif);letter-spacing:.2em;text-transform:uppercase;color:var(--pa);margin-bottom:6px}
.sty-one b{font:600 clamp(54px,7vw,92px)/1 Kanit,sans-serif;color:var(--pa);letter-spacing:-.02em;font-variant-numeric:tabular-nums}
.sty-one span{font:500 18px Kanit,sans-serif;color:var(--ink)}
.sty-one small{margin-top:10px;font-size:13.5px;color:var(--muted);max-width:36ch}
.sty-one i{margin-top:14px;font-size:11.5px;font-style:normal;color:var(--muted);padding:5px 12px;border-radius:99px;border:1px dashed color-mix(in srgb,var(--pa) 30%,transparent)}
.ss-viz .sty-one b{font-size:clamp(80px,10vw,150px)}
.tp{margin:14px 0 0;padding:14px 16px 12px;border-radius:18px;background:linear-gradient(135deg,color-mix(in srgb,var(--pa) 8%,var(--surface,#fff)),var(--surface,#fff));border:1px solid color-mix(in srgb,var(--pa) 18%,transparent)}
.tp header{display:flex;align-items:center;gap:7px;font:600 13px Kanit,sans-serif;color:var(--pa);letter-spacing:.02em;margin-bottom:6px}
.tp-s{margin:0 0 12px;font-size:14px;line-height:1.6;color:var(--ink)}
.tp-s b.up,.tp b.up,.tp em.up{color:#1f9d55}.tp-s b.dn,.tp b.dn,.tp em.dn{color:#d64545}
.tp-g{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:8px}
.tp-c{padding:10px 12px;border-radius:14px;background:var(--surface,#fff);border:1px solid var(--line);display:flex;flex-direction:column;gap:2px;min-width:0}
.tp-c>span{font-size:11.5px;color:var(--muted)}
.tp-c>b{font:600 19px/1.25 Kanit,sans-serif;color:var(--ink);font-variant-numeric:tabular-nums}
.tp-c>small{font-size:11.5px;color:var(--muted);line-height:1.35}
.tp-dir{display:inline-flex!important;align-items:center;gap:6px;font-size:16px!important}
.tp-dir i{font-style:normal;display:grid;place-items:center;width:26px;height:26px;border-radius:50%;font-size:15px;color:#fff;background:#8C6F7D;flex:none}
.tp-dir.up i{background:#1f9d55}.tp-dir.dn i{background:#d64545}.tp-dir.up{color:#1f9d55!important}.tp-dir.dn{color:#d64545!important}
.tp-ds{display:flex!important;flex-direction:column;font-size:14px!important;gap:1px}.tp-ds em{font-style:normal}.tp-ds em b{font-size:13px}
.tp-w{margin:10px 0 0;font-size:12px;color:#B7791F}
@media (max-width:640px){.tp-g{grid-template-columns:1fr 1fr}.tp-c>b{font-size:16px}}
@media print{.stb-vm{display:none}.ctip{display:none}.tp{break-inside:avoid}}`;
if(!document.getElementById('p15-css')){const s=document.createElement('style');s.id='p15-css';s.textContent=css0;document.head.appendChild(s)}
})();
