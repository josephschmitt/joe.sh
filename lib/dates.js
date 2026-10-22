const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTH_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAY_LONG = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Parses the "Mon DD, YYYY HH:MMam" format Kirby content used, as UTC.
export function parseKirbyDate(value) {
  if (value instanceof Date) return value;
  if (!value) return null;
  const m = String(value).trim().match(/^([A-Za-z]+)\.?\s+(\d{1,2}),?\s+(\d{4})(?:\s+(\d{1,2}):(\d{2})\s*(am|pm)?)?$/i);
  if (!m) {
    const d = new Date(value);
    return isNaN(d) ? null : d;
  }
  const month = MONTHS.indexOf(m[1].slice(0, 3).toLowerCase());
  if (month < 0) return null;
  let hours = m[4] ? parseInt(m[4], 10) : 0;
  const minutes = m[5] ? parseInt(m[5], 10) : 0;
  const ampm = (m[6] || '').toLowerCase();
  if (ampm === 'pm' && hours < 12) hours += 12;
  if (ampm === 'am' && hours === 12) hours = 0;
  return new Date(Date.UTC(parseInt(m[3], 10), month, parseInt(m[2], 10), hours, minutes));
}

const pad = (n, len = 2) => String(n).padStart(len, '0');

// A subset of PHP's date() format characters, evaluated in UTC.
export function phpDate(date, format) {
  const d = date instanceof Date ? date : new Date(date);
  const H = d.getUTCHours();
  const h12 = H % 12 === 0 ? 12 : H % 12;
  const tokens = {
    d: pad(d.getUTCDate()),
    D: DAY_SHORT[d.getUTCDay()],
    j: String(d.getUTCDate()),
    l: DAY_LONG[d.getUTCDay()],
    F: MONTH_LONG[d.getUTCMonth()],
    M: MONTH_SHORT[d.getUTCMonth()],
    m: pad(d.getUTCMonth() + 1),
    n: String(d.getUTCMonth() + 1),
    Y: String(d.getUTCFullYear()),
    y: String(d.getUTCFullYear()).slice(-2),
    a: H < 12 ? 'am' : 'pm',
    A: H < 12 ? 'AM' : 'PM',
    g: String(h12),
    G: String(H),
    h: pad(h12),
    H: pad(H),
    i: pad(d.getUTCMinutes()),
    s: pad(d.getUTCSeconds()),
    O: '+0000',
    P: '+00:00',
    T: 'UTC',
    U: String(Math.floor(d.getTime() / 1000)),
  };
  tokens.r = `${tokens.D}, ${tokens.d} ${tokens.M} ${tokens.Y} ${tokens.H}:${tokens.i}:${tokens.s} ${tokens.O}`;
  tokens.c = `${tokens.Y}-${tokens.m}-${tokens.d}T${tokens.H}:${tokens.i}:${tokens.s}${tokens.P}`;
  let out = '';
  for (let i = 0; i < format.length; i++) {
    const ch = format[i];
    if (ch === '\\' && i + 1 < format.length) {
      out += format[++i];
    } else {
      out += ch in tokens ? tokens[ch] : ch;
    }
  }
  return out;
}
