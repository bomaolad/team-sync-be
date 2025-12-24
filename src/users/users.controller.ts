import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getProfile(@Request() req: any) {
    return this.usersService.findOne(req.user.sub);
  }

  @Patch('me')
  updateProfile(@Request() req: any, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService
      .update(req.user.sub, updateUserDto)
      .then(() => this.usersService.findOne(req.user.sub));
  }
}
