const { Router } = require("express")
const { join, extname } = require("path")
const { promises } = require("fs")
const { shell } = require("electron")
const { json } = require("express")
const multer = require("multer")
const fs = require("fs")
const ejs = require("ejs")

const rutas = new Router();

rutas.use(json())

let name_file = "";

const save_storage = multer.diskStorage({
    destination: function (req, file, cb) {

        console.log(`[${file.originalname}] >><< ${file.mimetype}`)

        console.log(`Copiando: [ ${file.originalname} ]`)

        if (file.mimetype.endsWith("vbox-extpack")
            || file.mimetype.endsWith("octet-stream") || file.mimetype.endsWith("x-tar")) {
            cb(null, "D:/Uploads/Otros")
        } else if (file.mimetype.startsWith('video')) {
            cb(null, "D:/Uploads/Videos")
        } else if (file.mimetype.startsWith('image')) {
            cb(null, "D:/Uploads/Imagenes")
        } else if (file.mimetype.startsWith('audio')) {
            cb(null, "D:/Uploads/Audio")
        } else if (file.mimetype.endsWith("vnd.android.package-archive")
            || file.mimetype.endsWith("vnd.android.package-archive")) {
            cb(null, "D:/Uploads/Apk")
        } else if (file.mimetype.endsWith("x-msdownload")) {
            cb(null, "D:/Uploads/Programas")
        } else if (file.mimetype.endsWith("x-msdos-program")) {
            cb(null, "D:/Uploads/Programas")
        } else if (file.mimetype.endsWith("zip")) {
            cb(null, "D:/Uploads/Compactados")
        } else if (file.mimetype.endsWith("pdf")) {
            cb(null, "D:/Uploads/PDF")
        } else if (file.mimetype.endsWith("x-tar")) {
            cb(null, "D:/Uploads/Compactados")
        } else if (file.mimetype.endsWith("x-7z-compressed")) {
            cb(null, "D:/Uploads/Compactados")
        } else if (file.mimetype.endsWith("rar")) {
            cb(null, "D:/Uploads/Compactados")
        } else {
            cb(null, "D:/Uploads")
        }
    },
    filename: function (req, file, cb) {
        name_file += file.originalname + "\n"

        let copiado = false

        const load_dir = async (dir_main) => {
            const main_folder_dir = dir_main

            try {
                const folders = await promises.readdir(main_folder_dir)

                const list_folders = []

                for (let fold of folders) {
                    const stats = await promises.stat(join(main_folder_dir, fold))
                    if (stats.isDirectory()) {
                        list_folders.push(join(main_folder_dir, fold))
                    }
                }

                if (list_folders.length === 8) {
                    for (let i = 0; i < list_folders.length; i++) {
                        const archivos = await promises.readdir(list_folders[i])
                        if (archivos.includes(file.originalname)) {
                            copiado = true
                        } else {
                            copiado = false
                        }
                    }
                }
                if (!copiado) {
                    cb(null, file.originalname)
                    copiado = true
                } else {
                    copiado = false
                }

            } catch (err) {
                console.log(err)
            }
        }
        const main_dir = "D:/Uploads"
        load_dir(main_dir).catch(err => console.log(err))
    },
});

const up = multer({
    storage: save_storage,
    limits: {
        fileSize: 1024 * 1024 * 1024 * 1024 * 50
    }
});

const all_links = {
    youtube: "https://www.youtube.com/@OnelCrack",
    facebook: "https://www.facebook.com/profile.php?id=100092376152191",
    twitter: "https://twitter.com/Onel_Crack?t=NFwmb3M7Gb8dr-B9oUubaw&s=09",
    instagram: "https://www.instagram.com/onel_crack/",
    github: "https://github.com/TechOGR"
}

rutas.get("/", async (req, res) => {
    await res.render("index.ejs", { title: "Up_LocalCloud_Down" });
});


rutas.post("/upload", up.array("files"), (req, res) => {
    console.log(`Copia de: [ ${name_file} ] Terminado`);
});

rutas.post("/open_link", async (req, res) => {
    console.log(req.body)

    let name_class = req.body.link
    let claves_links = Object.keys(all_links)

    switch (name_class) {
        case claves_links[0]: // YouTube
            await shell.openExternal(all_links.youtube)
            break
        case claves_links[1]: // Facebook
            await shell.openExternal(all_links.facebook)
            break
        case claves_links[2]: // Twitter
            await shell.openExternal(all_links.twitter)
            break
        case claves_links[3]: // Instagram
            await shell.openExternal(all_links.instagram)
            break
        case claves_links[4]: // GitHub
            await shell.openExternal(all_links.github)
            break
        default:
            console.log("Invalid_Social_Red")
    }

    await res.status(200).json({ sms: "All ok" })
})

rutas.get("/cloud", async (req, res) => {

    const load_files = async (path) => {
        try {

            const files = await promises.readdir(path)
            const files_list = {}

            for (item of files) {
                if (item == "System Volume Information" || item == "$RECYCLE.BIN") { console.log("Skip") }
                else {

                    const stat = await promises.stat(join(path, item))

                    if (stat.isDirectory()) {
                        files_list[item] = true
                    } else {
                        files_list[item] = false
                    }
                }
            }

            console.log(files_list)

            return files_list

        } catch (err) {
            console.log(err)
        }
    }
    const path = `D:/`
    const object_files = await load_files(path)

    await res.render("cloud.ejs", {
        title: "Local-Cloud-Crack",
        list_files: object_files
    })
})

rutas.get("/cloud/:folder", async (req, res) => {
    const carpeta = req.params.folder

    const load_path = async (path) => {
        const files = await promises.readdir(path)
        const list_files = {}

        for (item of files) {
            if (item == "$RECYCLE.BIN") {
                console.log("Skip")
            } else {
                const stat = await promises.stat(join(path, item))

                if (stat.isDirectory()) {
                    list_files[item] = true
                } else {
                    list_files[item] = false
                }
            }
        }

        return list_files
    }

    const lista_archivos = await load_path(`D:/${carpeta}`)

    console.log(lista_archivos)

    res.json(lista_archivos)
})

module.exports = rutas
