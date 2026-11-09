const productParams = new URLSearchParams(window.location.search);
const productId = Number(productParams.get('id'));
const product = products.find((item) => item.id === productId) || products[0];

const productCartButton = document.querySelector('#product-cart-button');
const productCartMessage = document.querySelector('#product-cart-message');

document.title = product.title + ' — Учебный интернет-магазин';

document.querySelector('#product-breadcrumb').textContent = product.title;
document.querySelector('#product-title').textContent = product.title;
document.querySelector('#product-price').textContent = 'Цена: ' + formatPrice(product.price);
document.querySelector('#product-description').textContent = product.fullDescription;
document.querySelector('#spec-price').textContent = formatPrice(product.price);
document.querySelector('#spec-stock').textContent = product.isAvailable ? 'В наличии' : 'Нет в наличии';
document.querySelector('#spec-chip').textContent = product.chip;
document.querySelector('#spec-memory').textContent = product.memory;
document.querySelector('#spec-interface').textContent = product.interface;

const imageBase = 'images/products/' + product.image;
const createSrcset = (ext) => product.sizes.map((size) => imageBase + '-' + size + '.' + ext + ' ' + size + 'w').join(', ');
const largestSize = product.sizes[product.sizes.length - 1];

document.querySelector('#product-image-avif').srcset = createSrcset('avif');
document.querySelector('#product-image-webp').srcset = createSrcset('webp');

const productImage = document.querySelector('#product-image');
productImage.src = imageBase + '-' + largestSize + '.webp';
productImage.alt = product.title;

document.querySelectorAll('.product-table__row--current').forEach((row) => {
  row.classList.remove('product-table__row--current');
});

const compareRow = document.querySelector('[data-compare-id="' + product.id + '"]');

if (compareRow) {
  compareRow.classList.add('product-table__row--current');
}

document.querySelector('#product-order-link').href = 'order.html?product=' + product.id;

if (!product.isAvailable) {
  productCartButton.disabled = true;
  productCartButton.textContent = 'Нет в наличии';
}

productCartButton.addEventListener('click', () => {
  addToCart(product.id);
  productCartMessage.textContent = 'Товар добавлен в корзину. Товаров в корзине: ' + getCartCount() + '.';
  productCartMessage.classList.add('form-message--success');
});
