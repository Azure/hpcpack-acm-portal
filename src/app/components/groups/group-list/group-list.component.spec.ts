import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GroupListComponent } from './group-list.component';
import { SharedModule } from 'app/shared.module';
import { VirtualScrollTableModule } from 'app/widgets';
import { FormsModule } from '@angular/forms';
import { TableService, ApiService } from 'app/services';
import { Router, ActivatedRoute } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

const TableServiceStub = {
  updateData: (newData, dataSource, propertyName) => newData,
  loadSetting: (key, initVal) => initVal,
  saveSetting: (key, val) => undefined,
  isContentScrolled: () => false
}

class ApiServiceStub {
  static groups = [
    { "nodes": ["hpc-1h-win"], "id": 0, "name": "HeadNodes", "description": "The head nodes in the cluster", "managed": true },
    { "nodes": ["hpc-1h-win", "iaascn000", "iaascn001"], "id": 1, "name": "ComputeNodes", "description": "The compute nodes in the cluster", "managed": true },
    { "nodes": ["hpc-1h-win"], "id": 2, "name": "WCFBrokerNodes", "description": "The broker nodes in the cluster", "managed": true },
    { "nodes": [], "id": 3, "name": "WorkstationNodes", "description": "The workstations in the cluster", "managed": true },
    { "nodes": [], "id": 4, "name": "AzureNodes", "description": "Microsoft Azure node instances available in the cluster", "managed": true },
    { "nodes": [], "id": 5, "name": "UnmanagedServerNodes", "description": "Unmanaged server node instances available in the cluster", "managed": true },
    { "nodes": [], "id": 6, "name": "LinuxNodes", "description": "The linux nodes in the cluster", "managed": true },
    { "nodes": [], "id": 7, "name": "AzureBatchServicePools", "description": "The Azure batch pools in the cluster", "managed": true },
    { "nodes": ["iaascn000", "iaascn001"], "id": 8, "name": "AzureIaaSNodes", "description": "The Azure IaaS nodes in the cluster", "managed": true },
    { "nodes": ["hpc-1h-win", "iaascn000", "iaascn001"], "id": 10, "name": "G1", "description": "test by JJ test test", "managed": false }
  ];

  group = {
    getGroups: () => of(ApiServiceStub.groups),
    deleteGroup: (index, group) => of(),
    updateGroup: (group) => of(group)
  }
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
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: ApiService, useClass: ApiServiceStub }
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
