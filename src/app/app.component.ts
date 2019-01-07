import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  //title = 'app';
  //Example of property Binding
  //a String variable in ts
  componentTitle = "I am app component from component.ts";
  // ts Function Used for event Binding
  clickHandler(){
    alert("I am Clicked!");
  }
}
