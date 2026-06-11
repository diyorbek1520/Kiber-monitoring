// React kutubxonasi komponentlarni yaratish uchun ishlatiladi.
import React from 'react';

// ReactDOM ilovani HTML ichidagi root elementga ulash uchun ishlatiladi.
import ReactDOM from 'react-dom/client';

// App asosiy ilova komponenti sifatida yuklanadi.
import App from './App.jsx';

// Umumiy CSS uslublari butun frontend dizayni uchun ulanadi.
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
