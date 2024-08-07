export abstract class OssClient {
  config: Record<string, string>;

  constructor(config) {
    this.config = config;
  }

  abstract putFile(filepath: string, buffer: ReadableStream): Promise<string>;
  abstract deleteFile(url: string): Promise<void>;
}
