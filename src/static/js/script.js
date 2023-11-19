const UserAgent = navigator.userAgent

const form = document.querySelector("form");
const bar = document.getElementById("bar");
const progress = document.getElementById("progress");
const file_name = document.getElementById("h1_file_name");
const input_file = document.getElementById("up_files");
const content_file_name = document.querySelector(".content_text_file")
const main_content = document.querySelector(".main_content")

const el_span = document.createElement("div")
const button_element = document.createElement("button")
const btn_close = document.createElement("button")


button_element.id = "btn_show_files";
button_element.innerText = "List_Files"
el_span.id = "span_files"
btn_close.id = "btn_close"
btn_close.textContent = "X"
let flag = true
btn_close.addEventListener("click", (e) => {
  if (flag) {
    if (UserAgent.match(/Windows/i)) {
      el_span.style.width = "0";
      el_span.style.height = "0";
      btn_close.style.width = "50px";
      btn_close.style.height = "50px";
      btn_close.textContent = "O"
    } else {
      el_span.style.width = "0"
      el_span.style.height = "0";
      btn_close.style.width = "50px";
      btn_close.style.height = "50px";
      btn_close.textContent = "O"
    }
    flag = false
  } else {
    if (UserAgent.match(/Windows/i)) {
      el_span.style.width = "70%";
      el_span.style.height = "50vh";
      btn_close.style.width = "50px";
      btn_close.style.height = "50px";
      btn_close.textContent = "X"
    } else {
      el_span.style.width = "85%"
      el_span.style.height = "40vh";
      btn_close.style.width = "50px";
      btn_close.style.height = "50px";
      btn_close.textContent = "X"
    }
    flag = true
  }

})

main_content.appendChild(el_span)
let counter = 0
const forCopy = []
input_file.addEventListener("change", async (e) => {

  const item = e.target
  const objectFiles = item.files

  async function Eject() {
    const FileItems = []
    for (f of objectFiles) {
      FileItems.push(f)
    }
    const ItemsName = {}
    for (let i = 0; i < FileItems.length; i++) {
      ItemsName[FileItems[i].name] = FileItems[i].type
    }
    console.log(ItemsName)
    await fetch("/files_exists", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ files: ItemsName })
    })
      .then(response => response.json())
      .then(data => {

        const keys_name = Object.keys(data.values)
        const values_exists = Object.values(data.values)
        
        const listFiles = new DataTransfer()
        // Me quedé por aquí .....
        for (let i = 0; i < keys_name.length; i++) {
          if (values_exists[i] === false) {
            listFiles.files.item[i] = input_file.files[i]
          } else {
            const index = input_file.files[i].name == keys_name[i] ? input_file.files[i] : false


            console.log(index)


            alert(`Se eliminó ${keys_name[i]} porque ya existe`)
          }
        }
        // input_file.files = listFiles.files
        console.log(input_file.files)
        console.log(`####${listFiles.files[0]}####`)
      })
      .catch(err => console.log(err))
  }

  await Eject()


  if (objectFiles.length != 1 && objectFiles.length != 0) {
    if (counter == 0) {
      content_file_name.removeChild(file_name)
      counter++
    }

    let listFiles = []
    for (let i = 0; i < objectFiles.length; i++) {
      const container = document.createElement("div")
      const button_close = document.createElement("button")
      const span = document.createElement("span")

      container.id = "container"
      container.className = `c-${i}`

      span.id = "container-name"
      span.innerHTML = `${objectFiles[i].name}`

      button_close.id = "container-btn-close"
      button_close.textContent = "X"
      button_close.className = `b-${i}`

      container.appendChild(span)
      container.appendChild(button_close)

      listFiles.push(container)

    }

    content_file_name.appendChild(button_element)

    for (f of listFiles) {

      el_span.appendChild(f)

    }

    button_element.addEventListener("click", (e) => {

      const buttons_close_item = document.querySelectorAll("#container-btn-close")

      buttons_close_item.forEach(element => {

        const class_element = element.className
        const numElements = input_file.files.length
        const newListFiles = {}
        element.addEventListener("click", (e) => {

          const container = document.querySelector(`.c-${class_element[2]}`)

          for (let i = 0; i < numElements; i++) {
            if (i != class_element[2]) {
              newListFiles[i] = input_file.files[i]
            }
          }
          el_span.removeChild(container)
        })
      })

      button_element.style.cssText = "opacity: 0;"

      document.body.appendChild(btn_close)

      if (UserAgent.match(/Windows/i)) {
        el_span.style.width = "70%";
        el_span.style.height = "50vh";
        btn_close.style.width = "50px";
        btn_close.style.height = "50px";
      } else {

        el_span.style.width = "85%"
        el_span.style.height = "40vh";
        btn_close.style.width = "50px";
        btn_close.style.height = "50px";

      }
    })

  }
  file_name.innerHTML = objectFiles[0].name
})

form.addEventListener("submit", async (event) => {
  async function getFilesExists() {
    await fetch("/files_exists", {
      method: "GET"
    }).then(response => response.json())
      .then(data => {
        const keys_name = Object.keys(data);
        const values_exists = Object.values(data);
        console.log(values_exists)
        for (let i = 0; i < keys_name.length; i++) {
          if (values_exists[i] == false) {
            event.preventDefault()

            const XML_Http_Req = new XMLHttpRequest();
            const form_data = new FormData(form);

            XML_Http_Req.upload.addEventListener("progress", (event) => {
              const porciento_completo = (event.loaded / event.total) * 100;
              bar.style.width = `${porciento_completo}%`;
              progress.innerHTML = porciento_completo.toFixed(0) + "%";
            });

            XML_Http_Req.open("POST", "/upload");
            XML_Http_Req.send(form_data);
          } else {
            alert("Ya existe")
          }
        }
      }).catch(error => console.log(error))
  }
  try {
    await getFilesExists();
  } catch (err) {
    console.log(err)
  }

});
