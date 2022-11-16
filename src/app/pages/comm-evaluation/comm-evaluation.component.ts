import {Component, OnInit, ViewChild} from '@angular/core';
import {GridComponent, RowSelectEventArgs, SelectionSettingsModel} from '@syncfusion/ej2-angular-grids';
import {ToastAnimationSettingsModel, ToastPositionModel} from '@syncfusion/ej2-angular-notifications';
import {DatePipe} from '@angular/common';
import {JwtHelperService} from '@auth0/angular-jwt';

@Component({
  selector: 'app-comm-evaluation',
  templateUrl: './comm-evaluation.component.html',
  styleUrls: ['./comm-evaluation.component.css'],
  providers: [DatePipe],
})
export class CommEvaluationComponent implements OnInit {
  @ViewChild('grid') public grid: GridComponent;
  public selectionOptions: SelectionSettingsModel;

  @ViewChild('element') element;
  public position: ToastPositionModel = {X: 'Right', Y: 'Bottom'};
  public toasts;
  public animation: ToastAnimationSettingsModel = {
    show: {effect: 'SlideRightIn', duration: 600, easing: 'linear'},
    hide: {effect: 'FadeOut', duration: 100, easing: 'linear'}
  };

  tabCodeServices: any;
  selected: any;
  tabMvm: any;
  tailleSelect = 0;
  TabSaveEcheancier: object[];
  toolbar: string[];
  resTrefServcies: any;
  resTrefBanques: any;
  resTrefMdr: any;
  myDate: any = new Date();
  myDateMonth: any = new Date();

  constructor(

    private datePipe: DatePipe,
  ) {
    this.myDate = this.datePipe.transform(new Date(), 'yyyy');
    this.myDateMonth = this.datePipe.transform(new Date(), 'MM');

  }

  ngOnInit(): void {
    // this.getRoles();
    // this.getMonth();

    this.toolbar = ['Search'];
    this.selectionOptions = {checkboxMode: 'ResetOnRowClick'};

  }

  rowSelected(args: RowSelectEventArgs) {
    let tempTab = [];
    this.grid.getSelectedRecords().filter(select => {
      if (select['actived'] === null) {
        tempTab.push(select);
      }
    });
    this.tailleSelect = (tempTab).length;
    this.TabSaveEcheancier = (tempTab);
  }

  rowDeSelected(args: RowSelectEventArgs) {
    let tempTab = [];
    this.grid.getSelectedRecords().filter(select => {
      if (select['actived'] === false) {
        tempTab.push(select);
      }
    });
    this.tailleSelect = (tempTab).length;
    this.TabSaveEcheancier = (tempTab);
  }


  async getAllCMdr(cdBanque) {
    console.log(this.resTrefBanques);
    const dataFilter = this.resTrefBanques.filter(item => {
      if (item.cdBanque === cdBanque) {
        return item;
      }
    });
    this.resTrefMdr = dataFilter[0].t_donne_mdrBank;
    console.log('resTrefMdr', this.resTrefMdr);

  }

  onCreate(a) {

  }

  getRoles() {
    let jwtHelper = new JwtHelperService();
    let objJWT = jwtHelper.decodeToken(localStorage.getItem('token'));
    if (objJWT.roles.indexOf('VALIDATION1') >= 0) {
      return 'VALIDATION1';
    }
    if (objJWT.roles.indexOf('VALIDATION2') >= 0) {
      return 'VALIDATION2';
    }
  }

  rowDataBound($event: any) {
    if ($event.data.actived) {
      console.log($event.row.getElementsByClassName('e-gridchkbox')[0].classList.add('cheRemove'));
      // console.log($event.row.getElementsByClassName('e-checkbox-wrapper')[0].classList.add("cheRemove"))
      // $event.row.getElementsByClassName('e-gridchkbox')[0].classList.add('nour');
      // $event.row.getElementsByClassName('e-checkbox-wrapper')[0].classList.add('nour')
      $event.row.classList.add('niang');
    }
  }


}
