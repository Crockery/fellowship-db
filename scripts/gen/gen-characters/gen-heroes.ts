import { getOutputContents } from "../shared/utils";

export const genHeroes = async () => {
  const heroContents = await getOutputContents("Content\\characters\\Heroes");

  console.log(heroContents);

  return [];
};
