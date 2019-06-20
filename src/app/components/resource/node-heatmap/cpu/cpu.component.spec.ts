import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CpuComponent } from './cpu.component';
import { Router } from '@angular/router';
import { SharedModule } from 'app/shared.module';


const routerStub = {
  navigate: () => { },
}

describe('CpuComponent', () => {
  let component: CpuComponent;
  let fixture: ComponentFixture<CpuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CpuComponent],
      imports: [SharedModule],
      providers: [
        { provide: Router, useValue: routerStub }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpuComponent);
    component = fixture.componentInstance;
    component.activeMode = 'By Node';
    component.nodes = [
      {
        id: 1,
        value: 90
      }
    ];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();

    let tile = fixture.nativeElement.querySelectorAll(".tile");
    expect(tile.length).toBe(1);
  });
});
