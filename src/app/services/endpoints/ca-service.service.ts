import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {SERVER_URL_BE} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CaServiceService {
  endpoint = SERVER_URL_BE + '/campaigns/';

  constructor(
    private http: HttpClient,
  ) {
  }

  saveCa(data): Observable<any> {
    return this.http.post(this.endpoint, data);
  }

  addIntrantInCa(id, data): Observable<any> {
    return this.http.post(this.endpoint + 'add-agricultural-input/' + id, data);
  }

  changeEtatIntrantInCamp(id, data): Observable<any> {
    return this.http.post(this.endpoint + 'agricultural-input-validation/' + id, data);
  }

  removeIntrantInCa(idCamp, idsIntrants): Observable<any> {
    return this.http.post(this.endpoint + 'remove/' + idCamp, idsIntrants);
  }

}
