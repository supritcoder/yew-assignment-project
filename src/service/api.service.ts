import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserDataModal } from 'src/modal/userdatamodal';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://68.178.166.216/api/API/BillToPartyMaster';
  private CountryStateCityUrl = "https://api.countrystatecity.in/v1";
  private apiKey = "SFA3a1dteW16ZDZPZWNOeFRHT2QxeGxiR1RGQTBwNFdOOThzTHJPag==";
  private saveDataUrl = ""
  private selectedItem: UserDataModal | undefined

  rowId: number = 0



  constructor(private http: HttpClient) { }

  getBillToPartyData(): Observable<any> {
    const url = `${this.baseUrl}/GetData`;
    return this.http.post(url, { RowId: 0 });
  }
  getuserDetails(rowId: number): Observable<any> {
    const url = `${this.baseUrl}/GetData`;
    return this.http.post(url, { RowId: rowId });
  }

  getCountries(): Observable<any> {
    const headers = new HttpHeaders().set("X-CSCAPI-KEY", this.apiKey);
    const url = `${this.CountryStateCityUrl}/countries`;
    return this.http.get(url, { headers });
  }

  getStatesByCountry(countryCode: string): Observable<any> {
    const headers = new HttpHeaders().set("X-CSCAPI-KEY", this.apiKey);
    const url = `${this.CountryStateCityUrl}/countries/${countryCode}/states`;
    return this.http.get(url, { headers });
  }

  getCitiesByState(countryCode: string, stateCode: string): Observable<any> {
    const headers = new HttpHeaders().set("X-CSCAPI-KEY", this.apiKey);
    const url = `${this.CountryStateCityUrl}/countries/${countryCode}/states/${stateCode}/cities`;
    return this.http.get(url, { headers });
  }
  saveData(data: any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

    const formData = this.convertToFormUrlEncoded(data);
    console.log(formData)
    return this.http.post(`${this.saveDataUrl}/SaveData`, formData, { headers });
  }
  private convertToFormUrlEncoded(data: any): string {
    const Params = new URLSearchParams();
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        if (typeof data[key] === 'object') {
          Params.append(key, JSON.stringify(data[key]));
        } else {
          Params.append(key, data[key]);
        }
      }
    }
    return Params.toString();
  }

  deleteRow(id: number): Observable<any> {
    let json = {
      'RowId': id,
      'ActionId': 1,
      'ContactPersonDetails': '[]'
    }
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    const formData = new HttpParams({ fromObject: json });
    return this.http.post(`${this.saveDataUrl}/SaveData`, formData, { headers });
  }


}
