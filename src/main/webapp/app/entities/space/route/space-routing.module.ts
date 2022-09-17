import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SpaceComponent } from '../list/space.component';
import { SpaceDetailComponent } from '../detail/space-detail.component';
import { SpaceUpdateComponent } from '../update/space-update.component';
import { SpaceRoutingResolveService } from './space-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const spaceRoute: Routes = [
  {
    path: '',
    component: SpaceComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SpaceDetailComponent,
    resolve: {
      space: SpaceRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SpaceUpdateComponent,
    resolve: {
      space: SpaceRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SpaceUpdateComponent,
    resolve: {
      space: SpaceRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(spaceRoute)],
  exports: [RouterModule],
})
export class SpaceRoutingModule {}
