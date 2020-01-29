const chalk = require('chalk')
const fs = require('fs')
const loadClient = require('../../lib/loader')
const { storage } = require('../../lib/constants')
const path = require('path')

exports.command = 'clear'
exports.desc = 'Removes all readonly data from disk'
exports.handler = async function (argv) {
  loadClient((err) => {
    if (!err) {
      console.error(chalk.red('The Hyperdrive *must* not be running'))
      process.exit(1)
    }

    let cnt = 0
    for (const p of listReadonly()) {
      rmFeed(p)
      cnt++
    }

    console.log('Removed ' + cnt + ' readonly feed(s)')
    process.exit(0)
  })
}

function rmFeed (p) {
  rm('bitfield')
  rm('data')
  rm('key')
  rm('signatures')
  rm('tree')
  fs.rmdirSync(p)

  function rm (name) {
    if (fs.existsSync(path.join(p, name))) {
      fs.unlinkSync(path.join(p, name))
    }
  }
}


function listReadonly () {
  const all = []
  for (const pre of fs.readdirSync(path.join(storage, 'cores'))) {
    if (pre.length !== 2) continue
    for (const mid of fs.readdirSync(path.join(storage, 'cores', pre))) {
      if (mid.length !== 2) continue
      for (const suf of fs.readdirSync(path.join(storage, 'cores', pre, mid))) {
        const p = path.join(storage, 'cores', pre, mid, suf)
        if (fs.existsSync(path.join(p, 'name'))) continue
        all.push(p)
      }
    }
  }
  return all
}
