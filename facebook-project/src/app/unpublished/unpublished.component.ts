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
declare var $:any;

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
  errorMessage;
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
    let fields = "?fields=posts.since(2014-01-01).until(2015-06-30).limit(100)%7Bcreated_time%2Clink%2Cname%2Cdescription%2Cmessage%7D";
    let access_token = "&access_token=1442982042632308|f4e0a9599a82f2265a1a886a9902858c";
    let url = "https://graph.facebook.com/v2.8/" + event + "?fields=posts" + access_token;
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
          this.errorMessage = data;
          $("#errorModal").modal('show');
          // this.method();
        },
        error => {
          console.log(error);
          this.errorMessage = error;
          $("#errorModal").modal('show');
          this.response = error;
        });
    }
    else {
      this._fbPostService
        .uploadFbPostWithPhoto(post)
        .then(data => {
          this.response = data; 
          console.log("in then"); 
          console.log(data);
          this.errorMessage = data;
          $("#errorModal").modal('show');

        })
    }
  }

  extractFbPages()
  {
    for(let i in this.publishedPosts)
    {
      let id = this.publishedPosts[i].id;      
      this.publishedPosts[i].views = this.insights.get(id);
      console.log(id);
      console.log(this.insights.get(id));
    }
    console.log(this.publishedPosts);
  }
  insights 
  extractData(data: Array<Object>) 
  {
    this.insights = new Map();
    console.log("insight data")
    for (let i in data)
    {
      let views = data[i]['data'][0]['values'][0]['value'];
      // this.insights.push({id:i,views:views});
      this.insights.set(i,views)
      console.log(i);      
      console.log(views);      
    }
    console.log("insights");
    console.log(this.insights);
    console.log(this.publishedPosts);
    this.extractFbPages();
  }


  tryBatch() {
    if (localStorage.getItem('response') != null) {
      this._fbPostService.batch()
        .subscribe(result => 
        {
          console.log("data[0]");
          console.log(JSON.parse(result[0].body).data);
          this.publishedPosts = JSON.parse(result[0].body).data;
          console.log("data[1]");
          //console.log(JSON.parse(data[1].body));
          this.extractData(JSON.parse(result[1].body));
        });
    }
  }



}