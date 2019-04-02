const fs = require('fs');
const path = require('path');

const indexPath = path.resolve('./index.js');

function packageDotJSON() {
  const fileName = 'package.json';
  const packageFile = path.resolve(fileName);
  let file = require(packageFile);
  return file;
}

function renameRegister(path, callback) {
  const packageFile = packageDotJSON();
  const register = fs.readFileSync(path, 'utf8');
  const renameRegister = register.replace(/YmmCRM/, packageFile.name);
  fs.writeFileSync(path, renameRegister);
  callback();
}

function renameRegisterComponent(callback) {
  renameRegister(indexPath, callback);
}

module.exports = renameRegisterComponent;