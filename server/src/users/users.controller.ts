import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../jwt-auth.guard';
import { UsersService } from './users.service';

@Controller('api/users')
export class UsersController {
  constructor(private readonly userServide: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getCurrentUser(@Req() req) {
    return req.user;
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  updateCurrentUser(@Req() req, @Body() body: any) {
    return this.userServide.updateCurrent(req.user._id, body);
  }

  // optimally the rest of the endpoints were available to admins to reach-
  // I deleted them for now- for enhancing the application security
}
