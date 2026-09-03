import crypto from 'crypto'

const DEFAULT_TTL_MS = 10 * 60 * 1000
const MAX_FUTURE_SKEW_MS = 30 * 1000

function parseQuestion(question) {
  const match = String(question || '')
    .match(/^(\d+)\s*\+\s*(\d+)$/)

  if (!match) return null

  const left = Number(match[1])
  const right = Number(match[2])

  if (
    !Number.isSafeInteger(left) ||
    !Number.isSafeInteger(right)
  ) {
    return null
  }

  return {
    normalized: `${left} + ${right}`,
    answer: left + right,
  }
}

function isHex(value, length) {
  return new RegExp(
    `^[0-9a-f]{${length}}$`,
    'i'
  ).test(String(value || ''))
}

export class ChallengeGuard {
  constructor({
    secret,
    ttlMs = DEFAULT_TTL_MS,
    now = () => Date.now(),
  } = {}) {
    const rawSecret =
      secret === undefined ||
      secret === null ||
      String(secret).length === 0
        ? crypto.randomBytes(32)
        : Buffer.from(String(secret))

    this.secret = crypto
      .createHash('sha256')
      .update(rawSecret)
      .digest()

    this.ttlMs = ttlMs
    this.now = now
    this.used = new Map()
  }

  cleanup(now = this.now()) {
    for (const [key, expiresAt] of this.used) {
      if (expiresAt <= now) {
        this.used.delete(key)
      }
    }
  }

  signature(question, nonce, issuedAt) {
    return crypto
      .createHmac('sha256', this.secret)
      .update(
        `${question}:${nonce}:${issuedAt}`
      )
      .digest('hex')
  }

  issue() {
    const left =
      crypto.randomInt(1, 9)

    const right =
      crypto.randomInt(1, 9)

    const question =
      `${left} + ${right}`

    const nonce =
      crypto.randomBytes(16)
        .toString('hex')

    const issuedAt =
      Math.trunc(this.now())

    const sig =
      this.signature(
        question,
        nonce,
        issuedAt
      )

    return {
      question,
      nonce,
      issuedAt,
      sig,
    }
  }

  verify({
    question,
    answer,
    nonce,
    issuedAt,
    sig,
  } = {}) {
    const parsed =
      parseQuestion(question)

    if (!parsed) return false

    if (
      !Number.isSafeInteger(
        Number(issuedAt)
      )
    ) {
      return false
    }

    const issued =
      Number(issuedAt)

    const now =
      this.now()

    const age =
      now - issued

    if (
      age < -MAX_FUTURE_SKEW_MS ||
      age > this.ttlMs
    ) {
      return false
    }

    if (!isHex(nonce, 32)) {
      return false
    }

    if (!isHex(sig, 64)) {
      return false
    }

    const suppliedAnswer =
      Number(answer)

    if (
      !Number.isSafeInteger(
        suppliedAnswer
      ) ||
      suppliedAnswer !==
        parsed.answer
    ) {
      return false
    }

    const expected =
      this.signature(
        parsed.normalized,
        nonce,
        issued
      )

    const suppliedBuffer =
      Buffer.from(sig, 'hex')

    const expectedBuffer =
      Buffer.from(expected, 'hex')

    if (
      suppliedBuffer.length !==
      expectedBuffer.length
    ) {
      return false
    }

    if (
      !crypto.timingSafeEqual(
        suppliedBuffer,
        expectedBuffer
      )
    ) {
      return false
    }

    this.cleanup(now)

    const replayKey =
      `${nonce}:${issued}`

    if (
      this.used.has(replayKey)
    ) {
      return false
    }

    this.used.set(
      replayKey,
      issued + this.ttlMs
    )

    return true
  }
}
