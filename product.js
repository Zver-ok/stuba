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
    return {
      title,
      category: group.category,
      slug: cableSlug(title),
      cores: parsed.cores,
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
window.cableSlug = cableSlug;