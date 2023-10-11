const user_agent = navigator.userAgent
const cursor = document.getElementById("cursor");
const all_container = document.querySelectorAll(".container_items");
const btn_back = document.getElementById("btn_back")

let name_item = ""

const handlerCLickButton = async (e) => {
    await fetch("/back", {
        method: "GET"
    }).then(response => response.json())
        .then(data => {
            const name_files = Object.keys(data)
            const status_files = Object.values(data)

            const main_cloud = document.querySelector(".main_cloud")
            main_cloud.innerHTML = ""

            name_files.forEach((item, index) => {
                const container_elements = createElementContainer(item, status_files[index]);
                container_elements.addEventListener("click", handlerClickContainer);
                main_cloud.appendChild(container_elements)
            })
        })
        .catch(err => console.log(err))
}

function createElementContainer(item, status) {

    const elementContainer = document.createElement("div");
    elementContainer.classList = "container_items";

    const fileImage = document.createElement("img");
    fileImage.src = status ? "items/folder.png" : "items/files.png";
    fileImage.id = "imagenes";

    const liName = document.createElement("li");
    liName.style.cssText = "display:flex; align-items: center; justify-content: center;"
    liName.textContent = item;

    elementContainer.appendChild(fileImage);
    elementContainer.appendChild(liName);

    return elementContainer;

}

const handlerClickContainer = async (e) => {
    const data_li = e.target.closest(".container_items").querySelector("li").textContent;

    await fetch(`/cloud/${encodeURIComponent(data_li)}`, {
        method: "GET"
    })
        .then(response => response.json())
        .then(data => {
            const names_files = Object.keys(data)
            const status_files = Object.values(data)
            const main_cloud = document.querySelector(".main_cloud");
            main_cloud.innerHTML = "";

            names_files.forEach(async (item, index) => {
                const container_elements = createElementContainer(item, status_files[index]);
                container_elements.addEventListener("click", handlerClickContainer);
                main_cloud.appendChild(container_elements)

                name_item = item
            })
        })
        .catch(error => console.log(error))

        // await fetch(`/download/${encodeURIComponent(name_item)}`, {
        //     method: "Get"
        // }).then(response => response.json())
        //     .then(data => console.log(data))
        //     .catch(err => console.log(err))
}

all_container.forEach((elemento) => {
    elemento.addEventListener("click", handlerClickContainer)
})

btn_back.addEventListener("click", handlerCLickButton)

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

document.addEventListener("mousemove", async (e) => {
    const posX = e.clientX;
    const posY = e.clientY;

    cursor.style.top = posY + "px";
    cursor.style.left = posX + "px";
})

document.addEventListener("mousedown", async (e) => {
    cursor.style.background = "red"
    cursor.style.boxShadow = `
        0 0 5px red,
        0 0 15px red,
        0 0 25px red,
        0 0 45px red,
        0 0 60px red
    `
})

document.addEventListener("mouseup", async (e) => {
    cursor.style.background = "black"
    cursor.style.boxShadow = `
        0 0 5px black,
        0 0 15px black,
        0 0 25px black,
        0 0 45px black,
        0 0 60px black
    `
})