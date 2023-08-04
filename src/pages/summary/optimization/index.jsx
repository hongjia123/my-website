import SplitContainer from "../common/split-container";
import "./css/index.less";
import { onMounted, defineAsyncComponent } from "vue";

const Optimization = {
  setup() {
    onMounted(() => {});
    const leftlist = [
      {
        id: 1,
        name: "1. 首屏与静态资源加载优化",
      },
      {
        id: 2,
        name: "2. http优化",
      },
      {
        id: 3,
        name: "3. js性能优化",
      },
      {
        id: 4,
        name: "4. 流程优化",
      },
      {
        id: 5,
        name: "5. 构建性能优化",
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
export default Optimization;
=======
export default Hp;
>>>>>>> 41de2e6143352c5eb9f593411a5276e684b9cbe8
