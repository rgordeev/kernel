import { IOrganization } from 'app/entities/organization/organization.model';
import { ISpace } from 'app/entities/space/space.model';
import { IArticle } from 'app/entities/article/article.model';
import { IUser } from 'app/entities/user/user.model';
import { IComment } from 'app/entities/comment/comment.model';

export interface IAttachment {
  id: number;
  uuid?: string | null;
  uri?: string | null;
  fileName?: string | null;
  mimeType?: string | null;
  length?: number | null;
  organization?: Pick<IOrganization, 'id'> | null;
  space?: Pick<ISpace, 'id'> | null;
  article?: Pick<IArticle, 'id'> | null;
  owner?: Pick<IUser, 'id'> | null;
  comment?: Pick<IComment, 'id'> | null;
}

export type NewAttachment = Omit<IAttachment, 'id'> & { id: null };
