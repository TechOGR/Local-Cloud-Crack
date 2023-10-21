const { Router } = require("express")
const { join, extname } = require("path")
const { exec } = require("child_process")
const { promises } = require("fs")
const { shell } = require("electron")
const { json } = require("express")
const multer = require("multer")
const fs = require("fs")
const os = require("os")
const mimeType = require("mime-types")
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

let main_path = ""
const file_log = join(os.homedir(), "log.txt")

const func_file_log = (dir = "D:/") => {
    fs.access(file_log, fs.constants.F_OK, (error) => {
        if (error) {

            fs.writeFile(file_log, dir, 'utf8', (error) => {
                if (error) {
                    console.error('Error al crear el archivo:', error);
                } else {
                    console.log('Archivo creado exitosamente');
                }
            });
        } else {
            fs.readFile(file_log, "utf-8", (err, data) => {
                if (err) console.log(err)

                main_path = data.trim()

                fs.writeFile(file_log, dir, 'utf8', (error) => {
                    if (error) {
                        console.error('Error al reemplazar el contenido del archivo:', error);
                    } else {
                        console.log('Se remplazo');
                    }
                });
            })

        }
    });
}
func_file_log()

rutas.get("/set_dir_face", async (req, res) => {
    await res.render("setPath.ejs");
})
rutas.post("/set_dir", async (req, res) => {
    const path = req.body.path
    func_file_log(path)
    main_path = path
})
let iter_folders = [main_path]
let last_folders = ""
let conter = 0

rutas.get("/cloud", async (req, res) => {

    const load_files = async (path) => {
        try {
            const files = await promises.readdir(path)
            const array_objects = []

            for (item of files) {
                if (
                    item == "System Volume Information" ||
                    item == "$RECYCLE.BIN" ||
                    item == "DumpStack.log.tmp" ||
                    item == "pagefile.sys"
                ) { continue }
                const stat = await promises.stat(join(path, item))
                if (stat.isDirectory()) {
                    array_objects.push({
                        "name": item,
                        "isFolder": true,
                        "type": "Folder"
                    })
                } else {
                    let tipo = "file"
                    const mime_type = mimeType.lookup(join(path, item));
                    console.log("_____" + mime_type + "_____")
                    try {
                        if (mime_type.startsWith('video')) {
                            tipo = "video"
                        } else if (mime_type.startsWith('image')) {
                            tipo = "imagen"
                        } else if (mime_type.startsWith('audio')) {
                            tipo = "music"
                        } else if (
                            mime_type.endsWith("vnd.android.package-archive") ||
                            mime_type.endsWith("vnd.android.package-archive")
                        ) {
                            tipo = "apk"
                        } else if (mime_type.endsWith("x-msdownload")) {

                        } else if (mime_type.startsWith("text")) {
                            tipo = "file_text"
                        } else if (mime_type.endsWith("x-msdos-program")) {
                            tipo = "exe"
                        } else if (
                            mime_type.endsWith("zip") ||
                            mime_type.endsWith("x-tar") ||
                            mime_type.endsWith("x-7z-compressed") ||
                            mime_type.endsWith("rar") ||
                            mime_type.endsWith("vbox-extpack") ||
                            mime_type.endsWith("octet-stream") ||
                            mime_type.endsWith("x-tar")
                        ) {
                            tipo = "compress"
                        } else if (mime_type.endsWith("pdf")) {
                            tipo = "pdf"
                        } else {
                            tipo = "files"
                        }
                    } catch (err) {
                        console.log(err)
                    }
                    array_objects.push({
                        "name": item,
                        "isFolder": false,
                        "type": tipo
                    })
                }
            }
            return array_objects

        } catch (err) {
            console.log(err)
        }
    }

    const object_files = await load_files(main_path)
    last_folders = ""
    iter_folders = [main_path]
    await res.render("cloud.ejs", {
        title: "Local-Cloud-Crack",
        list_files: object_files
    })
})

let folder_params = ""

// Checking MimeTypes
const checkMimeTypes = (path, item) => {
    let tipo = "file"
    const mime_type = mimeType.lookup(join(path, item));

    console.log("_<" + mime_type + ">_")
    try {
        if (typeof mime_type !== "boolean") {
            if (mime_type.startsWith('video')) {
                tipo = "video"
            } else if (mime_type.endsWith("msword")) {
                tipo = "doc"
            } else if (mime_type.endsWith("x-iso9660-image")) {
                tipo = "iso-file"
            } else if (mime_type.endsWith("javascript")) {
                tipo = "js-file"
            } else if (mime_type.endsWith("jsx")) {
                tipo = "react"
            } else if (mime_type.endsWith("json")) {
                tipo = "json"
            } else if (mime_type.startsWith('image')) {
                tipo = "image"
            } else if (mime_type.startsWith('audio')) {
                tipo = "music"
            } else if (
                mime_type.endsWith("vnd.android.package-archive") ||
                mime_type.endsWith("vnd.android.package-archive")
            ) {
                tipo = "apk"
            } else if (mime_type.endsWith("x-msdownload")) {

            } else if (mime_type.startsWith("text")) {
                tipo = "file_text"
            } else if (mime_type.endsWith("x-msdos-program")) {
                tipo = "exe"
            } else if (
                mime_type.endsWith("zip") ||
                mime_type.endsWith("x-tar") ||
                mime_type.endsWith("x-7z-compressed") ||
                mime_type.endsWith("rar") ||
                mime_type.endsWith("vbox-extpack") ||
                mime_type.endsWith("octet-stream") ||
                mime_type.endsWith("x-tar")
            ) {
                tipo = "compress"
            } else if (mime_type.endsWith("pdf")) {
                tipo = "pdf"
            } else {
                tipo = "files"
            }
        } else {
            const extension = extname(join(path, item))
            if (extension == ".py") {
                tipo = "python"
            } else {
                tipo = "files"
            }
        }
        return tipo
    } catch (err) {
        console.log(err)
    }
}

rutas.get("/back", async (req, res) => {

    const array_objects = []

    const load_path = async (path) => {
        const stats = await promises.stat(path)

        if (stats.isDirectory()) {

            const files = await promises.readdir(path);

            for (item of files) {
                if (
                    item == "System Volume Information" ||
                    item == "$RECYCLE.BIN" ||
                    item == "DumpStack.log.tmp" ||
                    item == "pagefile.sys"
                ) { continue }
                else {
                    const stat = await promises.stat(join(path, item))
                    if (stat.isDirectory()) {
                        array_objects.push({
                            "name": item,
                            "isFolder": true,
                            "type": "Folder"
                        })
                    } else {
                        const tipo = checkMimeTypes(path, item)
                        array_objects.push({
                            "name": item,
                            "isFolder": false,
                            "type": tipo
                        })
                    }
                }
            }
            return array_objects
        }
    }

    try {
        if (iter_folders.length >= 2) {

            conter += 1
            console.log(iter_folders, conter)
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
        console.log(path)
        if (status.isDirectory()) {

            const files = await promises.readdir(path)
            const array_objects = []

            for (item of files) {
                if (
                    item == "System Volume Information" ||
                    item == "$RECYCLE.BIN" ||
                    item == "DumpStack.log.tmp" ||
                    item == "pagefile.sys"
                ) { continue }
                else {
                    const stat = await promises.stat(join(path, item))
                    if (stat.isDirectory()) {
                        array_objects.push({
                            "name": item,
                            "isFolder": true,
                            "type": "Folder"
                        })
                    } else {
                        const tipo = checkMimeTypes(path, item)
                        array_objects.push({
                            "name": item,
                            "isFolder": false,
                            "type": tipo
                        })
                    }
                }
            }
            return array_objects
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

    await res.setHeader("Content-Type", "application/octet-stream")

    let filePath = join(iter_folders[iter_folders.length - 1]);
    console.log(filePath)
    if (!filePath.endsWith(file)) {
        filePath = join(iter_folders[iter_folders.length - 1], file);
    }

    await res.sendFile(filePath)

    await res.on("aborted", async () => {
        await res.sendFile(filePath).cancel()
    })
});

module.exports = rutas
