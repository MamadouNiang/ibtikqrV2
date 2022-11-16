import {AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {AuthentificationService} from '../../services/config/authentification.service';
import {JwtHelperService} from '@auth0/angular-jwt';
import { LoaderService } from 'src/app/services/config/loader.service';
import {PositionDataModel} from '@syncfusion/ej2-angular-popups';
import {DialogComponent} from '@syncfusion/ej2-angular-popups/src/dialog/dialog.component';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-theme-nav-sidebar',
  templateUrl: './theme-nav-sidebar.component.html',
  styleUrls: ['./theme-nav-sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ThemeNavSidebarComponent implements OnInit{
  username;
  roles: any;

  cpass = false;
  public DialogObj2;
  public positionX: PositionDataModel = {X: 540, Y: 50};
  @ViewChild('ejDialog') ejDialog: DialogComponent;
  @ViewChild('container2', {read: ElementRef, static: true}) container2: ElementRef;
  public targetElement2: HTMLElement;
  public closeOnEscape2 = false;
  public dialogCloseIcon2 = true;
  public defaultWidth2 = '452px';

  validerFormProfil: FormGroup;
  listRoles: any;

  constructor(
    private authServ: AuthentificationService,
    public loaderService: LoaderService,
    private fb: FormBuilder,
    private router: Router,
  ) {

  }
  ngOnInit(): void {
    this.isAuthenticated();
    this.initFormProfil();
  }
  initFormProfil() {
    this.validerFormProfil = this.fb.group({
      roleName: ["", Validators.required],
    });
  }
  logOut(){
    localStorage.removeItem('token');
    localStorage.removeItem('roleName');
    localStorage.removeItem('roleList');
    localStorage.clear();
    setTimeout(()=>{
      this.authServ.logout();
    })
  }
  isAuthenticated(){
    this.username = localStorage.getItem('username')
    let jwtHelper = new JwtHelperService();

    if (localStorage.getItem('token') != null) {
      let arr: Array<string> = localStorage.getItem('roleList').split(",");
      this.listRoles=arr;
    }

    if (localStorage.getItem('roleName') != null){
      let objJWT =localStorage.getItem('roleName');
      this.roles=objJWT;
      if(objJWT!=null){
        return true;
      }else{
        return false;
      }
    }else {
      return false;
    }
  }
  isAdmin(){
    return this.roles.indexOf('ROLE_ADMINISTRATOR')>=0
  }
  isCommission(){
    return this.roles.indexOf('ROLE_COMMISSION')>=0
  }
  isAgriculteur(){
    return this.roles.indexOf('ROLE_FARMER')>=0
  }
  isDelegue(){
    return this.roles.indexOf('ROLE_DELEGATE')>=0
  }
  // isVALIDATION2(){
  //   return this.roles.indexOf('VALIDATION2')>=0
  // }
  // async chargement() {
  //   var div= document.createElement("div");
  //   var div2= document.createElement("div");
  //   var div3= document.createElement("div");
  //
  //   var p = document.createElement("p")
  //
  //   var div31= document.createElement("div");
  //   var div32= document.createElement("div");
  //   var div33= document.createElement("div");
  //   var div34= document.createElement("div");
  //   var div35= document.createElement("div");
  //
  //   div.className += " overlay";
  //   div2.className += " loadingio-spinner-ellipsis-mjvyutdz4a";
  //   div3.className += "ldio-7xowz5onix7";
  //   p.className += "textChargement";
  //
  //   p.appendChild(document.createTextNode("Chargement en cours ... "));
  //
  //   div.appendChild(div2)
  //   div.appendChild(p)
  //   div2.appendChild(div3)
  //
  //   div3.appendChild(div31)
  //   div3.appendChild(div32)
  //   div3.appendChild(div33)
  //   div3.appendChild(div34)
  //   div3.appendChild(div35)
  //
  //   document.body.appendChild(div);
  // }
  selectedRole: any;

  changeProfil() {
    this.cpass = true;
    this.ejDialog.show();
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
  validationProfil(){
    localStorage.setItem("roleName",this.validerFormProfil.get("roleName").value);
    this.ejDialog.hide();
    this.router.navigateByUrl("/dashbord");
  }
}
