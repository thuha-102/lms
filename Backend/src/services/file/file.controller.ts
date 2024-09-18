import { Controller, Get, Param, ParseIntPipe, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileService } from './file.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { nanoid } from 'nanoid';
import { diskStorage } from 'multer';
import { Request, Response } from 'express';
import { createReadStream } from 'fs';
import { join } from 'path';
import { LearningMaterialType } from '@prisma/client';

@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/materialFiles',
        filename: (req: Request, file, cb) => {
          const uniqueId = nanoid();
          const fileName = `${uniqueId}--${file.originalname}`;
          cb(null, fileName);
        },
      }),
    }),
  )
  async create(@UploadedFile() file: Express.Multer.File) {
    const type: LearningMaterialType = file.mimetype.includes('video')
      ? 'VIDEO'
      : file.mimetype === 'application/pdf'
        ? 'PDF'
        : 'QUIZ';
    if (type === 'QUIZ') {
      return {
        filepath: './uploads/materialFiles/' + file.filename,
      };
    } else {
      const fileId = await this.fileService.upLoadFile(file.filename, file.mimetype, type);
      return {
        id: fileId,
        filepath: './uploads/materialFiles/' + file.filename,
      };
    }
  }

  @Get(':id')
  async detail(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    const { filepath, mimetype } = await this.fileService.detail(id);

    const file = createReadStream(join(process.cwd(), `uploads/materialFiles/${filepath}`));
    res.set({
      'Content-Type': mimetype,
      'Content-Disposition': `attachment; filename="${filepath.split('--')[1]}"`,
    });
    file.pipe(res);
  }
}
