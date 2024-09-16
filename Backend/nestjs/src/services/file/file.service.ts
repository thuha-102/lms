import { BadRequestException, Injectable, NotFoundException, StreamableFile } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FileDTO } from './dto/file.dto';
import * as parseRange from 'range-parser';
import { stat } from 'fs/promises';
import { createReadStream } from 'fs';
import { join } from 'path';

@Injectable()
export class FileService {
  constructor(private readonly prismaService: PrismaService) {}

  async upLoadFile(fileName: string, prefix: string, type: string) {
    const file = await this.prismaService.file.create({
      data: { name: fileName, prefix: prefix, type: type },
      select: { id: true },
    });
    return { id: file.id };
  }

  async detail(id: number) {
    const file = await this.prismaService.file.findFirst({ where: { id } });
    if (!file) throw new NotFoundException('File not found');

    return FileDTO.fromEntity(file as any);
  }

  parseRange(range: string, fileSize: number, rangePass: number) {
    if (rangePass) range = `bytes=0-${Math.round(rangePass*fileSize)}`
    const parseResult = parseRange(fileSize, range);
    if (parseResult === -1 || parseResult === -2 || parseResult.length !== 1) {
      throw new BadRequestException();
    }
    return parseResult[0];
  }

  async getFileSize(path: string) {
    const status = await stat(path);
    return status.size;
  }

  getContentRange(rangeStart: number, rangeEnd: number, fileSize: number) {
    return `bytes ${rangeStart}-${rangeEnd}/${fileSize}`;
  }

  async getPartialVideoStream(fileName: string, mimetype: string, path: string, range: string, rangePass?: number) {
    const videoPath = join(process.cwd(), path);
    const fileSize = await this.getFileSize(videoPath);

    const { start, end } = this.parseRange(range, fileSize, rangePass);

    const stream = createReadStream(videoPath, { start, end });

    const streamableFile = new StreamableFile(stream, {
      disposition: `inline; filename="${fileName}"`,
      type: mimetype,
    });

    const contentRange = this.getContentRange(start, end, fileSize);

    return {
      streamableFile,
      contentRange,
    };
  }
}
