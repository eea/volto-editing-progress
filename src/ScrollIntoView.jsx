import React, { useEffect } from 'react';

const ScrollIntoView = (props) => {
  const { location } = props;

  useEffect(() => {
    let count = 0;
    if (location.hash) {
      function scrollIdIntoView() {
        count += 1;
        const obj = document.getElementById(
          window.decodeURIComponent(location.hash.split('#')[1]),
        );
        if (obj) {
          const parent = obj.closest('.field');
          parent.scrollIntoView({ behavior: 'smooth', block: 'center' });
          parent.classList.add('flash-effect');
          window.clearInterval(id);
        }
        if (count > 40) {
          window.clearInterval(id);
        }
      }
      const id = window.setInterval(scrollIdIntoView, 250);
    }
  }, [location?.hash, __CLIENT__]);

  return null;
};

export default ScrollIntoView;
