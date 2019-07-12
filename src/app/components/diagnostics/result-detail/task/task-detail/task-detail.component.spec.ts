import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { TaskDetailComponent } from './task-detail.component';
import { of } from 'rxjs/observable/of';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ApiService } from 'app/services';
import { SharedModule } from 'app/shared.module';

class MatDialogModuleMock { }

class ApiServiceStub {
  static result = { nodeName: "testNode", message: { Detail: "test \n test \n" }, primaryTask: true };

  diag = {
    getDiagTaskResult: (jobId: any, taskId: any) => of(ApiServiceStub.result)
  }
}

describe('TaskDetailComponent', () => {
  let component: TaskDetailComponent;
  let fixture: ComponentFixture<TaskDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TaskDetailComponent],
      imports: [SharedModule, MatDialogModule, NoopAnimationsModule],
      providers: [
        { provide: MatDialogRef, useClass: MatDialogModuleMock },
        { provide: MAT_DIALOG_DATA, useValue: { jobId: 1, taskId: 1, taskState: 'Finished' } },
        { provide: ApiService, useClass: ApiServiceStub }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    let text = fixture.nativeElement.querySelector(".msg-item").innerText;
    expect(text).toEqual("test \n test \n");
  });
});
