import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouterContext } from 'react-router';
import { StaticRouter } from 'react-router-dom';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { App } from '../src/app/ui/app/app';
import { DIST } from '../webpack/constants';

function getIndexHTMLTemplate() {
  return readFileSync(resolve(DIST, 'index.html'), {
    encoding: 'utf-8',
  });
}

export function serverRenderer(req, res) {
  const context: StaticRouterContext = {};

  const markup = renderToString(
    <StaticRouter context={context} location={req.url}>
      <App />
    </StaticRouter>,
  );

  // eslint-disable-next-line no-console
  console.log(`markup=${markup.substring(0, 100)}`);

  if (context.url) {
    // eslint-disable-next-line no-console
    console.log(`context?.url=${context?.url}`);
    // 某处渲染了 `<Redirect />` 组件
    res.redirect(301, context.url);
  } else {
    res.send(
      getIndexHTMLTemplate().replace(
        '<div id="root"></div>',
        `<div id="root">${markup}</div>`,
      ),
    );
  }
}
