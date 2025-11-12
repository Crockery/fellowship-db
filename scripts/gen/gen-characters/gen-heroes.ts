import { HeroMetaDataRaw } from "../shared/types";
import { HeroMetaData } from "../shared/types/hero/hero-generated-data-types";
import fs from "fs-extra";

const genHeroMetaData = async (
  meta_data_path: string
): Promise<HeroMetaData | null> => {
  try {
    const json: HeroMetaDataRaw[] = await fs.readJson(meta_data_path);

    if (!json || !json[0]) {
      throw new Error("No JSON");
    }

    const hero_info_raw = json[0];

    const R = hero_info_raw.Properties.ClassColor.R;
    const G = hero_info_raw.Properties.ClassColor.G;
    const B = hero_info_raw.Properties.ClassColor.B;
    const A = hero_info_raw.Properties.ClassColor.A;

    return {
      class_color: {
        R,
        G,
        B,
        A,
        hex: `#${hero_info_raw.Properties.ClassColor.Hex}`,
        rgba: `rgba(${R}, ${G}, ${B}, ${A})`,
        rgb: `rgb(${R}, ${G}, ${B}, ${A})`,
      },
      name: hero_info_raw.Properties.HeroName.Key,
      title: hero_info_raw.Properties.HeroTitle.Key,
      description: hero_info_raw.Properties.HeroDescription.Key,
      biography: hero_info_raw.Properties.Biography.Key,
      difficulty: hero_info_raw.Properties.OverallDifficulty,
    };
  } catch (error) {
    console.log(`Encountered error loading hero json at ${meta_data_path}`);
    return null;
  }
};

const getHeroData = async (data_path: string) => {
  const json: HeroMetaDataRaw[] = await fs.readJson(data_path);
};

const getHeroDirectoryKeys = async () => {
  const paths = await fs.readdir(
    `${process.env.FMODEL_OUTPUT}\\Content\\characters\\Heroes`,
    { withFileTypes: true }
  );

  return paths
    .filter((path) => path.isDirectory())
    .map((dirent) => dirent.name);
};

const getHeroDataPaths = async (hero_keys: string[]) => {
  const hero_data_paths: {
    data_file: string;
    metadata_file: string;
    hero_key: string;
  }[] = [];

  const getDataPaths = async (hero_key: string) => {
    const paths = await fs.readdir(
      `${process.env.FMODEL_OUTPUT}\\Content\\characters\\Heroes\\${hero_key}`,
      { withFileTypes: true }
    );

    const files = paths.filter((dirent) => dirent.isFile());

    const data_file = files.find((dirent) =>
      dirent.name.startsWith(`BP_Hero_${hero_key}.json`)
    );
    const metadata_file = files.find(
      (dirent) =>
        dirent.name.startsWith(`DA_${hero_key}MetaData.json`) ||
        dirent.name.startsWith(`DA_${hero_key}_MetaData.json`)
    );

    if (data_file && metadata_file) {
      hero_data_paths.push({
        data_file: `${data_file.parentPath}\\${data_file.name}`,
        metadata_file: `${metadata_file.parentPath}\\${metadata_file.name}`,
        hero_key,
      });
    }
  };

  await Promise.all(hero_keys.map((key) => getDataPaths(key)));

  return hero_data_paths;
};

export const genHeroes = async () => {
  console.group();
  console.log("Generating hero data.");

  const hero_keys = await getHeroDirectoryKeys();

  const hero_paths = await getHeroDataPaths(hero_keys);

  const genHero = async (
    hero: Awaited<ReturnType<typeof getHeroDataPaths>>[number]
  ) => {
    const meta_data = await genHeroMetaData(hero.metadata_file);
  };

  console.log(
    `${hero_paths.length} valid heroes found: ${hero_paths.map((hero) => hero.hero_key).join(", ")}`
  );

  await Promise.all(hero_paths.map((hero_path) => genHero(hero_path)));

  console.log("Done generating heroes.");
  console.groupEnd();
};
