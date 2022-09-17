export interface IOrganization {
  id: number;
  title?: string | null;
}

export type NewOrganization = Omit<IOrganization, 'id'> & { id: null };
