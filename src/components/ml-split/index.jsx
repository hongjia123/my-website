import { debounce } from "lodash";
import "./css/index.less";
import { onMounted, ref, reactive, watch, nextTick, h, watchEffect, onUpdated } from "vue";
import { useRoute } from "vue-router";
import { useDirectory } from './util.js';
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
      directory: [], // 本页目录属性对象
      middle: {}, // 内容parentNode
    });

    onMounted(async () => {
      const left = document.querySelector('.left-title-nav');
      const splitline = document.querySelector('.split-line');
      state.middle = document.querySelector('.middle-content-container');
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
      const SetDirectiory = useDirectory();
      const myDir = new SetDirectiory({
        currIndex: 0,
        container: '.middle-content-container',
        firstDirNode: 'h3',
        secondDirNode: 'h4',
        isSetHash: true
      });

      state.directory = await myDir.observe()

      // 滚动激活当前标题目录
      state.middle.addEventListener('scroll',
        function (e) {
          document.querySelector('.right-container').scrollTop = e.target.scrollTop;
          myDir.scrollDir(e, state.directory);
        }
      );

      // // 监听内容文本子节点变化动态获取本页目录
      // const observer = new MutationObserver(() => {
      //   setDirNode();
      // });
      // observer.observe(state.middle, {
      //   childList: true
      // });

    });
    return () => (
      <div class="ml-split-container">
        <div class="left-title-nav">
          {slots.Left(props)}
          <div class="split-line"></div>
        </div>
        <div class="middle-content-container">{slots.Content(props)}</div>
        <div class="right-container">
          <h4 style={{ fontWeight: 'bold', fontSize: '12px', marginBottom: '5px' }}>本页目录</h4>
          <div>
            {
              state.directory.map(item => {
                return (
                  <div >
                    <span style={{ fontSize: '14px', margin: '2px 0', fontWeight: 'bold',cursor:'pointer' }} class={{ 'dir_active': item.dirActive }}>
                      {item.name}
                    </span>
                    {
                      item.childDir?.map(i => {
                        return (
                          <span style={{ fontSize: '12px', margin: '2px 0',cursor:'pointer' }} class={{ 'second_active': i.dirActive }}>{i.name}</span>
                        )
                      })
                    }
                  </div>

                )
              })
            }
          </div>

        </div>
      </div>
    );
  },
};
export default Split;
