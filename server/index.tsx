import { renderToString } from 'react-dom/server';
import express from 'express';

const app = express();
const PORT = 3000;

app.get('*', (req, res) => {
  const reqURL = req.url;
  const markup = renderToString(<div>Hello SSR! 你请求的URL是${reqURL}</div>);

  // eslint-disable-next-line no-console
  console.log(`markup=${markup.substring(0, 100)}`);
  res.send(`
<!DOCTYPE html>
<html>
  <head>
    <title>SSR Example</title>
  </head>
  <body>
    <div id="root">${markup}</div>
    <script src="/bundle.js"></script>
  </body>
</html>
  `);
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`SSR Server is listening on http://localhost:${PORT}`);
});
