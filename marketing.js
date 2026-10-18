(() => {
  const storageKey='atm_campaign_session';
  const keys=['utm_source','utm_medium','utm_campaign','utm_content','utm_term'];
  const clean=value=>String(value||'').replace(/[\u0000-\u001f\u007f]/g,'').slice(0,160);
  let campaign={};
  try {campaign=JSON.parse(sessionStorage.getItem(storageKey)||'{}');if(!campaign || typeof campaign!=='object' || Array.isArray(campaign))campaign={};} catch {campaign={};}
  campaign=Object.fromEntries(keys.filter(key=>typeof campaign[key]==='string').map(key=>[key,clean(campaign[key])]));
  const params=new URLSearchParams(location.search);
  if(keys.some(key=>params.get(key))){campaign=Object.fromEntries(keys.filter(key=>params.get(key)).map(key=>[key,clean(params.get(key))]));try{sessionStorage.setItem(storageKey,JSON.stringify(campaign));}catch{}}
  function track(event,extra={}) {
    if(!Array.isArray(window.dataLayer))window.dataLayer=[];
    const model=window.YTO_UI?.catalog.models.find(model=>model.id===params.get('model'));
    const payload={event,page_path:location.pathname,...campaign,...(model?{model:model.id}:{}),...extra};
    window.dataLayer.push(payload);
    window.dispatchEvent(new CustomEvent('atm:conversion',{detail:payload}));
  }
  function messageSuffix() {
    const lines=[['utm_source','Источник'],['utm_medium','Канал'],['utm_campaign','Кампания']].filter(([key])=>campaign[key]).map(([key,label])=>`${label}: ${campaign[key]}`);
    return lines.length?'\n\n'+lines.join('\n'):'';
  }
  function contact(event) {
    if(event.type==='auxclick' && event.button!==1)return;
    const link=event.target.closest('a[href]');if(!link)return;
    const url=new URL(link.href,location.href);let method='';
    if(url.protocol==='tel:')method='phone';
    else if(url.protocol==='mailto:')method='email';
    else if(url.hostname==='wa.me'){
      method='whatsapp';
      const base=link.dataset.baseWaText??url.searchParams.get('text')??'Здравствуйте! Хочу получить консультацию по технике YTO.';
      link.dataset.baseWaText=base;url.searchParams.set('text',base+messageSuffix());link.href=url.href;
    } else if(/(^|\.)(2gis\.(kz|com)|go\.2gis\.com)$/.test(url.hostname))method='route';
    else if(url.pathname.endsWith('.pdf'))method='catalogue_download';
    if(method)track('atm_contact_click',{contact_method:method,...(link.dataset.branch?{branch:link.dataset.branch}:{}),form_context:link.closest('form')?.classList.contains('product-inquiry')?'product':link.closest('form')?.classList.contains('quick-request')?'service':'site'});
  }
  document.addEventListener('click',contact);document.addEventListener('auxclick',contact);
  window.ATMMarketing={track,messageSuffix};
  const cities=['Астана','Актау','Актобе','Алматы','Атырау','Жезказган','Караганда','Кокшетау','Костанай','Кызылорда','Павлодар','Петропавловск','Семей','Талдыкорган','Тараз','Туркестан','Уральск','Усть-Каменогорск','Шымкент'];
  const list=document.createElement('datalist');list.id='atm-cities';cities.forEach(city=>{const option=document.createElement('option');option.value=city;list.append(option);});document.body.append(list);
  document.querySelectorAll('input[name=region],input[name=city]').forEach(input=>input.setAttribute('list',list.id));
  const interest={service:'Интересует сервисное обслуживание YTO.',parts:'Интересует подбор запчастей YTO.',finance:'Интересуют лизинг и субсидирование техники YTO.'}[params.get('interest')];
  if(interest){const comment=document.querySelector('.contact-form [name=comment]');if(comment && !comment.value)comment.value=interest;}
  document.querySelectorAll('.quick-request').forEach(form=>form.addEventListener('submit',event=>{
    event.preventDefault();const data=new FormData(form);
    const message=`Здравствуйте! ${form.dataset.purpose||'Нужна консультация по YTO'}.\nИмя: ${data.get('name')}\nТелефон: ${data.get('phone')}\nГород / регион: ${data.get('city')||'Не указан'}\nМодель: ${data.get('model')||'Не указана'}\nЗадача: ${data.get('task')||'Нужна консультация'}`+messageSuffix();
    const status=form.querySelector('[role=status]');status.textContent='Обращение подготовлено. Откройте WhatsApp и отправьте сообщение менеджеру.';
    const link=document.createElement('a');link.href='https://wa.me/77775550665?text='+encodeURIComponent(message);link.textContent='Открыть WhatsApp →';link.target='_blank';link.rel='noopener';status.append(link);
    // Mark the base text without attribution to avoid appending it twice on click.
    link.dataset.baseWaText=messageSuffix()?message.slice(0,-messageSuffix().length):message;
    track('atm_form_prepared',{form_context:'service'});
  }));
})();
