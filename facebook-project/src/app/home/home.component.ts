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

import { CreatePostComponent } from './create-post.component';
import { PostComponent } from './post.component';
import { UnpublishedPostComponent } from './unpublished-post.component';
declare var $: any;
declare var map: any;
@Component({
  selector: "app-home",
  templateUrl: './home.component.html'
})
export class HomeComponent {
  publishedPosts: FbPagePost[];
  insights: any;
  paging: any;
  unpublishedPosts: PromotableFbPagePost[];
  unpublishedPaging: any;
  errorMessage: any;
  success:boolean=false;
  private places: Observable<Place[]>;
  private placeObserver: Observer<Place[]>;
  private response: any;

  constructor(private http: Http, private _fbPostService: FbPostService, private _lookupService: LookupService) {
    this.places = new Observable<Place[]>(observer => this.placeObserver = observer);
    this.getPublishedPosts();
    this.getUnpublishedPosts()
  }

  onPlaceSearch(event) {
    event ?
      this._lookupService.getPlacesWithSearchTerm(event)
        .subscribe(
        result => {
          this.placeObserver.next(result);
        },
        error => console.log("could not load places")
        )
      :
      this.placeObserver.next(null);
  }
  getPublishedPosts() {
    this._fbPostService.getFbPost()
      .subscribe(result => {
        this.publishedPosts = JSON.parse(result[0].body).data;
        console.log(this.publishedPosts);
        this.paging = JSON.parse(result[0].body).paging;
        this.extractData(JSON.parse(result[1].body));
      });
  }

  getUnpublishedPosts() {
    this._fbPostService.getUnpublishedFbPosts()
      .subscribe(results => {
        this.unpublishedPosts = results['data'];
        this.unpublishedPaging = results['paging'];
     //   console.log(results)
      });
  }
  clear() {
    this.success = false;
    this.errorMessage = null;
  }
  onPublish(post: FbPagePost) {
    let s;
    this.clear();
    if (!post.pictureFile) {
      this._fbPostService.createFbPostWithPost(post)
        .subscribe(
        data => {
          this.success = true;
          $("#errorModal").modal('show');
          this.getPublishedPosts();
          this.getUnpublishedPosts();
        },
        error => {
          this.errorMessage = error;
          $("#errorModal").modal('show');
        });
    }
    else {
      let that = this;
      $("#loadingModal").modal('show');
      this._fbPostService
        .uploadFbPostWithPhoto(post)
        .then(data => {
          $("#loadingModal").modal('hide');
          console.log("error in then, not catch");
          that.success = true;
          $("#errorModal").modal('show');
          this.getPublishedPosts();
          this.getUnpublishedPosts();
        })
        .catch(function (e) {
          console.log("error in catch");
          console.log(e);
          that.errorMessage = JSON.parse(e).error.message;
          $("#loadingModal").modal('hide');
          $("#errorModal").modal('show');
        })
      { }
    }
  }

  joinPostsWithInsights() {
    for (let i in this.publishedPosts) {
      let id = this.publishedPosts[i].id;
      this.publishedPosts[i].views = this.insights.get(id);
    }
  }
  extractData(data: Array<Object>) {
    this.insights = new Map();
    console.log(data);
    if (data.length != 0) {
      for (let i in data) {
        let views = data[i]['data'][0]['values'][0]['value'];
        this.insights.set(i, views)
      }
    }
    this.joinPostsWithInsights();
  }

  getNext() {
    this._fbPostService.getNext(this.paging.next)
      .subscribe(result => {
        var posts: Object[] = JSON.parse(result[0].body).data;
        if (posts.length > 0) {
          this.publishedPosts = JSON.parse(result[0].body).data;
          this.paging = JSON.parse(result[0].body).paging;
          this.extractData(JSON.parse(result[1].body));
        }
      });
  }
  getPrev() {
    this._fbPostService.getNext(this.paging.previous)
      .subscribe(result => {
        var posts: Object[] = JSON.parse(result[0].body).data;
        if (posts.length != 0) {
          this.publishedPosts = JSON.parse(result[0].body).data;
          this.paging = JSON.parse(result[0].body).paging;
          this.extractData(JSON.parse(result[1].body));
        }
      });
  }

  getNextUnpublished() {
    this._fbPostService.getNextUnpublished(this.unpublishedPaging.next)
      .subscribe(result => {
        var posts = result.data;
        if (posts.length > 0) {
          this.unpublishedPosts = posts;
          this.unpublishedPaging = result.paging;
        }
      });
  }

  getPrevUnpublished() {
    this._fbPostService.getNextUnpublished(this.unpublishedPaging.previous)
      .subscribe(result => {
        var posts = result.data;
        if (posts.length != 0) {
          this.unpublishedPosts = posts;
          this.unpublishedPaging = result.paging;
        }
      });
  }




}