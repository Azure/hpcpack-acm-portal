import { VirtualScrollService } from './virtual-scroll.service';

describe('VirtualScrollService', () => {
  let virtualScrollService: VirtualScrollService;
  beforeEach(() => {
    virtualScrollService = new VirtualScrollService();
  });

  it('should be created', () => {
    expect(virtualScrollService).toBeTruthy();
  });
});
