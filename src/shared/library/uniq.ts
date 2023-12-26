/*
调整写法，以避免TS类型报错：
ERROR in ./shared/library/uniq.ts
Module build failed (from ../node_modules/esbuild-loader/dist/index.cjs):
Error: Transform failed with 2 errors:
fe-optimization-demo\src\shared\library\uniq.ts:1:38: ERROR: The character ">" is not valid inside a JSX element
fe-optimization-demo\src\shared\library\uniq.ts:2:0: ERROR: Unexpected end of file before a closing "T" tag
    at failureErrorWithLog (fe-optimization-demo\node_modules\esbuild\lib\main.js:1650:15)
*/
export function uniq<T>(x: T[]): T[] {
  return Array.from(new Set(x));
}
