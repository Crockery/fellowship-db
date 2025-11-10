import fs from "fs-extra";

interface DirectoryFile {
  name: string;
  parentPath: string;
}

interface DirectoryContents {
  files: fs.Dirent<string>[];
  directories: DirectoryContents[];
}

export const getDirectoryContents = async (
  path: string
): Promise<DirectoryContents | null> => {
  try {
    const paths = await fs.readdir(path, { withFileTypes: true });

    const files = paths.filter((path) => path.isFile());
    const dirents = paths
      .filter((path) => path.isDirectory())
      .map((dirent) => `${dirent.parentPath}\\${dirent.name}`);

    const directories = (
      await Promise.all(
        dirents.map((direntPath) => getDirectoryContents(direntPath))
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
