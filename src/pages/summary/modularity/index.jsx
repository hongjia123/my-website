import SplitContainer from "../common/split-container";
import "./css/index.less";
import { onMounted, defineAsyncComponent,ref } from "vue";

const Modularity = {
  setup() {
    onMounted(() => {});
    const leftlist = [
      {
        id: 1,
        name: "1. 模块化发展历程",
      },
      {
        id: 2,
        name: "2. 模块化方案",
      },
      {
        id: 3,
        name: "3. 模块化基础",
      },
      {
        id: 4,
        name: "4. 模块化原理",
      },
      {
        id: 5,
        name: "5. 构建工具中的模块化",
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
export default Modularity;
