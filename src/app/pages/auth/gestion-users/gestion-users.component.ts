import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {PositionDataModel} from '@syncfusion/ej2-angular-popups';
import {DialogComponent} from '@syncfusion/ej2-angular-popups/src/dialog/dialog.component';
import {
  GridComponent,
  GroupSettingsModel,
  PageSettingsModel,
  RowSelectEventArgs,
  SelectionSettingsModel
} from '@syncfusion/ej2-angular-grids';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ToastAnimationSettingsModel, ToastPositionModel} from '@syncfusion/ej2-angular-notifications';
import {RegionsService} from '../../../services/endpoints/regions.service';
import {RolesService} from '../../../services/endpoints/roles.service';
import {UsersService} from '../../../services/endpoints/users.service';

@Component({
  selector: 'app-gestion-users',
  templateUrl: './gestion-users.component.html',
  styleUrls: ['./gestion-users.components.scss'],

})
export class GestionUsersComponent implements OnInit {

  @ViewChild('grid') public grid: GridComponent;
  @ViewChild('grid2') public grid2: GridComponent;
  @ViewChild('grid3') public grid3: GridComponent;
  tabMvm = {};
  toolbar: string[];

  tabRefMinisteres: any;
  tabMinisteres = {};
  tabProfils = {};
  btnValidation = false;
  tabRoles: any;
  tabRoles2: any;
  public selectionOptions: SelectionSettingsModel;
  public groupOptions: GroupSettingsModel;
  public initialPage: PageSettingsModel;
  tailleSelect = 0;
  tailleSelectMinisteres = 0;
  tailleSelectProfils = 0;
  selectedrecords = {};
  selectedrecordsMinisteres = {};
  selectedrecordsProfils = {};
  cpass = false;
  public position: PositionDataModel = {X: 600, Y: 200};
  public position2: PositionDataModel = {X: 420, Y: 60};
  public position3: PositionDataModel = {X: 500, Y: 60};
  @ViewChild('ejDialog') ejDialog: DialogComponent;
  @ViewChild('ejDialog2') ejDialog2: DialogComponent;
  @ViewChild('ejDialog3') ejDialog3: DialogComponent;
  @ViewChild('container', {read: ElementRef, static: true}) container: ElementRef;
  @ViewChild('container2', {read: ElementRef, static: true}) containe2r: ElementRef;
  @ViewChild('container3', {read: ElementRef, static: true}) containe3r: ElementRef;
  public targetElement: HTMLElement;
  public targetElement2: HTMLElement;
  public targetElement3: HTMLElement;
  public closeOnEscape = false;
  public dialogCloseIcon = true;
  public defaultWidth = '452px';
  validerFormAjout: FormGroup;
  validerFormProfil: FormGroup;
  validerFormAjoutMin: FormGroup;
  selectedRoles = [];
  selectedProfils = [];
  selectedMin = [];
  public DialogObj;
  btnSupprimerProfil = false;
  @ViewChild('element') element;
  public positionMsg: ToastPositionModel = {X: 'Right', Y: 'Bottom'};
  public toasts;
  // public animation = { show: { effect: 'SlideRightIn' }};
  btnSupprimer = false;
  public animation: ToastAnimationSettingsModel = {
    show: {effect: 'SlideRightIn', duration: 600, easing: 'linear'},
    hide: {effect: 'FadeOut', duration: 100, easing: 'linear'}
  };
  allUsers: any;

  constructor(
    private fb: FormBuilder,
    private serviceRegions: RegionsService,
    private rolesService: RolesService,
    private usersService: UsersService
  ) {
  }

  async onDeleteEls(els) {
    console.log(els);
  }

  ngOnInit(): void {
    this.cpass = false;
    this.initFormAjout();
    this.getAllUsers();
    this.initFormAjoutMin();
    this.initFormProfil();
    this.toolbar = ['Search'];

  }

  initFormAjout() {
    this.validerFormAjout = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      roles: ['', Validators.required],
      regions: ['', Validators.required]
    });
  }

  initFormAjoutMin() {
    this.validerFormAjoutMin = this.fb.group({
      cd_ministere: ['', Validators.required],
    });
  }

  initFormProfil() {
    this.validerFormProfil = this.fb.group({
      roleName: ['', Validators.required],
    });
  }

  onCreate(a) {
  }

  private cancelClick(): void {
    this.DialogObj.hide();
  }

  public onOpenDialog = (event: any): void => {
    this.getRegions();
    this.getRoles();
    this.cpass = true;
    this.ejDialog.show();

  };
  public onOpenDialogProfils = (event: any): void => {
    this.cpass = true;
    this.ejDialog3.show();
    this.tabProfils = this.selectedrecords[0].roles;
    const tab = [];
    setTimeout(() => {
      for (let i = 0; i < this.tabRoles2.length; i++) {
        const a = this.tabRoles2[i].roleName;
        for (let j = 0; j < Object.keys(this.tabProfils).length; j++) {
          const b = (this.tabProfils[j].roleName);
          if (a === b) {
            tab.push(this.tabProfils[j].id);
          }
        }
      }
      for (let i = 0; i < this.tabRoles2.length; i++) {
        for (let j = 0; j < tab.length; j++) {
          if (this.tabRoles2[i].id === tab[j]) {
            this.tabRoles2.splice(i, 1);
          }

        }
      }
    }, 50);
  };

  validation(e) {
    // console.log(this.cpass)
    if (this.cpass) {
      e.cancel = false;
    } else {
      e.cancel = true;
    }
    console.log(e);
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

  rowSelectedMinistere(args: RowSelectEventArgs) {
    let selectedrecords: object[] = this.grid2.getSelectedRecords();
    this.tailleSelectMinisteres = (selectedrecords).length;
    this.selectedrecordsMinisteres = (selectedrecords);
  }

  rowDeSelectedMinistere(args: RowSelectEventArgs) {
    let selectedrecords: object[] = this.grid2.getSelectedRecords();
    this.tailleSelectMinisteres = (selectedrecords).length;
    this.selectedrecordsMinisteres = (selectedrecords);
  }

  rowSelectedProfils(args: RowSelectEventArgs) {
    let selectedrecords: object[] = this.grid3.getSelectedRecords();
    this.tailleSelectProfils = (selectedrecords).length;
    this.selectedrecordsProfils = (selectedrecords);
  }

  rowDeSelectedProfils(args: RowSelectEventArgs) {
    let selectedrecords: object[] = this.grid3.getSelectedRecords();
    this.tailleSelectProfils = (selectedrecords).length;
    this.selectedrecordsProfils = (selectedrecords);
  }

  getRegions() {
    this.serviceRegions.regions().subscribe({
      next: (v) => {
        console.log(v);
        this.tabRoles = v;
      },
      error: (e) => {
        console.log(e);
      }
    });
  }

  getRoles() {
    this.rolesService.roles().subscribe({
      next: (v) => {
        console.log(v);
        this.tabRoles2 = v;
      },
      error: (e) => {
        console.log(e);
      }
    });
  }

  ajoutUser() {
    let newVar = {...this.validerFormAjout.value};
    Object.assign(newVar.roles, newVar.roles.map(value =>
      typeof value === 'string' ? {
        id: value
      } : value
    ));
    this.usersService.users(newVar).subscribe((value) => {
      console.log(value);
      this.element.show({
        title: 'Succées   !', content: 'Utilisateur ajouté avec succée', cssClass: 'e-toast-success'
      });
    }, (error) => {
      this.element.show({
        title: 'ERREUR   !', content: 'Veillez recommencer', cssClass: 'e-toast-danger'
      });
    });
    console.log(newVar);
  }

  getAllUsers() {
    this.usersService.getAllUsers().subscribe((value) => {
      console.log(value);
      this.initFormAjout();
      this.allUsers = value;
    }, (error) => {
      this.element.show({
        title: 'ERREUR   !', content: 'Veillez recommencer', cssClass: 'e-toast-danger'
      });
    });
  }
}
