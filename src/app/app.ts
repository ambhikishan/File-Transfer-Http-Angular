import { Component, signal } from '@angular/core';

import { FileSystem } from './file-system/file-system';

@Component({
  selector: 'app-root',
  imports: [FileSystem],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('download');
}
