import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'organization',
        data: { pageTitle: 'Organizations' },
        loadChildren: () => import('./organization/organization.module').then(m => m.OrganizationModule),
      },
      {
        path: 'space',
        data: { pageTitle: 'Spaces' },
        loadChildren: () => import('./space/space.module').then(m => m.SpaceModule),
      },
      {
        path: 'article',
        data: { pageTitle: 'Articles' },
        loadChildren: () => import('./article/article.module').then(m => m.ArticleModule),
      },
      {
        path: 'comment',
        data: { pageTitle: 'Comments' },
        loadChildren: () => import('./comment/comment.module').then(m => m.CommentModule),
      },
      {
        path: 'block',
        data: { pageTitle: 'Blocks' },
        loadChildren: () => import('./block/block.module').then(m => m.BlockModule),
      },
      {
        path: 'attachment',
        data: { pageTitle: 'Attachments' },
        loadChildren: () => import('./attachment/attachment.module').then(m => m.AttachmentModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
