const fs = require('fs')
const path = require('path')

const SRC_DIR = path.join(process.cwd(), 'src')

function walk(directory) {
  const files = []

  if (!fs.existsSync(directory)) {
    return files
  }

  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name)

    if (entry.isDirectory()) {
      files.push(...walk(fullPath))
    }

    if (entry.isFile() && fullPath.endsWith('.css')) {
      files.push(fullPath)
    }
  }

  return files
}

function fixFile(filePath) {
  const original = fs.readFileSync(filePath, 'utf8')

  let fixed = original

  fixed = fixed.replace(/<<<<<<<[\s\S]*?=======/g, '')
  fixed = fixed.replace(/>>>>>>>.*$/gm, '')

  fixed = fixed.replace(
    /\/\* =========================================[\s\S]*?(?=\n\.|\n#|\n@|\nbody|\nhtml|\n:root)/g,
    '/* Section */\n',
  )

  fixed = fixed.replace(/\/\*[\s\S]*$/g, (match) => {
    if (match.includes('*/')) {
      return match
    }

    return ''
  })

  if (fixed !== original) {
    fs.writeFileSync(filePath, fixed, 'utf8')
    console.log('Fixed:', path.relative(process.cwd(), filePath))
  }
}

const cssFiles = walk(SRC_DIR)

cssFiles.forEach(fixFile)

console.log(`Checked ${cssFiles.length} CSS files.`)
