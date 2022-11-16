import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ToastAnimationSettingsModel, ToastPositionModel} from '@syncfusion/ej2-angular-notifications';
import {PositionDataModel} from '@syncfusion/ej2-angular-popups';
import {DialogComponent} from '@syncfusion/ej2-angular-popups/src/dialog/dialog.component';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {GridComponent, GroupSettingsModel, RowSelectEventArgs, SelectionSettingsModel} from '@syncfusion/ej2-angular-grids';
import {DatePipe} from '@angular/common';
import {IntrantService} from '../../../services/endpoints/intrant.service';
import { Pipe, PipeTransform } from '@angular/core';

@Component({
  selector: 'app-intrants',
  templateUrl: './intrants.component.html',
  styleUrls: ['./intrants.component.css'],
  providers: [DatePipe],
})
export class IntrantsComponent implements OnInit {
  @ViewChild('element') element;
  public position: ToastPositionModel = {X: 'Right', Y: 'Bottom'};
  public toasts;
  public animation: ToastAnimationSettingsModel = {
    show: {effect: 'SlideRightIn', duration: 600, easing: 'linear'},
    hide: {effect: 'FadeOut', duration: 100, easing: 'linear'}
  };
  cpass = false;
  @ViewChild('container', {read: ElementRef, static: true}) container: ElementRef;

  public IntrantDetail: PositionDataModel = {X: 530, Y: 100};
  @ViewChild('ejDialogDetail') ejDialogDetail: DialogComponent;
  public targetElementDetail: HTMLElement;
  public closeOnEscape = false;
  public dialogCloseIcon = true;
  public defaultWidth = '452px';

  public IntrantModification: PositionDataModel = {X: 530, Y: 100};
  @ViewChild('ejDialogModification') ejDialogModification: DialogComponent;
  public targetElementModification: HTMLElement;


  public positionModal: PositionDataModel = {X: 530, Y: 100};
  @ViewChild('ejDialog') ejDialog: DialogComponent;
  public targetElement: HTMLElement;
  public DialogObj;
  validerFormAjout: FormGroup;
  validerFormModification: FormGroup;

  @ViewChild('grid') public grid: GridComponent;
  public selectionOptions: SelectionSettingsModel;

  rechercheForm: FormGroup;

  validerForm1: FormGroup;

  myDate: any = new Date();
  myDateYear: any = new Date();
  myDateMonth: any = new Date();

  selectedSubventions: any;
  userDetailCodeModification: any;
  detaiIntrantModification: any;


  constructor(
    private datePipe: DatePipe,
    private fb: FormBuilder,
    private intrantService: IntrantService,
  ) {
    this.myDateYear = this.datePipe.transform(this.myDateYear, 'yyyy');
    this.myDate = this.datePipe.transform(this.myDate, 'dd-MM-yyyy');
    this.myDateMonth = this.datePipe.transform(this.myDateMonth, 'MM');

  }

  ngOnInit(): void {

    this.initFormAjout();
    this.initFormModification();
    this.intrants();
    this.groupOptions = {showDropArea: false, showGroupedColumn: false, columns: ['unit']};

  }

  initFormAjout() {
    this.validerFormAjout = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      unit: ['', Validators.required],
      unitCost: ['', Validators.required],
    });
  }

  initFormModification() {
    this.validerFormModification = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      unit: ['', Validators.required],
      unitCost: ['', Validators.required],
      dateCreation: [this.myDate, Validators.required],
      saissiseurIntrant: [localStorage.getItem('username'), Validators.required],
    });
  }


  onCreate(a) {
  }


  validation(e) {
    if (this.cpass) {
      e.cancel = false;
    } else {
      e.cancel = true;
    }
  }

  public onOpenDialog = (event: any): void => {
    this.cpass = true;
    this.ejDialog.show();
  };

  async validationAjout() {
    console.log(this.validerFormAjout.value);
    try {
      const res = await this.intrantService.save(this.validerFormAjout.value).toPromise();
      if (res) {
        console.log(res);
        this.initFormAjout();
        this.element.show({
          title: 'Success   !', content: 'Ajout d\'un nouveau Intrant reussie .', cssClass: 'e-toast-success'
        });
        this.intrants();

        //this.ejDialog.hide();
      }
    } catch (e) {
      console.log(e);
      this.element.show({
        title: 'Erreur trouvée   !', content: e.error.error, cssClass: 'e-toast-danger'
      });
    }
  }

  async validationModification() {
    const ob = {id:this.selectedrecords[0].id,...this.validerFormModification.value}
    try {
      const res = await this.intrantService.save(ob).toPromise();
      if (res) {
        console.log(res);
        this.initFormModification();
        this.element.show({
          title: 'Success   !', content: 'Mise á jour de l\'intrant reussie .', cssClass: 'e-toast-success'
        });
        this.intrants();
        this.ejDialogModification.hide();
      }
    } catch (e) {
      console.log(e);
      this.element.show({
        title: 'Erreur trouvée   !', content: e.error.error, cssClass: 'e-toast-danger'
      });
    }
  }

  async deletes() {
    console.log((this.selectedrecords as Array<any>).map(v=>v.id));
    const tab = (this.selectedrecords as Array<any>).map(v=>v.id)
    try {
      const res = await this.intrantService.deleteIntrant(tab).toPromise();
      this.element.show({
        title: 'Success   !', content: 'Mise á jour de l\'intrant reussie .', cssClass: 'e-toast-success'
      });
      setTimeout(() => {
        this.tailleSelect = 0;
      }, 100);
      this.intrants();
    } catch (e) {
      console.log(e);
      this.element.show({
        title: 'Erreur trouvée   !', content: e.error.error, cssClass: 'e-toast-danger'
      });
    }
  }

  userDetailCodeIntrant: any;
  detaiIntrant?: any | null;

  public onOpenDialogDetail = (event: any, data: any): void => {
    console.log(data);
    this.userDetailCodeIntrant = data.name;
    this.cpass = true;
    this.ejDialogDetail.show();
    this.detaiIntrant = data;
  };


  public onOpenDialogModification = (event: any): void => {
    console.log(this.selectedrecords);
    this.userDetailCodeModification = this.selectedrecords[0].name;
    this.cpass = true;
    this.ejDialogModification.show();
    this.detaiIntrantModification = this.selectedrecords[0];
  };

  private cancelClick(): void {
    this.DialogObj.hide();
  }

  intrantData: any;

  async intrants() {
    try {
      this.tailleSelect = 0;

      const resp = await this.intrantService.intrants().toPromise();

      this.intrantData = resp;
      console.log(this.intrantData);
    } catch (e) {
      console.log(e);
      this.element.show({
        title: 'Erreur trouvée   !', content: e.error.error, cssClass: 'e-toast-danger'
      });
    }
  }

  tailleSelect = 0;
  selectedrecords = {};

  rowSelected(args: RowSelectEventArgs) {
    let selectedrecords: object[] = this.grid.getSelectedRecords();
    this.tailleSelect = (selectedrecords).length;
    this.selectedrecords = (selectedrecords);
    this.validerFormModification = this.fb.group({
      name: [this.selectedrecords[0].name, Validators.required],
      description: [this.selectedrecords[0].description, Validators.required],
      unit: [this.selectedrecords[0].unit, Validators.required],
      // quantite: [this.selectedrecords[0].quantite, Validators.required],
      unitCost: [this.selectedrecords[0].unitCost, Validators.required],
      dateCreation: [this.myDate, Validators.required],
      saissiseurIntrant: [localStorage.getItem('username'), Validators.required],
    });
  }

  rowDeSelected(args: RowSelectEventArgs) {
    let selectedrecords: object[] = this.grid.getSelectedRecords();
    this.tailleSelect = (selectedrecords).length;
    this.selectedrecords = (selectedrecords);
    this.validerFormModification = this.fb.group({
      name: [this.selectedrecords[0].name, Validators.required],
      description: [this.selectedrecords[0].description, Validators.required],
      unit: [this.selectedrecords[0].unit, Validators.required],
      // quantite: [this.selectedrecords[0].quantite, Validators.required],
      unitCost: [this.selectedrecords[0].unitCost, Validators.required],
      dateCreation: [this.myDate, Validators.required],
      saissiseurIntrant: [localStorage.getItem('username'), Validators.required],
    });
  }

  public groupOptions: GroupSettingsModel;

}
