import osUtils from "os-utils";
import fs from "fs";
import os from "os";
import { BrowserWindow } from "electron";
const POLLING_INTERVAL = 500;
export function pollResources(mainWindow: BrowserWindow) {
  setInterval(async () => {
    const cpuUsage = await getCpuUsage();
    const ramUsage = getRamUsage();
    const storageData = getStorageData();
    const staticData = getStaticData();
    mainWindow.webContents.send("statistics", {cpuUsage, ramUsage, storageData, staticData});

    console.log(`------------------------\nCPU Usage: ${cpuUsage}% \nRam Usage: ${ramUsage}% \nTotal Storage: ${storageData?.total} \nUsed Storage: ${storageData?.usage} \nFree Storage: ${storageData?.free} \nCPU: ${staticData?.cpuModel} \nRAM: ${staticData?.totalMemoryGB} GB \n------------------------\n \n
                   `);
  }, POLLING_INTERVAL);
}

function getCpuUsage() {
  return new Promise((resolve) => {
    osUtils.cpuUsage(resolve);
  });
}
function getRamUsage() {
  return 1 - osUtils.freememPercentage();
}

function getStorageData() {
  const stats = fs.statfsSync(process.platform === "win32" ? "C://" : "/");
  const total = stats.bsize * stats.blocks;
  const free = stats.bsize * stats.bfree;
  const used = total - free;

  return {
    total: `${Math.floor(total / 1_000_000_000)} GB`,
    usage: `${Math.floor(used / 1_000_000_000)} GB`,
    free: `${Math.floor(free / 1_000_000_000)} GB`,
  };
}

function getStaticData() {
  const cpuModel = os.cpus()?.[0]?.model;
  const totalMemoryGB = Math.floor(osUtils.totalmem() / 1024);
  return {
    cpuModel,
    totalMemoryGB,
  };
}
