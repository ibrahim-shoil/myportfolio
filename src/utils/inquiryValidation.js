const NAME_RE = /^[\p{L}\p{M}]+(?:[\s'.-][\p{L}\p{M}]+)*$/u
const EMAIL_RE = /^[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+@([A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,63}$/i
const PHONE_RE = /^\+[1-9]\d{7,14}$/
const PLACEHOLDER_EMAIL_DOMAINS = new Set(['example.com', 'example.org', 'example.net', 'test.com'])

const PLACEHOLDER_NAMES = new Set([
  'anonymous', 'asdf', 'asdfgh', 'fake', 'guest', 'name', 'no name',
  'none', 'qwerty', 'test', 'testing', 'unknown', 'your name',
])

const KEYBOARD_RUNS = [
  '1234567890', '0987654321',
  'qwertyuiop', 'poiuytrewq',
  'asdfghjkl', 'lkjhgfdsa',
  'zxcvbnm', 'mnbvcxz',
]

export function normalizeName(value) {
  return String(value || '').normalize('NFC').trim().replace(/\s+/g, ' ')
}

export function isValidName(value) {
  const name = normalizeName(value)
  if (name.length < 2 || name.length > 60 || !NAME_RE.test(name)) return false

  const letters = name.match(/\p{L}/gu) || []
  if (letters.length < 2 || /(.)\1{3,}/iu.test(name)) return false

  const compact = name.toLowerCase().replace(/[^a-z0-9]/g, '')
  if (PLACEHOLDER_NAMES.has(name.toLowerCase())) return false
  const hasKeyboardRun = KEYBOARD_RUNS.some(run => {
    for (let index = 0; index <= run.length - 4; index += 1) {
      if (compact.includes(run.slice(index, index + 4))) return true
    }
    return false
  })
  if (hasKeyboardRun) return false

  const isLatinOnly = /^[\p{Script=Latin}\p{M}\s'.-]+$/u.test(name)
  if (isLatinOnly && letters.length >= 3 && !/[aeiouy]/i.test(name)) return false

  return true
}

export function normalizeEmail(value) {
  return String(value || '').trim().toLowerCase()
}

export function isValidEmail(value) {
  const email = normalizeEmail(value)
  if (email.length < 6 || email.length > 254 || email.includes('..')) return false
  if (!EMAIL_RE.test(email)) return false

  const [local, domain] = email.split('@')
  return local.length <= 64
    && !local.startsWith('.')
    && !local.endsWith('.')
    && !PLACEHOLDER_EMAIL_DOMAINS.has(domain)
}

export function normalizeCallingCode(value) {
  const digits = String(value || '').replace(/\D/g, '').slice(0, 4)
  return digits ? `+${digits}` : ''
}

export function normalizePhone(value) {
  const raw = String(value || '').trim()
  const leadingPlus = raw.startsWith('+') ? '+' : ''
  return leadingPlus + raw.replace(/\D/g, '')
}

export function isValidPhone(value) {
  return PHONE_RE.test(normalizePhone(value))
}

export function makeInternationalPhone(callingCode, localNumber) {
  const code = normalizeCallingCode(callingCode)
  const local = String(localNumber || '').replace(/\D/g, '').replace(/^0+/, '')
  return `${code}${local}`
}

export function isValidContact(value) {
  return isValidEmail(value) || isValidPhone(value)
}

export function normalizeContact(value) {
  return isValidEmail(value) ? normalizeEmail(value) : normalizePhone(value)
}
