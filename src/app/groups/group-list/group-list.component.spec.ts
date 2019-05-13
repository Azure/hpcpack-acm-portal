import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GroupListComponent } from './group-list.component';
import { SharedModule } from '../../shared.module';
import { VirtualScrollTableModule } from '../../widgets/virtual-scroll-table/virtual-scroll-table.module';
import { FormsModule } from '@angular/forms';
import { TableService } from '../../services/table/table.service';
import { Router, ActivatedRoute } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const TableServiceStub = {
  updateData: (newData, dataSource, propertyName) => newData,
  loadSetting: (key, initVal) => initVal,
  saveSetting: (key, val) => undefined,
  isContentScrolled: () => false
}

const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
const activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', ['']);

describe('GroupListComponent', () => {
  let component: GroupListComponent;
  let fixture: ComponentFixture<GroupListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GroupListComponent],
      imports: [
        SharedModule,
        VirtualScrollTableModule,
        FormsModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: TableService, useValue: TableServiceStub },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
