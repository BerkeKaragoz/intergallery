import { Component, OnInit } from "@angular/core"

@Component({
   selector: "app-container",
   template: `<ng-content></ng-content>`,
   styleUrls: ["./container.component.scss"],
})
export class ContainerComponent implements OnInit {
   constructor() {}

   ngOnInit(): void {}
}
