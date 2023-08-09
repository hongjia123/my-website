import SplitContainer from "../common/split-container";
import { onMounted, defineAsyncComponent,ref } from "vue";

const CsAdvance = {
  setup() {
    onMounted(() => {});
    const leftlist = [
      {
        id: 1,
        name: "1. css BFC",
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
        name: "4. css响应式布局与浏览器兼容",
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
export default CsAdvance;
