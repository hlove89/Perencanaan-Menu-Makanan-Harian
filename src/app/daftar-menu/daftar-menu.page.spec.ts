import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DaftarMenuPage } from './daftar-menu.page';

describe('DaftarMenuPage', () => {
  let component: DaftarMenuPage;
  let fixture: ComponentFixture<DaftarMenuPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DaftarMenuPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
