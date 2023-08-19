const cursor = document.getElementById("cursor")
const all_li = document.querySelectorAll("li")

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

all_li.forEach(async (elemento) => {
    elemento.addEventListener("click", async (event) => {

        async function send_name(name_element) {
            await fetch("/openfold", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name: name_element })
            }).then(response => console.log(response.json()))
                .then(data => console.log(data))
                .catch(error => console.log(error))
        }

        let name_to_send = elemento.textContent

        console.log(name_to_send)

        await send_name(name_to_send)

    })
})