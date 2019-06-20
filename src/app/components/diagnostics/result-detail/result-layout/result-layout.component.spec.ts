import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ResultLayoutComponent } from './result-layout.component';
import { of } from 'rxjs/observable/of';
import { ApiService, JobStateService } from 'app/services';
import { Router } from '@angular/router';
import { SharedModule } from 'app/shared.module';

const routerStub = {
  navigate: () => { },
}

class ApiServiceStub {
  static result = "\"Job is canceled\"";

  diag = {
    cancel: (jobId: any) => of(ApiServiceStub.result)
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

describe('ResultLayoutComponent', () => {
  let component: ResultLayoutComponent;
  let fixture: ComponentFixture<ResultLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ResultLayoutComponent],
      imports: [
        NoopAnimationsModule,
        SharedModule
      ],
      providers: [
        { provide: Router, useValue: routerStub },
        { provide: JobStateService, useClass: JobStateServiceStub },
        { provide: ApiService, useClass: ApiServiceStub }
      ]

    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultLayoutComponent);
    component = fixture.componentInstance;
    component.result = { id: 1, name: "test", state: "Finished" };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    let text = fixture.nativeElement.querySelector('.name').textContent;
    expect(text).toContain("1 - test");
  });
});
