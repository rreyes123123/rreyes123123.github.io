import { Component } from '@angular/core';
declare var window: any;
declare var FB: any;
declare var js: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Facebook Post Manager!';
  constructor() {
    if(localStorage.getItem('response'))
    {
      console.log(localStorage.getItem('response'));
      console.log(JSON.parse(localStorage.getItem('response')).authResponse);
      localStorage.setItem('user_access_token',JSON.parse(localStorage.getItem('response')).authResponse.accessToken);
    }
  }
}
