const previewBase=process.env.ATM_PREVIEW_URL||'http://127.0.0.1:8010';
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');const vm=require('node:vm');
const source=fs.readFileSync('catalog-data.js','utf8');const sandbox={window:{}};vm.runInNewContext(source,sandbox);
const models=sandbox.window.YTO_CATALOG.models;
assert.equal(models.length,10);assert.equal(new Set(models.map(model=>model.id)).size,10);
assert.equal(models.find(model=>model.id==='X1304').power,140);
assert.equal(models.find(model=>model.id==='ELP2804').power,280);
assert.equal(models.find(model=>model.id==='NMF804-8').hydraulicPairs,3);
for(const model of models){assert.ok(typeof model.image==='string' && /\.(svg|webp|png|jpe?g)$/.test(model.image));assert.ok(Object.values(model.specs).flat().length>=29);}
(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
 const page=await browser.newPage({viewport:{width:1440,height:1000}});const errors=[];
 page.on('pageerror',error=>errors.push(error.message));await require('./mock-lead-mail.cjs')(page);
 // Hosting photos are user-managed and absent from this checkout; supply a preview fixture only.
 const missingPhotos=new Set(models.filter(model=>!fs.existsSync(model.image)).map(model=>'/'+model.image));
 await page.route('**/images/*.webp',route=>missingPhotos.has(new URL(route.request().url()).pathname)?route.fulfill({contentType:'image/svg+xml',body:fs.readFileSync('assets/images/placeholder.svg')}):route.continue());
 await page.goto(previewBase+'/');
 assert.equal(await page.locator('.products .product').count(),4);
 assert.ok((await page.locator('.products').textContent()).includes('NMF804-8'));
 assert.equal(await page.locator('.products a[href*="X804"]').count(),0);
 assert.ok((await page.locator('.dealer-map').textContent()).includes('32Б'));
 await page.goto(previewBase+'/catalog/');
 assert.equal(await page.locator('.catalog-grid .product').count(),10);
 assert.equal(await page.locator('.catalog-grid .product:visible').count(),10);
 await page.locator('#model-search').fill('YTO NMF804-8');assert.equal(await page.locator('.catalog-grid .product:visible').count(),1);
 await page.locator('#reset-filters').click();await page.locator('#power-filter').selectOption('extra');assert.equal(await page.locator('.catalog-grid .product:visible').count(),2);
 await page.locator('#reset-filters').click();await page.locator('#ac-filter').selectOption('false');assert.equal(await page.locator('.catalog-grid .product:visible').count(),1);assert.ok((await page.locator('.catalog-grid .product:visible h3').textContent()).includes('ME404'));
 await page.locator('#reset-filters').click();await page.locator('#sort-models').selectOption('power-down');assert.equal(await page.locator('.catalog-grid .product').first().getAttribute('data-id'),'ELP2804');
 await page.locator('#model-search').fill('not-a-model');assert.equal(await page.locator('.empty-results').isVisible(),true);await page.locator('#empty-reset').click();
 await page.locator('[data-compare=ME404]').check();await page.locator('[data-compare=NLX854]').check();await page.locator('[data-compare=X1304]').check();await page.locator('[data-compare=ELP2804]').click();assert.equal(await page.locator('[data-compare=ELP2804]').isChecked(),false);
 await page.locator('#compare-open').click();assert.equal(await page.locator('#compare-dialog').isVisible(),true);assert.ok((await page.locator('#compare-dialog').textContent()).includes('140'));await page.locator('#compare-close').click();
 await page.screenshot({path:'/tmp/yto-catalog-desktop.png',fullPage:true});
 for(const model of models){
  await page.goto(`${previewBase}/product/?model=${model.id}`);
  assert.equal(await page.locator('.product-summary h1').textContent(),model.name);
  assert.equal(await page.locator('.product-summary [data-model-power]').textContent(),String(model.power));
  assert.ok((await page.locator('.specification-groups').textContent()).includes(String(model.displacement)));
  assert.equal(await page.locator('.related-grid [data-id="'+model.id+'"]').count(),0);
  assert.ok(decodeURIComponent(await page.locator('.detail-actions .model-whatsapp').getAttribute('href')).includes(model.name));
  assert.ok(decodeURIComponent(await page.locator('.specification-section .model-whatsapp').getAttribute('href')).includes(model.name));
  assert.equal(await page.locator('#main-product-image').evaluate(image=>image.complete&&image.naturalWidth>0),true);
 }
 await page.goto(previewBase+'/product/?model=X1304');assert.equal(await page.locator('.product-summary [data-model-power]').textContent(),'140');
 await page.locator('.product-inquiry [name=name]').fill('Проверка');await page.locator('.product-inquiry [name=phone]').fill('+77770000000');await page.locator('.product-inquiry button').click();await page.waitForFunction(()=>document.querySelector('.inquiry-status').dataset.state==='success');assert.ok((await page.locator('.inquiry-status').innerText()).includes('принята'));
 await page.screenshot({path:'/tmp/yto-product-desktop.png',fullPage:true});
 await page.goto(previewBase+'/product/?model=UNKNOWN');assert.equal(await page.locator('.unknown-model').isVisible(),true);assert.equal(await page.locator('.product-summary').count(),0);
 for(const width of [390,320]){
  await page.setViewportSize({width,height:844});
  for(const path of ['/','/catalog/','/product/?model=ELP2804']){
   await page.goto(previewBase+path);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'Overflow '+width+path);
   await page.locator('.menu-toggle').click();assert.equal(await page.locator('.navigation').isVisible(),true);await page.locator('.menu-toggle').click();
   if(width===390)await page.screenshot({path:'/tmp/yto-'+(path==='/'?'home':path.startsWith('/catalog')?'catalog':'product')+'-mobile.png',fullPage:true});
  }
 }
 assert.deepEqual(errors,[]);
 const pdf=await page.request.get(previewBase+'/assets/docs/yto-catalog-2026-16-32.pdf');assert.equal(pdf.status(),200);
 console.log('PASS: 10 sourced models, homepage cards, model-specific specs/email/PDF, filters/sorting/comparison, unknown model, forms, mobile menu and no 320/390 overflow; no browser JS errors.');
 await browser.close();
})().catch(error=>{console.error(error);process.exit(1)});
