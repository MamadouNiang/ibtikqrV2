import {Injectable} from '@angular/core';
import {SERVER_URL_BE} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EstimationService {
  endpoint = SERVER_URL_BE + '/campaigns/';

  constructor(
    private http: HttpClient,
  ) {
  }

  estimations(): Observable<any> {
    return this.http.get(this.endpoint);
  }

}
