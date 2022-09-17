import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { AttachmentFormService, AttachmentFormGroup } from './attachment-form.service';
import { IAttachment } from '../attachment.model';
import { AttachmentService } from '../service/attachment.service';
import { IOrganization } from 'app/entities/organization/organization.model';
import { OrganizationService } from 'app/entities/organization/service/organization.service';
import { ISpace } from 'app/entities/space/space.model';
import { SpaceService } from 'app/entities/space/service/space.service';
import { IArticle } from 'app/entities/article/article.model';
import { ArticleService } from 'app/entities/article/service/article.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IComment } from 'app/entities/comment/comment.model';
import { CommentService } from 'app/entities/comment/service/comment.service';

@Component({
  selector: 'suz-attachment-update',
  templateUrl: './attachment-update.component.html',
})
export class AttachmentUpdateComponent implements OnInit {
  isSaving = false;
  attachment: IAttachment | null = null;

  organizationsSharedCollection: IOrganization[] = [];
  spacesSharedCollection: ISpace[] = [];
  articlesSharedCollection: IArticle[] = [];
  usersSharedCollection: IUser[] = [];
  commentsSharedCollection: IComment[] = [];

  editForm: AttachmentFormGroup = this.attachmentFormService.createAttachmentFormGroup();

  constructor(
    protected attachmentService: AttachmentService,
    protected attachmentFormService: AttachmentFormService,
    protected organizationService: OrganizationService,
    protected spaceService: SpaceService,
    protected articleService: ArticleService,
    protected userService: UserService,
    protected commentService: CommentService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareOrganization = (o1: IOrganization | null, o2: IOrganization | null): boolean =>
    this.organizationService.compareOrganization(o1, o2);

  compareSpace = (o1: ISpace | null, o2: ISpace | null): boolean => this.spaceService.compareSpace(o1, o2);

  compareArticle = (o1: IArticle | null, o2: IArticle | null): boolean => this.articleService.compareArticle(o1, o2);

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  compareComment = (o1: IComment | null, o2: IComment | null): boolean => this.commentService.compareComment(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ attachment }) => {
      this.attachment = attachment;
      if (attachment) {
        this.updateForm(attachment);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const attachment = this.attachmentFormService.getAttachment(this.editForm);
    if (attachment.id !== null) {
      this.subscribeToSaveResponse(this.attachmentService.update(attachment));
    } else {
      this.subscribeToSaveResponse(this.attachmentService.create(attachment));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAttachment>>): void {
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

  protected updateForm(attachment: IAttachment): void {
    this.attachment = attachment;
    this.attachmentFormService.resetForm(this.editForm, attachment);

    this.organizationsSharedCollection = this.organizationService.addOrganizationToCollectionIfMissing<IOrganization>(
      this.organizationsSharedCollection,
      attachment.organization
    );
    this.spacesSharedCollection = this.spaceService.addSpaceToCollectionIfMissing<ISpace>(this.spacesSharedCollection, attachment.space);
    this.articlesSharedCollection = this.articleService.addArticleToCollectionIfMissing<IArticle>(
      this.articlesSharedCollection,
      attachment.article
    );
    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, attachment.owner);
    this.commentsSharedCollection = this.commentService.addCommentToCollectionIfMissing<IComment>(
      this.commentsSharedCollection,
      attachment.comment
    );
  }

  protected loadRelationshipsOptions(): void {
    this.organizationService
      .query()
      .pipe(map((res: HttpResponse<IOrganization[]>) => res.body ?? []))
      .pipe(
        map((organizations: IOrganization[]) =>
          this.organizationService.addOrganizationToCollectionIfMissing<IOrganization>(organizations, this.attachment?.organization)
        )
      )
      .subscribe((organizations: IOrganization[]) => (this.organizationsSharedCollection = organizations));

    this.spaceService
      .query()
      .pipe(map((res: HttpResponse<ISpace[]>) => res.body ?? []))
      .pipe(map((spaces: ISpace[]) => this.spaceService.addSpaceToCollectionIfMissing<ISpace>(spaces, this.attachment?.space)))
      .subscribe((spaces: ISpace[]) => (this.spacesSharedCollection = spaces));

    this.articleService
      .query()
      .pipe(map((res: HttpResponse<IArticle[]>) => res.body ?? []))
      .pipe(
        map((articles: IArticle[]) => this.articleService.addArticleToCollectionIfMissing<IArticle>(articles, this.attachment?.article))
      )
      .subscribe((articles: IArticle[]) => (this.articlesSharedCollection = articles));

    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.attachment?.owner)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));

    this.commentService
      .query()
      .pipe(map((res: HttpResponse<IComment[]>) => res.body ?? []))
      .pipe(
        map((comments: IComment[]) => this.commentService.addCommentToCollectionIfMissing<IComment>(comments, this.attachment?.comment))
      )
      .subscribe((comments: IComment[]) => (this.commentsSharedCollection = comments));
  }
}
