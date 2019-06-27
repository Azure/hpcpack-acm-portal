import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatTableDataSource, MAT_DIALOG_DATA } from '@angular/material';
import { Group } from 'app/models';
import { ApiService } from 'app/services';
import { Observable, forkJoin } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-node-group',
  templateUrl: './node-group.component.html',
  styleUrls: ['./node-group.component.scss']
})
export class NodeGroupComponent implements OnInit {
  public nodeGroups = []
  public allGroups: Group[] = [];
  private selectedNodes = [];
  private updatedGroups = [];
  private nodeGroupsMap = {};
  public loading = false;

  public dataSource: MatTableDataSource<any> = new MatTableDataSource();
  public isNewGroup: boolean = false;
  public newGroup: Group = new Group();


  constructor(
    public dialogRef: MatDialogRef<NodeGroupComponent>,
    private api: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.allGroups = data.groups;
    this.nodeGroups = this.getSelectedGroup(data.nodes, data.groups);
    this.selectedNodes = data.nodes;
    this.updatedGroups = [...this.nodeGroups];
    this.nodeGroupsMap = data.nodeGroupsMap;
    this.dialogRef.disableClose = true;
  }

  ngOnInit() {
    this.dataSource.data = this.allGroups;
  }

  getSelectedGroup(nodes, groups) {
    let nodeGroups = nodes.map(node => node.groups);
    let selectedGroupName = nodeGroups.reduce((p, c) => p.filter(e => c.includes(e)));
    return groups.filter(e => selectedGroupName.includes(e.name));
  }

  public isSelectedGroup(group) {
    let index = this.updatedGroups.findIndex(n => {
      return n.id == group.id;
    });
    return index == -1 ? false : true;
  }

  public updateSelectedGroups(group): void {
    let index = this.updatedGroups.findIndex(n => {
      return n.id == group.id;
    });
    if (index != -1) {
      this.updatedGroups.splice(index, 1);
    }
    else {
      this.updatedGroups.push(group);
    }
  }

  public createGroup() {
    this.isNewGroup = true;
  }

  public backToList() {
    this.isNewGroup = false;
  }

  update() {
    let selectedNodeName = this.selectedNodes.map(node => node.name);
    let addGroups = this.updatedGroups.filter(ele => this.nodeGroups.findIndex(e => e.id == ele.id) == -1);
    let deleteGroups = this.nodeGroups.filter(ele => this.updatedGroups.findIndex(e => e.id == ele.id) == -1);
    addGroups.forEach(e => {
      this.selectedNodes.forEach(node => {
        let groupsInfo = this.nodeGroupsMap[`${node.id}`];
        if (groupsInfo && groupsInfo.findIndex(group => group == e.name) == -1) {
          groupsInfo.push(e.name);
        }
        else {
          groupsInfo = [e.name];
        }
      })
    });
    deleteGroups.forEach(e => {
      this.selectedNodes.forEach(node => {
        let index = this.nodeGroupsMap[`${node.id}`].findIndex(group => group == e.name);
        this.nodeGroupsMap[`${node.id}`].splice(index, 1);
      })
    })

    let addObservables = addGroups.map(group => this.api.group.updateNodeGroups('add', group.id, selectedNodeName));
    let deleteObservables = deleteGroups.map(group => this.api.group.updateNodeGroups('delete', group.id, selectedNodeName));
    let allObservables = [...addObservables, ...deleteObservables];
    if (this.isNewGroup) {
      let newGroupObservable = this.api.group.createGroup(this.newGroup)
        .pipe(mergeMap((res: HttpResponse<any>) => {
          this.selectedNodes.forEach(node => this.nodeGroupsMap[`${node.id}`].push(res.body.name));
          return this.api.group.updateNodeGroups('add', res.body.id, selectedNodeName);
        }))
      allObservables.push(newGroupObservable);
    }
    this.loading = true;
    forkJoin(allObservables).subscribe(
      res => {
        this.dialogRef.close(this.nodeGroupsMap);
      },
      error => console.log(error)
    );
  }

  cancelNewGroup() {
    this.isNewGroup = false;
    this.newGroup = new Group();
  }

  close() {
    this.dialogRef.close();
  }
}