import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { VirtualScrollService } from '../../services/virtual-scroll/virtual-scroll.service';
import { TableService } from '../../services/table/table.service';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { NewGroupComponent } from '../new-group/new-group.component';

@Component({
  selector: 'resource-node-group',
  templateUrl: './node-group.component.html',
  styleUrls: ['./node-group.component.scss']
})
export class NodeGroupComponent implements OnInit {
  @ViewChild('content') cdkVirtualScrollViewport: CdkVirtualScrollViewport;
  @ViewChild('nodes') nodesEle: ElementRef;

  public query = { filter: '' };

  private displayedColumns = ['name', 'description'];

  public dataSource: MatTableDataSource<any> = new MatTableDataSource();

  public scrolled = false;

  startIndex = 0;
  lastScrolled = 0;

  public loading = false;
  public empty = true;

  showNodes = false;

  selectedGroup = '';
  public windowTitle: string;

  //group actions
  selectedGroupName: string;
  editGroup = {};

  constructor(
    private tableDataService: TableService,
    private dialog: MatDialog
  ) { }

  filterPredicate = (data, filter) => {
    let name = data.name.toLowerCase();
    filter = filter.trim().toLowerCase();
    return !filter || name.indexOf(filter) !== -1;
  }

  get groupNodes() {
    let nodes = [];
    for (let i = 0; i < 100; i++) {
      nodes.push(`node${i + 1}`);
    }
    return nodes;
  }

  ngOnInit() {
    this.empty = false;
    this.dataSource.filterPredicate = this.filterPredicate;
    this.dataSource.data = [
      {
        name: 'HeadNodes',
        description: 'The head nodes in the cluster',
        defaultGroup: true,
        nodes: this.groupNodes
      },
      {
        name: 'ComputeNodes',
        description: 'The compute nodes in the cluster',
        defaultGroup: true,
        nodes: this.groupNodes
      },
      {
        name: 'LinuxNodes',
        description: 'The linux nodes in the cluster',
        defaultGroup: false,
        nodes: this.groupNodes
      },
      {
        name: 'AzureBatchServicePools',
        description: 'The Azure batch pools in the cluster',
        defaultGroup: false,
        nodes: this.groupNodes
      },
      {
        name: 'AzureLaasNodes',
        description: 'The Azure laas Nodes in the cluster',
        defaultGroup: false,
        nodes: this.groupNodes
      },
      {
        name: 'AzureNodes',
        description: 'Microsoft Azure node instances available in the cluster',
        defaultGroup: false,
        nodes: this.groupNodes
      },
      {
        name: 'UnmanagedServerNodes',
        description: 'Unmanaged server node instances avalibale in the cluster',
        defaultGroup: false,
        nodes: this.groupNodes
      },
      {
        name: 'WCFBrokerNodes',
        description: 'The broker nodes in the cluster',
        defaultGroup: false,
        nodes: this.groupNodes
      },
      {
        name: 'WorkstationNodes',
        description: 'The workstations in the cluster',
        defaultGroup: false,
        nodes: this.groupNodes
      }
    ];
  }

  trackByFn(index, item) {
    return this.tableDataService.trackByFn(item, this.displayedColumns);
  }


  get showScrollBar() {
    let clientHeight = this.cdkVirtualScrollViewport.elementRef.nativeElement.clientHeight;
    let offsetHeight = this.cdkVirtualScrollViewport.elementRef.nativeElement.offsetHeight;
    if (clientHeight < offsetHeight) {
      return true;
    }
    return false;
  }

  updateUI() {
    let filter = this.query.filter;
    this.dataSource.filter = filter;
  }

  getNodes(name, nodes) {
    this.showNodes = true;
    if (this.nodesEle) {
      this.nodesEle.nativeElement.scrollTop = 0;
    }
    this.selectedGroup = name;
    this.windowTitle = `${name} - ${nodes.length} Nodes`;
  }

  onShowWnd(condition: boolean) {
    this.showNodes = condition;
    if (!condition) {
      this.selectedGroup = '';
    }
  }


  newGroup(): void {
    let dialogRef = this.dialog.open(NewGroupComponent, {
      width: '60%'
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.dataSource.data.push(res);
        this.dataSource._updateChangeSubscription();
      }
    });
  }

  edit(group) {
    this.selectedGroupName = group.name;
    this.editGroup['name'] = group.name;
    this.editGroup['description'] = group.description;
  }

  saveEdit() {
    this.selectedGroupName = '';
  }

  cancelEdit() {
    this.selectedGroupName = '';
  }
}
