import {Injectable} from '@angular/core';
import {SERVER_URL_BE} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  endpoint = SERVER_URL_BE + '/stocks';

  constructor(
    private http: HttpClient,
  ) {
  }

  getStockByCampaignId(campaignId, regionId): Observable<any> {
    return this.http.get(this.endpoint + '/campaign/' + campaignId + '/' + regionId);
  }

  getStockByRegionId(regionId): Observable<any> {
    return this.http.get(this.endpoint + '/campaign/region/' + regionId);
  }
}
