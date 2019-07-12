import { AccessibleTableHeaderDirective } from './accessible-table-header.directive';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, Component } from '@angular/core';
import { By } from '@angular/platform-browser';

@Component({
  template: `
  <div class="list-header" [accessibleHeader]="displayedColumns">
    <div class="header task-id">
      ID
    </div>
    <div class="header task-node">
      Allocated Node
    </div>
    <div class="header task-state">
      State
    </div>
    <div class="header task-remark">
      Remark
    </div>
    <div class="header task-detail">
      Detail
    </div>
  </div>
  `
})
class TestComponent {
  public displayedColumns = ['ID', 'Allocated Node', 'State', 'Remark', 'Detail'];
}


describe('AccessibleTableHeaderDirective', () => {
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      declarations: [AccessibleTableHeaderDirective, TestComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .createComponent(TestComponent);

    fixture.detectChanges();
  });



  it('should create an instance', () => {
    const directive = fixture.debugElement.queryAll(By.directive(AccessibleTableHeaderDirective));
    expect(directive.length).toBe(1);
  });
});
