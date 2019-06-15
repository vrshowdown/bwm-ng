
//This is where  The Map Functions are handled 

import { Component, Input, ChangeDetectorRef } from '@angular/core';
import { MapService } from './map.service';

@Component({
  selector: 'bwm-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent{
@Input() location: string;
isPositionError: boolean = false;
lat: number; 
lng: number;

constructor(private mapService: MapService, private ref:ChangeDetectorRef) { }
 
// when map is ready use map service to get coordinates
  mapReadyHandler(){
    this.mapService.getGeoLocation(this.location).subscribe(
      (coordinates)=>{
        this.lat = coordinates.lat;
        this.lng = coordinates.lng;
        this.ref.detectChanges();//hotfix
      }, () =>{ //0 cordinates  = true for error
        this.isPositionError = true;
        this.ref.detectChanges();//hotfix
        });
    }
}

