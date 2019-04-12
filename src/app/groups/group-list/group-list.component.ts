import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { TableService } from '../../services/table/table.service';
import { NewGroupComponent } from '../new-group/new-group.component';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.scss']
})
export class GroupListComponent implements OnInit {

  @ViewChild('content') cdkVirtualScrollViewport: CdkVirtualScrollViewport;

  public query = { filter: '' };

  private displayedColumns = ['name', 'description'];

  public dataSource: MatTableDataSource<any> = new MatTableDataSource();

  public scrolled = false;

  startIndex = 0;
  lastScrolled = 0;

  public loading = false;
  public empty = true;

  selectedGroup = '';
  public windowTitle: string;

  //group actions
  selectedGroupName: string;
  editGroup = {};

  constructor(
    private tableDataService: TableService,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  filterPredicate = (data, filter) => {
    let name = data.name.toLowerCase();
    filter = filter.trim().toLowerCase();
    return !filter || name.indexOf(filter) !== -1;
  }

  ngOnInit() {
    this.empty = false;
    this.dataSource.filterPredicate = this.filterPredicate;
    this.dataSource.data = [
      {
        name: 'HeadNodes',
        description: 'The head nodes in the cluster',
        defaultGroup: true
      },
      {
        name: 'ComputeNodes',
        description: 'The compute nodes in the cluster',
        defaultGroup: true
      },
      {
        name: 'LinuxNodes',
        description: 'The Linux nodes in the cluster',
        defaultGroup: false
      },
      {
        name: 'WindowsNodes',
        description: 'The Windows nodes in the cluster',
        defaultGroup: false
      },
      {
        name: 'AzureBatchServicePools',
        description: 'The Azure batch pools in the cluster',
        defaultGroup: false
      },
      {
        name: 'AzureLaasNodes',
        description: 'The Azure laas Nodes in the cluster',
        defaultGroup: false
      },
      {
        name: 'AzureNodes',
        description: 'Microsoft Azure node instances available in the cluster',
        defaultGroup: false
      },
      {
        name: 'UnmanagedServerNodes',
        description: 'Unmanaged server node instances avalibale in the cluster',
        defaultGroup: false
      },
      {
        name: 'WCFBrokerNodes',
        description: 'The broker nodes in the cluster',
        defaultGroup: false
      },
      {
        name: 'WorkstationNodes',
        description: 'The workstations in the cluster',
        defaultGroup: false
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

  getNodes(name) {
    this.router.navigate(['..', 'resource'], { relativeTo: this.route, queryParams: { filter: 'groups', keyword: name } });
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
