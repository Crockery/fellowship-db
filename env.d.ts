declare global {
  namespace NodeJS {
    interface ProcessEnv {
      FMODEL_OUTPUT: string;
    }
  }
}

export {};
