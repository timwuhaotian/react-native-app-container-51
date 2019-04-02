
const execSync = require('child_process').execSync;
const fs = require('fs');
const path = require('path');
const renameRegisterComponent = require('./rename.js');

/**
 * Use Yarn if available, it's much faster than the npm client.
 * Return the version of yarn installed on the system, null if yarn is not available.
 */
function getYarnVersionIfAvailable() {
  let yarnVersion;
  try {
    // execSync returns a Buffer -> convert to string
    yarnVersion = (execSync('yarn --version', {
      stdio: [0, 'pipe', 'ignore'],
    }).toString() || '').trim();
  } catch (error) {
    return null;
  }
  return yarnVersion;
}

function addAdditionalScripts() {
  const scriptsJsonPath = path.resolve('scriptsDependencies.json');
  fs.stat(scriptsJsonPath, error => {
    if (error) return;
    console.log('Adding scripts to package.json............');
    const fileName = 'package.json';
    const packageFile = path.resolve(fileName);
    let file = require(packageFile);

    const scripts = JSON.parse(fs.readFileSync(scriptsJsonPath));

    //these are the scripts that will be added to package.json
    for (const scriptName in scripts) {
      const script = scripts[scriptName];
      file.scripts[scriptName] = script;
    }

    fs.writeFileSync(fileName, JSON.stringify(file, null, 2));
    console.log('Deleting scriptsDependencies.json.........');
    execSync(`rm -rf ${scriptsJsonPath}`);
  });
}

function addAppInfo() {
  const appinfoPath = path.resolve('app.json')
  fs.stat(appinfoPath, error => {
    if (error) return;
    console.log("Adding appInfo to package.json..........");
    const fileName = 'package.json';
    const packageFile = path.resolve(fileName);
    let file = require(packageFile);

    const appInfo = JSON.parse(fs.readFileSync(appinfoPath));
    file.appInfo = {}
    for (const Name in appInfo) {
      const info = appInfo[Name];
      file.appInfo[Name] = info;
    }

    fs.writeFileSync(fileName, JSON.stringify(file, null, 2));
    console.log('Deleting app.json.........');
    execSync(`rm -rf ${appinfoPath}`);
  })
}

function installDependencies() {
  const dependenciesJsonPath = path.resolve('dependencie.json');
  fs.stat(dependenciesJsonPath, error => {
    if (error) return;
    console.log('Adding dependencies for the project.........');
    const dependencies = JSON.parse(fs.readFileSync(dependenciesJsonPath));
    let depsToInstall = [];
    const fileName = 'package.json';
    const packageFile = path.resolve(fileName);
    let file = require(packageFile);

    for (const depName in dependencies) {
      const depVersion = dependencies[depName];
      const depToInstall = `${depName}@${depVersion}`;
      file.dependencies[depName] = depVersion
      depsToInstall.push(depToInstall);
    }

    depsToInstall = depsToInstall.join(' ');
    console.log(`Adding ${depsToInstall}.........`);
    if (getYarnVersionIfAvailable()) {
      execSync(`yarn add ${depsToInstall}`, { stdio: 'inherit' });
    } else {
      execSync(`npm install ${depsToInstall} --save`);
    }
    console.log('Deleting dependencies.json.........');
    execSync(`rm -rf ${dependenciesJsonPath}`);
  });
}

function installDevDependencies() {
  const devDependenciesJsonPath = path.resolve('devDependencies.json');
  fs.stat(devDependenciesJsonPath, error => {
    if (error) return;
    console.log('Adding dev dependencies for the project.........');
    const devDependencies = JSON.parse(fs.readFileSync(devDependenciesJsonPath));
    let depsToInstall = [];
    const fileName = 'package.json';
    const packageFile = path.resolve(fileName);
    let file = require(packageFile);

    for (const depName in devDependencies) {
      const depVersion = devDependencies[depName];
      const depToInstall = `${depName}@${depVersion}`;
      file.devDependencies[depName] = depVersion;
      depsToInstall.push(depToInstall);
    }

    depsToInstall = depsToInstall.join(' ');
    console.log(`Adding ${depsToInstall}.........`);
    if (getYarnVersionIfAvailable()) {
      execSync(`yarn add ${depsToInstall} -D`, { stdio: 'inherit' });
    } else {
      execSync(`npm install ${depsToInstall} --save-dev`);
    }
    console.log('Deleting devDependencies.json.......');
    execSync(`rm -rf ${devDependenciesJsonPath}`);
  });
}

function clearScriptsDir() {
  const scriptsDirPath = path.resolve('scripts');
  execSync(`rm -rf ${scriptsDirPath}`);
}

function clearDir() {
  // 清除自动生成的文件
  const iosDirPath = path.resolve('ios');
  const androidDirPath = path.resolve('android');
  const appPath = path.resolve('app.js')
  execSync(`rm -rf ${iosDirPath}`);
  execSync(`rm -rf ${androidDirPath}`);
  execSync(`rm -rf ${appPath}`);
}

renameRegisterComponent(() => {
  addAdditionalScripts();
  installDependencies();
  installDevDependencies();
  addAppInfo();
  // clearScriptsDir();
  clearDir();
});