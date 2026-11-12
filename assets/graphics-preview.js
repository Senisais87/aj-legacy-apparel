/* Render a customized product image or compose the artwork on the selected garment. */
(function(){
 'use strict';
 const silhouettes={
  Shirt:'M135 55L176 38Q210 66 244 38L285 55L344 114L292 151L276 126V391H144V126L128 151L76 114Z',
  Hoodie:'M164 51Q162 12 210 12Q258 12 256 51L290 66L323 111L354 363L308 371L277 167V391H143V167L112 371L66 363L97 111L130 66Z',
  'Tank Top':'M157 42L183 42Q210 93 237 42H263Q255 109 281 134L277 391H143L139 134Q165 109 157 42Z',
 };
 function compose(context,v){
  const shape=new Path2D(silhouettes[v.style]);
  const image=v.original;
  const ctx=context;
  const {width,height}=ctx.canvas;
  ctx.fillStyle='#22262d';ctx.fillRect(0,0,width,height);
  const garment=(offset,label)=>{
   ctx.save();ctx.translate(offset,0);
   ctx.fillStyle=v.color;ctx.strokeStyle='#89909a';ctx.lineWidth=2;ctx.fill(shape);ctx.stroke(shape);
   if(v.style==='Hoodie'){
    ctx.strokeStyle='#89909a';ctx.stroke(new Path2D(label==='FRONT'?'M164 51Q210 100 256 51M168 333L185 303H235L252 333V360H168Z':'M164 51Q210 87 256 51'));
   }
   ctx.fillStyle='#e9edf2';ctx.textAlign='center';ctx.font='bold 14px system-ui';ctx.fillText(label,210,414);
   ctx.restore();
  };
  garment(0,'FRONT');garment(420,'BACK');
  const front=v.side==='Front';
  const offset=front?0:420;
  const standalone=v.artKey.startsWith('selected-gym-');
  const box=standalone?[0,0,1,1]:v.mainBox||[.60,.22,.30,.55];
  const [x,y,w,h]=box.map((n,i)=>n*(i%2?image.naturalHeight:image.naturalWidth));
  const cut=document.createElement('canvas');
  cut.width=Math.ceil(w);cut.height=Math.ceil(h);
  const crop=cut.getContext('2d',{willReadFrequently:true});
  crop.drawImage(image,x,y,w,h,0,0,cut.width,cut.height);
  const pixels=crop.getImageData(0,0,cut.width,cut.height);
  if(!standalone||v.artKey==='selected-gym-01'){
   for(let i=0;i<pixels.data.length;i+=4){
    const [r,g,b]=[pixels.data[i],pixels.data[i+1],pixels.data[i+2]];
    const hi=Math.max(r,g,b),lo=Math.min(r,g,b);
    if(v.artKey==='selected-gym-01'&&lo>177&&hi-lo<17)pixels.data[i+3]=0;
    else if(!standalone&&hi-lo<24)pixels.data[i+3]*=Math.min(1,Math.max(0,(hi-45)/75));
   }
   crop.putImageData(pixels,0,0);
  }
  const scale=Math.min(112/cut.width,156/cut.height);
  ctx.drawImage(cut,offset+210-cut.width*scale/2,v.style==='Hoodie'?130:115,cut.width*scale,cut.height*scale);
  if(v.frontLogo){
   const [lx,ly,lw,lh]=v.frontLogo.map((n,i)=>n*(i%2?image.naturalHeight:image.naturalWidth));
   const logo=document.createElement('canvas');
   logo.width=Math.ceil(lw);logo.height=Math.ceil(lh);
   const logoContext=logo.getContext('2d',{willReadFrequently:true});
   logoContext.drawImage(image,lx,ly,lw,lh,0,0,logo.width,logo.height);
   const ink=logoContext.getImageData(0,0,logo.width,logo.height);
   for(let i=0;i<ink.data.length;i+=4)ink.data[i+3]*=Math.min(1,Math.max(0,(ink.data[i]-90)/75));
   logoContext.putImageData(ink,0,0);
   ctx.drawImage(logo,228,78,30,30);
  }
  if(v.text){
   ctx.fillStyle=v.ink;ctx.textAlign='center';ctx.font='bold 13px system-ui';
   ctx.fillText(v.text,front?172:175,front?101:115,front?56:65);
  }
 }
 window.AJGraphicsPreview={create(canvas){
  let disposed=false;
  return {
   dispose(){disposed=true},
   draw(v){
    if(disposed||!v.source)return false;
    const width=v.source.naturalWidth||v.source.width;
    const height=v.source.naturalHeight||v.source.height;
    if(!width||!height)return false;
    canvas.width=v.compose?840:width;
    canvas.height=v.compose?435:height;
    const context=canvas.getContext('2d');
    if(v.compose)compose(context,v);
    else context.drawImage(v.source,0,0,width,height);
    canvas.dataset.previewEngine=v.compose?'garment-artwork-composite':'live-product-artwork';
    canvas.dataset.garment=v.style;
    canvas.dataset.placement=v.side;
    return true;
   }
  };
 }};
})();

// Keep nested collection-card handling from swallowing the K9 navigation link.
document.addEventListener('click',function(event){const link=event.target.closest?.('a[href]');if(link&&/service-designs\.html\?category=k9/.test(link.getAttribute('href'))){event.preventDefault();event.stopImmediatePropagation();location.assign(new URL('k9-collection.html',location.href).href)}},true);

(function(){const s=document.createElement('style');s.textContent="@media(max-width:600px){header{position:sticky;top:0}header nav{display:grid!important;grid-template-columns:minmax(0,1fr) 135px;gap:10px!important;padding:10px 16px!important}.brand{font-size:20px!important;white-space:nowrap}header nav .search{width:100%!important;min-width:0;font-size:14px;padding:8px}header nav .links{grid-column:1/-1;display:flex;justify-content:space-between;gap:8px!important;font-size:12px!important;flex-wrap:wrap}header nav .links a{padding:4px 0}html{scroll-padding-top:110px}.product-grid,.catalog-grid{grid-template-columns:1fr}.product-grid img,.catalog-grid img{max-width:100%;object-fit:contain!important}.product-grid button{min-width:0}}";document.head.appendChild(s)})();
