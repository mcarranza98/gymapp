const Database = require('better-sqlite3');
const path = require('path');
const axios = require('axios');
const { app, BrowserWindow } = require('electron');
const pie = require('puppeteer-in-electron');
const puppeteer = require('puppeteer-core');
//const server = require('../app');


async function crearConceptos() {
  const db_questions = new Database(path.resolve(__dirname, '..', 'database', 'gimnasio.db'));
  let command = db_questions.prepare('SELECT * FROM conceptos');
  const orders = command.all();

  if (orders.length == 0) {
    console.log('hola');

    await axios.post('http://localhost:3000/gimnasio/agregar/concepto');
  }
}

const createApp = async () => {

  const { browser, window } = await createMainWindow(app);
  //crearConceptos()

};

const createMainWindow = async (app) => {

  await pie.initialize(app);

  const browser = await pie.connect(app, puppeteer);

  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
    },
    useContentSize: true,
  });

  mainWindow.maximize();
  mainWindow.loadURL('http://localhost:3000');
  mainWindow.show();
  mainWindow.on('closed', () => {
    app.quit();
  });

  return { browser: browser, window: mainWindow };

}

createApp();

//app.on('ready', createWindow);