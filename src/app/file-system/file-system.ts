import { Component , inject, OnInit,ChangeDetectorRef} from '@angular/core';
import {  FilesDownload } from '../files';
import { CommonModule, NgClass, NgFor } from '@angular/common';
import { every } from 'rxjs';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { UploadService } from '../upload';

@Component({
  selector: 'file-system',
  imports: [CommonModule],
  templateUrl: './file-system.html',
  styleUrl: './file-system.css',
 
})
export class FileSystem implements OnInit{
isUploading = false;
uploadProgress = 0;

currentPath = ''
  

onFileSelected(event: Event) {
console.log(event)
let target = event.target as HTMLInputElement

let fileList : FileList | null = target.files;

if(fileList != null)
{
  this.uploadFile(fileList[0])
}
target.value = '';

}
  uploadFile(file: File) {
    this.isUploading = true;
    this.uploadProgress = 0;

    this.uploadService.uploadFileStream(file,this.currentPath).subscribe({
      next: (event: any) => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          this.uploadProgress = Math.round((100 * event.loaded) / event.total);
          this.cdr.detectChanges();
        } 
        else if (event instanceof HttpResponse) {
          this.isUploading = false;
          
          // IMPORTANT: Refresh the folder view so the new file appears!
          if (this.currentPath) {
             this.fetchFiles(this.currentPath);
          }
        }
      },
      error: (err: any) => {
        console.error("Upload failed", err);
        this.isUploading = false;
        this.cdr.detectChanges();
        
      }
    });
  }


private dataService = inject(FilesDownload);

foldersAndFiles : Array<string> = [];
constructor(private cdr : ChangeDetectorRef, private uploadService : UploadService)
{

}

ngOnInit(): void {
  this.dataService.getFiles().subscribe(data =>{
    
    for(let d of data)
    {
      this.foldersAndFiles.push(d.replace(/\\/g, "/"));
    }
    this.currentPath = 'C:/'
    this.cdr.detectChanges();
  })
}

 fetchFiles(event:any)
{
  this.dataService.fetchFiles(event).subscribe(data =>{
    
    console.log(data.headers.get("content-type"))
    if(data.headers.get("content-type")=="application/json")
    {
    this.foldersAndFiles.length = 0;
     for(let d of data.body)
    {
      this.foldersAndFiles.push(d.replace(/\\/g, "/"));
    }
    this.currentPath = event.replace(/\\/g, "/");
    this.cdr.detectChanges();
  }
  else
  { 
    const a = document.createElement("a");
  a.href = `http://${window.location.hostname}:8080?path=`+event;
  a.click();
  
  }
},
error=>{
 const a = document.createElement("a");
  a.href = `http://${window.location.hostname}:8080?path=`+event;
  a.click();
  
})
}


}
