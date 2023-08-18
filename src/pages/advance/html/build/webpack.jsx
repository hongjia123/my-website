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
                    <p>
                        <span>打包开始前的准备工作</span>
                        <span>打包过程中(编译阶段)</span>
                        <span>打包结束后(成功和失败)</span>
                    </p>
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
                        {/* <li>(9) 把各个代码块<code>chunk</code>转换成一个一个文件加入到输出列表</li> */}
                        {/* <li>(10) 确定好输出内容之后，根据配置的输出路径和文件名，将文件内容写入到文件系统</li> */}
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

                                "\n\n//第四步：执行`compiler` 对象的`run方法开始执行编译`",
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
                    <br />
                    <p>
                        编译这个阶段需要单独解耦出来，通过<span><code>Compilation</code></span>来完成，定义<span><code>Compilation</code></span>大致结构：
                    </p>
                    <br />
                    <p>
                        <pre><code>
                            {[
                                "class Compiler{",
                                "\n  //省略其他",
                                "\n run(callback){",
                                "\n //省略",
                                "\n }",
                                "\n compile(callback){",
                                "\n   let compilation = new Compilation(this.options);",
                                "\n   compilation.build(callback); //执行compilation的build方法进行编译，编译成功之后执行回调",
                                "\n }",
                                "\n}",
                                "\n\n",
                                "class Compilation{",
                                "\n constructor(webpackOptions){",
                                "\n   this.options = webpackOptions;",
                                "\n   this.modules = []; //本次编译所有生成出来的模块",
                                "\n   this.chunks = []; //本次编译产出的所有的代码块，入口模块和依赖的模块打包一起为代码块",
                                "\n   this.assets = []; //本次编译产出的资源文件",
                                "\n   this.fileDependencies = []; // 本次打包涉及的文件，这里主要是为了实现watch模式下监听文件的变化，文件变化后会重新编译",
                                "\n }",
                                "\n\n",
                                "\n build(callback){",
                                "\n  // 这里开始做编译工作，编译成功之后执行callback",
                                "\n  callback()",
                                "\n }",
                                "\n}",
                            ]}
                        </code></pre>
                    </p>
                    <br />
                    <h4>
                        (5) 根据配置文件中的<code>entry</code>配置项找到所有的入口
                    </h4>
                    <br />
                    <p>
                        现在我们开始进行编译
                    </p>
                    <br />
                    <p>
                        编译开始前，我需要先知道入口文件，而<span><code>入口的配置方式</code></span>有多种，可以是字符串，也可以是对象，这一步是统一配置信息的格式，找出
                        所有入口(考虑多入口打包的场景)
                    </p>
                    <br />

                    <br />
                    <p><pre><code>

                        {[
                            "class Compilation{",
                            "\n constructor(webpackOptions){",
                            "\n   this.options = webpackOptions;",
                            "\n   this.modules = []; //本次编译所有生成出来的模块",
                            "\n   this.chunks = []; //本次编译产出的所有的代码块，入口模块和依赖的模块打包一起为代码块",
                            "\n   this.assets = []; //本次编译产出的资源文件",
                            "\n   this.fileDependencies = []; // 本次打包涉及的文件，这里主要是为了实现watch模式下监听文件的变化，文件变化后会重新编译",
                            "\n }",
                            "\n\n",
                            "\n build(callback){",
                            "\n  // 第五步：根据配置文件中的`entry`配置找到所有的入口",
                            "\n  let entry = {};",
                            "\n  if(typeof this.options.entry === 'string'){",
                            "\n    entry.main = this.options.entry; //如果是单入口，将entry:'xx'变成{main:'xx'},这里需要做兼容",
                            "\n  }else {",
                            "\n   entry = this.options.entry;",
                            "\n  }",
                            "\n\n  //编译成功执行callback",
                            "\n  callback()",
                            "\n }",
                            "\n}",
                        ]}
                    </code></pre>

                    </p>
                    <br />
                    <h4>
                        (6) 从入口文件出发，调用配置的<code>loader</code>规则，对各模块进行编译
                    </h4>
                    <br />
                    <p>
                        loader 本质上就是函数，接收资源文件或者上一个loader产生的结果作为入参，最终输出转换后的结果
                    </p>
                    <br />
                    <p>
                        写两个自定义loader配置到webpack.config.js中：
                    </p>
                    <br />
                    <p>
                        <pre><code>
                            {[
                                "const loader1 = () = > {",
                                "\n return source + '// 给你的代码加点注释：loader1';",
                                "\n};",
                                "\n\n",
                                "const loader2 = () = > {",
                                "\n return source + '// 给你的代码加点注释：loader2';",
                                "\n};",
                                "\n\n//webpack.config.js:",
                                "const {loader1,loader2} = require('./webpack');",
                                "\nmodule.exports = {",
                                "\n modules:{",
                                "\n  rules:[",
                                "\n   {",
                                "\n    test:/\.js$/",
                                "\n    use:[loader1,loader2]",
                                "\n   }",
                                "\n  ]",
                                "\n}"
                            ]}
                        </code></pre>
                    </p>
                    <br />
                    <p>
                        这一步骤将从入口文件出发，然后查找出对应的 Loader 对源代码进行翻译和替换。主要有三点
                    </p>
                    <br />
                    <p>

                        <label>1.入口文件的绝对路径添加到依赖数组中；</label>
                        <label>2.得到入口模块的<span><code>module</code></span>对象；(读取模块内容，创建模块对象，对源代码进行翻译转换)</label>
                        <label>3.将生成的入口文件<span><code>module</code></span>对象push进行this.modules中；</label>
                    </p>
                    <br />
                    <p>
                        <pre><code>
                            {[
                                "const baseDir = process.cwd().replace(/\/g,'/');",
                                "\n\n",
                                "class Compilation{",
                                "\n constructor(webpackOptions){",
                                "\n   this.options = webpackOptions;",
                                "\n   this.modules = []; //本次编译所有生成出来的模块",
                                "\n   this.chunks = []; //本次编译产出的所有的代码块，入口模块和依赖的模块打包一起为代码块",
                                "\n   this.assets = []; //本次编译产出的资源文件",
                                "\n   this.fileDependencies = []; // 本次打包涉及的文件，这里主要是为了实现watch模式下监听文件的变化，文件变化后会重新编译",
                                "\n }",
                                "\n\n",
                                "\n buildModule(){",
                                "\n   // 读取模块内容。获取源代码",
                                "\n   let sourceCode = fs.readFileSync(modulePath,'utf8');",
                                "\n   // buildModule最终会返回一个modules对象，每个模块都会有一个id，id是相对于根目录的相对路径",
                                "\n   let moduleId = './' + path.posix.relative(baseDir,modulePath); //模块id：从根目录出发，找到与该模块的相对路径(./src/index.js)",
                                "\n   // 创建模块对象",
                                "\n   let module = {",
                                "\n     id: moduleId,",
                                "\n     names: [name], //names设计成数组是因为代表的是此模块属于哪个代码块，可能属于多个代码块",
                                "\n     dependencies: [], //它依赖的模块",
                                "\n     _source: '', //该模块的代码信息",
                                "\n   };",
                                "\n   // 找到对应的`loader`对源代码进行翻译和转换",
                                "\n   let loaders = []",
                                "\n   let { rules = []} = this.options.module;",
                                "\n   rules.forEach(rule=>{",
                                "\n     let { test } = rule;",
                                "\n     // 如果模块的路径和正则匹配，就把此规则对应的loader添加到loader数组中",
                                "\n     if(modulePath.match(test)){",
                                "\n       loaders.push(...rule.use)",
                                "\n     }",
                                "\n   });",
                                "\n\n//自右向做左对模块进行转移",
                                "\n sourceCode = loaders.reduceRight((code , loader) =>{",
                                "\n   return loader(code);",
                                "\n}, sourceCode);",
                                "\n\n   return module;",
                                "\n }",
                                "\n\n build(callback){",
                                "\n  // 第五步：根据配置文件中的`entry`配置找到所有的入口",
                                "\n  let entry = {};",
                                "\n  if(typeof this.options.entry === 'string'){",
                                "\n  entry.main = this.options.entry; //如果是单入口，将entry:'xx'变成{main:'xx'},这里需要做兼容",
                                "\n  }else {",
                                "\n  entry = this.options.entry;",
                                "\n  }",
                                "\n  //第六步：从入口文件出发，调用配置的`loader`规则，对各模块进行编译",
                                "\n  for(let entryName in entry){",
                                "\n  let entryFilePath = path.posix.join(baseDir,entry[entryName]); ",
                                "\n  //1. 把入口文件的绝对路径添加到以来数组中，记录此次编译依赖的模块 ",
                                "\n  this.fileDependencies.push(entryFilePath);",
                                "\n  //2. 得到入口模块的`module` 对象",
                                "\n  let entryModule = this.buildModule(entryName,entryFilePath) ",
                                "\n  //3. 将生成的入口文件`module` 对象 push 进 `this.modules`中 ",
                                "\n  this.modules.push(entryModule);",
                                "\n  }",
                                "\n\n  //编译成功执行callback",
                                "\n  callback()",
                                "\n }",
                                "\n}",
                            ]}
                        </code></pre>
                    </p>
                    <h4>
                        (7) 找出此模块所依赖的模块，再对依赖模块进行编译
                    </h4>
                    <br />
                    <p>
                        该步骤经过细化可以将其拆分成十个小步骤：

                        <span>（7.1）：先把源代码编译成 AST</span>
                        <span>（7.2）：在 AST 中查找 require 语句，找出依赖的模块名称和绝对路径</span>
                        <span>（7.3）：将依赖模块的绝对路径 push 到 this.fileDependencies 中</span>
                        <span>（7.4）：生成依赖模块的模块 id</span>
                        <span>（7.5）：修改语法结构，把依赖的模块改为依赖模块 id</span>
                        <span>（7.6）：将依赖模块的信息 push 到该模块的 dependencies 属性中</span>
                        <span>（7.7）：生成新代码，并把转译后的源代码放到 module._source 属性上</span>
                        <span>（7.8）：对依赖模块进行编译（对 module 对象中的 dependencies 进行递归执行 buildModule ）</span>
                        <span>（7.9）：对依赖模块编译完成后得到依赖模块的 module 对象，push 到 this.modules 中</span>
                        <span>（7.10）：等依赖模块全部编译完成后，返回入口模块的 module 对象</span>
                    </p>
                    <br />
                    <p>
                        <pre><code>
                            {[

                                "const parser = require('@babel/parser');",
                                "\n let types = require('@babel/types'); //用来生成或者判断节点的AST语法树的节点",
                                "\n const traverse = require('@babel/traverse').default;",
                                "\n const generator = require('@babel/generator').default;",
                                "\n",
                                "\n//获取文件路径",
                                "\n function tryExtensions(modulePath, extensions) {",
                                "\n   if (fs.existsSync(modulePath)) {",
                                "\n     return modulePath;",
                                "\n   }",
                                "\n   for (let i = 0; i < extensions?.length; i++) {",
                                "\n     let filePath = modulePath + extensions[i];",
                                "\n     if (fs.existsSync(filePath)) {",
                                "\n       return filePath;",
                                "\n     }",
                                "\n   }",
                                "\n   throw new Error(`无法找到${modulePath}`);",
                                "\n }",
                                "\n\nconst baseDir = process.cwd().replace(/\/g,'/');",
                                "\n\n",
                                "class Compilation{",
                                "\n constructor(webpackOptions){",
                                "\n   this.options = webpackOptions;",
                                "\n   this.modules = []; //本次编译所有生成出来的模块",
                                "\n   this.chunks = []; //本次编译产出的所有的代码块，入口模块和依赖的模块打包一起为代码块",
                                "\n   this.assets = []; //本次编译产出的资源文件",
                                "\n   this.fileDependencies = []; // 本次打包涉及的文件，这里主要是为了实现watch模式下监听文件的变化，文件变化后会重新编译",
                                "\n }",
                                "\n\n",
                                "\n buildModule(){",
                                "\n  //省略其他",
                                "\n\n//自右向做左对模块进行转移",
                                "\n  sourceCode = loaders.reduceRight((code , loader) =>{",
                                "\n   return loader(code);",
                                "\n  }, sourceCode);",
                                "\n\n//通过loader翻译后的内容一定得是js内容，因为最后得走我们babel-parse，只有js才能成编译AST",
                                "\n  //第七步：找出此模块所依赖的模块，再对依赖模块进行编译",
                                "\n  //7.1:先把源代码编译成 [AST](https://astexplorer.net/)",
                                "\n   let ast = parser.parse(sourceCode, { sourceType: 'module' });",
                                "\n    traverse(ast, {",
                                "\n    CallExpression: (nodePath) => {",
                                "\n    const { node } = nodePath;",
                                "\n    //7.2在 `AST` 中查找 `require` 语句，找出依赖的模块名称和绝对路径",
                                "\n    if (node.callee.name === 'require') {",
                                "\n      let depModuleName = node.arguments[0].value; //获取依赖的模块",
                                "\n      let dirname = path.posix.dirname(modulePath); //获取当前正在编译的模所在的目录",
                                "\n      let depModulePath = path.posix.join(dirname, depModuleName); //获取依赖模块的绝对路径",
                                "\n      let extensions = this.options.resolve?.extensions || [ '.js' ]; //获取配置中的extensions",
                                "\n      depModulePath = tryExtensions(depModulePath, extensions); //尝试添加后缀，找到一个真实在硬盘上存在的文件",
                                "\n      //7.3:将依赖模块的绝对路径 push 到 `this.fileDependencies` 中",
                                "\n      this.fileDependencies.push(depModulePath);",
                                "\n      //7.4:生成依赖模块的`模块 id`",
                                "\n      let depModuleId = './' + path.posix.relative(baseDir, depModulePath);",
                                "\n      //7.5:修改语法结构，把依赖的模块改为依赖`模块 id` require('./name')=>require('./src/name.js')",
                                "\n      node.arguments = [types.stringLiteral(depModuleId)];",
                                "\n      //7.6:将依赖模块的信息 push 到该模块的 `dependencies` 属性中",
                                "\n      module.dependencies.push({ depModuleId, depModulePath });",
                                "\n    }",
                                "\n    });",
                                "\n\n//7.7：生成新代码，并把转译后的源代码放到 `module._source` 属性上",
                                "\n   let { code } = generator(ast);",
                                "\n   module._source = code;",
                                "\n   //7.8：对依赖模块进行编译（对 `module 对象`中的 `dependencies` 进行递归执行 `buildModule` ）",
                                "\n   module.dependencies.forEach(({ depModuleId, depModulePath }) => {",
                                "\n   //考虑到多入口打包 ：一个模块被多个其他模块引用，不需要重复打包",
                                "\n   let existModule = this.modules.find((item) => item.id === depModuleId);",
                                "\n   //如果modules里已经存在这个将要编译的依赖模块了，那么就不需要编译了，直接把此代码块的名称添加到对应模块的names字段里就可以",
                                "\n   if (existModule) {",
                                "\n     //names指的是它属于哪个代码块chunk",
                                "\n     existModule.names.push(name);",
                                "\n   } else {",
                                "\n     //7.9：对依赖模块编译完成后得到依赖模块的 `module 对象`，push 到 `this.modules` 中",
                                "\n     let depModule = this.buildModule(name, depModulePath);",
                                "\n     this.modules.push(depModule);",
                                "\n   }",
                                "\n   });",
                                "\n   //7.10：等依赖模块全部编译完成后，返回入口模块的 `module` 对象",
                                "\n   return module;",
                                "\n }",
                                "\n\n build(callback){",
                                "\n  // 第五步：根据配置文件中的`entry`配置找到所有的入口",
                                "\n  let entry = {};",
                                "\n  if(typeof this.options.entry === 'string'){",
                                "\n  entry.main = this.options.entry; //如果是单入口，将entry:'xx'变成{main:'xx'},这里需要做兼容",
                                "\n  }else {",
                                "\n  entry = this.options.entry;",
                                "\n  }",
                                "\n  //第六步：从入口文件出发，调用配置的`loader`规则，对各模块进行编译",
                                "\n  for(let entryName in entry){",
                                "\n    let entryFilePath = path.posix.join(baseDir,entry[entryName]); ",
                                "\n    //1. 把入口文件的绝对路径添加到以来数组中，记录此次编译依赖的模块 ",
                                "\n    this.fileDependencies.push(entryFilePath);",
                                "\n    //2. 得到入口模块的`module` 对象",
                                "\n    let entryModule = this.buildModule(entryName,entryFilePath) ",
                                "\n    //3. 将生成的入口文件`module` 对象 push 进 `this.modules`中 ",
                                "\n    this.modules.push(entryModule);",
                                "\n  }",
                                "\n\n  //编译成功执行callback",
                                "\n  callback()",
                                "\n }",
                                "\n}",
                            ]}
                        </code></pre>
                    </p>
                    <h4>
                        (8) 等所有模块都编译完成后，根据模块之间的依赖关系，组装代码块<code>chunk</code>
                    </h4>
                    <br />
                    <p>
                        一般来说，每个入口文件会对应一个代码块chunk，每个代码块chunk里面会放着本入口模块和它依赖的模块，这里暂时不考虑代码分割
                    </p>
                    <br />

                    <br />
                    <p><pre><code>

                        {[
                            "class Compilation{",
                            "\n constructor(webpackOptions){",
                            "\n   this.options = webpackOptions;",
                            "\n   this.modules = []; //本次编译所有生成出来的模块",
                            "\n   this.chunks = []; //本次编译产出的所有的代码块，入口模块和依赖的模块打包一起为代码块",
                            "\n   this.assets = []; //本次编译产出的资源文件",
                            "\n   this.fileDependencies = []; // 本次打包涉及的文件，这里主要是为了实现watch模式下监听文件的变化，文件变化后会重新编译",
                            "\n }",
                            "\n\n",
                            "\n build(callback){",
                            "\n  // 第五步：根据配置文件中的`entry`配置找到所有的入口",
                            "\n  let entry = {};",
                            "\n  if(typeof this.options.entry === 'string'){",
                            "\n    entry.main = this.options.entry; //如果是单入口，将entry:'xx'变成{main:'xx'},这里需要做兼容",
                            "\n  }else {",
                            "\n   entry = this.options.entry;",
                            "\n  }",
                            "\n  //第六步：从入口文件出发，调用配置的`loader`规则，对各模块进行编译",
                            "\n  for(let entryName in entry){",
                            "\n    let entryFilePath = path.posix.join(baseDir,entry[entryName]); ",
                            "\n    //1. 把入口文件的绝对路径添加到以来数组中，记录此次编译依赖的模块 ",
                            "\n    this.fileDependencies.push(entryFilePath);",
                            "\n    //2. 得到入口模块的`module` 对象",
                            "\n    let entryModule = this.buildModule(entryName,entryFilePath) ",
                            "\n    //3. 将生成的入口文件`module` 对象 push 进 `this.modules`中 ",
                            "\n    this.modules.push(entryModule);",
                            "\n    //第八步：等所有模块都编译完成后，根据模块之间的依赖关系，组装代码块 `chunk`（一般来说，每个入口文件会对应一个代码块`chunk`，每个代码块`chunk`里面会放着本入口",
                            "模块  和它依赖的模块",
                            "\n    let chunk = {",
                            "\n     name: entryName, //entryName='main' 代码块的名称",
                            "\n     entryModule, //此代码块对应的module的对象,这里就是src/index.js 的module对象",
                            "\n     modules: this.modules.filter((item) => item.names.includes(entryName)), //找出属于该代码块的模块",
                            "\n    }",
                            "\n    this.chunks.push(chunk);",
                            "\n  }",
                            "\n\n  //编译成功执行callback",
                            "\n  callback()",
                            "\n }",
                            "\n}",
                        ]}
                    </code></pre>

                    </p>
                    <br />
                    <h4>
                        (9) 把各个代码块<code>chunk</code>转换成一个一个文件加入到输出列表
                    </h4>
                    <br />
                    <p>
                        这一步需要结合配置文件中的output.filename去生成输出文件的文件名称，同时还需要生成运行时代码:
                    </p>
                    <br />

                    <br />
                    <p><pre><code>

                        {[
                            "class Compilation{",
                            "\n constructor(webpackOptions){",
                            "\n   this.options = webpackOptions;",
                            "\n   this.modules = []; //本次编译所有生成出来的模块",
                            "\n   this.chunks = []; //本次编译产出的所有的代码块，入口模块和依赖的模块打包一起为代码块",
                            "\n   this.assets = []; //本次编译产出的资源文件",
                            "\n   this.fileDependencies = []; // 本次打包涉及的文件，这里主要是为了实现watch模式下监听文件的变化，文件变化后会重新编译",
                            "\n }",
                            "\n\n",
                            "\n build(callback){",
                            "\n  // 第五步：根据配置文件中的`entry`配置找到所有的入口",
                            "\n  let entry = {};",
                            "\n  if(typeof this.options.entry === 'string'){",
                            "\n    entry.main = this.options.entry; //如果是单入口，将entry:'xx'变成{main:'xx'},这里需要做兼容",
                            "\n  }else {",
                            "\n   entry = this.options.entry;",
                            "\n  }",
                            "\n  //第六步：从入口文件出发，调用配置的`loader`规则，对各模块进行编译",
                            "\n  for(let entryName in entry){",
                            "\n    let entryFilePath = path.posix.join(baseDir,entry[entryName]); ",
                            "\n    //1. 把入口文件的绝对路径添加到以来数组中，记录此次编译依赖的模块 ",
                            "\n    this.fileDependencies.push(entryFilePath);",
                            "\n    //2. 得到入口模块的`module` 对象",
                            "\n    let entryModule = this.buildModule(entryName,entryFilePath) ",
                            "\n    //3. 将生成的入口文件`module` 对象 push 进 `this.modules`中 ",
                            "\n    this.modules.push(entryModule);",
                            "\n    //第八步：等所有模块都编译完成后，根据模块之间的依赖关系，组装代码块 `chunk`（一般来说，每个入口文件会对应一个代码块`chunk`，每个代码块`chunk`里面会放着本入口",
                            "模块  和它依赖的模块",
                            "\n    let chunk = {",
                            "\n     name: entryName, //entryName='main' 代码块的名称",
                            "\n     entryModule, //此代码块对应的module的对象,这里就是src/index.js 的module对象",
                            "\n     modules: this.modules.filter((item) => item.names.includes(entryName)), //找出属于该代码块的模块",
                            "\n    }",
                            "\n    this.chunks.push(chunk);",
                            "\n  }",
                            "\n\n  //编译成功执行callback",
                            "\n  callback()",
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