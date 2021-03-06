import { async, ComponentFixture, TestBed, fakeAsync, flush } from '@angular/core/testing';
import { Component, Directive, Input, TrackByFunction, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs/observable/of';
import { FormsModule } from '@angular/forms'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialsModule } from '../../materials.module';
import { ApiService } from '../../services/api.service';
import { JobStateService } from '../../services/job-state/job-state.service';
import { ResultListComponent } from './result-list.component';
import { TableService } from '../../services/table/table.service';
import { ScrollingModule, CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { animationFrameScheduler } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

@Directive({
  selector: '[routerLink]',
  host: { '(click)': 'onClick()' }
})
class RouterLinkDirectiveStub {
  @Input('routerLink') linkParams: any;
  navigatedTo: any = null;

  onClick() {
    this.navigatedTo = this.linkParams;
  }
}

const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
const activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', ['']);

class ApiServiceStub {
  static results = [
    { id: 1, createdAt: '2018-08-01', command: 'a command', state: 'Finished', progress: 100, updatedAt: '2018-08-01' },
    { id: 2, createdAt: '2018-08-01', command: 'a command', state: 'Finished', progress: 100, updatedAt: '2018-08-01' },
    { id: 3, createdAt: '2018-08-01', command: 'a command', state: 'Finished', progress: 100, updatedAt: '2018-08-01' },
    { id: 4, createdAt: '2018-08-01', command: 'a command', state: 'Finished', progress: 100, updatedAt: '2018-08-01' },
  ]

  command = {
    getJobsByPage: () => of(ApiServiceStub.results),
  }
}

class JobStateServiceStub {
  stateClass(state) {
    return 'finished';
  }
  stateIcon(state) {
    return 'done';
  }
}

const TableServiceStub = {
  updateData: (newData, dataSource, propertyName) => newData,
  loadSetting: (key, initVal) => initVal,
  saveSetting: (key, val) => undefined,
  isContentScrolled: () => false
}

function finishInit(fixture: ComponentFixture<any>) {
  // On the first cycle we render and measure the viewport.
  fixture.detectChanges();
  flush();

  // On the second cycle we render the items.
  fixture.detectChanges();
  flush();

  // Flush the initial fake scroll event.
  animationFrameScheduler.flush(null);
  flush();
  fixture.detectChanges();
}

describe('ClusrunResultListComponent', () => {
  let component: ResultListComponent;
  let fixture: ComponentFixture<ResultListComponent>;
  let viewport: CdkVirtualScrollViewport;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        RouterLinkDirectiveStub,
        ResultListComponent,
      ],
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        MaterialsModule,
        ScrollingModule
      ],
      providers: [
        { provide: ApiService, useClass: ApiServiceStub },
        { provide: JobStateService, useClass: JobStateServiceStub },
        { provide: TableService, useValue: TableServiceStub },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultListComponent);
    component = fixture.componentInstance;
    viewport = component.cdkVirtualScrollViewport;
    fixture.detectChanges();
  });

  it('should create', fakeAsync(() => {
    expect(component).toBeTruthy();
    expect(viewport.getDataLength()).toEqual(4);
    // finishInit(fixture);
    // flush();
    // fixture.detectChanges();
    // flush();
    // console.log(viewport.getDataLength());

    // viewport.setRenderedRange({ start: 0, end: 3 });
    // viewport.checkViewportSize();
    // fixture.detectChanges();
    // flush();

    // animationFrameScheduler.flush(null);
    // flush();
    // fixture.detectChanges();

    // console.log(viewport.getRenderedRange());
    // console.log(component.dataSource);
    // const contentWrapper =
    //   viewport.elementRef.nativeElement.querySelector('.cdk-virtual-scroll-content-wrapper');
    // console.log(contentWrapper.children.length);

    // console.log(fixture.nativeElement.querySelectorAll('.list-item'));
    // let text = fixture.nativeElement.querySelector('.list-item .job-command').textContent;
    // expect(text).toContain(ApiServiceStub.results[0].command);
  }));
});
