import {Component, OnInit, ViewChild} from '@angular/core';
import {DetailDataBoundEventArgs, FilterSettingsModel, Grid, GridComponent, RowSelectEventArgs, SelectionSettingsModel} from '@syncfusion/ej2-angular-grids';
import {ToastAnimationSettingsModel, ToastPositionModel} from '@syncfusion/ej2-angular-notifications';
import {DatePipe} from '@angular/common';
import {JwtHelperService} from '@auth0/angular-jwt';
import {EstimationService} from '../../../services/endpoints/estimation.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {StatisticalSheetsService} from '../../../services/endpoints/statistical-sheets.service';

@Component({
  selector: 'app-comm-evaluation',
  templateUrl: './comm-evaluation.component.html',
  styleUrls: ['./comm-evaluation.component.scss'],
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
  region: string;
  selectedCampagne: any;
  campgnes: any;
  validerFormCampagne: FormGroup;
  dateStaticalSheetByRegion: any;

  constructor(
    private estimationService: EstimationService,
    private sheetsService: StatisticalSheetsService,
    private fb: FormBuilder,

    private datePipe: DatePipe,
  ) {
    this.myDate = this.datePipe.transform(new Date(), 'yyyy');
    this.myDateMonth = this.datePipe.transform(new Date(), 'MM');

  }
  public filterOptions: FilterSettingsModel;
  ngOnInit(): void {
    this.region = localStorage.getItem('region');
    this.getRegions();

    this.campagnesForm();

    this.toolbar = ['Search'];
    this.selectionOptions = {checkboxMode: 'ResetOnRowClick'};
    this.filterOptions = {
      type: "CheckBox",
      ignoreAccent: true,
    };

  }
  campagnesForm() {
    this.validerFormCampagne= this.fb.group({
      idCamp: ['', Validators.required],
    });
  }
  async getRegions() {
    try {
      const resp = await this.estimationService.estimations().toPromise();
      this.campgnes = resp;
    } catch (e) {
      console.log(e);
      this.element.show({
        title: 'Erreur trouvée   !', content: e.error.error, cssClass: 'e-toast-danger'
      });
    }
  }
  rowSelected(args: RowSelectEventArgs) {
    let tempTab = [];
    this.grid.getSelectedRecords().filter(select => {
      if (select['status'] === 'PENDING' || select['status'] === 'DELEGATE_REJECTED') {
        tempTab.push(select['id']);
      }
    });
    this.tailleSelect = (tempTab).length;
    this.TabSaveEcheancier = (tempTab);
  }

  rowDeSelected(args: RowSelectEventArgs) {
    let tempTab = [];
    this.grid.getSelectedRecords().filter(select => {
      if (select['status'] === 'PENDING' || select['status'] === 'DELEGATE_REJECTED') {
        tempTab.push(select['id']);
      }
    });
    this.tailleSelect = (tempTab).length;
    this.TabSaveEcheancier = (tempTab);
  }


  async getAllCMdr(cdBanque) {
    const dataFilter = this.resTrefBanques.filter(item => {
      if (item.cdBanque === cdBanque) {
        return item;
      }
    });
    this.resTrefMdr = dataFilter[0].t_donne_mdrBank;
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
    if ($event.data.status==="DELEGATE_VALIDATED") {
      $event.row.getElementsByClassName('e-gridchkbox')[0].classList.add('cheRemove');
      $event.row.classList.add('niang');
    }
    if ($event.data.status==="DELEGATE_REJECTED" && localStorage.getItem('roleName')!="ADMINISTRATOR") {
      $event.row.getElementsByClassName('e-gridchkbox')[0].classList.add('cheRemove');
      $event.row.classList.add('niang');
    }
  }


  getStaticalSheetByRegion() {

    const region = (JSON.parse(localStorage.getItem('regions')).filter((e,id) =>  e.name === localStorage.getItem('region')));
    const campaignId = this.validerFormCampagne.get('idCamp').value;
    console.log(region[0].id,Number(campaignId));
    this.sheetsService.getstatisticalBRegionAndCampaign(region[0].id,Number(campaignId)).subscribe((value)=>{
      if (value.length === 0){
        this.dateStaticalSheetByRegion = [];
        this.element.show({
          title: 'Avertissement  !', content: 'Aucune entrée trouvé !', cssClass: 'e-toast-warning'
        });
      }else {
        this.dateStaticalSheetByRegion = value;
        console.log(this.filterOptions);
      }
    },(error)=>{
      console.log(error);
    })
  }

  validerStaticalSheet() {
    this.sheetsService.patchStatus(this.TabSaveEcheancier,"DELEGATE_VALIDATED").subscribe((value)=>{
      console.log(value);

    },(error)=>{
      console.log(error);
    },()=>{
      this.getStaticalSheetByRegion();
      setTimeout(()=>{
        this.tailleSelect = 0;
      },100)

    })
  }

  rejeterStaticalSheet() {

    this.sheetsService.patchStatus(this.TabSaveEcheancier,"DELEGATE_REJECTED").subscribe((value)=>{
      console.log(value);

    },(error)=>{
      console.log(error);
    },()=>{
      this.getStaticalSheetByRegion();
      setTimeout(()=>{
        this.tailleSelect = 0;
      },100)

    })
  }
}
