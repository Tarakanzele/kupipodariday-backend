import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class OfferInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const cleanOffer = (offer: any) => {
          if (offer?.user?.password) delete offer.user.password;
          return offer;
        };

        if (Array.isArray(data)) return data.map(cleanOffer);
        return cleanOffer(data);
      }),
    );
  }
}
