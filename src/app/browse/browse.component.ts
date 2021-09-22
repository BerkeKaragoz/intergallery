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

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getMedia();
  }

  getMedia() {
    this.mediaList = this.http.get(this.ROOT_URL + '/media/all');
  }

  getMediaSource(media: any) {
    return media.sources[0].isLocal
      ? this.ROOT_URL + '/file/get/' + media.sources[0].url
      : media.sources[0].url;
  }
}
