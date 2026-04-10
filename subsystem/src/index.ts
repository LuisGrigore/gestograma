import { startApp } from "./app";

let startedApp: boolean = false;

async function main() {
  if (startedApp) return;
  try {
    startedApp = true;
    await startApp();
  } catch (err) {
    console.error(err);
  }
}
main();
