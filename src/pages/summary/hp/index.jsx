import SplitContainer from '../common/split-container';
import './css/index.less';
import { onMounted, defineAsyncComponent } from 'vue';

const Hp = {
  setup() {
    onMounted(() => {});
    const leftlist = [
      {
        id: 1,
        name: '1. 前端网络基础知识',
      },
      {
        id: 2,
        name: '2. http协议',
      },
      {
        id: 3,
        name: '3. http请求--Ajax',
      },
      {
        id: 4,
        name: '4. 浏览器缓存与http缓存',
      },
      {
        id: 5,
        name: '5. http跨域与鉴权',
      },
    ];
    const component = {
      1: defineAsyncComponent(() => import('./html1.jsx')),
      2: defineAsyncComponent(() => import('./html2.jsx')),
      3: defineAsyncComponent(() => import('./html3.jsx')),
      4: defineAsyncComponent(() => import('./html4.jsx')),
      5: defineAsyncComponent(() => import('./html5.jsx')),
    };
    return () => (
      <div class="hp-container">
        <SplitContainer leftContent={leftlist} rightContent={component} />
      </div>
    );
  },
};
export default Hp;
