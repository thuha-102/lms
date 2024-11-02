import { IsNotEmpty, IsString, ArrayNotEmpty, IsNumber } from 'class-validator';

class UserRateCourseREQ {
  @IsNumber()
  courseid: number;

  @IsNumber()
  rating: number;

  @IsString()
  comment?: string;
}

class UserRateSquenceCourseREQ {
    @IsNumber()
    rating: number;
  
    @IsString()
    comment?: string;
}

class UserRateChatbotREQ {
    @IsNumber()
    rating: number;
}

export { UserRateCourseREQ, UserRateChatbotREQ, UserRateSquenceCourseREQ };