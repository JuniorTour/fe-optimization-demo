import { StrictMode } from 'react';
import { render } from 'react-dom';
import { App } from './app';
import { reportUAInfo } from './shared/utils';

render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById('root'),
);

reportUAInfo();
