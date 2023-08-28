import { createRouter, createWebHashHistory, createWebHistory } from "vue-router";
const pages = require.context("../pages/", true, /page\.js$/);
const modules = require.context("../pages/", true, /index\.(vue|jsx|tsx|js)/);

// 模块对应子路由集合
const childrenModulesList = {};
let moduleNames = [];

const setChild = function (callback) {
  modules
    .keys()
    .filter((path) => !path.startsWith("./"))
    .forEach((path) => {
      const filename = path.match(/(?<=pages\/).*?(?=\/index.jsx)/);
      if (filename[0].split("/").length > 1) {
        callback && callback(filename[0].split("/"), path);
      }
    });
  if (Object.keys(childrenModulesList).length == 0) {
    moduleNames.map((moduleName) => {
      childrenModulesList[moduleName] = [];
    });
  }
};
// 设置拥有子路由的模块名称集合
setChild(function (filenameArr) {
  if (!moduleNames.includes(filenameArr[0])) {
    moduleNames.push(filenameArr[0]);
  }
});
// 给对应模块设置所有子路由对象
setChild(function (filenameArr, path) {
  const moduleFileName = path.replace("index.jsx", "page.js");
  const { title, keepAlive, order } = pages(moduleFileName).default;
  if (filenameArr[1] === "html") {
    filenameArr[1] = ":name.html";
  }
  childrenModulesList[filenameArr[0]].push({
    path: filenameArr[1],
    name: filenameArr[1],
    component: modules(path).default,
    meta: {
      title,
    },
  });
});
// 获取目录中所有模块的文件名列表
const routes = pages
  .keys()
  .filter((path) => !path.startsWith("./"))
  .map((path) => {
    if (path.split("/").length == 3) {
      const filename = path.match(/(?<=\/).*?(?=\/)/);
      const moduleFileName = path.replace("page.js", "index.jsx");
      const { title, keepAlive, order } = pages(path).default;
      // console.log(moduleFileName);
      return {
        path: "/" + filename[0],
        name: filename[0],
        component: modules(moduleFileName).default,
        meta: {
          title,
          keepAlive,
          order,
        },
        children: childrenModulesList[filename[0]] || [],
      };
    }
  })
  .filter(Boolean);
// const routes = [
//   {
//     path:'home',
//     name:'home',
//     components:()=>import('../pages/home/index.jsx')
//   },
//   {
//     path: 'advance',
//     name: 'advance',
//     components: () => import('../pages/advance/index.jsx')
//   }
// ]

const router = createRouter({
  history: createWebHistory(),
  routes,
  // scrollBehavior(to) {
  //   let raf;
  //   if (to.hash) {
  //     setTimeout(() => {
  //       const offsetTop = document.querySelector(to.hash).offsetTop - 80;
  //       const fn = () => {
  //         const scrollTop = document.querySelector('.middle-content-container').scrollTop;
  //         const isspeed = offsetTop / 8;
  //         document.querySelector('.middle-content-container').scrollTop = (scrollTop + isspeed) > offsetTop ? offsetTop : (scrollTop + isspeed);
  //         if (scrollTop < offsetTop) {
  //           raf = requestAnimationFrame(fn);
  //         } else {
  //           console.log(document.querySelector('.middle-content-container').scrollTop);
  //           cancelAnimationFrame(raf);

  //         }
  //       };
  //       raf = requestAnimationFrame(fn);
  //     }, 0)
  //   }
  // }
});

export default router;
