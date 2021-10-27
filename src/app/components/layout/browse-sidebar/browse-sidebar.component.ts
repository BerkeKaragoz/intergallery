import { MediaType } from './../../../core/media/media.entity';
import { Component, Input, OnInit } from '@angular/core';
import MediaEntity from 'src/app/core/media/media.entity';

@Component({
  selector: 'app-browse-sidebar',
  templateUrl: './browse-sidebar.component.html',
  styleUrls: ['./browse-sidebar.component.scss'],
})
export class BrowseSidebarComponent implements OnInit {
  @Input() hoveredMedia: MediaEntity | null = null;

  mediaType = MediaType;

  constructor() {}

  ngOnInit(): void {}
}
