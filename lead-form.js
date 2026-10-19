(() => {
 const config=window.ATMLeadConfig,dialog=document.querySelector('#atm-lead-dialog');if(!config||!dialog)return;
 const modalForm=dialog.querySelector('form');let lastTrigger=null;
 const brand=()=>document.body.dataset.equipment==='combines'?'sampo':document.body.dataset.equipment||'yto';
 function currentModel(){return document.querySelector('.product-summary h1,.sampo-product-summary h1')?.textContent.trim()||'';}
 function open({model='',topic='Получить консультацию',sourceModel=''}={},trigger=null){
  if(modalForm.dataset.sending!=='true'){modalForm.elements.model.value=model||currentModel();modalForm.elements.topic.value=topic;modalForm.elements.source_model.value=sourceModel;dialog.querySelector('#atm-lead-title').textContent=topic;modalForm.querySelector('[role=status]').textContent='';}
  lastTrigger=trigger;if(!dialog.open)dialog.showModal();document.body.classList.add('atm-modal-open');
  if(modalForm.dataset.sending!=='true')modalForm.elements.name.focus();window.ATMMarketing?.track('atm_lead_open',{form_context:'modal',equipment_section:brand()});
 }
 window.ATMLead={open};
 dialog.querySelector('.atm-lead-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('close',()=>{document.body.classList.remove('atm-modal-open');lastTrigger?.focus?.({preventScroll:true});});
 dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();});
 document.addEventListener('click',event=>{if(event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;const trigger=event.target.closest('[data-lead-open],a,button');if(!trigger||trigger.closest('form'))return;const text=trigger.textContent.replace(/\s+/g,' ').trim();const explicit=trigger.hasAttribute('data-lead-open');if(!explicit&&(/WhatsApp/i.test(text)||!/(?:получить\s+(?:консультац|кп|предложен)|отправить\s+заявк|оставить\s+заявк)/iu.test(text)))return;
  event.preventDefault();event.stopImmediatePropagation();const card=trigger.closest('.product');const model=trigger.dataset.leadModel||card?.dataset.name||card?.querySelector('h3')?.textContent.trim()||currentModel();const topic=trigger.dataset.leadTopic||(/\bКП\b/iu.test(text)||/получить\s+кп/iu.test(text)?'Получить коммерческое предложение':/запчаст/iu.test(trigger.closest('.parts-banner')?.textContent||'')?'Заявка на запчасти':'Получить консультацию');open({model,topic,sourceModel:card&&currentModel()!==model?currentModel():''},trigger);
 },true);
 const forms=[...document.querySelectorAll('form.contact-form,form.quick-request,form.product-inquiry,form[data-email-form]')];
 for(const form of new Set(forms)){
  form.dataset.emailForm='';form.method='post';form.action=config.endpoint;
  let status=form.querySelector('[role=status]');if(!status){status=document.createElement('p');status.setAttribute('role','status');form.append(status);}status.classList.add('atm-lead-status');status.setAttribute('aria-live','polite');
  if(!form.elements.website){const trap=document.createElement('label');trap.className='atm-lead-honeypot';trap.setAttribute('aria-hidden','true');trap.textContent='Сайт';const input=document.createElement('input');input.name='website';input.tabIndex=-1;input.autocomplete='off';trap.append(input);form.append(trap);}
  form.querySelectorAll('button[type=submit],[data-requires-js]').forEach(button=>button.disabled=false);
  form.addEventListener('submit',async event=>{
   event.preventDefault();if(form.dataset.sending==='true'||!form.reportValidity())return;
   const payload=new FormData(form);payload.set('nonce',config.nonce);const sourceUrl=new URL(location.pathname,location.origin);const sourceId=new URLSearchParams(location.search).get('model');if(sourceId&&/^[A-Z0-9-]{1,100}$/i.test(sourceId))sourceUrl.searchParams.set('model',sourceId);payload.set('page_url',sourceUrl.href);if(!payload.get('topic'))payload.set('topic',form.dataset.purpose||'Заявка с сайта АТМ');
   if(!payload.get('model')){const selected=currentModel();if(selected)payload.set('model',selected);}
   const campaign=window.ATMMarketing?.campaign?.()||{};for(const [key,value]of Object.entries(campaign))payload.set(key,value);
   const button=form.querySelector('button[type=submit],button:not([type])');const oldText=button?.textContent;form.dataset.sending='true';form.setAttribute('aria-busy','true');if(button){button.disabled=true;button.textContent='Отправляем…';}status.textContent='Отправляем заявку…';status.dataset.state='pending';
   const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),20000);
   try{const response=await fetch(config.endpoint,{method:'POST',body:payload,credentials:'same-origin',signal:controller.signal});let result;try{result=await response.json();}catch{throw new Error('Не удалось получить подтверждение отправки. Попробуйте ещё раз или позвоните нам.');}if(!response.ok||!result.ok)throw new Error(result.message||'Не удалось отправить заявку. Попробуйте ещё раз.');status.textContent=result.message;status.dataset.state='success';if(!result.duplicate)window.ATMMarketing?.track('atm_lead_submitted',{form_context:form===modalForm?'modal':brand(),equipment_section:brand()});
   }catch(error){status.textContent=error.name==='AbortError'?'Подтверждение не получено. Проверьте связь и повторите отправку или позвоните нам.':error.message;status.dataset.state='error';}
   finally{clearTimeout(timer);delete form.dataset.sending;form.removeAttribute('aria-busy');if(button){button.disabled=false;button.textContent=oldText;}}
  });
 }
})();
