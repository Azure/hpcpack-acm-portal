import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NodeGroupComponent } from './node-group.component';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from 'app/shared.module';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { of } from 'rxjs';
import { ApiService } from 'app/services';

class MatDialogModuleMock {
  close() { }
}

class ApiServiceStub {
  group = {
    createGroup: (group) => of(group),
    updateNodeGroups: () => { }
  }
}

describe('NodeGroupComponent', () => {
  let component: NodeGroupComponent;
  let fixture: ComponentFixture<NodeGroupComponent>;

  const groups = [
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

  const nodes = [
    { "id": "hpc-1h-win", "groups": ["HeadNodes", "ComputeNodes", "WCFBrokerNodes", "G1"], "name": "hpc-1h-win", "health": "OK", "lastHeartbeatTime": "2019-06-13T17:17:14.2074877+08:00", "state": "Online", "runningJobCount": 0, "nodeRegistrationInfo": { "nodeName": "hpc-1h-win", "coreCount": 8, "socketCount": 1, "memoryMegabytes": 28671, "distroInfo": "Microsoft Windows NT 6.2.9200.0" } },
    { "id": "iaascn000", "groups": ["ComputeNodes", "AzureIaaSNodes", "G1"], "name": "iaascn000", "health": "OK", "lastHeartbeatTime": "2019-06-13T17:17:21.8618675+08:00", "state": "Online", "runningJobCount": 0, "nodeRegistrationInfo": { "nodeName": "iaascn000", "coreCount": 4, "socketCount": 1, "memoryMegabytes": 14335, "distroInfo": "Microsoft Windows NT 6.2.9200.0" } },
    { "id": "iaascn001", "groups": ["ComputeNodes", "AzureIaaSNodes", "G1"], "name": "iaascn001", "health": "OK", "lastHeartbeatTime": "2019-06-13T17:17:14.3505882+08:00", "state": "Online", "runningJobCount": 0, "nodeRegistrationInfo": { "nodeName": "iaascn001", "coreCount": 4, "socketCount": 1, "memoryMegabytes": 14335, "distroInfo": "Microsoft Windows NT 6.2.9200.0" } }
  ];

  const nodeGroupMap = {
    "hpc-1h-win": ["HeadNodes", "ComputeNodes", "WCFBrokerNodes", "G1"],
    "iaascn000": ["ComputeNodes", "AzureIaaSNodes", "G1"],
    "iaascn001": ["ComputeNodes", "AzureIaaSNodes", "G1"]
  };

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
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: ApiService, useClass: ApiServiceStub },
        { provide: MAT_DIALOG_DATA, useValue: { nodes: nodes, groups: groups } }
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
