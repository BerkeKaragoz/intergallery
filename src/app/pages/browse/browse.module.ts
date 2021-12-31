import { AddMediaDialog } from './components/browse-sidebar/browse-sidebar.component';
import { FooterComponent } from 'src/app/components/layout/footer/footer.component';
import { NgModule } from '@angular/core';

import { BrowseRoutingModule } from './browse-routing.module';
import { BrowseComponent } from './browse.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
  MatDialogModule,
  MAT_DIALOG_DEFAULT_OPTIONS,
} from '@angular/material/dialog';
import { ContainerComponent } from '../../components/atomic/container/container.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MediaCardComponent } from 'src/app/components/molecular/media-card/media-card.component';
import { MatIconModule } from '@angular/material/icon';
import { BrowseSidebarComponent } from 'src/app/pages/browse/components/browse-sidebar/browse-sidebar.component';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from 'src/app/components/layout/header/header.component';

@NgModule({
  declarations: [
    BrowseComponent,
    HeaderComponent,
    ContainerComponent,
    MediaCardComponent,
    BrowseSidebarComponent,
    FooterComponent,
    AddMediaDialog,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatCheckboxModule,
    MatIconModule,
    MatDialogModule,
    LayoutModule,
    BrowseRoutingModule,
  ],
  bootstrap: [BrowseComponent],
  providers: [
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: true } },
  ],
})
export class BrowseModule {}
