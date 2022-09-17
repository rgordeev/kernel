import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { CommentFormService, CommentFormGroup } from './comment-form.service';
import { IComment } from '../comment.model';
import { CommentService } from '../service/comment.service';
import { IArticle } from 'app/entities/article/article.model';
import { ArticleService } from 'app/entities/article/service/article.service';
import { IBlock } from 'app/entities/block/block.model';
import { BlockService } from 'app/entities/block/service/block.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

@Component({
  selector: 'suz-comment-update',
  templateUrl: './comment-update.component.html',
})
export class CommentUpdateComponent implements OnInit {
  isSaving = false;
  comment: IComment | null = null;

  articlesSharedCollection: IArticle[] = [];
  blocksSharedCollection: IBlock[] = [];
  usersSharedCollection: IUser[] = [];

  editForm: CommentFormGroup = this.commentFormService.createCommentFormGroup();

  constructor(
    protected commentService: CommentService,
    protected commentFormService: CommentFormService,
    protected articleService: ArticleService,
    protected blockService: BlockService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareArticle = (o1: IArticle | null, o2: IArticle | null): boolean => this.articleService.compareArticle(o1, o2);

  compareBlock = (o1: IBlock | null, o2: IBlock | null): boolean => this.blockService.compareBlock(o1, o2);

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ comment }) => {
      this.comment = comment;
      if (comment) {
        this.updateForm(comment);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const comment = this.commentFormService.getComment(this.editForm);
    if (comment.id !== null) {
      this.subscribeToSaveResponse(this.commentService.update(comment));
    } else {
      this.subscribeToSaveResponse(this.commentService.create(comment));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IComment>>): void {
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

  protected updateForm(comment: IComment): void {
    this.comment = comment;
    this.commentFormService.resetForm(this.editForm, comment);

    this.articlesSharedCollection = this.articleService.addArticleToCollectionIfMissing<IArticle>(
      this.articlesSharedCollection,
      comment.article
    );
    this.blocksSharedCollection = this.blockService.addBlockToCollectionIfMissing<IBlock>(this.blocksSharedCollection, comment.block);
    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, comment.author);
  }

  protected loadRelationshipsOptions(): void {
    this.articleService
      .query()
      .pipe(map((res: HttpResponse<IArticle[]>) => res.body ?? []))
      .pipe(map((articles: IArticle[]) => this.articleService.addArticleToCollectionIfMissing<IArticle>(articles, this.comment?.article)))
      .subscribe((articles: IArticle[]) => (this.articlesSharedCollection = articles));

    this.blockService
      .query()
      .pipe(map((res: HttpResponse<IBlock[]>) => res.body ?? []))
      .pipe(map((blocks: IBlock[]) => this.blockService.addBlockToCollectionIfMissing<IBlock>(blocks, this.comment?.block)))
      .subscribe((blocks: IBlock[]) => (this.blocksSharedCollection = blocks));

    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.comment?.author)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }
}
