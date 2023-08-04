import { reactive, ref } from "vue";
const Home = {
  setup(props, { attrs, emit, slots }) {
    return () => (
      <>
        <router-view></router-view>
      </>
    );
  },
};

export default Home;
