import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { SpaceComponent } from './list/space.component';
import { SpaceDetailComponent } from './detail/space-detail.component';
import { SpaceUpdateComponent } from './update/space-update.component';
import { SpaceDeleteDialogComponent } from './delete/space-delete-dialog.component';
import { SpaceRoutingModule } from './route/space-routing.module';

@NgModule({
  imports: [SharedModule, SpaceRoutingModule],
  declarations: [SpaceComponent, SpaceDetailComponent, SpaceUpdateComponent, SpaceDeleteDialogComponent],
})
export class SpaceModule {}
