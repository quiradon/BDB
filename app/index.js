const {app, BrowserWindow, shell} = require('electron')

const express = require('./express'); 
let mainWindow;
let path = require('path');
let defaltUrl = 'http://localhost:5000';
app.on('ready', () => {

    mainWindow = new BrowserWindow({
        show: false,
        webPreferences: {
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        },
        center: true,
        closable: true,
        minHeight: 900,
        minWidth: 1000,
        titleBarStyle: "Kraken Book DB",
        titleBarOverlay: true,
        icon: path.join(__dirname, 'icon.png'),
        
        autoHideMenuBar: true,
    });


    mainWindow.webContents.on('will-navigate', function (e, url) {
        if (!url.startsWith(defaltUrl)) {
        e.preventDefault();
        shell.openExternal(url);
        }
    }
    );
      
    mainWindow.once('ready-to-show', () => {
        mainWindow.maximize();
        mainWindow.show();
    });

    mainWindow.setBackgroundColor('#1b1b25')
    mainWindow.loadURL('http://localhost:5000/');
    mainWindow.focus();
});