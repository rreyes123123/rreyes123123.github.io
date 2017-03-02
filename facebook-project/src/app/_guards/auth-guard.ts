import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router) { }

    canActivate() {
        if (localStorage.getItem('response') && localStorage.getItem('page_access_token')) {
            console.log("auth guard");
            console.log(localStorage.getItem('response'));
            console.log(localStorage.getItem('page_access_token'));
            // logged in so return true
            return true;
        }

        // not logged in so redirect to login page
       this.router.navigate(['login']);
       return false;
    }
}