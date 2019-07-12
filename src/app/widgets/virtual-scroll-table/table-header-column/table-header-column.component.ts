import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter, TemplateRef, ContentChild, SimpleChanges } from '@angular/core';
import { fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'hpc-table-header-column',
  templateUrl: './table-header-column.component.html',
  styleUrls: ['./table-header-column.component.scss']
})
export class TableHeaderColumnComponent {
  @ViewChild('columnWrapper')
  columnWrapper: ElementRef;

  @ViewChild('grip')
  grip: ElementRef;

  @ContentChild('header')
  header: TemplateRef<any>;

  @Input() resizer: boolean;
  @Output() updateColumnWidth: EventEmitter<any> = new EventEmitter();

  private isMoving: boolean;
  private startOffset: number;

  constructor() { }

  getObservables(domItem, containerItem) {
    const mouseEventToCoordinate = mouseEvent => {
      mouseEvent.preventDefault();
      return {
        x: mouseEvent.pageX,
        y: mouseEvent.pageY
      };
    };
    const mouseMove$ = fromEvent(containerItem, 'mousemove').pipe(map(mouseEventToCoordinate));
    const mouseUp$ = fromEvent(document, 'mouseup').pipe(map(mouseEventToCoordinate));
    const mouseDown$ = fromEvent(domItem, 'mousedown').pipe(map(mouseEventToCoordinate));
    return { mouseDown$, mouseMove$, mouseUp$ };
  }

  doResize() {
    const columnEle = this.columnWrapper.nativeElement;
    const gripEle = this.grip.nativeElement;
    let observables = this.getObservables(gripEle, columnEle.parentNode.parentNode);
    observables.mouseDown$.forEach(event => {
      this.isMoving = true;
      this.startOffset = columnEle.offsetWidth - event.x;
    });

    observables.mouseMove$.forEach(event => {
      if (this.isMoving) {
        if (event.x)
          if (this.startOffset + event.x < 40) {
            return;
          }
        this.updateColumnWidth.emit({ value: this.startOffset + event.x });
      }
    });

    observables.mouseUp$.forEach(event => {
      this.isMoving = false;
    });
  }

  ngAfterViewInit() {
    if (this.resizer) {
      this.doResize();
    }
  }

  private initializeGrip: boolean;
  ngOnChanges(changes: SimpleChanges) {
    if (changes.resizer.previousValue == false && changes.resizer.currentValue == true) {
      this.initializeGrip = true;
    }
  }

  ngDoCheck() {
    if (this.initializeGrip && this.grip) {
      this.doResize();
      this.initializeGrip = false;
    }
  }
}
