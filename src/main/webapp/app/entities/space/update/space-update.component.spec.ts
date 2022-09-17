import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { SpaceFormService } from './space-form.service';
import { SpaceService } from '../service/space.service';
import { ISpace } from '../space.model';
import { IOrganization } from 'app/entities/organization/organization.model';
import { OrganizationService } from 'app/entities/organization/service/organization.service';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { SpaceUpdateComponent } from './space-update.component';

describe('Space Management Update Component', () => {
  let comp: SpaceUpdateComponent;
  let fixture: ComponentFixture<SpaceUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let spaceFormService: SpaceFormService;
  let spaceService: SpaceService;
  let organizationService: OrganizationService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [SpaceUpdateComponent],
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
      .overrideTemplate(SpaceUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SpaceUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    spaceFormService = TestBed.inject(SpaceFormService);
    spaceService = TestBed.inject(SpaceService);
    organizationService = TestBed.inject(OrganizationService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Organization query and add missing value', () => {
      const space: ISpace = { id: 456 };
      const organization: IOrganization = { id: 22829 };
      space.organization = organization;

      const organizationCollection: IOrganization[] = [{ id: 75111 }];
      jest.spyOn(organizationService, 'query').mockReturnValue(of(new HttpResponse({ body: organizationCollection })));
      const additionalOrganizations = [organization];
      const expectedCollection: IOrganization[] = [...additionalOrganizations, ...organizationCollection];
      jest.spyOn(organizationService, 'addOrganizationToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ space });
      comp.ngOnInit();

      expect(organizationService.query).toHaveBeenCalled();
      expect(organizationService.addOrganizationToCollectionIfMissing).toHaveBeenCalledWith(
        organizationCollection,
        ...additionalOrganizations.map(expect.objectContaining)
      );
      expect(comp.organizationsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call User query and add missing value', () => {
      const space: ISpace = { id: 456 };
      const owner: IUser = { id: '93dca98e-7cd3-420c-ac2e-3ea71fa33ccc' };
      space.owner = owner;

      const userCollection: IUser[] = [{ id: '505aaaa3-eb6a-458d-a8e1-b7950cb1c964' }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [owner];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ space });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining)
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const space: ISpace = { id: 456 };
      const organization: IOrganization = { id: 47477 };
      space.organization = organization;
      const owner: IUser = { id: '2747e8f7-b81e-46bf-881f-3e62a0b09ad1' };
      space.owner = owner;

      activatedRoute.data = of({ space });
      comp.ngOnInit();

      expect(comp.organizationsSharedCollection).toContain(organization);
      expect(comp.usersSharedCollection).toContain(owner);
      expect(comp.space).toEqual(space);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISpace>>();
      const space = { id: 123 };
      jest.spyOn(spaceFormService, 'getSpace').mockReturnValue(space);
      jest.spyOn(spaceService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ space });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: space }));
      saveSubject.complete();

      // THEN
      expect(spaceFormService.getSpace).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(spaceService.update).toHaveBeenCalledWith(expect.objectContaining(space));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISpace>>();
      const space = { id: 123 };
      jest.spyOn(spaceFormService, 'getSpace').mockReturnValue({ id: null });
      jest.spyOn(spaceService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ space: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: space }));
      saveSubject.complete();

      // THEN
      expect(spaceFormService.getSpace).toHaveBeenCalled();
      expect(spaceService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISpace>>();
      const space = { id: 123 };
      jest.spyOn(spaceService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ space });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(spaceService.update).toHaveBeenCalled();
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
