/*
  wrap Object.keys to avoid error on null or undefined
 */
function ok(obj) {
  if (typeof obj !== 'object') return []
  if (obj === null) return []
  return Object.keys(obj)
}

/*
  get distinct fields of objects
 */
function getFields(...args) {
  const fields = args.reduce((arr, x) => (arr.push(...ok(x)), arr), [])
  return [...new Set(fields)]
}

/*
  show different fields of two objects
  x,y: the objects you want to compare
  name: whatever you want to name a object
 */
function showDifferentFields(x, y, name = 'obj') {
  const obj = {}
  diff(x, y, name)
  return ok(obj).length ? obj : null

  function diff(a, b, name = '') {
    if (typeof a !== typeof b) {
      obj[name] = [a, b]
      return obj
    }
    if (typeof a !== 'object') {
      if (a !== b) obj[name] = [a, b]
      return obj
    }
    const keys = getFields(a, b)
    keys.forEach(key => {
      diff(a[key], b[key], [name, key].join('.'))
    })
    return obj
  }
}

/*
  get diff text
 */
function getText(x, y, depth = 1) {
  const diff = (a, b) => a + (a === b ? '' : ` (${b}) <--`)
  if (typeof x !== 'object') {
    return diff(x, y) + '\n'
  }
  const keys = getFields(x, y)
  let line = '\n'
  keys.forEach(key => {
    line += `${blank(depth)}${key}: ${getText(x[key], y[key], depth + 1)}`
  })
  return line

  function blank(depth, count = 1) {
    let prefix = '----', space = new Array(count + 1).join(prefix)
    return new Array(depth + 1).join(space).replace(prefix, '').replace(/----$/, '    ').replace(/----/, '    ')
  }
}

/*
  get diff html
 */
function getHTML(x, y, depth = 1) {
  const before = flag => `<div class="${flag ? 'b' : 'a'}">`, after = () => '</div>'
  if (typeof x !== 'object') {
    return diff(x, y)
  }
  const keys = getFields(x, y)
  let line = `${before(1)}`
  keys.forEach(key => {
    line += `${before()}${key}: ${getHTML(x[key], y[key], depth + 1)}${after()}`
  })
  return line + `${after(1)}`

  function diff(a, b) {
    let hint = a === b ? '' : `<span class="c"> (${b}) </span>`
    return a + hint
  }
}

/*
  save HTML to your folder
 */
function saveHTML(x, y, options = {}) {
  const folder = options.folder || process.cwd()
  const filename = options.filename || 'diff-object'
  const path = require('path')
  const fs = require('fs')
  const exec = require('child_process').exec
  const shell = cmd => new Promise((s, j) => exec(cmd, (e) => e ? j(e) : s()))   // run shell command
  const mkdirp = folder => shell(`mkdir -p ${folder}`) // create folder recursively
  mkdirp(folder)
  const file = path.join(folder, `${filename}.html`)
  const style = fs.readFileSync(path.join(__dirname, 'diff-object.css'))
  const body = getHTML(x, y)
  const tpl = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${filename}</title>
  <style>
${style}
  </style>
</head>
<body>
${body}
</body>
</html>`
  fs.writeFileSync(file, tpl)
}

module.exports = {
  showDifferentFields,
  getText,
  getHTML,
  saveHTML
}
