import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatTableDataSource, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { Subscription } from 'rxjs/Subscription';
import { NewDiagnosticsComponent } from '../new-diagnostics/new-diagnostics.component';
import { NewCommandComponent } from '../new-command/new-command.component';
import { TableOptionComponent, ConfirmDialogComponent } from 'app/widgets';
import { ApiService, Loop, TableService, VirtualScrollService } from 'app/services';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { NodeGroupComponent } from '../node-group/node-group.component';
import { Group } from 'app/models';
import { forkJoin } from 'rxjs';


@Component({
  selector: 'resource-node-list',
  templateUrl: './node-list.component.html',
  styleUrls: ['./node-list.component.scss']
})
export class NodeListComponent {
  @ViewChild('content') cdkVirtualScrollViewport: CdkVirtualScrollViewport;
  @ViewChild('listHeader') listHeader: ElementRef<any>;

  public query = { filter: '', keyword: '' };

  private subcription: Subscription;

  public dataSource: MatTableDataSource<any> = new MatTableDataSource();

  static customizableColumns = [
    { name: 'state', displayed: true, displayName: 'State' },
    { name: 'os', displayed: true, displayName: 'OS' },
    { name: 'groups', displayed: true, displayName: 'Groups' },
    { name: 'jobs', displayed: true, displayName: 'Jobs' },
    { name: 'memory', displayed: true, displayName: 'Memory(MB)' },
  ];
  //customize columns
  private availableColumns;
  public displayedColumns;
  public filterColumns;
  //virtual scroll table
  private lastId = 0;
  private nodeLoop: object;
  public maxPageSize = 30000;
  public scrolled = false;
  public loadFinished = false;
  private interval = 5000;
  private reverse = true;
  public selectedNodes = [];

  pivot = Math.round(this.maxPageSize / 2) - 1;

  startIndex = 0;
  lastScrolled = 0;

  public loading = false;
  public empty = true;
  private endId = -1;

  //groups info
  public nodeGroupsMap = {};
  public allGroups: Group[];

  //accessibility
  public columnOrder = {};
  public tableRenderedRangeSub;
  public focusRowId;

  //update nodes group info
  private nodes: Node[];
  private groups: Group[];

  //resize column
  private columnWidthMap = {};


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
          row.setAttribute('aria-selected', 'true');
          row.focus();
        }
      }, 0);
    })
    this.dataSource.filterPredicate = this.filterPredicate;
    this.loadSettings();
    this.getDisplayedColumns();
    this.getFilterColumns();
    this.nodeLoop = Loop.start(
      forkJoin(
        this.getNodesRequest(),
        this.getGroupsRequest()
      ),
      {
        next: (result) => {
          this.nodes = result[0];
          this.groups = result[1];
          this.getGroupsInfo(this.groups);
          this.updateNodesInfo(this.nodes);
          if (this.reverse && this.nodes.length < this.maxPageSize) {
            this.loadFinished = true;
          }
          return forkJoin(
            this.getNodesRequest(),
            this.getGroupsRequest()
          );
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

  //should be deleted later, just for demo purpose
  isDCNode(name) {
    return name.indexOf('dc') !== -1 ? true : false;
  }

  updateNodesInfo(nodes) {
    this.empty = false;
    if (nodes.length > 0) {
      nodes.forEach(element => {
        if (this.isDCNode(element.name)) {
          element['groups'] = undefined;
        }
        else {
          element['groups'] = this.nodeGroupsMap[element['id']] ? this.nodeGroupsMap[element['id']] : [];
        }
        element['os'] = element.nodeRegistrationInfo.distroInfo;
        element['memory'] = element.nodeRegistrationInfo.memoryMegabytes;
      });
      this.tableService.updateDatasource(nodes, this.dataSource, 'id');
      if (this.endId != -1 && nodes[nodes.length - 1].id != this.endId) {
        this.loading = false;
      }
    }
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
  private getGroupsRequest() {
    return this.api.group.getGroups();
  }

  getGroupsInfo(groups: Group[]) {
    this.allGroups = groups;
    for (let i = 0; i < groups.length; i++) {
      let nodes = groups[i].nodes;
      for (let j = 0; j < nodes.length; j++) {
        if (!this.nodeGroupsMap[nodes[j]]) {
          this.nodeGroupsMap[nodes[j]] = [];
        }
        if (this.nodeGroupsMap[nodes[j]].indexOf(groups[i].name) == -1) {
          this.nodeGroupsMap[nodes[j]].push(groups[i].name);
        }
      }
    }
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
    else if (data[this.query.filter]) {
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

  public updateSelectedNodes(node): void {
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
    if (!this.selectedNodes.every(node => !this.isDCNode(node.id))) {
      this.dialog.open(ConfirmDialogComponent, {
        width: '60%',
        data: { title: 'Warning', message: "Can't manage domin controller's groups info, please uncheck domin controller node to contiue.", choice: false }
      });
      return false;
    }
    let dialogRef = this.dialog.open(NodeGroupComponent, {
      width: '60%',
      data: { groups: this.allGroups, nodes: this.selectedNodes, nodeGroupsMap: this.nodeGroupsMap }
    });

    dialogRef.afterClosed().subscribe(params => {
      if (params) {
        this.nodeGroupsMap = params;
        this.updateNodesInfo(this.nodes);
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
    let style = {};
    let index = this.displayedColumns.findIndex(item => {
      return item == col;
    });

    let order = index + 1;
    this.columnOrder[col] = index;
    if (order) {
      style['order'] = index + 1;
    }
    else {
      style['display'] = 'none';
    }

    //change flex value according to resized width
    if (this.columnWidthMap[col]) {
      style['flex'] = `${this.columnWidthMap[col]}`;
    }

    return style;
  }

  showResizer(col) {
    return this.displayedColumns.findIndex(item => item == col) == this.displayedColumns.length - 1 ? false : true;
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

  updateColumnWidth(e, name) {
    let totalWidth = this.listHeader.nativeElement.offsetWidth;
    this.columnWidthMap[name] = `${Number(e.value / totalWidth).toFixed(2)} 1 ${e.value}px`;
  }
}