import { Component } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title = 'my-adminlte3-demo-app';

  constructor(private translate: TranslateService) {
    translate.setDefaultLang('fr');
    translate.use('fr');
  }
}
