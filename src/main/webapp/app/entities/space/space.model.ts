import { IOrganization } from 'app/entities/organization/organization.model';
import { IUser } from 'app/entities/user/user.model';

export interface ISpace {
  id: number;
  title?: string | null;
  projectCode?: string | null;
  icon?: string | null;
  organization?: Pick<IOrganization, 'id'> | null;
  owner?: Pick<IUser, 'id'> | null;
}

export type NewSpace = Omit<ISpace, 'id'> & { id: null };
