import { StrictMode } from 'react';
import { hydrate } from 'react-dom';
import { App } from './app';

// 把 <BrowserRouter /> 声明在 <APP /> 外层，
// 避免 serverRenderer 端执行渲染，因为没有浏览器API，导致报错
hydrate(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById('root'),
);
