import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouterContext } from 'react-router';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { App } from '../src/app/ui/app/app';
import { history } from '../src/shared/router';
import { DIST } from '../webpack/constants';
import { markSSREnd, measureSSRRenderDuration } from './performance-mark';

function getIndexHTMLTemplate() {
  return readFileSync(resolve(DIST, 'index.html'), {
    encoding: 'utf-8',
  });
}

export function serverRenderer(req, res) {
  const context: StaticRouterContext = {};

  const reqUrl = req.url;
  history.push(reqUrl);

  const markup = renderToString(<App />);

  // eslint-disable-next-line no-console
  console.log(`markup=${markup.substring(0, 100)}`);

  markSSREnd();

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

  measureSSRRenderDuration();
}
