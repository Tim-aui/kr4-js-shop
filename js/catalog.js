const catalogGrid = document.querySelector('#catalog-grid');
const catalogFiltersForm = document.querySelector('#catalog-filters-form');
const searchInput = document.querySelector('#search-input');
const categorySelect = document.querySelector('#category-select');
const sortSelect = document.querySelector('#sort-select');
const catalogCount = document.querySelector('#catalog-count');
const catalogEmpty = document.querySelector('#catalog-empty');
const catalogResetButton = document.querySelector('#catalog-reset');

const badgeLabels = {
  hit: 'Хит',
  new: 'Новинка',
  discount: 'Скидка'
};

function createProductCard(product) {
  const card = document.createElement('article');
  card.classList.add('product-card');

  if (product.badge === 'hit') {
    card.classList.add('product-card--featured');
  }

  if (product.badge === 'discount') {
    card.classList.add('product-card--discount');
  }

  if (!product.isAvailable) {
    card.classList.add('product-card--unavailable');
  }

  const image = document.createElement('img');
  const imageBase = 'images/products/' + product.image;
  const largestSize = product.sizes[product.sizes.length - 1];

  image.classList.add('product-card__image');
  image.src = imageBase + '-' + largestSize + '.webp';
  image.srcset = product.sizes.map((size) => imageBase + '-' + size + '.webp ' + size + 'w').join(', ');
  image.sizes = '(min-width: 1024px) 340px, (min-width: 600px) calc(50vw - 70px), calc(100vw - 66px)';
  image.alt = product.title;
  image.width = 640;
  image.height = 480;
  image.loading = 'lazy';

  card.append(image);

  if (product.badge) {
    const badge = document.createElement('span');
    badge.classList.add('product-card__badge', 'product-card__badge--' + product.badge);
    badge.textContent = badgeLabels[product.badge];
    card.append(badge);
  }

  const title = document.createElement('h3');
  title.classList.add('product-card__title');
  title.textContent = product.title;

  const description = document.createElement('p');
  description.classList.add('product-card__description');
  description.textContent = product.description;

  const stock = document.createElement('p');
  stock.classList.add('product-card__stock');
  stock.textContent = product.isAvailable ? 'В наличии' : 'Нет в наличии';

  if (!product.isAvailable) {
    stock.classList.add('product-card__stock--out');
  }

  const price = document.createElement('p');
  price.classList.add('product-card__price');
  price.textContent = 'Цена: ' + formatPrice(product.price);

  const actions = document.createElement('div');
  actions.classList.add('product-card__actions');

  const link = document.createElement('a');
  link.classList.add('button', 'button--secondary');
  link.href = 'product.html?id=' + product.id;
  link.textContent = 'Подробнее';

  const linkHidden = document.createElement('span');
  linkHidden.classList.add('visually-hidden');
  linkHidden.textContent = ' о товаре ' + product.title;
  link.append(linkHidden);

  const cartButton = document.createElement('button');
  cartButton.type = 'button';
  cartButton.classList.add('button', 'button--primary', 'add-to-cart');
  cartButton.dataset.id = product.id;

  if (product.isAvailable) {
    cartButton.textContent = 'В корзину';
    cartButton.setAttribute('aria-label', 'В корзину: ' + product.title);
  } else {
    cartButton.textContent = 'Нет в наличии';
    cartButton.disabled = true;
  }

  actions.append(link, cartButton);
  card.append(title, description, stock, price, actions);

  return card;
}

function getVisibleProducts() {
  const query = searchInput.value.trim().toLowerCase();
  const category = categorySelect.value;
  const sortType = sortSelect.value;

  let result = products.filter((product) => product.title.toLowerCase().includes(query));

  if (category !== 'all') {
    result = result.filter((product) => product.category === category);
  }

  const sortedProducts = [...result];

  if (sortType === 'price-asc') {
    sortedProducts.sort((a, b) => a.price - b.price);
  } else if (sortType === 'price-desc') {
    sortedProducts.sort((a, b) => b.price - a.price);
  } else if (sortType === 'title-asc') {
    sortedProducts.sort((a, b) => a.title.localeCompare(b.title, 'ru'));
  }

  return sortedProducts;
}

function renderCatalog() {
  const visibleProducts = getVisibleProducts();

  catalogGrid.textContent = '';

  visibleProducts.forEach((product) => {
    catalogGrid.append(createProductCard(product));
  });

  catalogCount.textContent = 'Найдено товаров: ' + visibleProducts.length;
  catalogEmpty.hidden = visibleProducts.length > 0;
}

if (catalogGrid) {
  renderCatalog();

  searchInput.addEventListener('input', renderCatalog);
  categorySelect.addEventListener('change', renderCatalog);
  sortSelect.addEventListener('change', renderCatalog);

  catalogFiltersForm.addEventListener('submit', (event) => {
    event.preventDefault();
  });

  catalogResetButton.addEventListener('click', () => {
    catalogFiltersForm.reset();
    renderCatalog();
    searchInput.focus();
  });

  catalogGrid.addEventListener('click', (event) => {
    const button = event.target.closest('.add-to-cart');

    if (!button || button.disabled) {
      return;
    }

    addToCart(Number(button.dataset.id));

    button.textContent = 'Добавлено';
    button.classList.add('add-to-cart--added');

    setTimeout(() => {
      button.textContent = 'В корзину';
      button.classList.remove('add-to-cart--added');
    }, 1500);
  });
}
