import { AccessibleTableRowDirective } from './accessible-table-row.directive';
import { ElementRef } from '@angular/core';

describe('AccessibleTableRowDirective', () => {
  it('should create an instance', () => {
    let el = new ElementRef('<div></div>');
    const directive = new AccessibleTableRowDirective(el);
    expect(directive).toBeTruthy();
  });
});
