import { CreateSourceDTO } from "./../../../../core/media/dto/source.dto"
import { MediaService } from "./../../../../core/media/media.service"
import { FormGroup, FormBuilder, Validators } from "@angular/forms"
import { MediaType } from "../../../../core/media/media.entity"
import { Component, Input, OnInit, Inject } from "@angular/core"
import MediaEntity from "src/app/core/media/media.entity"
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog"

export interface DialogData {
   name: string
   sources: Array<CreateSourceDTO>
}

@Component({
   selector: "app-browse-sidebar",
   templateUrl: "./browse-sidebar.component.html",
   styleUrls: ["./browse-sidebar.component.scss"],
})
export class BrowseSidebarComponent implements OnInit {
   @Input() hoveredMedia: MediaEntity | null = null
   @Input() page: number | null = null
   @Input() totalPages: number | null = null
   @Input() perPage: number | null = null

   mediaType = MediaType

   constructor(public dialog: MatDialog) {}
   name!: string
   sources!: Array<CreateSourceDTO>

   openDialog() {
      const dialogRef = this.dialog.open(AddMediaDialog, {
         width: "250px",
         data: { name: this.name, sources: this.sources },
      })

      dialogRef.afterClosed().subscribe((result) => {
         console.log("The dialog was closed")
         this.sources = result
      })
   }

   ngOnInit(): void {}
}

@Component({
   selector: "add-media-dialog",
   templateUrl: "add-media-dialog.component.html",
})
export class AddMediaDialog implements OnInit {
   @Input() mediaForm!: FormGroup

   isFormLoading = false
   isFormSuccess = false

   constructor(
      public dialogRef: MatDialogRef<AddMediaDialog>,
      private fb: FormBuilder,
      @Inject(MAT_DIALOG_DATA) public data: DialogData,
      private mediaService: MediaService
   ) {}

   ngOnInit(): void {
      this.mediaForm = this.fb.group({
         name: ["", Validators.required],
         url: ["", Validators.required],
         isLocal: [true, Validators.required],
      })
   }

   onNoClick(): void {
      this.dialogRef.close()
   }

   async submitHandler() {
      if (this.mediaForm.valid) {
         this.isFormLoading = true

         const formValue = this.mediaForm.value

         try {
            this.isFormSuccess = true
            console.log("Sent: ", formValue)

            const name = formValue.name
            const sources = [
               {
                  url: formValue.url,
                  isLocal: formValue.isLocal,
               },
            ]

            this.mediaService
               .createMedia(name, sources)
               .toPromise()
               .then((res) => {
                  console.log(res)
               })
         } catch (err) {
            this.isFormSuccess = false
            console.error(err)
         }

         this.isFormLoading = false
      } else {
         console.error("The form is not valid!")
      }
   }
}
