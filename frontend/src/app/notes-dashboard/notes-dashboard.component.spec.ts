import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotesDashboardComponent } from './notes-dashboard.component';

describe('NotesDashboardComponent', () => {
  let component: NotesDashboardComponent;
  let fixture: ComponentFixture<NotesDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NotesDashboardComponent]
    });
    fixture = TestBed.createComponent(NotesDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
