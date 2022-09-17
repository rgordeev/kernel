import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { BlockFormService, BlockFormGroup } from './block-form.service';
import { IBlock } from '../block.model';
import { BlockService } from '../service/block.service';
import { IOrganization } from 'app/entities/organization/organization.model';
import { OrganizationService } from 'app/entities/organization/service/organization.service';
import { ISpace } from 'app/entities/space/space.model';
import { SpaceService } from 'app/entities/space/service/space.service';
import { IArticle } from 'app/entities/article/article.model';
import { ArticleService } from 'app/entities/article/service/article.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { BlockType } from 'app/entities/enumerations/block-type.model';

@Component({
  selector: 'suz-block-update',
  templateUrl: './block-update.component.html',
})
export class BlockUpdateComponent implements OnInit {
  isSaving = false;
  block: IBlock | null = null;
  blockTypeValues = Object.keys(BlockType);

  organizationsSharedCollection: IOrganization[] = [];
  spacesSharedCollection: ISpace[] = [];
  articlesSharedCollection: IArticle[] = [];
  usersSharedCollection: IUser[] = [];

  editForm: BlockFormGroup = this.blockFormService.createBlockFormGroup();

  constructor(
    protected blockService: BlockService,
    protected blockFormService: BlockFormService,
    protected organizationService: OrganizationService,
    protected spaceService: SpaceService,
    protected articleService: ArticleService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareOrganization = (o1: IOrganization | null, o2: IOrganization | null): boolean =>
    this.organizationService.compareOrganization(o1, o2);

  compareSpace = (o1: ISpace | null, o2: ISpace | null): boolean => this.spaceService.compareSpace(o1, o2);

  compareArticle = (o1: IArticle | null, o2: IArticle | null): boolean => this.articleService.compareArticle(o1, o2);

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ block }) => {
      this.block = block;
      if (block) {
        this.updateForm(block);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const block = this.blockFormService.getBlock(this.editForm);
    if (block.id !== null) {
      this.subscribeToSaveResponse(this.blockService.update(block));
    } else {
      this.subscribeToSaveResponse(this.blockService.create(block));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBlock>>): void {
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

  protected updateForm(block: IBlock): void {
    this.block = block;
    this.blockFormService.resetForm(this.editForm, block);

    this.organizationsSharedCollection = this.organizationService.addOrganizationToCollectionIfMissing<IOrganization>(
      this.organizationsSharedCollection,
      block.organization
    );
    this.spacesSharedCollection = this.spaceService.addSpaceToCollectionIfMissing<ISpace>(this.spacesSharedCollection, block.space);
    this.articlesSharedCollection = this.articleService.addArticleToCollectionIfMissing<IArticle>(
      this.articlesSharedCollection,
      block.article
    );
    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, block.author);
  }

  protected loadRelationshipsOptions(): void {
    this.organizationService
      .query()
      .pipe(map((res: HttpResponse<IOrganization[]>) => res.body ?? []))
      .pipe(
        map((organizations: IOrganization[]) =>
          this.organizationService.addOrganizationToCollectionIfMissing<IOrganization>(organizations, this.block?.organization)
        )
      )
      .subscribe((organizations: IOrganization[]) => (this.organizationsSharedCollection = organizations));

    this.spaceService
      .query()
      .pipe(map((res: HttpResponse<ISpace[]>) => res.body ?? []))
      .pipe(map((spaces: ISpace[]) => this.spaceService.addSpaceToCollectionIfMissing<ISpace>(spaces, this.block?.space)))
      .subscribe((spaces: ISpace[]) => (this.spacesSharedCollection = spaces));

    this.articleService
      .query()
      .pipe(map((res: HttpResponse<IArticle[]>) => res.body ?? []))
      .pipe(map((articles: IArticle[]) => this.articleService.addArticleToCollectionIfMissing<IArticle>(articles, this.block?.article)))
      .subscribe((articles: IArticle[]) => (this.articlesSharedCollection = articles));

    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.block?.author)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }
}
