import Split from "@components/ml-split";
import { reactive, ref, h, onMounted } from "vue";
import { useRoute } from "vue-router";
const Index = ref(0);

const Left = (props) => {
  const clickItem = (list) => {
    Index.value = list.id - 1;
  };
  return (
    <div>
      <br />
      {props.leftContent.map((list, index) => {
        return (
          <div>
            <div
              class={["left_nav", { left_active: index == Index.value }]}
              onClick={() => clickItem(list)}
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
const SplitContainer = {
  props: ["leftContent", "rightContent", "middleContent", "Index"],
  setup(props) {
    const route = useRoute();
    onMounted(() => {
      props.leftContent.forEach((list) => {
        if (list.id == route.query.id) {
          Index.value = list.id - 1;
        }
      });
    });
    Index.value = props.Index.value;
    return () => (
      <Split
        v-slots={{
          Left,
          Content: (props) => {
            return h(props.middleContent);
          },
        }}
        middleContent={props.middleContent[Index.value + 1]}
        leftContent={props.leftContent}
        rightContent={{}}
      />
    );
  },
};
export default SplitContainer;
