import { debounce } from "lodash";
import "./css/index.less";
import {
  onMounted,
  ref,
  reactive,
  watch,
  nextTick,
  h,
  watchEffect,
  onUpdated,
  defineComponent,
  shallowRef,
} from "vue";
import { useRoute } from "vue-router";
import { useDirectory } from "./util.js";
const Split = {
  props: {
    leftContent: Array,
    middleContent: Object,
    rightContent: Object,
  },
  setup(props, { slots }) {
    const isResizing = ref(false);
    const route = useRoute();
    const state = reactive({
      middle: {}, // 内容parentNode
    });

    const SetDirectory = useDirectory();
    onMounted(async () => {
      const left = document.querySelector(".left-title-nav");
      const splitline = document.querySelector(".split-line");
      state.middle = document.querySelector(".middle-content-container");
      const root = document.documentElement;
      root.style.setProperty("--left-width", getComputedStyle(left).width);
      splitline.addEventListener("mousedown", function ($event) {
        isResizing.value = true;
      });
      root.addEventListener("mousemove", function (e) {
        const minClientX = e.clientX < 200 ? 200 : e.clientX;
        const maxClientX = e.clientX > 1000 ? 1000 : minClientX;
        if (isResizing.value) {
          requestAnimationFrame(() => {
            state.middle.style.width = `calc(100% - ${maxClientX}px - 200px)`;
            state.middle.style.cursor = "col-resize";
            left.style.width = `${maxClientX}px`;
            left.style.cursor = "col-resize";
          });
        }
      });

      root.addEventListener("mouseup", function (e) {
        state.middle.style.cursor = "";
        left.style.cursor = "";
        isResizing.value = false;
      });
      // 滚动激活当前标题目录
      new SetDirectory({
        currIndex: 0,
        el: ".right-container",
        container: ".middle-content-container",
        firstDirNode: "h3",
        secondDirNode: "h4",
        isSetHash: true,
      }).render();
      // state.middle.addEventListener('scroll',
      //   function (e) {
      //     document.querySelector('.right-container').scrollTop = e.target.scrollTop;
      //     directory.scrollDir(e);

      //   }
      // );
    });

    return () => (
      <div class="ml-split-container">
        <div class="left-title-nav">
          {slots.Left(props)}
          <div class="split-line"></div>
        </div>
        <div class="middle-content-container">{slots.Content(props)}</div>
        <div class="right-container"></div>
      </div>
    );
  },
};
export default Split;
