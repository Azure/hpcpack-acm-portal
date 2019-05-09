import { Directive, ElementRef, HostBinding, HostListener, Input, Output, EventEmitter, OnChanges, SimpleChange, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[accessibleRow]'
})
export class AccessibleTableRowDirective implements OnChanges {
  @HostBinding('tabindex') tabindex = -1;
  @HostBinding('attr.aria-selected') selected = false;
  @HostBinding('attr.role') row = 'row';
  @HostBinding('attr.aria-label') description;
  // the object value of row
  @Input() accessibleRow;
  // if the row is the first item of data, its tabindex value should be 0
  @Input() firstRow;
  /* emit the up-to-date focus element id to parent table to get dom position, 
  in case of inconsecutive navigation causing by virtual scroll's dynamic rendering */
  @Output() focusRow = new EventEmitter();
  // current row's children elements which has tabindex attribute
  private childrenDoms;
  // add header info using displayedColumns 
  @Input() displayedColumns;
  //ensure only one item is focusable when table is focus out
  @Input() focusRowId;

  // using mat-checkbox, so query mat-checkbox label and invoke click event to change checkbox value
  private checkbox: HTMLElement;

  constructor(private el: ElementRef) { }

  // get row description text using by screen reader
  getCells() {
    this.description = 'table row ';
    let cells = Array.from(<HTMLElement[]>this.el.nativeElement.querySelectorAll('.icon-cell'));
    let visibleCells = cells.filter(cell => cell.style.display !== 'none');
    visibleCells.sort((previous, current) => {
      return Number(previous.style.order) - Number(current.style.order);
    });
    this.description += visibleCells.map((ele: HTMLElement, index: number) => {
      return `${this.displayedColumns[index]} ${ele.querySelector('.cell-text').textContent}`
    }).join(' ');
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes) {
      setTimeout(() => {
        this.getCells();
      }, 0);
    }
  }

  get isRowSelectable() {
    this.checkbox = this.el.nativeElement.querySelector('mat-checkbox label');
    if (this.checkbox) {
      return true;
    }
    return false;
  }

  ngAfterViewInit() {
    this.getCells();
    this.childrenDoms = this.el.nativeElement.querySelectorAll('[tabindex]');
    if (this.firstRow) {
      this.tabindex = 0;
    }
  }

  @HostListener('focus')
  onRowFocus() {
    this.selected = true;
    this.tabindex = 0;
    //emmit row id when virtual scroll changes the index to get the right focus item position in DOM.
    this.focusRow.emit(this.accessibleRow.id);
    this.makeChildrenFocusable();
  }

  @HostListener('blur')
  onRowBlur() {
    if (this.accessibleRow.id == this.focusRowId) {
      return;
    }
    this.selected = false;
    this.tabindex = -1;
    this.makeChildrenNotFocusable();
  }

  // only focus row's children elements could be tabbable
  makeChildrenFocusable() {
    this.childrenDoms.forEach(element => {
      element.setAttribute('tabindex', '0');
    });
  }

  makeChildrenNotFocusable() {
    this.childrenDoms.forEach(element => {
      element.setAttribute('tabindex', '-1');
    });
  }


  @HostListener('keydown', ['$event'])
  onkeydown($event) {
    switch ($event.key) {
      case 'ArrowDown':
        this.moveTo('down');
        break;
      case 'ArrowUp':
        this.moveTo('up');
        break;
      case 'Enter':
        if (this.isRowSelectable) {
          this.checkbox.click();
        }
        break;
      default:
        return;
    }
  }

  // get sibling DOM to update focus row
  moveTo(direction: string) {
    let siblingNode: HTMLElement;
    if (direction == 'down') {
      siblingNode = this.el.nativeElement.nextSibling;
    }
    else if (direction == 'up') {
      siblingNode = this.el.nativeElement.previousSibling;
    }
    let isItem = siblingNode ? siblingNode.classList : null;
    if (siblingNode && isItem && isItem.contains('list-item')) {
      this.el.nativeElement.setAttribute('tabIndex', '-1');
      this.el.nativeElement.setAttribute('aria-selected', 'false');
      this.el.nativeElement.blur();

      siblingNode.setAttribute('tabindex', '0');
      siblingNode.setAttribute('aria-selected', 'true');
      siblingNode.focus();
      this.makeChildrenNotFocusable();
    }
  }
}
