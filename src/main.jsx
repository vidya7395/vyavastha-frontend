import { createRoot } from 'react-dom/client';
import '@mantine/core/styles.css'; // Mantine styles first
import '@mantine/dates/styles.css';
import './index.css'; // your custom styles
import App from './App.jsx';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { Provider } from 'react-redux';
import { store } from './store/store.js';
import ErrorBoundary from './components/ErrorBoundry.jsx';
import '@mantine/notifications/styles.css';

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      defaultColorScheme="dark"
    >
      <Notifications position="top-right" />
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </MantineProvider>
  </Provider>
);
