import express from 'express';
import { DIST, PUBLIC_PATH } from '../webpack/constants';
import { markSSRStart } from './performance-mark';
import { serverRenderer } from './renderer';

const app = express();
const PORT = 3000;

app.use(PUBLIC_PATH, express.static(DIST));

app.get('*', (req, res) => {
  // 演示 performance.mark() 方法跨模块自由调用的特性
  markSSRStart({ reqUrl: req.url });
  serverRenderer(req, res);
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`SSR Server is listening on http://localhost:${PORT}`);
});
