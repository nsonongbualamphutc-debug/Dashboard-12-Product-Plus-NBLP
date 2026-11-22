/* =====================================================================
   pages20 — ค่าภาพรวมจังหวัดของชุดข้อมูลค่าเฉลี่ย (ต้นทุน/ผลผลิตต่อไร่)
   - ถ้าหน่วยงานส่งตัวเลขระดับจังหวัดมา (แถวไม่ระบุอำเภอ) → ใช้ค่านั้นเป็น "ภาพรวมจังหวัด"
     ไม่นับเป็นอำเภอ และไม่เอาไปเฉลี่ยรวมกับอำเภอ
   - ถ้าไม่มี → ภาพรวม = ค่าเฉลี่ยของอำเภอที่มีข้อมูล (เหมือนเดิม)
   - ตาราง: แถวท้ายของชุดค่าเฉลี่ยแสดง "ภาพรวมจังหวัด"/"เฉลี่ย" แทนผลรวม (ต้นทุนบวกกันไม่ได้)
   ===================================================================== */
(function(){
const TT='รวมทั้งจังหวัด';
const isA=b=>!!(b&&b.ds&&b.ds.agg==='avg');
const pv=(b,y)=>{const T=b.rows.filter(r=>r.year===y&&r.dist===TT&&+r.value>0);return T.length?T.reduce((a,r)=>a+(+r.value),0)/T.length:null};
const dv=(b,y)=>b.rows.filter(r=>r.year===y&&r.dist&&r.dist!==TT&&+r.value>0);
const hasP=b=>b.rows.some(r=>r.dist===TT&&+r.value>0);
const ov=(b,y)=>{const p=pv(b,y);if(p!=null)return p;const L0=dv(b,y);return L0.length?L0.reduce((a,r)=>a+(+r.value),0)/L0.length:null};

if(typeof styKpi==='function'){const _k=styKpi;styKpi=function(b){
  if(isA(b)&&b.rows&&hasP(b)){const A=styAgg(b.rows);const p=pv(b,A.ly);
    if(p!=null)return{v:fv(p,b.unit),u:L('ภาพรวมจังหวัด · ','Province · ')+uLab(b.unit)}}
  return _k(b)}}

if(typeof styInsight==='function'){const _i=styInsight;styInsight=function(b){
  if(isA(b)&&b.rows&&hasP(b)){const A=styAgg(b.rows);const p=pv(b,A.ly);const L0=dv(b,A.ly).sort((x,y)=>y.value-x.value);
    if(p!=null){const top=L0[0];
      return L(`ปี ${yCE(A.ly)} ภาพรวมจังหวัด <b>${fv(p,b.unit)}</b> ${uLab(b.unit)}`+(top?` · สูงสุด อ.${dShort(top.dist)} <b>${fv(top.value,b.unit)}</b> (${L0.length} อำเภอที่มีข้อมูล)`:''),
               `${yCE(A.ly)} province <b>${fv(p,b.unit)}</b> ${uLab(b.unit)}`+(top?` · highest ${dShort(top.dist)} <b>${fv(top.value,b.unit)}</b>`:''))}}
  return _i(b)}}

if(typeof styTable==='function'){const _t=styTable;styTable=function(b){let h=_t(b);
  try{if(isA(b)&&b.rows&&/<tfoot>/.test(h)){const A=styAgg(b.rows);const p=hasP(b);
    const cells=A.ys.map(y=>{const v=ov(b,y);return`<td class="r num">${v==null?'–':fv(v,b.unit)}</td>`}).join('');
    h=h.replace(/<tfoot>[\s\S]*?<\/tfoot>/,`<tfoot><tr><td>${p?L('ภาพรวมจังหวัด','Province'):L('เฉลี่ย','Average')}</td>${cells}</tr></tfoot>`)}}catch(e){}
  return h}}
})();
