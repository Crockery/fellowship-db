import { genHeroes } from "./gen-heroes";

export const genCharacters = async () => {
  const [heroes] = await Promise.all([genHeroes()]);

  console.log(heroes);
};
