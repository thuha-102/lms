import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('/analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  // @Get('history-user')
  // async getHistoryUser(@Query() query: { field: 'month' | 'week' }) {
  //   return this.analyticsService.getHistoryUser(query.field);
  // }

  // @Get('history-log')
  // async getHistoryLog(@Query() query: { field: 'month' | 'week' }) {
  //   return this.analyticsService.getHistoryLog(query.field);
  // }

  // @Get('history-forum')
  // async getHistoryForum() {
  //   return this.analyticsService.getHistoryForum();
  // }

  // @Get('history-register')
  // async getHistoryRegister(@Query() query: { userId: number; field: 'month' | 'week' }) {
  //   return this.analyticsService.getHistoryRegister(Number(query.userId), query.field);
  // }

  // @Get('history-register-course')
  // async getHistoryRegisterCourse(@Query() query: { userId: number }) {
  //   return this.analyticsService.getHistoryRegisterCourse(Number(query.userId));
  // }

  @Get('group-rate')
  async getGroupRate(){
    return this.analyticsService.getGroupRate();
  }

  @Get('group-progress-and-score')
  async getGroupProgress(){
    return this.analyticsService.getGroupProgressAndScore();
  }

  @Get('annually-create-user')
  async getAnnuallyCreateUser(@Query() query: { field: 'month' | 'week' }){
    return this.analyticsService.getCreatedUser(query.field);
  }

  @Get('annually-purchase-course')
  async getAnnuallyPurchaseCourse(@Query() query: { field: 'month' | 'week' }){
    return this.analyticsService.getPurchasedCourse(query.field);
  }
}
