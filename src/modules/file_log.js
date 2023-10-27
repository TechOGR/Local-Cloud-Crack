const {
    homedir
} = require("os");
const {
    writeFile,
    existsSync,
    readFileSync
} = require("fs");
const { join } = require("path");
const fs = require("fs")

const fileLog = join(homedir(), "log.txt");

const checkFile = (dir = null) => {
    const exists = existsSync(fileLog)

    if (!exists) {
        try {
            writeFile(fileLog, dir, "utf8", (err) => {
                if (err) { console.log("Error Creando el archivo") }
                console.log("Creado Exitosamente")
            })
            return false
        } catch (err) {
            console.log("ERROR")
        }
    } else {
        if (dir == null) {
            let data = readFileSync(fileLog, { encoding: "utf-8" }, (err, data) => {
                if (err) { console.log("Error leyendo info de archivo") }
                return data
            })
            return data
        } else {
            writeFile(fileLog, dir, "utf8", (err) => {
                if (err) { console.log("Error Creando el archivo") }
                console.log("Remplazado Exitosamente")
            })
        }
    }
}

module.exports = {
    file_log: checkFile
}