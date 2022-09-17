import { IOrganization } from 'app/entities/organization/organization.model';
import { ISpace } from 'app/entities/space/space.model';
import { IUser } from 'app/entities/user/user.model';
import { ArticleStatus } from 'app/entities/enumerations/article-status.model';

export interface IArticle {
  id: number;
  title?: string | null;
  status?: ArticleStatus | null;
  organization?: Pick<IOrganization, 'id'> | null;
  space?: Pick<ISpace, 'id'> | null;
  author?: Pick<IUser, 'id'> | null;
}

export type NewArticle = Omit<IArticle, 'id'> & { id: null };
