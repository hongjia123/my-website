import { debounce } from "lodash";
import "./css/index.less";
import { onMounted, ref, reactive, watch, nextTick, h, watchEffect, onUpdated } from "vue";
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
      directory: [],
      middle: {},
    });
    let raf;
    let id;
    // // 监听页面挂载完成后设置目录
    // window.onload = window.onreadystatechange = function () {
    //   console.log(67);
    //   if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") {
    //     console.log(44);
    //     setDirNode();
    //   }
    // };
    onMounted(() => {
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


      // 
      state.middle.addEventListener('scroll', function (e) {
        document.querySelector('.right-container').scrollTop = e.target.scrollTop;
      })

      // 滚动激活当前标题目录
      state.middle.addEventListener('scroll', debounce(function (e) {
        scrollDir(e, state.directory)
      }, 50));


      // 监听内容文本子节点变化动态获取本页目录
      const observer = new MutationObserver(() => {
        setDirNode();
      });
      observer.observe(state.middle, {
        childList: true
      });

    });
    let currDirIndex = 0;
    const scrollDir = function (e, dir) {
      // console.log(!Array.isArray(dir));
      // if (!Array.isArray(dir)) return
      // for (let i = 0; i < dir.length; i++) {
      //   if (e.target.scrollTop > dir[i].offsetTop - 100) {
      //     dir[i].dirActive = true;
      //     if (i != 0) {
      //       dir[i - 1].dirActive = false;
      //       if (i < dir.length - 1) {
      //         dir[i + 1].dirActive = false;
      //       }
      //     }
      //     dir.map(item => {
      //       if (item.children&&item.children.length!=0) {
      //         scrollDir(e, item.children)
      //       }

      //     })
      //   }
      //   if (e.target.scrollTop < dir[i].offsetTop - 100) {
      //     dir[i].dirActive = false;
      //   }
      // }
      // if (!id || id !== dir.find(item => item.dirActive)?.id) {
      //   id = dir.find(item => item.dirActive)?.id;
      //   location.href = location.href.replace(/(\.html)(#\w+|$)$/, `$1${id ? ('#' + id) : ''}`);
      // }
      if (e.target.scrollTop > dir[currDirIndex].offsetTop - 100) {
        dir[currDirIndex].dirActive = true;
        if (currDirIndex) {
          dir[currDirIndex - 1].dirActive = false;
        }
      } else {
        if (e.target.scrollTop < dir[currDirIndex].offsetTop - 100) {
          dir[currDirIndex].dirActive = false;
          dir[currDirIndex - 1].dirActive = true;
          currDirIndex--;
        }
      }





    };
    const setArray = (collect) => {
      return [].slice.call(collect)
    }
    // 设置目录节点
    const setDirNode = (node) => {
      const dirNode = setArray(document.getElementsByTagName('h3'));//一级标题node
      const secondDir = setArray(document.getElementsByTagName('h4'));// 二级标题node
      state.directory = dirNode.map(item => {
        const children = [];
        setArray(item.nextSibling.childNodes).map((node, index) => {
          if (node.nodeName == 'LI') {
            children.push({
              name: node.innerText,
              offsetTop: secondDir[index].offsetTop,
            })
          }
        })
        return {
          name: item.innerHTML,
          id: item.id,
          offsetTop: item.offsetTop,
          dirActive: item.id == route.hash.replace('#', ''),
          children,
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
    };
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
                    <span style={{ fontSize: '14px', margin: '2px 0' }} class={{ 'dir_active': item.dirActive }}>
                      {item.name}
                    </span>
                    {
                      item.children?.map(i => {
                        return (
                          <span style={{ fontSize: '12px', margin: '2px 0' }} class={{ 'second_active': i.dirActive }}>{i.name}</span>
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
