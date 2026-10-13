const { chromium }=require('playwright');
const assert=require('node:assert/strict');
const base=process.env.TEST_BASE_URL;
assert.ok(/^http:\/\/127\.0\.0\.1:\d+$/.test(base));
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.BROWSER_BIN||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
 const page=await browser.newPage();
 await page.goto(base+'/setup.php');
 await page.locator('[name=setup_code]').fill('Wrong-Test-Code-000000000000');
 await page.locator('[name=username]').fill('testadmin');
 await page.locator('[name=password]').fill('Exhibition-Test-Only-2026!');
 await page.locator('[name=password_confirm]').fill('Exhibition-Test-Only-2026!');
 await page.locator('button').click();
 assert.ok((await page.locator('[role=alert]').textContent()).includes('Неверный код'));
 await page.locator('[name=setup_code]').fill('Setup-Test-Key-Only-000000000000');
 await page.locator('[name=password]').fill('Exhibition-Test-Only-2026!');
 await page.locator('[name=password_confirm]').fill('Not-The-Same-Password');
 await page.locator('button').click();
 assert.ok((await page.locator('[role=alert]').textContent()).includes('не совпадают'));
 await page.locator('[name=setup_code]').fill('Setup-Test-Key-Only-000000000000');
 await page.locator('[name=password]').fill('Exhibition-Test-Only-2026!');
 await page.locator('[name=password_confirm]').fill('Exhibition-Test-Only-2026!');
 if(process.env.TEST_DB_DRIVER==='mysql'){
  await page.locator('[name=driver]').selectOption('mysql');
  await page.locator('[name=db_host]').fill('127.0.0.1');
  await page.locator('[name=db_port]').fill(process.env.TEST_MYSQL_PORT||'3308');
  await page.locator('[name=db_name]').fill('exhibition_test');
  await page.locator('[name=db_user]').fill('root');
 }
 const submit=page.waitForResponse(r=>r.url().endsWith('/setup.php')&&r.request().method()==='POST');
 await page.locator('button').click();assert.equal((await submit).status(),200);
 assert.equal((await page.locator('h1').textContent()).trim(),'Кабинет настроен.');
 await page.reload();assert.equal(await page.locator('[name=password]').count(),0);
 await page.setViewportSize({width:320,height:844});
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 await browser.close();
 console.log('PASS: browser setup key, mismatching passwords rejected, administrator created, setup locked, mobile layout.');
})().catch(error=>{console.error(error);process.exit(1)});
