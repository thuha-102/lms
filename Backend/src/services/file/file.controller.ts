import { Controller, Get, Param, ParseIntPipe, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileService } from './file.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { nanoid } from 'nanoid';
import { diskStorage } from 'multer';
import { Request, Response } from 'express';
import { createReadStream } from 'fs';
import { join } from 'path';

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
    const parts = file.filename.split('--');
    return await this.fileService.upLoadFile(parts[1], parts[0], file.mimetype);
  }

  @Get(':id')
  async detail(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    const { name, fileName, type } = await this.fileService.detail(id);

    const file = createReadStream(join(process.cwd(), `uploads/materialFiles/${fileName}`));
    res.set({
      'Content-Type': type,
      'Content-Disposition': `attachment; filename="${name}"`,
    });
    file.pipe(res);
  }
}
