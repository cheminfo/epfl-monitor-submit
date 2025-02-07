import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'react-science/styles/preflight.css';
import App from './App.jsx';
import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
