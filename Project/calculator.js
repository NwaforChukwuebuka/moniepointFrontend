'use strict';

const resultEl    = document.getElementById('result');
const expressionEl = document.getElementById('expression');
const calcEl      = document.querySelector('.calculator');

// ── State ──────────────────────────────────────────────────────────────────
let state = {
  current:     '0',     // what's shown on the display
  previous:    '',      // left operand as string
  operator:    null,    // pending operator symbol
  justEvaled:  false,   // true right after = was pressed
  memory:      0,       // M storage
};

// ── Display helpers ─────────────────────────────────────────────────────────
function formatNumber(str) {
  // Don't format if it contains an operator expression (expression line)
  if (/[+\-×÷]/.test(str)) return str;

  const negative = str.startsWith('-');
  const abs = negative ? str.slice(1) : str;
  const [intPart, decPart] = abs.split('.');

  const formatted = Number(intPart).toLocaleString('en-US');
  let result = negative ? '-' + formatted : formatted;
  if (decPart !== undefined) result += '.' + decPart;
  return result;
}

function updateDisplay() {
  const formatted = formatNumber(state.current);
  resultEl.textContent = formatted;

  // Shrink font for long numbers
  const len = formatted.replace(/[,.-]/g, '').length;
  resultEl.className = 'result';
  if (len >= 12) resultEl.classList.add('xsmall');
  else if (len >= 9) resultEl.classList.add('small');

  // Expression line
  if (state.operator && state.previous !== '') {
    expressionEl.textContent = formatNumber(state.previous) + ' ' + state.operator;
  } else {
    expressionEl.textContent = '';
  }
}

// ── Core logic ───────────────────────────────────────────────────────────────

// Parse display value (remove commas)
function parseDisplay(str) {
  return parseFloat(str.replace(/,/g, ''));
}

function calculate(a, op, b) {
  switch (op) {
    case '+': return a + b;
    case '−': return a - b;
    case '×': return a * b;
    case '÷':
      if (b === 0) return 'Error';
      return a / b;
    default: return b;
  }
}

function cleanResult(num) {
  if (num === 'Error') return 'Error';
  // Avoid floating-point noise (e.g. 0.1+0.2)
  const fixed = parseFloat(num.toPrecision(12));
  return String(fixed);
}

// ── Button handlers ──────────────────────────────────────────────────────────

function handleDigit(val) {
  if (state.justEvaled) {
    // Start fresh after =
    state.current    = val === '.' ? '0.' : val;
    state.previous   = '';
    state.operator   = null;
    state.justEvaled = false;
    return;
  }

  if (val === '00') {
    if (state.current === '0') return; // no leading zeros
    state.current += '00';
    return;
  }

  if (val === '.') {
    if (state.current.includes('.')) return; // already has decimal
    state.current += '.';
    return;
  }

  if (state.current === '0') {
    state.current = val;
  } else {
    // Limit to 12 digits (raw, ignoring sign/dot)
    const digits = state.current.replace(/[^0-9]/g, '');
    if (digits.length >= 12) return;
    state.current += val;
  }
}

function handleOperator(op) {
  state.justEvaled = false;

  // If there's already a pending operation, evaluate it first
  if (state.operator && state.previous !== '') {
    const a = parseDisplay(state.previous);
    const b = parseDisplay(state.current);
    const res = calculate(a, state.operator, b);
    if (res === 'Error') { handleError(); return; }
    state.current  = cleanResult(res);
    state.previous = '';
  }

  state.previous = state.current;
  state.operator = op;
  state.current  = '0';
}

function handleEquals() {
  if (!state.operator || state.previous === '') return;

  const a   = parseDisplay(state.previous);
  const b   = parseDisplay(state.current);
  const res = calculate(a, state.operator, b);

  expressionEl.textContent =
    formatNumber(state.previous) + ' ' + state.operator + ' ' + formatNumber(state.current) + ' =';

  if (res === 'Error') { handleError(); return; }

  state.current    = cleanResult(res);
  state.previous   = '';
  state.operator   = null;
  state.justEvaled = true;
}

function handleClear() {
  state.current    = '0';
  state.previous   = '';
  state.operator   = null;
  state.justEvaled = false;
  expressionEl.textContent = '';
}

function handleBackspace() {
  if (state.justEvaled) return;
  if (state.current.length === 1 || state.current === '-0') {
    state.current = '0';
  } else {
    state.current = state.current.slice(0, -1);
    if (state.current === '-') state.current = '0';
  }
}

function handlePercent() {
  const num = parseDisplay(state.current);
  if (state.operator && state.previous !== '') {
    // e.g. 200 + 10% → 200 + 20
    const base = parseDisplay(state.previous);
    state.current = cleanResult((base * num) / 100);
  } else {
    state.current = cleanResult(num / 100);
  }
  state.justEvaled = false;
}

function handleSign() {
  const num = parseDisplay(state.current);
  if (num === 0) return;
  state.current = cleanResult(-num);
}

// Memory
function handleMemory(action) {
  const cur = parseDisplay(state.current);
  switch (action) {
    case 'mc':
      state.memory = 0;
      calcEl.classList.remove('has-memory');
      break;
    case 'mr':
      state.current    = cleanResult(state.memory);
      state.justEvaled = false;
      break;
    case 'm+':
      state.memory += cur;
      calcEl.classList.add('has-memory');
      break;
    case 'm-':
      state.memory -= cur;
      calcEl.classList.toggle('has-memory', state.memory !== 0);
      break;
  }
}

function handleError() {
  resultEl.textContent = 'Error';
  expressionEl.textContent = '';
  calcEl.classList.add('shake');
  calcEl.addEventListener('animationend', () => calcEl.classList.remove('shake'), { once: true });
  // Auto-clear after a moment
  setTimeout(() => {
    state.current    = '0';
    state.previous   = '';
    state.operator   = null;
    state.justEvaled = false;
    updateDisplay();
  }, 1200);
}

// ── Event listeners ──────────────────────────────────────────────────────────

document.querySelector('.buttons').addEventListener('click', (e) => {
  const btn = e.target.closest('.btn');
  if (!btn) return;

  const action = btn.dataset.action;
  const value  = btn.dataset.value;

  if (action === 'clear')     { handleClear();         }
  else if (action === 'backspace') { handleBackspace(); }
  else if (action === 'percent')   { handlePercent();  }
  else if (action === 'sign')      { handleSign();     }
  else if (action === 'equals')    { handleEquals();   }
  else if (['mc','mr','m+','m-'].includes(action)) { handleMemory(action); }
  else if (value && ['+', '−', '×', '÷'].includes(value)) { handleOperator(value); }
  else if (value !== undefined) { handleDigit(value); }

  updateDisplay();
});

// ── Keyboard support ─────────────────────────────────────────────────────────
document.addEventListener('keydown', (e) => {
  const k = e.key;

  if (k >= '0' && k <= '9') { handleDigit(k); }
  else if (k === '.')  { handleDigit('.'); }
  else if (k === '+')  { handleOperator('+'); }
  else if (k === '-')  { handleOperator('−'); }
  else if (k === '*')  { handleOperator('×'); }
  else if (k === '/')  { e.preventDefault(); handleOperator('÷'); }
  else if (k === '%')  { handlePercent(); }
  else if (k === 'Enter' || k === '=') { handleEquals(); }
  else if (k === 'Backspace') { handleBackspace(); }
  else if (k === 'Escape' || k === 'Delete') { handleClear(); }
  else return;

  updateDisplay();
});

// ── Init ──────────────────────────────────────────────────────────────────────
updateDisplay();
