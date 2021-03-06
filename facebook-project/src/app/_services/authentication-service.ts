import { Injectable, OnInit } from '@angular/core';
import { Http, Headers, RequestOptions, Response, Request, RequestMethod } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { FbPagePost } from '../_models/post';
import { Place } from '../_models/place';
import { PromotableFbPagePost } from '../_models/promotable-post';

@Injectable()
export class AuthenticationService implements OnInit {
    private user_access_token;
    private page_access_token;
    constructor(private http:Http){

    }
    ngOnInit() {
    }
    getPageAccessToken()
    {
        this.user_access_token = localStorage['user_access_token'];
        let pageId = 990930044341548;//165610100609672;
        let url = "https://graph.facebook.com/v2.8/" + pageId + "?fields=access_token&access_token=" + this.user_access_token;
        return this.http.get(url)
            .map(response => response.json())
    }

}