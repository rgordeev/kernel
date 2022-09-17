import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { BlockFormService } from './block-form.service';
import { BlockService } from '../service/block.service';
import { IBlock } from '../block.model';
import { IOrganization } from 'app/entities/organization/organization.model';
import { OrganizationService } from 'app/entities/organization/service/organization.service';
import { ISpace } from 'app/entities/space/space.model';
import { SpaceService } from 'app/entities/space/service/space.service';
import { IArticle } from 'app/entities/article/article.model';
import { ArticleService } from 'app/entities/article/service/article.service';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { BlockUpdateComponent } from './block-update.component';

describe('Block Management Update Component', () => {
  let comp: BlockUpdateComponent;
  let fixture: ComponentFixture<BlockUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let blockFormService: BlockFormService;
  let blockService: BlockService;
  let organizationService: OrganizationService;
  let spaceService: SpaceService;
  let articleService: ArticleService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [BlockUpdateComponent],
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
      .overrideTemplate(BlockUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BlockUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    blockFormService = TestBed.inject(BlockFormService);
    blockService = TestBed.inject(BlockService);
    organizationService = TestBed.inject(OrganizationService);
    spaceService = TestBed.inject(SpaceService);
    articleService = TestBed.inject(ArticleService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Organization query and add missing value', () => {
      const block: IBlock = { id: 456 };
      const organization: IOrganization = { id: 8677 };
      block.organization = organization;

      const organizationCollection: IOrganization[] = [{ id: 64875 }];
      jest.spyOn(organizationService, 'query').mockReturnValue(of(new HttpResponse({ body: organizationCollection })));
      const additionalOrganizations = [organization];
      const expectedCollection: IOrganization[] = [...additionalOrganizations, ...organizationCollection];
      jest.spyOn(organizationService, 'addOrganizationToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ block });
      comp.ngOnInit();

      expect(organizationService.query).toHaveBeenCalled();
      expect(organizationService.addOrganizationToCollectionIfMissing).toHaveBeenCalledWith(
        organizationCollection,
        ...additionalOrganizations.map(expect.objectContaining)
      );
      expect(comp.organizationsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Space query and add missing value', () => {
      const block: IBlock = { id: 456 };
      const space: ISpace = { id: 88390 };
      block.space = space;

      const spaceCollection: ISpace[] = [{ id: 73541 }];
      jest.spyOn(spaceService, 'query').mockReturnValue(of(new HttpResponse({ body: spaceCollection })));
      const additionalSpaces = [space];
      const expectedCollection: ISpace[] = [...additionalSpaces, ...spaceCollection];
      jest.spyOn(spaceService, 'addSpaceToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ block });
      comp.ngOnInit();

      expect(spaceService.query).toHaveBeenCalled();
      expect(spaceService.addSpaceToCollectionIfMissing).toHaveBeenCalledWith(
        spaceCollection,
        ...additionalSpaces.map(expect.objectContaining)
      );
      expect(comp.spacesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Article query and add missing value', () => {
      const block: IBlock = { id: 456 };
      const article: IArticle = { id: 8258 };
      block.article = article;

      const articleCollection: IArticle[] = [{ id: 22085 }];
      jest.spyOn(articleService, 'query').mockReturnValue(of(new HttpResponse({ body: articleCollection })));
      const additionalArticles = [article];
      const expectedCollection: IArticle[] = [...additionalArticles, ...articleCollection];
      jest.spyOn(articleService, 'addArticleToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ block });
      comp.ngOnInit();

      expect(articleService.query).toHaveBeenCalled();
      expect(articleService.addArticleToCollectionIfMissing).toHaveBeenCalledWith(
        articleCollection,
        ...additionalArticles.map(expect.objectContaining)
      );
      expect(comp.articlesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call User query and add missing value', () => {
      const block: IBlock = { id: 456 };
      const author: IUser = { id: '2c1cb847-a22c-4e1e-9fc7-560c75fe3f04' };
      block.author = author;

      const userCollection: IUser[] = [{ id: '980ace05-f1cf-407f-a595-419b43c98ba6' }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [author];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ block });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining)
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const block: IBlock = { id: 456 };
      const organization: IOrganization = { id: 40281 };
      block.organization = organization;
      const space: ISpace = { id: 17277 };
      block.space = space;
      const article: IArticle = { id: 18679 };
      block.article = article;
      const author: IUser = { id: '5042980c-6122-467c-8dc3-e3a390b058f6' };
      block.author = author;

      activatedRoute.data = of({ block });
      comp.ngOnInit();

      expect(comp.organizationsSharedCollection).toContain(organization);
      expect(comp.spacesSharedCollection).toContain(space);
      expect(comp.articlesSharedCollection).toContain(article);
      expect(comp.usersSharedCollection).toContain(author);
      expect(comp.block).toEqual(block);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBlock>>();
      const block = { id: 123 };
      jest.spyOn(blockFormService, 'getBlock').mockReturnValue(block);
      jest.spyOn(blockService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ block });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: block }));
      saveSubject.complete();

      // THEN
      expect(blockFormService.getBlock).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(blockService.update).toHaveBeenCalledWith(expect.objectContaining(block));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBlock>>();
      const block = { id: 123 };
      jest.spyOn(blockFormService, 'getBlock').mockReturnValue({ id: null });
      jest.spyOn(blockService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ block: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: block }));
      saveSubject.complete();

      // THEN
      expect(blockFormService.getBlock).toHaveBeenCalled();
      expect(blockService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBlock>>();
      const block = { id: 123 };
      jest.spyOn(blockService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ block });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(blockService.update).toHaveBeenCalled();
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
  });
});
