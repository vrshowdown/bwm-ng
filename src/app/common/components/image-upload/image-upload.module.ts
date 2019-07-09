import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';//Angular 8
import { ImageCropperModule } from 'ngx-image-cropper';

import { ImageUploadComponent } from './image-upload.component';

import { ImageUploadService } from './image-upload.service';


@NgModule({
imports: [
    CommonModule,
    HttpClientModule,
    ImageCropperModule
],
providers:[
    ImageUploadService
],
exports: [
    ImageUploadComponent,
  
],
declarations: [
    ImageUploadComponent,
]

})

export class ImageUploadModule {}