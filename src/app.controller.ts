import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
    @Get()
    getHalleluya(): string {
        return 'Halleluya';
    }
}
