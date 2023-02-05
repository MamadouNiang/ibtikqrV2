import {Component, Input, OnInit} from '@angular/core';
import {FormGroup, Validators, FormBuilder} from '@angular/forms';
import {UsersService} from '../../../../services/endpoints/users.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
export class User{
  username = '';
  name = '';
  nni = '';
  email = '';
  tel = '';
}
@Component({
  selector: 'app-edit-profil',
  templateUrl: './edit-profil.component.html',
  styleUrls: ['./edit-profil.component.css']
})
export class EditProfilComponent implements OnInit {
  editInformationForm: FormGroup;
  user: User = new User;
  @Input() curentUser: any;
  constructor(private fb: FormBuilder, private usersService: UsersService, public modal: NgbActiveModal) { }

  ngOnInit(): void {
    this.buildForm();
    this.getCurentUserValue();
  }

  buildForm(): void{
    this.editInformationForm = this.fb.group({
      'username': '',
      'name': '',
      'nni': '',
      'email': '',
      'tel': '',

    });
  }

  save(): void{
    console.log(this.user.username)
    debugger
    this.user.username = this.editInformationForm.get("username").value;
    this.user.name = this.editInformationForm.get("name").value;
    this.user.nni = this.editInformationForm.get("nni").value;
    this.user.email = this.editInformationForm.get("email").value;
    this.user.tel = this.editInformationForm.get("tel").value;

    this.usersService.users(this.user).subscribe(user =>{
      if(user){
          const newUser = user;
          this.modal.dismiss();
      }
    })
  }


  getCurentUserValue(){
    this.editInformationForm.get("username").setValue(this.curentUser.username);
    this.editInformationForm.get("name").setValue(this.curentUser.name);
    this.editInformationForm.get("nni").setValue(this.curentUser.nni);
    this.editInformationForm.get("email").setValue(this.curentUser.email);
    this.editInformationForm.get("tel").setValue(this.curentUser.tel);
  }
}
