import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly blockRouteForUnauthorizedUsers: boolean = true) {
    super();
  }
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err, user) {
    if (err || (!user && this.blockRouteForUnauthorizedUsers)) {
      throw err || new UnauthorizedException();
    }
    return user || undefined;
  }
}
