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

    // let firstDir = {
    //   currIndex: 0, //当前目录索引
    //   // 从一级目录离开二级
    //   leaveSecond: function (dir, index, setHash) {
    //     if (dir[index].childDir.length != 0) {
    //       dir[index].childDir[secondDir.currIndex].dirActive = false;
    //     }
    //     setHash && setHash(dir);
    //   },
    //   // 从一级目录进入二级
    //   enterSecond: function (dir, index, setHash) {
    //     if (dir[index].childDir.length != 0) {
    //       dir[index].childDir[secondDir.currIndex].dirActive = true;
    //     }
    //     setHash && setHash(dir);
    //   }
    // }; // 一级目录属性对象
    // let secondDir = {
    //   currIndex: 0 // 当前目录索引
    // }; // 二级目录属性对象

    // /**
    //  * @param {Object} e 当前节点滚动属性对象
    //  * @param {Array<Object>} dir 一级目录对象或者二级目录对象
    //  * @param {Object} dirPropretyObj 目录属性对象
    //  */
    // const scrollDir = function (e, dir, dirPropretyObj) {
    //   if (!dir || dir.length == 0) return
    //   const { currIndex, leaveSecond, enterSecond } = dirPropretyObj;
    //   if (!e.target.scrollTop) {
    //     dir[currIndex].dirActive = false;
    //   }
    //   if (e.target.scrollTop > dir[currIndex].offsetTop - 100) {
    //     dir[0].dirActive = !currIndex;
    //     // 滚动到下一个目录
    //     if ((currIndex < dir.length - 1) && (e.target.scrollTop > dir[currIndex + 1].offsetTop - 100)) {
    //       leaveSecond && leaveSecond(dir, currIndex, setHash); // 离开二级目录
    //       dirPropretyObj.currIndex++;
    //       dir[currIndex + 1].dirActive = true;
    //       dir[currIndex].dirActive = false;

    //     }
    //   } else {
    //     if (currIndex) {
    //       dir[currIndex - 1].dirActive = true;
    //       dir[currIndex].dirActive = false;
    //       dirPropretyObj.currIndex--;
    //       enterSecond && enterSecond(dir, dirPropretyObj.currIndex,setHash);
    //     } else {
    //       dir[currIndex].dirActive = false;
    //     }
    //   }
    //   // 开始滚动二级目录
    //   scrollDir(e, dir[currIndex].childDir, secondDir);



    // };
    // const setHash = (dir) => {
    //   // 设置hash
    //   if (!id || id !== dir.find(item => item.dirActive)?.id) {
    //     id = dir.find(item => item.dirActive)?.id;
    //     location.href = location.href.replace(/(\.html)(#\w+|$)$/, `$1${id ? ('#' + id) : ''}`);
    //   }
    // }

    // const setArray = (collect) => {
    //   return [].slice.call(collect)
    // }
    // // 设置目录节点
    // const setDirNode = (node) => {
    //   const dirNode = setArray(document.getElementsByTagName('h3'));//一级标题node
    //   state.directory = dirNode.map(item => {
    //     const childDir = [];
    //     setArray(item.parentNode.getElementsByTagName('h4')).map((node, index) => {
    //       childDir.push({
    //         name: node.innerText,
    //         offsetTop: node.offsetTop,
    //       })

    //     })
    //     return {
    //       name: item.innerHTML,
    //       id: item.id,
    //       offsetTop: item.offsetTop,
    //       dirActive: item.id == route.hash.replace('#', ''),
    //       childDir: childDir || ''
    //     }
    //   })
    //   const offsetTop = route.hash && document.querySelector(route.hash).offsetTop - 80;
    //   const fn = () => {
    //     const scrollTop = document.querySelector('.middle-content-container').scrollTop;
    //     const isspeed = offsetTop / 8;
    //     document.querySelector('.middle-content-container').scrollTop = (scrollTop + isspeed) > offsetTop ? offsetTop : (scrollTop + isspeed);
    //     if (scrollTop < offsetTop) {
    //       raf = requestAnimationFrame(fn);
    //     } else {
    //       cancelAnimationFrame(raf);
    //     }
    //   };
    //   raf = requestAnimationFrame(fn);
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
      const SetDirectiory = useDirectory();
      const myDir = new SetDirectiory({
        currIndex: 0,
        container: '.middle-content-container',
        firstDirNode: 'h3',
        secondDirNode: 'h4',
        isSetHash:false
      });
      myDir.observe().then((res) => {
        state.directory = myDir.directory.value;
      })
      // 滚动激活当前标题目录
      state.middle.addEventListener('scroll',
        function (e) {
          document.querySelector('.right-container').scrollTop = e.target.scrollTop;
          myDir.scrollDir(e);
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
                    <span style={{ fontSize: '14px', margin: '2px 0', fontWeight: 'bold' }} class={{ 'dir_active': item.dirActive }}>
                      {item.name}
                    </span>
                    {
                      item.childDir?.map(i => {
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
