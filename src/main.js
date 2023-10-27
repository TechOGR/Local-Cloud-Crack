const { app, Menu, BrowserWindow } = require("electron")
const { join } = require("path");
const { ip_wifi, ip_ethernet } = require("./modules/get_ip")
const {homedir} = require("os")
const express = require("express")
const rutas = require("./routes/routes.js")
const user_agent = require("express-useragent")
const favicon = require("serve-favicon")
const port = 8585
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
const real_path_qrcode = join(homedir(), 'AppData', 'Local', 'Qr-Code.png')
const createWindow = () => {

    const win = new BrowserWindow({
        width: 700,
        height: 800,
        maxWidth: 1200,
        maxHeight: 1000,
        minHeight: 600,
        minWidth: 500,
        resizable: true,
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
                        try {
                            await win.loadURL(`http://localhost:${port}/cloud`)
                        } catch (err) {
                            console.log("Error en la URL")
                        }
                    }
                },
                {
                    label: "Set Path",
                    click: async () => {
                        const esto = new BrowserWindow({
                            width: 300,
                            height: 120,
                            title: "Write Path Here",
                            autoHideMenuBar: true,
                            titleBarStyle: "hiddenInset",
                            resizable: false,
                            icon: path_icon_app
                        })
                        await esto.loadURL(`http://localhost:${port}/set_dir_face`)
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
                            await ip_wifi(real_path_qrcode).then(data => {
                                check_create_qr = data
                                console.log(data)
                            }).catch(err => {
                                console.log(err)
                            })

                        } else {
                            const wifi_qr = new BrowserWindow({
                                width: 500,
                                height: 500,
                                title: "Qr-Code for Scan",
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