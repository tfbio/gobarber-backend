import fs from 'fs';
import path from 'path';
import uploadConfig from '@config/upload';

import IStorageProvider from '../models/IStorageProvider';

class LocalDiskStorageProvider implements IStorageProvider {
  public async saveFile(fileName: string): Promise<string> {
    fs.promises.rename(
      path.resolve(uploadConfig.tempFolder, fileName),
      path.resolve(uploadConfig.uploadFolder, fileName)
    );

    return fileName;
  }

  public async deleteFile(fileName: string): Promise<void> {
    const filePath = path.resolve(uploadConfig.uploadFolder, fileName);

    try {
      await fs.promises.stat(filePath);
    } catch {
      return;
    }

    await fs.promises.unlink(filePath);
  }
}

export default LocalDiskStorageProvider;
