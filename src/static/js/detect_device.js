const user_agent = navigator.userAgent

const footer = document.querySelector("footer")

if (user_agent.match(/Android/i) || user_agent.match(/iPhone/i)) {
    footer.style.cssText = "top: -10px"
}