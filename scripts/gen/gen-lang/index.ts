import fs from "fs-extra";

const copyLocaleJson = async (key: string, root: string, dest: string) => {
  const base_json = await fs.readJson(`${root}\\${key}\\Game.json`);

  if (base_json && base_json[""]) {
    const actual_json = base_json[""];

    await fs.ensureDir(`${dest}\\${key}`);

    await fs.writeFile(
      `${dest}\\${key}\\${key}.json`,
      JSON.stringify(actual_json, null, 2)
    );
  }
};

export const genLang = async () => {
  const root = `${process.env.FMODEL_OUTPUT}\\Content\\Localization\\Game`;

  const rootJson = await fs.readJson(`${root}\\Game.json`);

  let keys: string[] = [];

  if (rootJson && rootJson["CompiledCultures"]) {
    keys = rootJson["CompiledCultures"];
  }

  const dest = ".\\src\\localization";

  await fs.ensureDir(`${dest}\\locales`);

  if (keys.length) {
    await Promise.all(
      keys.map((key) => copyLocaleJson(key, root, `${dest}\\locales`))
    );

    await fs.writeFile(
      `${dest}\\keys.ts`,
      `export const keys = [${keys.map((key) => `"${key}"`)}];`
    );
  }
};
