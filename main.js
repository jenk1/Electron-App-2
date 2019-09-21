const electron = require('electron');
const url = require('url');
const path = require('path');

// Get some stuff from electron
const {app, BrowserWindow, Menu} = electron;

let mainWindow;

// Listen for app to be ready
app.on('ready', function() {
  // create new new window
  mainWindow = new BrowserWindow({});

  // load the html file into the window
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'mainWindow.html'),
    protocol: 'file:',
    slashes: true
  }));

  // build the menu from the template
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  // insert the menu
  Menu.setApplicationMenu(mainMenu);
});

// create a menu template
const mainMenuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Add Item'
        // stopped video on 17:17
      },
      {
        label: 'Clear Items'
      },
      {
        label: 'Quit',
        accelerator: process.platform == 'darwin' ? 'command+Q':
        'Ctrl+Q',
        click() {
          app.quit();
        }
      }
    ]
  }
]
