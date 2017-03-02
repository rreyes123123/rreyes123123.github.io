import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

@Injectable()
export class PageGuard implements CanActivate {

    constructor(private router: Router) { }

    canActivate() {
        if (localStorage.getItem('response') && !localStorage.getItem('page_access_token'))
        {
            return true;            
        }
        if (localStorage.getItem('response') && localStorage.getItem('page_access_token')) {
            this.router.navigate(['unpublished']);
            return false;
        }
    }
}