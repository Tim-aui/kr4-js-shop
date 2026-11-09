const navToggle = document.querySelector('.site-nav__toggle');
const siteNav = document.querySelector('.site-nav');

const tabletQuery = window.matchMedia('(min-width: 768px)');

function setMenuOpen(isOpen) {
  siteNav.classList.toggle('site-nav--open', isOpen);
  navToggle.setAttribute('aria-expanded', String(isOpen));
  navToggle.querySelector('.site-nav__toggle-text').textContent = isOpen ? 'Закрыть' : 'Меню';
}

if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
    setMenuOpen(!isOpen);

    if (!isOpen) {
      siteNav.querySelector('.site-nav__link').focus();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && siteNav.classList.contains('site-nav--open')) {
      setMenuOpen(false);
      navToggle.focus();
    }
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest('.site-header') && siteNav.classList.contains('site-nav--open')) {
      setMenuOpen(false);
    }
  });

  siteNav.addEventListener('click', (event) => {
    if (event.target.closest('.site-nav__link')) {
      setMenuOpen(false);
    }
  });

  tabletQuery.addEventListener('change', () => setMenuOpen(false));
}

const filters = document.querySelector('.catalog-filters');

const desktopQuery = window.matchMedia('(min-width: 1024px)');

if (filters) {
  const syncFilters = () => {
    filters.open = desktopQuery.matches;
  };

  syncFilters();
  desktopQuery.addEventListener('change', syncFilters);

  filters.querySelector('summary').addEventListener('click', (event) => {
    if (desktopQuery.matches) {
      event.preventDefault();
    }
  });
}
