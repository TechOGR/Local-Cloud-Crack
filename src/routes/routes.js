const { Router } = require("express")
const { join, extname } = require("path")
const { promises } = require("fs")
const { shell } = require("electron")
const { json } = require("express")
const multer = require("multer")
const fs = require("fs")

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

const main_path = "D:/"
let iter_folders = [main_path]
let last_folders = ""
let conter = 0

rutas.get("/cloud", async (req, res) => {

    const load_files = async (path) => {
        try {

            const files = await promises.readdir(path)
            const files_list = {}

            for (item of files) {
                if (item == "System Volume Information" || item == "$RECYCLE.BIN") { }
                else {

                    const stat = await promises.stat(join(path, item))

                    if (stat.isDirectory()) {
                        files_list[item] = true
                    } else {
                        files_list[item] = false
                    }
                }
            }

            return files_list

        } catch (err) {
            console.log(err)
        }
    }
    const path = `D:/`
    const object_files = await load_files(path)
    last_folders = ""
    iter_folders = [path]

    await res.render("cloud.ejs", {
        title: "Local-Cloud-Crack",
        list_files: object_files
    })
})
let folder_params = ""
rutas.get("/back", async (req, res) => {

    const list_files = {}

    const load_path = async (path) => {
        const stats = await promises.stat(path)

        if (stats.isDirectory()) {

            const files = await promises.readdir(path);

            for (item of files) {
                if (item == "System Volume Information" || item == "$RECYCLE.BIN") { }

                if (stats.isDirectory()) {
                    list_files[item] = true
                } else {
                    list_files[item] = false
                }
            }

            return list_files
        }
    }

    try {
        if (iter_folders.length >= 2) {

            conter += 1

            iter_folders.pop()

            if (conter >= 2) {
                last_folders = iter_folders[iter_folders.length - 1]
            } else {
                last_folders = last_folders.replace(folder_params, "")
            }

            const new_path = iter_folders[iter_folders.length - 1]
            const list_files = await load_path(new_path)

            await res.json(list_files)
        } else {
            last_folders = last_folders.replace(folder_params + "/", "")

            const new_path = iter_folders[iter_folders.length - 1]
            const list_files = await load_path(new_path)

            await res.json(list_files)
        }
    } catch (err) {
        console.log(err)
    }
})
rutas.get("/cloud/:folder", async (req, res) => {

    folder_params = req.params.folder

    const load_path = async (path) => {

        const status = await promises.stat(path)

        if (status.isDirectory()) {

            const files = await promises.readdir(path)
            const list_files = {}

            for (item of files) {
                if (item != "System Volume Information" || item != "$RECYCLE.BIN") {
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
    }

    try {
        if (iter_folders.length <= 1) {


            last_folders = join(main_path, folder_params)
            iter_folders.push(last_folders)

            const new_path = iter_folders[iter_folders.length - 1]
            const list_files = await load_path(new_path)

            await res.json(list_files)

        } else {
            last_folders = join(last_folders, folder_params)

            iter_folders.push(last_folders)

            const new_path = iter_folders[iter_folders.length - 1]
            const list_files = await load_path(new_path)
            await res.json(list_files)

        }

    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Hola" })
    }
})

rutas.get("/download/:file", async (req, res) => {
    const file = req.params.file;
    const filePath = join(iter_folders[iter_folders.length - 1], file);
    console.log(iter_folders, file,filePath)
    // Verificando si el archivo existe
    fs.stat(filePath, async (err, stats) => {
        if (err || !stats.isFile()) {
            console.error(`Error al verificar la existencia del archivo ${filePath}: ${err}`);
            await res.status(500).json({ error: "Error al descargar el archivo" });
        } else {
            await res.download(filePath, (error) => {
                if (error) {
                    console.error(`Error al descargar el archivo ${file}: ${error}`);
                    res.status(500).json({ error: "Error al descargar el archivo" });
                }
            });
        }
    });
});

module.exports = rutas
