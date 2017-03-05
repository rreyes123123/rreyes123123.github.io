import { Component, Input, Output, EventEmitter, OnInit, SimpleChange , ViewChild} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { FbPagePost } from '../_models/post';
import { Place } from '../_models/place';
import { LookupService } from '../_services/lookup-service';
import { Observable, Observer } from 'rxjs';
//declare var moment:any;
import * as moment from 'moment';
declare var $: any;
@Component({
    selector: 'create-post',
    templateUrl: './create-post.component.html',
    styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit {
    @Output() onPublish: EventEmitter<FbPagePost> = new EventEmitter<FbPagePost>();
    @Input() results: Observable<Place[]>;
    @Output() placeSearcher = new EventEmitter<String>();
    @ViewChild('selectedImage') selectedImageFile;

    file: File;
    errorMessage:any;
    scheduled = false;
    will_publish: boolean = true;
    post: FbPagePost = new FbPagePost();
    message: FormControl = new FormControl('', Validators.required);
    placeQuery = new FormControl();
    date; 
    time: string;
    validPost = false;
    ngOnInit() {
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
    this.date = new FormControl('', validDate);
    function validDate(c) {
        console.log("in validDate");
        console.log(c);
        console.log( moment(c).isValid());
        return moment(c).isValid() ? {'mismatch':true} : null
        }
    }
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
        if (this.file) {
            var reader = new FileReader();

            reader.onload = (function (theFile) {
                return function (e) {
                    document.getElementById('list').innerHTML = ['<img src="', e.target.result, '" title="', theFile.name, '" width="50" />'].join('');
                };
            })(this.file);

            reader.readAsDataURL(this.file);

        }
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
        this.scheduled = false;
        this.date = null;
        this.time = null;
        this.post.created_time = null;
    }
    removePhoto() {
        this.selectedImageFile.nativeElement.value = '';
        this.post.pictureFile = null;
        this.file = null;
        document.getElementById('list').innerHTML = "";
    }
    schedule() {
        this.date = new Date();
        this.time = this.date.getHours() + ":" + this.date.getMinutes();
        console.log(this.time);
        $("#exampleModal").modal('show');
        this.will_publish = false;
    }
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