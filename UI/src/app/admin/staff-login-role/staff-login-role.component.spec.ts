import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffLoginRoleComponent } from './staff-login-role.component';

describe('StaffLoginRoleComponent', () => {
  let component: StaffLoginRoleComponent;
  let fixture: ComponentFixture<StaffLoginRoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StaffLoginRoleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StaffLoginRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
