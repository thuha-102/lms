import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  connectServer(): string {
    return `<h1 style="text-align: center;"> WELCOME TO LEARNING SYSTEM API</h1>`;
  }
}
