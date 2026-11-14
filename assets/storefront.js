/* Shared presentation layer. Existing catalog data and proof renderers remain authoritative. */
(()=>{
'use strict';
/* Refresh shared header stylesheet when a new storefront build is published. */
const cssVersion='larger-collection-images';
for(const link of document.querySelectorAll('link[rel="stylesheet"]')){
 try{const u=new URL(link.href,document.baseURI);if(u.pathname.endsWith('/assets/storefront.css')){u.searchParams.set('v',cssVersion);if(link.href!==u.href)link.href=u.href;}}catch(_e){}
}

const root=new URL('../',document.currentScript.src),url=p=>new URL(p,root).href;
const givingLink=url('giving-back.html');
const memorialPledge='25% of profits from Memorial Merch will be donated to Concerns of Police Survivors (C.O.P.S.).';
const customizationBanner=document.querySelector('#customization-options > div');
if(customizationBanner){
 const teaser=document.createElement('p');
 const heading=document.createElement('strong');
 heading.textContent='Official badge customization coming soon';
 teaser.append(heading,' · Local, county, and state options as agencies approve them.');
 customizationBanner.append(teaser);
}
const givingSummary=document.querySelector('#giving');
if(givingSummary){
 givingSummary.innerHTML='<h2>Giving Back</h2><p>'+memorialPledge+'</p><p><a href="'+givingLink+'">Learn what C.O.P.S. does for survivors</a></p>';
}
for(const paragraph of document.querySelectorAll('#memorial p, .card[data-line="limited"] p')){
 const earlier=paragraph.textContent;
 const marker=earlier.search(/Proceeds from qualifying Limited Edition|Proceeds from qualifying items/i);
 if(marker>=0)paragraph.textContent=earlier.slice(0,marker)+memorialPledge;
}


const memorialGallery=document.querySelector('#memorial .legacy-photo-grid');
if(memorialGallery){
 const sections=document.createElement('div');
 sections.className='aj-memorial-photo-groups';
 function gallery(title,featured=false){
  const section=document.createElement('section');
  section.className='aj-memorial-photo-group';
  const heading=document.createElement('h3');
  heading.textContent=title;
  const grid=document.createElement('div');
  grid.className='legacy-photo-grid'+(featured?' aj-memorial-photo-feature':'');
  section.append(heading,grid);
  sections.append(section);
  return grid;
 }
 const family=gallery('Family, Football & Fitness');
 const service=gallery('Drew’s Service & Remembrance',true);
 const policeWeek=gallery('Police Week & Remembrance');
 for(const [file,title,caption,alt] of [
  ['drew-academy-graduation.webp','Academy Graduation','Drew in uniform on the day he graduated from the academy.','Drew standing in uniform outside on academy graduation day'],
  ['drew-teammate-training.webp','Training Together','Drew training alongside his best friend and teammate.','Drew and his teammate training outdoors'],
  ['drew-idoc-academy-memorial.webp','At the IDOC Memorial','Drew at the Illinois Department of Corrections memorial on academy graduation day.','Drew in uniform at the Illinois Department of Corrections fallen officers memorial'],
  ['faught-mourning-band.webp','Honoring Fallen Officers','A mourning band bearing Drew’s name shows one way the Department and others honor fallen officers.','Illinois Department of Corrections badge with a black mourning band reading Faught']
 ]){
  const figure=document.createElement('figure');
  figure.className='legacy-photo';
  const photo=document.createElement('img');
  photo.src=url('memorial-images/'+file);
  photo.alt=alt;
  photo.loading='lazy';
  photo.decoding='async';
  const text=document.createElement('figcaption');
  const label=document.createElement('strong');
  label.textContent=title;
  text.append(label,caption);
  figure.append(photo,text);
  service.append(figure);
 }
 for(const photo of [...memorialGallery.children]){
  const caption=photo.querySelector('figcaption')?.textContent||'';
  if(/police week|fallen officers|candlelight vigil|washington/i.test(caption))policeWeek.append(photo);
  else if(/Tactical Response Team coworkers/i.test(caption))service.append(photo);
  else family.append(photo);
 }
 memorialGallery.replaceWith(sections);
}

const collections=[['law','Law Enforcement','assets/collection-models/law-enforcement.webp','Honor the commitment. Carry the legacy.','#1769AA'],['doc','Department of Corrections','assets/collection-models/corrections.webp','Strength behind the walls. Honor beyond them.','#D7D9DC'],['first','First Responder','assets/collection-models/first-responders.webp','Fire & Rescue · EMS / Paramedics · Dispatch · Water Rescue','#F47721'],['gym','Gym Attire','assets/collection-models/gym.webp','Built with purpose. Earned with every rep.','#F47721'],['memorial','Memorial','assets/collection-models/memorial.webp','In memory of Andrew John Faught. A legacy that lives on.','#1769AA']];
const link=k=>k==='first'?url('assets/first-responders/index.html'):url('index.html?collection='+k);
/* Remove obsolete header DOM instead of merely hiding it. */
const old=document.querySelector('body>header');
if(old)old.remove();
const legacyHero=document.querySelector('main#top > section.hero');
if(legacyHero)legacyHero.remove();
const homepageChrome=document.getElementById('homepage-chrome');
const chrome=homepageChrome||document.createElement('div');
chrome.className='aj-chrome';
if(!homepageChrome)chrome.innerHTML=`<header class="aj-masthead" style="display:block!important;position:relative!important;width:100%!important;height:auto!important;min-height:0!important;aspect-ratio:auto!important;background:none!important;padding:0!important;overflow:hidden!important"><img src="${url('assets/aj-legacy-header-drew.png')}?v=fcf23d7" alt="AJ Legacy Apparel memorial banner honoring Andrew John Faught" style="display:block!important;width:100%!important;height:auto!important;max-width:100%!important;object-fit:contain!important;position:relative!important;z-index:4!important;filter:none!important;mix-blend-mode:normal!important;mask-image:none!important;-webkit-mask-image:none!important"></header>`;
chrome.insertAdjacentHTML('beforeend',`<nav class="aj-navigation" aria-label="Main navigation"><a href="${url('index.html')}#memorial">Our Story</a><a href="${url('index.html')}#collection-navigation">Collections</a><a href="${url('index.html?collection=limited')}">Limited Edition</a><a href="${url('index.html')}#customization-options">Customization</a><a href="${givingLink}">Giving Back</a><a href="${url('contact.html')}">Contact Us</a><span class="aj-prelaunch">COMING SOON · CHECKOUT DISABLED</span></nav><section class="aj-collection-strip" aria-label="Apparel collections">${collections.map(([k,n,img])=>`<a href="${link(k)}" data-collection="${k}"><img src="${url(img)}" alt="${n} approved group merchandise"><strong>${n}<small>COLLECTION</small></strong></a>`).join('')}</section><section class="aj-collection-banner" aria-label="Selected collection"><div><span>APPAREL WITH PURPOSE</span><h1></h1><p></p></div><img alt=""></section>`);
if(!homepageChrome)document.body.prepend(chrome);
/* Only the approved single banner is permitted. Reset all legacy header effects. */
const approvedHeader=chrome.querySelector('.aj-masthead');
const approvedImage=approvedHeader?.querySelector('img');
if(approvedHeader&&approvedImage){
 approvedHeader.style.setProperty('background','none','important');
 approvedHeader.style.setProperty('filter','none','important');
 approvedHeader.style.setProperty('mix-blend-mode','normal','important');
 approvedHeader.style.setProperty('mask','none','important');
 approvedHeader.style.setProperty('-webkit-mask','none','important');
 approvedImage.style.setProperty('filter','none','important');
 approvedImage.style.setProperty('opacity','1','important');
 approvedImage.style.setProperty('mix-blend-mode','normal','important');
 approvedImage.style.setProperty('mask','none','important');
 approvedImage.style.setProperty('-webkit-mask','none','important');
 approvedImage.style.setProperty('clip-path','none','important');
}

chrome.querySelector('.aj-collection-strip').id='collection-navigation';
document.querySelectorAll('a[href]').forEach(anchor=>{if(anchor.hash==='#collections')anchor.hash='collection-navigation';if(anchor.hash==='#giving')anchor.href=givingLink});
// Restore section navigation after the legacy renderer resets the scroll position.
const sectionIds=new Set(['memorial','collection-navigation','customization-options','giving']);
function scrollToSection(){
 const id=location.hash.slice(1)==='collections'?'collection-navigation':location.hash.slice(1);
 if(!sectionIds.has(id))return;
 const target=document.getElementById(id);if(!target)return;
 target.scrollIntoView({block:'start',behavior:'instant'});
}
chrome.querySelector('.aj-navigation').addEventListener('click',event=>{
 const anchor=event.target.closest('a');if(!anchor)return;
 const destination=new URL(anchor.href);
 if(destination.pathname===location.pathname&&destination.search===location.search&&sectionIds.has(destination.hash.slice(1))){
  event.preventDefault();history.pushState(null,'',destination.href);scrollToSection();
 }
});
window.addEventListener('hashchange',scrollToSection);
window.addEventListener('load',scrollToSection);
const banner=chrome.querySelector('.aj-collection-banner');
const groupStrip=chrome.querySelector('.aj-collection-strip');
const groupsBack=document.createElement('a');
groupsBack.className='aj-groups-back';
groupsBack.href=url('index.html#collection-navigation');
groupsBack.textContent='← Back to groups';
groupsBack.hidden=true;
banner.before(groupsBack);
const catalogNotice=document.createElement('p');
catalogNotice.className='aj-prelaunch';
catalogNotice.hidden=true;
banner.after(catalogNotice);
function showCatalogNotice(collection){
 catalogNotice.hidden=!collection;
 catalogNotice.textContent=collection==='law'
  ?'Prelaunch catalog · Ordering is closed. The badge and handcuffs are display props.'
  :'Prelaunch catalog · Ordering is closed. Choose a product to see the design and garment options.';
}

function setCollection(k){groupStrip.hidden=Boolean(k);groupsBack.hidden=!k;showCatalogNotice(k);const c=collections.find(c=>c[0]===k)||(k==='limited'?['limited','Limited Edition','assets/events/legacy-strength-2027.png','Legacy of Strength · February 20, 2027','#1769AA']:null);banner.hidden=!c;if(!c)return;banner.style.setProperty('--collection-accent',c[4]);banner.querySelector('h1').textContent=c[1]+' Collection';banner.querySelector('p').textContent=c[3];banner.querySelector('img').src=url(c[2]);banner.querySelector('img').alt=c[1]+' merchandise';chrome.querySelectorAll('[data-collection]').forEach(a=>{a.classList.toggle('selected',a.dataset.collection===k);if(a.dataset.collection===k)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});}
function disabledCheckout(parent){if(parent.querySelector('.aj-checkout'))return;const box=document.createElement('div');box.className='aj-checkout';box.innerHTML='<p>COMING SOON</p><button type="button" disabled>Checkout unavailable during prelaunch</button><small>Family & supplier review · No orders or payments</small>';parent.append(box)}
const boardMerch={
 law:[
  ["shield-hoodie", "AJ Shield Hoodie"],
  ["vertical-flag-hoodie", "Vertical Thin Blue Line Flag Hoodie"],
  ["badge-story", "Behind Every Badge Training Tee"],
  ["honor-service-sacrifice", "Honor Service Sacrifice Tee"],
  ["peacemakers-tee", "Blessed Are the Peacemakers Gray Tee"],
  ["blue-line-quarter-zip", "Navy Thin Blue Line Quarter-Zip"],
  ["service-above-self", "Service Above Self Tee"],
  ["law-enforcement-hoodie", "Law Enforcement Wordmark Hoodie"],
  ["shield-joggers", "AJ Shield Joggers"],
  ["shield-shorts", "AJ Shield Shorts"],
  ["shield-trucker", "AJ Shield Trucker Cap"],
  ["thin-blue-line-cap", "Thin Blue Line Cap"],
  ["camo-shield-cap", "Camo AJ Shield Cap"],
 ],
 doc:[
  ["corrections-flag-hoodie", "Vertical Corrections Flag Hoodie"],
  ["trt-tee", "Corrections Tactical Response Team Tee"],
  ["correctional-officer-tee", "Correctional Officer Gray Tee"],
  ["doc-shield-hoodie", "DOC Shield Hoodie"],
  ["orange-line-flag-top", "TRT — Thin Orange Line Flag Tee"],
  ["doc-joggers", "DOC Shield Joggers"],
  ["doc-shield-cap", "AJ Shield Corrections Cap"],
  ["trt-cap", "TRT Cap"],
  ["doc-tumbler", "AJ Corrections Tumbler"],
  ["orange-line-patch", "Thin Orange Line Flag Patch"],
 ],
 limited:[
  ["their-watch", "Their Watch Has Ended Memorial Tee"],
  ["memorial-shield-hoodie", "Memorial AJ Shield Hoodie"],
  ["forever-27", "Forever 27 — Andrew John Faught Gray Memorial Tee"],
  ["psalm-34", "Psalm 34:18 Memorial Hoodie"],
  ["memorial-patch-cap", "Memorial Leather Patch Cap"],
  ["memorial-line-cap", "Memorial Thin Blue Line Cap"],
  ["memorial-shield-cap", "Memorial AJ Shield Cap"],
  ["memorial-tumbler", "Memorial AJ Shield Tumbler"],
  ["memorial-plaque", "Courage Service Sacrifice Legacy Plaque"],
  ["memorial-chest-logo-tee", "Memorial AJ Legacy Chest Logo Tee"],
 ],
 gym:[
  ["gym-chest-logo-tee","AJ Legacy Black Chest Logo Training Tee"],
 ],
 first:[
  ["responder-cap", "AJ Legacy First Responder Cap"],
  ["fire-cap", "Fire & Rescue Cap"],
  ["ems-cap", "EMS / Paramedic Cap"],
  ["dispatch-cap", "911 Dispatch Cap"],
 ],
};
const memorialEow=new Set(['their-watch','memorial-shield-hoodie','psalm-34','memorial-chest-logo-tee','gym-chest-logo-tee']);
const boardBack=new Set(['vertical-flag-hoodie','corrections-flag-hoodie','their-watch','psalm-34']);
const boardImage=id=>url('assets/merch-individual/'+id+'.webp');
const stripeColors={
 'Blue':'#1769aa','Silver / gray':'#a6a8ab','Orange':'#f47721','Red':'#c8242b',
 'Green':'#39844c','Purple':'#8548a9','White':'#f4f4f4','Gold':'#e3b126','Monochrome':'#737373'
};
const boardStripes={
 'orange-line-patch':['orange','y',[[.14,.36,.72,.24]]],
 'orange-line-flag-top':['orange','x',[[.55,.16,.057,.66]]],
 'corrections-flag-hoodie':['orange','x',[[.54,.20,.19,.60]]],
 'vertical-flag-hoodie':['blue','x',[[.31,.22,.39,.62]]],
 'honor-service-sacrifice':['blue','y',[[.24,.22,.50,.29]]],
 'peacemakers-tee':['blue','x',[[.22,.24,.33,.65],[.01,.30,.19,.24]]],
 'blue-line-quarter-zip':['blue','y',[[.53,.21,.24,.19]]],
 'thin-blue-line-cap':['blue','y',[[.23,.30,.53,.36]]],
 'memorial-line-cap':['blue','y',[[.12,.10,.66,.58]]],
 'their-watch':['blue','x',[[.34,.17,.18,.64]]],
 'memorial-shield-hoodie':['blue','y',[[.015,.30,.18,.25]]],
 'correctional-officer-tee':['orange','y',[[.13,.28,.19,.24]]]
};

function boardControls(item,photo,form){
 const id=item.img.slice('board-merch-'.length);
 const stripe=boardStripes[id];
 const trt=id==='trt-tee'||id==='orange-line-flag-top';
 if(!stripe&&!trt)return;
 const canvas=document.createElement('canvas');
 canvas.id='livePreview';
 canvas.setAttribute('aria-label',item.title+' — live preview');
 photo.after(canvas);
 photo.hidden=true;
 let select;
 if(stripe){
  const label=document.createElement('label');
  label.textContent='Thin-line flag color';
  select=document.createElement('select');
  select.id='flag';
  for(const name of Object.keys(stripeColors))select.add(new Option(name,name));
  select.value=stripe[0]==='orange'?'Orange':'Blue';
  label.append(select);
  form.append(label);
 }
 let personal;
 if(trt){
  const label=document.createElement('label');
  label.textContent='Name or unit';
  personal=document.createElement('input');
  personal.id='trt-personalization';
  personal.maxLength=24;
  label.append(personal);
  form.append(label);
 }
 const source=new Image();
 function draw(){
  if(!source.naturalWidth)return;
  canvas.width=source.naturalWidth;
  canvas.height=source.naturalHeight;
  const ctx=canvas.getContext('2d',{willReadFrequently:true});
  ctx.drawImage(source,0,0);
  if(stripe&&select.value.toLowerCase()!==stripe[0])window.AJPreviewStripes.paint(ctx,stripe,[stripeColors[select.value]]);
  canvas.dataset.personalizationSource='garment';
  if(personal?.value.trim()){
   ctx.font='700 '+Math.round(canvas.width*.019)+'px system-ui';
   ctx.fillStyle='#fff';
   ctx.textAlign='center';
   ctx.fillText(personal.value.trim().toUpperCase(),canvas.width*.69,canvas.height*.17,canvas.width*.15);
  }
 }
 source.onload=draw;
 source.src=photo.src;
 select?.addEventListener('change',draw);
 personal?.addEventListener('input',draw);
 document.addEventListener('aj-studio-merch-ready',()=>{
  const cutout=window.AJStudioMerch.source(source.src);
  if(cutout)source.src=cutout;
 },{once:true});
 return canvas;
}

const boardFamilies={
 'gym-chest-logo-tee':{title:'AJ Legacy Shield Chest Logo Tee',label:'T-shirt style',options:[['gym-chest-logo-tee','Training tee'],['memorial-chest-logo-tee','Classic tee']]},
 'shield-joggers':{title:'AJ Shield Bottoms',label:'Garment style',options:[['shield-joggers','Joggers'],['shield-shorts','Shorts']]},
 'shield-trucker':{title:'AJ Shield Cap',label:'Cap style',options:[['shield-trucker','Black trucker'],['camo-shield-cap','Camo']]},
 'memorial-shield-cap':{title:'Memorial AJ Shield Cap',label:'Cap style',options:[['memorial-shield-cap','Black embroidered'],['memorial-patch-cap','Gray leather patch']]},
};

function merchTile(title,source,href){
 const tile=document.createElement('a');
 tile.className='tile';tile.href=href;
 const image=document.createElement('img');
 image.src=source;image.alt=title;image.loading='lazy';
 const heading=document.createElement('h3');heading.textContent=title;
 tile.append(image,heading);
 return tile;
}
if(window.AJStore){
 document.body.classList.add('aj-store');
 document.getElementById('back-lines').textContent='← Back to collections';
 const store=window.AJStore,custom=document.querySelector('.customize-screen'),grid=document.getElementById('product-grid');
 const params=new URLSearchParams(location.search),key=params.get('collection')||params.get('line'),actual=key==='memorial'?'limited':key;
 const sub=params.get('subline')||params.get('sub');
 const collectionURL=(k,subline)=>url('index.html?collection='+encodeURIComponent(k)+(subline?'&subline='+encodeURIComponent(subline):''));
 // Each step has its own address and a normal browser navigation.
 document.querySelectorAll('[data-open]').forEach(button=>button.addEventListener('click',event=>{event.stopImmediatePropagation();location.assign(collectionURL(button.dataset.open))},true));
 document.querySelectorAll('#cards .card').forEach(card=>{card.style.cursor='pointer';card.addEventListener('click',event=>{if(event.target.closest('a,button'))return;location.assign(card.dataset.line==='first'?link('first'):collectionURL(card.dataset.line))})});
 // Append the selected designs so existing product URLs retain their indices.
 if(actual==='gym'){
  const selectedGymDesigns=[
   ['gym-01.jpg','Sun Warrior — Bigger Than the Sun'],
   ['gym-02.jpg','Eclipse Deadlift — Bigger Than the Sun'],
   ['gym-03.jpg','Cane Corso — Bigger Than the Sun'],
   ['gym-04.jpg','Pit Bull — Built for Strength'],
   ['gym-05.jpg','Cane Corso — Discipline Builds Beasts'],
   ['gym-06.jpg','Pit Bull — Loyalty Builds Strength'],
   ['gym-07-quote-proof.svg','Mind Over Body — Andrew Faught'],
  ];
  for(const [file,title] of selectedGymDesigns){
   const img='selected-'+file.split('.')[0];
   const quoteDesign=file.endsWith('.svg');
   store.registerArtwork(img,url('assets/gym-selected/'+file));
   store.lines.gym.push({
    img,title,kind:'shirt',flag:'none',concept:true,quoteDesign,
    verse:quoteDesign?'Do the things you don’t want to do to show your body that your mind is the boss.':'',
    detail:quoteDesign?'Drew’s words on training and discipline.':'Selected Gym Attire artwork.',
   });
  }
 }
 if(store.lines[actual]){
  const garments=window.AJGarments;
  for(const style of garments.branded){
   const img='aj-'+garments.styles[style].file;
   store.registerArtwork(img,garments.image(style,'front',true));
   store.lines[actual].push({img,title:'AJ Legacy '+style,kind:'shirt',style,garmentGroup:'logo',flag:'none'});
  }
  if(actual==='gym'){
   for(const style of garments.bottoms){
    const img='aj-'+garments.styles[style].file;
    store.registerArtwork(img,garments.image(style,'front',true));
    store.lines.gym.push({img,title:'AJ Legacy '+style,kind:'shirt',style,garmentGroup:'lower',flag:'none',logoOnly:true});
   }
  }
 }
 if(actual==='gym'){
  const boardProducts=[
   ['discipline-builds-freedom','Discipline Builds Freedom Hoodie','Hoodie','Back'],
   ['iron-sharpens-iron','Iron Sharpens Iron Training Tee','T-shirt','Front'],
   ['persevere','Persevere Hoodie','Hoodie','Front'],
   ['strength-through-christ','Strength Through Christ Training Tee','T-shirt','Back'],
   ['aj-legacy-training-tee','AJ Legacy Training Tee','T-shirt','Front'],
   ['aj-legacy-training-cap','AJ Legacy Training Cap'],
   ['thin-blue-line-training-cap','Thin Blue Line Training Cap'],
   ['aj-legacy-shaker','AJ Legacy Shaker Bottle'],
  ];
  for(const [key,title,style,side] of boardProducts){
   const img='selected-gym-board-'+key;
   store.registerArtwork(img,url('assets/gym-board/'+key+'.webp'));
   store.lines.gym.push({img,title,style,side,flag:'none',concept:Boolean(style),accessory:!style,
    detail:style?'Individual design from the Gym Attire collection banner.':'Individual detail from the Gym Attire collection banner.'});
  }
 }
 for(const [id,title] of boardMerch[actual]||[]){
  const img='board-merch-'+id;
  store.registerArtwork(img,boardImage(id));
  store.lines[actual].push({img,title,accessory:true,garmentGroup:'board',boardMerch:true,detail:'Individual merchandise preview from the collection image.'});
 }
 if(actual==='doc'){
  const items=store.lines.doc;
  const [department,matthew,,headwear]=items;
  const splitLine=(family,match,title)=>{
   const options=family.variations.filter(match);
   if(!options.length)return;
   family.variations=family.variations.filter(option=>!match(option));
   items.push({...options[0],title,variations:options.length>1?options:undefined});
  };
  splitLine(matthew,item=>item.img.startsWith('shirt2_')&&item.flag==='orange','TRT — Matthew 5:9');
  matthew.title='DOC — Matthew 5:9';
  matthew.variations=undefined;
  splitLine(department,item=>item.img.startsWith('shirt3_'),'Juvenile Detention — Department Flag');
  splitLine(department,item=>item.img.startsWith('shirt4_'),'Rehabilitation / Reentry — Department Flag');
  splitLine(headwear,item=>item.img==='hatdept2','TRT — Headwear');
  splitLine(headwear,item=>item.img==='hatdept3','Juvenile Detention — Headwear');
  splitLine(headwear,item=>item.img==='hatdept4','Rehabilitation / Reentry — Headwear');
 }
 if(actual&&store.lines[actual]){
  store.openLine(actual);setCollection(key);document.body.dataset.activeCollection=key;
  // The legacy renderer updates hashes. Keep the explicit route authoritative.
  history.replaceState(null,'',url('index.html?'+params.toString()));
  const entries=store.lines[actual];
  const tiles=[...grid.children];
  const variantIds=new Set(Object.values(boardFamilies).flatMap(family=>family.options.slice(1).map(([id])=>id)));
  for(const [index,item] of entries.entries()){
   const tile=tiles[index],image=tile.querySelector('img');
   tile.dataset.productIndex=index;
   const boardId=item.boardMerch?item.img.slice('board-merch-'.length):null;
   const family=boardFamilies[boardId];
   if(item.img.startsWith('selected-gym-')&&!item.accessory)image.src=boardImage(item.img);
   if(family)tile.querySelector('strong').textContent=family.title;
   if(item.garmentGroup==='logo'&&item.style==='Crewneck')tile.querySelector('strong').textContent='AJ Legacy Shield Tops';
   if(item.garmentGroup==='lower'&&item.style==='Shorts')tile.querySelector('strong').textContent='AJ Legacy Shield Bottoms';
   if(item.flag==='orange'&&actual==='doc'&&!item.boardMerch){
    // The main DOC thumbnail renderer defaults to silver. The source proof carries the TRT orange stripe.
    const unitImage=image.cloneNode(false);
    unitImage.src=assets[item.img];
    image.replaceWith(unitImage);
   }
   if(boardId==='trt-cap'||variantIds.has(boardId)||item.garmentGroup==='logo'&&item.style!=='Crewneck'||item.garmentGroup==='lower'&&item.style!=='Shorts')tile.remove();
  }
  if(actual==='limited'&&!params.has('product')){
   const index=entries.findIndex(item=>item.img==='board-merch-forever-27');
   if(index!==-1){
    grid.prepend(tiles[index]);
    const donation=document.createElement('p');
   donation.className='aj-memorial-pledge';
   donation.textContent=memorialPledge+' ';
   const read=document.createElement('a');
   read.href=givingLink;
   read.textContent='Giving Back';
   donation.append(read);
   catalogNotice.after(donation);
   const featured=document.createElement('a');
    featured.href=collectionURL(key,sub)+'&product='+index;
    featured.textContent='View the gray Forever 27 Memorial Tee';
    featured.style.color='inherit';
    catalogNotice.append(' ',featured);
   }
  }
  if(params.has('product')&&Number.isInteger(Number(params.get('product')))&&entries[Number(params.get('product'))]){
   const index=Number(params.get('product')),item=entries[index];
   if(item.accessory){
    const photo=document.createElement('img');
    photo.src=assets[item.img];
    photo.alt=item.title;
    document.getElementById('selected-product-image').replaceChildren(photo);
    const boardId=item.boardMerch?item.img.slice('board-merch-'.length):null;
    const family=Object.values(boardFamilies).find(group=>group.options.some(([id])=>id===boardId));
    const form=document.getElementById('custom-form');
    document.getElementById('flow-product').textContent=family?.title||item.title;
    form.textContent=item.detail;
    if(item.boardMerch){
     const live=boardControls(item,photo,form);
     if(boardBack.has(boardId)){
      const style=/hoodie/i.test(item.title)?'Hoodie':'T-shirt';
      const front=document.createElement('img');
      front.src=window.AJGarments.image(style,'front',true);
      front.alt=item.title+' — front with approved AJ shield on the left chest';
      photo.alt=item.title+' — back design';
      (live||photo).after(front);
     }
     if(/tee|hoodie|quarter-zip/i.test(item.title)){
      loadPresentation('assets/service-personalization.js?v=8',()=>{
       const style=/hoodie/i.test(item.title)?'Hoodie':/quarter-zip/i.test(item.title)?'Half-zip':'T-shirt';
       window.AJServicePersonalization.mount(form,{
        department:['law','doc','gym'].includes(actual),
        badge:['law','doc'].includes(actual),
        eow:()=>actual==='limited'?memorialEow.has(boardId):['law','doc'].includes(actual)&&Boolean(boardStripes[boardId]),
        style:()=>style, stripePalette:stripeColors, preview:live||photo, side:()=>boardBack.has(boardId)?'Back':'Front'
       });
      });
     }
    }
    if(family){
     const label=document.createElement('label');
     label.textContent=family.label;
     const select=document.createElement('select');
     for(const [id,name] of family.options)select.add(new Option(name,id));
     select.value=boardId;
     select.addEventListener('change',()=>{
      photo.src=boardImage(select.value);
      photo.alt=family.title+' — '+select.selectedOptions[0].text;
     });
     label.append(select);
     form.prepend(label);
    }
    store.showPage('customize');
   }else{
    store.openItem(item,index);
    if(item.kind!=='hat'&&item.garmentGroup!=='lower'&&item.img!=='style1'){
     loadPresentation('assets/service-personalization.js?v=8',()=>{
      window.AJServicePersonalization.connectProduct(custom, actual);
     });
    }
    if(item.img==='selected-gym-board-aj-legacy-training-tee'){
     const color=document.querySelector('#custom-form #color');
     if(color){color.value='Gray';color.dispatchEvent(new Event('change',{bubbles:true}));}
    }

    if(item.side==='Back'){
     const placement=document.getElementById('design-side');
     placement.value=item.side;
     placement.dispatchEvent(new Event('change',{bubbles:true}));
    }
   }
   // The shared placement studio does not have these artwork files in its design picker.
   if(item.img.startsWith('selected-gym-')){
    const studioLink=document.getElementById('interactive-studio-link');
    if(studioLink)studioLink.hidden=true;
   }
   const shell=document.createElement('div');shell.className='aj-product-workspace aj-dedicated-customizer';
   const center=document.createElement('section');center.className='aj-preview-column';center.setAttribute('aria-label','Garment preview');
   const controls=document.createElement('section');controls.className='aj-controls-column';controls.setAttribute('aria-label','Customization options');
   for(const id of ['garment-preview','artwork-reference']){const element=document.getElementById(id);if(element)center.append(element)}
   if(item.img.startsWith('selected-gym-')&&!item.accessory){
    const example=document.createElement('figure');
    const photo=document.createElement('img');
    photo.src=boardImage(item.img);
    photo.alt=item.title+' on its original garment';
    photo.style.maxWidth='100%';
    const caption=document.createElement('figcaption');
    caption.textContent='Original garment and print placement';
    example.append(photo,caption);
    center.append(example);
   }

   if(!center.children.length)center.append(document.getElementById('selected-product-image'));
   controls.append(document.getElementById('flow-product'),document.getElementById('custom-form'));disabledCheckout(controls);
   shell.append(center,controls);custom.append(shell);
   history.replaceState(null,'',url('index.html?'+params.toString()));
  }else{
   for(const [index,item] of entries.entries()){
    if(item.accessory)tiles[index].querySelector('small').textContent='View product';
   }
   grid.addEventListener('click',event=>{const tile=event.target.closest('.product-tile');if(!tile)return;event.stopImmediatePropagation();const index=tile.dataset.productIndex;location.assign(collectionURL(key,sub)+'&product='+index)},true);
   if(actual==='law'||actual==='doc'){
    const groups=document.createElement('nav');groups.className='aj-subline-links';groups.setAttribute('aria-label','Choose a sub-line');
    const options=actual==='law'?[['all','All Law Enforcement designs'],['k9','K9 / Canine']]:[['all','All DOC designs'],['trt','Tactical Response Team (TRT)']];
    for(const [id,label] of options){const anchor=document.createElement('a');anchor.textContent=label;anchor.href=id==='k9'?url('k9-collection.html'):collectionURL(key,id==='all'?null:id);groups.append(anchor)}
    grid.before(groups);
    if(sub==='trt'){
     groups.replaceChildren();
     const parent=document.createElement('a');
     parent.href=collectionURL(key);
     parent.textContent='← Back to DOC groups';
     groups.append(parent);
     for(const [index,tile] of tiles.entries())tile.hidden=!/TRT|tactical response/i.test(entries[index].title);
    }
   }
  }
 }else{store.showPage('lines');setCollection(null)}
 document.getElementById('back-products').addEventListener('click',event=>{event.stopImmediatePropagation();location.assign(collectionURL(key,sub))},true);
 document.getElementById('back-lines').addEventListener('click',event=>{event.stopImmediatePropagation();location.assign(url('index.html#collections'))},true);

}else{
 document.body.classList.add('aj-service-store');const k=location.pathname.includes('first-responders')?'first':'law';setCollection(k);
 const wrap=document.querySelector('main.wrap');const grid=document.getElementById('grid'),preview=document.querySelector('section.preview');
 if(wrap&&grid&&preview){
  const params=new URLSearchParams(location.search),requested=params.get('product');
  const category=params.get('category')||(k==='first'?'fire':'k9');
  const original=document.querySelector('body>img.hero');if(original)original.hidden=true;
  const tabs=document.getElementById('tabs');
  if(k==='first'&&params.has('category')&&!requested&&tabs){
   tabs.hidden=true;
   const parent=document.createElement('a');
   parent.className='aj-related';
   parent.href=location.pathname;
   parent.textContent='← Back to First Responder groups';
   tabs.after(parent);
  }
  // Capture before inline legacy handlers so category and product choices open a new screen.
  if(tabs)tabs.addEventListener('click',event=>{const button=event.target.closest('button');if(!button)return;event.stopImmediatePropagation();const code=button.getAttribute('onclick')||'';const match=code.match(/group='([^']+)'/);if(match)location.assign(location.pathname+'?category='+encodeURIComponent(match[1]))},true);
  grid.addEventListener('click',event=>{const tile=event.target.closest('.tile');if(!tile)return;const button=tile.querySelector('button');if(!button)return;event.stopImmediatePropagation();const match=(button.getAttribute('onclick')||'').match(/item='([^']+)'/);if(match)location.assign(location.pathname+'?category='+encodeURIComponent(category)+'&product='+encodeURIComponent(match[1]))},true);
  if(k==='first'&&params.has('merch')){
   const entry=boardMerch.first.find(([id])=>id===params.get('merch'));
   if(entry){
    const [id,title]=entry;
    const product=document.createElement('section');
    product.className='aj-individual-designs';
    const back=document.createElement('a');back.href=location.pathname+'?category='+encodeURIComponent(category);back.textContent='← Back to individual designs';
    const heading=document.createElement('h1');heading.textContent=title;
    const image=document.createElement('img');image.src=boardImage(id);image.alt=title;image.style.maxWidth='100%';
    product.append(back,heading,image);
    wrap.replaceChildren(product);
    disabledCheckout(product);
    return;
   }
  }
  if(requested){
   const models=wrap.querySelector('.modelgrid');if(models){models.hidden=true;if(models.previousElementSibling?.tagName==='H2')models.previousElementSibling.hidden=true;if(models.nextElementSibling)models.nextElementSibling.hidden=true}
   const button=[...grid.querySelectorAll('button')].find(button=>(button.getAttribute('onclick')||'').includes("item='"+requested+"'"));
   if(button){button.onclick();if(k==='first'&&params.get('garment')==='hoodie')window.setGarment('hoodie');preview.hidden=false;grid.hidden=true;if(tabs)tabs.hidden=true;
    const back=document.createElement('a');back.className='aj-related';back.href=location.pathname+'?category='+encodeURIComponent(category);back.textContent='← Back to individual designs';wrap.prepend(back);
    preview.classList.add('aj-service-preview','aj-dedicated-service');disabledCheckout(preview.lastElementChild);
    if(k==='first'){
     const styles=document.getElementById('types');
     const style=()=>{
      const selected=document.getElementById('photo-style')?.value;
      return selected&&selected!=='Collection default'?selected:
       styles?.querySelector('[aria-pressed="true"]')?.textContent==='Hoodie'?'Hoodie':'T-shirt';
     };
     const settings=preview.querySelector('.customizer');
     window.firstResponderPersonalization=window.AJServicePersonalization.mount(settings,{
      department:true, badge:true, eow:()=>Boolean(window.AJPreviewStripes.responder[requested.replace(/-(tee|hoodie)$/,'')]),
      style, preview:document.getElementById('livePreview'), update:()=>window.refreshSpec()
     });
     new MutationObserver(window.firstResponderPersonalization.draw).observe(styles,{childList:true,subtree:true,attributes:true});
     const agency=settings.querySelector('#agency');
     agency.hidden=true;
     settings.querySelector('label[for="agency"]').hidden=true;
    }
   }else preview.hidden=true;
  }else{
   preview.hidden=true;grid.classList.add('aj-individual-designs');
   if(k==='first'){
    const capId={fire:'fire-cap',ems:'ems-cap',dispatch:'dispatch-cap'}[category];
    for(const [id,title] of boardMerch.first.filter(([id])=>id===capId||id==='responder-cap')){
     grid.append(merchTile(title,boardImage(id),location.pathname+'?category='+encodeURIComponent(category)+'&merch='+id));
    }
   }
  }
 }
 const breedLayout=document.querySelector('.layout');
 if(document.getElementById('breed')&&breedLayout)breedLayout.classList.add('aj-dedicated-breed');

 const form=document.querySelector('.form')||document.querySelector('.customizer');if(form&&!document.querySelector('.aj-checkout'))disabledCheckout(form);
}
function loadPresentation(file,ready){
 const script=document.createElement('script');
 script.src=url(file);
 if(ready)script.addEventListener('load',ready,{once:true});
 document.head.append(script);
}

loadPresentation('assets/studio-merch.js?v=3',()=>{
 const studio=window.AJStudioMerch;
 document.dispatchEvent(new Event('aj-studio-merch-ready'));
 const store=window.AJStore;
 if(store){
  const line=store.current;
  for(const tile of document.querySelectorAll('#product-grid .product-tile')){
   const item=store.lines[line][Number(tile.dataset.productIndex)];
   const original=tile.querySelector('img');
   if(!item||!original)continue;
   const source=item.img.startsWith('selected-gym-')&&!item.accessory?boardImage(item.img):assets[item.img];
   const cutout=studio.source(source,item.img);
   if(!cutout)continue;
   const image=original.cloneNode(false);
   image.classList.add('aj-studio-merch');
   image.src=cutout;
   original.replaceWith(image);
   const stripes=window.AJPreviewStripes?.service[item.img];
   if(stripes?.length){
    const proof=new Image();
    proof.onload=()=>{
     const canvas=document.createElement('canvas');
     canvas.width=proof.naturalWidth;
     canvas.height=proof.naturalHeight;
     const context=canvas.getContext('2d',{willReadFrequently:true});
     context.drawImage(proof,0,0);
     const color=line==='law'?stripeColors.Blue:stripeColors['Silver / gray'];
     for(const stripe of stripes)window.AJPreviewStripes.paint(context,stripe,[color]);
     image.src=canvas.toDataURL('image/png');
    };
    proof.src=cutout;
   }
  }
  const detail=document.querySelector('.aj-preview-column');
  if(detail)studio.watch(detail,'#selected-product-image img, figure img');
 }else{
  const main=document.querySelector('main');
  if(main)studio.watch(main,'#grid .tile img, #k9-products .tile img, #individual-proof, .aj-dedicated-service #preview, .aj-dedicated-breed #preview, .aj-individual-designs > img');
 }
 loadPresentation('assets/merch-preview.js?v=2');
});
requestAnimationFrame(scrollToSection);
})();
