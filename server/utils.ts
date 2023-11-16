import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { resolve } from 'path';
import { DIST } from '../webpack/constants';

export const StaticPagesFolderName = 'static-pages';

export function getFileContent(filePath) {
  return readFileSync(filePath, {
    encoding: 'utf-8',
  });
}

export function getDistHTMLContent(filePath) {
  return getFileContent(resolve(DIST, filePath));
}

export function getIndexHTMLTemplate() {
  return getDistHTMLContent('./client/index.html');
}

export function saveToFile(name, content) {
  const dir = resolve(__dirname, '../dist/static-pages');
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  return writeFileSync(resolve(dir, name), content);
}

export function urlToFileName(url, ext = 'html') {
  return `${url.split('/').pop()}.${ext}`;
}
