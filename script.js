document.addEventListener('DOMContentLoaded',()=>{
  if(window.lucide) lucide.createIcons();
  const modal=document.querySelector('.modal');
  document.querySelector('.open-modal').addEventListener('click',()=>{modal.classList.add('show');modal.setAttribute('aria-hidden','false')});
  document.querySelector('.close').addEventListener('click',()=>modal.classList.remove('show'));
  modal.addEventListener('click',e=>{if(e.target===modal)modal.classList.remove('show')});
  document.querySelector('.menu').addEventListener('click',()=>document.querySelector('.links').classList.toggle('open'));
  document.querySelectorAll('form').forEach(form=>form.addEventListener('submit',e=>{e.preventDefault();const b=form.querySelector('button');b.textContent='Заявка отправлена ✓';b.disabled=true}));
  document.querySelector('.submit-modal').addEventListener('click',e=>{e.target.textContent='Заявка отправлена ✓';setTimeout(()=>modal.classList.remove('show'),900)});
});