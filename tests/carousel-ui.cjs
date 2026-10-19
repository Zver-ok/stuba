const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
 const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const base=process.env.ATM_PREVIEW_URL||'http://127.0.0.1:8016';
 for(const route of ['/','/sampo/','/farmet/','/tyres/']){
  await page.goto(base+route);const track=page.locator('.carousel .products');
  const first=await track.locator(':scope > *').first().innerText();
  await page.locator('.carousel .next').click();
  assert.notEqual(await track.locator(':scope > *').first().innerText(),first,route+' next');
  await page.locator('.carousel .prev').click();
  assert.equal(await track.locator(':scope > *').first().innerText(),first,route+' previous');
  await page.locator('.dots button').nth(1).click();
  assert.notEqual(await track.locator(':scope > *').first().innerText(),first,route+' dots');
  await track.focus();await page.keyboard.press('ArrowLeft');
  assert.equal(await track.locator(':scope > *').first().innerText(),first,route+' keyboard');
  await track.scrollIntoViewIfNeeded();const box=await track.boundingBox();
  await page.mouse.move(box.x+box.width/2,box.y+40);await page.mouse.down();await page.mouse.move(box.x+box.width/2-90,box.y+40);await page.mouse.up();
  assert.notEqual(await track.locator(':scope > *').first().innerText(),first,route+' mouse drag');
  await page.setViewportSize({width:390,height:844});await page.reload();
  await page.locator('.carousel .next').click();await page.waitForTimeout(100);
  assert.ok(await track.evaluate(el=>el.scrollLeft)>0,route+' mobile scroll');
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
  await page.setViewportSize({width:1440,height:1000});
 }
 await page.goto(base+'/product/?model=X1304');
 const tracks=page.locator('.accessory-track');assert.equal(await tracks.count(),2);
 const before=await tracks.nth(1).innerText();
 const first=await tracks.nth(0).locator(':scope > *').first().innerText();
 await page.locator('[data-kind=implements] [data-slide=next]').click();
 assert.notEqual(await tracks.nth(0).locator(':scope > *').first().innerText(),first);
 assert.equal(await tracks.nth(1).innerText(),before,'independent tracks');
 assert.deepEqual(errors,[]);await browser.close();
 console.log('PASS: four desktop carousels next/previous/dots/keyboard/mouse drag, mobile scroll, independent product carousels, no JS errors.');
})().catch(e=>{console.error(e);process.exit(1)});
