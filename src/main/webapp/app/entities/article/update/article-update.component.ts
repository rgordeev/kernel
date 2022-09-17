import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ArticleFormService, ArticleFormGroup } from './article-form.service';
import { IArticle } from '../article.model';
import { ArticleService } from '../service/article.service';
import { IOrganization } from 'app/entities/organization/organization.model';
import { OrganizationService } from 'app/entities/organization/service/organization.service';
import { ISpace } from 'app/entities/space/space.model';
import { SpaceService } from 'app/entities/space/service/space.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { ArticleStatus } from 'app/entities/enumerations/article-status.model';

@Component({
  selector: 'suz-article-update',
  templateUrl: './article-update.component.html',
})
export class ArticleUpdateComponent implements OnInit {
  isSaving = false;
  article: IArticle | null = null;
  articleStatusValues = Object.keys(ArticleStatus);

  organizationsSharedCollection: IOrganization[] = [];
  spacesSharedCollection: ISpace[] = [];
  usersSharedCollection: IUser[] = [];

  editForm: ArticleFormGroup = this.articleFormService.createArticleFormGroup();

  constructor(
    protected articleService: ArticleService,
    protected articleFormService: ArticleFormService,
    protected organizationService: OrganizationService,
    protected spaceService: SpaceService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareOrganization = (o1: IOrganization | null, o2: IOrganization | null): boolean =>
    this.organizationService.compareOrganization(o1, o2);

  compareSpace = (o1: ISpace | null, o2: ISpace | null): boolean => this.spaceService.compareSpace(o1, o2);

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ article }) => {
      this.article = article;
      if (article) {
        this.updateForm(article);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const article = this.articleFormService.getArticle(this.editForm);
    if (article.id !== null) {
      this.subscribeToSaveResponse(this.articleService.update(article));
    } else {
      this.subscribeToSaveResponse(this.articleService.create(article));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IArticle>>): void {
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

  protected updateForm(article: IArticle): void {
    this.article = article;
    this.articleFormService.resetForm(this.editForm, article);

    this.organizationsSharedCollection = this.organizationService.addOrganizationToCollectionIfMissing<IOrganization>(
      this.organizationsSharedCollection,
      article.organization
    );
    this.spacesSharedCollection = this.spaceService.addSpaceToCollectionIfMissing<ISpace>(this.spacesSharedCollection, article.space);
    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, article.author);
  }

  protected loadRelationshipsOptions(): void {
    this.organizationService
      .query()
      .pipe(map((res: HttpResponse<IOrganization[]>) => res.body ?? []))
      .pipe(
        map((organizations: IOrganization[]) =>
          this.organizationService.addOrganizationToCollectionIfMissing<IOrganization>(organizations, this.article?.organization)
        )
      )
      .subscribe((organizations: IOrganization[]) => (this.organizationsSharedCollection = organizations));

    this.spaceService
      .query()
      .pipe(map((res: HttpResponse<ISpace[]>) => res.body ?? []))
      .pipe(map((spaces: ISpace[]) => this.spaceService.addSpaceToCollectionIfMissing<ISpace>(spaces, this.article?.space)))
      .subscribe((spaces: ISpace[]) => (this.spacesSharedCollection = spaces));

    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.article?.author)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }
}
