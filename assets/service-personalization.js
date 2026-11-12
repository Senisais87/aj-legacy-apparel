(() => {
 const chest = ['Left chest', 'Right chest'];
 const shoulders = 'Across back shoulders';
 const spine = 'Down back spine';
 const hems = ['Bottom front', 'Bottom back'];
 const locations = {
  Name: [...chest, shoulders, spine],
  Rank: [...chest, shoulders, spine, ...hems],
  'EOW date': [...chest, shoulders, ...hems],
  'Facility / Department': [...chest, shoulders, ...hems],
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
 function paint(context, marks, surfaces) {
  const count = {};
  for (const {label, value, placement} of marks) {
   const [side, x, y, width] = boxes[placement];
   const surface = surfaces[side];
   if (!surface) continue;
   const [left, top, widthPx, height] = surface;
   const row = count[placement] || 0;
   count[placement] = row + 1;
   const vertical = placement === spine;
   context.save();
   context.translate(left + (x + (vertical ? row * .025 : 0)) * widthPx,
    top + (y + (vertical ? 0 : row * .023)) * height);
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
  group.append(legend);
  const fields = ['Name', 'Rank', ...(department ? ['Facility / Department'] : []), 'EOW date'].map(label => {
   const row = document.createElement('div');
   const caption = document.createElement('label');
   caption.textContent = label;
   const input = document.createElement('input');
   input.type = label === 'EOW date' ? 'date' : 'text';
   input.maxLength = 48;
   if (input.type === 'text') input.placeholder = 'Optional';
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
  const badgeRequest = badge ? addBadgeRequest(group) : null;
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
   return fields.filter(({label, input}) => input.value.trim() &&
    (label !== 'EOW date' || eow() && supportedStyles.includes(currentStyle)))
    .map(({label, input, select}) => ({label, value: input.value.trim(), placement: select.value}));
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
   proof.hidden = !entries.length || !sourceWidth || !sourceHeight ||
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
    const needsOther = entries.some(mark => boxes[mark.placement][0] === otherSide);
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
   paint(context, entries, surfaces);
   canvas.setAttribute('aria-label', 'Customized product. ' + entries.map(mark => mark.label + ': ' + mark.value + ', ' + mark.placement).join('; '));
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
   if (badgeRequest?.value.trim()) entries.push('Badge artwork requested: ' + badgeRequest.value.trim());
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
 const agencies = [
  ['Illinois State Police', 'Official emblem directive · Agency approval rules published', 'https://isp.illinois.gov/StaticFiles/docs/DepartmentDirectives/ADM-141%20DIR.pdf'],
  ['Illinois Department of Corrections', 'Official emblem reference · Apparel artwork pending', 'https://my.ilga.gov/Documents/Reports/ReportsSubmitted/7050RSGAEmail15821RSGAAttachIDOC-Quarterly-Report-July-2026.pdf'],
  ['Illinois Secretary of State Police', 'Official badge reference · Apparel artwork pending', 'https://www.ilsos.gov/content/dam/departments/police/lawupdate2425.pdf'],
  ['Chicago Police Department', 'Official star reference · Apparel artwork pending', 'https://directives.chicagopolice.org/forms/CPD-20.006.pdf'],
  ['Morris Police Department, Illinois', 'Agency contact verified · Badge artwork pending', 'https://morrisil.org/department/police-department/'],
  ['Grundy County Sheriff’s Office, Illinois', 'Agency listing verified · Badge artwork pending', 'https://www.ilsheriff.org/county/grundy/'],
  ['California Highway Patrol', 'Official uniform insignia specification · Apparel artwork pending', 'https://www.chp.ca.gov/siteassets/policy/hpg/hpg-73.6-ch-4.pdf'],
  ['Los Angeles Police Department', 'Official badge-use guidance · Agency approval required', 'https://lapdonlinestrgeacc.blob.core.usgovcloudapi.net/lapdonlinemedia/Media-Guide-21st-Century-Final-Approved-04.22.24-v2.pdf'],
  ['New York City Police Department', 'City merchandise licensing program · Apparel artwork pending', 'https://www.nyc.gov/assets/globalpartners/downloads/pdf/NYC_Tourism%20Marketing_CMLP.pdf'],
  ['Fire Department of the City of New York', 'Official licensed apparel examples · Apparel artwork pending', 'https://a856-citystore.nyc.gov/collections/fdny'],
 ];
 function addBadgeRequest(group) {
  const label = document.createElement('label');
  label.textContent = 'Agency badge artwork request';
  const input = document.createElement('input');
  input.maxLength = 100;
  input.placeholder = 'Select or enter an agency';
  const list = document.createElement('datalist');
  list.id = 'aj-badge-agencies';
  input.setAttribute('list', list.id);
  for (const [agency] of agencies) list.append(new Option(agency, agency));
  const status = document.createElement('p');
  status.className = 'note';
  status.textContent = 'Optional. Badge artwork is confirmed by agency before it appears on a garment proof.';
  input.addEventListener('input', () => {
   const match = agencies.find(([agency]) => agency === input.value);
   if (!match) {
    status.textContent = input.value.trim() ? 'Agency artwork verification pending.' :
     'Optional. Badge artwork is confirmed by agency before it appears on a garment proof.';
    return;
   }
   const link = document.createElement('a');
   link.href = match[2];
   link.textContent = match[1];
   status.replaceChildren(link);
  });
  label.append(input);
  group.append(label, list, status);
  return input;
 }
 window.AJServicePersonalization = {mount, connectProduct};
})();
