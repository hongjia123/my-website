import { reactive, ref } from 'vue';
import { useRoute } from "vue-router";
export const setArray = (collect) => {
    console.log(collect);
    return [].slice.call(collect)
};
class SetDirectory {
    constructor(option) {
        // 离开二级目录
        let leaveSecond = (directory, index) => {
            if (directory[index].childDir.length != 0) {
                console.log(this.secondDir);
                directory[index].childDir[this.secondDir.currIndex].dirActive = false;
            }
            console.log(this);
        };
        // 进入二级目录
        let enterSecond = (directory, index) => {
            if (directory[index].childDir.length != 0) {
                directory[index].childDir[this.secondDir.currIndex].dirActive = true;
            }
        };
        this.directory = ref([]);
        this.isSetHash = option.isSetHash;
        this.currIndex = option.currIndex; // 设置当前目录索引
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
            currIndex: 0, // 当前目录索引
            contentNode: '',// 二级目录对应文本元素节点
        };
        this.route = useRoute();
        this.id = '';
        if (option.container && option.firstDirNode) {
            this.container = document.querySelector(option.container); // 目录文本容器
            this.firstDir.contentNode = document.getElementsByTagName(option.firstDirNode) || ''
        } else {
            throw new Error('firstDirNode and container(content) is must')
        }
        this.secondDir.contentNode = option.secondDirNode || '';
        // this.observe().then((res) => {
        //    thid.directory.value = res;
        // })

    }

    // 设置hash
    setHash(dir) {
        console.log(this);
        if (!this.id || this.id !== dir.find(item => item.dirActive)?.id) {
            this.id = dir.find(item => item.dirActive)?.id;
            location.href = location.href.replace(/(\.html)(#\w+|$)$/, `$1${this.id ? ('#' + this.id) : ''}`);
        }
    }
    scrollToHash(offset) {
        let raf; // 请求动画帧
        const offsetTop = (this.route.hash && document.querySelector(this.route.hash).offsetTop - 80) || offset;
        const fn = () => {
            const scrollTop = this.container.scrollTop;
            const isspeed = offsetTop / 8;
            this.container.scrollTop = (scrollTop + isspeed) > offsetTop ? offsetTop : (scrollTop + isspeed);
            if (scrollTop < offsetTop) {
                raf = requestAnimationFrame(fn);
            } else {
                cancelAnimationFrame(raf);
            }
        };
        raf = requestAnimationFrame(fn);
    }

    // 设置本页目录
    setDirNode() {
        let _this = this;
        const dirNode = setArray(this.firstDir.contentNode);//一级标题node
        this.directory.value = dirNode.map(item => {
            item.onclick = function () {
                console.log(333);
                _this.scrollToHash(item.offsetTop);
            };
            const childDir = [];
            if (this.secondDir.contentNode) {
                setArray(item.parentNode.getElementsByTagName(this.secondDir.contentNode)).map((node, index) => {
                    node.onclick = function () {

                    };
                    childDir.push({
                        name: node.innerText,
                        offsetTop: node.offsetTop,
                    })
                })
            }
            return {
                name: item.innerHTML,
                id: item.id,
                offsetTop: item.offsetTop,
                dirActive: item.id == this.route.hash.replace('#', ''),
                childDir
            }
        });
        console.log(this.directory);
        this.isSetHash && this.scrollToHash();

    };

    // 监听目录文本容器内容的变化返回当前页目录
    observe() {
        return new Promise((resolve, reject) => {
            // 监听文本容器
            const observer = new MutationObserver((result) => {
                this.setDirNode()
                resolve(this.directory.value);
            });
            observer.observe(this.container, {
                childList: true
            });
        })

    }

    /**  滚动激活当前目录
     * @param {Object} e 当前节点滚动属性对象
     * @param {Object} startDir 运行的目录对象
     */
    scrollDir(e, dir, startDir) {
        // dir = (dir || this.directory.value);

        if (dir.length == 0) return
        startDir = (startDir || this.firstDir)
        const { currIndex, leaveSecond, enterSecond } = startDir;
        if (!e.target.scrollTop) {
            dir[currIndex].dirActive = false;
        }
        if (e.target.scrollTop > dir[currIndex].offsetTop - 100) {
            dir[0].dirActive = !currIndex;
            // 开始滚动二级目录

            // 滚动到下一个目录
            if ((currIndex < dir.length - 1) && (e.target.scrollTop > dir[currIndex + 1].offsetTop - 100)) {
                leaveSecond && leaveSecond(dir, currIndex); // 离开二级目录
                startDir.currIndex++;
                dir[currIndex + 1].dirActive = true;
                dir[currIndex].dirActive = false;
                this.setHash(dir);
            }
        } else {
            if (currIndex) {
                dir[currIndex - 1].dirActive = true;
                dir[currIndex].dirActive = false;
                startDir.currIndex--;
                enterSecond && enterSecond(dir, startDir.currIndex);
                this.setHash(dir);
            } else {
                dir[currIndex].dirActive = false;
            }
        }
        // 滚动二级目录
        dir[currIndex].childDir && this.scrollDir(e, dir[currIndex].childDir, this.secondDir);

    };
};

export const useDirectory = () => {

    return SetDirectory;
}