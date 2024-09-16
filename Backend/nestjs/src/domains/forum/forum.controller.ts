import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  ParseIntPipe,
  NotFoundException,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ForumService } from './forum.service';
import { StatementService } from './statement.service';
import * as ForumDto from './dto/forum.dto';
import * as StatementDto from './dto/statement.dto';
import { map } from 'rxjs/operators';
import { lastValueFrom } from 'rxjs';
import { FileInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import { renameSync } from 'fs';

//import { AuthGuard } from '../auth/auth.guard';
//@UseGuards(AuthGuard)
@Controller('forum')
export class ForumController {
  constructor(
    private readonly forumService: ForumService,
    private readonly statementService: StatementService,
    private readonly httpService: HttpService,
  ) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('coverImage', {
      dest: 'uploads/forumImages',
      fileFilter: (req, file, cb) => {
        console.log(file);
        if (
          file.mimetype === 'image/png' ||
          file.mimetype === 'image/jpeg' ||
          file.mimetype === 'image/svg' ||
          file.mimetype === 'image/gif'
        ) {
          cb(null, true);
        } else {
          cb(new Error('Only .png, .jpg, .svg, and .gif format allowed!'), false);
        }
      },
    }),
  )
  async create(@UploadedFile() file: Express.Multer.File, @Body() body: ForumDto.ForumCreateRequestDto) {
    console.log(file);
    try {
      if (typeof body.userId === 'string') {
        body.userId = +body.userId;
      }
      const result = await this.forumService.create({
        ...ForumDto.ForumCreateRequestDto.toCreateInput(body),
        coverImageType: file ? path.extname(file.originalname) : null,
      });
      if (file) {
        const newPath = `uploads/forumImages/${result.id}${path.extname(file.originalname)}`;
        renameSync(file.path, newPath);
      }
      return JSON.stringify(ForumDto.ForumResponseDto.fromForum(result));
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @Post('similarForums')
  async findSimilarForums(@Body() body: ForumDto.ForumCreateRequestDto) {
    try {
      const similarForums = await lastValueFrom(
        this.httpService.post(`http://127.0.0.1:8181/similar-forums`, body.content).pipe(map((res) => res.data)),
      );
      return JSON.stringify(similarForums);
    } catch (error) {
      throw error;
    }
  }

  @Get()
  async getMany(@Query() queryParams) {
    try {
      if (queryParams.userId) {
        queryParams.userId = +queryParams.userId;
      }
      const result = await this.forumService.getMany(queryParams);
      return JSON.stringify(result.map((f) => ForumDto.ForumResponseDto.fromForum({ ...f, content: '' })));
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @Get('user/:userId')
  async getAllUserOwned(@Param('userId', ParseIntPipe) userId: number) {
    try {
      const result = await this.forumService.getAllOwned(userId);
      return JSON.stringify(result.map((f) => ForumDto.ForumResponseDto.fromForum({ ...f, content: '' })));
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @Get(':id')
  async getOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const result = await this.forumService.getOne(id);
      if (result == null) {
        throw new NotFoundException(`Forum with id ${id} not found`);
      }
      return JSON.stringify(ForumDto.ForumResponseDto.fromForum(result));
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @Put(':id')
  async updateOne(@Param('id', ParseIntPipe) id: number, @Body() body: ForumDto.ForumUpdateRequestDto) {
    try {
      const result = await this.forumService.updateOne(id, ForumDto.ForumUpdateRequestDto.toUpdateInput(body));
      if (result == null) {
        throw new NotFoundException(`Forum with id ${id} not found`);
      }
      return JSON.stringify(ForumDto.ForumResponseDto.fromForum(result));
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @Post('comment')
  async addComment(@Body() body: StatementDto.StatementCreateRequestDto) {
    try {
      if (body.statementId) {
        // Check if preComment exist
        const comment = await this.statementService.getOne(body.statementId);
        if (comment == null) {
          throw new NotFoundException(`Statement with id ${body.statementId} not found`);
        }
        // Check preComment in forum
        if (comment.forumId != body.forumId) {
          throw new NotFoundException(`Statement with id ${body.statementId} not found in forum ${body.forumId}`);
        }
      }
      const result = await this.statementService.create(StatementDto.StatementCreateRequestDto.toCreateInput(body));
      return JSON.stringify(StatementDto.StatementResponseDto.fromForum(result));
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @Put('comment/:id')
  async updateComment(@Param('id', ParseIntPipe) id: number, @Body() body: StatementDto.StatementUpdateRequestDto) {
    try {
      const result = await this.statementService.updateOne(id, StatementDto.StatementUpdateRequestDto.toUpdateInput(body));
      if (result == null) {
        throw new NotFoundException(`Statement with id ${id} not found`);
      }
      return JSON.stringify(StatementDto.StatementResponseDto.fromForum(result));
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
