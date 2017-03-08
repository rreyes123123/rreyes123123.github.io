import { Component, Input, Output, EventEmitter, OnInit, SimpleChange, ViewChild} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { FbPagePost } from '../_models/post';
import { Place } from '../_models/place';
import { LookupService } from '../_services/lookup-service';
import { Observable, Observer } from 'rxjs';
//declare var moment:any;
import * as moment from 'moment';
import 'moment-timezone'
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
    errorMessage: any;
    scheduled = false;
    will_publish: boolean = true;
    post: FbPagePost = new FbPagePost();
    message: FormControl = new FormControl('', Validators.required);
    placeQuery = new FormControl();
    date;
    time; //: string;
    validPost = false;
    finalDate:Date;
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
            this.post.published = true;
    }
    publish() {
        console.log("time in publish");
        console.log(this.time);
        this.post.created_time = this.finalDate
        console.log(this.post.created_time);
        this.post.message = this.message.value;
        this.onPublish.emit(this.post);
        this.clear();
        // this.onPublish.emit(this.message.value);
    }

    publishNow() {
        this.removeSchedule();
        this.publish();
    }
    clear() {
        this.removeMessage();
        this.removePhoto();
        this.removePlace();
        this.removeSchedule();
        this.post.published = true;
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
    removeMessage() {
        this.message.setValue("");
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
        this.finalDate = null;
    }
    removePhoto() {
        this.selectedImageFile.nativeElement.value = '';
        this.post.pictureFile = null;
        this.file = null;
        //        document.getElementById('list').innerHTML = "";
    }
    schedule() {
        // this.date = new FormControl(moment.tz("America/New_York"), validDate);
        // this.time = new FormControl(moment.tz("America/New_York"), validDate);
        this.date = new FormControl(moment(), validDate);
        this.time = new FormControl(moment(), validDate);
        function validDate(c: FormControl) {
            return moment(c.value).isValid() ? null : { 'mismatch': true }
        }

        $("#exampleModal").modal('show');
        this.will_publish = false;
    }
    schedule2() {
        this.scheduled = true;
        this.getFinalDate();
        $("#exampleModal").modal('hide');
    }
    published = true;
    createUnpublshed() {
        this.published=false;
        this.post.published =this.published;
        this.publish();
     }

    get humanDate() {
        var date = this.date.value instanceof moment ? this.date.value.format().substring(0,10) : this.date.value;
        console.log(date);
        return this.date.value instanceof moment ? this.date.value.format().substring(0,10) : this.date.value;
    }
    get humanTime() {
        var time = this.time.value instanceof moment ? this.time.value.format().substring(11,16) : this.time.value;
        console.log(time);
        return this.time.value instanceof moment ? this.time.value.format().substring(11,16) : this.time.value;
    }
    getFinalDate() {
        let finalDate;
        let d = this.date.value;
        let t = this.time.value;
        let year, month, day, hour, minute;
        if (d instanceof moment) {
            year = d.get('year');
            month = d.get('month');
            day = d.get('date');
        }
        else {
            let e = d.split('-');
            year = e[0];
            month = e[1] - 1;
            day = e[2];
        }
        if (t instanceof moment) {
            hour = t.get('hour');
            minute = t.get('minute');
        }
        else {
            let e = t.split(':');
            hour = e[0]; minute = e[1];
        }
        finalDate = new Date();
        finalDate.setFullYear(year);
        finalDate.setMonth(month);
        finalDate.setDate(day);
        finalDate.setHours(hour);
        finalDate.setMinutes(minute);
        this.finalDate = finalDate;
    }

}