const electron = require("electron");

electron.contextBridge.exposeInMainWorld("electron", {
  subscribeStatistics: (callback: (statictics: any) => void) => {
    electron.ipcRenderer.on("statistics", (_, stats) => {
      callback(stats);
    });
    callback({});
  },
  getStaticData: () => console.log("static"),
});
