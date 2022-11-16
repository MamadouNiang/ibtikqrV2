import {Component, OnInit, ViewChild} from '@angular/core';
import {TdEcheancierMvmService} from '../../../services/td-echeancier-mvm.service';
import {GridComponent, GroupSettingsModel, RowSelectEventArgs, SelectionSettingsModel} from '@syncfusion/ej2-angular-grids';
import {TdEcheancierService} from '../../../services/td-echeancier.service';
import {ToastAnimationSettingsModel, ToastPositionModel} from '@syncfusion/ej2-angular-notifications';
import {DatePipe} from '@angular/common';
import {TDAdminService} from '../../../services/tdadmin.service';

@Component({
  selector: 'app-liste-changement-els-salaire',
  templateUrl: './liste-changement-els-salaire.component.html',
  styleUrls: ['./liste-changement-els-salaire.component.scss'],
  providers: [DatePipe],
})
export class ListeChangementElsSalaireComponent implements OnInit {
  @ViewChild('element') element;
  public position: ToastPositionModel = {X: 'Right', Y: 'Bottom'};
  public toasts;
  public animation: ToastAnimationSettingsModel = {
    show: {effect: 'SlideRightIn', duration: 600, easing: 'linear'},
    hide: {effect: 'FadeOut', duration: 100, easing: 'linear'}
  };

  @ViewChild('grid') public grid: GridComponent;
  public toolbar: String[];
  public groupOptions: GroupSettingsModel;
  selected?: any;
  tabCodeServices = [];
  tabMvm = [];
  tailleSelect = 0;
  public selectionOptions: SelectionSettingsModel;
  TabSaveEcheancier = {};
  deviseCle: any;
  netamontant: any;
  tauxPerteChange: number;
  perteChange: boolean;
  gainChange: boolean;
  tauxChancelerie: any;
  services: any;
  soldeGlobal: any;
  myDate: any;
  resMvm: any;
  getMonthInMvm: any;
  resGlobal: any;
  resultatNew = [];
  tabDonneeEcheancier: any;
  resultat: number;
  myDate2: string;
  myDateFin: string;
  myDateDebu: string;
  roleName: string;

  constructor(
    private service: TdEcheancierMvmService,
    private serviceEcheancier: TdEcheancierService,
    public datepipe: DatePipe,
    private serviceAdmin: TDAdminService,
  ) {
    this.myDate = this.datepipe.transform(new Date(), 'MM-yyyy');
    this.myDateDebu = this.datepipe.transform(new Date(), '01-MM-yyyy');
    this.myDateFin = this.datepipe.transform(new Date(), '31-12-2099');
    this.selectedMois = this.myDate;
  }

  ngOnInit(): void {
    // this.allInMvms();
    this.roleName = localStorage.getItem('roleName');
    this.InstanceServices(this.selectedMois);
    this.DistincMonth();
    this.toolbar = ['Search'];
    this.selectionOptions = {checkboxOnly: true, checkboxMode: 'Default',};
    this.groupOptions = {showDropArea: false, showGroupedColumn: false, columns: ['nomPrenom']};

  }

  dataBound(args) {
    for (const cols of this.grid.columns) {
      if ((cols as any).field === 'dateModificateur') {
        (cols as any).type = 'date';
        (cols as any).format = 'dd/MM/yyyy';
      }
    }
  }

  rowDataBound($event: any) {
    console.log($event.data.validation1);
    if ($event.data.validation1 && localStorage.getItem('roleName') === 'VALIDATION1') {
      $event.row.getElementsByClassName('e-gridchkbox')[0].classList.add('cheRemove');
      $event.row.classList.add('niang');
    }
    if ($event.data.validation2 && localStorage.getItem('roleName') === 'VALIDATION2') {
      $event.row.getElementsByClassName('e-gridchkbox')[0].classList.add('cheRemove');
      $event.row.classList.add('niang');
    }
  }

  rowSelected(args: RowSelectEventArgs) {
    let tempTab = [];
    this.grid.getSelectedRecords().filter(select => {
      if (select['validation1'] === false && localStorage.getItem('roleName') === 'VALIDATION1') {
        tempTab.push(select);
      }
      if (select['validation2'] === false && select['validation1'] === true && localStorage.getItem('roleName') === 'VALIDATION2') {
        tempTab.push(select);
      }
    });
    this.tailleSelect = (tempTab).length;
    this.TabSaveEcheancier = (tempTab);
  }

  rowDeSelected(args: RowSelectEventArgs) {
    let tempTab = [];
    this.grid.getSelectedRecords().filter(select => {
      if (select['validation1'] === false && localStorage.getItem('roleName') === 'VALIDATION1') {
        tempTab.push(select);
      }
      if (select['validation2'] === false && select['validation1'] === true && localStorage.getItem('roleName') === 'VALIDATION2') {
        tempTab.push(select);
      }
    });
    this.tailleSelect = (tempTab).length;
    this.TabSaveEcheancier = (tempTab);
  }


  // async saveMvmToEcheancier() {
  //   const soldes = (localStorage.getItem('soldes')).split(',');
  //   for (let i = 0; i < Object.keys(this.TabSaveEcheancier).length; i++) {
  //     Object.assign(this.TabSaveEcheancier[i], {
  //       codePoste: String(this.TabSaveEcheancier[i].codePost),
  //       montantMensuelVar: String(Math.ceil(this.TabSaveEcheancier[i].montant)),
  //       montantCapitalARetenir: '0', montantCumulRetenu: '0',
  //       montantRetenuMois: String(Math.ceil(this.TabSaveEcheancier[i].montant)),
  //       cdEtab: '1', serviceOuInput: '1', actif: '1',
  //       soldeGlobal: soldes[i],
  //     });
  //   }
  //   try {
  //     console.log(this.TabSaveEcheancier);
  //
  //     let jwtHelper = new JwtHelperService();
  //     let objJWT = jwtHelper.decodeToken(localStorage.getItem('token'));
  //     console.log(objJWT.roles);
  //     let res;
  //     const username = localStorage.getItem('username');
  //     if (objJWT.roles.indexOf('VALIDATION1') >= 0 && objJWT.roles.indexOf('VALIDATION2') >= 0) {
  //       alert('vous avez 2 roles validateur1 et validateur2');
  //     } else if (objJWT.roles.indexOf('VALIDATION1') >= 0) {
  //       res = await this.service.updateEcheanciersV1(this.TabSaveEcheancier, username).toPromise();
  //     } else if (objJWT.roles.indexOf('VALIDATION2') >= 0) {
  //       console.log(this.TabSaveEcheancier);
  //       res = await this.serviceEcheancier.updateEcheanciers(this.TabSaveEcheancier, username).toPromise();
  //     }
  //     const tabValid = [];
  //     const tabNonValid = [];
  //     for (const re of res) {
  //       if (re.statusCodeValue != 200) {
  //         tabNonValid.push(re);
  //       } else {
  //         tabValid.push(re);
  //       }
  //     }
  //     this.reloadEtab();
  //     setTimeout(() => {
  //       if (tabNonValid.length != 0) {
  //         this.element.show({
  //           title: 'Erreur !',
  //           content: tabNonValid.length + ' : elements restant de la validation contiennent des ereurs .',
  //           cssClass: 'e-toast-danger'
  //         });
  //       }
  //       if (tabValid.length != 0) {
  //         this.element.show({
  //           title: 'Success !', content: tabValid.length + ' : elements valider ont été mise a jour .', cssClass: 'e-toast-success'
  //         });
  //       }
  //       setTimeout(() => {
  //         this.tailleSelect = 0;
  //       }, 100);
  //     }, 100);
  //
  //   } catch (e) {
  //     console.log(e);
  //   }
  // }
  //
  // async deleteMvmToEcheancier() {
  //   try {
  //     const res = await this.service.deleteAll(this.TabSaveEcheancier).toPromise();
  //     console.log(res);
  //     const tabValid = [];
  //     const tabNonValid = [];
  //     for (const re of res) {
  //       if (re.statusCodeValue != 200) {
  //         tabNonValid.push(re);
  //       } else {
  //         tabValid.push(re);
  //       }
  //     }
  //     console.log(this.selected);
  //     this.reloadEtab();
  //     setTimeout(() => {
  //       this.tailleSelect = 0;
  //       if (tabNonValid.length != 0) {
  //         this.element.show({
  //           title: 'Erreur !',
  //           content: tabNonValid.length + ' : elements restant de la suppression contiennent des ereurs .',
  //           cssClass: 'e-toast-danger'
  //         });
  //       }
  //       console.log(tabNonValid);
  //       if (tabValid.length != 0) {
  //         this.element.show({
  //           title: 'Success !', content: tabValid.length + ' : elements ont été supprimé .', cssClass: 'e-toast-success'
  //         });
  //       }
  //       setTimeout(() => {
  //         this.tailleSelect = 0;
  //       }, 100);
  //     }, 100);
  //   } catch (e) {
  //     console.log(e);
  //   }
  // }

  onCreate(a) {
  }

  public customAggregateFn(sdata: any) {
    sdata.result.filter(sd => {
      let retenue = 0;
      let brut = 0;
      let sEcart = 0;
      let taux = 1;
      let lib = '';
      Object.assign(sd, {etatV2: true});
      sd.items.filter(s => {
        if (Number((s.matDateCp.codePost) > 160 && Number(s.matDateCp.codePost) < 800 && Number(s.matDateCp.codePost) != 170)) {
          sEcart = sEcart + (Number(s.montant) - Number(s.amontant));
        }
        if (Number(s.matDateCp.codePost) === 160) {
          sEcart = sEcart - (Number(s.montant) - Number(s.amontant));
        }
        if ( !s.validation2) {
          sd.etatV2= false;
        }
        sd.aggregates['amontant - text'] = s.anet;
        sd.aggregates['devise - text'] = s.tauxBCM + ' / ' + s.libeleDevise;
        taux = Number(s.tauxBCM);
        lib = s.libeleDevise;
      });
      sd.etatV2 ? sd.aggregates['montant - text'] = sd.aggregates['amontant - text']: sd.aggregates['montant - text'] = sd.aggregates['amontant - text'] - sEcart;
      sd.etatV2 ?
        sd.aggregates['devise - sum'] = (Number(sd.aggregates['amontant - text']) / taux).toFixed() + ' ' + lib :
        sd.aggregates['devise - sum'] = (Number(sd.aggregates['montant - text']) / taux).toFixed() + ' ' + lib;;
      // console.log(sEcart, sd.aggregates['montant - text'], sd.aggregates['amontant - text']);
      // sd.aggregates['devise - sum'] = (Number(sd.aggregates['montant - text']) / taux).toFixed() + ' ' + lib;
    });
    // sdata.result.filter((item: any) => {
    //   let saRetenus = 0;
    //   let saParts = 0;
    //   let snRetenus = 0;
    //   let snParts = 0;
    //   let ancienNet = 0;
    //   let sEcart = 0;
    //   let tauxChancelerie = 0;
    //   let tauxBcm = 0;
    //   let perte = 0;
    //   let brutEtat = 0;
    //   item.items.filter((el) => {
    //     if (Number(el.codePost) >= 800) {
    //       saParts = saParts + Number(el.amontant);
    //       snParts = snParts + Number(el.montant);
    //     }
    //     if (Number(el.codePost) > 160 && Number(el.codePost) < 800) {
    //       saRetenus = saRetenus + Number(el.amontant);
    //       snRetenus = snRetenus + Number(el.montant);
    //       sEcart = sEcart + (Number(el.montant) - Number(el.amontant));
    //     }
    //     if (Number(el.codePost) === 160) {
    //       sEcart = sEcart - (Number(el.montant) - Number(el.amontant));
    //       if ((Number(el.montant) - Number(el.amontant)) < 0) {
    //         brutEtat = -1;
    //       }
    //       if ((Number(el.montant) - Number(el.amontant)) > 0) {
    //         brutEtat = 1;
    //       }
    //
    //     }
    //     ancienNet = el.ancienNet;
    //     tauxChancelerie = el.tauxChancelerie;
    //     tauxBcm = Number(el.TC);
    //     if (Number(el.tauxChancelerie) < 0) {
    //       perte = (-1 * (Number(el.tauxChancelerie)));
    //     }
    //   });
    //   // item.aggregates['amontant - sum'] = item.aggregates['amontant - sum'] - (2*saRetenus) - saParts;
    //   item.aggregates['amontant - sum'] = ancienNet;
    //   item.aggregates['montant - sum'] = ancienNet - sEcart;
    //   // item.aggregates['montant - sum'] = item.aggregates['montant - sum'] - (2*snRetenus) - snParts;
    //   if (sEcart < 0) {
    //     item.aggregates['ecart - sum'] = -1 * sEcart;
    //   }
    //   if (sEcart > 0) {
    //     item.aggregates['ecart - sum'] = sEcart;
    //   }
    //   item.aggregates['devise - sum'] = tauxChancelerie;
    //   item.aggregates['devise - max'] = (Number(ancienNet - sEcart) / tauxBcm).toFixed(0);
    //   item.aggregates['perteGain - sum'] = (item.aggregates['devise - max'] * item.aggregates['devise - sum']).toFixed(0);
    //   item.aggregates['perteGain - max'] = (item.aggregates['montant - sum'] + (item.aggregates['devise - max'] * item.aggregates['devise - sum'])).toFixed(0);
    //
    // });

  }

  selectedMois: any;

  async InstanceServices(date) {
    try {
      const res = await this.service.MvmByMonth(date).toPromise();
      const distinctThings = res.filter(
        (thing, i, arr) => arr.findIndex(t => t.codeService === thing.codeService) === i
      );
      this.resMvm = res;
      this.resMvm.filter(el => {
        Object.assign(el, {etat2: true, etat1: true});
        distinctThings.filter((elf, i) => {
          if (el.codeService === elf.codeService && !el.validation2) {
            elf.etat2 = false;
          }
          if (el.codeService === elf.codeService && !el.validation1) {
            elf.etat1 = false;
          }
        });
      });
      console.log(distinctThings);
      this.tabCodeServices = distinctThings;
    } catch (e) {
      console.log(e);
    }
  }

  changeMonth(selectedMois: any) {
    this.selected = [];
    this.tabMvm = [];
    this.InstanceServices(selectedMois);
  }

  async changeService(selected: any) {
    this.tailleSelect = 0;
    const tabMatricules = [];
    const filterService = this.resMvm.filter(e => {
      if (e.codeService === selected) {
        tabMatricules.push(e.matDateCp.matricule);
        return e;
      }
    });
    const distinctThings = tabMatricules.filter(
      (thing, i, arr) => arr.findIndex(t => t === thing) === i
    );
    try {
      const res = await this.serviceAdmin.jpaGetByMatricule(distinctThings).toPromise();
      this.AdminInMvm(res);
      // this.AdminInEcheancier(res);
    } catch (e) {
      console.log(e);
    }
  }

  async DistincMonth() {
    try {
      const res = await this.service.DistincMonth().toPromise();
      this.getMonthInMvm = res;
    } catch (e) {
      console.log(e);
    }
  }

  async AdminInMvm(data) {
    this.tabMvm = [];
    this.resultatNew = [];
    this.resultat = 0;
    for (const datum of data) {
      if (datum.tmvmEcheanciers.length > 0) {
        let sEcart = 0;
        let TauxBCM = 1;
        const adminInTmvmEcheanciersMonth = datum.tmvmEcheanciers.filter(item => {
          let aretenue = 0;
          let abrut = 0;
          console.log(item.validation2);
          if (item.matDateCp.dateMAJ === this.selectedMois) {
            Object.assign(item, {nomPrenom: datum.nom + ' / ' + datum.prenom, ecart: item.montant - item.amontant});
            if (datum.tDonneeEcheanciers.length) {
              datum.tDonneeEcheanciers.filter(row => {
                if (Number(row.matriculeCodePoste.codePoste) === 160) {
                  abrut = Number(row.montantRetenuMois);
                }
                if (Number(row.matriculeCodePoste.codePoste) > 160 && Number(row.matriculeCodePoste.codePoste) < 800 && Number(row.matriculeCodePoste.codePoste)  != 170) {
                  aretenue = aretenue + Number(row.montantRetenuMois);
                }
              });
              this.resultat = abrut - aretenue;
              Object.assign(item, {anet: this.resultat});
            } else {
              this.resultat = 0;
              Object.assign(item, {anet: 0});
            }
            if (datum.t_tauxes.length > 0) {
              const tTauxes = datum.t_tauxes.find(x =>
                this.datepipe.transform(x['dateModification'], 'MM-yyyy') === this.datepipe.transform(new Date(), 'MM-yyyy') &&
                datum.cnssNum === x['nomDevise']);
              TauxBCM = tTauxes.tauxBCM;
              Object.assign(item, {libeleDevise: tTauxes.libeleDevise, nomDevise: tTauxes.nomDevise, tauxBCM: tTauxes.tauxBCM});
            }
            if (Number(item.matDateCp.codePost) === 160) {
              sEcart = sEcart - (Number(item.montant) - Number(item.amontant));
            }
            if (Number((item.matDateCp.codePost) > 160 && Number(item.matDateCp.codePost) < 800 && Number(item.matDateCp.codePost) != 170)) {
              sEcart = sEcart + (Number(item.montant) - Number(item.amontant));
            }

            this.tabMvm.push(item);
            return item;
          }
        });
        // if (sEcart<0){
        //   sEcart = -sEcart
        //   console.log(this.resultat ,sEcart ,TauxBCM)
        // }
        this.resultatNew.push({
          matricule: datum.matricule,
          nnet: this.resultat - sEcart,
          tauxBCM: TauxBCM,
          soldeGlobal: Number((this.resultat - sEcart) / TauxBCM).toFixed(0)
        });
      }
    }
    console.log(this.tabMvm);
    console.log(this.resultatNew);
  }

  async validationMvm() {
    if (localStorage.getItem('roleName') === 'VALIDATION1') {
      for (let i = 0; i < Object.keys(this.TabSaveEcheancier).length; i++) {
        this.TabSaveEcheancier[i].dateValidateur1 = new Date();
        this.TabSaveEcheancier[i].validation1 = true;
        this.TabSaveEcheancier[i].validateur1 = localStorage.getItem('roleName');
      }
      try {
        const res = await this.service.jpaSaves(this.TabSaveEcheancier).toPromise();
        console.log(res);
        this.tailleSelect = 0;
        this.InstanceServices(this.selectedMois);
        this.changeService(this.selected);
      } catch (e) {
        console.log(e);
      }
    }
    if (localStorage.getItem('roleName') === 'VALIDATION2') {
      const tabSave = [];
      let sEcart = 0;
      for (let i = 0; i < Object.keys(this.TabSaveEcheancier).length; i++) {
        this.TabSaveEcheancier[i].dateValidateur2 = new Date();
        this.TabSaveEcheancier[i].validation2 = true;
        this.TabSaveEcheancier[i].validateur2 = localStorage.getItem('roleName');
        for (let j = 0; j < Object.keys(this.resultatNew).length; j++) {
          if (this.resultatNew[j].matricule === this.TabSaveEcheancier[i].matDateCp.matricule) {
            tabSave.push({
              soldeGlobal: this.resultatNew[j].soldeGlobal,
              dateMvm: this.myDateDebu,
              dateFin: this.myDateFin,
              matriculeCodePoste: {
                matricule: String(this.TabSaveEcheancier[i].matDateCp.matricule),
                codePoste: String(this.TabSaveEcheancier[i].matDateCp.codePost)
              },
              montantMensuelVar: String((this.TabSaveEcheancier[i].montant).toFixed(0)),
              montantCapitalARetenir: '0', montantCumulRetenu: '0',
              montantRetenuMois: String((this.TabSaveEcheancier[i].montant).toFixed(0)),
              cdEtab: '1', serviceOuInput: '1', actif: '1', numEcrit: String(this.TabSaveEcheancier[i].matDateCp.matricule)
            });

          }
        }
      }
      try {
        const res = await this.serviceEcheancier.jpaSaves(tabSave).toPromise();
        console.log(tabSave);
        if (res) {
          try {
            const res = await this.service.jpaSaves(this.TabSaveEcheancier).toPromise();
            console.log(res);
            this.tailleSelect = 0;
            this.InstanceServices(this.selectedMois);
            this.changeService(this.selected);
          } catch (e) {
            console.log(e);
          }
        }
      } catch (e) {
        console.log(e);
      }
    }

  }

  async deleteInMvm() {
    console.log(this.TabSaveEcheancier);
    try {
      const res = await this.service.jpaDeletes(this.TabSaveEcheancier).toPromise();
      console.log(res);
      this.InstanceServices(this.selectedMois);
      this.changeService(this.selected);
    } catch (e) {
      console.log(e);
    }
  }
}
