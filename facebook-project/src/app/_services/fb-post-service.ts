import { Injectable, OnInit } from '@angular/core';
import { Http, Headers, RequestOptions, Response, Request, RequestMethod } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { FbPagePost } from '../_models/post';
import { Place } from '../_models/place';
import { PromotableFbPagePost } from '../_models/promotable-post';

@Injectable()
export class FbPostService implements OnInit {
    private user_access_token;
    private page_access_token;
    private access_token = "EAACEdEose0cBAI0ZCMWE56Mto3DQ7GmUhGKZAqhXAQIUfZBHObnwL95ti2mjZCF7YIObrxUa1xnG64ZBDgd4ZAvY4DLfwdhNivM9CTJwuZAEQ1aQ3EP7nHmbQZA4JmJLZAJfZCC3UEwg6jU50HQHrz8J9WoiIGUCTFCD92FZA4A3ZBZC9dZBffAbARkCZCoHXJJ74bS0XQZD";
    private pageId = 165610100609672;
    private pageId2 = 165610100609672;

    constructor(private http: Http) {
        this.user_access_token = JSON.parse(localStorage.getItem('response')).authResponse.accessToken;
        this.serviceCall()
            .subscribe(data => {
                this.page_access_token = data['access_token'];
                console.log(data);
            });
    }

    ngOnInit() 
    {
        this.serviceCall()
               .subscribe(data => {
                this.page_access_token = data['access_token'];
                console.log(data);
            });
     }

    serviceCall(): Observable<Object> {
        let url = "https://graph.facebook.com/v2.8/165610100609672?fields=access_token&access_token=" + this.user_access_token;
        return this.http.get(url)
            .map(response => response.json());
    }


    getFbPost(): Observable<FbPagePost[]> {
        let fields = "fields=created_time,link,name,picture,description,message,is_published";
        let url = "https://graph.facebook.com/v2.8/" + this.pageId+ "/feed?fields=created_time,link,name,picture,description,message&access_token=" + this.user_access_token;
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.get(url, options)
            .map(response => response.json().data);
    }

    getUnpublishedFbPosts(): Observable<PromotableFbPagePost[]> {
        let edge = "/promotable_posts?";
        let fields = "fields=message,scheduled_publish_time,attachments{media{image{src}},subattachments{media{image{src}}}},";
        fields += "created_time,place,application,from,is_hidden,permalink_url,privacy,status_type,story_tags,story,updated_time";
        let flag = "&is_published=false";
        let access_token = "&access_token=" + this.user_access_token;
        let url = "https://graph.facebook.com/v2.8/" + this.pageId+ edge +fields + flag + access_token;
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.get(url, options)
            .map(response=> response.json().data);
    }

    responseData: any;

    uploadFbPostWithPhoto(post: FbPagePost): Promise<any> {
        let edge = post.pictureFile ? "/photos?" : "/feed?";
        let message = post.message ? "message=" + post.message : "";
        let place = post.place ? "&place=" + post.place.id : "";
        let stamp = post.created_time ? post.created_time.getTime() / 1000 - (post.created_time.getTime() / 1000) % 1 : "";
        let scheduled = post.created_time ? "&scheduled_publish_time=" + stamp + "&published=false" : "";
        let url = "https://graph.facebook.com/v2.8/" + this.pageId2
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
        let url = "https://graph.facebook.com/v2.8/" + this.pageId2
            + edge
            + message
            + place
            + scheduled
            + "&access_token=" + this.page_access_token;
        return this.http.post(url, "")
            .map(response => response.json())
            .catch(this.handleError);
    }

    batch(){
        var url = "https://graph.facebook.com/v2.8"//&access_token=" + access_token;
        var batch = '[{ "method":"GET","name":"get-friends","relative_url":"me/friends?limit=5",},{"method":"GET","relative_url":"?ids={result=get-friends:$.data.*.id}"}]';
        let req1 = this.pageId+ "/feed?fields=created_time,link,name,picture,description,message";
        var access_token = "EAAUgYnARgHQBAJ99AtjVvYdozZASjzWpUEMjE4angujFBhrZCRNTDuR3VuhikZBIEuQYmvnGzDfBXSDomiEL34SLRi8Rohmerkx03PYNBs0IbdXR5Tqbs48wr3TZAzyZCze0jcnMETfpXZAq848GU8M2w3ASpoAZCJJLZAODkaLSYQZDZD";
//        var batch = "[{"method":"GET", "name":"first","relative_url":"165610100609672/feed?limit(5)"},{"method":"get", "name":"second", "relative_url":"/insights/post_impressions?ids={result=first:$.data.*.id}"}]";
        var batch2 = '[{"method":"GET", "name":"first","relative_url": "165610100609672/feed?fields=created_time,link,name,picture,description,message","omit_response_on_success":false},{"method":"get", "name":"second", "relative_url":"/insights/post_impressions?ids={result=first:$.data.*.id}"}]';
        // var body = JSON.stringify({ access_token: this.page_access_token, batch: batch2 });        
        var body = ({ access_token: access_token, batch: batch2 });
    //      var body = JSON.stringify({ batch: batch });
        return this.http.post(url, body)
            .map(response => response.json())
    }


    

    private handleError(error: Response | any) {
        // In a real world app, we might use a remote logging infrastructure
        let errMsg: string;
        console.log(error);
        if (error instanceof Response) {
            if (error.status == 400) {
                let err = JSON.parse(error['_body']);
                let msg = err.error.error_user_msg;
                return Observable.throw(msg);
                //        console.log(err.error.error_user_msg);

            }
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable.throw(errMsg);
    }

}