import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableHeaderColumnComponent } from './table-header-column.component';

describe('TableHeaderComponent', () => {
  let component: TableHeaderColumnComponent;
  let fixture: ComponentFixture<TableHeaderColumnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableHeaderColumnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableHeaderColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
