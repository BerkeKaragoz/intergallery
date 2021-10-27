import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BrowseRoutingModule } from './browse-routing.module';
import { BrowseComponent } from './browse.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { HeaderComponent } from '../../components/layout/header/header.component';
import { ContainerComponent } from '../../components/atomic/container/container.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MediaCardComponent } from 'src/app/components/molecular/media-card/media-card.component';
import { MatIconModule } from '@angular/material/icon';
import { BrowseSidebarComponent } from 'src/app/components/layout/browse-sidebar/browse-sidebar.component';

@NgModule({
  declarations: [
    BrowseComponent,
    HeaderComponent,
    ContainerComponent,
    MediaCardComponent,
    BrowseSidebarComponent,
  ],
  imports: [
    CommonModule,
    BrowseRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatCheckboxModule,
    MatIconModule,
    LayoutModule,
  ],
})
export class BrowseModule {}
