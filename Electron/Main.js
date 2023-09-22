// main.js

// 控制应用生命周期和创建原生浏览器窗口的模组
const { app, BrowserWindow, ipcMain, Tray, Menu, screen, dialog } = require('electron')

//获取单例锁
const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  app.quit()
} else {
  const { mainWindowIpcStart } = require("./lib/ipcMain")
  const path = require('path')
  //应用运行时的标题栏图标
  const iconPath = path.join(__dirname, '/logo.ico')
  global.appDirname = __dirname;

  app.commandLine.appendSwitch('disable-features', 'OutOfBlinkCors');

  let mainWindow;
  function createWindow () {
    // 创建浏览器窗口
    const win = new BrowserWindow({
      width: 1580,
      height: 888,
      resizable: true,      //允许用户改变窗口大小
      useContentSize: true, //设置 web 页面的尺寸不包含边框
      transparent: false,    //窗口 透明 在Windows上，仅在无边框窗口下起作用
      icon: iconPath,       //应用运行时的标题栏图标
      show: false,          //窗口是否在创建时显示
      webPreferences: {
        webSecurity: false,  //当设置为 false, 它将禁用同源策略 
        nodeIntegration: true,//是否启用Node integration 默认值为 false
        backgroundThrottling: false,   //设置应用在后台正常运行
        nodeIntegration: true,     //设置能在页面使用nodejs的API
        contextIsolation: false,//是否在独立 JavaScript 环境中运行 Electron API和指定的preload 脚本
        webviewTag: true,      //是否启用 <webview> tag标签. 默认值为 false
        preload: path.join(__dirname, './Preload.js')
      },
      // frame: process.env.NODE_ENV === 'development' ? true : false,//创建一个无边框窗口
      frame: false,//创建一个无边框窗口
    })

    // 加载 index.html
    win.loadURL(
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:5173'
        : path.resolve(__dirname, '../dist/index.html')
    );
    // 去掉菜单栏
    win.removeMenu()
    win.on('closed', () => { mainWindow = null; })
    win.on('ready-to-show', () => { win.show() })

    // 打开开发工具
    if (process.env.NODE_ENV === "development") {
      win.webContents.openDevTools()
    }

    return win
  }

  // // 这段程序将会在 Electron 结束初始化
  // // 和创建浏览器窗口的时候调用
  // // 部分 API 在 ready 事件触发后才能使用。
  // app.whenReady().then(() => {
  //   // createWindow()
  //   mainWindow = new createWindow();

  //   app.on('activate', function () {
  //     // 通常在 macOS 上，当点击 dock 中的应用程序图标时，如果没有其他
  //     // 打开的窗口，那么程序会重新创建一个窗口。
  //     if (BrowserWindow.getAllWindows().length === 0) {
  //       // createWindow()
  //       mainWindow = new createWindow();
  //     }
  //   })

  //   // mainWindowIpcStart(mainWindow)
  // })

  // // 除了 macOS 外，当所有窗口都被关闭的时候退出程序。 因此，通常对程序和它们在
  // // 任务栏上的图标来说，应当保持活跃状态，直到用户使用 Cmd + Q 退出。
  // app.on('window-all-closed', function () {
  //   if (process.platform !== 'darwin') app.quit()
  // })


  app.on("ready", function () {
    mainWindow = new createWindow();
    mainWindowIpcStart(mainWindow)

    // 系统托盘
    //实例化一个tray对象，构造函数的唯一参数是需要在托盘中显示的图标url 
    tray = new Tray(iconPath)
    //鼠标移到托盘中应用程序的图标上时，显示的文本
    tray.setToolTip('WallpaperZz')
    //点击图标的响应事件，这里是切换主窗口的显示和隐藏
    tray.on('click', () => {
      if (mainWindow.isVisible()) {
        mainWindow.hide()
      } else {
        mainWindow.show()
      }
    })
    //右键点击图标时，出现的菜单，通过Menu.buildFromTemplate定制，这里只包含退出程序的选项。
    tray.on('right-click', () => {
      const menuConfig = Menu.buildFromTemplate([
        {
          label: '退出',
          click: () => app.quit()
        }
      ])
      tray.popUpContextMenu(menuConfig)
    })
  })

  // 当运行第二个实例时,将会聚焦到myWindow这个窗口
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })

  app.on('quit', () => {
    app.releaseSingleInstanceLock();//释放所有的单例锁
  });

  // 在这个文件中，你可以包含应用程序剩余的所有部分的代码，
  // 也可以拆分成几个文件，然后用 require 导入。


}