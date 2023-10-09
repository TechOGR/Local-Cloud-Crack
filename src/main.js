const { app, BrowserWindow } = require("electron")
const { Menu } = require("electron")
const { join } = require("path")
const { ip_wifi, ip_ethernet } = require("./modules/get_ip")
const express = require("express")
const url = require("url")
const rutas = require("./routes/routes.js")
const user_agent = require("express-useragent")
const favicon = require("serve-favicon")

const port = 8000

app_exp = express()
const path_favicon = join(__dirname, "static", "img", "favicon.ico")
app_exp.setMaxListeners(20)
app_exp.set("view engine", "ejs")
app_exp.set("views", join(__dirname, "views"))
app_exp.use(express.static(join(__dirname, "static", "css")))
app_exp.use(express.static(join(__dirname, "static", "js")))
app_exp.use(express.static(join(__dirname, "static", "img")))
app_exp.use(express.static(join(__dirname, "routes")))
app_exp.use(favicon(path_favicon))
app_exp.use(user_agent.express())
app_exp.use(rutas)


const path_icon_app = join(__dirname, "static", "img", "Icon.png")
// const path_qr_code = join(__dirname, "static", "img", "QR.png") // Dev Qr-Code
const real_path_qrcode = join('C:', 'Users', `${process.env.USERNAME}`, 'AppData', 'Local', 'Qr-Code.png')
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
    let check_create_qr = false
    const menuTemplate = [
        {
            label: "Opciones",
            submenu: [
                {
                    label: "Upload",
                    click: async () => {
                        await win.loadURL(`http://localhost:${port}`)
                    }
                },
                {
                    label: "Download",
                    click: async () => {
                        await win.loadURL(`http://localhost:${port}/cloud`)
                    }
                },
                {
                    label: "Set Path",
                    click: async () => {
                        new BrowserWindow({
                            width: 300,
                            height: 120,
                            title: "Write Path Here",
                            autoHideMenuBar: true,
                            titleBarStyle: "hiddenInset",
                            resizable: false,
                            icon: path_icon_app
                        })
                    }
                }
            ]
        },
        {
            label: "   "
        },
        {
            label: "Qr-Code",
            submenu: [
                {
                    label: "Qr-Code Wifi",
                    click: async () => {
                        if (!check_create_qr) {
                            await ip_wifi(real_path_qrcode).catch(err => {
                                console.log("Algo")
                            })
                            check_create_qr = 1

                        } else {
                            const wifi_qr = new BrowserWindow({
                                width: 500,
                                height: 500,
                                resizable: false,
                                autoHideMenuBar: true,
                                titleBarStyle: "hiddenInset",
                                icon: path_icon_app
                            })
                            wifi_qr.loadFile(real_path_qrcode)
                        }
                    }
                },
                // Me quedé Aquí
                {
                    label: "Qr-Code Ethernet",
                    click: async () => {
                        // const ethernet_qr = new BrowserWindow({
                        //     width: 500,
                        //     height: 500,
                        //     resizable: false,
                        //     autoHideMenuBar: true,
                        //     titleBarStyle: "hiddenInset",
                        //     icon: path_icon_app
                        // })
                        await ip_ethernet()
                        // await ethernet_qr.loadFile(path_qr_code)
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

app.whenReady().then(async () => {
    createWindow()
})