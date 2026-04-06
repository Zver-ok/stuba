document.addEventListener('DOMContentLoaded', () => {
  const slider = document.querySelector('#products-slider');
  const buttons = document.querySelectorAll('.slider-btn');

  if (!slider || !buttons.length) return;

  const getStep = () => slider.clientWidth * 0.8;

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const direction = button.dataset.dir === 'next' ? 1 : -1;
      slider.scrollBy({
        left: getStep() * direction,
        behavior: 'smooth',
      });
    });
  });
});