import SplitContainer from "../common/split-container";
import "./css/index.less";
import { onMounted, defineAsyncComponent } from "vue";

const JsAdvance = {
  setup() {
    onMounted(() => {});
    const leftlist = [
      {
        id: 1,
        name: "1. 函数式编程与高阶函数",
      },
      {
        id: 2,
        name: "2. promise A+规范",
      },
      {
        id: 3,
        name: "3. this、js原型、js类型(判断)",
      },
      {
        id: 4,
        name: "4. js事件循环与浏览器渲染原理",
      },
      {
        id: 5,
        name: "5. js设计模式",
      },
    ];
    const component = {
      1: defineAsyncComponent(() => import("./html1.jsx")),
      2: defineAsyncComponent(() => import("./html2.jsx")),
      3: defineAsyncComponent(() => import("./html3.jsx")),
      4: defineAsyncComponent(() => import("./html4.jsx")),
      5: defineAsyncComponent(() => import("./html5.jsx")),
    };
    return () => (
      <div class="hp-container">
        <SplitContainer leftContent={leftlist} rightContent={component} />
      </div>
    );
  },
};
export default JsAdvance;
