import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemeNavSidebarComponent } from './theme-nav-sidebar.component';

describe('ThemeNavSidebarComponent', () => {
  let component: ThemeNavSidebarComponent;
  let fixture: ComponentFixture<ThemeNavSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThemeNavSidebarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemeNavSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
