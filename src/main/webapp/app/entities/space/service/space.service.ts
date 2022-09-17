import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISpace, NewSpace } from '../space.model';

export type PartialUpdateSpace = Partial<ISpace> & Pick<ISpace, 'id'>;

export type EntityResponseType = HttpResponse<ISpace>;
export type EntityArrayResponseType = HttpResponse<ISpace[]>;

@Injectable({ providedIn: 'root' })
export class SpaceService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/spaces');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(space: NewSpace): Observable<EntityResponseType> {
    return this.http.post<ISpace>(this.resourceUrl, space, { observe: 'response' });
  }

  update(space: ISpace): Observable<EntityResponseType> {
    return this.http.put<ISpace>(`${this.resourceUrl}/${this.getSpaceIdentifier(space)}`, space, { observe: 'response' });
  }

  partialUpdate(space: PartialUpdateSpace): Observable<EntityResponseType> {
    return this.http.patch<ISpace>(`${this.resourceUrl}/${this.getSpaceIdentifier(space)}`, space, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ISpace>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ISpace[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getSpaceIdentifier(space: Pick<ISpace, 'id'>): number {
    return space.id;
  }

  compareSpace(o1: Pick<ISpace, 'id'> | null, o2: Pick<ISpace, 'id'> | null): boolean {
    return o1 && o2 ? this.getSpaceIdentifier(o1) === this.getSpaceIdentifier(o2) : o1 === o2;
  }

  addSpaceToCollectionIfMissing<Type extends Pick<ISpace, 'id'>>(
    spaceCollection: Type[],
    ...spacesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const spaces: Type[] = spacesToCheck.filter(isPresent);
    if (spaces.length > 0) {
      const spaceCollectionIdentifiers = spaceCollection.map(spaceItem => this.getSpaceIdentifier(spaceItem)!);
      const spacesToAdd = spaces.filter(spaceItem => {
        const spaceIdentifier = this.getSpaceIdentifier(spaceItem);
        if (spaceCollectionIdentifiers.includes(spaceIdentifier)) {
          return false;
        }
        spaceCollectionIdentifiers.push(spaceIdentifier);
        return true;
      });
      return [...spacesToAdd, ...spaceCollection];
    }
    return spaceCollection;
  }
}
