import { StrictMode } from 'react';
import { render } from 'react-dom';
import { css } from '@emotion/react';

const dynamicColor = Math.random() % 2 === 0 ? 'darkgreen' : 'yellow';

render(
  <StrictMode>
    {/* 1. 对象风格 CIJ */}
    <div
      css={{
        fontSize: '32px',
        color: 'red',
      }}
    >
      CSS In JS DEMO
    </div>
    {/* 2. 字符串风格 CIJ */}
    <div
      css={css`
        background-color: hotpink;
        &:hover {
          color: ${dynamicColor};
        }
      `}
    >
      css prop 动态样式示例
    </div>
  </StrictMode>,
  document.getElementById('root'),
);
