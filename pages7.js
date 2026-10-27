/* =====================================================================
   12 Plus+ · pages7.js — DATA STORY รายสินค้า (ข้อมูลจำลองตามโครงตาราง tidy)
   ทุกรายการในแบบสำรวจ → 1 visual + 1 ตาราง (สลับซ้าย/ขวา) จัดเป็น 3 บท: ต้นน้ำ · กลางน้ำ · ปลายน้ำ
   ค่าทั้งหมดเป็น "ข้อมูลจำลอง" สร้างจากโครงตารางจริง:
     ปี | จังหวัด | อำเภอ | รายการ | ประเภท | ค่าของข้อมูล | หน่วย | แหล่งที่มา
   เมื่อมีข้อมูลจริง (นำเข้าไฟล์ / resource_id / DATASETS) ภาพจะวาดจากแถวจริงทันทีด้วยโครงเดียวกัน
   ===================================================================== */
Object.assign(IC,{
  expand:'<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  image:'<rect x="3" y="4" width="18" height="16" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="9" cy="10" r="2" fill="currentColor"/><path d="m4 18 5-5 4 4 3-3 4 4" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
  up:'<path d="M12 16V4m0 0-5 5m5-5 5 5M4 20h16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  sheet:'<rect x="4" y="3" width="16" height="18" rx="2.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M4 9h16M4 15h16M10 3v18" stroke="currentColor" stroke-width="2"/>',
  file:'<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M14 3v5h5" fill="none" stroke="currentColor" stroke-width="2"/>'
});

const STY={view:{},gview:'viz',real:{},drawn:new Set(),io:null,list:[],p:null,flip:{},show:null};
const STY_YEARS=[2566,2567,2568,2569];
const STY_SRC='ข้อมูลจำลอง (รอค่าจริงจากหน่วยงาน)';
const CH_META=[
  {k:'SOURCE',th:'ต้นน้ำ',sub:'แหล่งผลิต · ผู้ผลิต · ปัจจัยการผลิต',en:'Upstream — where it begins'},
  {k:'MAKE',th:'กลางน้ำ',sub:'แปรรูป · มาตรฐาน · ยกระดับมูลค่า',en:'Midstream — how value is added'},
  {k:'MARKET',th:'ปลายน้ำ',sub:'ตลาด · ราคา · มูลค่า · แบรนด์',en:'Downstream — where it sells'}];
const CAT_U=/^(ช่องทาง|ชนิด|ประเภท|สายพันธุ์|รูปแบบ|แหล่ง)$/;
const SMALL_U=/^(กลุ่ม|แห่ง|หน่วยงาน|หน่วย|แบรนด์|กิจกรรม|โครงการ|ฟาร์ม|ร้าน|ครั้ง|ลาย|ผลิตภัณฑ์|มาตรการ|ระบบ|สินค้า|รอบ|ช่วง)$/;
const MONTHS_TH=['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'];

/* ---------- สี: ผสมสีประจำสินค้ากับชมพูลุ่มภู ---------- */
const hx2=h=>{h=h.replace('#','');if(h.length===3)h=h.split('').map(c=>c+c).join('');return[0,2,4].map(i=>parseInt(h.substr(i,2),16))};
const rgbHex=a=>'#'+a.map(v=>Math.round(v).toString(16).padStart(2,'0')).join('');
const lerpHex=(a,b,t)=>{const A=hx2(a),B=hx2(b);return rgbHex(A.map((v,i)=>v+(B[i]-v)*t))};
const rgba=(h,a)=>{const c=hx2(h);return`rgba(${c[0]},${c[1]},${c[2]},${a})`};
const PA=p=>isDark()?lerpHex(p.pa,'#FFE3F1',.34):p.pa;
function styRamp(p,n){return Array.from({length:n},(_,i)=>lerpHex(PA(p),'#F4A9CB',n<2?0:i/(n-1)))}
function styPal(p,n){const base=[PA(p),'#E8559A','#B79CC9',lerpHex(PA(p),'#FFFFFF',.45),'#F49AC1','#7D5BA6','#C9A227','#5B8DB8'];if(n<=1)return[PA(p)];return Array.from({length:n},(_,i)=>base[i%base.length])}

/* ---------- เลือกรูปแบบภาพตามความหมายของรายการ ---------- */
function styCats(d,p){const n=d.n;
  if(/แยกสายพันธุ์/.test(n))return p.id===9?['กล้วยน้ำว้า','กล้วยหอมทอง','กล้วยไข่','อื่น ๆ']:['สายพันธุ์ ก','สายพันธุ์ ข','สายพันธุ์ ค'];
  if(/ช่องทาง/.test(n))return['ตลาดชุมชน/หน้าร้าน','ออนไลน์','ห้าง/ร้านค้าปลีก','งานแสดงสินค้า','ส่งนอกจังหวัด'];
  if(/ตลาดเป้าหมาย|ตลาด\/แหล่ง/.test(n))return['ในจังหวัด','ภาคอีสาน','กรุงเทพฯ และปริมณฑล','ต่างประเทศ'];
  if(/ชนิดเห็ด/.test(n))return['เห็ดนางฟ้า','เห็ดขอนขาว','เห็ดนางรม','เห็ดฟาง','อื่น ๆ'];
  if(/ชนิดพันธุ์ปลา/.test(n))return['ปลานิล','ปลาตะเพียน','ปลาดุก','ปลายี่สก','อื่น ๆ'];
  if(/รูปแบบการผลิต/.test(n))return['โรงเรือน','กลางแจ้ง','ตะกร้า'];
  if(/ก้อนเชื้อ \(ผลิตเอง/.test(n))return['ผลิตเอง','ซื้อจากภายนอก'];
  if(/แหล่งวัตถุดิบ|แหล่งอาหาร|วัสดุผลิต/.test(n))return['ในชุมชน','ในจังหวัด','นอกจังหวัด'];
  if(/ผลพลอยได้/.test(n))return['กากอ้อย','กากน้ำตาล'];
  if(/แรงงานตัดอ้อย/.test(n))return['แรงงานคน','รถตัดอ้อย'];
  if(/สายพันธุ์|พันธุ์/.test(n))return['สายพันธุ์ ก','สายพันธุ์ ข','สายพันธุ์ ค','อื่น ๆ'];
  return['แปรรูปขั้นต้น','พร้อมรับประทาน/ใช้งาน','ของฝาก/ของที่ระลึก','อื่น ๆ']}
function styCostParts(d,p){if(/ขนส่ง/.test(d.n))return['ค่าขนส่ง'];
  if(d.s===1||/แปรรูป/.test(d.n))return['วัตถุดิบ','แรงงาน','บรรจุภัณฑ์','พลังงาน/อื่น ๆ'];
  if(p.g==='live')return['ลูกสัตว์/พันธุ์','อาหารสัตว์','ยา/วัคซีน','แรงงาน'];
  return['พันธุ์/ก้อนเชื้อ','ปุ๋ย/สารบำรุง','แรงงาน','อื่น ๆ']}
function styForm(d,p,ds){const n=d.n,u=d.u;
  if(ds)return ds.district?'stack':'growth';
  if(/ปฏิทิน/.test(n))return'cal';
  if(/สถานะ|ขึ้นทะเบียน|ระบบราคา/.test(n)||d.vt==='text')return'status';
  if(/แยกสายพันธุ์|ผลพลอยได้|แรงงานตัดอ้อย/.test(n))return'share';
  if(/จำแนกอำเภอ/.test(n))return'rank';
  if(/ราคา/.test(n))return'band';
  if(/มูลค่า/.test(n))return'flow';
  if(/ต้นทุน/.test(n))return'cost';
  if(CAT_U.test(u)||/ช่องทาง|ตลาดเป้าหมาย|ตลาด\/แหล่ง|แหล่งวัตถุดิบ|วัสดุผลิต|รูปแบบการผลิต/.test(n))return'share';
  if(/เฉลี่ย/.test(n))return'growth';
  if(SMALL_U.test(u))return/^(กลุ่ม|ฟาร์ม|แห่ง|ร้าน)$/.test(u)?'tallyd':'tally';
  if(/อบรม/.test(n))return'growth';
  return'stack'}
const FORM_EN={rank:'District ranking',stack:'Trend by district',flow:'Value trend',band:'Price range',cost:'Cost structure',share:'Share mix',tally:'Count over time',tallyd:'Spread by district',growth:'Year-on-year',cal:'Seasonal calendar',status:'Milestone tracker'};
const FORM_TH={rank:'จัดอันดับรายอำเภอ',stack:'แนวโน้มแยกอำเภอ',flow:'แนวโน้มมูลค่า',band:'ช่วงราคา ต่ำ–เฉลี่ย–สูง',cost:'โครงสร้างต้นทุน',share:'สัดส่วน',tally:'จำนวนรายปี',tallyd:'การกระจายรายอำเภอ',growth:'เปรียบเทียบรายปี',cal:'ปฏิทินฤดูกาล',status:'ความคืบหน้า'};

/* ---------- สร้างแถวจำลอง (tidy) ---------- */
function styHash(s){let h=7;for(const c of s)h=(h*31+c.charCodeAt(0))>>>0;return h}
function styBase(d,p,form){const r=rng(styHash(d.code));let v=typeof d.val==='number'&&d.val>0?d.val:null;
  if(form==='band')return v&&v<5e6?v:p.price;
  if(form==='flow')return v&&v>=1e5?v:p.v*.3;
  if(form==='cost')return v&&v<2e5?v:2500+r()*4000;
  if(SMALL_U.test(d.u)||CAT_U.test(d.u)){if(!v||v>200)v=4+Math.floor(r()*30);return v}
  if(form==='growth'&&/เฉลี่ย/.test(d.n))return v&&v<5000?v:350+r()*500;
  return v||Math.round(200+r()*2000)}
function stySim(d,p,form,ds){const r=rng(styHash(d.code)+11);const T=styBase(d,p,form);const g=p.gr||[.04,.05,.05];
  const small=T<60;const yf=small?{2566:.72+r()*.08,2567:.84+r()*.06,2568:1,2569:1.08+r()*.1}:{2568:1,2567:1/(1+g[1]),2566:1/(1+g[1])/(1+g[0]),2569:1+g[2]};const W=p.dist,WS=sum(W);
  const rows=[],R=(y,dist,type,v)=>rows.push({year:y,dist,type,value:v});
  const int=SMALL_U.test(d.u)||CAT_U.test(d.u)||/ราย|คน|ตัว|แห่ง/.test(d.u);
  const rd=v=>int?Math.max(0,Math.round(v)):v>=100?Math.round(v):Math.round(v*10)/10;
  const noise=()=>0.93+r()*.14;
  if(form==='cal'){const pk=p.season||[5,5,5,5,5,5,5,5,5,5,8,8];const mx=Math.max(...pk);
    MONTHS_TH.forEach((m,i)=>R(2569,'รวมทั้งจังหวัด',m,Math.round(pk[i]/mx*3)));return rows}
  if(form==='status'){const steps=/GI/.test(d.n)?['ยื่นคำขอ','ตรวจสอบคำขอ','ประกาศโฆษณา','ขึ้นทะเบียน','ใช้ตราสัญลักษณ์']:/ระบบราคา/.test(d.n)?['ราคาขั้นต้น','ราคาขั้นสุดท้าย','แบ่งปันผลประโยชน์ 70:30','จ่ายเงินส่วนเพิ่ม']:['คัดเลือกสินค้า','ยื่นเอกสาร','ตรวจประเมิน','ขึ้นทะเบียน','ต่ออายุ/ยกระดับ'];
    const done=2+Math.floor(r()*(steps.length-2));steps.forEach((s,i)=>R(2569,'รวมทั้งจังหวัด',s,i<done?1:0));return rows}
  const types=ds&&ds.types&&ds.types.length?ds.types:form==='share'?styCats(d,p):form==='cost'?styCostParts(d,p):form==='band'?['ราคาต่ำสุด','ราคาเฉลี่ย','ราคาสูงสุด']:['รวม'];
  const pct=form==='share'&&(CAT_U.test(d.u)||!/ไร่|ราย|คน|กก|ตัน|ตัว/.test(d.u));
  const tw=types.map((_,i)=>form==='share'||form==='cost'?(types.length-i)*(0.7+r()*.6):1);const tws=sum(tw);
  const dist=form==='rank'||form==='stack'||form==='tallyd'||(ds&&ds.district);
  STY_YEARS.forEach(y=>{
    types.forEach((t,ti)=>{
      let tot=T*yf[y]*noise();
      if(form==='band')tot=T*yf[y]*[.82,1,1.2][ti]*(0.97+r()*.06);
      else if(pct)tot=tw[ti]/tws*100*(0.9+r()*.2);
      else if(form==='share'||form==='cost')tot=tot*tw[ti]/tws;
      if(dist)DISTRICTS.forEach((ds_,di)=>R(y,ds_,t,rd(tot*W[di]/WS*(0.85+r()*.3))));
      else R(y,'รวมทั้งจังหวัด',t,pct?Math.round(tot*10)/10:rd(tot));
    })});
  if(pct){STY_YEARS.forEach(y=>{const L0=rows.filter(x=>x.year===y),s=sum(L0.map(x=>x.value));L0.forEach(x=>x.value=Math.round(x.value/s*1000)/10)})}
  rows.unit=pct?'%':d.u;return rows}

/* ---------- ทะเบียนบล็อก ---------- */
/* จุดสถานะข้อมูล: เขียว = ข้อมูลจริงจากหน่วยงาน · เหลือง = ค่าจำลอง · ชี้/แตะเพื่อดูชื่อไฟล์ */
function sDot(b){const asof=b.ds&&b.ds.asof;const tip=b.real?L('ข้อมูลจริง','Real data')+(b.srcName?' · '+b.srcName:'')+(asof?L(' · ณ ',' · as of ')+asof:''):L('ข้อมูลจำลอง (รอข้อมูลจากหน่วยงาน)','Simulated (awaiting agency data)');
  return`<span class="sdot ${b.real?'real':'sim'}" tabindex="0" role="img" aria-label="${esc(tip)}" data-tip="${esc(tip)}"></span>`}
function styItems(p){const ds=c=>DATASETS.find(x=>x.code===c);
  return p.inds.map(d=>{const D=ds(d.code);const form=styForm(d,p,D);const item=D?D.item:d.n.replace(/\s*\(จำแนกอำเภอ\)/,'');
    const real=STY.real[d.code]||(D&&typeof dsData==='function'?(()=>{const x=dsData(D,p);return x&&x.src!=='demo'?Object.assign(x.rows.slice(),{unit:D.unit,src:x.src,name:x.name}):null})():null);
    const rows=real||stySim(d,p,form,D);
    return{d,p,ds:D,form,item,en:ITEM_EN[d.n]||FORM_EN[form],rows,unit:rows.unit||(D?D.unit:d.u),real:!!real,srcName:real?real.name||'':'',agency:D?D.source:d.ag}})}
function styAgg(rows){const ys=[...new Set(rows.map(r=>r.year))].sort((a,b)=>a-b);
  const ds=[...new Set(rows.map(r=>r.dist))].filter(x=>x&&x!=='รวมทั้งจังหวัด');const ts=[...new Set(rows.map(r=>r.type||'รวม'))];
  const v=f=>rows.filter(f).reduce((a,r)=>a+(r.value||0),0);return{ys,ds,ts,v,ly:ys.at(-1),py:ys.at(-2)}}
const dShort=d=>L(d.replace('เมืองหนองบัวลำภู','เมืองฯ'),DISTRICTS_EN[DISTRICTS.indexOf(d)]||d);
const CAT_EN={'รวม':'Total','สายพันธุ์ ก':'Variety A','สายพันธุ์ ข':'Variety B','สายพันธุ์ ค':'Variety C','อื่น ๆ':'Others','กล้วยน้ำว้า':'Namwa banana','กล้วยหอมทอง':'Hom Thong banana','กล้วยไข่':'Khai banana','ตลาดชุมชน/หน้าร้าน':'Local market / shop','ออนไลน์':'Online','ห้าง/ร้านค้าปลีก':'Retail chains','งานแสดงสินค้า':'Trade fairs','ส่งนอกจังหวัด':'Out-of-province','ในจังหวัด':'In province','ภาคอีสาน':'Northeast','กรุงเทพฯ และปริมณฑล':'Bangkok metro','ต่างประเทศ':'Overseas','เห็ดนางฟ้า':'Grey oyster','เห็ดขอนขาว':'Lentinus','เห็ดนางรม':'Oyster','เห็ดฟาง':'Straw','ปลานิล':'Tilapia','ปลาตะเพียน':'Silver barb','ปลาดุก':'Catfish','ปลายี่สก':'Seven-striped barb','โรงเรือน':'Greenhouse','กลางแจ้ง':'Open field','ตะกร้า':'Basket','ผลิตเอง':'Self-made','ซื้อจากภายนอก':'Purchased','ในชุมชน':'Community','นอกจังหวัด':'Out of province','กากอ้อย':'Bagasse','กากน้ำตาล':'Molasses','แรงงานคน':'Manual labour','รถตัดอ้อย':'Harvesters','แปรรูปขั้นต้น':'Primary processed','พร้อมรับประทาน/ใช้งาน':'Ready to use','ของฝาก/ของที่ระลึก':'Gifts / souvenirs','ค่าขนส่ง':'Haulage','วัตถุดิบ':'Raw materials','แรงงาน':'Labour','บรรจุภัณฑ์':'Packaging','พลังงาน/อื่น ๆ':'Energy / other','ลูกสัตว์/พันธุ์':'Young stock','อาหารสัตว์':'Feed','ยา/วัคซีน':'Medicine / vaccines','พันธุ์/ก้อนเชื้อ':'Seed / spawn','ปุ๋ย/สารบำรุง':'Fertiliser','ราคาต่ำสุด':'Low','ราคาเฉลี่ย':'Average','ราคาสูงสุด':'High'};
const tLab=t=>L(t,CAT_EN[t]||t);
const fv=(v,u)=>u==='%'?(Math.round(v*10)/10).toLocaleString('th-TH')+'%':Math.abs(v)>=1e6?fShort(v):Math.abs(v)<10&&v%1?v.toLocaleString('th-TH',{maximumFractionDigits:1}):nf.format(Math.round(v));
const UNIT_EN={'บาท':'THB','ไร่':'rai','ราย':'persons','คน':'people','กก.':'kg','ตัน':'t','ตัว':'head','กลุ่ม':'groups','แห่ง':'sites','หน่วยงาน':'agencies','หน่วย':'units','แบรนด์':'brands','ช่องทาง':'channels','กิจกรรม':'activities','โครงการ':'projects','ฟาร์ม':'farms','ร้าน':'shops','ครั้ง':'times','ชนิด':'kinds','ประเภท':'types','สายพันธุ์':'varieties','ผลิตภัณฑ์':'products','มาตรการ':'measures','ผืน':'pieces','ชิ้น':'pieces','ชิ้น/ปี':'pieces/yr','หัว':'rhizomes','ต้น':'plants','ลาย':'patterns','รูปแบบ':'systems','แหล่ง':'sources','สินค้า':'products','ระบบ':'systems','รอบ':'cycles','ช่วง':'periods'};
const uLab=u=>L(u,UNIT_EN[u]||u);

/* ---------- ประโยคสรุปอัตโนมัติ ---------- */
function styInsight(b){const A=styAgg(b.rows),u=b.unit;const tot=y=>A.v(r=>r.year===y);
  const yoy=()=>{if(!A.py)return'';const a=tot(A.py),c=tot(A.ly);if(!a)return'';const g=(c-a)/a*100;return L(`ปี ${yCE(A.ly)} ${g>=0?'เพิ่มขึ้น':'ลดลง'} <b>${Math.abs(g).toFixed(1)}%</b> จากปีก่อน`,`${yCE(A.ly)}: <b>${g>=0?'+':'−'}${Math.abs(g).toFixed(1)}%</b> vs prior year`)};
  const cagr=()=>{if(A.ys.length<3)return'';const a=tot(A.ys[0]),c=tot(A.ly);if(!a||!c)return'';const g=(Math.pow(c/a,1/(A.ys.length-1))-1)*100;return L(` · เฉลี่ย ${g>=0?'+':''}${g.toFixed(1)}% ต่อปี`,` · CAGR ${g>=0?'+':''}${g.toFixed(1)}%`)};
  switch(b.form){
    case'rank':case'tallyd':case'stack':{if(!A.ds.length)return yoy()+cagr();const L0=A.ds.map(d=>[d,A.v(r=>r.year===A.ly&&r.dist===d)]).sort((x,y)=>y[1]-x[1]);const t=sum(L0.map(x=>x[1]))||1;
      return L(`อ.${dShort(L0[0][0])} มากที่สุด <b>${Math.round(L0[0][1]/t*100)}%</b> ของทั้งจังหวัด`,`<b>${dShort(L0[0][0])}</b> leads with <b>${Math.round(L0[0][1]/t*100)}%</b> of the province`)+(b.form==='stack'?' · '+yoy():'')}
    case'band':{const av=A.v(r=>r.year===A.ly&&/เฉลี่ย|avg/i.test(r.type))||tot(A.ly)/Math.max(1,A.ts.length);const mn=A.v(r=>r.year===A.ly&&/ต่ำ|min/i.test(r.type)),mx=A.v(r=>r.year===A.ly&&/สูง|max/i.test(r.type));
      return L(`ราคาเฉลี่ยปี ${yCE(A.ly)} <b>${fv(av)}</b> ${uLab(u)}`,`Avg ${yCE(A.ly)} <b>${fv(av)}</b> ${uLab(u)}`)+(mn&&mx?L(` · ช่วง ${fv(mn)}–${fv(mx)}`,` · range ${fv(mn)}–${fv(mx)}`):'')}
    case'share':case'cost':{const L0=A.ts.map(t=>[t,A.v(r=>r.year===A.ly&&r.type===t)]).sort((x,y)=>y[1]-x[1]);const t=sum(L0.map(x=>x[1]))||1;
      return b.form==='cost'?L(`ต้นทุนหลักคือ <b>${esc(L0[0][0])}</b> ${Math.round(L0[0][1]/t*100)}% · รวม <b>${fv(t)}</b> ${uLab(u)}`,`Largest cost: <b>${esc(tLab(L0[0][0]))}</b> ${Math.round(L0[0][1]/t*100)}% · total <b>${fv(t)}</b> ${uLab(u)}`)
        :L(`<b>${esc(L0[0][0])}</b> ครองสัดส่วน <b>${Math.round(L0[0][1]/t*100)}%</b> จาก ${A.ts.length} กลุ่ม`,`<b>${esc(tLab(L0[0][0]))}</b> holds <b>${Math.round(L0[0][1]/t*100)}%</b> of ${A.ts.length} groups`)}
    case'cal':{const pk=A.ts.filter(t=>A.v(r=>r.type===t)>=3);return L(`ช่วงพีค: <b>${pk.join(' ')||'–'}</b>`,`Peak: <b>${pk.map(m=>MONTHS_EN[MONTHS_TH.indexOf(m)]||m).join(' ')||'–'}</b>`)}
    case'status':{const dn=A.ts.filter(t=>A.v(r=>r.type===t)>0);return L(`ผ่านแล้ว <b>${dn.length}/${A.ts.length}</b> ขั้น · ล่าสุด “${esc(dn.at(-1)||'–')}”`,`<b>${dn.length}/${A.ts.length}</b> milestones reached`)}
    case'flow':return L(`ปี ${yCE(A.ly)} <b>${fShort(tot(A.ly))}</b>`,`${yCE(A.ly)}: <b>${fShort(tot(A.ly))}</b>`)+' · '+yoy()+cagr();
    default:return yoy()+cagr()}}

/* ---------- KPI หลักของบล็อก ---------- */
function styKpi(b){const A=styAgg(b.rows),u=b.unit;
  if(b.form==='cal')return{v:A.ts.filter(t=>A.v(r=>r.type===t)>=2).length,u:L('เดือนที่มีผลผลิต','active months')};
  if(b.form==='status'){const dn=A.ts.filter(t=>A.v(r=>r.type===t)>0).length;return{v:Math.round(dn/A.ts.length*100)+'%',u:L('ความคืบหน้า','progress')}}
  if(b.form==='share'&&u==='%')return{v:A.ts.length,u:esc(uLab(b.d.u))};
  if(b.form==='band'){const av=A.v(r=>r.year===A.ly&&/เฉลี่ย/.test(r.type));return{v:fv(av||A.v(r=>r.year===A.ly)/A.ts.length),u:uLab(u)}}
  const t=A.v(r=>r.year===A.ly);return{v:fv(t,u),u:u==='บาท'&&t>=1e6?'':uLab(u)}}

/* ---------- ตาราง ---------- */
function styTable(b){const A=styAgg(b.rows),u=b.unit;const yh=A.ys.map(y=>`<th class="r">${yCE(y)}</th>`).join('');
  const cell=v=>`<td class="r num">${v==null?'–':fv(v,u)}</td>`;
  if(b.form==='cal')return`<table class="t sty-tb"><thead><tr><th>${L('เดือน','Month')}</th><th>${L('ระดับ','Level')}</th><th>${L('ความหมาย','Meaning')}</th></tr></thead><tbody>${A.ts.map((t,i)=>{const v=A.v(r=>r.type===t);return`<tr><td>${L(t,MONTHS_EN[i]||t)}</td><td class="r num">${v}</td><td>${[L('ไม่มี','None'),L('น้อย','Low'),L('ปานกลาง','Mid'),L('ช่วงพีค','Peak')][v]||''}</td></tr>`}).join('')}</tbody></table>`;
  if(b.form==='status')return`<table class="t sty-tb"><thead><tr><th>#</th><th>${L('ขั้นตอน','Milestone')}</th><th>${L('สถานะ','Status')}</th></tr></thead><tbody>${A.ts.map((t,i)=>{const v=A.v(r=>r.type===t);return`<tr><td class="num">${i+1}</td><td>${esc(t)}</td><td>${v?`<span class="pill real">${L('ผ่านแล้ว','Done')}</span>`:`<span class="pill wait">${L('รอดำเนินการ','Pending')}</span>`}</td></tr>`}).join('')}</tbody></table>`;
  const rowsBy=A.ds.length&&(b.form==='rank'||b.form==='stack'||b.form==='tallyd'||A.ts.length===1)?'dist':'type';
  let keys=rowsBy==='dist'?A.ds:A.ts;if(b.form==='rank'||b.form==='tallyd'||b.form==='share')keys=keys.slice().sort((x,y)=>A.v(r=>r.year===A.ly&&r[rowsBy]===y)-A.v(r=>r.year===A.ly&&r[rowsBy]===x));const f=(k,y)=>r=>r.year===y&&(rowsBy==='dist'?r.dist===k:r.type===k);
  const pal=(b.form==='rank'?styRamp:styPal)(b.p,keys.length);
  const body=keys.map((k,i)=>`<tr><td><i class="dot" style="background:${pal[i]}"></i>${rowsBy==='dist'?dShort(k):esc(tLab(k))}</td>${A.ys.map(y=>cell(A.v(f(k,y)))).join('')}</tr>`).join('');
  const showTot=b.form!=='band'&&!(u==='%')&&keys.length>1;
  const foot=showTot?`<tfoot><tr><td>${L('รวม','Total')}</td>${A.ys.map(y=>cell(A.v(r=>r.year===y))).join('')}</tr></tfoot>`:'';
  const yoyRow=keys.length===1&&A.ys.length>1?`<tr class="yoy"><td>${L('เปลี่ยนแปลง','Change')}</td>${A.ys.map((y,i)=>{if(!i)return'<td class="r">–</td>';const a=A.v(r=>r.year===A.ys[i-1]),c=A.v(r=>r.year===y);const g=a?(c-a)/a*100:0;return`<td class="r num ${g>=0?'up':'dn'}">${g>=0?'▲':'▼'} ${Math.abs(g).toFixed(1)}%</td>`}).join('')}</tr>`:'';
  return`<table class="t sty-tb"><thead><tr><th>${rowsBy==='dist'?L('อำเภอ','District'):L('ประเภท','Type')}</th>${yh}</tr></thead><tbody>${body}${yoyRow}</tbody>${foot}</table>`}

/* ---------- ภาพ HTML (ปฏิทิน / ขั้นตอน) ---------- */
function styHtmlViz(b){const A=styAgg(b.rows);
  if(b.form==='cal')return`<div class="sty-cal">${A.ts.map((t,i)=>{const v=A.v(r=>r.type===t);return`<div class="m l${v}" style="--pa:${b.p.pa}"><b>${L(t,MONTHS_EN[i]||t)}</b><i style="height:${18+v*26}%"></i><span>${['','●','●●','●●●'][v]||''}</span></div>`}).join('')}</div>
    <div class="sty-lg"><span><i class="l1"></i>${L('น้อย','Low')}</span><span><i class="l2"></i>${L('ปานกลาง','Mid')}</span><span><i class="l3"></i>${L('ช่วงพีค','Peak')}</span></div>`;
  if(b.form==='status'){const dn=A.ts.filter(t=>A.v(r=>r.type===t)>0).length;return`<ol class="sty-steps" style="--n:${A.ts.length};--done:${dn}">${A.ts.map((t,i)=>`<li class="${i<dn?'ok':''}${i===dn-1?' now':''}"><i>${i<dn?ic('check'):i+1}</i><span>${esc(t)}</span></li>`).join('')}</ol>`}
  return''}

/* ---------- Chart.js config ---------- */
function styCfg(b,big){const c=styCfg0(b,big);if(c)c.data.datasets.forEach(d=>d._fx=1);return c}
function styCfg0(b,big){const A=styAgg(b.rows),u=b.unit,p=b.p;const fs=big?17:13.5;
  const tip={callbacks:{label:c=>` ${c.dataset.label?c.dataset.label+': ':''}${fv(c.chart.options.indexAxis==='y'?c.parsed.x:(c.parsed.y??c.raw),u)} ${u==='%'?'':uLab(u)}`.replace(/: (\S+)$/,': $1')}};
  const tick={color:css('--muted'),font:{family:'Kanit, Sarabun, sans-serif',size:fs}};
  const base=(x)=>dsOpts(dmerge({animation:{duration:700},plugins:{legend:{display:false,labels:{font:{family:'Kanit, Sarabun, sans-serif',size:fs}}},tooltip:tip},scales:{x:{ticks:tick},y:{ticks:Object.assign({},tick,{callback:v=>u==='%'?v+'%':Math.abs(v)<1e4?nf.format(v):fShort(v)})}}},x));
  const grad=(c0,a0=.45,a1=.02)=>ctx=>{const ch=ctx.chart,ca=ch.chartArea;if(!ca)return rgba(c0,a0);const g=ch.ctx.createLinearGradient(0,ca.top,0,ca.bottom);g.addColorStop(0,rgba(c0,a0));g.addColorStop(1,rgba(c0,a1));return g};
  const ysL=A.ys.map(yCE),tot=y=>A.v(r=>r.year===y);
  switch(b.form){
    case'rank':{const L0=A.ds.map(d=>[d,A.v(r=>r.year===A.ly&&r.dist===d)]).sort((x,y)=>y[1]-x[1]);const pal=styRamp(p,L0.length);
      return{type:'bar',data:{labels:L0.map(x=>dShort(x[0])),datasets:[{label:yCE(A.ly)+'',data:L0.map(x=>x[1]),backgroundColor:pal,borderRadius:8,barThickness:big?34:18}]},
        options:base({indexAxis:'y',scales:{x:{ticks:Object.assign({},tick,{callback:v=>fShort(v)})},y:{grid:{display:false},ticks:Object.assign({},tick,{callback:function(v){return this.getLabelForValue(v)}})}}})}}
    case'stack':{const keys=A.ds.length?A.ds:A.ts;const pal=styPal(p,keys.length);const by=A.ds.length?'dist':'type';
      return{type:'bar',data:{labels:ysL,datasets:keys.map((k,i)=>({label:by==='dist'?dShort(k):tLab(k),data:A.ys.map(y=>A.v(r=>r.year===y&&r[by]===k)),backgroundColor:pal[i],borderRadius:4,stack:'s',maxBarThickness:big?90:52}))},
        options:base({plugins:{legend:{display:keys.length>1,position:'bottom'}},scales:{x:{stacked:true,grid:{display:false}},y:{stacked:true}}})}}
    case'flow':case'growth':case'tally':{const line=b.form==='flow'||(b.form==='growth'&&/เฉลี่ย/.test(b.d.n));const c0=PA(p),c1='#E8559A';
      if(line)return{type:'line',data:{labels:ysL,datasets:[{label:tLab('รวม'),data:A.ys.map(tot),borderColor:c1,backgroundColor:grad(c1,.38),fill:true,tension:.38,borderWidth:big?4:3,pointRadius:big?7:5,pointBackgroundColor:'#fff',pointBorderColor:c0,pointBorderWidth:3}]},options:base({})};
      return{type:'bar',data:{labels:ysL,datasets:[{label:tLab('รวม'),data:A.ys.map(tot),backgroundColor:A.ys.map((_,i)=>i===A.ys.length-1?c1:rgba(c0,.35+.15*i)),borderRadius:{topLeft:10,topRight:10},maxBarThickness:big?100:56}]},options:base({})}}
    case'band':{const pal=['#B79CC9',PA(p),'#E8559A'];
      return{type:'line',data:{labels:ysL,datasets:A.ts.map((t,i)=>({label:tLab(t),data:A.ys.map(y=>A.v(r=>r.year===y&&r.type===t)),borderColor:pal[i%3],backgroundColor:rgba(pal[i%3],.12),fill:i===A.ts.length-1?'-2':false,borderWidth:i===1?(big?5:3.5):2,borderDash:i===1?[]:[5,4],tension:.35,pointRadius:i===1?(big?7:5):0,pointBackgroundColor:'#fff',pointBorderColor:pal[i%3],pointBorderWidth:3}))},
        options:base({plugins:{legend:{display:true,position:'bottom'}}})}}
    case'cost':{const pal=styPal(p,A.ts.length);
      return{type:'bar',data:{labels:ysL,datasets:A.ts.map((t,i)=>({label:tLab(t),data:A.ys.map(y=>A.v(r=>r.year===y&&r.type===t)),backgroundColor:pal[i],stack:'s',borderRadius:3,maxBarThickness:big?90:50}))},
        options:base({plugins:{legend:{display:A.ts.length>1,position:'bottom'}},scales:{x:{stacked:true,grid:{display:false}},y:{stacked:true}}})}}
    case'share':{const pal=styPal(p,A.ts.length);const TS=A.ts.slice().sort((x,y)=>A.v(r=>r.year===A.ly&&r.type===y)-A.v(r=>r.year===A.ly&&r.type===x));const vals=TS.map(t=>A.v(r=>r.year===A.ly&&r.type===t));
      return{type:'doughnut',data:{labels:TS.map(tLab),datasets:[{data:vals,backgroundColor:pal,borderColor:isDark()?'#1D0F19':'#fff',borderWidth:3,hoverOffset:10}]},
        options:{responsive:true,maintainAspectRatio:false,cutout:'64%',plugins:{legend:{position:big?'right':'bottom',labels:{font:{family:'Kanit, Sarabun, sans-serif',size:fs},boxWidth:12,usePointStyle:true,color:css('--muted')}},tooltip:{callbacks:{label:c=>` ${c.label}: ${fv(c.raw,u)}${u==='%'?'':' '+uLab(u)}`}}}},plugins:[styCenter(u==='%'?L('ปี ','')+yCE(A.ly):fv(sum(vals),u),u==='%'?L('สัดส่วน','share'):uLab(u),p)]}}
    case'tallyd':{const DS=A.ds.slice().sort((x,y)=>A.v(r=>r.year===A.ly&&r.dist===y)-A.v(r=>r.year===A.ly&&r.dist===x));const vals=DS.map(d=>A.v(r=>r.year===A.ly&&r.dist===d));const pal=styPal(p,DS.length);
      return{type:'polarArea',data:{labels:DS.map(dShort),datasets:[{data:vals,backgroundColor:pal.map(c=>rgba(c,.72)),borderColor:isDark()?'#1D0F19':'#fff',borderWidth:2}]},
        options:{responsive:true,maintainAspectRatio:false,scales:{r:{ticks:{display:false},grid:{color:css('--line')},pointLabels:{display:true,centerPointLabels:true,font:{family:'Kanit, Sarabun, sans-serif',size:fs},color:css('--muted')}}},plugins:{legend:{display:false},tooltip:{callbacks:{label:c=>` ${c.label}: ${fv(c.raw,u)} ${uLab(u)}`}}}}}}
  }return null}
function styCenter(a,b2,p){return{id:'stc',afterDraw(ch){const m=ch.getDatasetMeta(0);if(!m||!m.data[0])return;const{x,y}=m.data[0];const c=ch.ctx;const r=m.data[0].innerRadius;c.save();c.textAlign='center';c.textBaseline='middle';
  c.fillStyle=PA(p);c.font=`600 ${Math.max(14,r*.42)}px Kanit, sans-serif`;c.fillText(a,x,y-r*.12);c.fillStyle=css('--muted');c.font=`${Math.max(10,r*.2)}px Sarabun, sans-serif`;c.fillText(b2,x,y+r*.28);c.restore()}}}

/* ---------- HTML บล็อก ---------- */
/* ---------- ตัวเลขเด่นประกอบภาพ (แผงข้าง) ---------- */
function styFacts(b){const A=styAgg(b.rows),u=b.unit,U=u==='%'?'':' '+uLab(u);const tot=y=>A.v(r=>r.year===y);const F=[];
  const top=(by,keys)=>keys.map(k=>[k,A.v(r=>r.year===A.ly&&r[by]===k)]).sort((x,y)=>y[1]-x[1]);
  if(b.form==='cal'){const pk=A.ts.filter(t=>A.v(r=>r.type===t)>=3),lo=A.ts.filter(t=>A.v(r=>r.type===t)<=1);
    F.push([L('ช่วงพีค','Peak'),pk.length+L(' เดือน',' mo')],[L('เริ่มพีค','Peak starts'),pk[0]||'–'],[L('ช่วงเบา','Low season'),lo.length+L(' เดือน',' mo')]);return F}
  if(b.form==='status'){const dn=A.ts.filter(t=>A.v(r=>r.type===t)>0);F.push([L('ผ่านแล้ว','Done'),dn.length+' / '+A.ts.length],[L('ขั้นล่าสุด','Latest'),dn.at(-1)||'–'],[L('ขั้นถัดไป','Next'),A.ts[dn.length]||L('ครบทุกขั้น','Complete')]);return F}
  if(b.form==='band'){['ต่ำ','เฉลี่ย','สูง'].forEach((k,i)=>{const t=A.ts.find(x=>x.includes(k));if(t)F.push([[L('ต่ำสุด','Low'),L('เฉลี่ย','Average'),L('สูงสุด','High')][i],fv(A.v(r=>r.year===A.ly&&r.type===t))+U])});return F}
  if(b.form==='share'||b.form==='cost'){const T=top('type',A.ts),S=sum(T.map(x=>x[1]))||1;T.slice(0,3).forEach(([k,v])=>F.push([esc(tLab(k)),Math.round(v/S*100)+'%']));return F}
  if(A.ds.length&&(b.form==='rank'||b.form==='tallyd'||b.form==='stack')){const T=top('dist',A.ds),S=sum(T.map(x=>x[1]))||1;T.slice(0,3).forEach(([k,v],i)=>F.push([['🥇','🥈','🥉'][i]+' '+dShort(k),fv(v,u)+U+` <small>(${Math.round(v/S*100)}%)</small>`]));return F}
  if(A.py){const a=tot(A.py),c=tot(A.ly),g=a?(c-a)/a*100:0;F.push([L('ปีก่อน','Prior year')+' '+yCE(A.py),fv(a,u)+U],[L('เปลี่ยนแปลง','Change'),`<span class="${g>=0?'up':'dn'}">${g>=0?'▲':'▼'} ${Math.abs(g).toFixed(1)}%</span>`])}
  const mx=A.ys.map(y=>[y,tot(y)]).sort((x,y)=>y[1]-x[1])[0];if(mx)F.push([L('สูงสุด','Peak year'),yCE(mx[0])+' · '+fv(mx[1],u)]);return F}

/* ---------- HTML บล็อก: ภาพเป็นหลัก มีปุ่มสลับ ภาพ ⇄ ตาราง ---------- */
function styBlock(b,i){const k=styKpi(b);const html=b.form==='cal'||b.form==='status';const flip=i%2===1;const v=STY.view[b.d.code]||STY.gview||'viz';
  const badge=sDot(b);
  return`<article class="stb${flip?' flip':''}" id="sb-${b.d.code}" data-code="${b.d.code}" data-v="${v}" style="--pa:${b.p.pa}">
  <header class="stb-h">
    <div class="stb-k"><span class="stb-no">${b.d.code}</span><span class="stb-en">${esc(L(b.en,FORM_EN[b.form]))}</span>${badge}</div>
    <h4>${esc(L(b.item,b.en))}</h4>${EN_MODE()?`<small class="stb-th">${esc(b.item)}</small>`:''}
    <p class="stb-in">${styInsight(b)}</p>
    <div class="stb-tools" role="group" aria-label="${L('เครื่องมือ','Tools')}">
      <div class="vt" role="tablist" aria-label="${L('มุมมอง','View')}"><button type="button" role="tab" data-sbv="viz" title="${L('แสดงภาพ','Show visual')}" aria-selected="${v==='viz'}">${ic('chart')}<span>${L('ภาพ','Visual')}</span></button><button type="button" role="tab" data-sbv="table" title="${L('แสดงตาราง','Show table')}" aria-selected="${v==='table'}">${ic('table')}<span>${L('ตาราง','Table')}</span></button></div>
      <button type="button" class="ib" data-sbt="present" title="${L('นำเสนอเต็มจอ','Present full screen')}">${ic('expand')}</button>
      ${html?'':`<button type="button" class="ib" data-sbt="png" title="${L('บันทึกภาพ PNG','Save PNG')}">${ic('image')}</button>`}
      <button type="button" class="ib" data-sbt="csv" title="${L('ดาวน์โหลดตาราง (CSV)','Download table (CSV)')}">${ic('down')}</button>
      <button type="button" class="ib" data-sbt="tpl" title="${L('แม่แบบว่างสำหรับหน่วยงาน','Blank template')}">${ic('file')}</button>
      <label class="ib" title="${L('นำเข้าไฟล์ข้อมูลจริง (CSV/Excel)','Import real data (CSV/Excel)')}">${ic('up')}<input type="file" accept=".csv,.xlsx,.xls" hidden></label>
    </div>
  </header>
  <div class="stb-b">
    <aside class="stb-side"><div class="stb-kpi"><em>${L(FORM_TH[b.form],FORM_EN[b.form])} · ${yCE(styAgg(b.rows).ly||2569)}</em><b>${k.v}</b><span>${k.u}</span></div>
      <dl class="stb-f">${styFacts(b).map(([t,x])=>`<div><dt>${t}</dt><dd>${x}</dd></div>`).join('')}</dl>
      <p class="stb-src">${L('แหล่งที่มา','Source')}: ${esc(b.agency||'')}${b.real?'':`<br><i>${L('ค่าจำลองเพื่อแสดงโครงภาพ','simulated to preview the layout')}</i>`}</p></aside>
    <div class="stb-stage">
      <figure class="stb-viz"><div class="stb-cv${html?' html':''}">${html?styHtmlViz(b):`<canvas id="sbc-${b.d.code}" role="img" aria-label="${esc(b.item)}"></canvas>`}</div></figure>
      <div class="stb-tb"><div class="stb-tbh"><span>${ic('table')} ${L('ตารางข้อมูล','Data table')}</span><small>${L('หน่วย','Unit')}: ${esc(uLab(b.unit))}</small></div><div class="scroll-x">${styTable(b)}</div></div>
    </div>
  </div></article>`}

/* ---------- ส่วนเรื่องเล่าข้อมูลทั้งสินค้า ---------- */
function styHeadline(list){const pick=(re)=>list.find(b=>re.test(b.form));const out=[];
  const f=list.find(b=>b.form==='flow'),a=list.find(b=>/ไร่/.test(b.unit)&&(b.form==='rank'||b.form==='stack')),pp=list.find(b=>/ราย|คน/.test(b.unit)),br=list.find(b=>/แบรนด์/.test(b.d.u)),pr=pick(/band/);
  [a||list[0],pp,pr,f,br].filter(Boolean).slice(0,4).forEach(b=>{const k=styKpi(b);out.push(`<a class="sh-k" href="#sb-${b.d.code}" style="--pa:${b.p.pa}"><small>${esc(b.en)}</small><b>${k.v}<em>${k.u}</em></b><span>${esc(L(b.item,b.en))}</span></a>`)});return out.join('')}
function storySection(p){const list=styItems(p);STY.list=list;STY.p=p;
  const ch=[0,1,2].map(s=>list.filter(b=>b.d.s===s));let gi=0;const nReal=list.filter(b=>b.real).length;
  const dt=new Date().toLocaleDateString('th-TH',{day:'numeric',month:'long',year:'numeric'});
  return`<section class="sty" id="dsx" style="--pa:${p.pa}">
  <div class="print-cover" aria-hidden="true"><img class="pc-img" src="img/cover-a4.webp" alt="" onerror="this.remove()"><div class="pc-t"><span>DATA STORY · ${esc(p.en.toUpperCase())}</span><h1>${L('เส้นทางข้อมูล','The data journey of')}<br><em>${esc(pname(p))}</em></h1><p>${L('สินค้าอัตลักษณ์หนองบัวลำภู 12 Plus+','Nong Bua Lam Phu signature products · 12 Plus+')} · ${list.length} ${L('รายการ','items')}</p><small>${L('พิมพ์เมื่อ','Printed')} ${dt}${list.some(b=>!b.real)?' · '+L('มีข้อมูลจำลองบางส่วน','contains simulated values'):''}</small></div></div>
  <header class="sty-hero" style="--story:url(img/story-${pad2(p.id)}.webp)">
    <div class="sty-hx">
      <span class="sty-kick">DATA STORY · ${esc(p.en.toUpperCase())}</span>
      <h2>${L('เส้นทางข้อมูล','The data journey of')} <em>${esc(pname(p))}</em></h2>
      <p>${L(`ตั้งแต่ต้นน้ำถึงปลายน้ำ ${list.length} รายการตามแบบสำรวจ · ภาพทุกชิ้นวาดจากโครงตารางเดียวกับที่หน่วยงานส่งขึ้นระบบบัญชีข้อมูล`,`From source to market — ${list.length} survey items, each drawn from the same tidy table agencies upload to the data catalog`)}</p>
      <div class="sty-act">
        <button type="button" class="btn btn-p" data-sty="show">${ic('play')} ${L('นำเสนอแบบสไลด์','Present as slides')}</button>
        <button type="button" class="btn btn-o" data-sty="xlsx">${ic('sheet')} ${L('Excel ทั้งชุด','Full workbook')}</button>
        <button type="button" class="btn btn-o" data-sty="tplall">${ic('file')} ${L('แม่แบบทั้งชุด','All templates')}</button>
        <div class="vt big" role="group" aria-label="${L('มุมมองทุกรายการ','View for all items')}"><span class="vt-l">${L('ทุกรายการ','All items')}</span><button type="button" data-styv="viz" aria-selected="true">${ic('chart')}<span>${L('ภาพ','Visual')}</span></button><button type="button" data-styv="table" aria-selected="false">${ic('table')}<span>${L('ตาราง','Table')}</span></button></div>
      </div>
      <p class="sty-note"><span class="pill sim">${L('ข้อมูลจำลอง','Simulated')}</span> ${L(`ค่าตัวเลขทั้งหมดเป็นค่าจำลองเพื่อวางโครงการนำเสนอ${nReal?` · มีข้อมูลจริงแล้ว ${nReal} รายการ`:''} · เมื่อหน่วยงานส่งไฟล์ (หรือกด ${ic('up')} นำเข้า) ภาพจะเปลี่ยนเป็นค่าจริงทันที`,`All figures are simulated placeholders${nReal?` · ${nReal} item(s) already real`:''} · drop in the agency file (${ic('up')}) and the visuals redraw with real values`)}</p>
    </div>
    <div class="sty-hi">${styHeadline(list)}</div>
  </header>
  <nav class="sty-tabs" aria-label="${L('บทของข้อมูล','Chapters')}">${CH_META.map((c,s)=>`<a href="#ch-${s}" data-ch="${s}"><b>0${s+1}</b><span><small>${c.k}</small>${L(c.th,c.en.split(' — ')[0])}</span><em>${ch[s].length}</em></a>`).join('')}
    <details class="sty-idx"><summary>${L('ดัชนี','Index')} ${list.length}</summary><div>${list.map(b=>`<a href="#sb-${b.d.code}"><code>${b.d.code}</code>${esc(L(b.item,b.en))}</a>`).join('')}</div></details></nav>
  ${ch.map((L1,s)=>L1.length?`<div class="sty-ch" id="ch-${s}">
    <div class="ch-h"><span class="ch-no">0${s+1}</span><i class="ch-art" style="background-image:url(img/ch-${s+1}.webp)" aria-hidden="true"></i><div><small>${CH_META[s].k} · ${esc(CH_META[s].en)}</small><h3>${L(CH_META[s].th,CH_META[s].en.split(' — ')[0])} <span>${L(CH_META[s].sub,'')}</span></h3></div><em>${L1.length} ${L('รายการ','items')}</em></div>
    ${L1.map(b=>styBlock(b,gi++)).join('')}</div>`:'').join('')}
  </section>`}

/* ---------- วาดกราฟแบบ lazy ---------- */
function styDraw(code){const b=STY.list.find(x=>x.d.code===code);if(!b||STY.drawn.has(code))return;const cv=document.getElementById('sbc-'+code);if(!cv||!window.Chart)return;
  const cfg=styCfg(b,false);if(!cfg)return;STY.drawn.add(code);charts.push(new Chart(cv,cfg))}
function styKill(code){for(let i=charts.length-1;i>=0;i--){const c=charts[i];if(c.canvas&&c.canvas.id==='sbc-'+code){try{c.destroy()}catch(e){}charts.splice(i,1)}}STY.drawn.delete(code)}
function styRe(code){const b=STY.list.findIndex(x=>x.d.code===code);if(b<0)return;styKill(code);const p=STY.p;const fresh=styItems(p);STY.list=fresh;
  const el=document.getElementById('sb-'+code);if(!el)return;const i=[...document.querySelectorAll('.stb')].indexOf(el);el.outerHTML=styBlock(fresh[b],i);styBind1(document.getElementById('sb-'+code));styDraw(code)}

/* ---------- ดาวน์โหลด ---------- */
const styCsvRows=(b,blank)=>b.rows.map(r=>[r.year,'หนองบัวลำภู',r.dist,b.item,r.type==='รวม'?'':r.type,blank?'':r.value,b.unit,blank?b.agency:(b.real?b.agency:STY_SRC)]);
const styFile=b=>b.d.code+'_'+b.item.replace(/[\\/:*?"<>|()]/g,'').replace(/\s+/g,'');
function styCsv(b,blank){download(styFile(b)+(blank?'_แม่แบบ':'_จำลอง')+'.csv',[csvRow(TIDY_COLS),...styCsvRows(b,blank).map(csvRow)].join('\n'))}
async function styXlsx(blank){try{
  if(!window.XLSX)await new Promise((res,rej)=>{const s=document.createElement('script');s.src='https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';s.onload=res;s.onerror=()=>rej(new Error('xlsx'));document.head.appendChild(s)});
  const p=STY.p,wb=XLSX.utils.book_new();
  const idx=[['รหัส','รายการ','หัวข้อสากล','บท','รูปแบบภาพ','หน่วย','หน่วยงาน','สถานะ'],...STY.list.map(b=>[b.d.code,b.item,b.en,CH_META[b.d.s].th,FORM_TH[b.form],b.unit,b.agency,b.real?'ข้อมูลจริง':blank?'แม่แบบว่าง':'ข้อมูลจำลอง'])];
  const ws0=XLSX.utils.aoa_to_sheet(idx);ws0['!cols']=[{wch:10},{wch:42},{wch:36},{wch:10},{wch:20},{wch:10},{wch:30},{wch:12}];XLSX.utils.book_append_sheet(wb,ws0,'สารบัญ');
  STY.list.forEach(b=>{const ws=XLSX.utils.aoa_to_sheet([TIDY_COLS,...styCsvRows(b,blank)]);ws['!cols']=[{wch:7},{wch:12},{wch:18},{wch:36},{wch:20},{wch:14},{wch:10},{wch:30}];XLSX.utils.book_append_sheet(wb,ws,b.d.code)});
  XLSX.writeFile(wb,`${p.code}_${p.name}_${blank?'แม่แบบ':'ข้อมูลจำลอง'}.xlsx`);toast(L('ดาวน์โหลดแล้ว ','Downloaded ')+STY.list.length+L(' ชีต',' sheets'))}
  catch(e){const all=[csvRow(TIDY_COLS)];STY.list.forEach(b=>styCsvRows(b,blank).forEach(r=>all.push(csvRow(r))));download(`${STY.p.code}_${blank?'แม่แบบ':'ข้อมูลจำลอง'}_ทั้งชุด.csv`,all.join('\n'));toast(L('ดาวน์โหลดเป็น CSV รวม (โหลดตัวสร้าง Excel ไม่ได้)','Saved as one CSV'))}}
function styPng(b){const ch=charts.find(c=>c.canvas&&c.canvas.id==='sbc-'+b.d.code);if(!ch){toast(L('เลื่อนให้เห็นกราฟก่อน','Scroll the chart into view first'));return}
  const W=1600,H=1000,c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d');
  const g=x.createLinearGradient(0,0,W,H);g.addColorStop(0,'#FFFFFF');g.addColorStop(1,'#FCE9EF');x.fillStyle=g;x.fillRect(0,0,W,H);
  x.fillStyle=b.p.pa;x.fillRect(0,0,W,10);x.fillStyle='#E8559A';x.fillRect(W*.6,0,W*.4,10);
  x.fillStyle=b.p.pa;x.font='600 26px Kanit';x.fillText(b.d.code+' · '+b.en.toUpperCase(),60,78);
  x.fillStyle='#3A1F2E';x.font='600 54px Kanit';x.fillText(b.item,60,148);
  x.fillStyle='#7A5A6A';x.font='26px Sarabun';x.fillText(styInsight(b).replace(/<[^>]+>/g,''),60,196);
  const img=new Image();img.onload=()=>{const r=Math.min((W-120)/img.width,(H-300)/img.height);x.drawImage(img,60,240,img.width*r,img.height*r);
    x.fillStyle='#9A7A8A';x.font='22px Sarabun';x.fillText(`${pname(b.p)} · ${b.real?L('ข้อมูลจริง','Real data'):L('ข้อมูลจำลอง','Simulated data')} · 12 Plus+ หนองบัวลำภู`,60,H-36);
    const a=document.createElement('a');a.href=c.toDataURL('image/png');a.download=styFile(b)+'.png';a.click()};img.src=ch.toBase64Image('image/png',1)}

/* ---------- โหมดนำเสนอ (สไลด์เต็มจอ) ---------- */
function styShow(start){const p=STY.p;let i=Math.max(0,start||0),timer=null,showT=true;
  const ov=document.createElement('div');ov.className='sty-show';ov.style.setProperty('--pa',p.pa);ov.setAttribute('role','dialog');ov.setAttribute('aria-modal','true');document.body.appendChild(ov);document.body.classList.add('sty-on');
  let chart=null;
  const draw=()=>{const b=STY.list[i];if(chart){try{chart.destroy()}catch(e){}chart=null}const k=styKpi(b),html=b.form==='cal'||b.form==='status';
    const s=b.d.s,inCh=STY.list.filter(x=>x.d.s===s),pos=inCh.indexOf(b)+1;
    ov.innerHTML=`<div class="ss-top"><span class="ss-p">${badge(p,{label:false})}<b>${esc(pname(p))}</b></span><span class="ss-ch">0${s+1} · ${CH_META[s].k} · ${L(CH_META[s].th,'')} <em>${pos}/${inCh.length}</em></span>
      <span class="ss-c">${i+1} / ${STY.list.length}</span>
      <button type="button" class="ib" data-ss="tb" aria-pressed="${showT}" title="${L('ตาราง (T)','Table (T)')}">${ic('table')}</button>
      <button type="button" class="ib" data-ss="auto" aria-pressed="${!!timer}" title="${L('เล่นอัตโนมัติ (A)','Autoplay (A)')}">${ic(timer?'pause':'play')}</button>
      <button type="button" class="ib" data-ss="x" title="${L('ปิด (Esc)','Close (Esc)')}">${ic('x')}</button></div>
    <div class="ss-bar"><i style="width:${(i+1)/STY.list.length*100}%"></i></div>
    <div class="ss-main${showT?'':' notb'}">
      <div class="ss-h"><span class="ss-k">${b.d.code} · ${esc(b.en.toUpperCase())} ${sDot(b)}</span>
        <h2>${esc(L(b.item,b.en))}</h2><p>${styInsight(b)}</p></div>
      <div class="ss-kpi"><b>${k.v}</b><span>${k.u}</span></div>
      <div class="ss-viz">${html?styHtmlViz(b):'<canvas id="ss-cv"></canvas>'}</div>
      <div class="ss-tb scroll-x">${styTable(b)}</div>
    </div>
    <div class="ss-nav"><button type="button" class="ib" data-ss="prev" aria-label="${L('ก่อนหน้า','Previous')}">${ic('arrowL')}</button>
      <div class="ss-dots">${[0,1,2].map(c=>`<span class="ss-g">${STY.list.map((x,j)=>x.d.s===c?`<i class="${j===i?'on':''}${j<i?' past':''}" data-go="${j}" title="${esc(x.item)}"></i>`:'').join('')}</span>`).join('')}</div>
      <button type="button" class="ib" data-ss="next" aria-label="${L('ถัดไป','Next')}">${ic('arrowR')}</button></div>`;
    if(!html&&window.Chart){const cfg=styCfg(b,true);if(cfg)chart=new Chart(ov.querySelector('#ss-cv'),cfg)}
    if(typeof FX!=='undefined'&&FX.glueNode)FX.glueNode(ov)};
  const go=n=>{i=(n+STY.list.length)%STY.list.length;draw()};
  const close=()=>{clearInterval(timer);if(chart)chart.destroy();ov.remove();document.body.classList.remove('sty-on');document.removeEventListener('keydown',key);if(document.fullscreenElement)document.exitFullscreen().catch(()=>{});
    document.getElementById('sb-'+STY.list[i].d.code)?.scrollIntoView({block:'center'})};
  const auto=()=>{if(timer){clearInterval(timer);timer=null}else timer=setInterval(()=>go(i+1),8000);draw()};
  const key=e=>{if(e.key==='Escape')close();else if(e.key==='ArrowRight'||e.key===' '||e.key==='PageDown'){e.preventDefault();go(i+1)}else if(e.key==='ArrowLeft'||e.key==='PageUp')go(i-1);else if(/^t$/i.test(e.key)){showT=!showT;draw()}else if(/^a$/i.test(e.key))auto();else if(e.key==='Home')go(0);else if(e.key==='End')go(STY.list.length-1)};
  ov.addEventListener('click',e=>{const t=e.target.closest('[data-ss],[data-go]');if(!t)return;if(t.dataset.go!=null)return go(+t.dataset.go);
    ({prev:()=>go(i-1),next:()=>go(i+1),x:close,auto,tb:()=>{showT=!showT;draw()}})[t.dataset.ss]?.()});
  let sx=null;ov.addEventListener('touchstart',e=>{sx=e.touches[0].clientX},{passive:true});ov.addEventListener('touchend',e=>{if(sx==null)return;const dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>50)go(i+(dx<0?1:-1));sx=null});
  document.addEventListener('keydown',key);ov.requestFullscreen?.().catch(()=>{});draw()}

/* ---------- ผูกเหตุการณ์ ---------- */
function styBind1(el){if(!el)return;const code=el.dataset.code;const b=()=>STY.list.find(x=>x.d.code===code);
  el.querySelectorAll('[data-sbv]').forEach(t=>t.onclick=()=>{STY.view[code]=t.dataset.sbv;el.dataset.v=t.dataset.sbv;el.querySelectorAll('[data-sbv]').forEach(x=>x.setAttribute('aria-selected',x===t));
    if(t.dataset.sbv==='viz'){styDraw(code);setTimeout(()=>charts.forEach(c=>{if(c.canvas&&c.canvas.id==='sbc-'+code)c.resize()}),30)}});
  el.querySelectorAll('[data-sbt]').forEach(t=>t.onclick=()=>{const k=t.dataset.sbt;
    if(k==='present')styShow(STY.list.findIndex(x=>x.d.code===code));else if(k==='png')styPng(b());else if(k==='csv')styCsv(b(),false);else if(k==='tpl')styCsv(b(),true)});
  const inp=el.querySelector('input[type=file]');if(inp)inp.onchange=async ev=>{const f=ev.target.files[0];if(!f)return;
    try{const rows=dsNorm(await dsReadFile(f)).filter(r=>r.value!=null);if(!rows.length)throw new Error(L('ไม่พบค่าในคอลัมน์ "ค่าของข้อมูล"','No values found'));
      rows.forEach(r=>{if(!r.dist)r.dist='รวมทั้งจังหวัด'});const u=rows.find(r=>r.unit)?.unit;STY.real[code]=Object.assign(rows,{unit:u||b().unit,name:f.name});
      toast(L('วาดจากไฟล์จริงแล้ว ','Redrawn from file: ')+rows.length+L(' แถว (เฉพาะเครื่องนี้)',' rows (this device)'));styRe(code)}
    catch(e){toast(L('อ่านไฟล์ไม่ได้: ','Cannot read file: ')+(e.message||e))}};
  if(typeof FX!=='undefined'&&FX.glueNode)FX.glueNode(el);
  if(STY.io)STY.io.observe(el)}
function styBind(p,root){const sec=$('#dsx',root);if(!sec)return;
  if(STY.io)STY.io.disconnect();STY.drawn.clear();
  STY.io='IntersectionObserver'in window?new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){styDraw(e.target.dataset.code);STY.io.unobserve(e.target)}}),{rootMargin:'300px 0px'}):null;
  $$('.stb',sec).forEach(el=>{styBind1(el);if(!STY.io)styDraw(el.dataset.code)});
  $$('[data-sty]',sec).forEach(t=>t.onclick=()=>({show:()=>styShow(0),xlsx:()=>styXlsx(false),tplall:()=>styXlsx(true)})[t.dataset.sty]());
  $$('[data-styv]',sec).forEach(t=>t.onclick=()=>{const v=t.dataset.styv;STY.gview=v;STY.view={};$$('[data-styv]',sec).forEach(x=>x.setAttribute('aria-selected',x===t));
    $$('.stb',sec).forEach(el=>{el.dataset.v=v;el.querySelectorAll('[data-sbv]').forEach(x=>x.setAttribute('aria-selected',x.dataset.sbv===v))});
    if(v==='viz')setTimeout(()=>charts.forEach(c=>{if(c.canvas&&/^sbc-/.test(c.canvas.id))c.resize()}),40);toast(v==='viz'?L('แสดงภาพทุกรายการ','Showing visuals'):L('แสดงตารางทุกรายการ','Showing tables'))});
  $$('.sty-tabs a[href^="#"], .sty-idx a, .sh-k',sec).forEach(a=>a.onclick=e=>{e.preventDefault();const t=document.querySelector(a.getAttribute('href'));t?.scrollIntoView({behavior:'smooth',block:'start'});a.closest('details')?.removeAttribute('open')});
  /* ไฮไลต์แท็บบทที่กำลังอ่าน */
  if('IntersectionObserver'in window){const tabs=$$('.sty-tabs [data-ch]',sec);const io2=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){const s=e.target.id.slice(3);tabs.forEach(t=>t.classList.toggle('on',t.dataset.ch===s))}}),{rootMargin:'-40% 0px -55% 0px'});$$('.sty-ch',sec).forEach(c=>io2.observe(c))}
  /* ข้อมูลจริงจาก API (resource_id ที่ตั้งไว้ใน DATASETS) */
  STY.list.filter(b=>b.ds&&!b.real&&typeof dsRid==='function'&&dsRid(b.ds)).forEach(b=>dsFetch(b.ds).then(ok=>{if(ok)styRe(b.d.code)}));
  if(typeof FX!=='undefined'&&FX.glueNode&&$('.sty-hero',sec))FX.glueNode($('.sty-hero',sec))}

/* ---------- เสียบเข้าหน้าสินค้า: แทนส่วน "ข้อมูลจากระบบ" ด้วย Data Story ---------- */
const _prodR7=PAGE_R.product;
PAGE_R.product=(page,p)=>{_prodR7(page,p);const old=$('#dsx',page);
  if(old){$$('.dsx',old).forEach(e=>{const c=e.id.replace('dsx-','');const ds=DATASETS.find(x=>x.code===c);if(ds)killDs(ds)});old.outerHTML=storySection(p)}
  else ($('.hx',page)||page.firstElementChild)?.insertAdjacentHTML('afterend',storySection(p));
  const pc=$('.print-cover',page);if(pc)page.prepend(pc);
  $$('.ch-art',page).forEach(e=>{const u=(e.style.backgroundImage.match(/url\(["']?([^"')]+)/)||[])[1];if(!u)return e.remove();const im=new Image();im.onerror=()=>e.remove();im.src=u});
  styBind(p,page)};

/* =====================================================================
   พิมพ์ / บันทึก PDF — ภาพครบทุกชิ้น
   1) แสดงการ์ดที่ยังไม่ถูก reveal  2) โหลดรูป lazy ให้ครบ  3) วาดกราฟที่ยังไม่ถูกวาด
   4) แปลงกราฟ canvas เป็นรูป (พิมพ์คมชัด ไม่หาย)  5) รอรูปโหลดแล้วค่อยเปิดหน้าพิมพ์
   ===================================================================== */
const PRINT={busy:false};
function printPrep(){
  document.body.classList.add('printing');
  $$('.rv').forEach(e=>e.classList.add('in'));
  $$('img').forEach(im=>{if(im.loading==='lazy')im.loading='eager';if(im.dataset.src&&!im.src)im.src=im.dataset.src});
  if(STY.list&&STY.list.length&&document.getElementById('dsx'))STY.list.forEach(b=>{const el=document.getElementById('sb-'+b.d.code);if(el&&el.dataset.v!=='table')styDraw(b.d.code)});
  $$('.psnap').forEach(e=>e.remove());
  charts.forEach(c=>{try{const cv=c.canvas;if(!cv||!cv.isConnected||!cv.offsetWidth)return;c.stop&&c.stop();c.options.animation=false;c.update('none');
    const im=new Image();im.className='psnap';im.alt=cv.getAttribute('aria-label')||'';im.src=c.toBase64Image('image/png',1);cv.classList.add('has-snap');cv.insertAdjacentElement('afterend',im)}catch(e){}})}
function printDone(){document.body.classList.remove('printing');$$('.psnap').forEach(e=>e.remove());$$('canvas.has-snap').forEach(c=>c.classList.remove('has-snap'))}
async function NBL_PRINT(){if(PRINT.busy)return;PRINT.busy=true;toast(L('กำลังเตรียมหน้าพิมพ์ให้ภาพครบ…','Preparing print with all visuals…'));
  try{printPrep();
    const imgs=[...document.images].filter(im=>!im.complete);
    await Promise.race([Promise.all(imgs.map(im=>new Promise(r=>{im.addEventListener('load',r,{once:true});im.addEventListener('error',r,{once:true})}))),new Promise(r=>setTimeout(r,4000))]);
    if(document.fonts&&document.fonts.ready)await document.fonts.ready;
    await new Promise(r=>setTimeout(r,150));PRINT.manual=true;window.print()}
  finally{PRINT.busy=false}}
window.NBL_PRINT=NBL_PRINT;
window.addEventListener('beforeprint',()=>{if(!PRINT.manual)printPrep()});
window.addEventListener('afterprint',()=>{PRINT.manual=false;printDone()});
