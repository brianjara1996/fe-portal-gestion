if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
  window.addEventListener('unhandledrejection', (event) => {
    console.warn('Unhandled promise rejection (ignored in localhost):', event.reason);
    event.preventDefault();
  });
}

import("./App");