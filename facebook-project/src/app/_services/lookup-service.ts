import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable, BehaviorSubject } from 'rxjs';
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch'
import { FbPagePost } from '../_models/post';
import { Place } from '../_models/place';

@Injectable()
export class LookupService
{
    private _places: BehaviorSubject<Place[]>;
    private dataStore: { places: Place[]};
    

    constructor(private http:Http)
    {
        this.dataStore = {places: []};
        this._places = <BehaviorSubject<Place[]>> new BehaviorSubject<Place[]>([]);

    }
    get places()
    {
        return this._places.asObservable();
    }
    loadAll(place:String)
    {
        let url = "https://graph.facebook.com/search?q="+place+"&type=place&access_token=1442982042632308|f4e0a9599a82f2265a1a886a9902858c";
        this.http.get(url)
            .map(response=>response.json())
            .subscribe(data=> 
                {
                    this.dataStore.places=data;
                    this._places.next(this.dataStore.places);
                },
                error=> console.log("Could not load places")
            );            
    }
    load()
    {
        let url = "https://graph.facebook.com/search?q="+"New York"+"&type=place&access_token=1442982042632308|f4e0a9599a82f2265a1a886a9902858c";
        this.http.get(url)
            .map(response=>response.json())
            .subscribe(data=> 
                {
                    this.dataStore.places=data;
                    this._places.next(Object.assign({},this.dataStore).places);
                },
                error=> console.log("Could not load places")
            );            
        
    }
    getPlaces() : Observable<Place>
    {
        let url = "https://graph.facebook.com/search?q=&type=place&center=40.7128,%2074.0059&access_token=1442982042632308|f4e0a9599a82f2265a1a886a9902858c";
        return this.http.get(url).map(response=>response.json().data);
    }
    getPlacesWithSearchTerm(place:String) : Observable<Place[]>
    {
        let url = "https://graph.facebook.com/search?q="+place+"&type=place&access_token=1442982042632308|f4e0a9599a82f2265a1a886a9902858c";
        return this.http.get(url).map(response=>response.json().data);
    }
}