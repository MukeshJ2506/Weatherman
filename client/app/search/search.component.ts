/* Search component class */
import {Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import {Resultlist} from '../models/result.list';
import {SearchService} from '../services/search.service';

@Component({
    selector: 'search-form',
    templateUrl: './app/search/search.component.html'
})

export class SearchComponent implements OnInit {
  city: FormGroup;
  constructor(private fb: FormBuilder, private searchService: SearchService) {}
  weatherlist: {};
  weatherdetails:{};
  errorflag:boolean;
  ngOnInit() {
    this.city = this.fb.group({
      cityname: ['', [Validators.required, Validators.minLength(2), Validators.pattern('^[a-zA-Z]+$')]],
    });
  }
  onSubmit({ value, valid }: { value: any, valid: boolean }) {
    this.errorflag = false;
    this.searchService.cityName = value.cityname;
     this.searchService.getWeather()
        .subscribe(
            weatherlist => {this.weatherdetails=weatherlist;this.weatherlist = weatherlist.list;console.log(this.weatherlist)}, //Bind to view
            err => {
                // Log errors if any
                console.log(err);
                this.errorflag = true;
            });
  }  
}