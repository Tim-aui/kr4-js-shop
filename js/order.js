// Получаем форму заявки на странице order.html.
const orderForm = document.getElementById('order-form');

// Обрабатываем отправку формы.
orderForm.addEventListener('submit', (event) => {
  // Отменяем стандартную отправку формы,
  // потому что backend пока не подключён.
  event.preventDefault();

  const fields = Array.from(orderForm.elements).filter((el) => el.willValidate);
  fields.forEach((el) => el.removeAttribute('aria-invalid'));

  // Проверяем встроенные HTML-ограничения формы.
  if (!orderForm.checkValidity()) {
    const invalid = fields.filter((el) => !el.checkValidity());
    invalid.forEach((el) => el.setAttribute('aria-invalid', 'true'));
    invalid[0].focus();

    orderForm.reportValidity();
    return;
  }

  // Передаём имя на страницу успешной отправки.
  const name = document.getElementById('order-name').value;
  window.location.href = 'success.html?name=' + encodeURIComponent(name);
});

const preselected = new URLSearchParams(window.location.search).get('product');
const productSelect = document.getElementById('order-product');

if (preselected && productSelect.querySelector(`option[value="${CSS.escape(preselected)}"]`)) {
  productSelect.value = preselected;
}
