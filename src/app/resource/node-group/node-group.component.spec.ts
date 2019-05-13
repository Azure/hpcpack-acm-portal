import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeGroupComponent } from './node-group.component';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from '../../shared.module';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

class MatDialogModuleMock {
  close() { }
}

describe('NodeGroupComponent', () => {
  let component: NodeGroupComponent;
  let fixture: ComponentFixture<NodeGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NodeGroupComponent],
      imports: [
        FormsModule,
        NoopAnimationsModule,
        SharedModule
      ],
      providers: [
        { provide: MatDialogRef, useClass: MatDialogModuleMock },
        { provide: MAT_DIALOG_DATA, useValue: {} }

      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NodeGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
