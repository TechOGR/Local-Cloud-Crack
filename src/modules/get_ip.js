const { networkInterfaces } = require("os")
const { exec } = require("child_process")
const { toFile } = require("qrcode")
const { join } = require("path")

const real_path_qrcode = `C:/Users/${process.env.USERNAME}/AppData/Local/Qr-Code.png`

const create_qr = async (ip, port, main_path) => {
    try {
        toFile(join(main_path, "statci", "img", "QR.png")), `${ip}:${port}`, {
            color: {
                dark: "#F57006",
                light: "#000"
            },
            errorCorrectionLevel: "H",
            margin: 4,
            version: 7,
            scale: 8,
            type: "png"
        }, (err) => {
            if (err) throw err;
            console.log("QR-Code Creado");
        }
    } catch (error) {
        console.log(error)
    }
}

const ip_wifi = async (path_main) => {
    const ifaces = networkInterfaces()

    try {
        const wifi = ifaces["Wi-Fi"]
        const wifi_2 = wifi[1]

        const wifi_ip = wifi_2["address"]

        create_qr(wifi_ip, 8585, path_main)
    } catch (err) {
        exec("msg * No Tienes Wifi :(")
    }


}

const ip_ethernet = async () => {
    const comando = "msg * Kelvis Mamauevo"

    exec(comando, (error, stdout, stderr) => {
        if (error) {
            console.log(error)
        }
        console.log(stdout)
    })
}

module.exports = {
    ip_wifi,
    ip_ethernet
}