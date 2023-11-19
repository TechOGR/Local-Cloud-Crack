const { Router } = require("express")
const { join, extname, basename } = require("path")
const { exec, execSync } = require("child_process")
const { promises } = require("fs")
const { shell } = require("electron")
const { json } = require("express")
const multer = require("multer")
const fs = require("fs")
const mimeType = require("mime-types")

const { file_log } = require("../modules/file_log.js")
const { checkMimeTypes } = require("../modules/mimeTypes.js")

const rutas = new Router();

rutas.use(json())

let name_file = "";
let main_path = ""

const all_links = {
    youtube: "https://www.youtube.com/@OnelCrack",
    facebook: "https://www.facebook.com/profile.php?id=100092376152191",
    twitter: "https://twitter.com/Onel_Crack?t=NFwmb3M7Gb8dr-B9oUubaw&s=09",
    instagram: "https://www.instagram.com/onel_crack/",
    github: "https://github.com/TechOGR"
}

const save_storage = multer.diskStorage({
    destination: function (req, file, cb) {

        const main_path = file_log()
        const subF = "Uploads"
        const folders = {
            otros: join(main_path, subF, "Otros"),
            compactados: join(main_path, subF, "Compactados"),
            programas: join(main_path, subF, "Programas"),
            videos: join(main_path, subF, "Videos"),
            audio: join(main_path, subF, "Audio"),
            apk: join(main_path, subF, "APK"),
            pdf: join(main_path, subF, "PDF"),
            img: join(main_path, subF, "Imagenes"),
            dir: join(main_path, subF)
        }

        if (
            file.mimetype.endsWith("vbox-extpack") ||
            file.mimetype.endsWith("octet-stream") ||
            file.mimetype.endsWith("x-tar")
        ) {
            cb(null, folders.otros)
        } else if (file.mimetype.startsWith('video')
        ) {
            cb(null, folders.videos)
        } else if (file.mimetype.startsWith('image')
        ) {
            cb(null, folders.img)
        } else if (file.mimetype.startsWith('audio')
        ) {
            cb(null, folders.audio)
        } else if (
            file.mimetype.endsWith("vnd.android.package-archive") ||
            file.mimetype.endsWith("vnd.android.package-archive")
        ) {
            cb(null, folders.apk)
        } else if (
            file.mimetype.endsWith("x-msdownload") ||
            file.mimetype.endsWith("x-msdos-program")
        ) {
            cb(null, folders.programas)
        } else if (
            file.mimetype.endsWith("zip") ||
            file.mimetype.endsWith("x-tar") ||
            file.mimetype.endsWith("x-7z-compressed") ||
            file.mimetype.endsWith("rar")
        ) {
            cb(null, folders.compactados)
        } else if (
            file.mimetype.endsWith("pdf")
        ) {
            cb(null, folders.pdf)
        } else {
            cb(null, folders.dir)
        }
    },
    filename: function (req, file, cb) {
        name_file += file.originalname + "\n"

        let copia = {
            name: [],
            status: []
        }
        let last_exist = []


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
                            copia.name.push(file.originalname)
                            copia.status.push(true)
                            last_exist.push(file.originalname)
                        } else {
                            copia.name.push(file.originalname)
                            copia.status.push(false)
                        }
                    }
                }
                for (let i = 0; i < copia.name.length; i++) {
                    if (copia.status[i] === false) {
                        cb(null, copia.name[i])
                    }
                }
            } catch (err) {
                console.log(err)
            }
        }

        const valueLog = file_log()
        const main_dir = join(valueLog, "Uploads")

        load_dir(main_dir).catch(err => console.log(err))
    },
});

const up = multer({
    storage: save_storage,
    limits: {
        fileSize: 1024 * 1024 * 1024 * 1024 * 50
    }
});


let ListFilesGet = {}


rutas.post("/files_exists", async (req, res) => {
    const files = req.body.files
    const keys = Object.keys(files)
    const values = Object.values(files)
    const path = join(file_log(), "Uploads")
    const folders = {
        otros: join(path, "Otros"),
        compactados: join(path, "Compactados"),
        programas: join(path, "Programas"),
        videos: join(path, "Videos"),
        audio: join(path, "Audio"),
        apk: join(path, "APK"),
        pdf: join(path, "PDF"),
        img: join(path, "Imagenes"),
        dir: join(path)
    }

    const FullItemsPath = []
    for (let i = 0; i < keys.length; i++) {
        if (values[i].startsWith("audio")) {
            FullItemsPath.push(join(folders.audio, keys[i]))
        } else if (values[i].startsWith("image")) {
            FullItemsPath.push(join(folders.img, keys[i]))
        } else if (values[i].startsWith("video")) {
            FullItemsPath.push(join(folders.videos, keys[i]))
        } else if (
            values[i].endsWith("vbox-extpack") ||
            values[i].endsWith("octet-stream") ||
            values[i].endsWith("x-tar")
        ) {
            FullItemsPath.push(join(folders.otros, keys[i]))
        } else if (
            values[i].endsWith("vnd.android.package-archive") ||
            values[i].endsWith("vnd.android.package-archive")
        ) {
            FullItemsPath.push(join(folders.apk, keys[i]))
        } else if (
            values[i].endsWith("x-msdownload") ||
            values[i].endsWith("x-msdos-program")
        ) {
            FullItemsPath.push(join(folders.programas, keys[i]))
        } else if (
            values[i].endsWith("zip") ||
            values[i].endsWith("x-tar") ||
            values[i].endsWith("x-7z-compressed") ||
            values[i].endsWith("rar")
        ) {
            FullItemsPath.push(join(folders.compactados, keys[i]))
        } else if (
            values[i].endsWith("pdf")
        ) {
            FullItemsPath.push(join(folders.pdf, keys[i]))
        }
    }

    const Exists = {}
    for (f of FullItemsPath) {
        if (fs.existsSync(f)) {
            Exists[f] = true
        } else {
            Exists[f] = false
        }
    }


    const ValueExists = Object.values(Exists)
    const Names = {}
    for (let i = 0; i < FullItemsPath.length; i++) {
        Names[basename(FullItemsPath[i])] = ValueExists[i]
    }

    ListFilesGet = Names
    console.log(Names)

    res.json({ values: Names })

})

rutas.get("/files_exists", async (req, res) => {
    console.log(ListFilesGet)
    await res.json(ListFilesGet)
})

rutas.get("/", async (req, res) => {
    await res.render("index.ejs", { title: "Up_LocalCloud_Down" });
});


rutas.post("/upload", up.array("files"), (req, res) => {
    // console.log(`Copia de: [ ${name_file} ] Terminado`);
})
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

function tryFolder(path) {

    const folderPath = join(path, "Uploads");
    console.log(folderPath)

    const subfolders = ['APK', 'Audio', 'Compactados', 'Imagenes', 'Otros', 'PDF', 'Programas', 'Videos'];

    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);

        subfolders.forEach((subfolder) => {
            const subfolderPath = join(folderPath, subfolder);
            fs.mkdirSync(subfolderPath);
        });

        console.log('La carpeta "Uploads" y sus subcarpetas han sido creadas.');
    } else {
        try {

            const existingSubfolders = fs.readdirSync(folderPath);

            const missingSubfolders = subfolders.filter(
                (subfolder) => !existingSubfolders.includes(subfolder)
            );

            if (missingSubfolders.length === 0) {
                console.log('La carpeta "Uploads" y sus subcarpetas ya existen.');
            } else {
                missingSubfolders.forEach((subfolder) => {
                    const subfolderPath = join(folderPath, subfolder);
                    try {
                        fs.mkdir(subfolderPath);
                    } catch (err) {
                        console.log("Ya existe la carpeta")
                    }
                });

                console.log('Se han creado las subcarpetas que faltaban.');
            }
        } catch (err) {
            console.log(err)
        }

    }
}

rutas.get("/set_dir_face", async (req, res) => {
    await res.render("setPath.ejs");
})
rutas.post("/set_dir", async (req, res) => {
    const path = req.body.path
    try {
        const stat = await promises.stat(path)
        if (fs.existsSync(path) && stat.isDirectory()) {
            file_log(path)
            tryFolder(path)
            main_path = path
            exec(`msg * se ha establecido correctamente el Path`)
        } else {
            exec(`msg * Que bolá contigo, pon la ruta de una Carpeta`)
        }
    } catch (err) {
        exec(`msg * Que bolá contigo, pon la ruta de una Carpeta`)
    }


})
let iter_folders = [main_path]
let last_folders = ""
let conter = 0

rutas.get("/cloud", async (req, res) => {

    const array_objects = []

    const load_path = async (path) => {
        const stats = await promises.stat(path).catch(err => console.log("ERROR"))
        const status = () => {
            try {
                stats.isDirectory()
                return true
            } catch (err) {
                return false
            }
        }
        if (status()) {

            const files = await promises.readdir(path);

            for (item of files) {
                try {
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
                } catch (err) {
                    // console.log(err)
                }
            }
            return array_objects
        }
    }
    const main_path = file_log()

    const object_files = await load_path(main_path)
    if (object_files === undefined) {
        exec("msg * Debes establecer una carpeta en Opciones-SetPath")
    } else {
        last_folders = ""
        iter_folders = [main_path]

        await res.render("cloud.ejs", {
            title: "Local-Cloud-Crack",
            list_files: object_files
        })
    }
})

let folder_params = ""

rutas.get("/back", async (req, res) => {

    const array_objects = []

    const load_path = async (path) => {
        const stats = await promises.stat(path)

        if (stats.isDirectory()) {

            const files = await promises.readdir(path);

            for (item of files) {
                try {

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

                } catch (err) {
                    // console.log(err)
                }
            }
            return array_objects
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
    const main_path = file_log()
    folder_params = req.params.folder

    const load_path = async (path) => {

        const status = await promises.stat(path)

        if (status.isDirectory()) {

            const files = await promises.readdir(path)
            const array_objects = []

            for (item of files) {

                try {

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

                } catch (err) {
                    // console.log(err)
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

    if (!filePath.endsWith(file)) {
        filePath = join(iter_folders[iter_folders.length - 1], file);
    }

    await res.sendFile(filePath)

    await res.on("aborted", async () => {
        await res.sendFile(filePath).cancel()
    })
});

module.exports = rutas