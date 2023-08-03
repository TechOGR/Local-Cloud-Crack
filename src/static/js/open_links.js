const all_img = document.querySelectorAll(".img")

all_img.forEach((elemento) => {

    const function_post = async (name_class) => {

        await fetch("/open_link", {
            method: "POST",
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify({ link: name_class })
        })
            .then(response => response.json())
            .then(data => {
                console.log(data)
            })
            .catch(error => console.log(error))
    }

    elemento.addEventListener("click", (event) => {
        const name_link = elemento.className
        const name_to_send = name_link.split(" ")
        const fileter_name = name_to_send[1]

        function_post(fileter_name)

    })

})