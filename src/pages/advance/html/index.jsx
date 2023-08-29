import Split from "@components/ml-split";
import {
  reactive,
  ref,
  h,
  onMounted,
  defineAsyncComponent,
  watch,
  nextTick,
} from "vue";
import { useRoute } from "vue-router";
import "./css/index.less";

let component = ref({}); //当前组件对象
let parentlist = [];
// 获取当前激活tab的父级列表
const useParentList = (list) => {
  let childlist = {};
  parentlist = list.filter((i) => {
    const child = i.children.find((child) => child.isActive);
    if (child) {
      childlist = child;
      return child.isActive;
    }
  });
  component.value = setComp(parentlist[0].value, childlist.value);
};
// 设置中间内容组件
const setComp = (parentpath, childpath) => {
  return defineAsyncComponent(() => import(`./${parentpath}/${childpath}.jsx`));
};
// 左边标题导航组件
const Left = (props) => {
  const leftlist = reactive(props.leftContent);
  // 切换tab
  const clickItem = (item) => {
    parentlist[0].children.map((i) => {
      if (i.name == item.name) {
        return;
      }
      if (i.isActive) {
        item.isActive = true;
        // location.href = `/advance/${item.value}`;
        history.replaceState(null, null, `/advance/${item.value}.html`);
        sessionStorage.setItem("hash", item.name);
        delete i.isActive;
        useParentList(leftlist);
      }
    });
    // const { parentlist, childlist } = useParentList();

    // console.log(route.path.match(/\/advance\/(\w+)\.html/));
  };

  return (
    <div>
      <br />
      {leftlist.map((list, index) => {
        return (
          <div>
            <ul
              style={{
                textAlign: "center",
                marginBottom: "15px",
                marginLeft: "120px",
              }}
            >
              <div>
                <strong>{list.name}</strong>
              </div>
              {list.children.map((child, i) => {
                return (
                  <div
                    onClick={() => clickItem(child)}
                    style={{ cursor: "pointer" }}
                  >
                    <li
                      style={{ fontSize: "14px" }}
                      class={{ isActive: child.isActive }}
                    >
                      <span>
                        <i>{child.name}</i>
                      </span>
                    </li>
                  </div>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
};
const SplitContainer = {
  props: ["leftContent", "rightContent", "Index"],
  setup(props) {
    console.log(2121);
    const list = [
      {
        name: "网络篇",
        value: "web",
        children: [
          {
            name: "数据请求和传输",
            value: "request",
            content: ["http", "websocket"],
          },
          {
            name: "浏览器",
            value: "browser",
            content: ["browser", "js"],
          },
        ],
      },
      {
        name: "代码检测与转译篇",
        value: "transform",
        children: [
          {
            name: "代码编译",
            value: "transform",
            content: ["babel"],
          },
          {
            name: "代码检测",
            value: "lint",
            content: ["synax", "AST"],
          },
        ],
      },
      {
        name: "构建工具篇",
        value: "build",
        children: [
          {
            name: "webpack的打包原理",
            value: "webpack",
            content: ["process", "stream", "realization"],
          },
          {
            name: "加载器loader原理",
            value: "loader",
            content: ["1", "2", "3"],
          },
          {
            name: "插件plugin原理",
            value: "plugin",
            content: ["4", "5", "6"],
          },
          {
            name: "热模块替换原理",
            value: "hot",
            content: ["7", "8", "9"],
          },
          {
            name: "vuecli",
            value: "vuecli",
            content: ["vuecli"],
          },
        ],
      },
      {
        name: "模块化篇",
        value: "module",
        children: [
          {
            name: "require.js",
            value: "requirejs",
            content: ["require"],
          },
        ],
      },
      {
        name: "框架篇",
        value: "frame",
        children: [
          {
            name: "vue",
            value: "vue",
            content: ["vue", "template", "vdom"],
          },
        ],
      },
    ];
    const sessionhash = sessionStorage.getItem("hash");
    const route = useRoute();
    const pathname = route.path.match(/\/advance\/(\w+)/);
    const hash = route.hash.replace("#", "");
    if (!hash) {
      list.map((item) => {
        item.children.forEach((i) => {
          if (i.name == sessionhash) {
            i.isActive = true;
          }
        });
      });
    } else {
      const parentlist = list.filter((item) =>
        item.children.find((i) => i.value == pathname[1])
      )[0];
      for (const list of parentlist.children) {
        if (list.content.includes(hash)) {
          list.isActive = true;
          break;
        }
      };

    }
    useParentList(list);
    return () => (
      <div class="advance">
        <Split
          v-slots={{
            Left,
            Content: ({ middleContent }) => h(middleContent),
          }}
          middleContent={component.value}
          rightContent={{}}
          leftContent={list}
        />
      </div>
    );
  },
};
export default SplitContainer;
