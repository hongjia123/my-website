import SplitContainer from "../common/split-container";
import "./css/index.less";
import { onMounted, defineAsyncComponent } from "vue";

const JsAdvance = {
  setup() {
    onMounted(() => {});
    const leftlist = [
      {
        id: 1,
        name: "1. 前端项目开发流程",
      },
      {
        id: 2,
        name: "2. 项目开发规范",
      },
      {
        id: 3,
        name: "3. 项目脚手架配置",
      },
      {
        id: 4,
        name: "4. 构建工具webpack",
      },
      {
        id: 5,
        name: "5. 代码监测与提交部署",
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
<<<<<<< HEAD
export default JsAdvance;
=======
export default Hp;
>>>>>>> 41de2e6143352c5eb9f593411a5276e684b9cbe8
