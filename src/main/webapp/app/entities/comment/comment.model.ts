import { IArticle } from 'app/entities/article/article.model';
import { IBlock } from 'app/entities/block/block.model';
import { IUser } from 'app/entities/user/user.model';

export interface IComment {
  id: number;
  text?: string | null;
  article?: Pick<IArticle, 'id'> | null;
  block?: Pick<IBlock, 'id'> | null;
  author?: Pick<IUser, 'id'> | null;
}

export type NewComment = Omit<IComment, 'id'> & { id: null };
