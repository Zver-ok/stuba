const form = document.querySelector('#registration-form');
const companyField = document.querySelector('.company-field');
const companyInput = companyField.querySelector('input');
form.querySelectorAll('[name=person_type]').forEach(input => input.addEventListener('change', () => {
  const legal = form.elements.person_type.value === 'legal';
  companyField.hidden = !legal;
  companyInput.disabled = !legal;
  companyInput.required = legal;
  if (!legal) companyInput.value = '';
}));
let started = false;
form.addEventListener('input', () => {
  if (started) return;
  started = true;
  const data = new FormData();
  data.set('action', 'start'); data.set('csrf', form.elements.csrf.value);
  fetch('api.php', {method: 'POST', body: data, credentials: 'same-origin'}).catch(() => {});
});
form.addEventListener('submit', async event => {
  event.preventDefault();
  const button = form.querySelector('button[type=submit]');
  if (button.disabled) return;
  const status = form.querySelector('.form-status');
  form.querySelectorAll('.field-error').forEach(el => el.textContent = '');
  form.querySelectorAll('[aria-invalid]').forEach(el => el.removeAttribute('aria-invalid'));
  button.disabled = true; button.textContent = 'Сохраняем вашу запись…'; status.textContent = '';
  try {
    const response = await fetch(form.getAttribute('action'), {method: 'POST',body: new FormData(form),credentials:'same-origin'});
    const result = await response.json();
    if (!response.ok || !result.ok) {
      status.textContent = result.message || 'Не удалось отправить форму.';
      Object.entries(result.errors || {}).forEach(([name,message]) => {
        const error = form.querySelector(`[data-error="${name}"]`);
        if (error) error.textContent = message;
        const input = form.elements.namedItem(name); if (input?.setAttribute) input.setAttribute('aria-invalid','true');
      });
      const first = form.querySelector('[aria-invalid=true]'); if (first) first.focus();
      return;
    }
    form.hidden = true;
    const success = document.querySelector('.success-state');
    document.querySelector('#success-message').textContent = result.message;
    success.hidden = false; success.focus({preventScroll:true});
    success.scrollIntoView({behavior:'smooth',block:'center'});
    // Hook for a future, consent-aware advertising integration. No external pixels loaded.
    window.dispatchEvent(new CustomEvent('exhibition:registered',{detail:{duplicate:Boolean(result.duplicate)}}));
  } catch {
    status.textContent = 'Нет связи с сервером. Проверьте интернет и попробуйте снова. Если запись уже сохранилась, повторная отправка не создаст дубликат.';
  } finally {
    button.disabled = false; button.innerHTML = 'Отправить <span>→</span>';
  }
});

// Analytics must not delay or cancel navigation to 2GIS.
document.querySelectorAll('[data-route-placement]').forEach(link => {
  function trackRouteClick(event) {
    if (event.type === 'auxclick' && event.button !== 1) return;
    const bytes = crypto.getRandomValues(new Uint8Array(16));
    const eventId = Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
    const data = new FormData();
    data.set('action', 'route_click');
    data.set('csrf', form.elements.csrf.value);
    data.set('event_id', eventId);
    data.set('placement', link.dataset.routePlacement);
    let queued = false;
    try { queued = Boolean(navigator.sendBeacon?.('api.php', data)); } catch { /* Use fetch fallback. */ }
    if (!queued) fetch('api.php', {method:'POST', body:data, credentials:'same-origin', keepalive:true}).catch(() => {});
  }
  link.addEventListener('click', trackRouteClick);
  link.addEventListener('auxclick', trackRouteClick);
});
