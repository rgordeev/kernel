import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { SpaceDetailComponent } from './space-detail.component';

describe('Space Management Detail Component', () => {
  let comp: SpaceDetailComponent;
  let fixture: ComponentFixture<SpaceDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SpaceDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ space: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(SpaceDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(SpaceDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load space on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.space).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
