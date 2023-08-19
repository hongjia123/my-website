import { reactive, ref } from 'vue';
import { useRoute } from "vue-router";
export const setArray = (collect) => {
    console.log(collect);
    return [].slice.call(collect)
};
class SetDirectory {
    constructor(option) {
        this.directory = ref([]);
        this.isSetHash = option.isSetHash;
        this.currIndex = option.currIndex; // 设置当前目录索引
        this.container = document.querySelector(option.container); // 目录文本容器
        // 一级目录属性对象
        this.firstDir = {
            currIndex: 0, //当前目录索引
            dirNode: document.getElementsByTagName(option.firstDirNode),// 一级目录对应文本元素节点
            // 从一级目录离开二级
            leaveSecond: this.leaveSecond,
            // 从一级目录进入二级
            enterSecond: this.enterSecond
        };
        // 二级目录属性对象
        this.secondDir = {
            currIndex: 0, // 当前目录索引
            dirNode: document.querySelector(option.secondDirNode),// 二级目录对应文本元素节点
        };
        this.route = useRoute();
        this.id = '';

    }
    // 离开二级目录
    leaveSecond(directory, index, callback) {
        if (directory[index].childDir.length != 0) {
            directory[index].childDir[this.secondDir.currIndex].dirActive = false;
        }
        (callback && this.isSetHash) && callback(directory);
    };
    // 进入二级目录
    enterSecond(directory, index, callback) {
        if (directory[index].childDir.length != 0) {
            directory[index].childDir[this.secondDir.currIndex].dirActive = true;
        }
        (callback && this.isSetHash) && callback(directory);
    }
    // 设置hash
    setHash(dir) {
        if (!id || id !== dir.find(item => item.dirActive)?.id) {
            id = dir.find(item => item.dirActive)?.id;
            location.href = location.href.replace(/(\.html)(#\w+|$)$/, `$1${id ? ('#' + id) : ''}`);
        }
    }
    scrollToHash() {
        let raf; // 请求动画帧
        const offsetTop = this.route.hash && document.querySelector(this.route.hash).offsetTop - 80;
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
        const dirNode = setArray(this.firstDir.dirNode);//一级标题node
        this.directory.value = dirNode.map(item => {
            const childDir = [];
            setArray(item.parentNode.getElementsByTagName('h4')).map((node, index) => {
                childDir.push({
                    name: node.innerText,
                    offsetTop: node.offsetTop,
                })
            })
            return {
                name: item.innerHTML,
                id: item.id,
                offsetTop: item.offsetTop,
                dirActive: item.id == this.route.hash.replace('#', ''),
                childDir: childDir || ''
            }
        });
        console.log(this.directory);
        this.isSetHash && this.scrollToHash();

    };

    // 监听目录文本容器内容的变化设置当前页目录
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
        dir = (dir || this.directory.value);
        console.log(dir);
        if (!dir || dir.length == 0) return
        startDir = (startDir || this.firstDir)
        const { currIndex, leaveSecond, enterSecond } = startDir;
        if (!e.target.scrollTop) {
            dir[currIndex].dirActive = false;
        }
        if (e.target.scrollTop > dir[currIndex].offsetTop - 100) {
            dir[0].dirActive = !currIndex;
            // 滚动到下一个目录
            if ((currIndex < dir.length - 1) && (e.target.scrollTop > dir[currIndex + 1].offsetTop - 100)) {
                // leaveSecond && leaveSecond(dir, currIndex, this.setHash); // 离开二级目录
                startDir.currIndex++;
                dir[currIndex + 1].dirActive = true;
                dir[currIndex].dirActive = false;

            }
        } else {
            if (currIndex) {
                dir[currIndex - 1].dirActive = true;
                dir[currIndex].dirActive = false;
                startDir.currIndex--;
                // enterSecond && enterSecond(dir, startDir.currIndex, this.setHash);
            } else {
                dir[currIndex].dirActive = false;
            }
        }
        // 开始滚动二级目录
        // this.scrollDir(e,);
    };
};

export const useDirectory = () => {

    return SetDirectory;
}