import { ArticleStatus } from 'app/entities/enumerations/article-status.model';

import { IArticle, NewArticle } from './article.model';

export const sampleWithRequiredData: IArticle = {
  id: 61675,
};

export const sampleWithPartialData: IArticle = {
  id: 53001,
  title: 'Upgradable Plastic',
  status: ArticleStatus['NEW'],
};

export const sampleWithFullData: IArticle = {
  id: 24533,
  title: 'analyzing',
  status: ArticleStatus['TEMPLATE'],
};

export const sampleWithNewData: NewArticle = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
