import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionSubjectComponent } from './session-subject.component';

describe('SessionSubjectComponent', () => {
  let component: SessionSubjectComponent;
  let fixture: ComponentFixture<SessionSubjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SessionSubjectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SessionSubjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
