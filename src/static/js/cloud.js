const all_li = document.querySelectorAll("li")

all_li.forEach((elemento) => {
    elemento.addEventListener("click", (event) => {

        async function send_name(name_element) {
            await fetch("/openfold", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name: name_element })
            })
        }

        let name_to_send = elemento.textContent

        console.log(inside_html_element)

        send_name(name_to_send)
    })
})