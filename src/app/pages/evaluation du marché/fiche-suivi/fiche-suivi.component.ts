import {Component, OnInit} from '@angular/core';
import {EstimationService} from '../../../services/endpoints/estimation.service';
import {DatePipe} from '@angular/common';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import Stepper from 'bs-stepper';

@Component({
  selector: 'app-fiche-suivi',
  templateUrl: './fiche-suivi.component.html',
  styleUrls: ['./fiche-suivi.component.css'],
  providers: [DatePipe],

})
export class FicheSuiviComponent implements OnInit {

  campagnes: any;
  myDate: any;
  validerFormCampagne: FormGroup;
  private stepper: Stepper;

  validerFormStep1: FormGroup;
  region: string;
  user: string;

  constructor(private estimationService: EstimationService,
              private datePipe: DatePipe,
              private fb: FormBuilder,
  ) {
    this.myDate = this.datePipe.transform(new Date(), 'yyyy');

  }

  ngOnInit(): void {
    this.region = localStorage.getItem('region');
    this.user = localStorage.getItem('username');
    this.step1Form();
    this.getAllCampagnes();
    this.campagnesForm();
  }

  step1Form() {
    this.validerFormStep1 = this.fb.group({
      region: ['', Validators.required],
      moughataa: ['',],
      commune: ['',],
      telephone: ['', Validators.required, Validators.minLength(8),
        Validators.maxLength(8)],
      whatsapp: ['',],
      user: ['', Validators.required],
      email: ['', Validators.pattern('[^ @]*@[^ @]*')],

    });
  }


  next() {
    this.stepper.next();
  }

  previous() {
    this.stepper.previous();
  }

  async getAllCampagnes() {
    try {
      const resp = await this.estimationService.estimations().toPromise();
      this.campagnes = resp;
      this.stepper = new Stepper(document.querySelector('#stepper1'), {
        linear: false,
        animation: true
      });
    } catch (e) {
      console.log(e);
    }
  }

  createStaticalSheetByCampagne() {


    console.log(this.validerFormCampagne.get('idCamp').value);
  }

  campagnesForm() {
    this.validerFormCampagne = this.fb.group({
      idCamp: ['', Validators.required],
    });
  }
}
