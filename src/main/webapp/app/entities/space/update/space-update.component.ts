import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { SpaceFormService, SpaceFormGroup } from './space-form.service';
import { ISpace } from '../space.model';
import { SpaceService } from '../service/space.service';
import { IOrganization } from 'app/entities/organization/organization.model';
import { OrganizationService } from 'app/entities/organization/service/organization.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

@Component({
  selector: 'suz-space-update',
  templateUrl: './space-update.component.html',
})
export class SpaceUpdateComponent implements OnInit {
  isSaving = false;
  space: ISpace | null = null;

  organizationsSharedCollection: IOrganization[] = [];
  usersSharedCollection: IUser[] = [];

  editForm: SpaceFormGroup = this.spaceFormService.createSpaceFormGroup();

  constructor(
    protected spaceService: SpaceService,
    protected spaceFormService: SpaceFormService,
    protected organizationService: OrganizationService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareOrganization = (o1: IOrganization | null, o2: IOrganization | null): boolean =>
    this.organizationService.compareOrganization(o1, o2);

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ space }) => {
      this.space = space;
      if (space) {
        this.updateForm(space);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const space = this.spaceFormService.getSpace(this.editForm);
    if (space.id !== null) {
      this.subscribeToSaveResponse(this.spaceService.update(space));
    } else {
      this.subscribeToSaveResponse(this.spaceService.create(space));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISpace>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(space: ISpace): void {
    this.space = space;
    this.spaceFormService.resetForm(this.editForm, space);

    this.organizationsSharedCollection = this.organizationService.addOrganizationToCollectionIfMissing<IOrganization>(
      this.organizationsSharedCollection,
      space.organization
    );
    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, space.owner);
  }

  protected loadRelationshipsOptions(): void {
    this.organizationService
      .query()
      .pipe(map((res: HttpResponse<IOrganization[]>) => res.body ?? []))
      .pipe(
        map((organizations: IOrganization[]) =>
          this.organizationService.addOrganizationToCollectionIfMissing<IOrganization>(organizations, this.space?.organization)
        )
      )
      .subscribe((organizations: IOrganization[]) => (this.organizationsSharedCollection = organizations));

    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.space?.owner)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }
}
