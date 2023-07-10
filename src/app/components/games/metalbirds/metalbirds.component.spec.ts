import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetalbirdsComponent } from './metalbirds.component';

describe('MetalbirdsComponent', () => {
  let component: MetalbirdsComponent;
  let fixture: ComponentFixture<MetalbirdsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MetalbirdsComponent]
    });
    fixture = TestBed.createComponent(MetalbirdsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
