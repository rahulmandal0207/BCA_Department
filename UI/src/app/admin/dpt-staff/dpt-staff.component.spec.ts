import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DptStaffComponent } from './dpt-staff.component';

describe('DptStaffComponent', () => {
  let component: DptStaffComponent;
  let fixture: ComponentFixture<DptStaffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DptStaffComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DptStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
