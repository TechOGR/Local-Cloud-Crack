const all_img = document.querySelectorAll(".img")

const all_links = {
    youtube: "https://www.youtube.com/@OnelCrack",
    facebook: "https://www.facebook.com/profile.php?id=100092376152191",
    twitter: "https://twitter.com/Onel_Crack?t=NFwmb3M7Gb8dr-B9oUubaw&s=09",
    instagram: "https://www.instagram.com/onel_crack/",
    github: "https://github.com/TechOGR"
}

all_img.forEach((elemento) => {

    const function_post = async (name_class) => {
        let data_send = {
            name: name_class
        }
        await fetch("/open_link", {
            method: "POST",
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify(data_send)
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
        console.log(name_to_send[1])
        function_post(name_to_send[1])
    })

})