import { argv, loadEnvFile } from "node:process";
import { genCharacters } from "./gen-characters";
import { genLang } from "./gen-lang";

const valid_types = ["characters", "lang"];

const handlerFactory = (type: string) => {
  switch (type) {
    case "characters": {
      return genCharacters;
    }
    case "lang": {
      return genLang;
    }
    default: {
      return null;
    }
  }
};

try {
  loadEnvFile(".env");
} catch (error) {
  console.error("Unable to generate data: missing env file.");
}

const gen = async () => {
  if (!process.env.FMODEL_OUTPUT) {
    throw new Error("FMODEL_OUTPUT path not set in .env");
  }

  const types = argv.filter((type, i) => i <= 2 && valid_types.includes(type));

  console.log("Generating data for the following tasks:");
  console.log(types);

  await Promise.all(
    types
      .map(handlerFactory)
      .filter((handler): handler is () => Promise<void> => !!handler)
      .map((handler) => handler())
  );
};

gen();
