import { reactive, ref } from 'vue';
import './css/index.less';
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
                <h3>应用实例</h3>
              </div>
            </div>
            <h2 id="全局-api">代码检测与编译篇</h2>
            <div class="api-groups">
              <div class="api-group">
                <h3>应用实例</h3>
              </div>
            </div>

            <h2 id="全局-api">构建工具篇</h2>
            <div class="api-groups">
              <div class="api-group">
                <h3>应用实例</h3>
              </div>
            </div>

            <h2 id="全局-api">模块化篇</h2>
            <div class="api-groups">
              <div class="api-group">
                <h3>应用实例</h3>
              </div>
            </div>

            <h2 id="全局-api">网络篇</h2>
            <div class="api-groups">
              <div class="api-group">
                <h3>应用实例</h3>
              </div>
            </div>

            <h2 id="全局-api">框架篇</h2>
            <div class="api-groups">
              <div class="api-group">
                <h3>应用实例</h3>
              </div>
            </div>
          </section>
        </main>
      </div>
    );
  },
};

export default Home;
