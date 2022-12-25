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
  @ViewChild('grid4') public grid4: GridComponent;
  tabMvm = {};
  toolbar: string[];

  tabProfils = {};
  btnValidation = false;
  tabRoles: any;
  tabRoles2: any;
  public selectionOptions: SelectionSettingsModel;
  public groupOptions: GroupSettingsModel;
  public initialPage: PageSettingsModel;
  tailleSelect = 0;
  tailleSelectProfils = 0;
  selectedrecords: any;
  selectedrecordsProfils = {};
  selectedRegions: any;

  tailleSelectRegion=0;
  selectedrecordsRegion: object[];

  cpass = false;
  public position: PositionDataModel = {X: 600, Y: 200};
  public position2: PositionDataModel = {X: 420, Y: 60};
  public position3: PositionDataModel = {X: 500, Y: 60};
  @ViewChild('ejDialog') ejDialog: DialogComponent;
  @ViewChild('ejDialog2') ejDialog2: DialogComponent;
  @ViewChild('ejDialog3') ejDialog3: DialogComponent;
  @ViewChild('ejDialog4') ejDialog4: DialogComponent;
  @ViewChild('container', {read: ElementRef, static: true}) container: ElementRef;
  @ViewChild('container2', {read: ElementRef, static: true}) containe2r: ElementRef;
  @ViewChild('container3', {read: ElementRef, static: true}) containe3r: ElementRef;
  @ViewChild('container4', {read: ElementRef, static: true}) containe4r: ElementRef;
  public targetElement: HTMLElement;
  public targetElement2: HTMLElement;
  public targetElement3: HTMLElement;
  public closeOnEscape = false;
  public dialogCloseIcon = true;
  public defaultWidth = '452px';
  validerFormAjout: FormGroup;
  validerFormProfil: FormGroup;
  validerFormRegion: FormGroup;
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
  dropDownRoles: any;
  tabRegions = [];


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
    this.getRoles();
    this.getRegions();
    this.initFormAjout();
    this.getAllUsers();
    this.initFormAjoutMin();
    this.initFormProfil();
    this.initFormRegions();
    this.toolbar = ['Search'];

  }

  initFormAjout() {
    this.validerFormAjout = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      roles: ['', Validators.required],
      regionIds: ['', Validators.required]
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

  initFormRegions() {
    this.validerFormRegion = this.fb.group({
      ids: ['', Validators.required],
    });
  }

  onCreate(a) {
  }

  private cancelClick(): void {
    this.DialogObj.hide();
  }

  public onOpenDialog = (event: any): void => {
    this.cpass = true;
    this.ejDialog.show();

  };

  async onOpenDialogRegions() {
    this.cpass = true;
    const res = await this.tabRoles.find(({id, name}) => {
      if (this.selectedrecords[0].regionIds.includes(id)) {
        this.tabRegions.push({id: id, name: name});
      }
    });
    this.ejDialog4.show();
    this.grid4.refreshColumns();
  }

  public onOpenDialogProfils = (): void => {
    this.cpass = true;
    this.ejDialog3.show();
    this.tabProfils = this.selectedrecords[0].roles.filter(e => {
      return e.name;
    });
    this.getDropdownRoles(this.tabRoles2,this.tabProfils as Array<any>);


  };

  getDropdownRoles(tabRoles2,tabProfils: Array<any>){
  const tabProfilsArrau : Array<any> = tabProfils as Array<any>;
    this.dropDownRoles =  tabRoles2.filter(function(o1) {
      return !tabProfilsArrau.some(function(o2) {
        return o1.id === o2.id;
      });
    });
  }

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
    this.tabRegions = [];
  }

  rowDeSelected(args: RowSelectEventArgs) {
    let selectedrecords: object[] = this.grid.getSelectedRecords();
    this.tailleSelect = (selectedrecords).length;
    this.selectedrecords = (selectedrecords);
    this.tabRegions = [];

  }

  rowSelectedRegions($event: any) {
    let selectedrecords: object[] = this.grid4.getSelectedRecords();
    this.tailleSelectRegion = (selectedrecords).length;
    this.selectedrecordsRegion = (selectedrecords);
  }

  rowDeSelectedRegions($event: any) {
    let selectedrecords: object[] = this.grid4.getSelectedRecords();
    this.tailleSelectRegion = (selectedrecords).length;
    this.selectedrecordsRegion = (selectedrecords);
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
    console.log(newVar);
    this.usersService.users(newVar).subscribe((value) => {
      this.getAllUsers();
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
      this.initFormAjout();
      this.allUsers = value;
      setTimeout(()=>{
        this.tailleSelectProfils = 0;
        this.tailleSelectRegion = 0;
        this.tailleSelect = 0;
      },500)
    }, (error) => {
      this.element.show({
        title: 'ERREUR   !', content: 'Veillez recommencer', cssClass: 'e-toast-danger'
      })
    });
  }

  onActived() {
    let a = [];
    let b = [];
    this.selectedrecords.filter(e => {
      e.isActive ? b.push(e.id) : a.push(e.id);
    });
    if (a.length > 0) {
      this.activateUsers(a);
    }
    if (b.length > 0) {
      this.desactivateUsers(b);
    }

  }

  desactivateUsers(b: any[]) {
    this.usersService.deactivates(b).subscribe((value) => {
      this.getAllUsers();
      setTimeout(() => {
        this.tailleSelect = 0;
      }, 100);
    }, (error) => {
      console.log((error));
    });
  }

  activateUsers(a: any[]) {
    this.usersService.activate(a).subscribe((value) => {
      this.getAllUsers();

      setTimeout(() => {
        this.tailleSelect = 0;
      }, 100);
    }, (error) => {
      console.log((error));
    });
  }

  validerModifProfil() {
    const tabOfIdsRoles = this.selectedProfils.map(e=>{
       return Number(e);
    })
    this.usersService.updateRoleToUser(this.selectedrecords[0].id,tabOfIdsRoles).subscribe((value)=>{
      console.log(value);
      this.getAllUsers();
      this.initFormProfil();
      this.ejDialog3.hide();
    },(error)=>{
      console.log(error);
    })
  }

  deleteRolesInProfil() {
    const tabOfIdsRoles = (this.selectedrecordsProfils as Array<any>).map(e=>{
      return Number(e.id);
    });

    this.usersService.deleteRoleToUser(this.selectedrecords[0].id,tabOfIdsRoles).subscribe((value)=>{
      this.getAllUsers();
      this.initFormProfil();
      this.element.show({
        title: 'Succées   !', content: 'Profil(s) ajouté avec succée', cssClass: 'e-toast-success'
      });
    },(error)=>{
      console.log(error);
      this.element.show({
        title: 'ERREUR   !', content: 'Veillez recommencer', cssClass: 'e-toast-danger'
      });
    },()=>{
      this.ejDialog3.hide();
    })
  }

  validerModiRegions() {
    this.usersService.updateRegionsToUser(this.selectedrecords[0].id,this.selectedrecordsRegion).subscribe((value)=>{
      this.getAllUsers();
      this.element.show({
        title: 'Succées   !', content: 'Region(s) ajouté avec succée', cssClass: 'e-toast-success'
      });
      this.initFormRegions();
      this.ejDialog4.hide();

    },(error)=>{
      console.log(error);
      this.element.show({
        title: 'ERREUR   !', content: 'Veillez recommencer', cssClass: 'e-toast-danger'
      });
    },()=>{
    })
  }


  deleteRegions() {
    console.log(this.selectedrecordsRegion)
    const tabOfIdsRoles = this.selectedrecordsRegion.map(e=>{
      return e['id'];
    });
    this.usersService.removeRegionsToUser(this.selectedrecords[0].id,tabOfIdsRoles).subscribe((value)=>{
      this.getAllUsers();
      this.element.show({
        title: 'Succées   !', content: 'Region(s) suprrimé avec succée', cssClass: 'e-toast-success'
      });
      this.initFormRegions();

    },(error)=>{
      console.log(error);
      this.element.show({
        title: 'ERREUR   !', content: 'Veillez recommencer', cssClass: 'e-toast-danger'
      });
    },()=>{
      this.ejDialog4.hide();

    })
  }
}
