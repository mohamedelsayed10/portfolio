/**
 * Mohamed Shehata Portfolio - Main JavaScript
 */

(function() {
  "use strict";

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim();
    if (all) {
      return [...document.querySelectorAll(el)];
    } else {
      return document.querySelector(el);
    }
  };

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all);
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener));
      } else {
        selectEl.addEventListener(type, listener);
      }
    }
  };

  /**
   * Easy on scroll event listener
   */
  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener);
  };

  /**
   * Navbar links active state on scroll
   */
  let navbarlinks = select('#navbar .scrollto', true);
  const navbarlinksActive = () => {
    let position = window.scrollY + 200;
    navbarlinks.forEach(navbarlink => {
      if (!navbarlink.hash) return;
      let section = select(navbarlink.hash);
      if (!section) return;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        navbarlink.classList.add('active');
      } else {
        navbarlink.classList.remove('active');
      }
    });
  };
  window.addEventListener('load', navbarlinksActive);
  onscroll(document, navbarlinksActive);

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    let target = select(el);
    if (!target) return;
    let elementPos = target.offsetTop;
    window.scrollTo({
      top: elementPos,
      behavior: 'smooth'
    });
  };

  /**
   * Back to top button
   */
  let backtotop = select('.back-to-top');
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 150) {
        backtotop.classList.add('active');
      } else {
        backtotop.classList.remove('active');
      }
    };
    window.addEventListener('load', toggleBacktotop);
    onscroll(document, toggleBacktotop);
  }

  /**
   * Mobile nav toggle
   */
  on('click', '.mobile-nav-toggle', function(e) {
    select('body').classList.toggle('mobile-nav-active');
    this.classList.toggle('bi-list');
    this.classList.toggle('bi-x');
  });

  /**
   * Scroll with offset on links with a class name .scrollto
   */
  on('click', '.scrollto', function(e) {
    if (select(this.hash)) {
      e.preventDefault();

      let body = select('body');
      if (body.classList.contains('mobile-nav-active')) {
        body.classList.remove('mobile-nav-active');
        let navbarToggle = select('.mobile-nav-toggle');
        if (navbarToggle) {
          navbarToggle.classList.toggle('bi-list');
          navbarToggle.classList.toggle('bi-x');
        }
      }
      scrollto(this.hash);
    }
  }, true);

  /**
   * Scroll with offset on page load with hash links in the url
   */
  window.addEventListener('load', () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash);
      }
    }
  });

  /**
   * Hero Typed.js effect
   */
  const typedEl = select('.typed');
  if (typedEl && typeof Typed !== 'undefined') {
    let typed_strings = typedEl.getAttribute('data-typed-items');
    if (typed_strings) {
      typed_strings = typed_strings.split(',');
      new Typed('.typed', {
        strings: typed_strings,
        loop: true,
        typeSpeed: 70,
        backSpeed: 40,
        backDelay: 2200
      });
    }
  }

  /**
   * Portfolio filtering (Isotope + Vanilla Fallback)
   */
  window.addEventListener('load', () => {
    let portfolioContainer = select('.portfolio-container');
    let portfolioFilters = select('#portfolio-filters li', true);

    if (portfolioContainer && portfolioFilters.length > 0) {
      let portfolioIsotope = null;

      if (typeof Isotope !== 'undefined') {
        portfolioIsotope = new Isotope(portfolioContainer, {
          itemSelector: '.portfolio-item',
          layoutMode: 'fitRows'
        });
      }

      const applyFilter = (filterValue) => {
        if (portfolioIsotope) {
          portfolioIsotope.arrange({ filter: filterValue });
          if (typeof AOS !== 'undefined') {
            portfolioIsotope.on('arrangeComplete', function() {
              AOS.refresh();
            });
          }
        } else {
          // Native fallback filter
          let items = select('.portfolio-item', true);
          items.forEach(item => {
            if (filterValue === '*' || item.matches(filterValue)) {
              item.style.display = 'block';
            } else {
              item.style.display = 'none';
            }
          });
        }
      };

      on('click', '#portfolio-filters li', function(e) {
        e.preventDefault();
        portfolioFilters.forEach(el => el.classList.remove('filters-active'));
        this.classList.add('filters-active');
        let filterValue = this.getAttribute('data-filter') || '*';
        applyFilter(filterValue);
      }, true);
    }
  });

  /**
   * Lightbox
   */
  if (typeof GLightbox !== 'undefined') {
    GLightbox({
      selector: '.portfolio-lightbox',
      width: '90%',
      height: '90vh'
    });
  }

  /**
   * Animation on scroll (AOS)
   */
  window.addEventListener('load', () => {
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false
      });
    }
  });

  /**
   * Pure Counter
   */
  if (typeof PureCounter !== 'undefined') {
    new PureCounter();
  }

})();
