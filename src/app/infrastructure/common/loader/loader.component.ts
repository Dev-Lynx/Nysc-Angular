import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit {
  @Input() active: boolean;
  @Input() message: string;
  @Input() opacity = 1;

  constructor() { }

  ngOnInit() {
  }
}
