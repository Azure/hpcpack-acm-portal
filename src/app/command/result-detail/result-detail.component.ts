import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { Subscription } from 'rxjs/Subscription';
import { CommandResult } from '../../models/command-result';
import { ApiService, Loop } from '../../services/api.service';
import { NodeSelectorComponent } from '../node-selector/node-selector.component';
import { CommandOutputComponent } from '../command-output/command-output.component';
import { CommandInputComponent } from '../command-input/command-input.component';

@Component({
  selector: 'app-result-detail',
  templateUrl: './result-detail.component.html',
  styleUrls: ['./result-detail.component.scss']
})
export class ResultDetailComponent implements OnInit {
  @ViewChild(NodeSelectorComponent)
  private selector: NodeSelectorComponent;

  @ViewChild(CommandOutputComponent)
  private output: CommandOutputComponent;

  private id: string;

  private result: CommandResult;

  private subcription: Subscription;

  private mainLoop: object;

  private nodeLoop: object;

  private errorMsg: string;

  private nodeOutputs = {};

  private autoload = true;

  private outputInitOffset = -4096;

  private outputPageSize = 4096;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.subcription = this.route.paramMap.subscribe(map => {
      this.nodeOutputs = {};
      this.id = map.get('id');
      this.updateResult(this.id);
    });
  }

  get isLoaded(): boolean {
    return this.result && this.result.nodes.length > 0;
  }

  updateResult(id) {
    this.mainLoop = Loop.start(
      //observable:
      this.api.command.get(id),
      //observer:
      {
        next: (result) => {
          if (id != this.id) {
            return; //A false value indicates the end of the loop
          }
          //NOTE: this.result is replaced by a new object on each new GET so that
          //the node info saved on this.result.nodes doesn't persist between GETs!
          this.result = result;
          if (result.nodes.length == 0) {
            return true;
          }
          //NOTE: this.result.state, which is set by setResultState, is used to
          //determin the end of a node output.
          this.setResultState();
          return !this.isOver;
        },
        error: (err) => {
          this.errorMsg = err;
        }
      }
    );
  }

  ngOnDestroy() {
    if (this.subcription) {
      this.subcription.unsubscribe();
    }
    if (this.mainLoop) {
      Loop.stop(this.mainLoop);
    }
    if (this.nodeLoop) {
      Loop.stop(this.nodeLoop);
    }
  }

  //This should work but not in fact! Because this.selector is set later than
  //selectNode is called. That seems the NodeSelectorComponent can fire events
  //before Angular captures it in this.selector. A surprise!
  //
  //get selectedNode(): any {
  //  return this.selector ? this.selector.selectedNode : null;
  //}

  selectedNode: any;

  selectNode({ node, prevNode }) {
    this.selectedNode = node;
    if (prevNode) {
      this.stopAutoload(prevNode);
    }
    if (!node) {
      return;
    }
    if (this.autoload) {
      this.startAutoload(node);
    }
    else {
      this.loadOnce(node);
    }
  }

  isSelected(node) {
    return node && this.selectedNode && node.name === this.selectedNode.name;
  }

  getNodeOutput(node): any {
    let output = this.nodeOutputs[node.name];
    if (!output) {
      output = this.nodeOutputs[node.name] = {
        content: '', next: this.outputInitOffset, start: undefined, end: undefined, loading: false,
      };
    }
    return output;
  }

  updateNodeOutput(output, result): boolean {
    //NOTE: There may be two inflight updates for the same piece of output, one
    //by autoload and the other one by manual trigger. Drop the one arrives later.
    if (output.next > result.offset) {
      return false;
    }
    //Update start field when and only when it's not updated yet.
    if (typeof(output.start) === 'undefined') {
      output.start = result.offset;
    }
    //NOTE: result.end depends on passing an opt.over parameter to API getOutput.
    output.end = result.end;
    if (result.content) {
      output.content += result.content;
    }
    output.next = result.offset + result.size;
    return result.content ? true : false;
  }

  updateNodeOutputBackward(output, result): boolean {
    //Update next field when and only when it's not updated yet.
    if (output.next === this.outputInitOffset) {
      output.next = result.offset + result.size;
    }
    if (result.content) {
      output.content = result.content + output.content;
    }
    output.start = result.offset;
    return result.content ? true : false;
  }

  stopAutoload(node): void {
    let output = this.getNodeOutput(node)
    output.loading = false;
    if (this.nodeLoop) {
      Loop.stop(this.nodeLoop);
      this.nodeLoop = null;
    }
  }

  startAutoload(node): void {
    let output = this.getNodeOutput(node)
    if (output.end || output.loading) {
      return;
    }
    output.loading = 'auto';
    let opt = { over: () => this.isOutputOver(node) };
    this.nodeLoop = Loop.start(
      //observable:
      this.api.command.getOutput(this.id, node.key, output.next, this.outputPageSize, opt as any),
      //observer:
      {
        next: (result) => {
          if (this.updateNodeOutput(output, result)) {
            setTimeout(() => this.scrollOutputToBottom(), 0);
          }
          let over = output.end || !this.autoload;
          if (over) {
            output.loading = false;
          }
          return over ? false :
            this.api.command.getOutput(this.id, node.key, output.next, this.outputPageSize, opt as any);
        }
      },
      //interval(in ms):
      0,
    );
  }

  loadOnce(node) {
    let output = this.getNodeOutput(node)
    if (output.content || output.end || output.loading) {
      return;
    }
    output.loading = 'once';
    let opt = { fulfill: true, over: () => this.isOutputOver(node), timeout: 2000 };
    this.api.command.getOutput(this.id, node.key, output.next, this.outputPageSize, opt as any).subscribe(
      result => {
        output.loading = false;
        this.updateNodeOutput(output, result);
      }
    );
  }

  get loading(): boolean {
    let output = this.currentOutput;
    return output && output.loading;
  }

  get currentOutput(): any {
    if (!this.selectedNode)
      return;
    return this.getNodeOutput(this.selectedNode);
  }

  get currentOutputUrl(): string {
    return this.selectedNode ? this.api.command.getDownloadUrl(this.id, this.selectedNode.key) : '';
  }

  scrollOutputToBottom(): void {
    this.output.scrollToBottom();
  }

  setResultState() {
    let stats = { running: 0, finished: 0, failed: 0 };
    this.result.nodes.forEach(e => {
      stats[e.state]++;
    });
    let state;
    if (stats.running > 0)
      state = 'running';
    else if (stats.failed > 0)
      state = 'failed';
    else
      state = 'finished';
    this.result.state = state;
    return state;
  }

  get isOver(): boolean {
    let state = this.result.state;
    return state == 'finished' || state == 'failed';
  }

  isNodeOver(node): boolean {
    let state = node.state;
    return state == 'finished' || state == 'failed';
  }

  isOutputOver(node): boolean {
    //NOTE: this.isNodeOver depends on the node info, which may be outdated because
    //the node parameter may be a captured value in a closure, which captured an "old"
    //value. So this.isOver is required and this.isNodeOver is just an optimization.
    return this.isNodeOver(this.selectedNode) || this.isOver;
  }

  toggleAutoload(enabled) {
    this.autoload = enabled;
    if (enabled) {
      this.startAutoload(this.selectedNode);
    }
    else {
      this.stopAutoload(this.selectedNode);
    }
  }

  private scrollTop;

  private scrollHeight;

  loadPrevAndScroll(node, elem) {
    this.scrollTop = elem.scrollTop;
    this.scrollHeight = elem.scrollHeight;
    this.loadPrev(node,
      () => elem.scrollTop = elem.scrollHeight - this.scrollHeight + this.scrollTop);
  }

  loadPrev(node, onload = undefined) {
    let output = this.getNodeOutput(node)
    if (output.start === 0 || output.loading) {
      return;
    }
    let prev;
    let pageSize = this.outputPageSize;
    if (output.start) {
      prev = output.start - this.outputPageSize;
      if (prev < 0) {
        prev = 0;
        pageSize = output.start;
      }
    }
    else {
      prev = this.outputInitOffset;
    }
    output.loading = 'prev';
    let opt = { fulfill: true, over: () => this.isOutputOver(node) };
    this.api.command.getOutput(this.id, node.key, prev, pageSize, opt as any)
      .subscribe(result => {
        output.loading = false;
        if (this.updateNodeOutputBackward(output, result) && onload
          && this.selectedNode && this.selectedNode.name == node.name) {
          setTimeout(onload, 0);
        }
      });
  }

  loadNext(node) {
    let output = this.getNodeOutput(node)
    if (output.end || output.loading) {
      return;
    }
    output.loading = 'next';
    let opt = { fulfill: true, over: () => this.isOutputOver(node), timeout: 2000 };
    this.api.command.getOutput(this.id, node.key, output.next, this.outputPageSize, opt)
      .subscribe(result => {
        output.loading = false;
        this.updateNodeOutput(output, result);
      });
  }

  loadFromBeginAndScroll(node, elem) {
    this.loadFromBegin(node, () => elem.scrollTop = 0);
  }

  loadFromBegin(node, onload) {
    let output = this.getNodeOutput(node)
    if (output.loading) {
      return;
    }
    if (output.start === 0 && onload) {
      setTimeout(onload, 0);
      return;
    }
    //Reset output for loading from the begin
    output.content = '';
    output.start = undefined;
    output.end = undefined;
    output.next = 0;
    output.loading = 'top';
    let opt = { fulfill: true, over: () => this.isOutputOver(node), timeout: 2000 };
    this.api.command.getOutput(this.id, node.key, output.next, this.outputPageSize, opt as any).subscribe(
      result => {
        output.loading = false;
        this.updateNodeOutput(output, result);
        setTimeout(onload, 0);
      }
    );
  }

  newCommand() {
    let dialogRef = this.dialog.open(CommandInputComponent, {
      width: '98%',
      data: { command: this.result.command }
    });
    dialogRef.afterClosed().subscribe(cmd => {
      if (cmd) {
        let names = (this.result as any).targetNodes;
        this.api.command.create(cmd, names).subscribe(obj => {
          this.router.navigate([`/command/results/${obj.id}`]);
        });
      }
    });
  }

  cancelCommand() {
  }
}
