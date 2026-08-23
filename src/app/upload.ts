import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable, Service } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
    private baseUrl = 'http://192.168.1.2:8080'; 

  constructor(private http: HttpClient) {}

  /**
   * Uploads a file as a raw binary stream.
   * @param file The actual File object from the HTML input
   * @param currentPath The current directory path in the file explorer
   */
  uploadFileStream(file: File, currentPath: string): Observable<HttpEvent<any>> {
    
    // We send metadata (filename and path) via HTTP Headers since we 
    // are bypassing FormData for pure stream uploading.
    // encodeURIComponent ensures spaces and special characters don't break the headers.
    const headers = new HttpHeaders({
      'File-Name': encodeURIComponent(file.name),
      'Upload-Path': encodeURIComponent(currentPath),
      'Content-Type': 'application/octet-stream'
    });

    // Create the request: POST method, passing the raw 'file' as the body
    const req = new HttpRequest('POST', `${this.baseUrl}/uploads`, file, {
      headers: headers,
      reportProgress: true, // Enables the progress bar
      responseType: 'text'  // Expect a text response from Spring Boot, not JSON
    });

    return this.http.request(req);
  }
}
