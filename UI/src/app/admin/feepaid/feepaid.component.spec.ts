import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeepaidComponent } from './feepaid.component';

describe('FeepaidComponent', () => {
  let component: FeepaidComponent;
  let fixture: ComponentFixture<FeepaidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeepaidComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeepaidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
