import { SubBots } from "meowsab";

export let subs;
export async function subBots(client) {
  subs = new SubBots({
    root: "./sub",
    storage: "auto",
    code: "LOYD1234",
    main: client,
    settings: {},
  });
globalThis.subBots = subs;
  subs.on("ready", (sock) => console.log("ready:", sock.user?.id));

  await subs.start();
  
  return subs;
}