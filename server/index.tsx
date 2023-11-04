import express from 'express';
import { DIST, PUBLIC_PATH } from '../webpack/constants';
import { serverRenderer } from './renderer';

const app = express();
const PORT = 3000;

app.use(PUBLIC_PATH, express.static(DIST));

app.get('*', serverRenderer);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`SSR Server is listening on http://localhost:${PORT}`);
});
