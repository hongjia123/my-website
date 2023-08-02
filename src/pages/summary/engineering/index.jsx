import Split from "@components/ml-split";
import "./css/index.less";
import {
  reactive,
  ref,
  h,
  defineAsyncComponent,
  onMounted,
} from "vue";

const Left = (props) => {
  const leftList = reactive([
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
  ]);
  return (
    <div>
      <br />
      {leftList.map((list,index) => {
        return (
          <div>
            <div class={["left_nav", { 'left_active': index == Index.value - 1 }]} onClick={() => (Index.value = list.id)}>
              <strong>
                <i>{list.name}</i>
              </strong>
            </div>
            <br />
            <br />
            <br />
            <br />
          </div>
        );
      })}
    </div>
  );
}
const component = {
  1: defineAsyncComponent(() => import("./html1.jsx")),
  2: defineAsyncComponent(() => import("./html2.jsx")),
  3: defineAsyncComponent(() => import("./html3.jsx")),
  4: defineAsyncComponent(() => import("./html4.jsx")),
  5: defineAsyncComponent(() => import("./html5.jsx")),
};
const Index = ref(1);
const Hp = {
  setup() {
    onMounted(() => { });
    return () => (
      <div class="hp-container">
        <Split
          v-slots={{
            Left,
            Content: (props) => {
              return h(props)
            }
          }}
          component={component[Index.value]}
        />
      </div>
    );
  },
};
export default Hp;
