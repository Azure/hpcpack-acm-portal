import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'resource-new-group',
  templateUrl: './new-group.component.html',
  styleUrls: ['./new-group.component.scss']
})
export class NewGroupComponent implements OnInit {

  public name: string;
  public description: string;

  constructor(
    public dialog: MatDialogRef<NewGroupComponent>,
  ) { }

  ngOnInit() {
  }

  create() {
    let groupInfo = { name: this.name, description: this.description, defaultGroup: false, nodes: [] };
    this.dialog.close(groupInfo);
  }

}
