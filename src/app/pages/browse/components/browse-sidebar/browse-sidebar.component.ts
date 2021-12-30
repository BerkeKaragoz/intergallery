import { MediaType } from '../../../../core/media/media.entity';
import { Component, Inject, Input, OnInit } from '@angular/core';
import MediaEntity from 'src/app/core/media/media.entity';

@Component({
  selector: 'app-browse-sidebar',
  templateUrl: './browse-sidebar.component.html',
  styleUrls: ['./browse-sidebar.component.scss'],
})
export class BrowseSidebarComponent implements OnInit {
  @Input() hoveredMedia: MediaEntity | null = null;
  @Input() page: number | null = null;
  @Input() totalPages: number | null = null;
  @Input() perPage: number | null = null;

  mediaType = MediaType;

  constructor() {}

  openDialog() {
    console.log('kilk');
  }

  ngOnInit(): void {}
}
