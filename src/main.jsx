import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { MantineProvider } from '@mantine/core';
import { Provider } from 'react-redux';
import { store } from './store/store.js';
import ErrorBoundary from './components/ErrorBoundry.jsx';

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      defaultColorScheme="dark"
    >
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </MantineProvider>
  </Provider>
);
