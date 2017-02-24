import { Component, Output, Input, EventEmitter } from '@angular/core';  
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import 'rxjs/Rx';
@Component({
  selector: 'spotify-search',
  templateUrl: './search.component.html'  //``
})
export class SearchComponent {

  pageId = '165610100609672';
  
  @Input() results: Observable<Object>;
  @Output() searchEvent: EventEmitter<String> = new EventEmitter<String>();

  private searchBox = new FormControl();

  constructor() {
    this.searchBox
        .valueChanges
        .debounceTime(1000)
        .subscribe((event) => {this.searchEvent.emit(event); console.log(event)});
  }
}