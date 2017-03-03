import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../_services/authentication-service';
declare var window: any;
declare const FB: any;
declare var $: any;

@Component({
  selector: "login-app",
  templateUrl: './login.component.html'
})
export class LoginComponent {
  loggedIn = localStorage.getItem('user_access_token') != null;
  ngOnInit()
  {    
  }
  statusChangeCallback(response) {
    console.log('statusChangeCallback');
    console.log(response);
    if (response.status === 'connected') {
      console.log("connected");
      localStorage.setItem('response', JSON.stringify(response));
      localStorage.setItem('user_access_token', response.authResponse.accessToken)
      this.authService
        .getPageAccessToken()
        .subscribe(
                data=>{
                    localStorage['page_access_token'] = data.access_token;
                    console.log("login");                
                    console.log(data);               
                    console.log(localStorage['page_access_token']);      
                    this.router.navigate(['unpublished']);
                }
            )
      
    } else if (response.status === 'not_authorized') {
      // The person is logged into Facebook, but not your app.
      document.getElementById('status').innerHTML = 'Please log ' +
        'into this app.';
    } else {
      // The person is not logged into Facebook, so we're not sure if
      // they are logged into this app or not.
      document.getElementById('status').innerHTML = 'Please log ' +
        'into Facebook.';
    }
  }

  constructor(private router:Router, private authService:AuthenticationService) {
    // var btn = document.getElementById('btnsave');
    // btn.addEventListener("click", this.login, false);
  function statusChangeCallback(response) {
    console.log('statusChangeCallback');
    console.log(response);
    if (response.status === 'connected') {
      console.log("connected");
    } else if (response.status === 'not_authorized') {
      // The person is logged into Facebook, but not your app.
      document.getElementById('status').innerHTML = 'Please log ' +
        'into this app.';
    } else {
      // The person is not logged into Facebook, so we're not sure if
      // they are logged into this app or not.
      document.getElementById('status').innerHTML = 'Please log ' +
        'into Facebook.';
    }
  }
    console.log("in app component constructor");      
    window.fbAsyncInit = function() {
    FB.init({
      appId      : 1442982042632308,
      cookie     : true,  // enable cookies to allow the server to access 
                          // the session
      xfbml      : true,  // parse social plugins on this page
      version    : 'v2.8' // use graph api version 2.8
    });

    FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
    });


    };

    if(localStorage.getItem('response'))
    {
      console.log(localStorage.getItem('response'));
      console.log(JSON.parse(localStorage.getItem('response')).authResponse);
      localStorage.setItem('user_access_token',JSON.parse(localStorage.getItem('response')).authResponse.accessToken);
    }
    FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
    });
  }

  login() {
    this.loggedIn = true;
    let that = this;
    console.log("in login");
    FB.login(function(response){
      console.log(response);
      that.statusChangeCallback(response);
    },{scope:'public_profile,email,manage_pages,read_insights,publish_pages'} 
    );
  }
  logout()
  {
      localStorage.removeItem('response');
      localStorage.removeItem('user_access_token');
      localStorage.removeItem('page_access_token');
    this.loggedIn = false
    let self = this;
    console.log("in logout");
    FB.logout(function(response) {
      // Person is now logged out
      console.log(response);
      localStorage.removeItem('response');
      localStorage.removeItem('user_access_token');
      localStorage.removeItem('page_access_token');
      self.router.navigate(['']);
    });
  }

}
