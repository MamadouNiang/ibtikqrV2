import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ToastAnimationSettingsModel, ToastPositionModel} from '@syncfusion/ej2-angular-notifications';
import {DatePipe} from '@angular/common';
import {DialogUtility, PositionDataModel} from '@syncfusion/ej2-angular-popups';
import {DialogComponent} from '@syncfusion/ej2-angular-popups/src/dialog/dialog.component';
import {CaServiceService} from '../../../services/endpoints/ca-service.service';
import {
  DetailRowService,
  GridComponent,
  GridModel,
  GroupSettingsModel,
  RowSelectEventArgs,
  SelectionSettingsModel
} from '@syncfusion/ej2-angular-grids';
import {IntrantService} from '../../../services/endpoints/intrant.service';
import {EstimationService} from '../../../services/endpoints/estimation.service';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-recrutement',
  templateUrl: './campagne.component.html',
  styleUrls: ['./campagne.component.scss'],
  providers: [DatePipe, DetailRowService],
})
export class CampagneComponent implements OnInit {
  @ViewChild('element') element;
  public position: ToastPositionModel = {X: 'Right', Y: 'Bottom'};
  public toasts;
  public animation: ToastAnimationSettingsModel = {
    show: {effect: 'SlideRightIn', duration: 600, easing: 'linear'},
    hide: {effect: 'FadeOut', duration: 100, easing: 'linear'}
  };
  cpass = false;
  @ViewChild('container', {read: ElementRef, static: true}) container: ElementRef;
  public positionModal: PositionDataModel = {X: 530, Y: 100};
  @ViewChild('ejDialog') ejDialog: DialogComponent;
  public targetElement: HTMLElement;
  public DialogObj;
  validerFormAjout: FormGroup;
  validerFormModification: FormGroup;
  validerFormAjoutIntrant: FormGroup;

  @ViewChild('grid') public grid: GridComponent;
  public selectionOptions: SelectionSettingsModel;

  rechercheForm: FormGroup;

  validerForm1: FormGroup;

  myDate: any = new Date();
  myDateYear: any = new Date();
  myDateMonth: any = new Date();

  public DialogObjDetail;
  cpass2 = false;
  public positionX: PositionDataModel = {X: 500, Y: 50};
  @ViewChild('ejDialogDetail') ejDialogDetail: DialogComponent;
  @ViewChild('containerDetail', {read: ElementRef, static: true}) containerDetail: ElementRef;
  public targetElementDetail: HTMLElement;
  public closeOnEscape = false;
  public dialogCloseIcon = true;
  public defaultWidth = '452px';

  @ViewChild('ejDialogModification') ejDialogModification: DialogComponent;
  @ViewChild('containerModification', {read: ElementRef, static: true}) containerModification: ElementRef;
  public targetElementModification: HTMLElement;

  @ViewChild('ejDialogAjout') ejDialogAjout: DialogComponent;
  @ViewChild('containerAjout', {read: ElementRef, static: true}) containerAjout: ElementRef;
  public targetElementAjout: HTMLElement;

  Detail: any;
  DetailCa: any;
  tailleSelect = 0;

  selectedSubventions: any;
  subventions: any;

  intrantSelected: any;
  allCamp: any;
  public childGrid: GridModel;

  public groupOptions: GroupSettingsModel;
  allData = [];
  DetailCodeCa: string;
  responseCamp: any;
  TabSave: any[];
  selectedrecords: object[];
  caModifData: object;
  campagneSelect: object[];
  filter: any;


  constructor(
    private datePipe: DatePipe,
    private fb: FormBuilder,
    private serviceCa: CaServiceService,
    private intrantService: IntrantService,
    private estimationService: EstimationService,
  ) {
    this.myDateYear = this.datePipe.transform(this.myDateYear, 'yyyy');
    this.myDate = this.datePipe.transform(this.myDate, 'dd-MM-yyyy');
    this.myDateMonth = this.datePipe.transform(this.myDateMonth, 'MM');

  }

  ngOnInit(): void {
    this.getIntrants();

    this.groupOptions = {showDropArea: false, showGroupedColumn: false, columns: ['code']};
    this.selectionOptions = {checkboxOnly: true, checkboxMode: 'Default'};

    this.initFormAjout();
    this.initFormModication();
    this.getEstimations();
    this.initFormAjoutIntrant();
  }

  changeIntrant() {
    this.subventions.map(e => Object.assign(e, {selected: false}));
    this.intrantsFieldAsFormArray.value.filter(selected => {
      this.subventions.forEach(existed => {
        if (selected.agriculturalInputId === existed.id) {
          Object.assign(existed, {selected: true});
        }
      });

    });
    console.log(this.subventions);
  }

  changeIntrantAjout() {
    this.subventions.map(e => Object.assign(e, {selected: false}));
    this.intrantsFieldAsFormArrayAjout.value.filter(selected => {
      this.subventions.forEach(existed => {
        if (selected.agriculturalInputId === existed.id) {
          Object.assign(existed, {selected: true});
        }
      });

    });
    console.log(this.subventions);
  }

  async getIntrants() {
    try {
      const resp = await this.intrantService.intrants().toPromise();
      this.subventions = resp;
    } catch (e) {
      console.log(e);
      this.element.show({
        title: 'Erreur trouvée   !', content: e.error.error, cssClass: 'e-toast-danger'
      });
    }
  }

  getEstimations() {
    this.estimationService.estimations().pipe(map(data => {
      const d = [];
      this.campagneSelect = [];
      (data as Array<any>).forEach(el => {
        this.campagneSelect.push({id: el.id, code: el.code});
      });
      (data as Array<any>).forEach(el => {
        console.log(el);
        el.agriculturalInputs.forEach(e => {
          e['agId'] = e['id'];
          delete e['id'];
          d.push({...e, ...el, ...{intrantTotal: (e.campaignUnitCost ? e.campaignUnitCost : e.unitCost) * e.quantity}});
        });
      });
      return d;
    }))
      .subscribe({
        next: (value) => this.allCamp = value,
        error: (e) => {
          console.log(e);
          this.element.show({
            title: 'Erreur trouvée   !', content: e.error.error, cssClass: 'e-toast-danger'
          });
        }
      });
  }

  ajoutIntrantInCampaign() {
    console.log(this.validerFormAjoutIntrant.value);
    this.serviceCa.addIntrantInCa(this.validerFormAjoutIntrant.get('id').value, this.validerFormAjoutIntrant.get('intrants').value).subscribe({
      next: (value) => {
        console.log(value);
        this.getEstimations();
        this.ejDialogAjout.hide();
        this.initFormAjoutIntrant();
      },
      error: (error) => {
        console.log(error);
      }
    })
    ;

  }

  initFormAjout() {
    this.validerFormAjout = this.fb.group({
      codeCa: ['CA/' + this.myDateYear + '/' + this.myDateMonth + '/...', Validators.required],
      description: ['', Validators.required],
      intrants: this.fb.array([this.intrantsForm()]),
      startDate: [this.myDate, Validators.required],
      endDate: [this.myDate, Validators.required],
      dateSaisie: [this.myDate, Validators.required],
      saissiseurCampagne: [localStorage.getItem('username'), Validators.required],
    });
  }

  initFormAjoutIntrant() {
    this.validerFormAjoutIntrant = this.fb.group({
      id: [null, Validators.required],
      intrants: this.fb.array([this.intrantsForm()]),
    });
  }

  initFormModication() {
    this.validerFormModification = this.fb.group({
      campaignId: [''],
      agriculturalInputId: [''],
      quantity: ['', Validators.required],
      unitCost: ['', Validators.required]
    });
  }

  get intrantsFieldAsFormArray(): any {
    return this.validerFormAjout.get('intrants') as FormArray;
  }

  get intrantsFieldAsFormArrayAjout(): any {
    return this.validerFormAjoutIntrant.get('intrants') as FormArray;
  }

  intrantsForm(): any {
    return this.fb.group({
      agriculturalInputId: this.fb.control(''),
      quantity: this.fb.control(''),
    });
  }

  addControl(): void {
    // console.log(this.intrantsFieldAsFormArray.value);
    // console.log(this.subventions);
    this.intrantsFieldAsFormArray.push(this.intrantsForm());
  }

  addControlIntrants(): void {
    this.intrantsFieldAsFormArrayAjout.push(this.intrantsForm());
  }

  remove(event, i: number): void {
    this.subventions.forEach(existed => {
      if (this.intrantsFieldAsFormArray.value[i].agriculturalInputId === existed.id) {
        Object.assign(existed, {selected: false});
      }
    });
    this.intrantsFieldAsFormArray.removeAt(i);
  }

  removeIntrants(i: number): void {
    this.subventions.forEach(existed => {
      if (this.intrantsFieldAsFormArray.value[i].agriculturalInputId === existed.id) {
        Object.assign(existed, {selected: false});
      }
    });
    this.intrantsFieldAsFormArrayAjout.removeAt(i);
  }

  onCreate(a) {
  }

  logform() {
    console.log(this.validerFormAjout);
  }

  validation(e) {
    if (this.cpass) {
      e.cancel = false;
    } else {
      e.cancel = true;
    }
  }

  private cancelClick(): void {
    this.DialogObj.hide();
  }

  public onOpenDialog = (event: any): void => {
    this.cpass = true;
    this.ejDialog.show();
  };

  async validationAjout() {
    console.log(this.validerFormAjout.value);
    const ob = {
      'description': this.validerFormAjout.get('description').value,
      'startDate': this.validerFormAjout.get('startDate').value,
      'endDate': this.validerFormAjout.get('endDate').value,
      'estimationCostQuantities': this.validerFormAjout.get('intrants').value
    };
    console.log(ob);
    try {
      const res = await this.serviceCa.saveCa(ob).toPromise();
      if (res) {
        console.log(res);
        this.initFormAjout();
        this.getEstimations();
        this.element.show({
          title: 'Success   !', content: 'Ajout d\'une nouvelle campagne reussie .', cssClass: 'e-toast-success'
        });
        this.ejDialog.hide();
      }
    } catch (e) {
      console.log(e);
      this.element.show({
        title: 'Erreur trouvée   !', content: e.error.error, cssClass: 'e-toast-danger'
      });
    }
  }

  public onOpenDialogDetail = (event: any, data: any): void => {
    this.DetailCodeCa = data.code + ' : ' + data.name;
    console.log(data);
    console.log(this.allCamp);
    this.cpass = true;
    this.ejDialogDetail.show();
    this.DetailCa = data;
  };
  public onOpenDialogModification = (event: any): void => {
    this.cpass = true;
    console.log(event);
    console.log(this.selectedrecords[0]);
    this.caModifData = this.selectedrecords[0];
    this.ejDialogModification.show();
  };
  public onOpenDialogAjout = (event: any): void => {
    this.cpass = true;
    this.ejDialogAjout.show();
  };

  async validationModification() {
    this.validerFormModification.get('campaignId').setValue(this.caModifData['id']);
    this.validerFormModification.get('agriculturalInputId').setValue(this.caModifData['agId']);
    console.log(this.validerFormModification.value);
    try {
      const resp = await this.serviceCa.addIntrantInCa(this.validerFormModification.get('campaignId').value, [this.validerFormModification.value]).toPromise();
      this.initFormModication();
      this.getEstimations();
      this.element.show({
        title: 'Success   !', content: 'Midification d\'une nouvelle campagne reussie .', cssClass: 'e-toast-success'
      });
      this.ejDialogModification.hide();
    } catch (e) {
      console.log(e);
      this.element.show({
        title: 'Erreur trouvée   !', content: e.error.error, cssClass: 'e-toast-danger'
      });
    }
  }

  async intrants() {
    //   try {
    //     const resp = await this.intrantService.intrants().toPromise();
    //     resp.filter(e => {
    //       Object.assign(e, {cout: Number(e.prix) * Number(e.quantite)*1000})
    //     });
    //     this.intrantData = resp;
    //     console.log(this.intrantData);
    //   } catch (e) {
    //     console.log(e);
    //     this.element.show({
    //       title: 'Erreur trouvée   !', content: e.error.error, cssClass: 'e-toast-danger'
    //     });
    //   }
    // }

  }

  rowSelected(args: RowSelectEventArgs) {
    let selectedrecords: object[] = this.grid.getSelectedRecords();
    this.tailleSelect = (selectedrecords).length;
    this.selectedrecords = (selectedrecords);
  }

  rowDeSelected(args: RowSelectEventArgs) {
    let selectedrecords: object[] = this.grid.getSelectedRecords();
    this.tailleSelect = (selectedrecords).length;
    this.selectedrecords = (selectedrecords);
  }

  async removeIntrantInCamp() {
    console.log(this.selectedrecords[0]['id']);

    try {
      this.serviceCa.removeIntrantInCa(this.selectedrecords[0]['id'], this.selectedrecords.map(e => (e as any).agId)).subscribe(value => {
        setTimeout(() => {this.tailleSelect = 0;}, 100);
        this.getEstimations();
      });

    } catch (e) {
      console.log(e);
    }
  }

  changeEtatIntrantImCamp() {
    const campaignId = [];
    const intrantsIds = [];
    //console.log(this.selectedrecords);
    this.selectedrecords.filter(e => {
      campaignId.push(e['id']);
      intrantsIds.push(e['agId']);
    });
    if (campaignId.every((val, i, arr) => val === arr[0])) {
      console.log('CampId', campaignId[0]);
      console.log('Ids', intrantsIds);
      this.serviceCa.changeEtatIntrantInCamp(campaignId[0], intrantsIds).subscribe((value) => {
        setTimeout(() => {this.tailleSelect = 0;}, 100);
        this.getEstimations();
      }, (error) => {
        console.log(error);
      });
    } else {
      DialogUtility.alert('Veillez selectionner qu\'une campagne !');
    }

  }

}
