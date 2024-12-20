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
      const { typeLearnerId, learnerId } = queryParams;

      if (typeLearnerId) {
        const sequenceCourses = await this.sequenceCoursesService.getMany(
          { typeLearnerId: Number(typeLearnerId) },
          { order: 'asc' },
        );
        const typeLearner = await this.typeLearnerService.getOne({ id: Number(typeLearnerId) });
        return JSON.stringify({
          courses: sequenceCourses.map((course) => course.Course),
          typeLearnerId: typeLearner.id,
          typeLearnerName: typeLearner.name,
          typeLearnerStartScore: typeLearner.startScore,
          createdAt: DatetimeService.formatVNTime(typeLearner.createdAt),
          updatedAt: DatetimeService.formatVNTime(typeLearner.updatedAt),
        });
      }

      if (learnerId) {
        const learnerInfo = await this.sequenceCoursesService.getLearnerStudiedSequenceCoursesInfo(Number(learnerId));

        if (!learnerInfo.latestCourseInSequenceId) {
          return JSON.stringify({
            currentCourseOrder: null,
            courses: [],
          });
        }

        const sequenceCourses = await this.sequenceCoursesService.getMany(
          { typeLearnerId: learnerInfo.typeLearnerId },
          { order: 'asc' },
        );
        const sequenceCoursesStudiedHistory = await this.sequenceCoursesService.getLearnerStudiedCoursesHistory(
          Number(learnerId),
          sequenceCourses.map((course) => course.Course.id),
        );
        const courses = sequenceCourses.map((c) => {
          const i = sequenceCoursesStudiedHistory.findIndex((course) => course.Course.id === c.Course.id);
          return {
              id: c.Course.id,
              name: c.Course.name,
              description: c.Course.description,
              lessonsCount: c.Course.totalLessons,
              time: c.Course.amountOfTime,
              score: i === -1 ? 0 : sequenceCoursesStudiedHistory[i].percentOfStudying * 100,
              avatarId: c.Course.avatarId
          }
        });
        return JSON.stringify({
          currentCourseOrder: sequenceCourses.findIndex((c) => c.Course.id === learnerInfo.latestCourseInSequenceId),
          courses: courses,
        });
      }

      const sequenceCourses = await this.sequenceCoursesService.getAll();
      let result = [{
        typeLearnerId: sequenceCourses[0].typeLearnerId,
        typeLearnerName: sequenceCourses[0].TypeLearner.name,
        typeLearnerStartScore: sequenceCourses[0].TypeLearner.startScore,
        createdAt: sequenceCourses[0].TypeLearner.createdAt,
        updatedAt: sequenceCourses[0].TypeLearner.updatedAt,
        courses: []
      }];
      sequenceCourses.forEach(c => {
        if (c.typeLearnerId == result[result.length - 1].typeLearnerId) {
          result[result.length - 1].courses = [...result[result.length - 1].courses, c.Course];
        } else {
          result = [...result, {
            typeLearnerId: c.typeLearnerId,
            typeLearnerName: c.TypeLearner.name,
            typeLearnerStartScore: c.TypeLearner.startScore,
            createdAt: c.TypeLearner.createdAt,
            updatedAt: c.TypeLearner.updatedAt,
            courses: [c.Course]
          }]
        }
      });
      return JSON.stringify(result);
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
      await this.typeLearnerService.updateOne(typeLearnerId, {
        name: body.typeLearnerName,
        startScore: body.typeLearnerStartScore,
        updatedAt: new Date(),
      });

      if (body.courseIds) {
        await this.sequenceCoursesService.deleteMany({ typeLearnerId: typeLearnerId });

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
