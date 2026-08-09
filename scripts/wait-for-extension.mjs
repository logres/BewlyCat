import { existsSync, mkdirSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const requiredArtifacts = [
  '../extension/manifest.json',
  '../extension/dist/background/index.js',
  '../extension/dist/contentScripts/index.global.js',
  '../extension/dist/contentScripts/style.css',
].map(relativePath => fileURLToPath(new URL(relativePath, import.meta.url)))
const chromiumProfilePath = fileURLToPath(new URL('../chromium-web-ext-profile/', import.meta.url))
const startedAt = Date.now()

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

while (!requiredArtifacts.every(path => existsSync(path) && statSync(path).mtimeMs >= startedAt - 1000))
  await delay(250)

mkdirSync(chromiumProfilePath, { recursive: true })
console.log('\n扩展已生成，正在启动带持久配置的 Chromium……\n')
