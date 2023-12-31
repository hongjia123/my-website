import { reactive, ref, watch, onMounted, watchEffect } from "vue";
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
            <input type="search" placeholder="Enter keyword" id="api-filter" />
          </div>
        </header>
        <section className="section">
          <h2 id="全局-api">网络篇</h2>
          <div class="api-groups">
            <div class="api-group">
              <h3>数据请求与传输</h3>
              <ul>
                <li>
                  <a href="summary/hp?id=2">HTTP数据传输原理</a>
                </li>
                <li>
                  <a href="/advance/request#websocket">WebSocket</a>
                </li>
              </ul>
            </div>
            <div class="api-group">
              <h3>浏览器</h3>
              <ul>
                <li>
                  <a href="/advance/browser#browser">浏览器工作原理</a>
                </li>
                <li>
                  <a href="/advance/browser#js">js引擎原理</a>
                </li>
              </ul>
            </div>
          </div>
          <h2 id="全局-api">代码检测与转译篇</h2>
          <div class="api-groups">
            <div class="api-group">
              <h3>代码编译</h3>
              <ul>
                <li>
                  <a href="/advance/transform#babel">babel工作原理</a>
                </li>
              </ul>
            </div>
            <div class="api-group">
              <h3>代码检测</h3>
              <ul>
                <li>
                  <a href="/advance/lint#synax">词法、语法分析</a>
                </li>
                <li>
                  <a href="/advance#AST">AST</a>
                </li>
              </ul>
            </div>
          </div>

          <h2 id="全局-api">构建工具篇</h2>
          <div class="api-groups">
            <div class="api-group">
              <h3>webpakck打包原理</h3>
              <ul>
                <li>
                  <a href="/advance/webpack#process">打包流程</a>
                </li>
                <li>
                  <a href="/advance/webpack#stream">webpack事件流</a>
                </li>
                <li>
                  <a href="/advance/webpack#realization">具体实现</a>
                </li>
              </ul>
            </div>
            <div class="api-group">
              <h3>加载器loader原理</h3>
              <ul>
                <li>
                  <a href="/advance/loader#1">打包流程</a>
                </li>
                <li>
                  <a href="/advance/loader#2">webpack事件流</a>
                </li>
                <li>
                  <a href="/advance/loader#3">具体实现</a>
                </li>
              </ul>
            </div>
            <div class="api-group">
              <h3>插件plugin原理</h3>
              <ul>
                <li>
                  <a href="/advance/plugin#4">打包流程</a>
                </li>
                <li>
                  <a href="/advance/plugin#5">webpack事件流</a>
                </li>
                <li>
                  <a href="/advance/plugin#6">具体实现</a>
                </li>
              </ul>
            </div>
            <div class="api-group">
              <h3>热模块替换原理</h3>
              <ul>
                <li>
                  <a href="/advance/hot#7">打包流程</a>
                </li>
                <li>
                  <a href="/advance/hot#8">webpack事件流</a>
                </li>
                <li>
                  <a href="/advance/hot#9">具体实现</a>
                </li>
              </ul>
            </div>
            <div class="api-group">
              <h3>vuecli</h3>
              <ul>
                <li>
                  <a href="/advance/vuecli#vuecli">vuecli配置</a>
                </li>
              </ul>
            </div>
          </div>

          <h2 id="全局-api">模块化篇</h2>
          <div class="api-groups">
            <div class="api-group">
              <h3>模块原理</h3>
              <ul>
                <li>
                  <a href="/advance/requirejs#require">require.js原理</a>
                </li>
              </ul>
            </div>
          </div>

          <h2 id="全局-api">框架篇</h2>
          <div class="api-groups">
            <div class="api-group">
              <h3>Vue</h3>
              <ul>
                <li>
                  <a href="/advance/vue#vue">vue渲染原理</a>
                </li>
                <li>
                  <a href="/advance/vue#template">vue模板编译原理</a>
                </li>
                <li>
                  <a href="/advance/vue#vdom">虚拟DOM原理</a>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>
    );
  },
};
const ChildPage = {
  setup() {
    return () => <router-view></router-view>;
  },
};
const Advance = {
  setup(props, { attrs, emit, slots }) {
    const route = useRoute();
    const isChildRouter = ref(false);
    const routerCallback = (newPath) => {
      const path = newPath || route.path;
      const matchPath = path.match(/\/.*?\/(\w+)/); // 当前路由是否是子路由
      isChildRouter.value = matchPath ? true : false;
      history.replaceState(null, null, `/advance/${matchPath[1]}.html`)
    };
    watch(() => route.path, routerCallback);
    onMounted(routerCallback);
    return () => (
      <div>{isChildRouter.value ? <ChildPage /> : <ParentNavpage />}</div>
    );
  },
};

export default Advance;
