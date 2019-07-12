import { Component, OnInit, ViewChild } from '@angular/core';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { TableService, ApiService } from 'app/services';
import { NewGroupComponent } from '../new-group/new-group.component';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfirmDialogComponent } from 'app/widgets';
import { Group } from 'app/models';

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.scss']
})
export class GroupListComponent implements OnInit {

  @ViewChild('content') cdkVirtualScrollViewport: CdkVirtualScrollViewport;

  public query = { filter: '' };

  public displayedColumns = ['name', 'description'];

  public dataSource: MatTableDataSource<any> = new MatTableDataSource();

  public scrolled = false;

  startIndex = 0;
  lastScrolled = 0;

  public loading = false;
  public empty = true;

  public windowTitle: string;

  //group actions
  //selectedGroupName: string;
  selectedGroupId: number;
  editGroup: Group;

  //Accessiblity
  public focusRowId;

  constructor(
    private tableDataService: TableService,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private api: ApiService
  ) { }

  filterPredicate = (data, filter) => {
    let name = data.name.toLowerCase();
    filter = filter.trim().toLowerCase();
    return !filter || name.indexOf(filter) !== -1;
  }

  ngOnInit() {
    this.empty = false;
    this.dataSource.filterPredicate = this.filterPredicate;
    this.getGroupsRequest().subscribe(data => {
      this.dataSource.data = data;
    });
  }

  ngAfterViewInit() {
    let row = document.getElementById(`${this.focusRowId}`);
    if (row) {
      row.setAttribute('tabindex', '0');
      row.setAttribute('aria-selected', 'true');
      row.focus();
    }
  }

  private getGroupsRequest() {
    return this.api.group.getGroups();
  }

  trackByFn(index, item) {
    return item.name + item.description;
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
    this.selectedGroupId = group.id;
    this.editGroup = new Group();
    this.editGroup.name = group.name;
    this.editGroup.description = group.description;
    this.editGroup.managed = false;
    this.editGroup.id = group.id;
  }

  delete(i: number, group: Group) {
    let dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '45%',
      data: {
        title: 'Delete Group',
        message: `Are you sure to delete group ${group.name}?`
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.api.group.deleteGroup(group.id).subscribe(res => {
          this.dataSource.data.splice(i, 1);
          this.dataSource._updateChangeSubscription();
        });
      }
    });
  }

  saveEdit(i: number) {
    this.api.group.updateGroup(this.editGroup).subscribe(res => {
      this.selectedGroupId = -1;
      this.dataSource.data[i] = this.editGroup;
      this.dataSource._updateChangeSubscription();
      this.editGroup = null;
    });
  }

  cancelEdit() {
    this.selectedGroupId = -1;
  }

  getFocusRowId($event) {
    this.focusRowId = $event;
  }
}
