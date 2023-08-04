import { reactive, ref } from "vue";
import "./css/index.less";
const Home = {
  setup(props, { attrs, emit, slots }) {
    return () => (
      <div>
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
                  <li><a href="">HTTP基本原理</a></li>
                  <li><a href="">HTTP数据传输原理</a></li>
                </ul>
              </div>
              <div class="api-group">
                <h3>浏览器</h3>
                <ul>
                  <li><a href="">浏览器工作原理</a></li>
                  <li><a href="">js引擎原理</a></li>
                </ul>
              </div>
            </div>
            <h2 id="全局-api">代码检测与转译篇</h2>
            <div class="api-groups">
              <div class="api-group">
                <h3>代码编译</h3>
                <ul>
                  <li><a href="">babel工作原理</a></li>
                </ul>
              </div>
              <div class="api-group">
                <h3>lint</h3>
                <ul>
                  <li><a href="">词法、语法分析</a></li>
                  <li><a href="">AST</a></li>
                </ul>
              </div>
            </div>

            <h2 id="全局-api">构建工具篇</h2>
            <div class="api-groups">
              <div class="api-group">
                <h3>webpakck</h3>
                <ul>
                  <li><a href="">webpack打包原理</a></li>
                  <li><a href="">loader</a></li>
                  <li><a href="">plugin</a></li>
                  <li><a href="">热模块替换</a></li>
                </ul>
              </div>
              <div class="api-group">
                <h3>vuecli</h3>
                <ul>
                  <li><a href="">vuecli配置</a></li>
                </ul>
              </div>
            </div>

            <h2 id="全局-api">模块化篇</h2>
            <div class="api-groups">
              <div class="api-group">
                <h3>应用实例</h3>
                <ul>
                  <li><a href="">require.js原理</a></li>
                </ul>
              </div>
            </div>

            <h2 id="全局-api">框架篇</h2>
            <div class="api-groups">
              <div class="api-group">
                <h3>Vue</h3>
                <ul>
                  <li><a href="">vue渲染原理</a></li>
                  <li><a href="">vue模板编译原理</a></li>
                  <li><a href="">虚拟DOM原理</a></li>
                </ul>
              </div>
            </div>
          </section>
        </main>
      </div>
    );
  },
};

export default Home;
