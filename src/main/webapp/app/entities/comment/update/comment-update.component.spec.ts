import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CommentFormService } from './comment-form.service';
import { CommentService } from '../service/comment.service';
import { IComment } from '../comment.model';
import { IArticle } from 'app/entities/article/article.model';
import { ArticleService } from 'app/entities/article/service/article.service';
import { IBlock } from 'app/entities/block/block.model';
import { BlockService } from 'app/entities/block/service/block.service';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { CommentUpdateComponent } from './comment-update.component';

describe('Comment Management Update Component', () => {
  let comp: CommentUpdateComponent;
  let fixture: ComponentFixture<CommentUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let commentFormService: CommentFormService;
  let commentService: CommentService;
  let articleService: ArticleService;
  let blockService: BlockService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [CommentUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(CommentUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CommentUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    commentFormService = TestBed.inject(CommentFormService);
    commentService = TestBed.inject(CommentService);
    articleService = TestBed.inject(ArticleService);
    blockService = TestBed.inject(BlockService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Article query and add missing value', () => {
      const comment: IComment = { id: 456 };
      const article: IArticle = { id: 41941 };
      comment.article = article;

      const articleCollection: IArticle[] = [{ id: 51260 }];
      jest.spyOn(articleService, 'query').mockReturnValue(of(new HttpResponse({ body: articleCollection })));
      const additionalArticles = [article];
      const expectedCollection: IArticle[] = [...additionalArticles, ...articleCollection];
      jest.spyOn(articleService, 'addArticleToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ comment });
      comp.ngOnInit();

      expect(articleService.query).toHaveBeenCalled();
      expect(articleService.addArticleToCollectionIfMissing).toHaveBeenCalledWith(
        articleCollection,
        ...additionalArticles.map(expect.objectContaining)
      );
      expect(comp.articlesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Block query and add missing value', () => {
      const comment: IComment = { id: 456 };
      const block: IBlock = { id: 61485 };
      comment.block = block;

      const blockCollection: IBlock[] = [{ id: 65709 }];
      jest.spyOn(blockService, 'query').mockReturnValue(of(new HttpResponse({ body: blockCollection })));
      const additionalBlocks = [block];
      const expectedCollection: IBlock[] = [...additionalBlocks, ...blockCollection];
      jest.spyOn(blockService, 'addBlockToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ comment });
      comp.ngOnInit();

      expect(blockService.query).toHaveBeenCalled();
      expect(blockService.addBlockToCollectionIfMissing).toHaveBeenCalledWith(
        blockCollection,
        ...additionalBlocks.map(expect.objectContaining)
      );
      expect(comp.blocksSharedCollection).toEqual(expectedCollection);
    });

    it('Should call User query and add missing value', () => {
      const comment: IComment = { id: 456 };
      const author: IUser = { id: '3dc4748f-cb87-4cb9-83b5-cbb4e2478f36' };
      comment.author = author;

      const userCollection: IUser[] = [{ id: 'df883b00-a789-4cab-8194-ef1c588271d3' }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [author];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ comment });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining)
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const comment: IComment = { id: 456 };
      const article: IArticle = { id: 98289 };
      comment.article = article;
      const block: IBlock = { id: 2553 };
      comment.block = block;
      const author: IUser = { id: '0f4befb6-0d4a-48dd-9683-9d660b70d510' };
      comment.author = author;

      activatedRoute.data = of({ comment });
      comp.ngOnInit();

      expect(comp.articlesSharedCollection).toContain(article);
      expect(comp.blocksSharedCollection).toContain(block);
      expect(comp.usersSharedCollection).toContain(author);
      expect(comp.comment).toEqual(comment);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IComment>>();
      const comment = { id: 123 };
      jest.spyOn(commentFormService, 'getComment').mockReturnValue(comment);
      jest.spyOn(commentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ comment });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: comment }));
      saveSubject.complete();

      // THEN
      expect(commentFormService.getComment).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(commentService.update).toHaveBeenCalledWith(expect.objectContaining(comment));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IComment>>();
      const comment = { id: 123 };
      jest.spyOn(commentFormService, 'getComment').mockReturnValue({ id: null });
      jest.spyOn(commentService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ comment: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: comment }));
      saveSubject.complete();

      // THEN
      expect(commentFormService.getComment).toHaveBeenCalled();
      expect(commentService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IComment>>();
      const comment = { id: 123 };
      jest.spyOn(commentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ comment });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(commentService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareArticle', () => {
      it('Should forward to articleService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(articleService, 'compareArticle');
        comp.compareArticle(entity, entity2);
        expect(articleService.compareArticle).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareBlock', () => {
      it('Should forward to blockService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(blockService, 'compareBlock');
        comp.compareBlock(entity, entity2);
        expect(blockService.compareBlock).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareUser', () => {
      it('Should forward to userService', () => {
        const entity = { id: 'ABC' };
        const entity2 = { id: 'CBA' };
        jest.spyOn(userService, 'compareUser');
        comp.compareUser(entity, entity2);
        expect(userService.compareUser).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
