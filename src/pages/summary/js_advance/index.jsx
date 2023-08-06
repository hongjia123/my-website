import SplitContainer from "../common/split-container";
import "./css/index.less";
import { onMounted, defineAsyncComponent,ref } from "vue";

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
        name: "2. js异步与事件循环",
      },
      {
        id: 3,
        name: "3. this、js原型、js类型",
      },
      {
        id:4,
        name:"4. js代理"
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
    const Index = ref(0);
    return () => (
      <div class="hp-container">
        <SplitContainer leftContent={leftlist} rightContent={component} Index={Index}/>
      </div>
    );
  },
};
export default JsAdvance;
