import { reactive, ref, watch, onMounted } from "vue";
import { useRoute } from "vue-router";
import "./css/index.less";
const ParentNavpage = {
  setup() {
    return () => (
      <main className="main">
        <header className="advance_header">
          <span class="advance_title">进阶原理</span>
          <div class="api-filter">
            <label for="api-filter">过滤</label>
            <input
              type="search"
              placeholder="Enter keyword"
              id="api-filter"
            />
          </div>
        </header>
        <section className="section">
          <h2 id="全局-api">网络篇</h2>
          <div class="api-groups">
            <div class="api-group">
              <h3>数据请求与传输</h3>
              <ul>
                <li><a href="#/summary/hp?id=2">HTTP数据传输原理</a></li>
                <li><a href="#/advance/request.html#websocket">WebSocket</a></li>
              </ul>
            </div>
            <div class="api-group">
              <h3>浏览器</h3>
              <ul>
                <li><a href="#/advance/browser.html#browser">浏览器工作原理</a></li>
                <li><a href="#/advance/browser.html#js">js引擎原理</a></li>
              </ul>
            </div>
          </div>
          <h2 id="全局-api">代码检测与转译篇</h2>
          <div class="api-groups">
            <div class="api-group">
              <h3>代码编译</h3>
              <ul>
                <li><a href="#/advance/transform.html#babel">babel工作原理</a></li>
              </ul>
            </div>
            <div class="api-group">
              <h3>代码检测</h3>
              <ul>
                <li><a href="#/advance/lint.html#synax">词法、语法分析</a></li>
                <li><a href="#/advance/lint.html#AST">AST</a></li>
              </ul>
            </div>
          </div>

          <h2 id="全局-api">构建工具篇</h2>
          <div class="api-groups">
            <div class="api-group">
              <h3>webpakck</h3>
              <ul>
                <li><a href="#/advance/webpack.html#package">webpack打包原理</a></li>
                <li><a href="#/advance/webpack.html#loader">loader</a></li>
                <li><a href="#/advance/webpack.html#plugin">plugin</a></li>
                <li><a href="#/advance/webpack.html#hot">热模块替换</a></li>
              </ul>
            </div>
            <div class="api-group">
              <h3>vuecli</h3>
              <ul>
                <li><a href="#/advance/vuecli.html#vuecli">vuecli配置</a></li>
              </ul>
            </div>
          </div>

          <h2 id="全局-api">模块化篇</h2>
          <div class="api-groups">
            <div class="api-group">
              <h3>模块原理</h3>
              <ul>
                <li><a href="#/advance/requirejs.html#require">require.js原理</a></li>
              </ul>
            </div>
          </div>

          <h2 id="全局-api">框架篇</h2>
          <div class="api-groups">
            <div class="api-group">
              <h3>Vue</h3>
              <ul>
                <li><a href="#/advance/vue.html#vue">vue渲染原理</a></li>
                <li><a href="#/advance/vue.html#template">vue模板编译原理</a></li>
                <li><a href="#/advance/vue.html#vdom">虚拟DOM原理</a></li>
              </ul>
            </div>
          </div>
        </section>
      </main>
    )
  }
}
const ChildPage = {
  setup() {
    return () => (
      <router-view></router-view>
    )
  }
}
const Advance = {
  setup(props, { attrs, emit, slots }) {
    const route = useRoute();
    const isChildRouter = ref(false);
    const routerCallback = (newPath) => {
      const path = newPath||route.path;
      const matchPath = path.match(/(\/).*?(\/)\w+/); // 当前路由是否是子路由
      isChildRouter.value = matchPath ? true : false
    }
    watch(() => route.path, routerCallback);
    onMounted(routerCallback)
    return () => (
      <div>
        {isChildRouter.value ? <ChildPage /> : <ParentNavpage />}
      </div>
    );
  },
};

export default Advance;
