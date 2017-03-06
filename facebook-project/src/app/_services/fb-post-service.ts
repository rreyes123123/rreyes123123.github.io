import { Injectable, OnInit } from '@angular/core';
import { Http, Headers, RequestOptions, Response, Request, RequestMethod } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { FbPagePost } from '../_models/post';
import { Place } from '../_models/place';
import { PromotableFbPagePost } from '../_models/promotable-post';

@Injectable()
export class FbPostService {
    private user_access_token;
    private page_access_token;
    private pageId = 990930044341548;//165610100609672;
    constructor(private http: Http) {
        this.user_access_token = localStorage.getItem('user_access_token');
        this.page_access_token = localStorage.getItem('page_access_token');
    }

    getFbPost() {
        var url = "https://graph.facebook.com/v2.8";
        let url1 = this.pageId + "/feed?fields=created_time,link,name,picture,description,message,story,place&limit=5";
        let url2 = "/insights/post_impressions_unique/lifetime?fields=values&ids={result=first:$.data.*.id}";
        let req1 = {
            method: "GET",
            name: "first",
            relative_url: url1,
            omit_response_on_success: false
        };
        let req2 = {
            method: "GET",
            name: "second",
            relative_url: url2
        };
        let batch = JSON.stringify([req1, req2]);
        let body = ({
            access_token: localStorage['page_access_token'],
            batch: (batch)
        });
        return this.http.post(url, body)
            .map(response => response.json())
    }
    getNext(url1: string) {
        let url = "https://graph.facebook.com/v2.8/";
        url1 = url1.replace(url, "");
        let url2 = "/insights/post_impressions_unique/lifetime?fields=values&ids={result=first:$.data.*.id}";
        let req1 = {
            method: "GET",
            name: "first",
            relative_url: url1,
            omit_response_on_success: false
        };
        let req2 = {
            method: "GET",
            name: "second",
            relative_url: url2
        };
        let batch = JSON.stringify([req1, req2]);
        let body = ({ access_token: localStorage['page_access_token'], batch: (batch) });
        return this.http.post(url, body)
            .map(response => response.json())
    }

    getUnpublishedFbPosts() {
        let edge = "/promotable_posts?";
        let fields = "fields=message,scheduled_publish_time,attachments{media{image{src}},subattachments{media{image{src}}}},";
        fields += "created_time,place,application,from,is_hidden,permalink_url,privacy,status_type,story_tags,story,updated_time";
        let flag = "&is_published=false&limit=5";
        let access_token = "&access_token=" + this.user_access_token;
        let url = "https://graph.facebook.com/v2.8/" + this.pageId + edge + fields + flag + access_token;
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.get(url, options)
            .map(response => response.json());
    }
    getNextUnpublished(url1: string){
        return this.http.get(url1)
            .map(response => response.json())

    }

    uploadFbPostWithPhoto(post: FbPagePost): Promise<any> {
        let edge = post.pictureFile ? "/photos?" : "/feed?";
        let message = post.message ? "message=" + post.message : "";
        let place = post.place ? "&place=" + post.place.id : "";
        let stamp = post.created_time ? post.created_time.getTime() / 1000 - (post.created_time.getTime() / 1000) % 1 : "";
        let scheduled = post.created_time ? "&scheduled_publish_time=" + stamp + "&published=false" : "";
        let url = "https://graph.facebook.com/v2.8/" + this.pageId
            + edge
            + message
            + place
            + scheduled
            + "&access_token=" + this.page_access_token
        let headers = new Headers({ 'Content-Type': 'application/json' });
        headers.append('Content-Type', 'multipart/form-data');
        let options = new RequestOptions({ headers: headers });
        let body: FormData;
        body = new FormData();
        body.append("source", post.pictureFile, post.pictureFile.name);
        return new Promise(
            (resolve, reject) => {
                let xhr: XMLHttpRequest = new XMLHttpRequest();
                xhr.onreadystatechange = () => {
                    if (xhr.readyState === 4) {
                        if (xhr.status === 200) {
                            resolve(JSON.parse(xhr.response));
                            Observable.throw(xhr.response);
                            return xhr.response;
                        } else {
                            reject(xhr.response);
                            Observable.throw(xhr.response);
                            return xhr.response;
                        }
                    }
                };
                xhr.open('POST', url, true);
                xhr.send(body);
            });
    }

    createFbPostWithPost(post: FbPagePost): Observable<Response> {
        let edge = post.pictureFile ? "/photos?" : "/feed?";
        let message = post.message ? "message=" + post.message : "";
        let place = post.place ? "&place=" + post.place.id : "";
        let stamp = post.created_time ? post.created_time.getTime() / 1000 - (post.created_time.getTime() / 1000) % 1 : "";
        let scheduled = post.created_time ? "&scheduled_publish_time=" + stamp + "&published=false" : "";
        let url = "https://graph.facebook.com/v2.8/" + this.pageId
            + edge
            + message
            + place
            + scheduled
            + "&access_token=" + localStorage['page_access_token'];
        return this.http.post(url, "")
            .map(response => response.json())
            .catch(this.handleError);
    }

    private handleError(error: Response | any) {
        let errMsg: string;
        if (error instanceof Response) {
            if (error.status == 400) {
                let err = JSON.parse(error['_body']);
                let msg = err.error.error_user_msg;
                if (!msg) {
                    msg = err.error.message;
                }
                return Observable.throw(msg);
            }
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        return Observable.throw(errMsg);
    }

}