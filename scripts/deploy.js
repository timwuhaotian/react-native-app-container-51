var program = require('commander');
var inquirer = require('inquirer');
var {uploadFile} = require('./upload.js');
var fs = require('fs');
var package = require('../package.json')
// 获取业务包还是common 包
var agvs = process.argv.splice(2)
console.log("亲,你现在要更新的是"+agvs[0]+"包-----------------")

// 默认环境
var platform = 'android'
var env = "dev"
var bundleName = process.env.npm_package_name
// 包适用的客户端
var clientTypes = ["shipper"]
// 本次包的文字描述
var bundleDesc = "上传包的描述文字"
// 该包是什么类型包=（1：common, 2：业务）
var bundleType = agvs[0] == 'common' ? 1 :2

// var rnNativeVersion = 1
var rnNativeVersion = agvs[0] == 'common' ? '':process.env.npm_package_appInfo_rn_native_version

// 提交comment校验
function commentValidate (value) {
  if(!value) {
    console.info('请为现在版本输入一个备注')
    return false
  }
  return true
}

// 选择平台校验
function platformValidate (value) {
  if(value.length == 0) {
    console.info('亲,至少选择一个平台哦')
    return false
  }
  return true
}

// 测试用
var devOption = {
  host: "127.0.0.1",
  port: '8888',
  method: "POST",
  path: "http://dev-boss.ymmoa.com/ymm-appm-admin/rnBundle/version/autoUpload",
  protocol: "http:"
};

var options = {
  hostname: "dev-boss.ymmoa.com",
  method: "POST",
  path: "/ymm-appm-admin/rnBundle/version/autoUpload",
  protocol: "http:"
}

function update (nextVersion) {
  // 依赖包名和版本
  var pBundleName = agvs[0] == 'common' ? '' :process.env["npm_package_appInfo_" + platform + "_pBundleName"]
  var pVersionCode = agvs[0] == 'common' ? '' :process.env["npm_package_appInfo_" + platform + "_pVersionCode"]
  // 接口需要的数据
  var postData = {
    versionCode: nextVersion,
    rnNativeVersion: rnNativeVersion,
    pVersionCode: pVersionCode,
    pBundleName: pBundleName,
    bundleName: bundleName,
    bundleDesc: bundleDesc,
    bundleType: bundleType,
    clientTypes: clientTypes,
    platform: platform
  }
  // 上传文件信息
  var files = [
    {key: "file", path: "./dist/"+ platform +"/" + process.env.npm_package_name + ".zip"},
  ]
  uploadFile({
    options: options,
    postData: postData,
    files: files,
    callback: function (res) {
                console.log('STATUS: ' + res.statusCode);
                console.log('HEADERS: ' + JSON.stringify(res.headers));
                res.on("data", function(chunk) {
                    chunk = JSON.parse(chunk.toString());
                    if (chunk.result == 1) {
                      // 更新packjson的版本号
                      package.appInfo[platform + "_" + env + "Version"] = nextVersion;
                      fs.writeFileSync('./package.json', JSON.stringify(package, null, 2));
                      console.log("success:" + chunk.errorMsg);
                    } else {
                      console.error("error:" + chunk.errorMsg);
                    }
              })
    }
  })
}

// 添加对话命令
inquirer.prompt([{
  type: 'list',
  message: '你选择你需要发布的环境:',
  name: 'Env',
  default: "dev",
  choices:["dev","qa","release"]
}]).then(function (answers) {
  env = answers.Env
  if (answers.Env == 'dev') {
    options.hostname = "dev-boss.ymmoa.com";
  } else if (answers.Env == 'qa') {
    options.hostname = "qa-boss.ymmoa.com";
  } else if (answers.Env == 'release') {
    options.hostname = "boss.ymmoa.com";
  }
  return inquirer.prompt([{
    type: 'list',
    message: '你选择你需要发布的平台:',
    name: 'platform',
    default: "android",
    choices:["android","IOS"],
  }])
}).then(function (answers) {
  platform = answers.platform
  return inquirer.prompt([{
    type: 'checkbox',
    message: '你选择你需要发布的app:',
    name: 'app',
    default: ["shipper"],
    choices:["shipper", "driver", "employee"],
    validate: platformValidate,
  }])
}).then(function (answers) {
  console.log('platform', answers);
  clientTypes = answers.app;
  return inquirer.prompt([{
    type: 'input',
    message: '请为此次更新包添加描述(必填哦):',
    name: 'comment',
    default: "test",
    validate: commentValidate,
  }])
}).then(function (answers) {
  bundleDesc =  answers.comment
  
   // 自动增加版本
  var versionArr = process.env["npm_package_appInfo_" + platform + "_" + env + "Version"].split(".")
  var versionNextArr = [...versionArr]
  if (versionNextArr[2] == 99) {
    if (versionNextArr[1] == 99) {
      versionNextArr[1] = '0'
      versionNextArr[0] = parseInt(versionNextArr[0]) + 1
    } else {
      versionNextArr[2] = '0'
      versionNextArr[1] = parseInt(versionNextArr[1]) + 1
    }
  } else {
    versionNextArr[2] = parseInt(versionNextArr[2]) + 1
  }
  var nextVersion = versionNextArr.join('.')
  return inquirer.prompt([{
    type: 'input',
    message: '添加此次包版本,不填默认自动累加:',
    name: 'Version',
    default: nextVersion
  }])
}).then(function (answers) {
  // 调用接口更新数据
  update(answers.Version)
})