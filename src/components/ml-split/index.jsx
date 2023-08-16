import { debounce } from "lodash";
import "./css/index.less";
import { onMounted, ref, reactive, watch} from "vue";
import { useRoute } from "vue-router";
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
      directory: []
    });
    let raf;
    let id;
    onMounted(() => {
      const left = document.querySelector('.left-title-nav');
      const splitline = document.querySelector('.split-line');
      const middle = document.querySelector('.middle-content-container');
      const root = document.documentElement;
      root.style.setProperty('--left-width', getComputedStyle(left).width);
      splitline.addEventListener("mousedown", function ($event) {
        isResizing.value = true;
      });
      // 监听页面挂载完成后设置目录
      window.onload = window.onreadystatechange = function () {
        if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") {
          setDirNode();
        }
      };
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

      // 
      middle.addEventListener('scroll', function (e) {
      })

      // 滚动激活当前标题目录
      middle.addEventListener('scroll', debounce(function (e) {
        document.querySelector('.right-container').scrollTop = e.target.scrollTop;
        for (let i = 0; i < state.directory.length; i++) {
          if (e.target.scrollTop > state.directory[i].offsetTop - 100) {
            state.directory[i].dirActive = true;
            if (i != 0) {
              state.directory[i - 1].dirActive = false;
              if (i < state.directory.length - 1) {
                state.directory[i + 1].dirActive = false;
              }
            }
          }
          if (e.target.scrollTop < state.directory[i].offsetTop - 100) {
            state.directory[i].dirActive = false;
          }
        }
        if (!id || id !== state.directory.find(item => item.dirActive)?.id) {
          id = state.directory.find(item => item.dirActive)?.id;
          location.href = location.href.replace(/(\.html)(#\w+|$)$/, `$1${id ? ('#' + id) : ''}`);
          console.log(id);
        }
      }, 50));

      // 异步获取副标题元素进行目录展示
      requestAnimationFrame(() => {
        setDirNode();
      });
    });

    // 路由改变重新获取当页目录
    watch(() => route.path, (newval, oldval) => {
      if (/\.html/.test(newval)) {
        setDirNode();
      }
    });

    // 设置目录节点
    const setDirNode = () => {
      const dirNode = [].slice.call(document.getElementsByTagName('h3'));
      state.directory = dirNode.map(item => {
        return {
          name: item.innerHTML,
          id: item.id,
          offsetTop: item.offsetTop,
          dirActive: item.id == route.hash.replace('#', '')
        }
      })
      const offsetTop = route.hash && document.querySelector(route.hash).offsetTop - 80;
      const fn = () => {
        const scrollTop = document.querySelector('.middle-content-container').scrollTop;
        const isspeed = offsetTop / 8;
        document.querySelector('.middle-content-container').scrollTop = (scrollTop + isspeed) > offsetTop ? offsetTop : (scrollTop + isspeed);
        if (scrollTop < offsetTop) {
          raf = requestAnimationFrame(fn);
        } else {
          cancelAnimationFrame(raf);
        }
      };
      raf = requestAnimationFrame(fn);


    }
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
                  <span style={{ fontSize: '13px', margin: '2px 0', display: 'flex', alignItems: 'center' }} class={{ 'right_active': item.dirActive }}>{item.name}</span>

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
