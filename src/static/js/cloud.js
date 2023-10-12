// import {
//     handlerCLickButton,
//     handlerClickContainer
// } from "./handlers_cloud.js";

import object_handler from "./handlers_cloud.js"

const user_agent = navigator.userAgent
const all_container = document.querySelectorAll(".container_items");
const btn_back = document.getElementById("btn_back")

all_container.forEach((elemento) => {
    elemento.addEventListener("click", object_handler.handlerClickContainer)
})

btn_back.addEventListener("click", object_handler.handlerCLickButton)

if (user_agent.match(/Android/i) || user_agent.match(/iPhone/i)) {
    const img = document.querySelectorAll("#imagenes")
    img.forEach((e) => {
        e.style.cssText = "width: 100px; height: 100px;"
    })
    const main_cloud = document.querySelector(".main_cloud")
    main_cloud.style.cssText = "flex-direction: column;"

    btn_back.style.cssText = `
        top: 2px;
        left: 5px;
    `
}