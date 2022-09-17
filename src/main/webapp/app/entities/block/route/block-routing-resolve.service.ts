import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IBlock } from '../block.model';
import { BlockService } from '../service/block.service';

@Injectable({ providedIn: 'root' })
export class BlockRoutingResolveService implements Resolve<IBlock | null> {
  constructor(protected service: BlockService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IBlock | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((block: HttpResponse<IBlock>) => {
          if (block.body) {
            return of(block.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
