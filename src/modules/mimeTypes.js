const mimeType = require("mime-types")
const { join, extname } = require("path")

const checkMimeTypes = (path = null, item = null) => {
    let tipo = "file"
    const mime_type = mimeType.lookup(join(path, item));
    const extension = extname(join(path, item))

    const isFalse = (extension) => {

        if (extension == ".py") {
            tipo = "python"
        } else if (extension == ".msi") {
            tipo = "msi-file"
        } else if (extension == ".dll") {
            tipo = "dll"
        } else if (extension == ".jpg") {
            tipo = "jpg"
        } else if (extension == ".txt") {
            tipo = "txt"
        } else if (extension == ".java") {
            tipo = "java"
        } else if (extension == ".html") {
            tipo = "html"
        } else {
            tipo = "files"
        }
    }

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
            } else if (mime_type.endsWith("css")) {
                tipo = "css"
            } else if (mime_type.startsWith('image') && extension != ".jpg") {
                tipo = "image"
            } else if (mime_type.startsWith('audio')) {
                tipo = "music"
            } else if (
                mime_type.endsWith("vnd.android.package-archive") ||
                mime_type.endsWith("vnd.android.package-archive")
            ) {
                tipo = "apk"
            } else if (
                mime_type.startsWith("text") &&
                extension != ".txt" &&
                extension != ".java" &&
                extension != ".html" &&
                extension != ".css"
            ) {
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
                isFalse(extension)
            }
        } else {
            tipo = "files"
            isFalse(extension)
        }
        return tipo
    } catch (err) {
        console.log(err)
    }
}

module.exports = {
    checkMimeTypes
}