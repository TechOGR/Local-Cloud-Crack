const user_agent = navigator.userAgent

const footer = document.querySelector("footer")

if (/Mobi|Android/i.test(user_agent)) {
    footer.style.cssText = "top: -10px"
}