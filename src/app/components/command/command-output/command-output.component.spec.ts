import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommandOutputComponent } from './command-output.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from 'app/shared.module';

describe('CommandOutputComponent', () => {
  let component: CommandOutputComponent;
  let fixture: ComponentFixture<CommandOutputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CommandOutputComponent],
      imports: [SharedModule, NoopAnimationsModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommandOutputComponent);
    component = fixture.componentInstance;
    component.content = 'test content';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    let text = fixture.nativeElement.querySelector('pre').textContent;
    expect(text).toEqual('test content');
  });
});
