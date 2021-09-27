import { MediaService } from '../../core/media/media.service';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.scss'],
})
export class BrowseComponent implements OnInit {
  urls = [];

  mediaList: any;
  readonly ROOT_URL = 'http://localhost:3000';

  constructor(private http: HttpClient, private mediaService: MediaService) {}

  ngOnInit(): void {
    this.getUserMedia();
  }

  getUserMedia() {
    this.mediaList = this.mediaService.getUserMedia();
  }

  getMediaSource(media: any) {
    return this.ROOT_URL + '/media/source/' + media.id;
  }
}
