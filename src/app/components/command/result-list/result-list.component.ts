import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material';
import { TableOptionComponent } from 'app/widgets';
import { ApiService, Loop } from 'app/services';
import { JobStateService } from 'app/services';
import { TableService } from 'app/services';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { VirtualScrollService } from 'app/services';
import { Router, ActivatedRoute } from '@angular/router';
import { ListJob } from 'app/models';

@Component({
  selector: 'app-result-list',
  templateUrl: './result-list.component.html',
  styleUrls: ['./result-list.component.scss']
})
export class ResultListComponent implements OnInit {
  @ViewChild('content') cdkVirtualScrollViewport: CdkVirtualScrollViewport;
  @ViewChild('nodes') nodes: ElementRef;
  public dataSource = [];

  static customizableColumns = [
    { name: 'createdAt', displayed: true, displayName: 'Created' },
    { name: 'nodes', display: true, displayName: 'Nodes' },
    { name: 'command', displayed: true, displayName: 'Command' },
    { name: 'state', displayed: true, displayName: 'State' },
    { name: 'progress', displayed: true, displayName: 'Progress' },
    { name: 'updatedAt', displayed: true, displayName: 'Last Changed' },
  ];

  private availableColumns;

  public displayedColumns;

  private lastId = 0;

  private commandLoop: object;
  public maxPageSize = 300;
  private reverse = true;
  public scrolled = false;
  public loadFinished = false;
  private interval = 2000;

  pivot = Math.round(this.maxPageSize / 2) - 1;

  startIndex = 0;
  lastScrolled = 0;

  public loading = false;
  public empty = true;
  private endId = -1;

  public targetNodes: Array<ListJob>;
  public showTargetNodes = false;
  public selectedJobId = -1;
  public windowTitle: string;

  //accessibility
  public tableRenderedRangeSub;
  public focusRowId;

  constructor(
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private jobStateService: JobStateService,
    private tableService: TableService,
    private dialog: MatDialog,
    private virtualScrollService: VirtualScrollService
  ) { }

  getFocusRowId($event) {
    this.focusRowId = $event;
  }

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
    this.loadSettings();
    this.getDisplayedColumns();

    this.commandLoop = Loop.start(
      this.getCommandRequest(),
      {
        next: (result) => {
          this.empty = false;
          if (result.length > 0) {
            this.dataSource = this.tableService.updateData(result, this.dataSource, 'id');
            if (this.endId != -1 && result[result.length - 1].id != this.endId) {
              this.loading = false;
            }
          }
          if (this.reverse && result.length < this.maxPageSize) {
            this.loadFinished = true;
          }
          return this.getCommandRequest();
        }
      },
      this.interval
    );
  }

  ngOnDestroy() {
    this.tableRenderedRangeSub.unsubscribe(); 
    if (this.commandLoop) {
      Loop.stop(this.commandLoop);
    }
  }
  private stateIcon(state) {
    return this.jobStateService.stateIcon(state);
  }

  private stateClass(state) {
    return this.jobStateService.stateClass(state);
  }

  private getCommandRequest() {
    return this.api.command.getJobsByPage({ lastId: this.lastId, count: this.maxPageSize, reverse: this.reverse });
  }


  getDisplayedColumns(): void {
    let columns = this.availableColumns.filter(e => e.displayed).map(e => e.name);
    // columns.push('actions');
    this.displayedColumns = ['id'].concat(columns);
  }

  customizeTable(): void {
    let dialogRef = this.dialog.open(TableOptionComponent, {
      width: '60%',
      data: { columns: this.availableColumns }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.availableColumns = res.columns;
        this.getDisplayedColumns();
        this.saveSettings();
      }
    });
  }

  saveSettings(): void {
    this.tableService.saveSetting('CommandList', this.availableColumns);
  }

  loadSettings(): void {
    this.availableColumns = this.tableService.loadSetting('CommandList', ResultListComponent.customizableColumns);
  }

  trackByFn(index, item) {
    return this.tableService.trackByFn(item, this.displayedColumns);
  }

  getColumnOrder(col) {
    let index = this.displayedColumns.findIndex(item => {
      return item == col;
    });

    let order = index + 1;
    if (order) {
      return { 'order': index + 1 };
    }
    else {
      return { 'display': 'none' };
    }
  }

  goDetailPage(id) {
    this.router.navigate(['.', `${id}`], { relativeTo: this.route });
  }

  getTargetNodes(id, nodes) {
    this.showTargetNodes = true;
    if (this.nodes) {
      this.nodes.nativeElement.scrollTop = 0;
    }
    this.selectedJobId = id;
    this.windowTitle = `${nodes.length} Nodes`;
    this.targetNodes = nodes;
  }

  onShowWnd(condition: boolean) {
    this.showTargetNodes = condition;
    if (!condition) {
      this.selectedJobId = -1;
    }
  }

  indexChanged($event) {
    let result = this.virtualScrollService.indexChangedCalc(this.maxPageSize, this.pivot, this.cdkVirtualScrollViewport, this.dataSource, this.lastScrolled, this.startIndex);
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
}
