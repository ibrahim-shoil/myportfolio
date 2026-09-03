import test from 'node:test'
import assert from 'node:assert/strict'

import {
  ChallengeGuard,
} from '../server/challengeGuard.mjs'

function answerOf(question) {
  const [left, right] =
    question
      .split('+')
      .map(value =>
        Number(value.trim())
      )

  return left + right
}

test(
  'issued challenge does not expose the answer',
  () => {
    const guard =
      new ChallengeGuard({
        secret: 'test-secret',
      })

    const challenge =
      guard.issue()

    assert.equal(
      Object.prototype.hasOwnProperty.call(
        challenge,
        'answer'
      ),
      false
    )

    assert.equal(
      typeof challenge.issuedAt,
      'number'
    )
  }
)

test(
  'valid challenge succeeds exactly once',
  () => {
    const guard =
      new ChallengeGuard({
        secret: 'test-secret',
      })

    const challenge =
      guard.issue()

    const payload = {
      ...challenge,
      answer:
        answerOf(
          challenge.question
        ),
    }

    assert.equal(
      guard.verify(payload),
      true
    )

    assert.equal(
      guard.verify(payload),
      false
    )
  }
)

test(
  'wrong answer does not consume challenge',
  () => {
    const guard =
      new ChallengeGuard({
        secret: 'test-secret',
      })

    const challenge =
      guard.issue()

    const correct =
      answerOf(
        challenge.question
      )

    assert.equal(
      guard.verify({
        ...challenge,
        answer: correct + 1,
      }),
      false
    )

    assert.equal(
      guard.verify({
        ...challenge,
        answer: correct,
      }),
      true
    )
  }
)

test(
  'expired challenge is rejected',
  () => {
    let now = 1000000

    const guard =
      new ChallengeGuard({
        secret: 'test-secret',
        ttlMs: 1000,
        now: () => now,
      })

    const challenge =
      guard.issue()

    now += 1001

    assert.equal(
      guard.verify({
        ...challenge,
        answer:
          answerOf(
            challenge.question
          ),
      }),
      false
    )
  }
)

test(
  'tampered signature is rejected',
  () => {
    const guard =
      new ChallengeGuard({
        secret: 'test-secret',
      })

    const challenge =
      guard.issue()

    const replacement =
      challenge.sig[0] === '0'
        ? '1'
        : '0'

    const tampered =
      replacement +
      challenge.sig.slice(1)

    assert.equal(
      guard.verify({
        ...challenge,
        sig: tampered,
        answer:
          answerOf(
            challenge.question
          ),
      }),
      false
    )
  }
)
