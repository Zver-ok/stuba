const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const base=process.env.TEST_BASE_URL || 'http://127.0.0.1:8001';
assert.ok(/^http:\/\/127\.0\.0\.1:\d+$/.test(base),'Run only against an isolated local fixture server');
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.BROWSER_BIN || '/usr/bin/chromium',headless:true,args:['--no-sandbox']});
 const context=await browser.newContext({viewport:{width:1440,height:1000},userAgent:'Mozilla/5.0 TestVisitor Chrome/130.0'});
 const page=await context.newPage(); const errors=[]; page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base+'/?utm_source=instagram&utm_medium=paid&utm_campaign=expo-test');
 assert.equal(await page.locator('.route-button').getAttribute('href'),'https://go.2gis.com/TC3u8');
 assert.equal(await page.locator('.contact-phone').getAttribute('href'),'tel:+77775550665');
 assert.ok((await page.locator('.contact-whatsapp').getAttribute('href')).startsWith('https://wa.me/77775550665'));
 await page.screenshot({path:'/tmp/exhibition-desktop.png',fullPage:true});
 await context.route('https://go.2gis.com/**', route => route.fulfill({status:200,body:'2GIS test destination'}));
 async function routeClick(selector) {
  const saved=page.waitForResponse(response => response.url().endsWith('/api.php') && response.request().postData()?.includes('route_click'));
  const popupPromise=page.waitForEvent('popup');
  await page.locator(selector).click();
  const popup=await popupPromise; await popup.close();
  assert.equal((await saved).status(),200);
 }
 await routeClick('.route-button');
 await routeClick('.route-button');
 await page.evaluate(() => Object.defineProperty(navigator,'sendBeacon',{value:()=>false,configurable:true}));
 await routeClick('.route-button');
 assert.equal(await page.locator('.company-field').isVisible(),false);
 await page.locator('[name=person_type][value=legal]').check();
 assert.equal(await page.locator('.company-field input').getAttribute('required'),'');
 await page.locator('[name=first_name]').fill('Айбек');
 await page.locator('[name=last_name]').fill('Тестов');
 await page.locator('[name=phone]').fill('+7 (777) 123-45-67');
 await page.locator('[name=company]').fill('=TEST COMPANY');
 await page.locator('[name=interest]').selectOption('Тракторы');
 assert.equal(await page.locator('[name=consent]').count(),0);
 assert.equal((await page.locator('.form-heading h3').textContent()).trim(),'Запишитесь на выставку');
 assert.ok((await page.locator('.submit-button').textContent()).trim().startsWith('Отправить'));
 assert.ok((await page.locator('.submission-consent').textContent()).includes('Нажимая «Отправить»'));
 await page.waitForTimeout(2200);
 const csrf=await page.locator('[name=csrf]').inputValue();
 const rejected=await context.request.post(base+'/api.php',{form:{action:'register',csrf:'bad'}});
 assert.equal(rejected.status(),403);
 const invalid=await context.request.post(base+'/api.php',{form:{action:'register',csrf,first_name:'Иван',last_name:'Тестов',person_type:'legal',phone:'+77771234567'}});
 assert.equal(invalid.status(),422);assert.ok((await invalid.json()).errors.company);
 const response=page.waitForResponse(r=>r.url().endsWith('/api.php')&&r.request().postData()?.includes('register'));
 await page.locator('.submit-button').click(); assert.equal((await response).status(),201);
 await page.locator('.success-state').waitFor({state:'visible'});
 assert.ok((await page.locator('#success-message').textContent()).includes('Вы записаны'));
 await routeClick('[data-route-placement=success]');
 const routeEvent={action:'route_click',csrf,event_id:'abcdef0123456789abcdef0123456789',placement:'contacts'};
 assert.equal((await context.request.post(base+'/api.php',{form:routeEvent})).status(),200);
 assert.equal((await context.request.post(base+'/api.php',{form:routeEvent})).status(),200);
 assert.equal((await context.request.post(base+'/api.php',{form:{...routeEvent,csrf:'invalid'}})).status(),403);
 assert.equal((await context.request.post(base+'/api.php',{form:{...routeEvent,event_id:'invalid'}})).status(),422);

 const duplicate=await context.request.post(base+'/api.php',{form:{action:'register',csrf,first_name:'Иван',last_name:'Тестов',person_type:'individual',phone:'87771234567'}});
 assert.equal((await duplicate.json()).duplicate,true);
 await page.goto(base+'/admin.php');
 assert.equal(await page.locator('.metric-grid').count(),0);
 await page.locator('[name=username]').fill('testadmin'); await page.locator('[name=password]').fill('Exhibition-Test-Only-2026!');
 await Promise.all([page.waitForURL('**/admin.php'),page.locator('.login-card button').click()]);
 await page.locator('.metric-grid').waitFor();
 assert.equal((await page.locator('.metric-grid article').nth(2).locator('strong').textContent()).trim(),'1');
 assert.equal(await page.locator('.leads-table tbody tr').count(),1);
 assert.equal(await page.locator('.metric-grid article').filter({hasText:'Проложить маршрут'}).locator('strong').textContent(),'5');
 assert.ok((await page.locator('.route-period').textContent()).includes('5'));
 await page.locator('.daily-details summary').click();
 assert.equal(await page.locator('.daily-route-clicks').first().textContent(),'5');
 await page.locator('.daily-details summary').click();
 await page.goto(base+'/admin.php?period=7');
 assert.ok((await page.locator('.route-period').textContent()).includes('5'));

 assert.ok((await page.locator('.leads-table').textContent()).includes('expo-test'));
 assert.ok((await page.locator('.period-summary').textContent()).includes('1 начали форму'));
 await page.locator('.status-form select').selectOption('contacted');await page.locator('.status-form button').click();
 assert.equal(await page.locator('.status-form select').inputValue(),'contacted');
 const adminCsrf=await page.locator('form [name=csrf]').first().inputValue();
 const csv=await context.request.post(base+'/admin.php?period=30',{form:{action:'export',csrf:adminCsrf}});
 assert.equal(csv.status(),200); assert.ok((await csv.text()).includes("'=TEST COMPANY"));
 await page.screenshot({path:'/tmp/exhibition-admin-desktop.png',fullPage:true});
 const privateFile=await context.request.get(base+'/../private/admin.json');assert.equal(privateFile.status(),404);
 const loader=await context.request.get(base+'/bootstrap-loader.php'); assert.equal(loader.status(),404);
 for(const size of [390,320]){
  await page.setViewportSize({width:size,height:844});
  for(const path of ['admin.php','./','privacy.php']){
   await page.goto(base+'/'+path);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`Overflow ${path}/${size}`);
   if(size===390)await page.screenshot({path:`/tmp/exhibition-${path==='./'?'landing':path.replace('.php','')}-mobile.png`,fullPage:true});
  }
 }
 assert.deepEqual(errors,[]);
 console.log('PASS: real persistence, legal company validation, CSRF, duplicate phone, consent flow, UTM attribution, start tracking, both route buttons, repeated clicks, beacon fallback, idempotent events, daily/period route counts, admin auth, lead status, safe CSV, private files inaccessible; 320/390 mobile overflow checks; no browser errors.');
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
