// 定义开关的不同状态
class darkState {
  constructor(switchButton) {
    this.SwitchButton = switchButton;
    this.varMap = {
      "--ml-bg-color": "--ml-dark-bg-color",
      "--ml-text-color": "--ml-dark-text-color",
      "--ml-borderB-color": "--ml-dark-borderB-color",
      "--ml-principle-bg-color": "--ml-principle-dark-bg-color",
    };
  }

  // 打开当前状态
  turnOn() {
    document.querySelector(".ml-switch-check").style.background = "#000";
    document.querySelector(".ml-switch").style.background = "#292727";
    document.querySelector(".ml-switch-appearance-moon").style.opacity = "1";
    document.querySelector(".ml-switch-appearance-moon").style.fill = "#fff";
    document.querySelector(".ml-switch-check").style.transform =
      "translate(18px)";
    this.SwitchButton.setState(this);
  }
  // 关闭当前状态
  turnOff() {
    document.querySelector(".ml-switch-appearance-moon").style.opacity = "0";
    this.SwitchButton.lightState.turnOn();
  }
}
class lightState {
  constructor(switchButton) {
    this.SwitchButton = switchButton;
    this.varMap = {
      "--ml-bg-color": "--ml-light-bg-color",
      "--ml-text-color": "--ml-light-text-color",
      "--ml-borderB-color": "--ml-light-borderB-color",
      "--ml-principle-bg-color": "--ml-principle-light-bg-color",
    };
  }
  // 打开当前状态

  turnOn() {
    document.querySelector(".ml-switch-check").style.background = "#fff";
    document.querySelector(".ml-switch-appearance-sun").style.opacity = "1";
    document.querySelector(".ml-switch").style.background = "#f1f1f1";
    document.querySelector(".ml-switch-appearance-sun").style.fill = "#000";
    document.querySelector(".ml-switch-check").style.fill = "#f1f1f1";
    document.querySelector(".ml-switch-check").style.transform =
      "translate(0px)";
    this.SwitchButton.setState(this);
  }
  // 关闭当前状态
  turnOff() {
    document.querySelector(".ml-switch-appearance-sun").style.opacity = "0";
    this.SwitchButton.darkState.turnOn();
  }

  // 改变状态
}

// 创建通用开关类
class SwitchButton {
  constructor(option) {
    this.el = option.el; //开关挂载的元素选择器
    this.lightState = new lightState(this);
    this.darkState = new darkState(this);
    this.template = `
            <button
              class="ml-switch ml-switch-appearance"
              type="button"
              role="switch"
              aria-label="切换深色模式"
              aria-checked="false"
              data-v-e659aa17=""
            >
              <span class="ml-switch-check">
                <span class="ml-switch-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    focusable="false"
                    viewBox="0 0 24 24"
                    class="ml-switch-appearance-sun"
                  >
                    <path d="M12,18c-3.3,0-6-2.7-6-6s2.7-6,6-6s6,2.7,6,6S15.3,18,12,18zM12,8c-2.2,0-4,1.8-4,4c0,2.2,1.8,4,4,4c2.2,0,4-1.8,4-4C16,9.8,14.2,8,12,8z"></path>
                    <path d="M12,4c-0.6,0-1-0.4-1-1V1c0-0.6,0.4-1,1-1s1,0.4,1,1v2C13,3.6,12.6,4,12,4z"></path>
                    <path d="M12,24c-0.6,0-1-0.4-1-1v-2c0-0.6,0.4-1,1-1s1,0.4,1,1v2C13,23.6,12.6,24,12,24z"></path>
                    <path d="M5.6,6.6c-0.3,0-0.5-0.1-0.7-0.3L3.5,4.9c-0.4-0.4-0.4-1,0-1.4s1-0.4,1.4,0l1.4,1.4c0.4,0.4,0.4,1,0,1.4C6.2,6.5,5.9,6.6,5.6,6.6z"></path>
                    <path d="M19.8,20.8c-0.3,0-0.5-0.1-0.7-0.3l-1.4-1.4c-0.4-0.4-0.4-1,0-1.4s1-0.4,1.4,0l1.4,1.4c0.4,0.4,0.4,1,0,1.4C20.3,20.7,20,20.8,19.8,20.8z"></path>
                    <path d="M3,13H1c-0.6,0-1-0.4-1-1s0.4-1,1-1h2c0.6,0,1,0.4,1,1S3.6,13,3,13z"></path>
                    <path d="M23,13h-2c-0.6,0-1-0.4-1-1s0.4-1,1-1h2c0.6,0,1,0.4,1,1S23.6,13,23,13z"></path>
                    <path d="M4.2,20.8c-0.3,0-0.5-0.1-0.7-0.3c-0.4-0.4-0.4-1,0-1.4l1.4-1.4c0.4-0.4,1-0.4,1.4,0s0.4,1,0,1.4l-1.4,1.4C4.7,20.7,4.5,20.8,4.2,20.8z"></path>
                    <path d="M18.4,6.6c-0.3,0-0.5-0.1-0.7-0.3c-0.4-0.4-0.4-1,0-1.4l1.4-1.4c0.4-0.4,1-0.4,1.4,0s0.4,1,0,1.4l-1.4,1.4C18.9,6.5,18.6,6.6,18.4,6.6z"></path>
                  </svg>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    focusable="false"
                    viewBox="0 0 24 24"
                    class="ml-switch-appearance-moon"
                  >
                    <path d="M12.1,22c-0.3,0-0.6,0-0.9,0c-5.5-0.5-9.5-5.4-9-10.9c0.4-4.8,4.2-8.6,9-9c0.4,0,0.8,0.2,1,0.5c0.2,0.3,0.2,0.8-0.1,1.1c-2,2.7-1.4,6.4,1.3,8.4c2.1,1.6,5,1.6,7.1,0c0.3-0.2,0.7-0.3,1.1-0.1c0.3,0.2,0.5,0.6,0.5,1c-0.2,2.7-1.5,5.1-3.6,6.8C16.6,21.2,14.4,22,12.1,22zM9.3,4.4c-2.9,1-5,3.6-5.2,6.8c-0.4,4.4,2.8,8.3,7.2,8.7c2.1,0.2,4.2-0.4,5.8-1.8c1.1-0.9,1.9-2.1,2.4-3.4c-2.5,0.9-5.3,0.5-7.5-1.1C9.2,11.4,8.1,7.7,9.3,4.4z"></path>
                  </svg>
                </span>
              </span>
            </button>`; //开关的dom模板
    this.createSwitch();
  }
  createSwitch() {
    const container = document.createElement("div");
    // 将模板字符串转换为节点对象
    container.innerHTML = this.template;
    document.querySelector(this.el).appendChild(container.firstElementChild);
    this.lightState.turnOn(); //默认light模式
    this.setState(this.lightState);
  }

  setState(state) {
    this.currentState = state; // 当前默认light状态
    this.setGlobalState();
  }
  setGlobalState() {
    Object.entries(this.currentState.varMap).forEach(([rootvar, lightvar]) => {
      document.documentElement.style.setProperty(rootvar, `var(${lightvar})`);
    });
  }
  //监听用户行为切换状态
  toggle() {
    this.currentState.turnOff();
  }
}

export default SwitchButton;
