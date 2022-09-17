import { IOrganization } from 'app/entities/organization/organization.model';
import { ISpace } from 'app/entities/space/space.model';
import { IArticle } from 'app/entities/article/article.model';
import { IUser } from 'app/entities/user/user.model';
import { BlockType } from 'app/entities/enumerations/block-type.model';

export interface IBlock {
  id: number;
  type?: BlockType | null;
  order?: number | null;
  payload?: string | null;
  organization?: Pick<IOrganization, 'id'> | null;
  space?: Pick<ISpace, 'id'> | null;
  article?: Pick<IArticle, 'id'> | null;
  author?: Pick<IUser, 'id'> | null;
}

export type NewBlock = Omit<IBlock, 'id'> & { id: null };
