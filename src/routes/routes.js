const { Router } = require("express")
const multer = require("multer")
const { join } = require("path")
const fs = require("fs")
// import { dirname, join } from "path";
// import { fileURLToPath } from "url";
// import user_agent from "useragent"


const rutas = new Router();
// const full_path = dirname(fileURLToPath(import.meta.url));

let name_file = "";

const save_storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log(`Copiando: [ ${file.originalname} ]`)
        if (file.mimetype.endsWith("vbox-extpack")
            || file.mimetype.endsWith("octet-stream") || file.mimetype.endsWith("x-tar")) {
            cb(null, "D:/Subidas/Otros")
        } else if (file.mimetype.startsWith('video')) {
            cb(null, "D:/Subidas/Videos")
        } else if (file.mimetype.startsWith('image')) {
            cb(null, "D:/Subidas/Imagenes")
        } else if (file.mimetype.startsWith('audio')) {
            cb(null, "D:/Subidas/Audio")
        } else if (file.mimetype.endsWith("vnd.android.package-archive")
            || file.mimetype.endsWith("vnd.android.package-archive")) {
            cb(null, "D:/Subidas/Apk")
        } else if (file.mimetype.endsWith("x-msdownload")) {
            cb(null, "D:/Subidas/Programas")
        } else if (file.mimetype.endsWith("x-msdos-program")) {
            cb(null, "D:/Subidas/Programas")
        } else if (file.mimetype.endsWith("zip")) {
            cb(null, "D:/Subidas/Otros")
        } else if (file.mimetype.endsWith("pdf")) {
            cb(null, "D:/Subidas/PDF")
        } else {
            cb(null, "D:/Subidas")
        }
    },
    filename: function (req, file, cb) {
        name_file += file.originalname + "\n"
        let main_dir = "D:/Subidas"
        let copiado = false
        fs.readdir(main_dir, (err, carpetas) => {
            let lista_carpetas = []
            for (let i = 0; i < carpetas.length; i++) {
                lista_carpetas.push(join("D:/Subidas", carpetas[i]))
            }
            if (lista_carpetas.length === 7) {
                for (let i = 0; i < lista_carpetas.length; i++) {
                    fs.readdir(lista_carpetas[i], (err, archivos) => {
                        if (archivos.length <= 0 && copiado == false) {
                            cb(null, file.originalname)
                            copiado = true
                        }
                    })
                }
            }
        })
    },
});

const up = multer({
    storage: save_storage,
    limits: {
        fileSize: 1024 * 1024 * 1024 * 1024 * 50
    }
});


rutas.get("/", (req, res) => {
    res.render("index.ejs");
});


rutas.post("/upload", up.array("files"), (req, res) => {
    console.log(`Copia de: [ ${name_file} ] Terminado`);
});

module.exports = rutas
