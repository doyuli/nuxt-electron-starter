import { readFile, writeFile } from 'node:fs/promises'
import process from 'node:process'
import readline from 'node:readline/promises'

const PACKAGE_NAME_RE = /^(?:@[a-z0-9][a-z0-9._~-]*\/)?[a-z0-9][a-z0-9._~-]*$/

const FILES = {
  packageJson: 'package.json',
  electronBuilder: 'electron-builder.yml',
  nuxtConfig: 'nuxt.config.ts',
  mainIndex: 'electron/main/index.ts',
  mainWindow: 'electron/main/windows/createMainWindow.ts',
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

function escapeTsString(value) {
  return value.replaceAll('\\', '\\\\').replaceAll('\'', '\\\'')
}

function toAppId(packageName) {
  if (packageName.startsWith('@')) {
    const [scope, name] = packageName.slice(1).split('/')
    return `com.${scope}.${name}`.replaceAll(/[^a-z0-9.-]/g, '-')
  }

  return `com.doyuli.${packageName}`.replaceAll(/[^a-z0-9.-]/g, '-')
}

async function prompt(question, defaultValue, validate) {
  while (true) {
    const suffix = defaultValue ? ` (${defaultValue})` : ''
    const answer = (await rl.question(`${question}${suffix}: `)).trim()
    const value = answer || defaultValue
    const error = validate(value)

    if (!error) {
      return value
    }

    console.error(`  ${error}`)
  }
}

function validatePackageName(value) {
  if (!value) {
    return 'Package name is required.'
  }

  if (value.length > 214) {
    return 'Package name must be 214 characters or fewer.'
  }

  if (!PACKAGE_NAME_RE.test(value)) {
    return 'Use a valid npm package name, e.g. my-app or @scope/my-app.'
  }

  return null
}

function validateAppName(value) {
  if (!value) {
    return 'App name is required.'
  }

  return null
}

function replaceRequired(content, pattern, replacement, file) {
  if (!pattern.test(content)) {
    throw new Error(`Could not find expected value in ${file}.`)
  }

  return content.replace(pattern, replacement)
}

async function readJson(file) {
  return JSON.parse(await readFile(file, 'utf8'))
}

async function main() {
  const packageJson = await readJson(FILES.packageJson)
  const builderConfig = await readFile(FILES.electronBuilder, 'utf8')
  const productNameLine = builderConfig.split('\n').find(line => line.startsWith('productName:'))

  const currentPackageName = packageJson.name ?? 'nuxt-electron-starter'
  const currentAppName = productNameLine?.slice('productName:'.length).trim().replace(/^['"]|['"]$/g, '') ?? 'Nuxt Electron Starter'

  console.log('Initialize project metadata')
  console.log()

  const packageName = await prompt('Package name', currentPackageName, validatePackageName)
  const appName = await prompt('App name', currentAppName, validateAppName)
  const appId = toAppId(packageName)

  packageJson.name = packageName
  await writeFile(FILES.packageJson, `${JSON.stringify(packageJson, null, 2)}\n`)

  const nextBuilderConfig = replaceRequired(
    replaceRequired(builderConfig, /^appId:[^\r\n]*$/m, `appId: ${appId}`, FILES.electronBuilder),
    /^productName:[^\r\n]*$/m,
    `productName: ${appName}`,
    FILES.electronBuilder,
  )
  await writeFile(FILES.electronBuilder, nextBuilderConfig)

  const nuxtConfig = await readFile(FILES.nuxtConfig, 'utf8')
  await writeFile(
    FILES.nuxtConfig,
    replaceRequired(nuxtConfig, /title:\s*'[^']*'/, `title: '${escapeTsString(appName)}'`, FILES.nuxtConfig),
  )

  const mainIndex = await readFile(FILES.mainIndex, 'utf8')
  await writeFile(
    FILES.mainIndex,
    replaceRequired(mainIndex, /app\.setAppUserModelId\('[^']*'\)/, `app.setAppUserModelId('${appId}')`, FILES.mainIndex),
  )

  const mainWindow = await readFile(FILES.mainWindow, 'utf8')
  await writeFile(
    FILES.mainWindow,
    replaceRequired(mainWindow, /title:\s*'[^']*'/, `title: '${escapeTsString(appName)}'`, FILES.mainWindow),
  )

  console.log()
  console.log('Updated project metadata:')
  console.log(`  package name: ${packageName}`)
  console.log(`  app name: ${appName}`)
  console.log(`  app id: ${appId}`)
}

main()
  .catch((error) => {
    console.error()
    console.error(error instanceof Error ? error.message : error)
    process.exitCode = 1
  })
  .finally(() => {
    rl.close()
  })
