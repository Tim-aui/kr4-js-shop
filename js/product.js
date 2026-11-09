// Данные о товарах для страницы карточки товара.
// Ключ — значение параметра id в адресной строке (product.html?id=...).
const products = {
  'asus-rtx-5080': {
    name: 'Видеокарта ASUS GeForce RTX 5080 ROG Astral OC Edition',
    price: '164 990 руб.',
    sizes: [320, 500],
    description: 'Флагманская видеокарта ASUS на графическом чипе GeForce RTX 5080 с эффективной системой охлаждения ROG Astral. Подходит для игр в 4K и работы с графикой.',
    chip: 'GeForce RTX 5080',
    memory: '16 ГБ GDDR7',
    interface: 'PCIe 5.0',
  },
  'gigabyte-rtx-5070': {
    name: 'Видеокарта GIGABYTE GeForce RTX 5070 WINDFORCE OC SFF',
    price: '68 990 руб.',
    sizes: [320, 640, 1000],
    description: 'Производительная видеокарта GIGABYTE с системой охлаждения WINDFORCE для уверенного гейминга в 1440p.',
    chip: 'GeForce RTX 5070',
    memory: '12 ГБ GDDR7',
    interface: 'PCIe 5.0',
  },
  'powercolor-rx-9060-xt': {
    name: 'Видеокарта PowerColor AMD Radeon RX 9060 XT Reaper',
    price: '44 990 руб.',
    sizes: [320, 640, 1000],
    description: 'Видеокарта PowerColor на архитектуре AMD RDNA с компактным кулером Reaper для игр и работы.',
    chip: 'Radeon RX 9060 XT',
    memory: '16 ГБ GDDR6',
    interface: 'PCIe 5.0',
  },
  'kfa2-rtx-5060': {
    name: 'Видеокарта KFA2 GeForce RTX 5060 ROCK(X) OC 2FAN RGB White',
    price: '37 990 руб.',
    sizes: [320, 500],
    description: 'Видеокарта KFA2 с подсветкой RGB и двумя вентиляторами для тихой работы в играх.',
    chip: 'GeForce RTX 5060',
    memory: '8 ГБ GDDR7',
    interface: 'PCIe 5.0',
  },
  'palit-rtx-5060': {
    name: 'Видеокарта Palit GeForce RTX 5060 Dual',
    price: '35 990 руб.',
    sizes: [320, 640, 1000],
    description: 'Видеокарта Palit с двойным охлаждением для стабильного гейминга в Full HD.',
    chip: 'GeForce RTX 5060',
    memory: '8 ГБ GDDR7',
    interface: 'PCIe 5.0',
  },
  'gigabyte-rtx-5050': {
    name: 'Видеокарта GIGABYTE GeForce RTX 5050 WINDFORCE OC',
    price: '32 990 руб.',
    sizes: [320, 500],
    description: 'Компактная видеокарта GIGABYTE WINDFORCE для игр в Full HD и офисных задач.',
    chip: 'GeForce RTX 5050',
    memory: '8 ГБ GDDR6',
    interface: 'PCIe 5.0',
  },
  'msi-rtx-5050': {
    name: 'Видеокарта MSI GeForce RTX 5050 VENTUS 2X OC',
    price: '31 990 руб.',
    sizes: [320, 500],
    description: 'Видеокарта MSI VENTUS с двумя вентиляторами для игр и работы с графикой.',
    chip: 'GeForce RTX 5050',
    memory: '8 ГБ GDDR6',
    interface: 'PCIe 5.0',
  },
  'kfa2-rtx-3050': {
    name: 'Видеокарта KFA2 GeForce RTX 3050 X Black',
    price: '24 990 руб.',
    sizes: [320, 640, 1000],
    description: 'Видеокарта KFA2 для игр в Full HD и монтажа видео.',
    chip: 'GeForce RTX 3050',
    memory: '8 ГБ GDDR6',
    interface: 'PCIe 4.0',
  },
  'msi-gt-1030': {
    name: 'Видеокарта MSI GeForce GT 1030 AERO ITX OC',
    price: '8 990 руб.',
    sizes: [320, 500],
    description: 'Компактная видеокарта MSI для офисных задач и сборки медиацентра.',
    chip: 'GeForce GT 1030',
    memory: '2 ГБ GDDR5',
    interface: 'PCIe 3.0',
  },
  'kfa2-gt-710': {
    name: 'Видеокарта KFA2 GeForce GT 710',
    price: '4 990 руб.',
    sizes: [320, 500],
    description: 'Бюджетная видеокарта KFA2 для офисного ПК и вывода изображения.',
    chip: 'GeForce GT 710',
    memory: '2 ГБ DDR3',
    interface: 'PCIe 2.0',
  },
};

// Определяем идентификатор товара из адресной строки.
const params = new URLSearchParams(window.location.search);
const product = products[params.get('id')];

// Если товар найден, подставляем его данные в разметку страницы.
if (product) {
  document.title = product.name + ' — Учебный интернет-магазин';

  document.getElementById('product-breadcrumb').textContent = product.name;
  document.getElementById('product-title').textContent = product.name;
  document.getElementById('product-price').textContent = 'Цена: ' + product.price;
  document.getElementById('product-description').textContent = product.description;
  document.getElementById('spec-price').textContent = product.price;
  document.getElementById('spec-chip').textContent = product.chip;
  document.getElementById('spec-memory').textContent = product.memory;
  document.getElementById('spec-interface').textContent = product.interface;

  const base = 'images/products/' + params.get('id');
  const srcset = (ext) => product.sizes.map((w) => `${base}-${w}.${ext} ${w}w`).join(', ');
  const largest = product.sizes[product.sizes.length - 1];

  document.getElementById('product-image-avif').srcset = srcset('avif');
  document.getElementById('product-image-webp').srcset = srcset('webp');

  const image = document.getElementById('product-image');
  image.src = `${base}-${largest}.webp`;
  image.alt = product.name;

  document.querySelectorAll('.product-table__row--current')
    .forEach((row) => row.classList.remove('product-table__row--current'));

  const compareRow = document.querySelector(`[data-compare-id="${params.get('id')}"]`);
  if (compareRow) {
    compareRow.classList.add('product-table__row--current');
  }

  document.getElementById('product-order-link').href = 'order.html?product=' + params.get('id');
}
