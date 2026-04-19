#!/usr/bin/env node

import { promises as fs } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createInterface } from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'
import { spawn } from 'node:child_process'

type TemplateName = 'landing' | 'dashboard'
type PackageManager = 'npm' | 'pnpm'

type CliOptions = {
  projectName?: string
  template?: TemplateName
  packageManager?: PackageManager
  install: boolean
  git: boolean
  skipPrompts: boolean
  help: boolean
}

class CliError extends Error {
  hint?: string

  constructor(message: string, hint?: string) {
    super(message)
    this.name = 'CliError'
    this.hint = hint
  }
}

const AVAILABLE_TEMPLATES: TemplateName[] = ['landing', 'dashboard']
const TEXT_FILE_EXTENSIONS = new Set(['.css', '.env', '.example', '.html', '.js', '.json', '.md', '.mjs', '.ts', '.tsx', '.txt', '.yml', '.yaml'])

function parseArgs(argv: string[]): CliOptions {
  const options: CliOptions = {
    install: true,
    git: true,
    skipPrompts: false,
    help: false,
  }

  for (let index = 0; index < argv.length; index += 1) {
    const current = argv[index]

    if (!current) continue

    if (!current.startsWith('-') && !options.projectName) {
      options.projectName = current
      continue
    }

    if (current === '-h' || current === '--help') {
      options.help = true
      continue
    }

    if (current === '--skip-prompts') {
      options.skipPrompts = true
      continue
    }

    if (current === '--no-install') {
      options.install = false
      continue
    }

    if (current === '--install') {
      options.install = true
      continue
    }

    if (current === '--no-git') {
      options.git = false
      continue
    }

    if (current === '--git') {
      options.git = true
      continue
    }

    if (current === '--template') {
      const next = argv[index + 1]
      if (!next || next.startsWith('-')) {
        throw new CliError('Missing value for "--template".', 'Use "--template landing" or "--template dashboard".')
      }
      if (next === 'landing' || next === 'dashboard') {
        options.template = next
        index += 1
        continue
      }
      throw new CliError(
        `Unsupported template "${next}".`,
        `Supported templates: ${AVAILABLE_TEMPLATES.join(', ')}.`,
      )
    }

    if (current === '--package-manager') {
      const next = argv[index + 1]
      if (!next || next.startsWith('-')) {
        throw new CliError('Missing value for "--package-manager".', 'Use "--package-manager npm" or "--package-manager pnpm".')
      }
      if (next === 'npm' || next === 'pnpm') {
        options.packageManager = next
        index += 1
        continue
      }
      throw new CliError('Unsupported package manager.', 'Supported package managers: npm, pnpm.')
    }

    if (current.startsWith('-')) {
      throw new CliError(`Unknown option "${current}".`, 'Run "npx create-auralith-app --help" to see supported options.')
    }
  }

  return options
}

function printHelp() {
  output.write(
    [
      'create-auralith-app',
      '',
      'Usage:',
      '  npx create-auralith-app <project-name> [options]',
      '',
      'Options:',
      '  --template <landing|dashboard>     Template to scaffold',
      '  --package-manager <npm|pnpm>       Package manager',
      '  --install / --no-install           Install dependencies (default: install)',
      '  --git / --no-git                   Initialize git (default: git)',
      '  --skip-prompts                     Use defaults for missing options',
      '  -h, --help                         Show help',
      '',
    ].join('\n'),
  )
}

function normalizePackageName(inputValue: string) {
  return inputValue
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function isValidProjectName(inputValue: string) {
  return /^[a-zA-Z0-9][a-zA-Z0-9-_]*$/.test(inputValue)
}

async function pathExists(targetPath: string) {
  try {
    await fs.access(targetPath)
    return true
  } catch {
    return false
  }
}

async function isDirectoryEmpty(targetPath: string) {
  try {
    const entries = await fs.readdir(targetPath)
    return entries.length === 0
  } catch {
    return true
  }
}

async function replacePlaceholdersInDir(targetPath: string, replacements: Record<string, string>) {
  const entries = await fs.readdir(targetPath, { withFileTypes: true })

  for (const entry of entries) {
    const entryPath = path.join(targetPath, entry.name)

    if (entry.isDirectory()) {
      await replacePlaceholdersInDir(entryPath, replacements)
      continue
    }

    const extension = path.extname(entry.name)
    if (!TEXT_FILE_EXTENSIONS.has(extension) && !entry.name.endsWith('.env.example')) {
      continue
    }

    let content: string
    try {
      content = await fs.readFile(entryPath, 'utf8')
    } catch {
      continue
    }

    let updated = content
    for (const [key, value] of Object.entries(replacements)) {
      updated = updated.split(key).join(value)
    }

    if (updated !== content) {
      await fs.writeFile(entryPath, updated, 'utf8')
    }
  }
}

async function runCommand(command: string, args: string[], cwd: string) {
  await new Promise<void>((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      stdio: 'inherit',
      shell: process.platform === 'win32',
    })

    child.on('error', reject)
    child.on('close', (code) => {
      if (code === 0) {
        resolve()
      } else {
        reject(new Error(`${command} ${args.join(' ')} failed with code ${code ?? 'unknown'}`))
      }
    })
  })
}

async function promptMissingOptions(options: CliOptions) {
  const rl = createInterface({ input, output })

  try {
    if (!options.projectName) {
      const answer = await rl.question('Project name: ')
      options.projectName = answer.trim()
    }

    if (!options.template) {
      const answer = await rl.question('Template (landing/dashboard) [landing]: ')
      const normalized = answer.trim() as TemplateName
      options.template = normalized === 'dashboard' ? 'dashboard' : 'landing'
    }

    if (!options.packageManager) {
      const answer = await rl.question('Package manager (npm/pnpm) [npm]: ')
      const normalized = answer.trim() as PackageManager
      options.packageManager = normalized === 'pnpm' ? 'pnpm' : 'npm'
    }
  } finally {
    rl.close()
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2))

  if (options.help) {
    printHelp()
    return
  }

  if (!options.skipPrompts) {
    await promptMissingOptions(options)
  }

  const projectName = options.projectName?.trim()
  const template = options.template ?? 'landing'
  const packageManager = options.packageManager ?? 'npm'

  if (!projectName || !isValidProjectName(projectName)) {
    throw new CliError(
      `Invalid project name "${projectName ?? ''}".`,
      'Use letters, numbers, dashes, and underscores only. Example: "my-app".',
    )
  }

  if (!AVAILABLE_TEMPLATES.includes(template)) {
    throw new CliError(`Unsupported template "${template}".`, `Supported templates: ${AVAILABLE_TEMPLATES.join(', ')}.`)
  }

  const targetDir = path.resolve(process.cwd(), projectName)
  const destinationExists = await pathExists(targetDir)

  if (destinationExists && !(await isDirectoryEmpty(targetDir))) {
    throw new CliError(
      `Target directory already exists and is not empty: ${targetDir}`,
      'Choose another project name or remove existing files in that directory.',
    )
  }

  const thisFilePath = fileURLToPath(import.meta.url)
  const packageRoot = path.resolve(path.dirname(thisFilePath), '..')
  const repoRoot = path.resolve(packageRoot, '..', '..')
  const templateDir = path.join(repoRoot, 'templates', template)

  if (!(await pathExists(templateDir))) {
    throw new CliError(
      `Template not found: ${template}`,
      'If you are developing locally, make sure templates exist under "templates/" at repo root.',
    )
  }

  await fs.mkdir(targetDir, { recursive: true })
  await fs.cp(templateDir, targetDir, { recursive: true })

  await replacePlaceholdersInDir(targetDir, {
    '__APP_NAME__': projectName,
    '__PACKAGE_NAME__': normalizePackageName(projectName),
  })

  if (options.install) {
    const installArgs = packageManager === 'pnpm' ? ['install'] : ['install']
    output.write(`\nInstalling dependencies with ${packageManager}...\n`)
    try {
      await runCommand(packageManager, installArgs, targetDir)
    } catch {
      throw new CliError(
        `Dependency installation failed with ${packageManager}.`,
        `Run "cd ${projectName} && ${packageManager} install" manually and check your Node/package manager setup.`,
      )
    }
  }

  if (options.git) {
    output.write('\nInitializing git repository...\n')
    try {
      await runCommand('git', ['init'], targetDir)
      await runCommand('git', ['add', '-A'], targetDir)
    } catch {
      output.write('\nWarning: Could not initialize git repository.\n')
      output.write(`Hint: Run "cd ${projectName} && git init && git add -A" manually.\n`)
    }
  }

  output.write(
    [
      '\nAuralith project created successfully.',
      '',
      `Next steps:`,
      `  cd ${projectName}`,
      options.install ? `  ${packageManager} run dev` : `  ${packageManager} install && ${packageManager} run dev`,
      '',
    ].join('\n'),
  )
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error)
  const hint = error instanceof CliError ? error.hint : undefined
  output.write(`\nError: ${message}\n`)
  if (hint) {
    output.write(`Hint: ${hint}\n`)
  }
  process.exitCode = 1
})
