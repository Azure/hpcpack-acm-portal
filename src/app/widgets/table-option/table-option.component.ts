import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import DragonDrop from 'drag-on-drop';

@Component({
  templateUrl: './table-option.component.html',
  styleUrls: ['./table-option.component.scss']
})
export class TableOptionComponent implements OnInit {
  @ViewChild('optionsEle')
  optionsEle: ElementRef;
  @ViewChild('selectedEle')
  selectedEle: ElementRef;

  public options: any[];
  public selected: any[];
  public dragonOptions;
  public dragonSeletced;

  constructor(
    public dialogRef: MatDialogRef<TableOptionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.initialColumns(data);
  }

  initialColumns(data) {
    this.options = data.columns.filter(e => !e.displayed);
    this.selected = data.columns.filter(e => e.displayed);
  }

  ngOnInit() {
    this.dragonOptions = new DragonDrop(this.optionsEle.nativeElement,
      {
        handle: false,
        item: ':scope .name',
        announcement: {
          grabbed: (el) => {
            // console.log(`${el.querySelector('.displayName').innerText} grabbed`);
            return `${el.querySelector('.displayName').innerText} grabbed`;
          },
          dropped: (el, items) => {
            // console.log(`${el.querySelector('.displayName').innerText} dropped`);
            return `${el.querySelector('.displayName').innerText} dropped`;
          },
          reorder: (el, items) => {
            const pos = items.indexOf(el) + 1;
            const text = el.querySelector('.displayName').innerText;
            // console.log(`The options columns order has changed, ${text} is now item ${pos} of ${items.length}`);
            return `The options columns order has changed, ${text} is now item ${pos} of ${items.length}`;
          },
          cancel: 'Reschedule cancelled.'
        }
      });
    this.dragonSeletced = new DragonDrop(this.selectedEle.nativeElement,
      {
        handle: false,
        item: ':scope .name',
        announcement: {
          grabbed: (el, items) => {
            return `${el.innerText} grabbed`;
          },
          dropped: el => {
            return `${el.innerText} dropped`;
          },
          reorder: (el, items) => {
            const pos = items.indexOf(el) + 1;
            const text = el.innerText;
            return `The selected columns order has changed, ${text} is now item ${pos} of ${items.length}`;
          },
          cancel: 'Reschedule cancelled.'
        }
      });

  }

  ngAfterViewInit() {
    this.dragonSeletced.initElements(this.selectedEle.nativeElement);
    this.dragonOptions.initElements(this.optionsEle.nativeElement);

  }

  get result() {
    let optionsEles = Array.prototype.slice.apply(document.querySelectorAll('.option-item .displayName'));
    let tempOptions = [];
    optionsEles.forEach(element => {
      let index = this.options.findIndex(ele => {
        return element.innerText == ele.displayName;
      });
      tempOptions.push(this.options[index]);
    });
    let selectedEles = Array.prototype.slice.apply(document.querySelectorAll('.selected-item .displayName'));
    let tempSelected = [];
    selectedEles.forEach(element => {
      let index = this.selected.findIndex(ele => {
        return element.innerText == ele.displayName;
      });
      tempSelected.push(this.selected[index]);
    });
    // tempOptions.forEach(e => (e as any).displayed = false);
    // tempSelected.forEach(e => (e as any).displayed = true);
    return { columns: tempSelected.concat(tempOptions) };
  }

  addColumn($event, item) {
    $event.stopPropagation();
    let index = this.options.indexOf(item);
    item.displayed = true;
    this.selected.push(item);
    this.options.splice(index, 1);
  }

  removeColumn($event, item) {
    $event.stopPropagation();
    let index = this.selected.indexOf(item);
    item.displayed = false;
    this.options.push(item);
    this.selected.splice(index, 1);
  }

  close(res) {
    if (res) {
      this.dialogRef.close(res);
    }
    else {
      this.initialColumns(this.data);
      this.dialogRef.close();
    }
  }
}
