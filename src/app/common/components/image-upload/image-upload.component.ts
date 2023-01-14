import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ImageUploadService } from './image-upload.service';
import { ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { map } from 'rxjs';


class FileSnippet {
  static readonly IMAGE_SIZE = {width: 475, height: 360};
  static readonly IMAGE_SIZE2 = {width: 300, height: 300};
  pending: boolean = false;
  status: string = 'INIT';
 

  constructor(public src: string, 
              public file: File){}
}

@Component({
  selector: 'bwm-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss']
})

export class ImageUploadComponent {

  @Output() imageChange = new EventEmitter();
  @Output() imageError = new EventEmitter();
  @Output() imageLoadedToContainer = new EventEmitter();
  @Output() croppingCanceled = new EventEmitter();

  selectedFile:FileSnippet|any;
  imageChangedEvent: any;
  url:string|any;
  pro:boolean|any;
  croppedImage:any = '';
  constructor(private toastr: ToastrService,
              private imageService: ImageUploadService,
              private router: Router){}

  private onSuccess(imageUrl: string){
    this.selectedFile.pending = false;
    this.selectedFile.status = 'OK';
    this.imageChangedEvent = null;
    this.imageChange.emit(imageUrl);
  }
  private onFailure(){
    this.selectedFile.pending = false;
    this.selectedFile.status = 'FAIL';
    this.imageChangedEvent = null;
    this.imageError.emit('');
  }

  imageCropped(event: ImageCroppedEvent, file:File|any): FileSnippet | File {
       this.croppedImage = event.base64;
       file = this.convertBase64ToBlob(this.croppedImage);
    if (this.selectedFile){
      return this.selectedFile.file = file;
    }

    return this.selectedFile = new FileSnippet('', file);
  }

  imageLoaded(){
    this.imageLoadedToContainer.emit();
  }
cropperReady(){
  return console.log('Cropper Ready');
}
loadImageFailed(){
  return console.log('load Image Failed');
}
  cancelCropping(){
    this.imageChangedEvent = null;
    this.croppingCanceled.emit();
  }

  processFile(event: any){
    this.selectedFile =  undefined;

    
    const url = this.router.url;
    const URL = window.URL;
   
    let file; 
    let img:any;
    if ((file = event.target.files[0]) && (file.type === 'image/png' || file.type === 'image/jpeg')){

      img = new Image();
      const self = this;
     
      img.onload = function (){

        if(url !== '/users/profile' ){
          if ( this.width > FileSnippet.IMAGE_SIZE.width && this.height > FileSnippet.IMAGE_SIZE.height){
           self.pro = false;
           
            self.imageChangedEvent = event;

          }else{

            self.toastr.error(`Minimum width is ${FileSnippet.IMAGE_SIZE.width} and minimum height is ${FileSnippet.IMAGE_SIZE.height}`, 'Error!');
          }

        }else{

          if ( this.width > FileSnippet.IMAGE_SIZE2.width && this.height > FileSnippet.IMAGE_SIZE2.height){
            self.pro = true;
            self.imageChangedEvent = event;

          }else{

            self.toastr.error(`Minimum width is ${FileSnippet.IMAGE_SIZE2.width} and minimum height is ${FileSnippet.IMAGE_SIZE2.height}`, 'Error!');
          }
        }

      }
      img.src = URL.createObjectURL(file);
    }else{
      this.toastr.error('Unsupported file Type. Only jpeg and png is allowed!', 'Error!');
    }
  }

  uploadImage(){
    if(this.selectedFile){

      const reader = new FileReader();

      reader.addEventListener('load', (event: any) =>{

        this.selectedFile.src = event.target.result;
        this.selectedFile.pending = true;
        
        this.imageService.uploadImage(this.selectedFile.file).subscribe(
        (imageUrl: string) =>{
          this.onSuccess(imageUrl);
        },
        (errorResponse: HttpErrorResponse) =>{
          this.toastr.error(errorResponse.error.errors[0].detail, 'Error!');
          this.onFailure();
        })
      });
      reader.readAsDataURL(this.selectedFile.file);
    }
  }
  convertBase64ToBlob(base64Image: string) {
    // Split into two parts
    const parts = base64Image.split(';base64,');

    // Hold the content type
    const imageType = parts[0].split(':')[1];

    // Decode Base64 string
    const decodedData = window.atob(parts[1]);

    // Create UNIT8ARRAY of size same as row data length
    const uInt8Array = new Uint8Array(decodedData.length);

    // Insert all character code into uInt8Array
    for (let i = 0; i < decodedData.length; ++i) {
      uInt8Array[i] = decodedData.charCodeAt(i);
    }

    // Return BLOB image after conversion
    return new Blob([uInt8Array], { type: imageType });
  } 
}