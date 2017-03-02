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
    private page_access_token = localStorage['page_access_token'];
    private pageId = 165610100609672;
    private pageId2 = 165610100609672;

    constructor(private http: Http) {
        console.log("fb post service constructot");
        // this.user_access_token = JSON.parse(localStorage.getItem('response')).authResponse.accessToken;
        this.user_access_token = localStorage.getItem('user_access_token');
    }

    ngOnInit() {
    }

    getFbPost() {
    // getFbPost(): Observable<Object[]> {
/*        let fields = "fields=created_time,link,name,picture,description,message,is_published";
        let url = "https://graph.facebook.com/v2.8/" + this.pageId + "/feed?fields=created_time,link,name,picture,description,message&access_token=" + this.user_access_token;
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.get(url, options)
            .map(response => response.json().data);
  */
        var url = "https://graph.facebook.com/v2.8";
        let url1 = "165610100609672/feed?fields=created_time,link,name,picture,description,message&limit=5";
        let url2 = "/insights/post_impressions_unique/lifetime?fields=values&ids={result=first:$.data.*.id}";
        let req1 = {
            method: "GET",
            name:"first",
            relative_url:url1,
            omit_response_on_success:false
        };
        let req2 = {
            method:"GET",
            name:"second",
            relative_url:url2
        };
        let batch = JSON.stringify([req1, req2]);
        console.log("FB POST");
        console.log(this.page_access_token);
        let body = ({access_token: localStorage['page_access_token'], 
            batch:(batch)});
        return this.http.post(url, body)
            .map(response => response.json())
  }
  getNext(url1:string)
  {
        let url = "https://graph.facebook.com/v2.8/";
        url1 = url1.replace(url,"");
        console.log("in getnext in service");
        console.log(url1);
        let url2 = "/insights/post_impressions_unique/lifetime?fields=values&ids={result=first:$.data.*.id}";
        let req1 = {
            method: "GET",
            name:"first",
            relative_url:url1,
            omit_response_on_success:false
        };
        let req2 = {
            method:"GET",
            name:"second",
            relative_url:url2
        };
        let batch = JSON.stringify([req1, req2]);
        let body = ({access_token: localStorage['page_access_token'], batch:(batch)});
        //      var body = JSON.stringify({ batch: batch });
        return this.http.post(url, body)
            .map(response => response.json())      
  }

    getUnpublishedFbPosts(): Observable<PromotableFbPagePost[]> {
        let edge = "/promotable_posts?";
        let fields = "fields=message,scheduled_publish_time,attachments{media{image{src}},subattachments{media{image{src}}}},";
        fields += "created_time,place,application,from,is_hidden,permalink_url,privacy,status_type,story_tags,story,updated_time";
        let flag = "&is_published=false";
        let access_token = "&access_token=" + this.user_access_token;
        console.log("unpub");
        console.log(this.user_access_token);
        let url = "https://graph.facebook.com/v2.8/" + this.pageId + edge + fields + flag + access_token;
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.get(url, options)
            .map(response => response.json().data);
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

    batch() {
        var url = "https://graph.facebook.com/v2.8";
        let access_token = "EAAUgYnARgHQBAJ99AtjVvYdozZASjzWpUEMjE4angujFBhrZCRNTDuR3VuhikZBIEuQYmvnGzDfBXSDomiEL34SLRi8Rohmerkx03PYNBs0IbdXR5Tqbs48wr3TZAzyZCze0jcnMETfpXZAq848GU8M2w3ASpoAZCJJLZAODkaLSYQZDZD";
        let url1 = "165610100609672/feed?fields=created_time,link,name,picture,description,message";
        let url2 = "/insights/post_impressions_unique/lifetime?fields=values&ids={result=first:$.data.*.id}";
        let req1 = {
            method: "GET",
            name:"first",
            relative_url:url1,
            omit_response_on_success:false
        };
        let req2 = {
            method:"GET",
            name:"second",
            relative_url:url2
        };
        let batch = JSON.stringify([req1, req2]);
        let body = ({access_token:access_token, batch:(batch)});
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