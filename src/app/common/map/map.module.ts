
//modules
import { NgModule } from '@angular/core';
import { AgmCoreModule } from '@agm/core';
import {CommonModule} from '@angular/common';
//components and other imports
import { MapComponent } from'./map.component';
import{ CamelizePipe } from 'ngx-pipes';
import { MapService } from './map.service';

// Register main components of the site  by declaring them
@NgModule({
  declarations: [
    MapComponent
  ],
  exports:[
    MapComponent
    ],
    imports: [
        AgmCoreModule.forRoot({ apiKey: 'AIzaSyCxFVx5KlCDE577ijGlV5F2_rHGbqpXFWw' }),
        CommonModule 
    ],
  providers: [
    MapService,
    CamelizePipe
  ],
})
export class MapModule { }
