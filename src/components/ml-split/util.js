import { debounce } from 'lodash';
import { defineComponent, onMounted, reactive, ref, h, createApp, watch } from 'vue';
import { useRoute } from "vue-router";
const setArray = (collect) => {
    console.log(collect);
    return [].slice.call(collect)
};
class SetDirectory {
    constructor(option) {
        // 离开二级目录
        let leaveSecond = (directory, index) => {
            if (directory[index].childDir.length != 0) {
                directory[index].childDir[this.secondDir[index].currIndex].dirActive = false;
            }
        };
        // 进入二级目录
        let enterSecond = (directory, index) => {
            if (this.secondDir[index].currIndex && directory[index].childDir.length != 0) {
                directory[index].childDir[this.secondDir[index].currIndex].dirActive = true;
                console.log(directory[index].childDir, this.secondDir);
            }
        };
        this.isClickDir = false; // 是否点击目录
        this.directory = ref([]);
        this.isSetHash = option.isSetHash;
        // 一级目录属性对象
        this.firstDir = {
            currIndex: 0, //当前目录索引
            contentNode: '',// 一级目录对应文本元素节点
            // 从一级目录离开二级
            leaveSecond: option.secondDirNode && leaveSecond,
            // 从一级目录进入二级
            enterSecond: option.secondDirNode && enterSecond
        };
        // 二级目录属性对象
        this.secondDir = {
            contentNode: '',// 二级目录对应文本元素节点
        };
        // this.dirMap = new Map();
        // map.set(this.firstDir,function(dir){

        // });
        // map.set(this.firstDir,function(dir){

        // })
        this.route = useRoute();
        this.id = '';
        this.secondDir.contentNode = option.secondDirNode || '';
        if (option.container && option.firstDirNode && option.el) {
            this.el = option.el;
            this.container = document.querySelector(option.container); // 目录文本容器
            this.firstDir.contentNode = document.getElementsByTagName(option.firstDirNode) || ''
        } else {
            throw new Error('firstDirNode、el、 and container(content) is must')
        }



    }

    // 设置hash
    setHash(dir) {
        if (!this.id || this.id !== dir.find(item => item.dirActive)?.id) {
            this.id = dir.find(item => item.dirActive)?.id;
            location.href = location.href.replace(/(\.html)(#\w+|$)$/, `$1${this.id ? ('#' + this.id) : ''}`);
        }
    }

    // 滚动至指定目录标题
    scrollToHash(offset) {
        let raf; // 请求动画帧
        const offsetTop = offset || (this.route.hash && document.querySelector(this.route.hash).offsetTop - 80);
        const start = this.container.scrollTop;
        const fn = () => {
            const scrollTop = this.container.scrollTop;
            const isspeed = (offsetTop - start) / 5;
            if (start < offsetTop) {
                this.container.scrollTop = (scrollTop + isspeed) > offsetTop ? offsetTop : (scrollTop + isspeed);
                if (this.container.scrollTop < offsetTop) {
                    raf = requestAnimationFrame(fn);
                } else {
                    cancelAnimationFrame(raf);
                }
            } else {
                this.container.scrollTop = (scrollTop + isspeed) < offsetTop ? offsetTop : (scrollTop + isspeed);
                if (this.container.scrollTop > offsetTop) {
                    raf = requestAnimationFrame(fn);
                } else {
                    cancelAnimationFrame(raf);
                }
            }
        };
        raf = requestAnimationFrame(fn);
    }

    // 设置本页目录
    setDirNode() {
        let _this = this;
        const dirNode = setArray(this.firstDir.contentNode);//一级标题node
        const directory = dirNode.map(item => {
            const childDir = [];
            if (this.secondDir.contentNode) {
                setArray(item.parentNode.getElementsByTagName(this.secondDir.contentNode)).map((node, index) => {
                    childDir.push({
                        name: node.innerText,
                        offsetTop: node.offsetTop,
                    })
                })
            }
            return {
                name: item.innerText,
                id: item.id,
                offsetTop: item.offsetTop,
                dirActive: item.id == this.route.hash.replace('#', ''),
                childDir
            }
        });
        directory.map((dir, index) => {
            this.secondDir[index] = {
                currIndex: dir.childDir.length != 0 ? 0 : ''
            }
        })
        this.isSetHash && this.scrollToHash();
        return directory

    };

    // 监听目录文本容器内容的变化返回当前页目录
    observe() {
        return new Promise((resolve, reject) => {
            // 监听文本容器
            const observer = new MutationObserver((result) => {
                resolve(this.setDirNode());
            });
            observer.observe(this.container, {
                childList: true
            });
        })

    }

    /**  滚动激活当前目录 m
     * @param {Object} e 当前节点滚动属性对象
     * @param {Array} dir 当前目录对象
     * @param {Object} startDir 运行的目录对象
     */
    scrollDir(e, dir = this.directory.value, startDir) {
        if (dir.length == 0) return
        startDir = (startDir || this.firstDir)
        const { currIndex, leaveSecond, enterSecond } = startDir;
        if (!e.target.scrollTop) {
            dir[currIndex].dirActive = false;
        }
        if (e.target.scrollTop > dir[currIndex].offsetTop - 100) {
            dir[0].dirActive = !currIndex;
            // 滚动二级目录
            dir[currIndex].childDir && this.scrollDir(e, dir[currIndex].childDir, this.secondDir[currIndex]);
            // 滚动到下一个目录
            if ((currIndex < dir.length - 1) && (e.target.scrollTop > dir[currIndex + 1].offsetTop - 100)) {

                leaveSecond && leaveSecond(dir, currIndex); // 离开二级目录
                dir[currIndex + 1].dirActive = true;
                dir[currIndex].dirActive = false;
                startDir.currIndex++;
                // this.setHash(dir);
            }
        }
        if (e.target.scrollTop < dir[currIndex].offsetTop - 100) {
            currIndex && (dir[currIndex - 1].dirActive = true);
            dir[currIndex].dirActive = false;
            startDir.currIndex && startDir.currIndex--;
            enterSecond && enterSecond(dir, startDir.currIndex);
            dir[currIndex].childDir && this.scrollDir(e, dir[currIndex].childDir, this.secondDir[currIndex]);

        }

    };

    // 渲染目录节点
    render(dir) {
        let _this = this;
        createApp({
            setup() {
                const scrollTop = ref(0);
                let timer = ref(null);
                watch(scrollTop, (newValue, oldValue) => {
                    if (timer.value) {
                        clearTimeout(timer.value)
                    }
                    timer = setTimeout(() => {
                        if (newValue == _this.container.scrollTop) { //延时执行后当newValue等于window.scrollY，代表滚动结束
                            console.log('滚动结束');
                            const parent = _this.directory.value;
                            parent.map((dir, i) => {
                                if (_this.isClickDir){
                                    if (newValue + 80 == dir.offsetTop) {
                                        dir.dirActive = true;
                                        (i < parent.length - 1) && (parent[i + 1].dirActive = false);
                                    }
                                }
                                const child = parent[i].childDir;
                                child.forEach((item, index) => {
                                    if (_this.isClickDir) {
                                        if (newValue + 80 == item.offsetTop) {
                                            item.dirActive = true;
                                            parent[i].dirActive = true;
                                            (i < parent.length - 1) && (parent[i + 1].dirActive = false);
                                        } else {
                                            item.dirActive = false;
                                        }
                                    } else {
                                        if (index != child.length - 1) {
                                            if ((newValue + 80 > child[index].offsetTop) && (newValue + 80 < child[index + 1].offsetTop)) {
                                                item.dirActive = true;
                                            } else {
                                                item.dirActive = false;
                                            }
                                        } else {
                                            if ((newValue + 80 > child[index].offsetTop) && (newValue + 80 < parent[i + 1].offsetTop)) {
                                                item.dirActive = true;
                                            } else {
                                                item.dirActive = false;
                                            }
                                        }


                                    }
                                });

                            })
                            _this.isClickDir = false;
                        };
                    }, 50);
                })
                onMounted(async () => {
                    _this.directory.value = await _this.observe();
                    _this.container.addEventListener('scroll', function (e) {
                        scrollTop.value = e.target.scrollTop;
                        _this.scrollDir(e);
                    })
                });
                const clickDir = (e, currDirItem) => {
                    7
                    _this.isClickDir = true;
                    if (currDirItem.name === e.target.innerText) {
                        _this.scrollToHash(currDirItem.offsetTop - 80);
                    }
                    // _this.isClickDir = true;
                    // if (currDirItem.name === e.target.innerText) {
                    //     _this.container.scrollTop = currDirItem.offsetTop - 90;
                    //     _this.directory.value.map((dir, i) => {
                    //         if (dir == currDirItem) {
                    //             dir.dirActive = true
                    //         } else {
                    //             dir.dirActive = false
                    //         }
                    //         dir.childDir?.map(item => {
                    //             if (item == currDirItem) {
                    //                 item.dirActive = true
                    //             } else {
                    //                 item.dirActive = false
                    //             }
                    //         })
                    //     })
                    // }

                }
                return () => (
                    <>
                        <h4 style={{ fontWeight: 'bold', fontSize: '12px', marginBottom: '5px' }}>本页目录</h4>
                        <div>
                            {
                                _this.directory.value.map(item => {
                                    return (
                                        <div >
                                            <span onClick={(e) => clickDir(e, item)} style={{ fontSize: '14px', margin: '2px 0', fontWeight: 'bold', cursor: 'pointer' }} class={{ 'dir_active': item.dirActive }}>
                                                {item.name}
                                            </span>
                                            {
                                                item.childDir?.map(i => {
                                                    return (
                                                        <span onClick={(e) => clickDir(e, i)} style={{ fontSize: '12px', margin: '2px 0', cursor: 'pointer' }} class={{ 'second_active': i.dirActive }}>{i.name}</span>
                                                    )
                                                })
                                            }
                                        </div>

                                    )
                                })
                            }
                        </div>
                    </>
                )
            }
        }).mount(this.el);
        return this
    }
};

export const useDirectory = () => {
    return SetDirectory;
}
