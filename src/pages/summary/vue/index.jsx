import SplitContainer from '../common/split-container';
import './css/index.less';
import { onMounted, defineAsyncComponent } from 'vue';

const VueFrame = {
  setup() {
    onMounted(() => {});
    const leftlist = [
      {
        id: 1,
        name: '1. vue响应式原理',
      },
      {
        id: 2,
        name: '2. vue自定义指令',
      },
      {
        id: 3,
        name: '3. vue插槽原理',
      },
      {
        id: 4,
        name: '4. vue渲染过程',
      },
      {
        id: 5,
        name: '5. vue中的jsx',
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
export default VueFrame;
