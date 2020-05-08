import { copyFile } from 'fs';

// Configure Angular `environment.ts` file path
const sourcePath = './src/environments/mock-environment.ts';
const targetPath = './src/environments/environment.ts';

// destination.txt will be created or overwritten by default.
copyFile(sourcePath, targetPath, (err) => {
  if (err) throw err;
  console.log(sourcePath + ' was copied to ' + targetPath);
});
