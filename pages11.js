/* ---------- ตัวกรองประเภทข้อมูลในบล็อก (slicer) ---------- */
(function(){
if(typeof styItems!=='function'||typeof STY==='undefined')return;
STY.tsel=STY.tsel||{};
const SFX=/ \(([^()]+)\)$/;
const mixU=b=>!!(b.ds&&(b.ds.agg==='avg'||b.ds.unit==='หน่วย'||(b.ds.types||[]).some(t=>SFX.test(t))));
const MK=/ในจังหวัด|ต่างจังหวัด|ต่างประเทศ|ภาคอีสาน|กรุงเทพ/;
function dimsOf(b){
  if(!b.real||b.empty||!b.rows||['cal','status'].includes(b.form))return null;
  const R=b.rows.filter(r=>r.type&&r.type!=='รวม');if(!R.length)return null;
  const P=R.map(r=>String(r.type).replace(SFX,'').split(' · '));const k=P[0].length;
  if(k>2||P.some(x=>x.length!==k))return null;
  const D=[];for(let i=0;i<k;i++){const tot={};R.forEach((r,j)=>{const v=P[j][i];tot[v]=(tot[v]||0)+(+r.value||0)});D.push(Object.keys(tot).filter(t=>tot[t]).sort((x,y)=>tot[y]-tot[x]))}
  if(D.every(d=>d.length<2))return null;return D}
const partsOf=t=>String(t).replace(SFX,'').split(' · ');
const keep=(src,arr)=>Object.assign(arr,{unit:src.unit,src:src.src,name:src.name});
/* รูปแบบการนำเสนอ: ไม่มีอำเภอ + หลายประเภท + ปีเดียว → สัดส่วน */
const _f=styForm;styForm=function(d,p,ds){
  if(ds&&!ds.form&&!ds.district&&(ds.types||[]).length>=2&&(ds.years||[]).length===1&&ds.agg!=='avg'&&!(ds.types||[]).some(t=>SFX.test(t))&&ds.unit!=='หน่วย')return'share';
  return _f(d,p,ds)};
const _si=styItems;styItems=function(p){return _si(p).map(b=>{
  const D=dimsOf(b);b.tDims=D;b.tMix=mixU(b);if(!D)return b;
  let sel=STY.tsel[b.d.code];sel=Array.isArray(sel)?sel.slice():D.map(()=>'*');
  D.forEach((d,i)=>{if(sel[i]!=='*'&&!d.includes(sel[i]))sel[i]='*';if(d.length<2)sel[i]='*'});
  if(b.tMix){const i=D.findIndex(d=>d.length>=2);if(i>=0&&sel[i]==='*')sel[i]=D[i][0]}
  b.tSel=sel;if(sel.every(x=>x==='*'))return b;
  b.rows=keep(b.rows,b.rows.filter(r=>{const q=partsOf(r.type||'');return sel.every((v,i)=>v==='*'||q[i]===v)}));
  const us=[...new Set(b.rows.map(r=>(String(r.type).match(SFX)||[])[1]).filter(Boolean))];if(us.length===1)b.unit=us[0];
  if(b.form==='pair')b.unit=/กลุ่ม/.test(sel[0])?'กลุ่ม':'ราย';
  const left=new Set(b.rows.map(r=>r.type)).size;
  if(['pair','mix','band'].includes(b.form)||(b.form==='share'&&left<2))b.form=b.ds&&b.ds.district?'stack':'growth';
  return b})};
const css=`.stb-sl{display:flex;flex-wrap:wrap;align-items:center;gap:6px;margin:8px 0 0}
.stb-sl+.stb-sl{margin-top:6px}
.stb-sl>span{min-width:88px;font-size:12.5px;color:var(--muted);margin-right:2px;display:inline-flex;align-items:center;gap:5px}
.stb-sl button{font:inherit;font-size:12.5px;line-height:1.2;padding:6px 12px;border-radius:99px;border:1px solid color-mix(in srgb,var(--pa) 30%,var(--line));background:var(--surface);color:var(--ink);cursor:pointer;max-width:100%;text-align:left}
.stb-sl button:hover{border-color:var(--pa)}
.stb-sl button[aria-pressed="true"]{background:var(--pa);border-color:var(--pa);color:#fff}
.stb-sl select{font:inherit;font-size:13px;padding:6px 10px;border-radius:12px;border:1px solid color-mix(in srgb,var(--pa) 35%,var(--line));background:var(--surface);color:var(--ink);max-width:100%}
@media print{.stb-sl{display:none}}`;
if(!document.getElementById('stb-sl-css')){const s=document.createElement('style');s.id='stb-sl-css';s.textContent=css;document.head.appendChild(s)}
function slicer(b){const D=b.tDims;if(!D)return'';const sel=b.tSel||D.map(()=>'*');
  const row=(d,i)=>{if(d.length<2)return'';const mixFix=b.tMix&&i===D.findIndex(x=>x.length>=2);
    const opts=(mixFix?[]:[['*',L('ทั้งหมด','All')]]).concat(d.map(t=>[t,tLab(t)]));
    const nm=D.length>1&&d.some(x=>MK.test(x))?L('ตลาดปลายทาง','Market'):D.length>1&&i===1?L('กลุ่มย่อย','Sub-group'):L('ประเภท','Type');
    const lab=`<span>${i===0||D[0].length<2?ic('grid'):''}${nm}</span>`;
    if(opts.length>7)return`<div class="stb-sl" role="group">${lab}<select data-tsel-s="${i}" aria-label="${esc(nm)}">${opts.map(([v,t])=>`<option value="${esc(v)}"${v===sel[i]?' selected':''}>${esc(t)}</option>`).join('')}</select></div>`;
    return`<div class="stb-sl" role="group" aria-label="${esc(nm)}">${lab}${opts.map(([v,t])=>`<button type="button" data-tsel="${esc(v)}" data-ti="${i}" aria-pressed="${v===sel[i]}">${esc(t)}</button>`).join('')}</div>`};
  return D.map(row).join('')}
const _sb=styBlock;styBlock=function(b,i){let h=_sb(b,i);if(b.tSel&&b.tSel.some(x=>x!=='*')){const t=document.createElement('template');t.innerHTML=h;t.content.querySelectorAll('.stb-mix').forEach(e=>e.remove());h=t.innerHTML}const s=slicer(b);if(!s)return h;const k=h.indexOf('<div class="stb-tools"');return k<0?h:h.slice(0,k)+s+h.slice(k)};
const _b1=styBind1;styBind1=function(el){_b1(el);if(!el)return;const code=el.dataset.code;
  const go=(i,v)=>{const b=STY.list.find(x=>x.d.code===code);const cur=(b&&b.tSel||[]).slice();cur[i]=v;STY.tsel[code]=cur;const y=window.scrollY;styRe(code);window.scrollTo(0,y)};
  el.querySelectorAll('[data-tsel]').forEach(t=>t.onclick=()=>go(+t.dataset.ti,t.dataset.tsel));
  el.querySelectorAll('[data-tsel-s]').forEach(s=>s.onchange=()=>go(+s.dataset.tselS,s.value))};
})();
