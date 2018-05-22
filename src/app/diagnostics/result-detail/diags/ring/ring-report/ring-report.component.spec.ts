import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Input, ViewChild } from '@angular/core';
import { of } from 'rxjs/observable/of';
import { RingReportComponent } from './ring-report.component';
import { MaterialsModule } from '../../../../../materials.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ApiService } from '../../../../../services/api.service';
import { TableSettingsService } from '../../../../../services/table-settings.service';

@Component({ selector: 'app-result-layout', template: '' })
class ResultLayoutComponent {
  @Input()
  result: any;
}

@Component({ selector: 'ring-overview-result', template: '' })
class RingOverviewResultComponent {
  @Input()
  result: any;
}

@Component({ selector: 'diag-task-table', template: '' })
class DiagTaskTableComponent {
  @Input()
  dataSource: any;

  @Input()
  customizableColumns: any;

  @Input()
  tableName: any;
}

@Component({
  template: `
    <div class="error-message" *ngIf="result.aggregationResult != undefined && result.aggregationResult.Error != undefined">{{result.aggregationResult.Error}}</div>
  `
})
class WrapperComponent {
  public result = { aggregationResult: { Error: "error message" } };
}

class ApiServiceStub {
  static taskResult = [{
    customizedData: "evancvmss000002,evancvmss000006",
    jobId: 302,
    nodeName: "EVANCVMSS000002",
    state: "Finished"
  }];

  static jobResult = {
    id: 302,
    name: "pingpong",
    aggregationResult: { Error: "error message" }
  };

  diag = {
    getDiagTasks: (id: any) => of(ApiServiceStub.taskResult),
    getDiagJob: (id: any) => of(ApiServiceStub.jobResult),
    isJSON: () => { return true; }
  }
}

const tableSettingsStub = {
  load: (key, initVal) => initVal,

  save: (key, val) => undefined
}


fdescribe('RingReportComponent', () => {
  let component: RingReportComponent;
  let fixture: ComponentFixture<RingReportComponent>;

  let wrapperComponent: WrapperComponent;
  let wrapperFixture: ComponentFixture<WrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        RingReportComponent,
        ResultLayoutComponent,
        RingOverviewResultComponent,
        DiagTaskTableComponent,
        WrapperComponent
      ],
      imports: [MaterialsModule, NoopAnimationsModule],
      providers: [
        { provide: ApiService, useClass: ApiServiceStub },
        { provide: TableSettingsService, useValue: tableSettingsStub }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RingReportComponent);
    component = fixture.componentInstance;

    wrapperFixture = TestBed.createComponent(WrapperComponent);
    wrapperComponent = wrapperFixture.componentInstance;

    component.result = { aggregationResult: { Error: "error message" } };

    fixture.detectChanges();
    wrapperFixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show error message', () => {
    let wrapperComponent = wrapperFixture.componentInstance;
    let itemElement = wrapperFixture.debugElement.nativeElement;
    let text = itemElement.querySelector(".error-message").textContent;
    expect(text).toEqual('error message');
  });
});