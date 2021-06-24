import { useEffect } from 'react';

const ScrollIntoView = (props) => {
  const { location } = props;

  useEffect(() => {
    if (!__CLIENT__) {
      return;
    }
    let count = 0;
    if (location.hash) {
      function switchToDocumentSidebarTab(hash) {
        const isEdit = location.pathname.endsWith('/edit');
        if (isEdit && hash.indexOf('fieldset') !== -1) {
          const form_tabs = document.querySelector(
            '.sidebar-container .formtabs',
          );
          const first_tab = form_tabs && form_tabs.firstElementChild;
          if (first_tab && !first_tab.classList.contains('active')) {
            first_tab.click();
          }
        }
      }
      const hash = location.hash.split('#')[1];
      function scrollIdIntoView() {
        count += 1;
        const obj = document.getElementById(window.decodeURIComponent(hash));
        if (obj) {
          switchToDocumentSidebarTab(hash);
          const parent = obj.closest('.field') || obj;
          document.querySelectorAll('.flash-effect').forEach(function (el) {
            el.classList.remove('flash-effect');
          });
          parent.scrollIntoView({ behavior: 'smooth', block: 'center' });
          window.setTimeout(() => parent.classList.add('flash-effect'), 10);
          window.clearInterval(id);
        }
        if (count > 40) {
          window.clearInterval(id);
        }
      }
      const id = window.setInterval(scrollIdIntoView, 250);
    }
  }, [location.hash]);

  return null;
};

export default ScrollIntoView;
