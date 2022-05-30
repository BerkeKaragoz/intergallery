import { MediaType } from "./../../../core/media/media.entity"
import { Component, Input, OnInit } from "@angular/core"
import URL from "src/app/core/consts/url"
import MediaEntity, { Media } from "src/app/core/media/media.entity"

@Component({
   selector: "app-media-card",
   templateUrl: "./media-card.component.html",
   styleUrls: ["./media-card.component.scss"],
})
export class MediaCardComponent implements OnInit {
   @Input() src: string | undefined
   @Input() media: MediaEntity = new Media()

   constructor() {}

   ngOnInit(): void {}

   getMediaSource() {
      if (!this.media) return null
      return URL.BASE + "/media/" + this.media.id + "/source"
   }

   get mediaType(): typeof MediaType {
      return MediaType
   }
}
