
import {of as observableOf,  Observable } from 'rxjs';

// this is were the map functions are located
import { Injectable } from '@angular/core';
import{ CamelizePipe } from 'ngx-pipes';

@Injectable()
export class MapService {

    private geoCoder; //variable to accesss a google geocoder class that operates in the browser
    private locationCache: any = {}; // holds saved cache location data
   
    constructor(private camelizePipe: CamelizePipe) {} 
    private cacheLocation(location: string, coordinates: any){//Function to save location in cache
        this.locationCache[this.camelize(location)] = coordinates;
    }

// function  to check if location is saved in cached
    private isLocationCached(location): boolean{
        return this.locationCache[this.camelize(location)];
    }

//helper function to shorten strings that need to be camelized
    private camelize(value: string): string {
        return this.camelizePipe.transform(value);
    }

// Function  to get geo location from Server
    private geocodeLocation(location: string): Observable<any>{
        // for to not keep loading instances  of the geocoder window
        if (!this.geoCoder){
            // loads geocoder window
            this.geoCoder = new (<any>window).google.maps.Geocoder();
           }

        return new Observable((observer) => {
            //looks for location based on address
            this.geoCoder.geocode({address: location}, (result, status) =>{
                if (status === 'OK') {
                    //if geocode found  gets location and coordinates
                    const geometry = result[0].geometry.location;
                    const coordinates = {lat: geometry.lat(), lng: geometry.lng()};
                    observer.next(coordinates);
                    //saves to cache
                    this.cacheLocation(location, coordinates);
                }else{
                    observer.error( 'Location could not be geocoded' );
                }
            });
        });
    }

// Chooses to get geo location from cache or  server
    public getGeoLocation(location: string): Observable<any> {
       //uses method to checks to see if there is that location in cache
            if (this.isLocationCached(location)){
                //Gets geocode location from cache
                return observableOf(this.locationCache[this.camelize(location)]);
            }else{
                // Gets Geocode location from server
                return this.geocodeLocation(location);
            }
       
    }

    
}

