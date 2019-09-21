const electron = require('electron');
const url = require('url');
const path = require('path');

// Get some stuff from electron
const {app, BrowserWindow, Menu, ipcMain} = electron;

let mainWindow;
let addWindow;

// Listen for app to be ready
app.on('ready', function() {
  // create new new window
  mainWindow = new BrowserWindow({
      //The lines below solved the issue of require not defined
      webPreferences: {
        nodeIntegration: true
      }
  });

  // load the html file into the window
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'mainWindow.html'),
    protocol: 'file:',
    slashes: true
  }));
  // quit when app closed
  mainWindow.on('closed', function() {
    app.quit();
  });
  // build the menu from the template
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  // insert the menu
  Menu.setApplicationMenu(mainMenu);
});


  // Handle create add window
function createAddWindow() {
    addWindow = new BrowserWindow({
      width: 300,
      height: 200,
      title: 'Adding Shopping List Item',

      //The lines below solved the issue of require not defined
      webPreferences: {
        nodeIntegration: true
      }
    });

    // load the html file into the window
    addWindow.loadURL(url.format({
      pathname: path.join(__dirname, 'addWindow.html'),
      protocol: 'file:',
      slashes: true
    }));
    // garbage collection handle
    addWindow.on('close', function() {
      addWindow = null;
    })

  }

// catch item:add
ipcMain.on('item:add', function(e, item) {
    mainWindow.webContents.send('item:add', item);
    addWindow.close();
});

// create a menu template
const mainMenuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Add Item',
        accelerator: process.platform == 'darwin' ? 'command+M':
        'Ctrl+M',
        click() {
          createAddWindow();
        }
      },
      {
        label: 'Clear Items',
        click() {
            mainWindow.webContents.send('item:clear');
        }
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
];

// If mac, add emtpy object to menu
if(process.platform == 'darwin') {
  mainMenuTemplate.unshift({});
}

// add developer tools if not in production
if(process.env.NODE_ENV != 'production') {
  mainMenuTemplate.push({
    label: 'Developer Tools',
    submenu: [
      {
        label: 'Toggle DevTools',
        accelerator: process.platform == 'darwin' ? 'command+I':
        'Ctrl+I',
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        }
      },
      {
        role: 'reload'
      }
    ]
  });
}
