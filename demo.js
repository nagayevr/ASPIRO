const chart = document.querySelector('#demo-chart');
const runButton = document.querySelector('#demo-run');
const resetButton = document.querySelector('#demo-reset');
const scenario = document.querySelector('#demo-scenario');
const feedback = document.querySelector('#demo-feedback');
const progressBar = document.querySelector('#demo-progress');

const metricFields = {
  fev1: document.querySelector('#demo-fev1'),
  fvc: document.querySelector('#demo-fvc'),
  ratio: document.querySelector('#demo-ratio'),
  pef: document.querySelector('#demo-pef'),
};

const step = 0.025;
const expirationDuration = 5.6;
const inspirationDuration = 2.8;
const peakTime = 0.15;
const coughTime = 1.4;
const pef = 8.4;
const expirationEnd = Math.round(expirationDuration / step);
const coughIndex = Math.round(coughTime / step);
const frameDuration = 4400;
let pendingFrame = 0;

function outflow(time, hasCough) {
  const sincePeak = time - peakTime;
  const baseline = sincePeak < 0
    ? pef * (time / peakTime) ** 0.6
    : pef * (0.84 * Math.exp(-sincePeak / 0.29) + 0.16 * Math.exp(-sincePeak));
  const cough = hasCough ? 3.2 * Math.exp(-(((time - coughTime) / 0.045) ** 2)) : 0;
  const taper = Math.min(1, Math.max(0, (expirationDuration - time) / 0.6));
  return (baseline + cough) * taper;
}

function makeSample(hasCough) {
  const points = [{ volume: 0, flow: 0 }];
  let volume = 0;
  let peakFlow = 0;
  let fev1 = 0;
  for (let index = 1; index <= expirationEnd; index += 1) {
    const flow = outflow(index * step, hasCough);
    volume += (points[index - 1].flow + flow) * step / 2;
    points.push({ volume, flow });
    peakFlow = Math.max(peakFlow, flow);
    if (index === Math.round(1 / step)) fev1 = volume;
  }

  const fvc = volume;
  const inspirationSteps = Math.round(inspirationDuration / step);
  for (let index = 1; index <= inspirationSteps; index += 1) {
    const phase = Math.PI * index / inspirationSteps;
    points.push({
      volume: fvc * (1 + Math.cos(phase)) / 2,
      flow: -fvc * Math.PI / (2 * inspirationDuration) * Math.sin(phase),
    });
  }

  return { points, hasCough, metrics: { fev1, fvc, ratio: fev1 / fvc, pef: peakFlow } };
}

const bounds = { left: 45, right: 605, top: 26, bottom: 224, minFlow: -3.25, maxFlow: 10, maxVolume: 5 };
const x = volume => bounds.left + (bounds.right - bounds.left) * volume / bounds.maxVolume;
const y = flow => bounds.top + (bounds.bottom - bounds.top) * (bounds.maxFlow - flow) / (bounds.maxFlow - bounds.minFlow);
const coordinate = point => x(point.volume).toFixed(2) + ' ' + y(point.flow).toFixed(2);
const labelColor = 'var(--demo-label, #abc0b7)';
const gridColor = 'var(--demo-grid, rgba(255,255,255,.10))';
const axisColor = 'var(--demo-axis, rgba(255,255,255,.24))';
const lineColor = 'var(--demo-line, #bdf668)';
const alertColor = 'var(--demo-alert, #ffd27b)';

function makeChart(width) {
  const height = Math.max(222, Math.round(width * 275 / 620));
  bounds.right = width - 15;
  bounds.bottom = height - 51;
  const vertical = [0, 1, 2, 3, 4, 5].map(volume => `
    <line x1="${x(volume)}" x2="${x(volume)}" y1="${bounds.top}" y2="${bounds.bottom}" stroke="${gridColor}" />
    <text x="${x(volume)}" y="${height - 29}" text-anchor="middle">${volume}</text>
  `).join('');
  const horizontal = [-2, 0, 2, 4, 6, 8, 10].map(flow => `
    <line x1="${bounds.left}" x2="${bounds.right}" y1="${y(flow)}" y2="${y(flow)}" stroke="${flow === 0 ? axisColor : gridColor}" />
    <text x="33" y="${y(flow) + 4}" text-anchor="end">${flow < 0 ? '−' + Math.abs(flow) : flow}</text>
  `).join('');
  chart.innerHTML = `
    <svg viewBox="0 0 ${width} ${height}" style="display:block;width:100%;height:auto"
      role="img" aria-labelledby="demo-chart-title demo-chart-description">
      <title id="demo-chart-title">Петля «поток — объём»</title>
      <desc id="demo-chart-description"></desc>
      <defs>
        <linearGradient id="demo-flow-fill" x1="0" x2="0" y1="0" y2="1">
          <stop stop-color="${lineColor}" stop-opacity=".21" />
          <stop offset="1" stop-color="${lineColor}" stop-opacity=".035" />
        </linearGradient>
      </defs>
      <g fill="${labelColor}" font-size="14" aria-hidden="true">
        ${vertical}
        ${horizontal}
        <text x="${bounds.left}" y="15">Поток, л/с</text>
        <text x="${bounds.right}" y="${height - 5}" text-anchor="end">Объём, л</text>
      </g>
      <path data-demo-area fill="url(#demo-flow-fill)" />
      <path data-demo-inspiration fill="none" stroke="${lineColor}" stroke-opacity=".45"
        stroke-width="2" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke" />
      <path data-demo-expiration fill="none" stroke="${lineColor}" stroke-width="2.5"
        stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke" />
      <circle data-demo-artifact r="4" fill="${alertColor}" stroke="#122522" stroke-width="1.5" visibility="hidden" />
    </svg>
  `;
  return {
    area: chart.querySelector('[data-demo-area]'),
    expiration: chart.querySelector('[data-demo-expiration]'),
    inspiration: chart.querySelector('[data-demo-inspiration]'),
    artifact: chart.querySelector('[data-demo-artifact]'),
    description: chart.querySelector('desc'),
  };
}

function format(value, decimals) {
  return new Intl.NumberFormat(document.documentElement.lang === 'en' ? 'en-US' : 'ru-RU', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

function showMetrics(sample) {
  const metrics = sample && !sample.hasCough ? sample.metrics : null;
  const values = metrics ? {
    fev1: format(metrics.fev1, 2),
    fvc: format(metrics.fvc, 2),
    ratio: format(metrics.ratio * 100, 0) + '%',
    pef: format(metrics.pef, 1),
  } : {};
  for (const [name, field] of Object.entries(metricFields)) {
    if (field) field.textContent = values[name] ?? '—';
  }
}

function showProgress(percent) {
  if (!progressBar) return;
  if (progressBar.tagName === 'PROGRESS') {
    progressBar.max = 100;
    progressBar.value = percent;
  } else {
    progressBar.setAttribute('aria-valuenow', String(percent));
    progressBar.style.setProperty('--demo-progress', percent + '%');
  }
}

function showFeedback(state, message) {
  if (!feedback) return;
  feedback.dataset.state = state;
  feedback.textContent = message;
}

if (chart && runButton && resetButton) {
  const chartWidth = width => Math.min(620, Math.max(240, Math.round(width || 620)));
  let width = chartWidth(chart.clientWidth);
  let plot = makeChart(width);
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let sample;
  let coordinates;
  let lastDrawnIndex = 0;

  function mapSampleToChart() {
    coordinates = sample.points.map(coordinate);
    plot.description.textContent = sample.hasCough
      ? document.documentElement.lang === 'en' ? 'Synthetic exhalation and inhalation curve. A sharp exhalation spike is marked with a yellow dot.' : 'Синтетическая кривая выдоха и вдоха. Резкий всплеск на выдохе отмечен жёлтой точкой.'
      : document.documentElement.lang === 'en' ? 'Synthetic curve. Exhalation is above the zero-flow line and inhalation is below it.' : 'Синтетическая кривая. Выдох проходит выше нулевой линии потока, а вдох — ниже.';
  }

  function draw(lastIndex) {
    lastDrawnIndex = lastIndex;
    const lastExpirationIndex = Math.min(lastIndex, expirationEnd);
    const lastExpirationVolume = sample.points[lastExpirationIndex].volume;
    const expirationPath = 'M' + coordinates.slice(0, lastExpirationIndex + 1).join(' L');
    plot.expiration.setAttribute('d', expirationPath);
    plot.area.setAttribute('d', expirationPath + ' L' + x(lastExpirationVolume) + ' ' + y(0) + ' Z');
    plot.inspiration.setAttribute('d', lastIndex > expirationEnd
      ? 'M' + coordinates.slice(expirationEnd, lastIndex + 1).join(' L')
      : '');
    if (sample.hasCough && lastIndex >= coughIndex) {
      const point = sample.points[coughIndex];
      plot.artifact.setAttribute('cx', x(point.volume));
      plot.artifact.setAttribute('cy', y(point.flow));
      plot.artifact.setAttribute('visibility', 'visible');
    } else {
      plot.artifact.setAttribute('visibility', 'hidden');
    }
  }

  function finish() {
    draw(coordinates.length - 1);
    showProgress(100);
    showMetrics(sample);
    if (sample.hasCough) {
      showFeedback('artifact', document.documentElement.lang === 'en' ? 'A cough occurs at 1.4 s in this example. Metrics for this attempt are hidden.' : 'В примере кашель на 1,4 с. Показатели этой попытки скрыты.');
    } else {
      showFeedback('ready', document.documentElement.lang === 'en' ? 'This example shows an exhalation without artifacts.' : 'В этом примере выдох без артефактов.');
    }
    runButton.disabled = false;
  }

  function preview() {
    cancelAnimationFrame(pendingFrame);
    sample = makeSample(scenario?.value === 'cough');
    mapSampleToChart();
    finish();
  }

  runButton.addEventListener('click', () => {
    if (motion.matches) {
      finish();
      return;
    }
    runButton.disabled = true;
    showFeedback('running', document.documentElement.lang === 'en' ? 'Playing example…' : 'Воспроизведение примера…');
    showMetrics(null);
    showProgress(0);
    draw(0);
    const start = performance.now();
    function tick(timestamp) {
      const fraction = Math.min(1, (timestamp - start) / frameDuration);
      if (fraction >= 1) {
        finish();
        return;
      }
      draw(Math.max(0, Math.floor(fraction * (coordinates.length - 1))));
      showProgress(Math.max(0, Math.floor(fraction * 100)));
      pendingFrame = requestAnimationFrame(tick);
    }
    pendingFrame = requestAnimationFrame(tick);
  });

  resetButton.addEventListener('click', preview);
  scenario?.addEventListener('change', preview);
  preview();
  window.addEventListener('aspiro-language-change', () => { plot = makeChart(width); mapSampleToChart(); finish(); });

  if (typeof ResizeObserver === 'function') {
    const observer = new ResizeObserver(([entry]) => {
      const nextWidth = chartWidth(entry.contentRect.width);
      if (nextWidth === width) return;
      width = nextWidth;
      plot = makeChart(width);
      mapSampleToChart();
      draw(lastDrawnIndex);
    });
    observer.observe(chart);
  }
}
