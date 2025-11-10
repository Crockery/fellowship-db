import fs from "fs-extra";

interface DirectoryFile {
  name: string;
  parentPath: string;
}

interface DirectoryContents {
  files: fs.Dirent<string>[];
  directories: DirectoryContents[];
}

export const getOutputContents = async (
  path: string
): Promise<DirectoryContents | null> => {
  try {
    const root = process.env.FMODEL_OUTPUT;

    if (!root) {
      throw new Error("FMODEL_OUTPUT path not set in .env");
    }

    const paths = await fs.readdir(`${root}\\${path}`, { withFileTypes: true });

    const files = paths.filter((path) => path.isFile());
    const dirents = paths
      .filter((path) => path.isDirectory())
      .map(
        (dirent) => `${dirent.parentPath.replace(root, "")}\\${dirent.name}`
      );

    const directories = (
      await Promise.all(
        dirents.map((direntPath) => getOutputContents(direntPath))
      )
    ).filter((resp): resp is DirectoryContents => !!resp);

    return {
      files,
      directories,
    };
  } catch (error) {
    console.log(`Unable to load contents at ${path}: `, error);
    return null;
  }
};
