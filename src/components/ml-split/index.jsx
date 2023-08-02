import "./css/index.less";
import { onMounted, ref, defineComponent, DefineComponent } from "vue";

const Split = {
  props: {
    component: Object,
  },
  setup(props, { slots }) {
    const isResizing = ref(false);
    onMounted(() => {
      document
        .querySelector(".split-line")
        .addEventListener("mousedown", function ($event) {
          isResizing.value = true;
        });
      document.documentElement.addEventListener("mousemove", function (e) {
        if (isResizing.value) {
          requestAnimationFrame(() => {
            document.querySelector(
              ".right-content-container"
            ).style.width = `auto`;
            document.querySelector(".right-content-container").style.cursor =
              "col-resize";
            document.querySelector(
              ".left-title-nav"
            ).style.width = `${e.clientX}px`;
            document.querySelector(".left-title-nav").style.cursor =
              "col-resize";
          });
        }
      });
      document.documentElement.addEventListener("mouseup", function (e) {
        document.querySelector(
          ".right-content-container"
        ).style.width = `calc(100% - ${e.clientX}px)`;
        document.querySelector(".right-content-container").style.cursor = "";
        document.querySelector(".left-title-nav").style.cursor = "";
        isResizing.value = false;
      });
    });

    return () => (
      <div class="ml-split-container">
        <div class="left-title-nav">
          {slots.Left()}
          <div class="split-line"></div>
        </div>
        <div class="right-content-container">
          {slots.Content(props.component)}
        </div>
      </div>
    );
  },
};
export default Split;
