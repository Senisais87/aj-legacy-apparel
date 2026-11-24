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
 const chest = ['Right chest'];
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
  'Item front': [0, .50, .68, .25],
  'Right chest': [0, .36, .30, .13],
  [shoulders]: [1, .50, .32, .33],
  [spine]: [1, .50, .55, .26],
  'Bottom front': [0, .50, .77, .32],
  'Bottom back': [1, .50, .77, .32],
 };
 const serviceCollections = new Set(['law', 'doc', 'first']);
 const memorialEow = new Set(['concept-memorial-faith-hoodie', 'concept-memorial-carry', 'their-watch', 'memorial-shield-hoodie', 'psalm-34', 'memorial-chest-logo-tee', 'memorial-patch-cap', 'memorial-line-cap', 'memorial-shield-cap', 'memorial-tumbler', 'memorial-plaque', 'aj-crewneck', 'aj-polo', 'aj-half-zip']);
 const allowsEow = (collection, key) => serviceCollections.has(collection) || collection === 'limited' && memorialEow.has(key);
 // The brand is inside the back collar; no exterior logo exclusion zone exists.
 function logoZones() { return []; }
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
 function paint(context, marks, surfaces, zones, garmentModel) {
  const count = {}, previousY = {};
  const spinePair = ['Rank', 'Name'].every(kind =>
   marks.some(mark => mark.label === kind && mark.placement === spine));
  for (const {label, value, placement} of marks) {
   const [side, x, baseY, width] = boxes[placement];
   const y = garmentModel && side === 1 && placement === shoulders && garmentModel.back?.[1] > .53 ? .39 : baseY;
   const surface = surfaces[side];
   if (!surface) continue;
   const [left, top, widthPx, height] = surface;
   const vertical = placement === spine;
   const pairedLine = vertical && spinePair && (label === 'Rank' || label === 'Name');
   const row = count[placement] || 0;
   if (!pairedLine || label === 'Name') count[placement] = row + 1;
   const span = pairedLine ? width / 2 - .015 : width;
   const center = x + (vertical ? row * .025 : 0);
   const start = vertical ? y + (pairedLine ? (label === 'Rank' ? -1 : 1) * width / 4 : 0) : Math.max(y, (previousY[placement] ?? 0) + .027);
   const centerY = logoSafeY(center, start, vertical ? .026 : width, vertical ? span : .026, zones[side]);
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
   context.strokeText(text, 0, 0, span * (vertical ? height : widthPx));
   context.fillText(text, 0, 0, span * (vertical ? height : widthPx));
   context.restore();
  }
 }
 const sleeveStripeColors = {
  Blue: '#1769aa', Orange: '#f47721', Red: '#c8242b', Purple: '#8548a9',
  White: '#f4f4f4', Gold: '#e3b126', Silver: '#a6a8ab', 'Silver / gray': '#a6a8ab',
  Green: '#527b48', Monochrome: '#737373', 'None — monochrome': '#d7d9dc',
 };
 function selectedSleeveColors(form, palette) {
  const select = form.querySelector('#flag, #line');
  const controls = form.querySelectorAll('input[name="thinLine"]:checked');
  const names = select && !select.closest('label')?.hidden
   ? [select.value] : Array.from(controls, control => control.value);
  return names.map(name => palette[name]).filter(Boolean);
 }
 function mount(form, {department, eow = () => false, style, preview, side = () => 'Front',
   paired = () => false, badge, itemOnly = false, shoulderBrand = false, sleeveFlag = true, update, onProof, stripePalette = sleeveStripeColors, defaultSleeveColor, initialText = {}}) {
  const group = document.createElement('fieldset');
  group.className = 'aj-personalization-fields';
  const legend = document.createElement('legend');
  legend.textContent = 'Garment personalization';
  const logoNote = document.createElement('p');
  logoNote.className = 'note';
  logoNote.textContent = 'AJ logo: inside, directly below the back collar. Agency badges: wearer’s left chest (viewer’s right). Rank appears above the name when they share a placement.';
  group.append(legend);
  if (!itemOnly) {
   if (shoulderBrand) logoNote.textContent = 'AJ logo: wearer’s left shoulder. Agency badges: Coming Soon.';
   group.append(logoNote);
  }
  const fields = (itemOnly ? ['EOW date'] : ['Rank', 'Name', ...(department ? ['Facility / Department'] : []), ...(badge ? ['Unit'] : []), 'EOW date']).map(label => {
   const row = document.createElement('div');
   const caption = document.createElement('label');
   caption.textContent = label;
   const input = document.createElement('input');
   input.type = label === 'EOW date' ? 'date' : 'text';
   input.maxLength = 48;
   input.value = initialText[label] || '';
   if (input.type === 'text') input.placeholder = label === 'Facility / Department' && badge ?
    'Full department name or abbreviation' : 'Optional';
   caption.append(input);
   const position = document.createElement('label');
   position.textContent = label + ' placement';
   const select = document.createElement('select');
   for (const location of itemOnly ? ['Item front'] : locations[label]) select.add(new Option(location));
   select.value = label === 'Rank' ? 'Right chest' : label === 'EOW date' ? 'Bottom back' :
    label === 'Facility / Department' ? shoulders : 'Right chest';
   if (itemOnly) select.value = 'Item front';
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
   const entries = fields.filter(({label, input}) => input.value.trim() &&
    (label !== 'EOW date' || eow()))
    .map(({label, input, select}) => ({label, value: input.value.trim(), placement: select.value}));
   const location = geography?.locationMark();
   if (location) entries.push(location);
   return entries;
  }
  function draw() {
   if (!proof.isConnected) return;
   const currentStyle = style();
   geography?.setSleeves(!shoulderBrand && window.AJPlacement.hasSleeves(currentStyle));
   for (const {label, row} of fields) {
    row.hidden = label === 'EOW date' && !(eow());
   }
   const badgeReserved=Boolean(geography?.approvedBadge());
   if(badgeReserved){
    const sideControl=form.querySelector('#design-side, #placement');
    if(sideControl){const backOption=[...sideControl.options].find(o=>/^(Back|Full Back|Upper Back)$/.test(o.value));if(backOption&&!/Back/.test(sideControl.value)){sideControl.value=backOption.value;sideControl.dispatchEvent(new Event('change',{bubbles:true}));return;}}
   }
   const entries = marks();
   const sourceWidth = preview.tagName === 'IMG' ? preview.naturalWidth : preview.width;
   const sourceHeight = preview.tagName === 'IMG' ? preview.naturalHeight : preview.height;
   proof.hidden = !sourceWidth || !sourceHeight ||
    (!itemOnly && preview.tagName === 'CANVAS' && !preview.dataset.previewEngine && !preview.dataset.personalizationSource);
   if (itemOnly && !entries.length) proof.hidden=true;
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
     otherSide === 0 && (geography?.approvedBadge() || geography?.emblem()?.placement===window.AJPlacement.state.placement);
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
    surfaces[originalSide] = [left, top, width, preview.dataset.bodyHeight ? height*Number(preview.dataset.bodyHeight)/sourceHeight : height];
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
   const badgePolicy=window.AJPlacement.badge;
   const reserved=badgeReserved?[[badgePolicy.x-.07,badgePolicy.y-.07,.14,.14]]:[];
   const zones = [shoulderBrand ? [...reserved,[.70,.27,.13,.14]] : reserved, []];
   const sleeve = front || back;
   const colors = selectedSleeveColors(form, stripePalette);
   if (!colors.length && defaultSleeveColor) colors.push(defaultSleeveColor);
   if (!itemOnly && sleeveFlag && sleeve && window.AJPlacement.hasSleeves(currentStyle)) paintFlag(context, sleeve, !front, zones[front ? 0 : 1], colors, currentStyle, preview.dataset.wornModel==='true');
   const emblem = window.AJPlacement.hasSleeves(currentStyle) ? geography?.emblem() : null;
   if (emblem) paintState(context, emblem, front, back, zones, currentStyle, preview.dataset.wornModel==='true');
   const agencyBadge = geography?.approvedBadge();
   if (agencyBadge && front) {
    const art = image(new URL(agencyBadge.artwork, assetRoot).href);
    if (art.naturalWidth) {
     const [left, top, width, height] = front;
     const size = Math.min(width, height) * .09;
     const scale = Math.min(size / art.naturalWidth, size / art.naturalHeight);
     const w = art.naturalWidth * scale, h = art.naturalHeight * scale;
     const centerY = window.AJPlacement.badge.y;
     context.drawImage(art, left + width * window.AJPlacement.badge.x - w / 2, top + height * centerY - h / 2, w, h);
    }
   }
   const model=preview.dataset.wornModel==='true' ? window.AJGarments.models[currentStyle] : null;
   paint(context, entries, surfaces, zones, model);
   const placementDescription = currentStyle === 'Tank Top' ? '' :
    ' Thin-line flag on the wearer’s right sleeve, stars forward.' + (emblem ? ' State emblem on the wearer’s left sleeve.' : '');
   canvas.setAttribute('aria-label', 'Customized product.' + placementDescription + ' ' + entries.map(mark => mark.label + ': ' + mark.value + ', ' + mark.placement).join('; '));
   onProof?.(canvas);
  }
  group.addEventListener('input', () => {draw(); update?.()});
  group.addEventListener('change', () => {draw(); update?.()});
  form.addEventListener('change', draw);
  preview.addEventListener('load', draw);
  preview.addEventListener('previewrendered', draw);
  new MutationObserver(draw).observe(preview, {
   attributes: true,
   attributeFilter: ['data-preview-engine', 'data-render-version', 'data-personalization-source'],
  });
  draw();
  function details() {
   const entries = marks().map(mark => mark.label + ': ' + mark.value + ' · ' + mark.placement);
   if (!itemOnly) entries.push(shoulderBrand ? 'AJ brand: wearer-left shoulder' : 'AJ brand: inside directly below back collar', 'Agency badge placement: wearer-left chest (viewer-right)');
   if (!itemOnly && sleeveFlag && window.AJPlacement.hasSleeves(style())) entries.push('U.S. flag: wearer-right upper sleeve, stars forward');
   entries.push(...(geography?.details(window.AJPlacement.hasSleeves(style())) || []));
   return entries;
  }
  return {draw, details, snapshot: () => proof.hidden ? null : canvas.toDataURL('image/png')};
 }
 function connectProduct(screen, collection, resolveItem) {
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
   if (note) note.textContent = 'Use Garment personalization to preview rank and name on separate lines.';
   preview.dataset.managedPersonalization = 'true';
   const personalization = mount(form, {
    department: ['law', 'doc', 'gym'].includes(collection),
    badge: ['law', 'doc'].includes(collection),
    eow: () => allowsEow(collection, resolveItem().img),
    shoulderBrand: ['approved-eclipse-memorial', 'selected-gym-07-quote-proof'].includes(resolveItem().img),
    sleeveFlag: resolveItem().img !== 'selected-gym-board-discipline-builds-freedom',
    style: () => style.value,
    stripePalette: window.AJStore.flagColors,
    defaultSleeveColor: resolveItem().img === 'approved-eclipse-memorial' || resolveItem().flag === 'orange' ? sleeveStripeColors.Orange : collection === 'law' ? sleeveStripeColors.Blue : collection === 'doc' ? sleeveStripeColors.Silver : undefined,
    initialText: resolveItem().img === 'approved-eclipse-memorial' ? {Rank: 'SGT.', Name: 'FAUGHT'} : {},
    preview,
    side: () => window.AJGarments.styles[style.value]?.logoOnly ? 'Front' : preview.dataset.placement || 'Front',
    paired: () => preview.dataset.previewEngine === 'live-product-artwork' && preview.width > preview.height * 1.5,
    update: () => screen.querySelector('#finished-design')?.remove(),
    onProof: canvas => {
     const image = screen.querySelector('#finished-design img');
     if (image) image.src = canvas.toDataURL('image/png');
    },
   });
   form.dispatchEvent(new Event('change', {bubbles: true}));
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
 function paintFlag(context, surface, back, zones, colors, style, photographed) {
  const [left, top, width, height] = surface;
  const {flag, sleevePosition, drawFlag} = window.AJPlacement;
  const [sleeveX, sleeveCenterY, widthFraction] = sleevePosition(style, flag.wearerSide, back, photographed);
  const flagWidth = Math.min(width, height) * widthFraction;
  const flagHeight = flagWidth / 1.9;
  const sleeveY = logoSafeY(sleeveX, sleeveCenterY, flagWidth/width, flagHeight/height, zones);
  if (sleeveY === null) return;
  drawFlag(context, left + width * sleeveX - flagWidth / 2, top + height * sleeveY - flagHeight / 2,
   flagWidth, flagHeight, back, colors);
 }
 function paintState(context, {code, placement}, front, back, zones, style, photographed) {
  const shape = window.AJStateOutlines?.[code];
  const policy=window.AJPlacement;
  const surface = front || (placement === policy.state.placement ? back : null);
  if (!shape || !surface) return;
  const [left, top, width, height] = surface;
  const [x, y, w, h] = shape.box;
  const [center, sleeveCenterY, widthFraction] = policy.sleevePosition(style, policy.state.wearerSide, !front, photographed);
  const scale = Math.min(width, height) * widthFraction * .77 / Math.max(w, h);
  const centerY = logoSafeY(center, sleeveCenterY, w*scale/width+.008, h*scale/height+.008, zones[front ? 0 : 1]);
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
   status.textContent = 'Official badge customization coming soon. Approved badges will be fixed to the wearer’s left chest (viewer’s right).';
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
    [[window.AJPlacement.state.placement,window.AJPlacement.state.placement]] : []);
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
   if (window.AJStateOutlines?.[code]) options(emblem, 'No state emblem', [[window.AJPlacement.state.placement,window.AJPlacement.state.placement]]);
   redraw();
  }).catch(()=>{});
  return {
   locationMark,
   setSleeves(enabled) {
    emblem.disabled = !enabled || emblem.options.length < 2;
    emblem.closest('label').hidden = !enabled;
   },
   emblem: () => emblem.value ? {code:geography[state.value]?.[0], placement:emblem.value} : null,
   approvedBadge: () => approvedBadges.find(item=>item.id===badge.value),
   details(hasSleeves) {
    const area = geography[state.value];
    const district = selectedCounty();
    return [
     area && 'State: '+area[1],
     district && 'County: '+district[0],
     district?.[1][city.value] && 'City / Town: '+district[1][city.value],
     hasSleeves && emblem.value && 'State emblem: '+emblem.value,
     this.approvedBadge()?.name && 'Approved agency badge: '+this.approvedBadge().name,
    ].filter(Boolean);
   },
  };
 }
 window.AJServicePersonalization = {mount, connectProduct, allowsEow};
})();
