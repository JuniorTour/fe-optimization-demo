import fetch from 'node-fetch';

const SSRRenderMark = 'SSRRenderMarks';
const SSRRenderMarks = {
  start: `${SSRRenderMark}Start`,
  end: `${SSRRenderMark}End`,
};

function reportGauge(name, help, labels, value) {
  fetch('http://localhost:4001/gauge-metric', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      help,
      labels,
      value,
    }),
  });
}

export function markSSRStart(detail?) {
  performance.mark(SSRRenderMarks.start, { detail });
}
export function markSSREnd(detail?) {
  performance.mark(SSRRenderMarks.end, { detail });
}

const SSRRenderDurationName = 'ssrRenderDuration';
export function measureSSRRenderDuration() {
  const ret = performance.measure(SSRRenderDurationName, {
    start: SSRRenderMarks.start,
    end: SSRRenderMarks.end,
  });

  // 还可以通过 getEntriesByName 获取请求URL reqUrl
  // performance.getEntriesByName(SSRRenderMarks.start)?.[0].detail.reqUrl

  reportGauge(SSRRenderDurationName, `SSR render time cost`, {}, ret.duration);
}
