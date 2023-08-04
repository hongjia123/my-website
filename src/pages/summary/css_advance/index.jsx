import SplitContainer from "../common/split-container";
import "./css/index.less";
import { onMounted, defineAsyncComponent } from "vue";

const CsAdvance = {
  setup() {
    onMounted(() => {});
    const leftlist = [
      {
        id: 1,
        name: "1. css布局",
      },
      {
        id: 2,
        name: "2. css动画",
      },
      {
        id: 3,
        name: "3. css变量",
      },
      {
        id: 4,
        name: "4. css响应式",
      },
      {
        id: 5,
        name: "5. css兼容",
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
export default CsAdvance;
