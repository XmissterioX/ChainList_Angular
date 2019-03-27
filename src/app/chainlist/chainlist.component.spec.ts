import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChainlistComponent } from './chainlist.component';

describe('ChainlistComponent', () => {
  let component: ChainlistComponent;
  let fixture: ComponentFixture<ChainlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChainlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChainlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
