const { networkInterfaces } = require("os")
const { exec } = require("child_process")
const { toFile } = require("qrcode")
const fs = require("fs")

async function create_new_Qr_Code(ip, port, real_path_qrcode) {
    if (fs.existsSync(real_path_qrcode)) {
        toFile(real_path_qrcode, `http://${ip}:${port}`, {
            color: {
                light: "#000",
                dark: "#F57006"
            },
            errorCorrectionLevel: "H",
            margin: 5,
            version: 7,
            scale: 8
        }, (error) => {
            if (error) throw error;
            exec('msg * Qr-Code Creado :D\nPrecione donde mismo de nuevo para verlo')
        })
    } else {
        toFile(real_path_qrcode, `http://${ip}:${port}`, {
            color: {
                light: "#000",
                dark: "#F57006"
            },
            errorCorrectionLevel: "H",
            margin: 5,
            version: 7,
            scale: 8
        }, (error) => {
            if (error) throw error;
            exec('msg * Qr-Code Creado :D\nPrecione donde mismo de nuevo para verlo')
        })
    }
}

const ip_wifi = async (path_qr) => {
    const ifaces = networkInterfaces()

    try {
        const wifi = ifaces["Wi-Fi"]
        const wifi_2 = wifi[1]

        const wifi_ip = wifi_2["address"]

        create_new_Qr_Code(wifi_ip, 8585, path_qr)

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