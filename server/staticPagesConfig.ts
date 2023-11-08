import { getArticleFx } from '../src/pages/article/model/store';

export const staticPagesURL = [
  '/article/If-we-quantify-the-alarm-we-can-get-to-the-FTP-pixel-through-the-online-SSL-interface!-120863',
  '/article/You-cant-transmit-the-firewall-without-copying-the-1080p-SDD-interface!-120863',
];

async function articlPageGetStaticData({ url }) {
  await getArticleFx(url.split('article/')?.[1]);
}

export const staticPages = [
  {
    url: staticPagesURL[0],
    getStaticData: articlPageGetStaticData,
  },
  {
    url: staticPagesURL[1],
    getStaticData: articlPageGetStaticData,
  },
];
