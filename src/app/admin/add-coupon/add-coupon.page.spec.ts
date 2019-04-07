import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCouponPage } from './add-coupon.page';

describe('AddCouponPage', () => {
  let component: AddCouponPage;
  let fixture: ComponentFixture<AddCouponPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCouponPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCouponPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
