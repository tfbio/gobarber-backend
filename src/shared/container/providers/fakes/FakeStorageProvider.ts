import IStorageProvider from '../models/IStorageProvider';

class FakeLocalDiskStorageProvider implements IStorageProvider {
  private storage: string[] = [];

  public async saveFile(fileName: string): Promise<string> {
    this.storage.push(fileName);

    return fileName;
  }

  public async deleteFile(fileName: string): Promise<void> {
    const indexToDelete = this.storage.findIndex(file => file === fileName);

    this.storage.splice(indexToDelete, 1);
  }
}

export default FakeLocalDiskStorageProvider;
