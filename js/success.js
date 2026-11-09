// Читаем имя из адресной строки (success.html?name=...).
const params = new URLSearchParams(window.location.search);
const name = params.get('name');

// Если имя передано, добавляем его в текст благодарности.
if (name) {
  document.getElementById('success-text').textContent =
    'Спасибо, ' + name + '! Мы получили вашу заявку и свяжемся с вами в ближайшее время.';
}
