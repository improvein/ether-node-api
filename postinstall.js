const fs = require('fs')

// if config file doesn't exists, then create it based on default
if (!fs.existsSync('config.js')) {
  fs.copyFileSync('config.js.default', 'config.js')
  console.log('"config.js" file created from default')
} else {
  console.log('"config.js" file already exists')
}
