import { Body, Controller, Post, Get, Param, ParseIntPipe, NotFoundException, Put, Query, Delete } from '@nestjs/common';
import { SequenceCoursesService } from './sequenceCourses.service';
import { TypeLearnerService } from '../typeLearner/typeLearner.service';
import * as SequenceCoursesDto from './dto/sequenceCourses.dto';
import { error } from 'console';
import { DatetimeService } from 'src/services/datetime/datetime.service';

//import { AuthGuard } from '../auth/auth.guard';

//@UseGuards(AuthGuard)
@Controller('sequenceCourses')
export class SequenceCoursesController {
  constructor(
    private readonly sequenceCoursesService: SequenceCoursesService,
    private readonly typeLearnerService: TypeLearnerService,
  ) {}

  @Post()
  async create(@Body() body: SequenceCoursesDto.SequenceCoursesCreateRequestDto) {
    try {
      const typeLearner = await this.typeLearnerService.getOne({ name: body.typeLearnerName });
      if (typeLearner) {
        throw new error('typeLearner name already existed');
      }

      const newTypeLearner = await this.typeLearnerService.create({
        name: body.typeLearnerName,
        startScore: body.typeLearnerStartScore,
      });

      await this.sequenceCoursesService.createMany(
        body.courseIds.map((courseId, i) => ({
          typeLearnerId: newTypeLearner.id,
          courseId: courseId,
          order: i,
        })),
      );

      const sequenceCourses = await this.sequenceCoursesService.getMany({ typeLearnerId: newTypeLearner.id }, { order: 'asc' });

      return JSON.stringify({
        courses: sequenceCourses.map((course) => course.Course),
        typeLearnerId: newTypeLearner.id,
        typeLearnerStartScore: newTypeLearner.startScore,
        typeLearnerName: newTypeLearner.name,
        createdAt: DatetimeService.formatVNTime(newTypeLearner.createdAt),
        updatedAt: DatetimeService.formatVNTime(newTypeLearner.updatedAt),
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @Get()
  async getMany(@Query() queryParams) {
    try {
      const { typeLearnerId } = queryParams;
      const sequenceCourses = await this.sequenceCoursesService.getMany({ typeLearnerId: typeLearnerId }, { order: 'asc' });
      const typeLearner = await this.typeLearnerService.getOne({ id: typeLearnerId });
      return JSON.stringify({
        courses: sequenceCourses.map((course) => course.Course),
        typeLearnerId: typeLearner.id,
        typeLearnerStartScore: typeLearner.startScore,
        typeLearnerName: typeLearner.name,
        createdAt: DatetimeService.formatVNTime(typeLearner.createdAt),
        updatedAt: DatetimeService.formatVNTime(typeLearner.updatedAt),
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @Put(':typeLearnerId')
  async update(
    @Param('typeLearnerId', ParseIntPipe) typeLearnerId: number,
    @Body() body: SequenceCoursesDto.SequenceCoursesUpdateRequestDto,
  ) {
    try {
      await this.sequenceCoursesService.deleteMany({ typeLearnerId: typeLearnerId });

      if (body.typeLearnerName || body.typeLearnerStartScore) {
        await this.typeLearnerService.updateOne(typeLearnerId, {
          name: body.typeLearnerName,
          startScore: body.typeLearnerStartScore,
        });
      }

      if (body.courseIds) {
        await this.sequenceCoursesService.createMany(
          body.courseIds.map((courseId, i) => ({
            typeLearnerId: typeLearnerId,
            courseId: courseId,
            order: i,
          })),
        );
      }

      const sequenceCourses = await this.sequenceCoursesService.getMany({ typeLearnerId: typeLearnerId }, { order: 'asc' });
      const typeLearner = await this.typeLearnerService.getOne({ id: typeLearnerId });
      return JSON.stringify({
        courses: sequenceCourses.map((course) => course.Course),
        typeLearnerId: typeLearner.id,
        typeLearnerStartScore: typeLearner.startScore,
        typeLearnerName: typeLearner.name,
        createdAt: DatetimeService.formatVNTime(typeLearner.createdAt),
        updatedAt: DatetimeService.formatVNTime(typeLearner.updatedAt),
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @Delete(':typeLearnerId')
  async deleteOne(@Param('typeLearnerId', ParseIntPipe) typeLearnerId: number) {
    try {
      await this.sequenceCoursesService.deleteMany({ typeLearnerId: typeLearnerId });
      await this.typeLearnerService.delete(typeLearnerId);
      return JSON.stringify({});
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
