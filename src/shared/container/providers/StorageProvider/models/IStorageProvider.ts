export default interface IStorageProvider {
  // (fileName: string): Promise<string>;
  deleteFile(fileName: string): Promise<void>;
}
