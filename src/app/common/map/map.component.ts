
//This is where  The Map Functions are handled

import { Component, Input, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { MapService } from './map.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'bwm-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnDestroy{

@Input() location: string|any;
@Input() locationSubject?: Subject<any>;

isPositionError: boolean = false;
lat: any;
lng: any;

constructor(private mapService: MapService, private ref:ChangeDetectorRef) { }
/***********New map variables*************** */
display: any;
center:any;
zoom = 12;
moveMap(event: google.maps.MapMouseEvent) {
        if (event.latLng != null) this.center = (event.latLng.toJSON());
}
move(event: google.maps.MapMouseEvent) {
        if (event.latLng != null) this.display = event.latLng.toJSON();
}
/******************************************* */

ngOnInit(){
if (this.locationSubject){
this.locationSubject.subscribe(
(location: string)=>{
 this.getLocation(location);
});
}
this.getLocation(this.location);
}
ngOnDestroy(){
        
if (this.locationSubject) {
this.locationSubject.unsubscribe();
}
}

getLocation(location:any){     
   this.mapService.getGeoLocation(location).subscribe(

(coordinates:any)=>{
        
        this.lat = coordinates.lat;
        this.lng = coordinates.lng;
       let center:google.maps.LatLngLiteral|any={
        lat:this.lat,
        lng:this.lng
       }
       this.center = center;
        this.ref.detectChanges();
}, 

() =>{ 
        
        this.isPositionError = true;
        this.ref.detectChanges();
});
}


  mapReadyHandler(){

 this.getLocation(this.location);
    }
}