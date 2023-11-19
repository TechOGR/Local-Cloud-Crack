const createElementContainer = (item, status, type) => {
    const elementContainer = document.createElement("div");
    elementContainer.classList = "container_items";
    console.log(item, status, type)

    const fileImage = document.createElement("img");

    fileImage.src = status ? "items/folder.png" : `items/${type}.png`;
    fileImage.id = "imagenes";

    const liName = document.createElement("li");
    liName.className = "name_item"
    liName.textContent = item;

    elementContainer.appendChild(fileImage);
    elementContainer.appendChild(liName);

    // Agregar event listener al contenedor de elementos
    elementContainer.addEventListener("click", (e) => {
        if (!status) {
            const downloadLink = document.createElement("a");
            downloadLink.href = `/download/${encodeURIComponent(item)}`;
            downloadLink.download = item;
            downloadLink.click();
        }
    });

    return elementContainer;
}

export const handlerClickButton = async () => {
    await fetch("/back", {
        method: "GET"
    }).then(response => response.json())
        .then(data => {
            const main_cloud = document.querySelector(".main_cloud");
            main_cloud.innerHTML = ""
            data.forEach((item, index) => {
                const { name, isFolder, type } = item

                const container_elements = createElementContainer(name, isFolder, type);
                container_elements.addEventListener("click", handlerClickContainer)
                main_cloud.appendChild(container_elements);
            })
        })
        .catch(err => console.log(err))
}

export const handlerClickContainer = async (e) => {
    const data_li = e.target.closest(".container_items").querySelector("li").textContent;

    await fetch(`/cloud/${encodeURIComponent(data_li)}`, {
        method: "GET"
    })
        .then(response => response.json())
        .then(data => {
            const main_cloud = document.querySelector(".main_cloud");
            main_cloud.innerHTML = "";

            data.forEach((item, index) => {

                const { name, isFolder, type } = item

                const container_elements = createElementContainer(name, isFolder, type)
                container_elements.addEventListener("click", handlerClickContainer)
                main_cloud.appendChild(container_elements)

            })
        })
        .catch(error => console.log(error))
}
const container_search = document.createElement("div")
const input_search = document.createElement("input")
const btn_search = document.createElement("button")
container_search.className = "container_search_bar";
input_search.className = "input_search"
btn_search.className = "btn_search"
input_search.type = "text"
input_search.textContent = "Hola"
container_search.appendChild(input_search)
container_search.appendChild(btn_search)
export const handlerKeys = () => {
    document.addEventListener("keypress", (event) => {
        if (event.key == "Y") {
            document.body.append(container_search)
        }
    })
}