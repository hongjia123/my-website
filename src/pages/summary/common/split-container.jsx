import Split from "@components/ml-split";
import { reactive, ref, h, onMounted } from "vue";
import { useRoute } from "vue-router";
const Left = (props) => {
  const route = useRoute();

  const leftList = props.leftContent.map((list)=>{
    if(list.id==route.query.id){
      Index.value = list.id - 1;
    }
    return list
  });
  const clickItem=(list)=>{
   Index.value = list.id - 1;
  }
  return (
    <div>
      <br />
      {leftList.map((list, index) => {
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
const Index = ref(0);
const SplitContainer = {
  props: ["leftContent", "rightContent", "Index"],
  setup(props) {
    onMounted(() => {

    });
    Index.value = props.Index.value;
    return () => (
      <Split
        v-slots={{
          Left,
          Content: (props) => {
            // console.log(h(props.rightContent), props.rightContent);
            return h(props.rightContent);
          },
        }}
        rightContent={props.rightContent[Index.value + 1]}
        leftContent={props.leftContent}
      />
    );
  },
};
export default SplitContainer;
