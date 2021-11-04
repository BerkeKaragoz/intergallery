import { ActivatedRoute, Router } from '@angular/router';
import URL from './../../core/consts/url';
import { MediaService } from '../../core/media/media.service';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import MediaEntity from 'src/app/core/media/media.entity';
import { Observable, of } from 'rxjs';

const initialPage = 1;
const initialPerPage = 20;

@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.scss'],
})
export class BrowseComponent implements OnInit {
  @Input() mediaForm!: FormGroup;

  isFormLoading = false;
  isFormSuccess = false;

  page = initialPage;
  perPage = initialPerPage;

  mediaList$: Observable<Array<MediaEntity>> | undefined;
  hoveredMedia: MediaEntity | null = null;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private mediaService: MediaService
  ) {}

  ngOnInit(): void {
    this.mediaForm = this.fb.group({
      name: ['', Validators.required],
      url: ['', Validators.required],
      isLocal: [true, Validators.required],
    });

    this.route.queryParams.subscribe((params) => {
      const pageParam = +params['page'];
      const perPageParam = +params['perPage'];

      this.page = isNaN(pageParam) ? initialPage : pageParam;
      this.perPage = isNaN(perPageParam) ? initialPerPage : perPageParam;

      this.getUserMedia(this.page, this.perPage);
    });
  }

  getUserMedia(page = initialPage, perPage = initialPerPage) {
    this.mediaService.getUserMedia(page, perPage).subscribe((res) => {
      console.log(res);
      this.mediaList$ = of(res.data);
    });
  }

  getMediaSource(media: MediaEntity) {
    return URL.BASE + '/media/source/' + media.id;
  }

  setHoveredMedia(media: MediaEntity | null) {
    this.hoveredMedia = media;
  }

  async submitHandler() {
    if (this.mediaForm.valid) {
      this.isFormLoading = true;

      const formValue = this.mediaForm.value;

      try {
        this.isFormSuccess = true;
        console.log('Sent: ', formValue);

        const name = formValue.name;
        const sources = [
          {
            url: formValue.url,
            isLocal: formValue.isLocal,
          },
        ];

        this.mediaService
          .createMedia(name, sources)
          .toPromise()
          .then((res) => {
            console.log(res);
            this.getUserMedia();
          });
      } catch (err) {
        this.isFormSuccess = false;
        console.error(err);
      }

      this.isFormLoading = false;
    } else {
      console.error('The form is not valid!');
    }
  }
}
