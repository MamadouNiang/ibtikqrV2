import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {SERVER_URL_BE} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IntrantService {
  endpoint = SERVER_URL_BE + '/agricultural-inputs/';

  constructor(
    private http: HttpClient,
  ) {
  }

  save(data): Observable<any> {
    return this.http.post(this.endpoint, data);
  }

  intrants(): Observable<any> {
    return this.http.get(this.endpoint);
  }

  intrant(id: any): Observable<any> {
    return this.http.get(this.endpoint + id);
  }

  deleteIntrant(ids: any): Observable<any> {
    return this.http.post(this.endpoint + 'delete', ids);
  }
}
