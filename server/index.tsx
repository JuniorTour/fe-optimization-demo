import express from 'express';
import { DIST_CLIENT, PUBLIC_PATH } from '../webpack/constants';
import { markSSRStart } from './performance-mark';
import { serverRenderer } from './renderer';

const app = express();
const PORT = 3000;

app.use(PUBLIC_PATH, express.static(DIST_CLIENT));

app.get('*', (req, res) => {
  markSSRStart();
  serverRenderer(req, res);
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`SSR Server is listening on http://localhost:${PORT}`);
});
