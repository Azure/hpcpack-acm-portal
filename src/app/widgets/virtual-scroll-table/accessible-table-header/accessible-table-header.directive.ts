import { Directive, Input, HostBinding, OnChanges, SimpleChanges, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[accessibleHeader]'
})
export class AccessibleTableHeaderDirective implements OnChanges {
  @HostBinding('tabindex') tabindex = 0;
  @HostBinding('attr.role') row = 'row';
  @HostBinding('attr.aria-label') description;
  // add header info using displayedColumns 
  @Input() accessibleHeader;
  // using mat-checkbox, so query mat-checkbox label and invoke click event to change checkbox value
  private checkbox: HTMLElement;

  constructor(private el: ElementRef) { }

  getDescription() {
    this.description = "table header "
    this.description += this.accessibleHeader.join(' ');
  }

  get isHeaderSelectable() {
    this.checkbox = this.el.nativeElement.querySelector('mat-checkbox label');
    if (this.checkbox) {
      return true;
    }
    return false;
  }

  ngAfterViewInit() {
    this.getDescription();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes) {
      this.getDescription();
    }
  }

  @HostListener('keydown', ['$event'])
  onkeydown($event) {
    switch ($event.key) {
      case 'Enter':
        if (this.isHeaderSelectable) {
          this.checkbox.click();
        }
        break;
      default:
        return;
    }
  }


}
