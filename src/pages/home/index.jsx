import gifIcon from "./img/javascript.gif";
import "./css/index.less";
const Home = {
  setup(props, { attrs, emit, slots }) {
    return () => (
      <div className="home-container">
        <main class="home">
          <header class="header">
            <img class="gifIcon" src={gifIcon} alt="" />
            <h1 id="main-title">麦林前端进阶</h1>
            <p class="description">高级前端进阶之路</p>
            <p class="action">
              <a href="#/summary/hp" class="nav-link action-button">
                Get Started →
              </a>
            </p>
          </header>
        </main>
      </div>
    );
  },
};

export default Home;
