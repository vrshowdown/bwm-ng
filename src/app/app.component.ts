//This is the main component in this website 
// uses html and css template to build the site and add extra functionality with ts and javascript
//builds app.component.html in index.html, which displays sub components, like header component and routes to rental and temp components 'pages' 

import { Component } from '@angular/core'; // will be recognized as a component in angular

@Component({
  selector: 'app-root', // will select html tag that says "app-root" and render out component in index.html with template
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  //Example of property Binding
  //a String variable in ts
  componentTitle = "I am app component from component.ts";
  // ts Function Used for event Binding
  clickHandler(){
    alert("I am Clicked!");
  }
  
}
