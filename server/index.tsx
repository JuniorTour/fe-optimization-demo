import express from 'express';
import { serverRenderer } from './renderer';

const app = express();
const PORT = 3000;

app.get('*', serverRenderer);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`SSR Server is listening on http://localhost:${PORT}`);
});
