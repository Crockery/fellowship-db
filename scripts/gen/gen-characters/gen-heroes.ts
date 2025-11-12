import {
  HeroMetaDataRaw,
  HeroMetaData,
  HeroData,
  HeroDataRaw,
  Hero,
} from "../shared/types";
import fs from "fs-extra";
import { FellowshipBlueprint } from "../shared/types/shared";

// TODO: Add Talents
// name, id, cost, row, slot

const getHeroMetaData = async (
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
      },
      name: {
        key: hero_info_raw.Properties.HeroName.Key,
        default: hero_info_raw.Properties.HeroName.SourceString,
      },
      title: {
        key: hero_info_raw.Properties.HeroTitle.Key,
        default: hero_info_raw.Properties.HeroTitle.SourceString,
      },
      description: {
        key: hero_info_raw.Properties.HeroDescription.Key,
        default: hero_info_raw.Properties.HeroDescription.SourceString,
      },
      biography: {
        key: hero_info_raw.Properties.Biography.Key,
        default: hero_info_raw.Properties.Biography.SourceString,
      },
      difficulty: hero_info_raw.Properties.OverallDifficulty,
    };
  } catch (error) {
    console.log(`Encountered error loading hero json at ${meta_data_path}`);
    return null;
  }
};

const getHeroData = async (data_path: string): Promise<HeroData | null> => {
  const json: FellowshipBlueprint[] = await fs.readJson(data_path);

  const hero_data = json.find((block) => {
    return !!block["Properties"]?.HeroID;
  });

  if (hero_data) {
    return {
      id: (hero_data as HeroDataRaw).Properties.HeroID.TagName,
    };
  }

  return null;
};

interface HeroDataPath {
  data_file: string;
  metadata_file: string;
  hero_key: string;
}

export const genHeroes = async () => {
  console.group();
  console.log("Generating hero data.");

  // Step 1. Get the directory names within the hero directory
  const hero_paths_all = await fs.readdir(
    `${process.env.FMODEL_OUTPUT}\\Content\\characters\\Heroes`,
    { withFileTypes: true }
  );

  const hero_keys = hero_paths_all
    .filter((path) => path.isDirectory())
    .map((dirent) => dirent.name);

  // Step 2. Using the keys, traverse the hero directory and
  // find which directories have a data, and meta-data file
  // for use to parse.
  const hero_paths: HeroDataPath[] = [];

  const getDataPaths = async (hero_key: string) => {
    // Get the files in the hero's directory.
    const paths = await fs.readdir(
      `${process.env.FMODEL_OUTPUT}\\Content\\characters\\Heroes\\${hero_key}`,
      { withFileTypes: true }
    );

    const files = paths.filter((dirent) => dirent.isFile());

    // Find the "data" file for that hero.
    const data_file = files.find((dirent) =>
      dirent.name.startsWith(`BP_Hero_${hero_key}.json`)
    );

    // Find the "meta_data file for that hero. Seems like this can"
    // be named with or without a "_" before "MetaData"
    const metadata_file = files.find(
      (dirent) =>
        dirent.name.startsWith(`DA_${hero_key}MetaData.json`) ||
        dirent.name.startsWith(`DA_${hero_key}_MetaData.json`)
    );

    // Only add the hero if they have both a data, and metadata
    // path.
    if (data_file && metadata_file) {
      hero_paths.push({
        data_file: `${data_file.parentPath}\\${data_file.name}`,
        metadata_file: `${metadata_file.parentPath}\\${metadata_file.name}`,
        hero_key,
      });
    }
  };

  await Promise.all(hero_keys.map((key) => getDataPaths(key)));

  console.log(
    `${hero_paths.length} valid heroes found: ${hero_paths.map((hero) => hero.hero_key).join(", ")}`
  );

  // Step 3. Using the data, and metadata files, convert
  // the JSON in them to usable hero info JSON, then
  // save that to the data directory.
  const genHero = async (hero: HeroDataPath) => {
    const meta_data = await getHeroMetaData(hero.metadata_file);
    const data = await getHeroData(hero.data_file);

    if (!!meta_data && !!data) {
      const data_full: Hero = { ...meta_data, ...data };

      await fs.writeFile(
        `.\\data\\heroes\\${data_full.name.default}.json`,
        JSON.stringify(data_full, null, 2)
      );
    }
  };

  await fs.ensureDir(".\\data\\heroes");

  await Promise.all(hero_paths.map((hero_path) => genHero(hero_path)));

  console.log("Done generating heroes.");
  console.groupEnd();
};
