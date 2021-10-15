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

@NgModule({
  declarations: [BrowseComponent, HeaderComponent, ContainerComponent],
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
    LayoutModule,
  ],
})
export class BrowseModule {}
