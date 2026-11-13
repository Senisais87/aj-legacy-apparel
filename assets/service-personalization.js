(() => {
 const assetRoot = new URL('./', document.currentScript.src);
 const scripts = new Map();
 function loadScript(file) {
  if (!scripts.has(file)) scripts.set(file, new Promise((resolve, reject) => {
   const script = document.createElement('script');
   script.src = new URL(file, assetRoot).href;
   script.onload = resolve;
   script.onerror = reject;
   document.head.append(script);
  }));
  return scripts.get(file);
 }
 // Add a badge only after confirming written permission for previews and printed apparel.
 const approvedBadges = [];
 const chest = ['Left chest', 'Right chest'];
 const shoulders = 'Across back shoulders';
 const spine = 'Down back spine';
 const hems = ['Bottom front', 'Bottom back'];
 const locations = {
  Name: [...chest, shoulders, spine],
  Rank: [...chest, shoulders, spine, ...hems],
  'EOW date': [...chest, shoulders, ...hems],
  'Facility / Department': [...chest, shoulders, ...hems],
  Unit: [...chest, shoulders, spine],
  'County / City': [...chest, shoulders, ...hems],
 };
 const boxes = {
  'Left chest': [0, .64, .30, .13],
  'Right chest': [0, .36, .30, .13],
  [shoulders]: [1, .50, .32, .33],
  [spine]: [1, .50, .55, .26],
  'Bottom front': [0, .50, .77, .32],
  'Bottom back': [1, .50, .77, .32],
 };
 const supportedStyles = ['T-shirt', 'Hoodie'];
 // Coordinates are relative to each garment face. Reserve the catalog logo,
 // the model proof's chest logo, and the fixed rear-neck logo area.
 function logoZones(style, engine, back) {
  if (back) return [[.43,.13,.14,.16]];
  if (engine === 'live-garment-personalization') {
   return [style === 'Tank Top' ? [.54,.28,.12,.14] : [.50,.19,.14,.13]];
  }
  const [x,y,width] = window.AJGarments.styles[style]?.logo || [.61,.32,.12];
  return [[x-width/2-.02,y-width/2-.02,width+.04,width+.04]];
 }
 function clearOfLogo(rect, zones) {
  const [x,y,w,h] = rect;
  const gap = .012;
  return zones.every(([lx,ly,lw,lh])=>x+w+gap<lx || x-gap>lx+lw || y+h+gap<ly || y-gap>ly+lh);
 }
 function logoSafeY(x, y, width, height, zones) {
  for (let offset = 0; offset <= .13; offset += .015) {
   const next = y+offset;
   if (clearOfLogo([x-width/2,next-height/2,width,height],zones)) return next;
  }
  return null;
 }
 function paint(context, marks, surfaces, zones) {
  const count = {}, previousY = {};
  for (const {label, value, placement} of marks) {
   const [side, x, y, width] = boxes[placement];
   const surface = surfaces[side];
   if (!surface) continue;
   const [left, top, widthPx, height] = surface;
   const row = count[placement] || 0;
   count[placement] = row + 1;
   const vertical = placement === spine;
   const center = x + (vertical ? row * .025 : 0);
   const start = vertical ? y : Math.max(y, (previousY[placement] ?? 0) + .027);
   const centerY = logoSafeY(center, start, vertical ? .026 : width, vertical ? width : .026, zones[side]);
   if (centerY === null) continue;
   previousY[placement] = centerY;
   context.save();
   context.translate(left + center * widthPx, top + centerY * height);
   if (vertical) context.rotate(Math.PI / 2);
   context.font = '700 ' + Math.max(8, Math.round(Math.min(widthPx, height) * .020)) + 'px system-ui';
   context.textAlign = 'center';
   context.textBaseline = 'middle';
   context.strokeStyle = '#151515';
   context.fillStyle = '#fff';
   context.lineWidth = 2;
   const text = label === 'EOW date' ? 'EOW ' + value : value;
   context.strokeText(text, 0, 0, width * (vertical ? height : widthPx));
   context.fillText(text, 0, 0, width * (vertical ? height : widthPx));
   context.restore();
  }
 }
 function mount(form, {department, eow = () => false, style, preview, side = () => 'Front',
   paired = () => false, badge, update, onProof}) {
  const group = document.createElement('fieldset');
  group.className = 'aj-personalization-fields';
  const legend = document.createElement('legend');
  legend.textContent = 'Garment personalization';
  const logoNote = document.createElement('p');
  logoNote.className = 'note';
  logoNote.textContent = 'AJ Legacy logo placement is fixed. Personalization is positioned clear of the logo.';
  group.append(legend, logoNote);
  const fields = ['Name', 'Rank', ...(department ? ['Facility / Department'] : []), ...(badge ? ['Unit'] : []), 'EOW date'].map(label => {
   const row = document.createElement('div');
   const caption = document.createElement('label');
   caption.textContent = label;
   const input = document.createElement('input');
   input.type = label === 'EOW date' ? 'date' : 'text';
   input.maxLength = 48;
   if (input.type === 'text') input.placeholder = label === 'Facility / Department' && badge ?
    'Full department name or abbreviation' : 'Optional';
   caption.append(input);
   const position = document.createElement('label');
   position.textContent = label + ' placement';
   const select = document.createElement('select');
   for (const location of locations[label]) select.add(new Option(location));
   select.value = label === 'Rank' ? 'Right chest' : label === 'EOW date' ? 'Bottom back' :
    label === 'Facility / Department' ? shoulders : 'Left chest';
   position.append(select);
   row.append(caption, position);
   group.append(row);
   return {label, row, input, select};
  });
  const geography = badge ? addGeography(group, draw) : null;
  const review = form.querySelector('.continue-customize');
  form.insertBefore(group, review || null);
  const proof = document.createElement('figure');
  proof.className = 'aj-personalization-proof';
  const caption = document.createElement('figcaption');
  caption.textContent = 'Customized product preview';
  const canvas = document.createElement('canvas');
  canvas.width = 840;
  canvas.height = 446;
  canvas.setAttribute('role', 'img');
  proof.append(caption, canvas);
  proof.hidden = true;
  preview.after(proof);
  const images = new Map();
  function image(path) {
   if (!images.has(path)) {
    const img = new Image();
    img.onload = draw;
    img.src = path;
    images.set(path, img);
   }
   return images.get(path);
  }
  function marks() {
   const currentStyle = style();
   const entries = fields.filter(({label, input}) => input.value.trim() &&
    (label !== 'EOW date' || eow() && supportedStyles.includes(currentStyle)))
    .map(({label, input, select}) => ({label, value: input.value.trim(), placement: select.value}));
   const location = geography?.locationMark();
   if (location) entries.push(location);
   return entries;
  }
  function draw() {
   if (!proof.isConnected) return;
   const currentStyle = style();
   for (const {label, row} of fields) {
    row.hidden = label === 'EOW date' && !(eow() && supportedStyles.includes(currentStyle));
   }
   const entries = marks();
   const sourceWidth = preview.tagName === 'IMG' ? preview.naturalWidth : preview.width;
   const sourceHeight = preview.tagName === 'IMG' ? preview.naturalHeight : preview.height;
   proof.hidden = !sourceWidth || !sourceHeight ||
    (preview.tagName === 'CANVAS' && !preview.dataset.previewEngine && !preview.dataset.personalizationSource);
   preview.classList.toggle('aj-combined-source', !proof.hidden);
   if (proof.hidden) return;
   const size = 540;
   const context = canvas.getContext('2d');
   const engine = preview.dataset.previewEngine;
   const hasBothSides = engine === 'live-garment-personalization' ||
    engine === 'garment-artwork-composite' && sourceWidth > sourceHeight * 1.5 || paired();
   let surfaces;
   if (hasBothSides) {
    const ratio = Math.min(1, 1440 / sourceWidth, 1050 / sourceHeight);
    canvas.width = Math.round(sourceWidth * ratio);
    canvas.height = Math.round(sourceHeight * ratio);
    context.drawImage(preview, 0, 0, canvas.width, canvas.height);
    const panelWidth = canvas.width / 2;
    const panelHeight = engine === 'live-garment-personalization' || engine === 'garment-artwork-composite' ? panelWidth : canvas.height;
    surfaces = [[0, 0, panelWidth, panelHeight], [panelWidth, 0, panelWidth, panelHeight]];
   } else {
    const originalSide = side() === 'Back' ? 1 : 0;
    const otherSide = 1 - originalSide;
    const needsOther = entries.some(mark => boxes[mark.placement][0] === otherSide) ||
     otherSide === 0 && (geography?.approvedBadge() || ['Left chest','Right chest'].includes(geography?.emblem()?.placement));
    const catalog = window.AJGarments;
    const template = catalog.styles[currentStyle] ? currentStyle : 'T-shirt';
    const companion = needsOther ? image(catalog.image(template, otherSide ? 'back' : 'front')) : null;
    const height = Math.round(sourceHeight * Math.min(size / sourceWidth, 800 / sourceHeight));
    const width = Math.round(sourceWidth * height / sourceHeight);
    canvas.width = needsOther ? size * 2 : width;
    canvas.height = Math.max(height, needsOther ? size : 0) + 26;
    context.fillStyle = '#222830';
    context.fillRect(0, 0, canvas.width, canvas.height);
    const left = needsOther ? size * originalSide + (size - width) / 2 : 0;
    const top = (canvas.height - 26 - height) / 2;
    context.drawImage(preview, left, top, width, height);
    surfaces = [];
    surfaces[originalSide] = [left, top, width, height];
    if (companion?.naturalWidth) {
     const companionTop = (canvas.height - 26 - size) / 2;
     context.drawImage(companion, otherSide * size, companionTop, size, size);
     surfaces[otherSide] = [otherSide * size, companionTop, size, size];
    }
    context.fillStyle = '#fff';
    context.font = '600 14px system-ui';
    context.textAlign = 'center';
    for (const [index, surface] of surfaces.entries()) {
     if (surface) context.fillText(index ? 'BACK' : 'FRONT', surface[0] + surface[2] / 2, canvas.height - 8);
    }
   }
   const front = surfaces[0], back = surfaces[1];
   const zones = [logoZones(currentStyle, engine, false), logoZones(currentStyle, engine, true)];
   const sleeve = front || back;
   if (sleeve) paintFlag(context, sleeve, !front, currentStyle, zones[front ? 0 : 1]);
   const emblem = geography?.emblem();
   if (emblem) paintState(context, emblem, front, back, zones);
   const agencyBadge = geography?.approvedBadge();
   if (agencyBadge && front) {
    const art = image(new URL(agencyBadge.artwork, assetRoot).href);
    if (art.naturalWidth) {
     const [left, top, width, height] = front;
     const size = Math.min(width, height) * .09;
     const scale = Math.min(size / art.naturalWidth, size / art.naturalHeight);
     const w = art.naturalWidth * scale, h = art.naturalHeight * scale;
     const centerY = logoSafeY(.36, .36, w/width, h/height, zones[0]);
     if (centerY !== null) context.drawImage(art, left + width * .36 - w / 2, top + height * centerY - h / 2, w, h);
    }
   }
   paint(context, entries, surfaces, zones);
   canvas.setAttribute('aria-label', 'Customized product with U.S. flag on the wearer’s right shoulder. ' + entries.map(mark => mark.label + ': ' + mark.value + ', ' + mark.placement).join('; '));
   onProof?.(canvas);
  }
  group.addEventListener('input', () => {draw(); update?.()});
  group.addEventListener('change', () => {draw(); update?.()});
  form.addEventListener('change', draw);
  preview.addEventListener('load', draw);
  new MutationObserver(draw).observe(preview, {
   attributes: true,
   attributeFilter: ['data-preview-engine', 'data-render-version', 'data-personalization-source'],
  });
  draw();
  function details() {
   const entries = marks().map(mark => mark.label + ': ' + mark.value + ' · ' + mark.placement);
   entries.push('U.S. flag: Wearer’s right shoulder, stars forward', ...(geography?.details() || []));
   return entries;
  }
  return {draw, details, snapshot: () => proof.hidden ? null : canvas.toDataURL('image/png')};
 }
 function connectProduct(screen, collection) {
  let connectedForm;
  function attach() {
   const form = screen.querySelector('#custom-form');
   const style = form?.querySelector('#garment-style');
   const preview = screen.querySelector('#garment-preview canvas');
   if (!style || !preview || form === connectedForm || window.AJGarments.styles[style.value]?.lower) return;
   connectedForm = form;
   const legacyName = [...form.querySelectorAll('#personal option')].find(option => option.value === 'Name');
   legacyName?.remove();
   if (['law', 'doc'].includes(collection)) {
    const legacyState = form.querySelector('#state');
    if (legacyState) {
     legacyState.value = 'None';
     legacyState.closest('label').hidden = true;
    }
    [...form.querySelectorAll('#personal option')].find(option => option.value === 'Unit')?.remove();
    const oldPersonal = form.querySelector('#personal');
    if (oldPersonal?.options.length === 1) oldPersonal.closest('label').hidden = true;
    form.dispatchEvent(new Event('change', {bubbles:true}));
   }
   const note = [...form.querySelectorAll('.note')].find(node => node.textContent.startsWith('Only Name and Unit'));
   if (note) note.textContent = 'Use Garment personalization for independent name and rank placement.';
   const personalization = mount(form, {
    department: ['law', 'doc', 'gym'].includes(collection),
    badge: ['law', 'doc'].includes(collection),
    eow: () => {
     if (!['law', 'doc'].includes(collection)) return false;
     const control = form.querySelector('#flag');
     return control && !control.closest('label').hidden;
    },
    style: () => style.value,
    preview,
    side: () => window.AJGarments.styles[style.value]?.logoOnly ? 'Front' : preview.dataset.placement || 'Front',
    paired: () => preview.dataset.previewEngine === 'live-product-artwork' && preview.width > preview.height * 1.5,
    update: () => screen.querySelector('#finished-design')?.remove(),
    onProof: canvas => {
     const image = screen.querySelector('#finished-design img');
     if (image) image.src = canvas.toDataURL('image/png');
    },
   });
   form.addEventListener('click', event => {
    if (!event.target.closest('.continue-customize')) return;
    const review = screen.querySelector('#finished-design');
    const image = review?.querySelector('img');
    const snapshot = personalization.snapshot();
    if (image && snapshot) image.src = snapshot;
    for (const entry of personalization.details()) {
     if (!review) break;
     const detail = document.createElement('p');
     detail.textContent = entry;
     review.append(detail);
    }
   });
  }
  attach();
  new MutationObserver(attach).observe(screen, {subtree: true, childList: true});
 }
 function paintFlag(context, surface, back, style, zones) {
  const [left, top, width, height] = surface;
  const flagWidth = Math.min(width, height) * (style === 'Tank Top' ? .047 : .095);
  const flagHeight = flagWidth / 1.9;
  const center = style === 'Tank Top' ? .36 : .23;
  const sleeveX = back ? 1 - center : center;
  const x = left + width * sleeveX - flagWidth / 2;
  const sleeveY = logoSafeY(sleeveX, style === 'Tank Top' ? .285 : .365, flagWidth/width, flagHeight/height, zones);
  if (sleeveY === null) return;
  const y = top + height * sleeveY - flagHeight / 2;
  const stripe = flagHeight / 13;
  const unionWidth = flagWidth * .4;
  context.save();
  context.translate(x, y);
  for (let row = 0; row < 13; row++) {
   context.fillStyle = row % 2 ? '#fff' : '#b31942';
   context.fillRect(0, row * stripe, flagWidth, stripe);
  }
  context.fillStyle = '#0a3161';
  context.fillRect(flagWidth - unionWidth, 0, unionWidth, stripe * 7);
  context.fillStyle = '#fff';
  for (let row = 0; row < 9; row++) {
   for (let column = 0; column < (row % 2 ? 5 : 6); column++) {
    const sx = flagWidth - unionWidth + unionWidth * (column + (row % 2 ? 1 : .5)) / 6;
    const sy = stripe * 7 * (row + .5) / 9;
    context.beginPath();
    for (let point = 0; point < 10; point++) {
     const angle = point * Math.PI / 5 - Math.PI / 2;
     const radius = stripe * (point % 2 ? .16 : .38);
     context.lineTo(sx + Math.cos(angle) * radius, sy + Math.sin(angle) * radius);
    }
    context.closePath();
    context.fill();
   }
  }
  context.restore();
 }
 function paintState(context, {code, placement}, front, back, zones) {
  const shape = window.AJStateOutlines?.[code];
  const surface = front || (placement === 'Left shoulder' ? back : null);
  if (!shape || !surface) return;
  const [left, top, width, height] = surface;
  const [x, y, w, h] = shape.box;
  const center = placement === 'Right chest' ? .37 : placement === 'Left chest' ? .63 : front ? .77 : .23;
  const scale = Math.min(width, height) * .073 / Math.max(w, h);
  const centerY = logoSafeY(center, placement === 'Left shoulder' ? .355 : .365, w*scale/width+.008, h*scale/height+.008, zones[front ? 0 : 1]);
  if (centerY === null) return;
  context.save();
  context.translate(left + center * width, top + centerY * height);
  context.scale(scale, scale);
  context.translate(-x - w / 2, -y - h / 2);
  context.strokeStyle = '#fff';
  context.lineWidth = 2 / scale;
  context.lineJoin = 'round';
  context.stroke(new Path2D(shape.path));
  context.restore();
 }
 function addGeography(group, redraw) {
  const block = document.createElement('fieldset');
  const legend = document.createElement('legend');
  legend.textContent = 'Agency location & insignia';
  block.append(legend);
  const controls = {};
  for (const label of ['State', 'County', 'City / Town', 'State emblem placement', 'Official agency badge']) {
   const wrapper = document.createElement('label');
   wrapper.textContent = label;
   const select = document.createElement('select');
   wrapper.append(select);
   block.append(wrapper);
   controls[label] = select;
  }
  const {State:state, County:county, 'City / Town':city, 'State emblem placement':emblem, 'Official agency badge':badge} = controls;
  const printLabel = document.createElement('label');
  const print = document.createElement('input');
  print.type = 'checkbox';
  printLabel.append(print, ' Print selected county and city/town across the back shoulders');
  block.append(printLabel);
  const status = document.createElement('p');
  status.className = 'note';
  status.setAttribute('role', 'status');
  block.append(status);
  group.append(block);
  let geography = {};
  const options = (select, placeholder, choices) => {
   select.replaceChildren(new Option(placeholder, ''));
   for (const [id, name] of choices) select.add(new Option(name, id));
   select.disabled = !choices.length;
  };
  const sorted = items => items.sort((a, b) => a[1].localeCompare(b[1]));
  const countiesFor = code => window.AJAgencyCounties?.[code];
  const selectedCounty = () => countiesFor(state.value)?.[county.value];
  const locationMark = () => {
   if (!print.checked || !selectedCounty()) return null;
   const [countyName, places] = selectedCounty();
   return {label: 'County / City', value: [places[city.value], countyName].filter(Boolean).join(', '), placement: shoulders};
  };
  function refreshBadges() {
   const previous = badge.value;
   const matching = approvedBadges.filter(item => item.approval && item.artwork &&
    item.state === state.value && (!item.county || item.county === county.value) &&
    (!item.city || item.city === city.value));
   options(badge, matching.length ? 'Select approved artwork' : 'No approved artwork available',
    sorted(matching.map(item => [item.id, item.name])));
   if (matching.some(item => item.id === previous)) badge.value = previous;
   status.textContent = 'Official badge customization coming soon. Artwork is listed as agencies approve it.';
  }
  function refreshCities() {
   options(city, 'Select city / town', sorted(Object.entries(selectedCounty()?.[1] || {})));
   refreshBadges();
  }
  function showCounties(code) {
   options(county, 'Select county', sorted(Object.entries(countiesFor(code) || {}).map(([id,[name]])=>[id,name])));
   refreshCities();
  }
  function refreshCounties() {
   const code = state.value;
   options(emblem, 'No state emblem', window.AJStateOutlines?.[geography[code]?.[0]] ?
    ['Left shoulder','Left chest','Right chest'].map(name=>[name,name]) : []);
   if (!code || countiesFor(code)) {
    showCounties(code);
    return;
   }
   options(county, 'Loading counties…', []);
   refreshCities();
   loadScript('agency-counties-'+Math.floor(Number(code)/8)+'.js?v=1').then(()=>{
    if (state.value === code) showCounties(code);
   }).catch(()=>{
    if (state.value === code) options(county, 'County list unavailable. Reload to try again.', []);
   });
  }
  options(state, 'Loading states…', []);
  refreshCounties();
  state.addEventListener('input', refreshCounties);
  county.addEventListener('input', refreshCities);
  city.addEventListener('input', refreshBadges);
  loadScript('agency-geography.js?v=2').then(()=>{
   geography = window.AJAgencyGeography;
   options(state, 'Select state', sorted(Object.entries(geography).map(([id,[,name]])=>[id,name])));
   refreshCounties();
  }).catch(()=>{status.textContent='Location choices could not load. Reload this page to try again.'});
  if (!window.AJStateOutlines) loadScript('state-outlines.js?v=1').then(()=>{
   const code = geography[state.value]?.[0];
   if (window.AJStateOutlines?.[code]) options(emblem, 'No state emblem', ['Left shoulder','Left chest','Right chest'].map(name=>[name,name]));
   redraw();
  }).catch(()=>{});
  return {
   locationMark,
   emblem: () => emblem.value ? {code:geography[state.value]?.[0], placement:emblem.value} : null,
   approvedBadge: () => approvedBadges.find(item=>item.id===badge.value),
   details() {
    const area = geography[state.value];
    const district = selectedCounty();
    return [
     area && 'State: '+area[1],
     district && 'County: '+district[0],
     district?.[1][city.value] && 'City / Town: '+district[1][city.value],
     emblem.value && 'State emblem: '+emblem.value,
     this.approvedBadge()?.name && 'Approved agency badge: '+this.approvedBadge().name,
    ].filter(Boolean);
   },
  };
 }
 window.AJServicePersonalization = {mount, connectProduct};
})();
