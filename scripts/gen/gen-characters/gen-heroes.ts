import { HeroMetaDataJson } from "../shared/types";
import { HeroData } from "../shared/types/hero/hero-generated-data-types";
import { getOutputContents } from "../shared/utils";
import fs from "fs-extra";

const generated_heroes: string[] = [];

const genHeroData = async (metaDataPath: string) => {
  try {
    const json: HeroMetaDataJson[] = await fs.readJson(metaDataPath);

    if (!json || !json[0]) {
      throw new Error("No JSON");
    }

    const hero_info_raw = json[0];

    const R = hero_info_raw.Properties.ClassColor.R;
    const G = hero_info_raw.Properties.ClassColor.G;
    const B = hero_info_raw.Properties.ClassColor.B;
    const A = hero_info_raw.Properties.ClassColor.A;

    const hero_info_generated: HeroData = {
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

    console.log(hero_info_generated);
  } catch (error) {
    console.log(`Encountered error loading hero json at ${metaDataPath}`);
  }
};

export const genHeroes = async () => {
  console.log("Generating hero data.");

  const meta_data_paths: string[] = [];

  const findMetadataPaths = (
    contents: Awaited<ReturnType<typeof getOutputContents>>
  ) => {
    contents?.files.forEach((file) => {
      if (file.name.endsWith("MetaData.json")) {
        meta_data_paths.push(`${file.parentPath}/${file.name}`);
      }
    });
    contents?.directories.forEach(findMetadataPaths);
  };

  findMetadataPaths(await getOutputContents("Content\\characters\\Heroes"));

  await Promise.all(
    meta_data_paths.map((meta_data_path) => genHeroData(meta_data_path))
  );

  console.log(`Generated data for ${generated_heroes.length} heroes.`);
  console.log(generated_heroes);
};
