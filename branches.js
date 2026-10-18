(() => {
 const search=document.querySelector('#branch-search'),region=document.querySelector('#branch-region'),cards=[...document.querySelectorAll('.branch-card')];
 const normalize=value=>value.toLocaleLowerCase('ru').replace(/ё/g,'е').replace(/[\s-]+/g,' ').trim();
 function filter(){let count=0;cards.forEach(card=>{const visible=normalize(card.dataset.search).includes(normalize(search.value))&&(!region.value||card.dataset.region===region.value);card.hidden=!visible;if(visible)count++;});document.querySelector('#branch-count').textContent=`Найдено адресов: ${count}`;document.querySelector('.branches-empty').hidden=count!==0;}
 search.addEventListener('input',filter);region.addEventListener('change',filter);
 document.querySelectorAll('[data-reset-branches]').forEach(button=>button.addEventListener('click',()=>{search.value='';region.value='';filter();}));
 const city=new URLSearchParams(location.search).get('city');const selected=cards.find(card=>card.dataset.branch===city);
 if(selected)search.value=selected.dataset.city;
 filter();
})();
