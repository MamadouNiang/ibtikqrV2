import { Component, OnInit } from '@angular/core';
import {UsersService} from '../../../services/endpoints/users.service';
import {EditProfilComponent} from './edit-profil/edit-profil.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit {
  user: any;
  currentRole: any;

  constructor(private usersService: UsersService,  private modalService: NgbModal) { }

  ngOnInit(): void {
    this.getConnectedUser();
  }

  getConnectedUser(): void{
    const username = localStorage.getItem('username');
    this.currentRole = localStorage.getItem('roleName');
    this.usersService.findByUsername(username).subscribe(user => {
        if(user){
          this.user = user;
        }
    });
  }

  editInformation(): void{
    const modalRef = this.modalService.open(EditProfilComponent, {
      backdrop: 'static',
      centered: true,
      keyboard: false,
      size: 'md',
      windowClass: 'popup'
    });

    modalRef.componentInstance.curentUser = this.user;
  }
}
