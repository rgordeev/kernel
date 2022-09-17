import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { AttachmentFormService } from './attachment-form.service';
import { AttachmentService } from '../service/attachment.service';
import { IAttachment } from '../attachment.model';
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

import { AttachmentUpdateComponent } from './attachment-update.component';

describe('Attachment Management Update Component', () => {
  let comp: AttachmentUpdateComponent;
  let fixture: ComponentFixture<AttachmentUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let attachmentFormService: AttachmentFormService;
  let attachmentService: AttachmentService;
  let organizationService: OrganizationService;
  let spaceService: SpaceService;
  let articleService: ArticleService;
  let userService: UserService;
  let commentService: CommentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [AttachmentUpdateComponent],
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
      .overrideTemplate(AttachmentUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AttachmentUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    attachmentFormService = TestBed.inject(AttachmentFormService);
    attachmentService = TestBed.inject(AttachmentService);
    organizationService = TestBed.inject(OrganizationService);
    spaceService = TestBed.inject(SpaceService);
    articleService = TestBed.inject(ArticleService);
    userService = TestBed.inject(UserService);
    commentService = TestBed.inject(CommentService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Organization query and add missing value', () => {
      const attachment: IAttachment = { id: 456 };
      const organization: IOrganization = { id: 17428 };
      attachment.organization = organization;

      const organizationCollection: IOrganization[] = [{ id: 90331 }];
      jest.spyOn(organizationService, 'query').mockReturnValue(of(new HttpResponse({ body: organizationCollection })));
      const additionalOrganizations = [organization];
      const expectedCollection: IOrganization[] = [...additionalOrganizations, ...organizationCollection];
      jest.spyOn(organizationService, 'addOrganizationToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ attachment });
      comp.ngOnInit();

      expect(organizationService.query).toHaveBeenCalled();
      expect(organizationService.addOrganizationToCollectionIfMissing).toHaveBeenCalledWith(
        organizationCollection,
        ...additionalOrganizations.map(expect.objectContaining)
      );
      expect(comp.organizationsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Space query and add missing value', () => {
      const attachment: IAttachment = { id: 456 };
      const space: ISpace = { id: 78779 };
      attachment.space = space;

      const spaceCollection: ISpace[] = [{ id: 49299 }];
      jest.spyOn(spaceService, 'query').mockReturnValue(of(new HttpResponse({ body: spaceCollection })));
      const additionalSpaces = [space];
      const expectedCollection: ISpace[] = [...additionalSpaces, ...spaceCollection];
      jest.spyOn(spaceService, 'addSpaceToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ attachment });
      comp.ngOnInit();

      expect(spaceService.query).toHaveBeenCalled();
      expect(spaceService.addSpaceToCollectionIfMissing).toHaveBeenCalledWith(
        spaceCollection,
        ...additionalSpaces.map(expect.objectContaining)
      );
      expect(comp.spacesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Article query and add missing value', () => {
      const attachment: IAttachment = { id: 456 };
      const article: IArticle = { id: 31936 };
      attachment.article = article;

      const articleCollection: IArticle[] = [{ id: 67831 }];
      jest.spyOn(articleService, 'query').mockReturnValue(of(new HttpResponse({ body: articleCollection })));
      const additionalArticles = [article];
      const expectedCollection: IArticle[] = [...additionalArticles, ...articleCollection];
      jest.spyOn(articleService, 'addArticleToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ attachment });
      comp.ngOnInit();

      expect(articleService.query).toHaveBeenCalled();
      expect(articleService.addArticleToCollectionIfMissing).toHaveBeenCalledWith(
        articleCollection,
        ...additionalArticles.map(expect.objectContaining)
      );
      expect(comp.articlesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call User query and add missing value', () => {
      const attachment: IAttachment = { id: 456 };
      const owner: IUser = { id: '1e31be96-a1ca-4c18-96cd-67c0ce61e044' };
      attachment.owner = owner;

      const userCollection: IUser[] = [{ id: '8188ad76-a54e-4c6a-a58f-7847a06789f4' }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [owner];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ attachment });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining)
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Comment query and add missing value', () => {
      const attachment: IAttachment = { id: 456 };
      const comment: IComment = { id: 78783 };
      attachment.comment = comment;

      const commentCollection: IComment[] = [{ id: 61767 }];
      jest.spyOn(commentService, 'query').mockReturnValue(of(new HttpResponse({ body: commentCollection })));
      const additionalComments = [comment];
      const expectedCollection: IComment[] = [...additionalComments, ...commentCollection];
      jest.spyOn(commentService, 'addCommentToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ attachment });
      comp.ngOnInit();

      expect(commentService.query).toHaveBeenCalled();
      expect(commentService.addCommentToCollectionIfMissing).toHaveBeenCalledWith(
        commentCollection,
        ...additionalComments.map(expect.objectContaining)
      );
      expect(comp.commentsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const attachment: IAttachment = { id: 456 };
      const organization: IOrganization = { id: 43264 };
      attachment.organization = organization;
      const space: ISpace = { id: 42366 };
      attachment.space = space;
      const article: IArticle = { id: 27917 };
      attachment.article = article;
      const owner: IUser = { id: '73f3bfd4-4e19-42c9-87fe-3297026e749b' };
      attachment.owner = owner;
      const comment: IComment = { id: 98022 };
      attachment.comment = comment;

      activatedRoute.data = of({ attachment });
      comp.ngOnInit();

      expect(comp.organizationsSharedCollection).toContain(organization);
      expect(comp.spacesSharedCollection).toContain(space);
      expect(comp.articlesSharedCollection).toContain(article);
      expect(comp.usersSharedCollection).toContain(owner);
      expect(comp.commentsSharedCollection).toContain(comment);
      expect(comp.attachment).toEqual(attachment);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAttachment>>();
      const attachment = { id: 123 };
      jest.spyOn(attachmentFormService, 'getAttachment').mockReturnValue(attachment);
      jest.spyOn(attachmentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ attachment });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: attachment }));
      saveSubject.complete();

      // THEN
      expect(attachmentFormService.getAttachment).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(attachmentService.update).toHaveBeenCalledWith(expect.objectContaining(attachment));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAttachment>>();
      const attachment = { id: 123 };
      jest.spyOn(attachmentFormService, 'getAttachment').mockReturnValue({ id: null });
      jest.spyOn(attachmentService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ attachment: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: attachment }));
      saveSubject.complete();

      // THEN
      expect(attachmentFormService.getAttachment).toHaveBeenCalled();
      expect(attachmentService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAttachment>>();
      const attachment = { id: 123 };
      jest.spyOn(attachmentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ attachment });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(attachmentService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareOrganization', () => {
      it('Should forward to organizationService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(organizationService, 'compareOrganization');
        comp.compareOrganization(entity, entity2);
        expect(organizationService.compareOrganization).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareSpace', () => {
      it('Should forward to spaceService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(spaceService, 'compareSpace');
        comp.compareSpace(entity, entity2);
        expect(spaceService.compareSpace).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareArticle', () => {
      it('Should forward to articleService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(articleService, 'compareArticle');
        comp.compareArticle(entity, entity2);
        expect(articleService.compareArticle).toHaveBeenCalledWith(entity, entity2);
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

    describe('compareComment', () => {
      it('Should forward to commentService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(commentService, 'compareComment');
        comp.compareComment(entity, entity2);
        expect(commentService.compareComment).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
