const themeType = {
    dark: {
        '--ml-bg-color': '--ml-dark-bg-color',
        '--ml-text-color': '--ml-dark-text-color',
        '--ml-borderB-color': '--ml-dark-borderB-color',
        '--ml-principle-bg-color': '--ml-principle-dark-bg-color'
    },
    light: {
        '--ml-bg-color': '--ml-light-bg-color',
        '--ml-text-color': '--ml-light-text-color',
        '--ml-borderB-color': '--ml-light-borderB-color',
        '--ml-principle-bg-color': '--ml-principle-light-bg-color'
    },
}
const setPageTheme = () => {
    const moonOpacity = getComputedStyle(document.querySelector('.ml-switch-appearance-moon')).opacity;
    if (moonOpacity == '0') {
        document.querySelector('.ml-switch-check').style.background = '#000';
        document.querySelector('.ml-switch').style.background = '#292727';
        document.querySelector('.ml-switch-appearance-moon').style.opacity = '1';
        document.querySelector('.ml-switch-appearance-moon').style.fill = '#fff';
        document.querySelector('.ml-switch-appearance-sun').style.opacity = '0';
        document.querySelector('.ml-switch-check').style.transform = 'translate(18px)';
        document.querySelector('.ml-social-link-icon').style.fill = '#fff';
        Object.entries(themeType.dark).forEach(([rootvar,darkvar])=>{
            document.documentElement.style.setProperty(rootvar, `var(${darkvar})`)
        })
    } else {
        document.querySelector('.ml-switch-check').style.background = '#fff';
        document.querySelector('.ml-switch-appearance-moon').style.opacity = '0';
        document.querySelector('.ml-switch-appearance-sun').style.opacity = '1';
        document.querySelector('.ml-switch').style.background = '#f1f1f1';
        document.querySelector('.ml-switch-appearance-sun').style.fill = '#000';
        document.querySelector('.ml-switch-check').style.fill = '#f1f1f1';
        document.querySelector('.ml-switch-check').style.transform = 'translate(0px)';
        document.querySelector('.ml-social-link-icon').style.fill = '#000'
        Object.entries(themeType.light).forEach(([rootvar, lightvar]) => {
            document.documentElement.style.setProperty(rootvar, `var(${lightvar})`)
        })
    }
};
export default setPageTheme