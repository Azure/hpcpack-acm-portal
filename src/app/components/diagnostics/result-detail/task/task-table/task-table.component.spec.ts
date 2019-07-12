import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskTableComponent } from './task-table.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { JobStateService, TableService } from 'app/services';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { SharedModule } from 'app/shared.module';
import { VirtualScrollTableModule } from 'app/widgets';

const TableServiceStub = {
  updateData: (newData, dataSource, propertyName) => newData,
  loadSetting: (key, initVal) => initVal,
  saveSetting: (key, val) => undefined,
  isContentScrolled: () => false
}

class JobStateServiceStub {
  stateClass(state) {
    return 'finished';
  }
  stateIcon(state) {
    return 'done';
  }
}

describe('TaskTableComponent', () => {
  let component: TaskTableComponent;
  let fixture: ComponentFixture<TaskTableComponent>;
  let viewport: CdkVirtualScrollViewport;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TaskTableComponent
      ],
      imports: [
        SharedModule,
        VirtualScrollTableModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: JobStateService, useClass: JobStateServiceStub },
        { provide: TableService, useValue: TableServiceStub }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskTableComponent);
    component = fixture.componentInstance;
    component.tableName = "test";
    component.customizableColumns = [
      { name: 'nodes', displayName: 'Nodes', displayed: true }
    ];
    component.dataSource = [{
      customizedData: "node1,node2",
      state: "Finished"
    }];
    component.loadFinished = false;
    component.maxPageSize = 120;
    viewport = component.cdkVirtualScrollViewport;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(viewport.getDataLength()).toEqual(1);
  });
});
