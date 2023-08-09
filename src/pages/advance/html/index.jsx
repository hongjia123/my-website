import Split from "@components/ml-split";
import { reactive, ref, h, onMounted, defineAsyncComponent, watch } from "vue";
import { useRoute } from "vue-router";
import './css/index.less';
const Index = ref(0);
const Left = (props) => {
    console.log(props.leftContent);
    const clickItem = (list) => {
        Index.value = list.id - 1;
    }

    return (
        <div>
            <br />
            {props.leftContent.map((list, index) => {
                return (
                    <div>
                        <ul
                            class={"left_nav"}
                            style={{ textAlign: 'center', marginBottom: '15px', marginLeft: '120px' }}
                            onClick={() => clickItem(list)}
                        >
                            <div>
                                <strong>{list.name}</strong>
                            </div>
                            {
                                list.children.map((child, i) => {
                                    console.log(child);
                                    return (
                                        <div>
                                            <li style={{ fontSize: '14px' }} class={{ 'isActive': child.isActive }}>
                                                <span>
                                                    <i>{child.name}</i>
                                                </span>
                                            </li>
                                        </div>

                                    )
                                })
                            }
                        </ul>
                    </div>
                );
            })}
        </div>
    );
};
const SplitContainer = {
    props: ["leftContent", "rightContent", "Index"],
    setup(props) {
        const list = [
            {
                name: '网络篇',
                value: 'web',
                children: [
                    {
                        name: '数据请求和传输',
                        content: ['http', 'websocket'],
                    },
                    {
                        name: '浏览器',
                        content: ['browser', 'js']
                    }
                ]
            },
            {
                name: '代码检测与转译篇',
                value: 'tranform',
                children: [
                    {
                        name: '代码编译',
                        content: ['babel'],
                    },
                    {
                        name: '代码检测',
                        content: ['synax', 'AST']
                    }
                ]
            },
            {
                name: '构建工具篇',
                value: 'build',
                children: [
                    {
                        name: 'webpack',
                        content: ['package', 'loader', 'plugin', 'hot']
                    },
                    {
                        name: 'vuecli',
                        content: ['vuecli']
                    }
                ]
            },
            {
                name: '模块化篇',
                value: 'module',
                children: [
                    {
                        name: 'require.js',
                        content: ['require']
                    }
                ]
            },
            {
                name: '框架篇',
                value: 'frame',
                children: [
                    {
                        name: 'vue',
                        content: ['vue', 'template', 'vdom']
                    }
                ]
            }
        ]
        const route = useRoute();
        const pathname = route.path.match(/\/advance\/(\w+)\.html/);
        const hash = route.hash.replace('#', '');
        const component = defineAsyncComponent(() => import(`./${pathname[1]}.jsx`));
        list.find(item => item.value === pathname[1]).children
            .map(list => {
                if (list.content.includes(hash)) {
                    list.isActive = true
                }
            });
        onMounted(() => {
            document.querySelector('.left-title-nav').style.width = '658px';
        });
        return () => (
            <Split
                v-slots={{
                    Left,
                    Content: () => <component />
                }}
                rightContent={{}}
                leftContent={list}
            />
        );
    },
};
export default SplitContainer;
