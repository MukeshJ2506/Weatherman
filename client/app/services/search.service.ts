/* Service for searching city */
import { Injectable }     from '@angular/core';
import { Http, Response, Jsonp } from '@angular/http';
import { Observable }     from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {Resultlist} from '../models/result.list';
@Injectable()
export class SearchService {
  private searchUrl = '//api.openweathermap.org/data/2.5/forecast/daily?q=';  // URL to web API
  public cityName = '';
  private appId = '&appid=32eab09ba40654398b03b34e7eb00d46&units=metric&cnt=5&callback=JSONP_CALLBACK'; // App Key & unit
  private searchUrlfinal = '';
  constructor (private _jsonp: Jsonp) {}
  getWeather (): Observable<Resultlist> {
  this.searchUrlfinal = this.searchUrl + this.cityName + this.appId;
    return this._jsonp.get(this.searchUrlfinal)
                    .map(this.extractData)
                    .catch(this.handleError);
  }
  private extractData(res: Response) {
    let body = res.json();
    console.log(body);
    return body || { };
  }
  private handleError (error: Response | any) {
    // Ideally using a logging service
    let errMsg: string;
    if (error instanceof Response) {
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