import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class PasswordInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const clean = (item: any) => {
          if (item?.password) delete item.password;
          return item;
        };

        if (Array.isArray(data)) return data.map(clean);
        return clean(data);
      }),
    );
  }
}
