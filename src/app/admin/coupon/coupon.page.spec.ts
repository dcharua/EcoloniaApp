import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CouponPage } from './coupon.page';

describe('CouponPage', () => {
  let component: CouponPage;
  let fixture: ComponentFixture<CouponPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CouponPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CouponPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
