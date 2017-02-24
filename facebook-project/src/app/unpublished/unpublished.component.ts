import { Component } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Subscription } from 'rxjs/Subscription';
import { Observable, Observer } from 'rxjs';
import 'rxjs/add/operator/map'

import { FbPostService } from '../_services/fb-post-service';
import { LookupService } from '../_services/lookup-service';
import { FbPagePost } from '../_models/post';
import { PromotableFbPagePost } from '../_models/promotable-post';
import { Place } from '../_models/place';

import { SearchComponent } from '../search/search.component';
import { PostComponent } from './post.component';
import { CreatePostComponent } from './create-post.component';
import { UnpublishedPostComponent } from './unpublished-post.component';

@Component({
  selector: "unpublished-app",
  templateUrl: './unpublished.component.html'
})
export class UnpublishedComponent {
  //  createPost=false;
  createPost = true; // false in prod
  publishedPosts: FbPagePost[];
  unpublishedPosts: PromotableFbPagePost[];

  //  private data: Observable<Object>;
  //  private dataObserver: Observer<Object>;
  private places: Observable<Place[]>;
  private placeObserver: Observer<Place[]>;
  private response: any;

  unPublishedActive = "nav-link";
  publishedActive = "nav-link active";

  clickPublish() {
    this.unPublishedActive = "nav-link";
    this.publishedActive = "nav-link active";
    console.log("published");
  }
  clickUnpublish() {
    this.unPublishedActive = "nav-link active";
    this.publishedActive = "nav-link";
    console.log("unpublished");
  }

  constructor(private _fbPostService: FbPostService, private http: Http, private _lookupService: LookupService) {
    this.places = new Observable<Place[]>(observer => this.placeObserver = observer);
    if (localStorage.getItem('response') != null) {
      this.getPublishedPosts();
      this.getUnpublishedPosts()
    }

  }

  onPlaceSearch(event) {
    event ?
      this._lookupService.getPlacesWithSearchTerm(event)
        .subscribe(
        result => {
          this.placeObserver.next(result);
          console.log(result)
        },
        error => console.log("could not load places")
        )
      :
      this.placeObserver.next(null);
  }
  onSearch(event) {
    //    this.http.get('https://api.spotify.com/v1/search?q=' + event + '&type=artist')
    let fields = "?fields=posts.since(2014-01-01).until(2015-06-30).limit(100)%7Bcreated_time%2Clink%2Cname%2Cdescription%2Cmessage%7D";
    let access_token = "&access_token=1442982042632308|f4e0a9599a82f2265a1a886a9902858c";

    //let url = "https://graph.facebook.com/v2.8/" + event + fields + access_token;
    let url = "https://graph.facebook.com/v2.8/" + event + "?fields=posts" + access_token;
    /*  this.http.get(url)
            .map((response) => {
              var artists = response.json();
              console.log(artists.posts.data);
              return artists.posts.data;
      //        return artists.artists.items;
          }).subscribe(result => {
            console.log(result);
            var n = this.dataObserver.next(result);
          }, error => console.log('Could not load artists'));
          */
  }

  getPublishedPosts() {
    this._fbPostService.getFbPost().subscribe(data => { this.publishedPosts = data; console.log(this.publishedPosts) });
  }

  getUnpublishedPosts() {
    this._fbPostService.getUnpublishedFbPosts().subscribe(data => { this.unpublishedPosts = data; console.log(data) });
  }
  getStyle(post: FbPagePost) {
    if (post.name == "Timeline Photos")
      return { 'opacity': 0.5, 'filter': 'alpha(opacity=50)' };
    else
      return { 'opacity': 1.0, 'filter': 'alpha(opacity=100)' };
  }
  onPublish(post: FbPagePost) {
    console.log("in onPublished");
    let s;
    if (!post.pictureFile) {
      this._fbPostService.createFbPostWithPost(post)
        .subscribe(
        data => {
          console.log((data));
          this.response = data;
          // this.method();
        },
        error => {
          console.log(error);
          this.response = error;
        });
    }
    else {
      this._fbPostService
        .uploadFbPostWithPhoto(post)
        .then(data => {
        this.response = data; console.log("in then"); console.log(data); //this.method();
        })
    }
  }
  tryBatch()
  {
    var access_token = 'EAAUgYnARgHQBAGLmSVxeqhUCDZAFQvOOuKgPy7ZCMHNLIbaSQXiOb6EfhwZBDknOoxX4tMIdDymUmXIBvXVqDzlRddIP3ywtfOSIbNGqZBDn8HwJr3MlAYw8f3xM8MMbO9hIXT6oCpF1LN6hcFFxHJTuwIFZCgw2VPThJhVthX5yDLMTEU3Dd0GAfcGZAH3X0ZD';
    var url="https://graph.facebook.com/v2.8/access_token="+access_token;
    var batch = '[{ "method":"GET","name":"get-friends","relative_url":"me/friends?limit=5",},{"method":"GET","relative_url":"?ids={result=get-friends:$.data.*.id}"}]';

    var batch2 = '[{"method":"GET", "name":"first","relative_url":"165610100609672/feed?limit(5)"},{"method":"get", "name":"second", "relative_url":"/insights/post_impressions?ids={result=first:$.data.*.id}"}]';
      var body = JSON.stringify({access_token:access_token, batch:batch});
      var body = JSON.stringify({batch:batch});
    this.http.post(url,body)
    .map(response=>response.json())
    .subscribe(data=> console.log(data));




  }



}