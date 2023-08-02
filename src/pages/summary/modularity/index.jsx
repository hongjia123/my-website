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
      name: "1. 模块化发展历程"
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
