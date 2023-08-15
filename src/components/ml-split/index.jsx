import "./css/index.less";
import { onMounted, ref, defineComponent, DefineComponent } from "vue";

const Split = {
  props: {
    leftContent: Array,
    rightContent: Object,
  },
  setup(props, { slots }) {
    const isResizing = ref(false);
    onMounted(() => {
      const left = document.querySelector('.left-title-nav');
      const splitline = document.querySelector('.split-line');
      const middle = document.querySelector('.middle-content-container');
      const root = document.documentElement;
      root.style.setProperty('--left-width', getComputedStyle(left).width);
      splitline.addEventListener("mousedown", function ($event) {
        isResizing.value = true;
      });
      root.addEventListener("mousemove", function (e) {
        const minClientX = e.clientX < 200 ? 200 : e.clientX;
        const maxClientX = e.clientX > 1000 ? 1000 : minClientX;
        if (isResizing.value) {
          requestAnimationFrame(() => {
            middle.style.width = `calc(100% - ${maxClientX}px - 200px)`;
            middle.style.cursor = "col-resize";
            left.style.width = `${maxClientX}px`;
            left.style.cursor = "col-resize";
          });
        }
      });
      root.addEventListener("mouseup", function (e) {
        middle.style.cursor = "";
        left.style.cursor = "";
        isResizing.value = false;
      });
    });
    return () => (
      <div class="ml-split-container">
        <div class="left-title-nav">
          {slots.Left(props)}
          <div class="split-line"></div>
        </div>
        <div class="middle-content-container">{slots.Content(props)}</div>
        <div class="right-container">
        </div>
      </div>
    );
  },
};
export default Split;
