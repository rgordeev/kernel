import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IBlock, NewBlock } from '../block.model';

export type PartialUpdateBlock = Partial<IBlock> & Pick<IBlock, 'id'>;

export type EntityResponseType = HttpResponse<IBlock>;
export type EntityArrayResponseType = HttpResponse<IBlock[]>;

@Injectable({ providedIn: 'root' })
export class BlockService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/blocks');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(block: NewBlock): Observable<EntityResponseType> {
    return this.http.post<IBlock>(this.resourceUrl, block, { observe: 'response' });
  }

  update(block: IBlock): Observable<EntityResponseType> {
    return this.http.put<IBlock>(`${this.resourceUrl}/${this.getBlockIdentifier(block)}`, block, { observe: 'response' });
  }

  partialUpdate(block: PartialUpdateBlock): Observable<EntityResponseType> {
    return this.http.patch<IBlock>(`${this.resourceUrl}/${this.getBlockIdentifier(block)}`, block, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IBlock>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IBlock[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getBlockIdentifier(block: Pick<IBlock, 'id'>): number {
    return block.id;
  }

  compareBlock(o1: Pick<IBlock, 'id'> | null, o2: Pick<IBlock, 'id'> | null): boolean {
    return o1 && o2 ? this.getBlockIdentifier(o1) === this.getBlockIdentifier(o2) : o1 === o2;
  }

  addBlockToCollectionIfMissing<Type extends Pick<IBlock, 'id'>>(
    blockCollection: Type[],
    ...blocksToCheck: (Type | null | undefined)[]
  ): Type[] {
    const blocks: Type[] = blocksToCheck.filter(isPresent);
    if (blocks.length > 0) {
      const blockCollectionIdentifiers = blockCollection.map(blockItem => this.getBlockIdentifier(blockItem)!);
      const blocksToAdd = blocks.filter(blockItem => {
        const blockIdentifier = this.getBlockIdentifier(blockItem);
        if (blockCollectionIdentifiers.includes(blockIdentifier)) {
          return false;
        }
        blockCollectionIdentifiers.push(blockIdentifier);
        return true;
      });
      return [...blocksToAdd, ...blockCollection];
    }
    return blockCollection;
  }
}
