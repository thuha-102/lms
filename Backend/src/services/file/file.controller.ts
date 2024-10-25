import {
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  Res,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileService } from './file.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { nanoid } from 'nanoid';
import { diskStorage } from 'multer';
import { query, Request, Response } from 'express';
import { createReadStream } from 'fs';
import { join } from 'path';
import { LearningMaterialType } from '@prisma/client';
import { FileDTO, VideoDTO } from './dto/file.dto';
import { QuizCreateREQ } from './request/quiz.create';

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

    const fileId = await this.fileService.upLoadFile(file.filename, file.mimetype, type);

    return {
      id: fileId,
      // filepath: './uploads/materialFiles/' + file.filename,
    };
  }

  @Post('avatar')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/avatarImages',
        filename: (req: Request, file, cb) => {
          const uniqueId = nanoid();
          const fileName = `${uniqueId}--${file.originalname}`;
          cb(null, fileName);
        },
      }),
    }),
  )
  async uploadAvatar(@UploadedFile() file: Express.Multer.File) {
    const fileId = await this.fileService.upLoadFile(file.filename, file.mimetype, 'IMAGE');
    return {
      id: fileId,
      // filepath: './uploads/materialFiles/' + file.filename,
    };
  }

  @Get(':id')
  async detail(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    const fileDetail = await this.fileService.detail(id);
    try {
      if (fileDetail.type === 'IMAGE') {
        const { filepath, mimetype } = fileDetail as FileDTO;
        const file = createReadStream(join(process.cwd(), `uploads/avatarImages/${filepath}`));
        res.set({
          'Content-Type': mimetype,
          'Content-Disposition': `attachment; filename="${filepath.split('--')[1]}"`,
        });
        file.pipe(res);
        return;
      }

      if (fileDetail.type === 'PDF') {
        const { filepath, mimetype } = fileDetail as FileDTO;

        const file = createReadStream(join(process.cwd(), `uploads/materialFiles/${filepath}`));
        res.set({
          'Content-Type': mimetype,
          'Content-Disposition': `attachment; filename="${filepath.split('--')[1]}"`,
        });
        file.pipe(res);
      } else return res.send(fileDetail);
    } catch (e) {
      console.log(e);
    }
  }

  @Get(':id/information')
  async getInformation(@Param('id', ParseIntPipe) id: number) {
    return await this.fileService.getInformation(id);
  }

  @Get('video/:id')
  @HttpCode(206)
  async streamVideo(@Param('id', ParseIntPipe) id: number, @Res({ passthrough: true }) res: Response, @Req() req: Request) {
    const { streamableFile, mimetype, start, end, fileSize } = await this.fileService.streamVideo(id, req.headers.range);

    res.set({
      'Content-Type': mimetype,
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Conten-Length': end - start + 1,
    });
    return new StreamableFile(streamableFile);
  }

  @Get('')
  async getAll(@Query() query?: { name: string; type: string }) {
    return this.fileService.getAll(query);
  }

  @Get('no-used')
  async getNoUsed() {
    return this.fileService.getNoUsed();
  }
}
