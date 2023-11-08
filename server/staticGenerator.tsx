import { renderToString } from 'react-dom/server';
import { App } from '../src/app/ui/app/app';
import { history } from '../src/shared/router';
import { staticPages } from './staticPagesConfig';
import { getIndexHTMLTemplate, saveToFile, urlToFileName } from './utils';

async function staticGenerator({ url, getStaticData }) {
  // eslint-disable-next-line no-console
  console.log(`staticGenerator start for ${url}`);

  history.push(url);
  // 参考 Next.js 的 getStaticProps：https://nextjs.org/docs/pages/building-your-application/rendering/static-site-generation
  await getStaticData({ url });
  // eslint-disable-next-line no-console
  console.log(`staticGenerator getStaticData finish for ${url}`);

  const markup = renderToString(<App />);

  const fileName = urlToFileName(url);
  saveToFile(
    fileName,
    getIndexHTMLTemplate().replace(
      '<div id="root"></div>',
      `<div id="root">${markup}</div>`,
    ),
  );
  // eslint-disable-next-line no-console
  console.log(`staticGenerator finish for ${fileName}`);
}

async function start(pages) {
  // eslint-disable-next-line no-plusplus
  for (let index = 0; index < pages.length; index++) {
    const page = pages[index];
    try {
      // eslint-disable-next-line no-await-in-loop
      await staticGenerator(page);
    } catch (err) {
      console.error(`staticGenerator ERROR:`, err);
    }
  }
}

start(staticPages);
