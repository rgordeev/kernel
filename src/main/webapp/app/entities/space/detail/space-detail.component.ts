import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ISpace } from '../space.model';

@Component({
  selector: 'suz-space-detail',
  templateUrl: './space-detail.component.html',
})
export class SpaceDetailComponent implements OnInit {
  space: ISpace | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ space }) => {
      this.space = space;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
