import {Injectable} from '@angular/core';
import {SERVER_URL_BE} from '../../../environments/environment';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RegionsService {
  endpoint = SERVER_URL_BE + '/regions/';

  constructor(
    private http: HttpClient,
  ) {
  }

  regions(): Observable<any> {
    return this.http.get(this.endpoint);
  }
}
