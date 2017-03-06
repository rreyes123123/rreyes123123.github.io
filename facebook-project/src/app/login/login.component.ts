import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../_services/authentication-service';

@Component({
    selector: "app-login",
    templateUrl: './login.component.html'
})
export class LoginComponent {
    constructor(private authService: AuthenticationService, private router: Router) {
        this.authService
            .getPageAccessToken()
            .subscribe(
            data => {
                localStorage['page_access_token'] = data.access_token;
                console.log("login");
                console.log(data);
                console.log(data.access_token);
                router.navigate(['home']);
            }
            )

    }

    logout() {
        localStorage['page_access_token'] = null;
    }





}
