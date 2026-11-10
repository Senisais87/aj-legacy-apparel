export const GAP=3; // SVG units; intentional no-touch clearance
export const baseTypes=['Name','Rank','Unit'];
export function supports(design,feature,type,line){
 if(!design||!(design.line==='Any'||design.line===line)||!design.capabilities?.includes(feature))return false;
 if(['State','Abbreviation'].includes(feature))return type!=='Lower'&&!['Memorial','Gym'].includes(line)&&(type!=='Headwear'||feature==='State');
 if(feature==='Breed')return line==='K9'&&design.containsDog===true&&type!=='Lower';
 if(feature==='ThinLine')return type!=='Headwear'&&!['Memorial','Gym'].includes(line);
 return true;
}
export function allowed(type,line,zone,design){
 let a=baseTypes.filter(x=>zone.accepts.includes(x));
 if(type!=='Lower'&&!['Memorial','Gym'].includes(line))a.push(...['State','Abbreviation'].filter(x=>zone.accepts.includes(x)&&(type!=='Headwear'||x==='State')));
 if(line==='K9'&&type!=='Lower'&&zone.accepts.includes('Breed'))a.push('Breed');
 if(zone.accepts.includes('Graphic')&&type!=='Headwear')a.push('Graphic');
 return a.filter(k=>k==='Graphic'||supports(design,k,type,line));
}
export function collides(a,b,gap=GAP){return a.side===b.side&&a.x<=b.x+b.w+gap&&a.x+a.w+gap>=b.x&&a.y<=b.y+b.h+gap&&a.y+a.h+gap>=b.y}
export function canPlace(candidate,elements,ignore){return !elements.some(e=>e.id!==ignore&&collides(candidate,e))}
const z=(id,label,side,x,y,w,h,accepts)=>({id,label,side,x,y,w,h,accepts});
export function zones(type){
 if(type==='Lower')return [z('thigh-r','Right thigh','Front',252,120,56,37,baseTypes),z('leg-l','Left leg','Front',187,222,49,50,baseTypes),z('leg-r','Right leg','Front',263,222,49,50,baseTypes),z('rear','Back graphic','Back',192,105,115,82,['Graphic']),z('rear-text','Back leg','Back',260,230,53,40,baseTypes),z('front-art','Front graphic','Front',188,305,48,60,['Graphic'])];
 if(type==='Headwear')return [z('hat-front','Front panel','Front',170,190,160,46,[...baseTypes,'State']),z('hat-back','Back panel','Back',190,198,120,35,[...baseTypes,'State'])];
 return [z('chest-left','Left chest','Front',264,137,61,35,[...baseTypes,'State','Abbreviation','Breed']),z('chest-right','Right chest','Front',177,137,61,35,[...baseTypes,'State','Abbreviation','Breed']),z('shoulder-left','Left shoulder','Front',335,116,38,40,['State','Abbreviation']),z('shoulder-right','Right shoulder','Front',127,116,38,40,['State','Abbreviation']),z('upper-back','Upper back','Back',184,154,132,32,baseTypes),z('lower-back','Lower back','Back',184,345,132,31,['Unit']),z('front-graphic','Front design','Front',180,195,140,135,['Graphic']),z('back-graphic','Back design','Back',180,200,140,130,['Graphic']),z('breed-back','K9 breed','Back',185,383,130,25,['Breed'])];
}
export function logo(type){return type==='Headwear'?null:type==='Lower'?{id:'brand',side:'Front',x:190,y:120,w:40,h:40,kind:'Brand Logo',locked:true,asset:'assets/logo.png'}:{id:'brand',side:'Back',x:228,y:100,w:44,h:36,kind:'Brand Logo',locked:true,asset:'assets/logo.png'}}
export function validate(e,type,line,design){const all=[...e,...(logo(type)?[logo(type)]:[])];return e.every(a=>{const zone=zones(type).find(z=>z.id===a.zone);return zone&&allowed(type,line,zone,design).includes(a.kind)&&(!(a.kind==='Graphic'&&a.graphic==='Flag')||supports(design,'ThinLine',type,line))&&(!(a.kind==='Graphic'&&a.graphic==='Selected')||a.designId===design?.id)&&a.x>=zone.x&&a.y>=zone.y&&a.x+a.w<=zone.x+zone.w&&a.y+a.h<=zone.y+zone.h&&canPlace(a,all,a.id)})}
