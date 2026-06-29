const cableCatalog = [
  { category: 'ВВГ', sizes: ['2x1,5','2x2,5','2x4','2x6','2x10','2x16','3x1,5','3x2,5','3x4','3x6','3x10','3x16','4x1,5','4x2,5','4x4','4x6','4x10','4x16','5x1,5','5x2,5','5x4','5x6','5x10','5x16'] },
  { category: 'ВВГнг (A)', sizes: ['2x1,5','2x2,5','2x4','3x1,5','3x2,5','3x4','3x6','4x2,5','4x4','5x2,5','5x4'] },
  { category: 'ВВГнг-LS', sizes: ['2x1,5','2x2,5','3x1,5','3x2,5','3x4','3x6','4x2,5','4x4','5x2,5','5x4','5x6'] },
  { category: 'ВВГнг-FRLS', sizes: ['3x1,5','3x2,5','3x4','4x2,5','4x4','5x2,5','5x4'] },
  { category: 'Аксессуары', sizes: ['Кабельные наконечники','Муфты соединительные','Кабельные лотки','Гофра ПВХ'] },
];

const cablePurposes = {
  '1,5': 'Освещение, выключатели и маломощные группы',
  '2,5': 'Розеточные группы и бытовые приборы',
  '4': 'Электроплиты, бойлеры и мощные линии',
  '6': 'Ввод в квартиру, дом и распределительные щиты',
  '10': 'Вводные линии и оборудование',
  '16': 'Магистральные линии и силовые шкафы',
};

const defaultProductCardImage = 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/slide.webp';
const defaultProductHeroBackgroundImage = 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/slide.webp';
/*
  Картинки товаров указываются здесь.
  Ключ — это slug товара из ссылки после ?product=, например для адреса
  /product/?product=ввг-3x1-5 ключ будет 'ввг-3x1-5'.

  card — картинка в карточке товара в каталоге.
  banner — картинка в правом баннере на странице товара внутри
  <header class="product-hero">.

  Ниже уже добавлены все кабели с тестовой картинкой. Чтобы заменить картинку,
  просто поменяйте ссылку у нужного товара в card и/или banner.
*/
const cableProductImages = {
  'ввг-2x1-5': { card: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/vvg/1.webp', background: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/hero/1.webp' },
  'ввг-2x2-5': { card: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/vvg/2.webp', background: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/hero/1.webp' },
  'ввг-2x4': { card: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/vvg/3.webp', background: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/hero/1.webp' },
  'ввг-2x6': { card: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/vvg/4.webp', background: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/hero/1.webp' },
  'ввг-2x10': { card: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/vvg/5.webp', background: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/hero/1.webp' },
  'ввг-2x16': { card: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/vvg/6.webp', background: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/hero/1.webp' },
  'ввг-3x1-5': { card: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/vvg/7.webp', background: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/hero/2.webp' },
  'ввг-3x2-5': { card: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/vvg/8.webp', background: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/hero/2.webp' },
  'ввг-3x4': { card: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/vvg/9.webp', background: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/hero/2.webp' },
  'ввг-3x6': { card: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/vvg/10.webp', background: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/hero/2.webp' },
  'ввг-3x10': { card: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/vvg/11.webp', background: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/hero/2.webp' },
  'ввг-3x16': { card: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/vvg/11.webp', background: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/hero/2.webp' },
  'ввг-4x1-5': { card: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/vvg/12.webp', background: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/hero/3.webp' },
  'ввг-4x2-5': { card: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/vvg/13.webp', background: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/hero/3.webp' },
  'ввг-4x4': { card: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/vvg/14.webp', background: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/hero/3.webp' },
  'ввг-4x6': { card: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/vvg/15.webp', background: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/hero/3.webp' },
  'ввг-4x10': { card: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/vvg/16.webp', background: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/hero/3.webp' },
  'ввг-4x16': { card: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/vvg/17.webp', background: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/hero/3.webp' },
  'ввг-5x1-5': { card: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/vvg/18.webp', background: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/hero/4.webp' },
  'ввг-5x2-5': { card: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/vvg/19.webp', background: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/hero/4.webp' },
  'ввг-5x4': { card: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/vvg/20.webp', background: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/hero/4.webp' },
  'ввг-5x6': { card: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/vvg/21.webp', background: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/hero/4.webp' },
  'ввг-5x10': { card: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/vvg/22.webp', background: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/hero/4.webp' },
  'ввг-5x16': { card: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/vvg/23.webp', background: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/hero/4.webp' },
  'ввгнг-a-2x1-5': { card: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/vvgng/1.webp', background: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/hero/1.webp' },
  'ввгнг-a-2x2-5': { card: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/vvgng/2.webp', background: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/hero/1.webp' },
  'ввгнг-a-2x4': { card: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/vvgng/3.webp', background: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/hero/1.webp' },
  'ввгнг-a-3x1-5': { card: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/vvgng/4.webp', background: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/hero/2.webp' },
  'ввгнг-a-3x2-5': { card: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/vvgng/5.webp', background: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/hero/2.webp' },
  'ввгнг-a-3x4': { card: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/vvgng/6.webp', background: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/hero/2.webp' },
  'ввгнг-a-3x6': { card: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/vvgng/7.webp', background: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/hero/2.webp' },
  'ввгнг-a-4x2-5': { card: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/vvgng/8.webp', background: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/hero/3.webp' },
  'ввгнг-a-4x4': { card: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/vvgng/9.webp', background: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/hero/3.webp' },
  'ввгнг-a-5x2-5': { card: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/vvgng/10.webp', background: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/hero/4.webp' },
  'ввгнг-a-5x4': { card: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/vvgng/11.webp', background: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/hero/4.webp' },
  'ввгнг-ls-2x1-5': { card: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/vvgngls/1.webp', background: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/hero/1.webp' },
  'ввгнг-ls-2x1-5': { card: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/vvgngls/2.webp', background: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/hero/1.webp' },
  'ввгнг-ls-2x2-5': { card: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/vvgngls/1.webp', background: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/hero/1.webp' },
  'ввгнг-ls-3x1-5': { card: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/vvgngls/3.webp', background: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/hero/2.webp' },
  'ввгнг-ls-3x2-5': { card: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/vvgngls/4.webp', background: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/hero/2.webp' },
  'ввгнг-ls-3x4': { card: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/vvgngls/5.webp', background: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/hero/2.webp' },
  'ввгнг-ls-3x6': { card: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/vvgngls/6.webp', background: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/hero/2.webp' },
  'ввгнг-ls-4x2-5': { card: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/vvgngls/7.webp', background: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/hero/3.webp' },
  'ввгнг-ls-4x4': { card: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/vvgngls/8.webp', background: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/hero/3.webp' },
  'ввгнг-ls-5x2-5': { card: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/vvgngls/9.webp', background: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/hero/4.webp' },
  'ввгнг-ls-5x4': { card: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/vvgngls/10.webp', background: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/hero/4.webp' },
  'ввгнг-ls-5x6': { card: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/vvgngls/11.webp', background: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/hero/4.webp' },
  'ввгнг-frls-3x1-5': { card: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/vvgngfrls/1.webp', background: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/hero/2.webp' },
  'ввгнг-frls-3x2-5': { card: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/vvgngfrls/2.webp', background: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/hero/2.webp' },
  'ввгнг-frls-3x4': { card: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/vvgngfrls/3.webp', background: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/hero/2.webp' },
  'ввгнг-frls-4x2-5': { card: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/vvgngfrls/4.webp', background: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/hero/3.webp' },
  'ввгнг-frls-4x4': { card: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/vvgngfrls/5.webp', background: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/hero/3.webp' },
  'ввгнг-frls-5x2-5': { card: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/vvgngfrls/6.webp', background: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/hero/4.webp' },
  'ввгнг-frls-5x4': { card: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/vvgngfrls/7.webp', background: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/hero/4.webp' },
  'кабельные-наконечники': { card: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/acs/1.webp', background: defaultProductHeroBackgroundImage },
  'муфты-соединительные': { card: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/acs/2.webp', background: defaultProductHeroBackgroundImage },
  'кабельные-лотки': { card: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/acs/3.webp', background: defaultProductHeroBackgroundImage },
  'гофра-пвx': { card: 'https://vvg.avecoenergy.pro/wp-content/themes/test/img/acs/4.webp', background: defaultProductHeroBackgroundImage },
};

function cableSlug(name) {
  return name
    .toLowerCase()
    .replaceAll(' ', '-')
    .replaceAll('(', '')
    .replaceAll(')', '')
    .replaceAll(',', '-')
    .replaceAll('х', 'x');
}

function parseCable(name) {
  const match = name.match(/(\d+)x([\d,]+)/);
  return {
    cores: match ? match[1] : '—',
    section: match ? match[2] : '—',
    isAccessory: !match,
  };
}

function allProducts() {
  return cableCatalog.flatMap((group) => group.sizes.map((size) => {
    const title = group.category === 'Аксессуары' ? size : `${group.category} ${size}`;
    const parsed = parseCable(title);
	      const slug = cableSlug(title);
    return {
      title,
      category: group.category,
      slug,
      images: cableProductImages[slug] || { card: defaultProductCardImage, background: defaultProductHeroBackgroundImage },      cores: parsed.cores,
		section: parsed.section,
      purpose: cablePurposes[parsed.section] || 'Силовые линии и стационарная прокладка',
      voltage: parsed.isAccessory ? '—' : '0,66 / 1 кВ',
      insulation: parsed.isAccessory ? 'по назначению' : 'ПВХ пластикат',
      shell: parsed.isAccessory ? 'по назначению' : 'ПВХ пластикат',
      conductor: parsed.isAccessory ? '—' : 'Медь',
      standard: parsed.isAccessory ? 'ГОСТ / ТУ производителя' : 'ГОСТ 31996-2012',
      temperature: parsed.isAccessory ? 'по паспорту' : 'от −50°C до +50°C',
    };
  }));
}

window.cableCatalog = cableCatalog;
window.cableProducts = allProducts();
window.cableProductImages = cableProductImages;
window.cableSlug = cableSlug;