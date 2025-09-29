import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { JwtPayload } from '@/types/jwt-payload.type';

interface AuthenticatedRequest extends Request {
  sub: JwtPayload;
}

export const CurrentUser = createParamDecorator((_, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();

  return request.sub;
});
