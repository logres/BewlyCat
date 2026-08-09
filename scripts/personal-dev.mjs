import { spawn } from 'node:child_process'
import { existsSync, statSync } from 'node:fs'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const repositoryRoot = fileURLToPath(new URL('../', import.meta.url))
const manifestPath = fileURLToPath(new URL('../extension/manifest.json', import.meta.url))
const startedAt = Date.now()
const children = new Set()

function startPnpm(args) {
  const command = process.platform === 'win32' ? (process.env.ComSpec || 'cmd.exe') : 'pnpm'
  const commandArgs = process.platform === 'win32' ? ['/d', '/s', '/c', 'pnpm', ...args] : args
  const child = spawn(command, commandArgs, {
    cwd: repositoryRoot,
    stdio: 'inherit',
  })
  children.add(child)
  child.once('exit', () => children.delete(child))
  return child
}

function stopChildren() {
  for (const child of children)
    child.kill('SIGINT')
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function waitForFreshManifest(devProcess) {
  while (devProcess.exitCode === null) {
    if (existsSync(manifestPath) && statSync(manifestPath).mtimeMs >= startedAt - 1000)
      return
    await delay(250)
  }
  throw new Error(`开发编译进程提前退出（代码 ${devProcess.exitCode ?? 1}）`)
}

process.once('SIGINT', () => {
  stopChildren()
  process.exit(130)
})
process.once('SIGTERM', () => {
  stopChildren()
  process.exit(143)
})

const devProcess = startPnpm(['dev'])

try {
  await waitForFreshManifest(devProcess)
  console.log('\n扩展已生成，正在启动带持久配置的 Chromium……\n')
  const browserProcess = startPnpm(['start:chromium'])
  const exitCode = await new Promise(resolve => browserProcess.once('exit', code => resolve(code ?? 0)))
  stopChildren()
  process.exitCode = exitCode
}
catch (error) {
  console.error(error instanceof Error ? error.message : error)
  stopChildren()
  process.exitCode = 1
}
