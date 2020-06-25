const electron = require('electron');
const uuid = require("uuid").v4;
const fs = require('fs');
uuid();

const {
    app,
    BrowserWindow,
    Menu,
    ipcMain
} = electron;

let mainWindow;
let createWindow;

let allAppointments = [];

fs.readFile("dataSewa.json", (err, dataRent) => {
    if(!err){
        const oldAppointment = JSON.parse(dataRent);
        allAppointments = oldAppointment; 
    }
});

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        },
        title: 'Rental Mr.Bulu'
    });
    mainWindow.loadURL(`file://${__dirname}/index.html`);
    mainWindow.on('closed', () => {

        const dataRent = JSON.stringify(allAppointments);
        fs.writeFileSync("dataSewa.json", dataRent);


        app.quit();
        mainWindow = null;
    });
    const mainMenu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(mainMenu);
});

const listWindowCreator = ()=>{
    listWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        },
        width: 1000,
        height: 600,
        title: "Data Rental"
    });
    listWindow.setMenu(null);
    listWindow.loadURL(`file://${__dirname}/list.html`);
    listWindow.on("closed", ()=> (listWindow = null));
};

ipcMain.on("appointment:create", (event, appointment) => {
    appointment["id"] = uuid();
    appointment["done"] = 0;
    allAppointments.push(appointment);
    console.log(allAppointments);
});

ipcMain.on("appointment:request:list", event => {
    listWindow.webContents.send('appointment:response:list', allAppointments);
});

ipcMain.on("appointment:done", (event, id) => {
    console.log("here3");
});

const menuTemplate = [{
    label: "File",
    submenu: [
        {
            label: "Data Rental",
            click() {
                listWindowCreator();
            }
        },
        {
            label: "Quit",
            accelerator: process.platform === "darwin" ? "Command+Q" : 
            "Ctrl + Q",
            click() {
                app.quit();
            }
        }
    ]
},
{
    label: "View",
    submenu: [{ role: "reload" }, { role: "toogledevtools" }]
}
]