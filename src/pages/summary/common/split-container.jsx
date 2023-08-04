import Split from "@components/ml-split";
import { reactive, ref, h, onMounted } from "vue";

const Left = (props) => {
  const leftList = reactive(props.leftContent);
  return (
    <div>
      <br />
      {leftList.map((list, index) => {
        return (
          <div>
            <div
              class={["left_nav", { left_active: index == Index.value - 1 }]}
              onClick={() => (Index.value = list.id)}
            >
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
};

const Index = ref(1);
const SplitContainer = {
  props: ["leftContent", "rightContent"],
  setup(props) {
    console.log(props);
    onMounted(() => {});
    return () => (
      <div class="hp-container">
        <Split
          v-slots={{
            Left,
            Content: (props) => {
              return h(props.rightContent);
            },
          }}
          rightContent={props.rightContent[Index.value]}
          leftContent={props.leftContent}
        />
      </div>
    );
  },
};
export default SplitContainer;
