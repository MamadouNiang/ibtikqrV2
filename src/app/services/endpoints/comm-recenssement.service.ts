import {Injectable} from '@angular/core';
import {SERVER_URL_BE} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommRecenssementService {
  endpoint = SERVER_URL_BE + '/excel';

  constructor(
    private http: HttpClient,
  ) {
  }

  // get les elements par mois
  getFicheStatistiques(): Observable<any> {
    return this.http.get(this.endpoint + '/statistical-sheets');
  }

  importIntrant(data): Observable<any> {
    return this.http.post(this.endpoint , data);
  }

  exportCanvas(): Observable<Blob> {
    return this.http.get(this.endpoint + '/canvas', {
      responseType: 'blob'
    });
  }
}
