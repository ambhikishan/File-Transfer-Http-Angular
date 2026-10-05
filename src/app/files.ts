import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class FilesDownload {
    
  
  // Inject HttpClient (using the modern inject() function or constructor)
  private http = inject(HttpClient);

  // Return an Observable of type Post[]
  getFiles(): Observable<any> {
    return this.http.get(`http://${window.location.hostname}:8080`);
  }

  fetchFiles (path :string): Observable<any>
  {
    const queryParams = new HttpParams()
  .set('path', path);
  
    return this.http.get(`http://${window.location.hostname}:8080`,{params:queryParams, observe: 'response' });
  }
}


