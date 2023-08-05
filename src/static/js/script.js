const form = document.querySelector("form");
const bar = document.getElementById("bar");
const progress = document.getElementById("progress");
const file_name = document.getElementById("h1_file_name");
const input_file = document.getElementById("up_files");

form.addEventListener("submit", (event) => {

  event.preventDefault();
  const XML_Http_Req = new XMLHttpRequest();
  const form_data = new FormData(form);
  const file = input_file.value;
  const file_named = file.replace("C:\\fakepath\\", "");
  file_name.textContent = file_named;

  XML_Http_Req.upload.addEventListener("progress", (event) => {
    const porciento_completo = (event.loaded / event.total) * 100;
    bar.style.width = `${porciento_completo}%`;
    progress.innerHTML = porciento_completo.toFixed(0) + "%";
  });

  XML_Http_Req.open("POST", "/upload");
  XML_Http_Req.send(form_data);
});
