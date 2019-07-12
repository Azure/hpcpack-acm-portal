import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NewGroupComponent } from './new-group.component';
import { SharedModule } from 'app/shared.module';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { ApiService } from 'app/services';

class ApiServiceStub {
  group = {
    createGroup: (group) => of(group)
  }
}


class MatDialogModuleMock {
  close() { }
}

describe('NewGroupComponent', () => {
  let component: NewGroupComponent;
  let fixture: ComponentFixture<NewGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NewGroupComponent],
      imports: [
        SharedModule,
        FormsModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: MatDialogRef, useClass: MatDialogModuleMock },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: ApiService, useClass: ApiServiceStub }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
