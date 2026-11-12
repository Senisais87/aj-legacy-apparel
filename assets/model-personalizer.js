/* Live photo proofs using the existing AJ Legacy blank model photographs and artwork. */
(function(){
'use strict';
const script=document.currentScript;
const root=new URL('../',script.src);
const cache=new Map();
const colors={Black:'#17191d',Charcoal:'#363a41',Navy:'#152b49','Royal Blue':'#1769aa',White:'#eeeeee','Heather Gray':'#8b9096',Red:'#c8242b',Orange:'#f47721',Olive:'#596245',Blue:'#1769aa',Purple:'#8548a9',Gold:'#e3b126',Silver:'#a6a8ab',Green:'#527b48'};
function load(url){url=new URL(url,root).href;if(!cache.has(url))cache.set(url,new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=()=>reject(new Error('Preview image could not load'));im.src=url}));return cache.get(url)}
function artwork(im,box,lineColors=[],stripe){
 const c=document.createElement('canvas');
 c.width=Math.max(1,Math.round(im.naturalWidth*box[2]));
 c.height=Math.max(1,Math.round(im.naturalHeight*box[3]));
 const x=c.getContext('2d',{willReadFrequently:true});
 x.drawImage(im,im.naturalWidth*box[0],im.naturalHeight*box[1],im.naturalWidth*box[2],im.naturalHeight*box[3],0,0,c.width,c.height);
 const p=x.getImageData(0,0,c.width,c.height),d=p.data;
 for(let i=0;i<d.length;i+=4){
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
function photo(template,hoodie,back,color){const c=document.createElement('canvas');c.width=c.height=768;const x=c.getContext('2d',{willReadFrequently:true});x.drawImage(template,back*template.width/2,hoodie*template.height/2,template.width/2,template.height/2,0,0,768,768);
 if(color!=='Black'){x.save();x.beginPath();const points=hoodie?[[304,32],[468,32],[502,133],[581,188],[640,430],[625,684],[551,684],[529,430],[521,687],[244,687],[236,430],[211,684],[137,684],[122,430],[181,188],[269,133]]:[[292,45],[478,45],[562,96],[665,295],[567,344],[542,300],[555,684],[213,684],[225,300],[201,344],[98,295],[201,96]];points.forEach(([a,b],i)=>i?x.lineTo(a,b):x.moveTo(a,b));x.closePath();x.clip();const rgb=[1,3,5].map(n=>parseInt((colors[color]||color||'#17191d').slice(n,n+2),16));const p=x.getImageData(0,0,768,768),d=p.data;
 // Only neutral dark fabric is colored; skin and the studio background are preserved.
 for(let i=0;i<d.length;i+=4){const hi=Math.max(d[i],d[i+1],d[i+2]),lo=Math.min(d[i],d[i+1],d[i+2]);if(hi>105||hi-lo>18)continue;const l=(d[i]+d[i+1]+d[i+2])/3;for(let k=0;k<3;k++)d[i+k]=Math.min(255,rgb[k]*(.55+l/100));}
 const painted=document.createElement('canvas');painted.width=painted.height=768;painted.getContext('2d').putImageData(p,0,0);x.drawImage(painted,0,0);x.restore();}return c;}
function tankPhoto(template,color){
 const ctx=document.createElement('canvas').getContext('2d',{willReadFrequently:true});
 ctx.canvas.width=ctx.canvas.height=768;
 ctx.drawImage(template,0,0,768,768);
 if(color!=='Black'){
  const data=ctx.getImageData(0,0,768,768),d=data.data;
  const rgb=(colors[color]||colors.Black).slice(1).match(/../g).map(x=>parseInt(x,16));
  for(let i=0;i<d.length;i+=4){
   if(!d[i+3])continue;
   const shade=.70+(d[i]+d[i+1]+d[i+2])/195;
   for(let c=0;c<3;c++)d[i+c]=Math.min(255,rgb[c]*shade);
  }
  ctx.putImageData(data,0,0);
 }
 ctx.globalCompositeOperation='destination-over';ctx.fillStyle='#242931';ctx.fillRect(0,0,768,768);
 return ctx.canvas;
}
function text(ctx,value,cx,y,maxWidth,ink){if(!value)return;ctx.save();ctx.fillStyle=ink;ctx.textAlign='center';ctx.textBaseline='middle';let size=15;ctx.font='700 '+size+'px Arial';while(ctx.measureText(value).width>maxWidth&&size>8){size--;ctx.font='700 '+size+'px Arial'}ctx.fillText(value,cx,y,maxWidth);ctx.restore();}
window.AJModelPersonalizer={async artwork(source,box,lines,stripe){return artwork(await load(source),box,lines,stripe)},create(canvas){let sequence=0;return{async draw(v){const version=++sequence;try{const placement=v.placement||'Full Front',back=/Back/.test(placement);
const [template,source,tankBack,logo]=await Promise.all([
 load(v.tank?'assets/mockups/individual/tank.webp':'assets/mockups/garment-only-studio.webp'),
 load(v.source),v.tank?load('assets/mockups/individual/tank-back.webp'):null,back?load('assets/logo.png'):null
]);if(version!==sequence)return;canvas.width=1536;canvas.height=830;const ctx=canvas.getContext('2d');ctx.drawImage(v.tank?tankPhoto(template,v.color):photo(template,v.hoodie,false,v.color),0,0);ctx.drawImage(v.tank?tankPhoto(tankBack,v.color):photo(template,v.hoodie,true,v.color),768,0);delete canvas.dataset.previewError;const art=artwork(source,v.box||[.22,.36,.20,.36],v.lines,v.stripe);let cx=(back?1152:384),top=v.hoodie?235:185,w=235,h=v.hoodie?190:310;
 if(/Chest/.test(placement)){cx=/Right/.test(placement)?330:438;top=v.hoodie?190:175;w=70;h=75;}else if(/Sleeve/.test(placement)){cx=/Right/.test(placement)?245:520;top=210;w=36;h=48;}else if(placement==='Upper Back'){top=v.hoodie?215:155;w=170;h=145;}else if(back){top=v.hoodie?225:160;w=235;h=335;}
 if(v.tank)top=Math.max(top,220);
 if(logo)ctx.drawImage(logo,v.tank?430:402,v.tank?231:160,68,68);
 const scale=Math.min(w/art.width,h/art.height);ctx.drawImage(art,cx-art.width*scale/2,top,art.width*scale,art.height*scale);const ink=['White','Heather Gray'].includes(v.color)?'#101820':'#ffffff';const opposite=back||/Left Chest/.test(placement)?330:438;
 text(ctx,v.name,opposite,v.hoodie?185:172,100,ink);text(ctx,v.department,opposite,v.hoodie?205:192,100,ink);text(ctx,v.badge,opposite,v.hoodie?225:212,95,ink);text(ctx,v.front,384,v.hoodie?455:535,210,ink);text(ctx,v.back,1152,v.hoodie?590:535,210,ink);

 if(v.state&&window.AJStateOutlines?.[v.state]){const shape=window.AJStateOutlines[v.state],b=shape.box;const scale=Math.min(38/b[2],42/b[3]);ctx.save();ctx.translate(523-b[2]*scale/2,(v.hoodie?235:213));ctx.scale(scale,scale);ctx.translate(-b[0],-b[1]);ctx.strokeStyle=ink;ctx.fillStyle=colors[v.color]||'#17191d';ctx.lineWidth=1.8/scale;ctx.fill(new Path2D(shape.path));ctx.stroke(new Path2D(shape.path));ctx.restore();text(ctx,v.state,523,v.hoodie?290:268,42,ink);}
 ctx.fillStyle='#e9e6e1';ctx.fillRect(0,768,1536,62);ctx.fillStyle='#242424';ctx.font='600 20px Arial';ctx.textAlign='center';ctx.fillText('FRONT',384,805);ctx.fillText('BACK',1152,805);canvas.dataset.previewEngine='live-garment-personalization';canvas.dataset.previewState=JSON.stringify(v);canvas.dataset.renderVersion=String(version);canvas.setAttribute('aria-label',(v.title||'AJ Legacy apparel')+' personalized front and back garment preview');canvas.dispatchEvent(new CustomEvent('previewrendered'));}catch(e){canvas.dataset.previewError=e.message;canvas.dispatchEvent(new CustomEvent('previewerror'));}}}}};
})();
