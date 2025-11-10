import { argv, loadEnvFile } from "node:process";
import { genHeroes } from "./gen-characters/gen-heroes";

const valid_types = ["characters"];

try {
  loadEnvFile(".env");
} catch (error) {
  console.error("Unable to generate data: missing env file.");
}

const gen = () => {
  if (!process.env.FMODEL_OUTPUT) {
    throw new Error("FMODEL_OUTPUT path not set in .env");
  }

  const type = argv[2];

  if (!type) {
    console.log("No type?");
  } else {
    switch (type) {
      case "characters": {
        genHeroes();
        break;
      }
      default: {
        console.log("Invalid gen type provided.");
        console.log("Type must be one of the following:");
        console.log(valid_types);
        break;
      }
    }
  }
};

gen();
