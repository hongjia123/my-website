import "./css/index.less";
import { ref, reactive, onMounted, computed, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import arrowIcon from "./img/icon_arrow.png";
import SwitchButton from "../setTheme";
const props = {
  order: String,
};
const NavBar = {
  props,
  setup(props) {
    const navlist = reactive([
      {
        name: "Home",
        path: "#/home",
      },
      {
        name: "知识总结",
        path: "#/summary",
        children: [
          {
            name: "网络专项",
            path: "hp",
          },
          {
            name: "css进阶",
            path: "css_advance",
          },
          {
            name: "js高级",
            path: "js_advance",
          },
          {
            name: "vue框架",
            path: "vue",
          },
          {
            name: "工程化",
            path: "engineering",
          },
          {
            name: "模块化",
            path: "modularity",
          },
          {
            name: "性能优化",
            path: "optimization",
          },
        ],
      },
      {
        name: "技术交流",
        path: "#/shares",
      },
      {
        name: "每日·壹题",
        path: "#/daily",
      },
      {
        name: "进阶原理",
        path: "#/advance",
      },
      {
        name: "慧思·泉涌",
        path: "#/",
      },
    ]);
    const currIndex = ref(0);
    const router = useRouter();
    const route = useRoute();
    let mySwitch = {};
    onMounted(() => {
      document
        .querySelectorAll(".nav_item")[1]
        .addEventListener("mouseover", function (e) {
          document.querySelector(".child").style.visibility = "visible";
          document.querySelector(".link-2").nextElementSibling.style.transform =
            "rotateZ(-180deg)";
        });
      document
        .querySelectorAll(".nav_item")[1]
        .addEventListener("mouseout", function (e) {
          document.querySelector(".child").style.visibility = "hidden";
          document.querySelector(".link-2").nextElementSibling.style.transform =
            "rotateZ(0deg)";
        });
      document
        .querySelector(".nav_item_link")
        .addEventListener("mouseout", function (e) {
          document.querySelector(".child").style.visibility = "hidden";
          document.querySelector(".link-2").nextElementSibling.style.transform =
            "rotateZ(0deg)";
        });
      document.documentElement.classList.add("dark", "light");
      mySwitch = new SwitchButton({
        el: ".my-switch",
      });
    });
    watch(
      () => route.path,
      (newPath) => {
        const path = newPath.match(/(?<=\/).*?(\/)\w+$/);
        if (path) {
          const parentlist = navlist.find(
            (ele) => ele.path === "#/" + path[0].split("/")[0]
          );
          const childlist = parentlist.children.find(
            (ele) => ele.path === path[0].split("/")[1]
          );
          if (childlist) {
            parentlist.name = childlist.name;
            setChildrenStyle({ childlist, parentlist, type: "child" });
          }
        } else {
          setChildrenStyle({ type: "parent" });
        }
      }
    );
    const setParentRouter = function (list, index) {
      if (!list.children) {
        currIndex.value = index;
        setChildrenStyle({ list, index, type: "parent" });
        router.push({
          path: list.path.replace("#", ""),
        });
      } else {
        currIndex.value = "";
      }
    };
    const setChildRouter = function (childlist, parentlist) {
      setChildrenStyle({ childlist, parentlist, type: "child" });
      router.push({
        path: parentlist.path.replace("#", "") + "/" + childlist.path,
      });
    };
    const setChildrenStyle = (option) => {
      if (option.type === "child") {
        const { childlist, parentlist } = option;
        currIndex.value = "";
        parentlist.name = childlist.name;
        document.querySelectorAll(".nav_item_link")[1].style.color = "#46bd87";
        document.querySelectorAll(".nav_item_link")[1].style.fontWeight = "600";
        document.querySelectorAll(".nav_item_link")[1].style.fontSize =
          "1.2rem";
      }
      if (option.type === "parent") {
        // console.log(list);
        navlist[1].name = "知识总结";
        document.querySelectorAll(".nav_item_link")[1].style.color = "";
        document.querySelectorAll(".nav_item_link")[1].style.fontWeight = "";
        document.querySelectorAll(".nav_item_link")[1].style.fontSize = "";
      }
    };

    return () => (
      <div class="nav_container">
        <header class="navbar">
          <a href="#/" class="nav_link">
            <span class="website_name" aria-role="website_name">
              麦林前端博客
            </span>
          </a>
          <div class="links">
            <div class="search"></div>
            <nav class="nav_links show">
              {navlist.map((item, index) => {
                return (
                  <div class="nav_item">
                    <a
                      class={[
                        "nav_item_link",
                        {
                          link_active: currIndex.value === index,
                          "link-2": index == 1,
                        },
                      ]}
                      onClick={() => setParentRouter(item, index)}
                    >
                      {item.name}
                    </a>
                    {index == 1 ? <img src={arrowIcon} alt="" /> : null}
                    {item.children ? (
                      <div className="child">
                        {item.children.map((ele) => {
                          return (
                            <a
                              className={["child_link"]}
                              onClick={() => setChildRouter(ele, item)}
                            >
                              {ele.name}
                            </a>
                          );
                        })}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </nav>
            <div class="my-switch" onClick={() => mySwitch.toggle()}></div>
            <a
              class="ml_social_link"
              href="https://github.com/hongjia123/my-website/"
              title="github"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                focusable="false"
                viewBox="0 0 24 24"
                class="ml-social-link-icon"
              >
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"></path>
              </svg>
              <span class="visually-hidden">github</span>
            </a>
          </div>
        </header>
      </div>
    );
  },
};
export default NavBar;
