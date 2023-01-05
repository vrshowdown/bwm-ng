
//modules
import { NgModule } from '@angular/core';
//import { AgmCoreModule } from '@agm/core';
import { GoogleMapsModule } from '@angular/google-maps';
import {CommonModule} from '@angular/common';
//components and other imports
import { MapComponent } from'./map.component';
import{ CamelizePipe } from 'ngx-pipes';
import { MapService } from './map.service';
import { environment } from '../../../environments/environment';


// Register main components of the site  by declaring them
@NgModule({
  declarations: [
    MapComponent
  ],
  exports:[
    MapComponent
    ],
    imports: [
      GoogleMapsModule,
        //AgmCoreModule.forRoot({ apiKey: environment.GOOGLE_MAP_PUBLIC_KEY}),
        CommonModule 
    ],
  providers: [
    MapService,
    CamelizePipe
  ],
})
export class MapModule { }
