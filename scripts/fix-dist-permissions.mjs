import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const distRoot = path.join(projectRoot, 'dist')

async function makeReadable(target) {
  const stat = await fs.lstat(target)
  if (stat.isSymbolicLink()) return

  const permissionBits = stat.mode & 0o777
  await fs.chmod(target, permissionBits | (stat.isDirectory() ? 0o055 : 0o044))

  if (!stat.isDirectory()) return
  const children = await fs.readdir(target)
  await Promise.all(children.map(child => makeReadable(path.join(target, child))))
}

await makeReadable(distRoot)
console.log('Set public read/traverse permissions on dist/')
