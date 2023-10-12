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
            })
        })
        .catch(error => console.log(error))
}

export default {handlerCLickButton, handlerClickContainer}