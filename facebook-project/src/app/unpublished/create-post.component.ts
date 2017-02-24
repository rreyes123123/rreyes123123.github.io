import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChange } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FbPagePost } from '../_models/post';
import { Place } from '../_models/place';
import { LookupService } from '../_services/lookup-service';
import { Observable, Observer } from 'rxjs';
declare var $: any;
@Component({
    selector: 'create-post',
    templateUrl: './create-post.component.html',
    styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit, OnChanges {
    file: File;
    ngOnInit() {
    }
    ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
        for (let propName in changes) {
            let changedProp = changes[propName];
            let to = JSON.stringify(changedProp.currentValue);
            this.validation = to;
        }
    }
    constructor(private _lookupService: LookupService) {
        this.placeQuery
            .valueChanges
            .debounceTime(200)
            .subscribe((event) => {
                this.placeSearcher.emit(event);
                console.log(event)
            }
            );
    }
    @Output() onPublish: EventEmitter<FbPagePost> = new EventEmitter<FbPagePost>();
    @Input() validation: any;
    @Input() results: Observable<Place[]>;
    @Output() placeSearcher = new EventEmitter<String>();
    // @Output() onPublish: EventEmitter<String> = new EventEmitter<String>();
    will_publish: boolean = true;
    post: FbPagePost = new FbPagePost(null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);
    message: FormControl = new FormControl();
    placeQuery = new FormControl();
    date: Date;
    time: string;
    publish() {
        console.log("time in publish");
        console.log(this.time);
        let finalDate;
        if (this.date || this.time) {
            finalDate = new Date(this.date.getUTCFullYear(), this.date.getUTCMonth(), this.date.getDate(), +this.time.split(':')[0], +this.time.split(':')[1]);
        }
        console.log(finalDate);
        this.post.created_time = finalDate
        console.log(this.post.created_time);
        this.post.message = this.message.value;
        this.onPublish.emit(this.post);
        // this.onPublish.emit(this.message.value);
    }
    fileChangeEventImage(fileInput: any) {
        this.file = fileInput.target.files[0];
        this.post.pictureFile = this.file;

        var reader = new FileReader();

        reader.onload = (function (theFile) {
            return function (e) {
                document.getElementById('list').innerHTML = ['<img src="', e.target.result, '" title="', theFile.name, '" width="50" />'].join('');
            };
        })(this.file);

        reader.readAsDataURL(this.file);

    }
    upload() {

    }
    placesDropdown() {
        //        this._lookupService.getPlaces()
        //        .subscribe(data=> {this.places = data; console.log(data)});
    }
    selectPlace(place: Place) {
        console.log("selected");
        console.log(place);
        this.post.place = place;
    }
    removePlace() {
        this.placeQuery.setValue("");
        this.results.ignoreElements();
        this.post.place = null;
    }
    removeSchedule() {
        this.date = null;
        this.time = null;
        this.post.created_time = null;
    }
    removePhoto() {
        this.placeQuery.setValue("");
        this.results.ignoreElements();
        this.post.place = null;
    }
    schedule() {
        this.date = new Date();
        this.time = this.date.getHours() + ":" + this.date.getMinutes();
        console.log(this.time);
        $("#exampleModal").modal('show');
        this.will_publish = false;
        // this.will_publish = false;
    }
    scheduled = false;
    schedule2() {
        this.scheduled = true;
        $("#exampleModal").modal('hide');
    }
    createDraft() { }

    set humanDate(s) {
        let e = s.split('-');
        let d = new Date(Date.UTC(+e[0], +e[1] - 1, +e[2]));
        this.date.setFullYear(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
    }

    get humanDate() {
        return this.date.toISOString().substring(0, 10);
    }
}