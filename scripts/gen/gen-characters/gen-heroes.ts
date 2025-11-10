import { getDirectoryContents } from "../shared/utils";

export const genHeroes = async () => {
  const heroContents = await getDirectoryContents(
    "./data/raw/characters/Heroes"
  );

  console.log(heroContents);

  return [];
};
