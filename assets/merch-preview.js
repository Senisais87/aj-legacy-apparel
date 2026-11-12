/* The dialog uses the current rendered proof, including all selected options. */
(() => {
 'use strict';
 const column=document.querySelector('.aj-dedicated-customizer .aj-preview-column, .aj-dedicated-service > div:first-child')
  || document.getElementById('livePreview')?.parentElement;
 if(!column || column.closest('[hidden]'))return;
 const getPreview=()=>[...column.querySelectorAll('#garment-preview canvas, #livePreview, #selected-product-image img, #individual-proof, #preview')]
  .find(image=>!image.closest('[hidden], details:not([open])'));
 if(!getPreview())return;

 const enlarge=document.createElement('button');
 enlarge.type='button';
 enlarge.className='aj-enlarge-preview';
 enlarge.textContent='Enlarge preview';
 column.append(enlarge);

 const dialog=document.createElement('dialog');
 dialog.className='aj-preview-dialog';
 dialog.setAttribute('aria-label','Enlarged merchandise preview');
 dialog.innerHTML='<div class="aj-preview-tools"><button type="button" aria-pressed="false">Zoom in</button><button type="button" autofocus>Close</button></div><div class="aj-preview-scroll"><img alt=""></div>';
 document.body.append(dialog);
 const [zoom,close]=dialog.querySelectorAll('button');
 const scroll=dialog.querySelector('.aj-preview-scroll');
 const photo=scroll.querySelector('img');

 function setZoom(enabled){
  scroll.toggleAttribute('data-zoomed',enabled);
  zoom.setAttribute('aria-pressed',String(enabled));
  zoom.textContent=enabled?'Fit to screen':'Zoom in';
  scroll.scrollLeft=0;
  scroll.scrollTop=0;
 }
 enlarge.addEventListener('click',()=>{
  const current=getPreview();
  if(!current)return;
  photo.src=current instanceof HTMLCanvasElement?current.toDataURL('image/png'):current.currentSrc||current.src;
  photo.alt=current.getAttribute('aria-label')||current.alt||'Current merchandise preview';
  setZoom(false);
  dialog.showModal();
 });
 zoom.addEventListener('click',()=>setZoom(!scroll.hasAttribute('data-zoomed')));
 close.addEventListener('click',()=>dialog.close());
 dialog.addEventListener('close',()=>enlarge.focus());
})();
