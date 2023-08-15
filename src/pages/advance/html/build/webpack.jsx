import '../common/css/html.less';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import { onMounted } from 'vue';
import { useRoute } from "vue-router";

const Build = {
    setup() {
        hljs.registerLanguage('javascript', javascript);
        const route = useRoute();
        onMounted(() => {
            hljs.highlightAll();
            

        })
        return () => (
            <div>
                <h1>
                    webpack的打包原理
                    <a class="header-anchor" href="#webpack的打包原理" aria-label="Permalink to &quot;webpack的打包原理 {#webpack的打包原理}&quot;"></a>
                </h1>
                <div className="web-content">
                    <h3 id='process'>
                        打包流程
                    </h3>
                    <ul>
                        <li>打包开始前的准备工作</li>
                        <li>打包过程中(编译阶段)</li>
                        <li>打包结束后(成功和失败)</li>
                    </ul>
                    <br />
                    这里考虑到<code>watch mode</code>(当文件变化时，将重新进行编译),要把编译阶段单独解耦。
                    <br />
                    <br />
                    <p>
                        webpack源码中，compiler代表这上面说得三个阶段，在它上面挂载着各种生命周期函数，而compilation专门负责编译相关的工作,也就是打包过程这个阶段
                    </p>
                    <img src="" alt="" className="src" />

                    <br />
                    <h3 id="stream">实现webpack事件流</h3>
                    <p>
                        这里需要借助Tapable，它是一个类似与node.js中的EventEmitter的库，但<strong>专注于自定义事件的触发和处理</strong>
                        通过Tapable我们可以注册自定义事件，然后在适当的时机去执行自定义事件。
                    </p>
                    <br />
                    <p>
                        我们可以通过tapable先注册一系列的生命周期函数，然后在合适的时间点执行。
                    </p>
                    <br />
                    比如：
                    <p>
                        <pre>
                            <code class="language-javascript" >
                                {
                                    [
                                        "const {'SyncHook'} = require('tapable'), //这是一个同步钩子",
                                        "\n//第一步：实例化钩子函数，可以在这里定义形参",
                                        "\nconst syncHook = new SyncHook(['author', 'age'])",
                                        "\n//第二步：注册事件1",
                                        "\nsyncHook.tap('监听器1', (name, age)=>{\n console.log('监听器1:', 'name', 'age')\n});",
                                        "\n//第三步：注册事件2",
                                        "\nsyncHook.tap('监听器2', (name) =>;{\n console.log('监听器2', name)\n});",
                                        "\n//第四步：注册事件3",
                                        "\nsyncHook.tap('监听器3', (name) =>;{\n console.log('监听器3', name)\n});",
                                        "\n//第五步：触发事件，这里传的是实参，会被每一个注册函数接收到",
                                        "\nsyncHook.call('麦林', '100')"

                                    ]
                                }

                            </code>
                        </pre>
                    </p>
                    <br />
                    在webpack中，就是通过tapable在compiler和compilation上像这样挂载着一系列<code>生命周期Hook</code>，它就像是一座桥梁，宽川着整个构建过程:
                    <p>
                        <pre>
                            <code>
                                {
                                    [
                                        "class Compiler {",
                                        "\n  constructor() {",
                                        "\n    //它内部提供了很多钩子",
                                        "\n    this.hooks = {",
                                        "\n      run: new SyncHook(), //会在编译刚开始的时候触发此钩子",
                                        "\n      done: new SyncHook(), //会在编译结束的时候触发此钩子",
                                        "\n    };",
                                        "\n  };",
                                        "\n}"
                                    ]
                                }
                            </code>
                        </pre>
                    </p>
                    <br />
                    <h3 id='realization'>
                        具体实现
                    </h3>
                    <ul>
                        <li>(1) 搭建结构，读取配置参数</li>
                        <li>(2) 用配置参数对象初始化<code>Compiler</code>对象</li>
                        <li>(3) 挂载配置文件中的插件</li>
                        <li>(4) 执行<code>Compiler</code>对象的<code>run</code>方法开始执行编译</li>
                        <li>(5) 根据配置文件中<code>entry</code>配置项找到所有入口</li>
                        <li>(6) 从入口文件出发，调用配置的<code>loader</code>规则，对各模块进行编译</li>
                        <li>(7) 找出此模块所以来的模块，再对依赖模块进行编译</li>
                        <li>(8) 等所有模块都编译完成后，根据模块之间的依赖关系，组装代码块<code>chunk</code></li>
                        <li>(9) 把各个代码块<code>chunk</code>转换成一个一个文件加入到输出列表</li>
                        <li>(10) 确定好输出内容之后，根据配置的输出路径和文件名，将文件内容写入到文件系统</li>
                    </ul>
                    <br />
                    <h4>
                        (1)、搭建结构，读取配置参数
                    </h4>
                    <br />
                    <p>
                        webpack的本质是一个函数，它接受一个配置信息作为参数，执行返回一个 <span><code>compiler对象</code></span>，调用compiler对象中的run方法则启动编译。run
                        方法接受一个回调，可以用来查看编译过程中的错误信息或编译信息
                    </p>
                    <br />
                    <div><i>搭建结构:</i></div>
                    <br />
                    <p>
                        <pre><code>
                            {[
                                "class Compiler{",
                                "\n constructor(){}",
                                "\n\n run(callback){}",
                                "\n}",
                                '\n\n',
                                "//第一步：搭建结构，读取配置参数，这里接受的是webpack.config.js中的参数",
                                "\nfunction webpack(webpackOptions) {",
                                "\n  const compiler = new Compiler()",
                                "\n  return compiler;",
                                "\n}"
                            ]}
                        </code></pre>
                    </p>
                    <br />
                    <h4>
                        (2)、用配置参数对象初始化<code>Compiler</code>对象
                    </h4>
                    <br />
                    <p>
                        <pre><code>
                            {[
                                "class Compiler{",
                                "\n constructor(wewbpackOptions){",
                                "\n   this.options = webpackOptions, //存储配置信息",
                                "\n   //它内部提供了很多钩子",
                                "\n    this.hooks = {",
                                "\n      run: new SyncHook(), //会在编译刚开始的时候触发此钩子",
                                "\n      done: new SyncHook(), //会在编译结束的时候触发此钩子",
                                "\n    };",
                                "}",
                                "\n}",
                                '\n\n',
                                "//第一步：搭建结构，读取配置参数，这里接受的是webpack.config.js中的参数",
                                "\nfunction webpack(webpackOptions) {",
                                "\n  const compiler = new Compiler()",
                                "\n  return compiler;",
                                "}"
                            ]}
                        </code></pre>
                    </p>
                    <br />
                    <h4>
                        (3)、挂载配置文件中的插件
                    </h4>
                    <br />
                    <p>
                        webpack plugin 是一个带有apply方法的构造函数。apply方法接收 <span><code>compiler对象</code></span>为参数，当webpack内部进行插件挂载时会执行apply函数。我们可以在
                        apply方法中订阅各种生命周期钩子，当到达对应的时间点时就会执行。
                    </p>
                    <br />
                    <p>
                        <pre><code>
                            {[
                                "//自定义插件WebpackRunPlugin",
                                "\nclass WebpackRunPlugin{",
                                "\n apply(compiler){",
                                "\n   compiler.hooks.run.tap('WebpackRunPlugin',()=>{",
                                "\n     console.log('开始编译')",
                                "\n   });",
                                "\n}",
                                '\n\n',
                                "//自定义插件WebpackDonePlugin",
                                "\nclass WebpackRunPlugin{",
                                "\n apply(compiler){",
                                "\n   compiler.hooks.done.tap('WebpackDonePlugin',()=>{",
                                "\n     console.log('编译完成')",
                                "\n   });",
                                "\n}",
                            ]}
                        </code></pre>
                    </p>
                    <br />
                    <p>
                        webpack.config.js:
                    </p>
                    <p>
                        <pre><code>
                            {[
                                "const {WebpackRunPlugin,WebpackDonePlugin} = require('./webpack');",
                                "\nmodule.exports = {",
                                "\n plugins:[new WebpackRunPlugin(),new WebpackDonePlugin()]",
                                "\n}"
                            ]}
                        </code></pre>
                    </p>
                    <br />
                    <p>
                        执行插件的apply方法
                    </p>
                    <p>
                        <pre><code>
                            {[
                                "//第一步：搭建结构，读取配置参数，这里接受的是webpack.config.js中的参数",
                                "\nfunction webpack(webpackOptions){",
                                "\n  //第二步：用配置参数对象初始化`compiler`对象",
                                "\n  const compiler = new Compiler(webpackOptions);",
                                "\n  // 第三步：挂载配置文件中的插件",
                                "\n  const {plugins} = webpackOptions;",
                                "\n  for(let plugin of plugins){",
                                "\n    plugin.apply(compiler);",
                                "\n  }",
                                "\n  return compiler;",
                                "\n}",
                            ]}
                        </code></pre>
                    </p>
                    <br />
                    <h4>
                        (4) 执行Compiler对象的run方法开始执行编译
                    </h4>
                    <br />
                    <p>
                        在正式开始编译前，我们需要先调用Compiler中的run钩子，表示开始启动编译；编译结束后，需要调用done钩子，表示编译完成
                    </p>
                    <br />
                    <p>
                        <pre><code>
                            {[
                                "class Compiler{",
                                "\n constructor(){",
                                "\n  //省略",
                                "\n}",
                                "\n compiler(){",
                                "\n  //",
                                "\n}",

                                "\n\n 第四步：执行`compiler` 对象的`run方法开始执行编译`",
                                "\n run(callback){",
                                "\n   this.hooks.run.call(); //在编译前触发触发run钩子",
                                "\n   const onCompiled = ()=>{",
                                "\n     this.hooks.run.call(); //在编译前触发触发run钩子",
                                "\n   };",
                                "\n   this.compiler(onCompiled); //开始编译，成功之后调用onCompiled",
                                "\n }",
                                "\n}",
                            ]}
                        </code></pre>
                    </p>
                </div>
            </div>
        )
    }
};
export default Build