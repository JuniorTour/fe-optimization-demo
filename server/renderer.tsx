import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouterContext } from 'react-router';
import { App } from '../src/app/ui/app/app';
import { history } from '../src/shared/router';
import { markSSREnd, measureSSRRenderDuration } from './performance-mark';
import { staticPagesURL } from './staticPagesConfig';
import {
  StaticPagesFolderName,
  getDistHTMLContent,
  getIndexHTMLTemplate,
  urlToFileName,
} from './utils';

export async function serverRenderer(req, res) {
  const context: StaticRouterContext = {};

  const reqUrl = req.url;
  if (staticPagesURL.includes(reqUrl)) {
    // eslint-disable-next-line no-console
    console.log(`SSG run for: (${reqUrl})`);

    res.send(
      getDistHTMLContent(`./${StaticPagesFolderName}/${urlToFileName(reqUrl)}`),
    );

    return;
  }

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
