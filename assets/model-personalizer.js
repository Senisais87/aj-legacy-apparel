/* Live photo proofs using the existing AJ Legacy blank model photographs and artwork. */
(function(){
'use strict';
const script=document.currentScript;
const root=new URL('../',script.src);
const cache=new Map();
const colors={Black:'#17191d',Charcoal:'#363a41',Navy:'#152b49','Royal Blue':'#1769aa',White:'#eeeeee','Heather Gray':'#8b9096',Red:'#c8242b',Orange:'#f47721',Olive:'#596245',Blue:'#1769aa',Purple:'#8548a9',Gold:'#e3b126',Silver:'#a6a8ab',Green:'#527b48'};
function load(url){url=new URL(url,root).href;if(!cache.has(url))cache.set(url,new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=()=>reject(new Error('Preview image could not load'));im.src=url}));return cache.get(url)}
function artwork(im,box,lineColors=[],stripe,rawArt=false){
 const c=document.createElement('canvas');
 c.width=Math.max(1,Math.round(im.naturalWidth*box[2]));
 c.height=Math.max(1,Math.round(im.naturalHeight*box[3]));
 const x=c.getContext('2d',{willReadFrequently:true});
 x.drawImage(im,im.naturalWidth*box[0],im.naturalHeight*box[1],im.naturalWidth*box[2],im.naturalHeight*box[3],0,0,c.width,c.height);
 const p=x.getImageData(0,0,c.width,c.height),d=p.data;
 for(let i=0;!rawArt&&i<d.length;i+=4){
  const hi=Math.max(d[i],d[i+1],d[i+2]),lo=Math.min(d[i],d[i+1],d[i+2]);
  const colorful=hi-lo>28&&hi>50;
  d[i+3]=Math.round(d[i+3]*(colorful?Math.min(1,(hi-30)/60):Math.max(0,Math.min(1,(hi-55)/55))));
 }
 x.putImageData(p,0,0);
 window.AJPreviewStripes?.paint(x,stripe,lineColors.map(name=>colors[name]||name),box);
 // Trim transparent margins without stretching the artwork's original proportions.
 let l=c.width,t=c.height,r=-1,b=-1;
 for(let y=0;y<c.height;y++)for(let a=0;a<c.width;a++)if(d[(y*c.width+a)*4+3]>120){l=Math.min(l,a);r=Math.max(r,a);t=Math.min(t,y);b=Math.max(b,y)}
 if(r<l)return c;const clean=document.createElement('canvas');clean.width=r-l+1;clean.height=b-t+1;clean.getContext('2d').drawImage(c,l,t,clean.width,clean.height,0,0,clean.width,clean.height);return clean;}
function text(ctx,value,cx,y,maxWidth,ink){if(!value)return;ctx.save();ctx.fillStyle=ink;ctx.textAlign='center';ctx.textBaseline='middle';let size=15;ctx.font='700 '+size+'px Arial';while(ctx.measureText(value).width>maxWidth&&size>8){size--;ctx.font='700 '+size+'px Arial'}ctx.fillText(value,cx,y,maxWidth);ctx.restore();}
window.AJModelPersonalizer={async artwork(source,box,lines,stripe){return artwork(await load(source),box,lines,stripe)},create(canvas){let sequence=0;return{async draw(v){const version=++sequence;try{const placement=v.placement||'Full Front',back=/Back/.test(placement);
const catalog=window.AJGarments;
const style=v.fullZip?'Full-zip hoodie':v.hoodie?'Hoodie':v.tank?'Tank Top':'T-shirt';
const model=catalog.models[style];
const [template,source,logo]=await Promise.all([
 load(catalog.modelImage(style)),load(v.source),load('assets/logo.png')
]);if(version!==sequence)return;
canvas.width=1536;canvas.height=920;
const ctx=canvas.getContext('2d');
const color=colors[v.color]||colors.Black;
catalog.drawModel(ctx,template,0,768,false,model,color);
catalog.drawModel(ctx,template,768,768,true,model,color);
delete canvas.dataset.previewError;
const art=artwork(source,v.box||[.22,.36,.20,.36],v.lines,v.stripe,v.rawArt);
const [x,y,width,height]=model[back?'back':'front'];
let cx=(Number(back)+x)*768,centerY=y*768,w=width*768,h=height*768;
 if(/Chest/.test(placement)){
  cx=/Right/.test(placement)?330:438;
  centerY=(v.hoodie?190:175)+37.5;
  w=70;
  h=75;
 }else if(/Sleeve/.test(placement)){
  cx=/Right/.test(placement)?245:520;
  centerY=234;
  w=36;
  h=48;
 }else if(placement==='Upper Back'){
  centerY=v.hoodie?330:260;
  w=170;
  h=145;
 }

 if(v.fullZip&&placement==='Full Front'){
  ctx.save();
  ctx.translate((x-.5)*768,0);
  window.AJPlacement.drawSplitFront(ctx,art,768,centerY,w,h,true);
  ctx.restore();
 }else{
  const scale=Math.min(w/art.width,h/art.height);
  ctx.drawImage(art,cx-art.width*scale/2,centerY-art.height*scale/2,art.width*scale,art.height*scale);
 }
 const ink=['White','Heather Gray'].includes(v.color)?'#101820':'#ffffff';const opposite=330;
 text(ctx,v.name,opposite,v.hoodie?185:172,100,ink);text(ctx,v.department,opposite,v.hoodie?205:192,100,ink);text(ctx,v.front,384,v.hoodie?455:535,210,ink);text(ctx,v.back,1152,v.hoodie?590:535,210,ink);



 ctx.fillStyle='#19191a';ctx.fillRect(0,768,1536,62);ctx.fillStyle='#f4f4f4';ctx.font='600 20px Arial';ctx.textAlign='center';ctx.fillText('FRONT',384,805);ctx.fillText('BACK',1152,805);window.AJPlacement.insideLabel(ctx,logo,0,830,1536,90);canvas.dataset.logoSide='Inside';canvas.dataset.brandPlacement=window.AJPlacement.brand.placement;canvas.dataset.badgePlacement='Wearer-left chest';canvas.dataset.previewEngine='live-garment-personalization';canvas.dataset.wornModel='true';canvas.dataset.previewState=JSON.stringify(v);canvas.dataset.renderVersion=String(version);canvas.setAttribute('aria-label',(v.title||'AJ Legacy apparel')+' personalized front and back garment preview');canvas.dispatchEvent(new CustomEvent('previewrendered'));}catch(e){canvas.dataset.previewError=e.message;canvas.dispatchEvent(new CustomEvent('previewerror'));}}}}};
})();

