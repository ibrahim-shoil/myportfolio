import assert from 'node:assert/strict'
import fs from 'fs/promises'
import os from 'os'
import path from 'path'
import test from 'node:test'
import { AnalyticsStore, PAGE_VISIT_TTL_MS, normalizeEventId, normalizePagePath } from '../server/analyticsStore.mjs'

async function makeStore(nowRef) {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'ishoil-analytics-'))
  const store = new AnalyticsStore({ dataDir: dir, now: () => nowRef.value })
  await store.init()
  return { store, dir }
}

test('page visits count once per IP and path every 24 hours', async (t) => {
  const now = { value: 1_000_000 }
  const { store, dir } = await makeStore(now)
  t.after(() => fs.rm(dir, { recursive: true, force: true }))

  assert.equal((await store.recordPageVisit('/editor/en', '1.2.3.4')).counted, true)
  assert.equal((await store.recordPageVisit('/editor/en', '1.2.3.4')).counted, false)
  assert.equal((await store.recordPageVisit('/editor/en', '5.6.7.8')).visits, 2)

  now.value += PAGE_VISIT_TTL_MS + 1
  const afterTtl = await store.recordPageVisit('/editor/en', '1.2.3.4')
  assert.equal(afterTtl.counted, true)
  assert.equal(afterTtl.visits, 3)
})

test('video view event is idempotent but separate playbacks count', async (t) => {
  const now = { value: 2_000_000 }
  const { store, dir } = await makeStore(now)
  t.after(() => fs.rm(dir, { recursive: true, force: true }))

  assert.equal((await store.recordVideoView('pricing-perceived-value', 'session_view_001')).views, 1)
  assert.equal((await store.recordVideoView('pricing-perceived-value', 'session_view_001')).views, 1)
  assert.equal((await store.recordVideoView('pricing-perceived-value', 'session_view_002')).views, 2)
})

test('a like is counted only once per IP for a video', async (t) => {
  const now = { value: 3_000_000 }
  const { store, dir } = await makeStore(now)
  t.after(() => fs.rm(dir, { recursive: true, force: true }))

  const first = await store.likeVideo('brand-navigation', '1.2.3.4')
  const second = await store.likeVideo('brand-navigation', '1.2.3.4')
  const other = await store.likeVideo('brand-navigation', '5.6.7.8')

  assert.equal(first.likes, 1)
  assert.equal(second.likes, 1)
  assert.equal(second.counted, false)
  assert.equal(other.likes, 2)
  assert.equal((await store.getVideoStats('brand-navigation', '1.2.3.4')).liked, true)
})

test('normalizers reject malformed analytics keys', () => {
  assert.equal(normalizePagePath('editor/en'), null)
  assert.equal(normalizePagePath('/editor//en?x=1'), '/editor/en')
  assert.equal(normalizeEventId('short'), null)
  assert.equal(normalizeEventId('view_event_123'), 'view_event_123')
})
