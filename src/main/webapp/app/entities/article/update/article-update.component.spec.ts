import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ArticleFormService } from './article-form.service';
import { ArticleService } from '../service/article.service';
import { IArticle } from '../article.model';
import { IOrganization } from 'app/entities/organization/organization.model';
import { OrganizationService } from 'app/entities/organization/service/organization.service';
import { ISpace } from 'app/entities/space/space.model';
import { SpaceService } from 'app/entities/space/service/space.service';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { ArticleUpdateComponent } from './article-update.component';

describe('Article Management Update Component', () => {
  let comp: ArticleUpdateComponent;
  let fixture: ComponentFixture<ArticleUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let articleFormService: ArticleFormService;
  let articleService: ArticleService;
  let organizationService: OrganizationService;
  let spaceService: SpaceService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ArticleUpdateComponent],
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
      .overrideTemplate(ArticleUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ArticleUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    articleFormService = TestBed.inject(ArticleFormService);
    articleService = TestBed.inject(ArticleService);
    organizationService = TestBed.inject(OrganizationService);
    spaceService = TestBed.inject(SpaceService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Organization query and add missing value', () => {
      const article: IArticle = { id: 456 };
      const organization: IOrganization = { id: 95592 };
      article.organization = organization;

      const organizationCollection: IOrganization[] = [{ id: 49675 }];
      jest.spyOn(organizationService, 'query').mockReturnValue(of(new HttpResponse({ body: organizationCollection })));
      const additionalOrganizations = [organization];
      const expectedCollection: IOrganization[] = [...additionalOrganizations, ...organizationCollection];
      jest.spyOn(organizationService, 'addOrganizationToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ article });
      comp.ngOnInit();

      expect(organizationService.query).toHaveBeenCalled();
      expect(organizationService.addOrganizationToCollectionIfMissing).toHaveBeenCalledWith(
        organizationCollection,
        ...additionalOrganizations.map(expect.objectContaining)
      );
      expect(comp.organizationsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Space query and add missing value', () => {
      const article: IArticle = { id: 456 };
      const space: ISpace = { id: 58133 };
      article.space = space;

      const spaceCollection: ISpace[] = [{ id: 42872 }];
      jest.spyOn(spaceService, 'query').mockReturnValue(of(new HttpResponse({ body: spaceCollection })));
      const additionalSpaces = [space];
      const expectedCollection: ISpace[] = [...additionalSpaces, ...spaceCollection];
      jest.spyOn(spaceService, 'addSpaceToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ article });
      comp.ngOnInit();

      expect(spaceService.query).toHaveBeenCalled();
      expect(spaceService.addSpaceToCollectionIfMissing).toHaveBeenCalledWith(
        spaceCollection,
        ...additionalSpaces.map(expect.objectContaining)
      );
      expect(comp.spacesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call User query and add missing value', () => {
      const article: IArticle = { id: 456 };
      const author: IUser = { id: 'ddc66154-9bdd-4011-88fe-566150d5aee0' };
      article.author = author;

      const userCollection: IUser[] = [{ id: '458b8b7b-8476-495e-8cef-a61586e84ef7' }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [author];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ article });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining)
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const article: IArticle = { id: 456 };
      const organization: IOrganization = { id: 52423 };
      article.organization = organization;
      const space: ISpace = { id: 71937 };
      article.space = space;
      const author: IUser = { id: '42c04810-8242-403e-83c2-2edf0c941fc3' };
      article.author = author;

      activatedRoute.data = of({ article });
      comp.ngOnInit();

      expect(comp.organizationsSharedCollection).toContain(organization);
      expect(comp.spacesSharedCollection).toContain(space);
      expect(comp.usersSharedCollection).toContain(author);
      expect(comp.article).toEqual(article);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IArticle>>();
      const article = { id: 123 };
      jest.spyOn(articleFormService, 'getArticle').mockReturnValue(article);
      jest.spyOn(articleService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ article });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: article }));
      saveSubject.complete();

      // THEN
      expect(articleFormService.getArticle).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(articleService.update).toHaveBeenCalledWith(expect.objectContaining(article));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IArticle>>();
      const article = { id: 123 };
      jest.spyOn(articleFormService, 'getArticle').mockReturnValue({ id: null });
      jest.spyOn(articleService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ article: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: article }));
      saveSubject.complete();

      // THEN
      expect(articleFormService.getArticle).toHaveBeenCalled();
      expect(articleService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IArticle>>();
      const article = { id: 123 };
      jest.spyOn(articleService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ article });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(articleService.update).toHaveBeenCalled();
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
