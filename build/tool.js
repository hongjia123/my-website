const path = require("path");
const fs = require("fs");
const os = require("os");
const chalk = require("chalk");
const gzipSize = require("gzip-size");
const { exec } = require("node:child_process");
const isProduction = process.env.NODE_ENV === "production";

// 格式化文件大小
const formatSize = (size) => {
  if (size >= 1024 * 1024) {
    return (size / (1024 * 1024)).toFixed(2) + " MiB";
  } else {
    return (size / 1024).toFixed(2) + " KiB";
  }
};
const chalkfile = (filePath, path) => {
  if (/\.js$/.test(filePath)) {
    return chalk.green(path || filePath);
  } else {
    return chalk.blue(path || filePath);
  }
};

// 获取本地服务的IPV4网络地址
const getLocalNetworkAddress = () => {
  const interfaces = os.networkInterfaces();
  let networkAddress;

  // 遍历网络接口
  Object.keys(interfaces).forEach((interfaceName) => {
    const interfaceInfo = interfaces[interfaceName];

    // 遍历每个接口的详细信息
    interfaceInfo.forEach((interfaceItem) => {
      // 筛选 IPv4 地址，且非回环地址
      if (interfaceItem.family === "IPv4" && !interfaceItem.internal) {
        networkAddress = interfaceItem.address;
      }
    });
  });

  return networkAddress;
};
const networkAddress = getLocalNetworkAddress();

// 构建完成渲染生成文件详情插件
class RenderBuildInfoPlugin {
  constructor(option) {
    this.maxLength = option.maxLength || 90;
    this.patten = new RegExp(`(.{1,${this.maxLength}})`);
    this.filePathArr = [];
    this.filePathReadCount = 0; // 文件路径读取数量
    this.size = option.size || "small";
    this.tabWidth = option.tabWidth || 8;
    this.tabstr = "";
  }
  apply(compiler) {
    compiler.hooks.done.tap("RenderBuildInfoPlugin", (stats) => {
      this.readdir();
    });
  }
  setTableHeader() {
    let tabnum = null;
    tabnum = Math.ceil(this.maxLength / this.tabWidth);
    console.log(tabnum);
    for (let i = 0; i < tabnum; i++) {
      this.tabstr += "\t";
    }
    console.log(
      "\n" +
        "\xa0\xa0" +
        chalk.blue.bold("File") +
        this.tabstr +
        chalk.blue.bold("Size") +
        "\t\t" +
        chalk.blue.bold("Gzipped") +
        "\n"
    );
  }
  // 读取文件夹
  readdir(filePath = "dist/") {
    fs.readdir(filePath, (err, files) => {
      if (Array.isArray(files)) {
        for (const file of files) {
          const _path = path.join(filePath, file);

          // 收集读取到最终文件的路径
          if (/\.(js|css)$/.test(_path)) {
            this.filePathArr.push(_path);
          }
          this.getFileInfo(_path);
        }
      }
    });
  }
  // 读取文件内容
  getFileInfo(filePath) {
    fs.readFile(filePath, (err, data) => {
      const _filePath = filePath;
      try {
        const gzippedSize = gzipSize.sync(data);
        if (/\.(js|css)$/.test(filePath)) {
          if (!this.filePathReadCount) {
            this.setTableHeader();
          }
          let restpath = filePath.substring(this.maxLength);
          filePath = filePath.match(this.patten)[0] + chalkfile(restpath);
          let _tabstr = "";
          let restnum =
            this.tabstr.length -
            filePath.match(this.patten)[0].length / this.tabWidth;
          if (Math.round(restnum.toFixed(2)) > 0) {
            for (let i = 0; i < Math.round(restnum.toFixed(2)); i++) {
              _tabstr += "\t";
            }
          } else {
            _tabstr = "\t";
          }
          console.log(
            `\xa0\xa0${filePath.replace(
              this.patten,
              `${chalkfile(_filePath, "$1")}${_tabstr}${formatSize(
                data.length
              )}\t${formatSize(gzippedSize)}\n\xa0\xa0`
            )}`
          );
          this.filePathReadCount++;
          // 打印构建完成的提示信息
          if (this.filePathReadCount === this.filePathArr.length) {
            console.log(
              "\n" +
                chalk.bgGreen(" DONE ") +
                " Build complete. The " +
                chalk.blue("dist") +
                " directory is ready to be deployed\n"
            );
          }
        }
      } catch (error) {
        this.readdir(filePath);
      }
    });
  }
}
// 构建终端渲染本地开发服务信息
class RenderServerInfoPlugin {
  constructor(option) {
    this.spinner = option.spinner;
    this.port = option.port;
  }
  apply(compiler) {
    compiler.hooks.done.tap("BuildInfoPlugin", (stats) => {
      const { time, assets } = stats.toJson();
      const buildTime = (time / 1000).toFixed(3);
      setTimeout(() => {
        if (!isProduction) {
          // console.log('\n\n' + chalk.bgGreen(' DONE ') + ' Compiled successfully in ' + buildTime + 's\n');
          console.log("\nPage running at:");
          console.log(
            "- Local:  " + chalk.blue("http://localhost:" + this.port + "/")
          );
          console.log(
            "- Network:  " +
              chalk.blue("http://" + networkAddress + ":" + this.port + "/\n")
          );
          console.log("Note that the development build is not optimized");
          console.log(
            "To create a production build, run " +
              chalk.blue("npm run build") +
              "\n"
          );
        } else {
          this.spinner.succeed("Building successfully\n");
        }
      }, 0);
      // // 在构建完成后执行 ESLint 命令
      // exec('npm run lint', (error, stdout, stderr) => {
      //   if (error) {
      //     // 处理错误
      //     console.error('Error:', error);
      //     console.log('stdout:', stdout);
      //     console.log('stderr:', stderr);

      //   } else {
      //     // 处理结果
      //     console.log(stdout);
      //   }
      // });
    });
  }
}
module.exports = {
  RenderBuildInfoPlugin,
  RenderServerInfoPlugin,
};
