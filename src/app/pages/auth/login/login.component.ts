import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PositionDataModel} from '@syncfusion/ej2-angular-popups';
import {DialogComponent} from '@syncfusion/ej2-angular-popups/src/dialog/dialog.component';
import {EmitType} from '@syncfusion/ej2-base';
import {AuthentificationService} from '../../../services/config/authentification.service';
import {ToastAnimationSettingsModel, ToastPositionModel} from '@syncfusion/ej2-angular-notifications';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  btnValider = false;
  @ViewChild('ejDialog') ejDialog: DialogComponent;
  @ViewChild('container', {read: ElementRef, static: true}) container: ElementRef;
  public targetElement: HTMLElement;
  public position: PositionDataModel = {X: 'center', Y: 'top'};
  public closeOnEscape = false;
  public dialogCloseIcon = true;
  public defaultWidth = '452px';
  public target = '.control-section';
  public animationSettings: Object = {effect: 'Zoom'};
  CheckCon = false;
  @ViewChild('element') element;
  public positionmsg: ToastPositionModel = {X: 'Right', Y: 'Bottom'};
  public toasts;
  // public animation = { show: { effect: 'SlideRightIn' }};
  public animation: ToastAnimationSettingsModel = {
    show: {effect: 'SlideRightIn', duration: 800},
    hide: {effect: 'FadeOut', duration: 500, easing: 'linear'}
  };
  cpass = false;

  public DialogObj;
  public positionX: PositionDataModel = {X: 540, Y: 50};
  @ViewChild('ejDialog2') ejDialog2: DialogComponent;
  @ViewChild('container2', {read: ElementRef, static: true}) container2: ElementRef;
  public targetElement2: HTMLElement;
  public closeOnEscape2 = false;
  public dialogCloseIcon2 = true;
  public defaultWidth2 = '452px';
  listRoles: any;
  validerFormProfil: FormGroup;
  jwt: string;

  constructor(
    private authService: AuthentificationService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
  ) {
  }

  ngOnInit(): void {
    console.log(this.activatedRoute.snapshot.paramMap.get('id'));
    this.cpass = false;
    this.initFormProfil();
  }

  initFormProfil() {
    this.validerFormProfil = this.fb.group({
      roleName: ['', Validators.required],
    });
  }

  public initilaizeTarget: EmitType<object> = () => {
    this.targetElement = this.container.nativeElement.parentElement;
  };
  public onOpenDialog = (event: any): void => {
    this.cpass = true;
    this.ejDialog.show();
  };
  selectedRole: any;

  async onChange(data: any) {
    console.log(data);
    if (data.nnpassword === data.npassword) {
      const resp = await this.VerifeUserPass({username: data.username, password: data.apassword}).catch(reason => {
        console.log(reason.status);
        if (reason.status === 403) {
          this.element.show({
            title: 'Error   !', content: 'Informations incorrectes.', cssClass: 'e-toast-warning'
          });
        }
      });
      if (resp) {
        await this.updateUser({username: data.username, password: data.npassword}).catch(reason => {
          console.log(reason.status);
          if (reason.status === 200) {
            this.element.show({
              title: 'Success   !', content: 'Vos Informations ont été mise a jour .', cssClass: 'e-toast-success'
            });
            this.ejDialog.hide();
          }
        });
      }
    } else {
      this.element.show({
        title: 'Confirmation du mot de passe   !', content: 'les deux mots de passe ne sont pas identiques.', cssClass: 'e-toast-warning'
      });
    }

  }

  async VerifeUserPass(data: any) {
    let res = await this.authService.login({username: data.username, password: data.password}).toPromise();
    return res;
  }

  async updateUser(data) {
    console.log(data);
    let res = await this.authService.updatePassword(data).toPromise();
     return res;
  }

  async isUserActived(username) {
    try {
      //const res = await this.authService.isActived(username).toPromise();
      //return res;
    } catch (e) {
      return e;
    }
  }

  async onLogin(data: any) {
    console.log(data);
    this.CheckCon = true;
    try {
      const res = await this.authService.login(data).toPromise();
      if (res) {
        localStorage.setItem('username', res['user'].username);
        this.jwt = res['accessToken'];
        if (res['user'].roleList.length > 1) {
          this.cpass = true;
          localStorage.setItem('roleList', res['user'].roleList);
          this.ejDialog2.show();
          this.listRoles = res['user'].roleList;
        } else {
          setTimeout(() => {
            this.authService.saveToken(res['accessToken']);
            localStorage.setItem('roleName', res['user'].roleList[0]);
            this.router.navigateByUrl('/dashbord');
          }, 100);
        }
      }
    } catch (e) {
      this.element.show({
        title: 'Error   !', content: 'Informations Incorrectes ! .', cssClass: 'e-toast-danger'
      });
    } finally {
      this.CheckCon = false;
    }
  }

  onCreate(a) {
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

  validationProfil() {
    this.authService.saveToken(this.jwt);
    localStorage.setItem('roleName', this.validerFormProfil.get('roleName').value);
    setTimeout(() => {
      this.router.navigateByUrl('/dashbord');
    }, 100);
  }
}

