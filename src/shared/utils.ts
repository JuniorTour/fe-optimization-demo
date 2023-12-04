import UAParser from 'ua-parser-js';

async function reportCount({ name, labels, help, sampleRate = 1 }) {
  if (Math.random() > sampleRate) {
    return;
  }
  await fetch('http://localhost:4001/counter-metric', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      help,
      labels,
    }),
  });
}

export function reportUAInfo() {
  const parser = new UAParser();
  const ret = parser.getResult();
  // console.log(`getUAInfo ret=${JSON.stringify(ret)}`);
  reportCount({
    name: 'UAInfo',
    help: 'User Agent Info of fe-optimizaion-demo',
    labels: {
      browser: `${ret.browser.name}_${ret.browser.major}`,
      os: `${ret.os.name}_${ret.os.version}`,
    },
    sampleRate: 0.01,
    // sampleRate: 1,
  });
}
