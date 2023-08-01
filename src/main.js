const { app, BrowserWindow } = require("electron")
const { dialog, Menu, ipcMain } = require("electron")
const { join } = require("path")
const express = require("express")
const rutas = require("./routes/routes.js")
const os = require("os")
const qr = require("qrcode")
const user_agent = require("express-useragent")

const port = 8585

const ifaces = os.networkInterfaces();

let wifi = ifaces["Wi-Fi"]
let wifi_2 = wifi[1]

const static_ip = wifi_2["address"]

qr.toFile(join(__dirname, "static", "img", "QR.png"), `${static_ip}:${port}`, {
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
})

app_exp = express()

app_exp.setMaxListeners(20)
app_exp.set("view engine", "ejs")
app_exp.set("views", join(__dirname, "views"))
app_exp.use(express.static(join(__dirname, "static", "css")))
app_exp.use(express.static(join(__dirname, "static", "js")))
app_exp.use(express.static(join(__dirname, "static", "img")))
app_exp.use(express.static(join(__dirname, "routes")))
app_exp.use(user_agent.express())
app_exp.use(rutas)

const path_icon_app = join(__dirname, "static", "img", "Icon.png")
const path_qr_code = join(__dirname, "static", "img", "QR.png")
const createWindow = () => {

    const win = new BrowserWindow({
        width: 700,
        height: 800,
        resizable: false,
        title: "Upload Files",
        titleBarStyle: "default",
        autoHideMenuBar: false,
        icon: path_icon_app
    })

    win.loadURL(`http://localhost:${port}`)

    const menuTemplate = [
        {
            label: "Opciones",
            submenu: [
                {
                    label: "Mostrar QR-Code",
                    click: async () => {
                        const window_qr = new BrowserWindow({
                            width: 500,
                            height: 500,
                            resizable: false,
                            autoHideMenuBar: true,
                            titleBarStyle: "hiddenInset",
                            icon: path_icon_app
                        })
                        window_qr.loadFile(path_qr_code)
                    }
                }
            ]
        }
    ]
    const menuBar = Menu.buildFromTemplate(menuTemplate)
    Menu.setApplicationMenu(menuBar)
}

app_exp.listen(port, () => {
    console.log(`Server on port: ${port}`)
})
app.setMaxListeners(20)
app.whenReady().then(async () => {
    createWindow()
})