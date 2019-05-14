import { Component, Input, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatTableDataSource, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { Subscription } from 'rxjs/Subscription';
import { NewDiagnosticsComponent } from '../new-diagnostics/new-diagnostics.component';
import { NewCommandComponent } from '../new-command/new-command.component';
import { TableOptionComponent } from '../../widgets/virtual-scroll-table/table-option/table-option.component';
import { ApiService, Loop } from '../../services/api.service';
import { TableService } from '../../services/table/table.service';
import { VirtualScrollService } from '../../services/virtual-scroll/virtual-scroll.service';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { NodeGroupComponent } from '../node-group/node-group.component';

@Component({
  selector: 'resource-node-list',
  templateUrl: './node-list.component.html',
  styleUrls: ['./node-list.component.scss']
})
export class NodeListComponent {
  @ViewChild('content') cdkVirtualScrollViewport: CdkVirtualScrollViewport;

  public query = { filter: '', keyword: '' };

  private subcription: Subscription;

  public dataSource: MatTableDataSource<any> = new MatTableDataSource();

  static customizableColumns = [
    { name: 'state', displayed: true, displayName: 'State' },
    { name: 'os', displayed: true, displayName: 'OS' },
    { name: 'groups', displayed: true, displayName: 'Groups' },
    { name: 'runningJobCount', displayed: true, displayName: 'Jobs' },
    { name: 'memory', displayed: true, displayName: 'Memory(MB)' },
  ];

  private availableColumns;
  public displayedColumns;
  public filterColumns;

  private selection = new SelectionModel(true, []);

  private lastId = 0;
  private nodeLoop: object;
  public maxPageSize = 30000;
  public scrolled = false;
  public loadFinished = false;
  private interval = 5000000;
  private reverse = true;
  public selectedNodes = [];

  pivot = Math.round(this.maxPageSize / 2) - 1;

  startIndex = 0;
  lastScrolled = 0;

  public loading = false;
  public empty = true;
  private endId = -1;

  //accessibility
  public columnOrder = {};
  public tableRenderedRangeSub;
  public focusRowId;


  constructor(
    private dialog: MatDialog,
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private tableService: TableService,
    private virtualScrollService: VirtualScrollService
  ) { }

  ngOnInit() {
    this.tableRenderedRangeSub = this.cdkVirtualScrollViewport.renderedRangeStream.subscribe(listrange => {
      setTimeout(() => {
        let row = document.getElementById(`${this.focusRowId}`);
        if (row) {
          row.setAttribute('tabindex', '0');
          row.setAttribute('aira-selected', 'true');
          row.focus();
        }
      }, 0);
    })
    this.dataSource.filterPredicate = this.filterPredicate;
    this.loadSettings();
    this.getDisplayedColumns();
    this.getFilterColumns();
    this.nodeLoop = Loop.start(
      this.getNodesRequest(),
      {
        next: (result) => {
          this.empty = false;
          if (result.length > 0) {
            result.forEach(element => {
              element['groups'] = ['HeadNodes', 'ComputeNodes', 'AzureNodes'];//need to be deleted later.
              if (element.id.indexOf('linux') > 0) {
                element['groups'].push('LinuxNodes');
              }
              else {
                element['groups'].push('WindowsNodes');
              }
              element['os'] = element.nodeRegistrationInfo.distroInfo;
              element['memory'] = element.nodeRegistrationInfo.memoryMegabytes;
            });
            this.tableService.updateDatasource(result, this.dataSource, 'id');
            if (this.endId != -1 && result[result.length - 1].id != this.endId) {
              this.loading = false;
            }
          }
          if (this.reverse && result.length < this.maxPageSize) {
            this.loadFinished = true;
          }
          return this.getNodesRequest();
        }
      },
      this.interval
    );
    this.subcription = this.route.queryParamMap.subscribe(params => {
      this.query.filter = params.get('filter');
      this.query.keyword = params.get('keyword');
      this.updateUI();
    });
  }

  ngOnDestroy() {
    if (this.nodeLoop) {
      Loop.stop(this.nodeLoop);
    }
    this.subcription.unsubscribe();
  }
  private getNodesRequest() {
    return this.api.node.getNodesByPage(this.lastId, this.maxPageSize)
  }

  updateUI() {
    this.dataSource.filter = this.query.keyword;
  }

  updateUrl() {
    this.router.navigate(['.'], { relativeTo: this.route, queryParams: this.query });
  }

  filterPredicate = (data, filter) => {
    let content = "";
    if (!this.query.filter) {
      content = JSON.stringify(data).toLowerCase();
    }
    else {
      content = data[this.query.filter].toString().toLowerCase();
    }
    filter = filter.trim().toLowerCase();
    return !filter || content.indexOf(filter) !== -1;
  }

  public isAllSelected() {
    const numSelected = this.selectedNodes.length;
    const numRows = this.dataSource.filteredData.length;
    return numSelected == numRows;
  }

  public masterToggle() {
    this.isAllSelected() ?
      this.selectedNodes = [] :
      this.dataSource.filteredData.forEach(row => {
        let index = this.selectedNodes.findIndex(n => {
          return n.id == row.id;
        });
        if (index == -1) {
          this.selectedNodes.push(row);
        }
      });
  }

  public isSelected(node) {
    let index = this.selectedNodes.findIndex(n => {
      return n.id == node.id;
    });
    return index == -1 ? false : true;
  }

  private updateSelectedNodes(node): void {
    let index = this.selectedNodes.findIndex(n => {
      return n.id == node.id;
    });
    if (index != -1) {
      this.selectedNodes.splice(index, 1);
    }
    else {
      this.selectedNodes.push(node);
    }
  }


  runDiagnostics() {
    let dialogRef = this.dialog.open(NewDiagnosticsComponent, {
      width: '60%',
      data: {}
    });

    //TODO: Run diagnostic tests on user selected nodes...
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let targetNodes = this.selectedNodes.map(e => e.name);
        let diagnosticTest = { name: result['selectedTest']['name'], category: result['selectedTest']['category'], arguments: result['selectedTest']['arguments'] };
        let name = result['diagTestName'];
        this.api.diag.create(name, targetNodes, diagnosticTest).subscribe(obj => {
          let returnData = obj['headers'].get('location').split('/');
          let jobId = returnData[returnData.length - 1];
          this.router.navigate([`/diagnostics/results/` + jobId]);
        });
      }
    });
  }

  runCommand() {
    let dialogRef = this.dialog.open(NewCommandComponent, {
      width: '98%',
      data: {}
    });

    dialogRef.afterClosed().subscribe(params => {
      if (params && params.command) {
        let names = this.selectedNodes.map(e => e.name);
        this.api.command.create(params.command, names, params.timeout).subscribe(obj => {
          if (params.multiCmds) {
            this.router.navigate([`/command/multi-cmds`], { queryParams: { firstJobId: obj.id } });
          }
          else {
            this.router.navigate([`/command/results/${obj.id}`]);
          }
        });
      }
    });
  }

  manageNodeGroups() {
    let dialogRef = this.dialog.open(NodeGroupComponent, {
      width: '60%',
      data: {}
    });

    dialogRef.afterClosed().subscribe(params => {
      if (params.isNewGroup) {
        //send request to update selected nodes' groups info
        //using selectedNode and newGroup
        //now just make interval extreamly large to not update mocked data
        this.selectedNodes.forEach(ele => {
          let index = this.dataSource.data.findIndex(data => {
            return data.id == ele.id;
          })
          this.dataSource.data[index]['groups'].push(params.newGroup.name);
        });
        this.dataSource._updateChangeSubscription();
      }
      else if (params) {
        this.selectedNodes.forEach(ele => {
          ele['groups'] = params.selectedGroups.map(ele => {
            return ele.name;
          });
        });
      }
    });
  }

  hasNoSelection(): boolean {
    return this.selectedNodes.length == 0;
  }

  getDisplayedColumns(): void {
    let columns = this.availableColumns.filter(e => e.displayed).map(e => e.name);
    this.displayedColumns = ['select', 'name'].concat(columns);
  }

  getFilterColumns(): void {
    this.filterColumns = [{ name: '-- All --', value: '' }];
    this.displayedColumns.forEach((item, index) => {
      if (index > 0) {
        this.filterColumns.push({ name: item, value: item });
      }
    });
  }

  customizeTable(): void {
    let dialogRef = this.dialog.open(TableOptionComponent, {
      width: '60%',
      data: { columns: this.availableColumns },
      ariaLabel: 'Customize resource list columns'
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.availableColumns = res.columns;
        this.getDisplayedColumns();
        this.getFilterColumns();
        this.saveSettings();
      }
    });
  }

  saveSettings(): void {
    this.tableService.saveSetting('NodeListComponent', this.availableColumns);
  }

  loadSettings(): void {
    this.availableColumns = this.tableService.loadSetting('NodeListComponent', NodeListComponent.customizableColumns);
  }

  trackByFn(index, item) {
    return this.tableService.trackByFn(item, this.displayedColumns);
  }

  getColumnOrder(col) {
    let index = this.displayedColumns.findIndex(item => {
      return item == col;
    });

    let order = index + 1;
    this.columnOrder[col] = index;
    if (order) {
      return { 'order': index + 1 };
    }
    else {
      return { 'display': 'none' };
    }
  }


  indexChanged($event) {
    let result = this.virtualScrollService.indexChangedCalc(this.maxPageSize, this.pivot, this.cdkVirtualScrollViewport, this.dataSource.data, this.lastScrolled, this.startIndex);
    this.pivot = result.pivot;
    this.lastScrolled = result.lastScrolled;
    this.lastId = result.lastId == undefined ? this.lastId : result.lastId;
    this.endId = result.endId == undefined ? this.endId : result.endId;
    this.loading = result.loading;
    this.startIndex = result.startIndex;
    this.scrolled = result.scrolled;
  }

  get showScrollBar() {
    return this.tableService.isContentScrolled(this.cdkVirtualScrollViewport.elementRef.nativeElement);
  }

  getFocusRowId($event) {
    this.focusRowId = $event;
  }
}
