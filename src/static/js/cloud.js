const cursor = document.getElementById("cursor");
const all_container = document.querySelectorAll(".container_items");

all_container.forEach((elemento) => {
    elemento.addEventListener("click", async (event) => {
        const data_li = event.target.closest(".container_items").querySelector("li").textContent;

        let last_index = data_li.lastIndexOf(".");
        let extension = data_li.slice(last_index);

        if (extension === ".txt") {
            // Me falta esto
        } else {
            try {
                const response = await fetch(`/cloud/${encodeURIComponent(data_li)}`, {
                    method: "GET",
                });
                if (response.ok) {
                    const data = await response.json();
                    const names_files = Object.keys(data);
                    const status_files = Object.values(data);

                    const mainCloudElement = document.querySelector(".main_cloud");
                    mainCloudElement.innerHTML = ""; // Vaciar el contenedor principal

                    names_files.forEach((item, index) => {
                        const containerElement = document.createElement("div");
                        containerElement.classList.add("container_items");

                        const imgElement = document.createElement("img");
                        imgElement.src = status_files[index] ? "items/folder.png" : "items/txt.png";

                        const liElement = document.createElement("li");
                        liElement.textContent = item;

                        containerElement.appendChild(imgElement);
                        containerElement.appendChild(liElement);

                        mainCloudElement.appendChild(containerElement);
                    });
                } else {
                    throw new Error("Error obteniendo lista de archivos");
                }
            } catch (error) {
                console.log(error);
            }
        }
    });
});

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