// src/shared/storage/storage.service.ts
import { Injectable } from '@nestjs/common';
import { ensureDir, remove } from 'fs-extra';
import { join } from 'path';

@Injectable()
export class StorageService {
  constructor() {}

  async ensureUploadsDir() {
    await ensureDir(join(process.cwd(), 'public', 'uploads', 'banners'));
  }

  async removeFile(filename: string) {
    const filePath = join(process.cwd(), 'public', 'uploads', 'banners', filename);
    await remove(filePath);
  }
}