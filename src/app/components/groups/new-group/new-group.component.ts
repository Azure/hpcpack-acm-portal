import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { ApiService } from 'app/services';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'new-group',
  templateUrl: './new-group.component.html',
  styleUrls: ['./new-group.component.scss']
})
export class NewGroupComponent implements OnInit {

  public name: string;
  public description: string;
  public errorMessage: string;

  constructor(
    public dialog: MatDialogRef<NewGroupComponent>,
    private api: ApiService
  ) { }

  ngOnInit() {
  }

  create() {
    let groupInfo = { name: this.name, description: this.description, managed: false };
    this.api.group.createGroup(groupInfo).subscribe(
      (res: HttpResponse<any>) => {
        this.dialog.close(res.body);
      },
      error => {
        this.errorMessage = error.error;
      }
    );
  }

  clearErrorMsg() {
    this.errorMessage = "";
  }

  close() {
    this.dialog.close();
  }
}
