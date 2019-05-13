import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NewGroupComponent } from './new-group.component';
import { SharedModule } from '../../shared.module';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

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
        { provide: MAT_DIALOG_DATA, useValue: {} }
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
