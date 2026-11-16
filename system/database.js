import { existsSync, readFileSync, writeFileSync } from "fs";

if (!existsSync("./system/database.json")) {
  writeFileSync("./system/database.json", JSON.stringify({}, null, 2));
}

global.db = JSON.parse(readFileSync("./system/database.json", "utf8"));

global.saveDB = () => {
  writeFileSync("./system/database.json", JSON.stringify(global.db, null, 2));
};
