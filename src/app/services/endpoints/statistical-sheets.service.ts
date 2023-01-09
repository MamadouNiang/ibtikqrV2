import {Injectable} from '@angular/core';
import {SERVER_URL_BE} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatisticalSheetsService {
  endpoint = SERVER_URL_BE + '/statistical-sheets/';

  constructor(
    private http: HttpClient,
  ) {
  }

  getstatisticalBRegionAndCampaign(idRegion, idCampaign): Observable<any> {
    return this.http.get(this.endpoint + 'find-statistical-sheets-By/' + idRegion + '/' + idCampaign);
  }
  getstatisticalBRegion(idRegion): Observable<any> {
    return this.http.get(this.endpoint + 'find-statistical-sheets-By/' + idRegion);
  }
  patchStatus(ids, status): Observable<any> {
    return this.http.post(this.endpoint + 'status/' + status, ids);
  }

}
