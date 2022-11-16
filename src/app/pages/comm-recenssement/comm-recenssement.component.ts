import {Component, OnInit, ViewChild} from '@angular/core';
import {CommRecrutementModel} from '../../models/comm-recrutement.model';
import {EcheancierService} from '../../services/config/ImportEcheancier.service';
import {GridComponent} from '@syncfusion/ej2-angular-grids';
import {ToastAnimationSettingsModel, ToastPositionModel} from '@syncfusion/ej2-angular-notifications';
import {HttpClient} from '@angular/common/http';
import {CommRecenssementService} from '../../services/endpoints/comm-recenssement.service';
import {IntrantService} from '../../services/endpoints/intrant.service';

@Component({
  selector: 'app-comm-recreutement',
  templateUrl: './comm-recenssement.component.html',
  styleUrls: ['./comm-recessement.component.css']
})
export class CommRecenssementComponent implements OnInit {
  tabFin: CommRecrutementModel[];
  erreurCanevas: boolean;
  matNoMatch: any;
  resAdmin: any;
  importEcheancier: CommRecrutementModel[];
  a = 0;
  @ViewChild('grid')
  public grid: GridComponent;

  @ViewChild('element') element;
  public position: ToastPositionModel = {X: 'Right', Y: 'Bottom'};
  public toasts;
  public animation: ToastAnimationSettingsModel = {
    show: {effect: 'SlideRightIn', duration: 600, easing: 'linear'},
    hide: {effect: 'FadeOut', duration: 100, easing: 'linear'}
  };
  fiches: any;
  importData: any[];
  intrantsHeader: string[];
  intrantsData: any;
  dataFile: any;

  constructor(
    private httpClient: HttpClient,
    private recenssementService: CommRecenssementService,
    private excelSrv: EcheancierService,
    private intrantService: IntrantService,

  ) {
  }

  ngOnInit(): void {
    console.log(this.tabFin);
    //this.statisticalSheets();
    this.intrants();

  }

  onCreate(a) {
  }
  async intrants() {
    try {
      const resp = await this.intrantService.intrants().toPromise();
      this.intrantsData = resp;
    } catch (e) {
      console.log(e);
      this.element.show({
        title: 'Erreur trouvée   !', content: e.error.error, cssClass: 'e-toast-danger'
      });
    }
  }
  async statisticalSheets() {
    try {
      const resp = await this.recenssementService.getFicheStatistiques().toPromise();
      this.fiches = resp;
      console.log(resp);

    } catch (e) {
      console.log(e);
      this.element.show({
        title: 'Erreur trouvée   !', content: e.error.error, cssClass: 'e-toast-danger'
      });
    }
  }

  importCsv(e) {
    const target: DataTransfer = <DataTransfer> (e.target);
    if (target.files.length !== 1) {
      throw new Error('Cannot use multiple files');
    }
    if (target.files.length > 0){
      this.dataFile = e;
    }
    const reader: FileReader = new FileReader();
    reader.onload = async (e: any) => {
      const bstr: string = e.target.result;
      let data = <any[]> this.excelSrv.importFromFile(bstr);
      const header: string[] =  data[0];
      this.intrantsHeader = data[0].slice(6);
      console.log(this.intrantsHeader,this.intrantsData.length);
      if (this.intrantsHeader.length!=this.intrantsData.length){
        this.element.show({
          title: 'Erreur trouvée de Canvas !', content:"Veillez telecharger le canvas", cssClass: 'e-toast-warning'
        });
      }else {
        const importedData = data.slice(1);
        this.importData = await Promise.all(importedData.map(async (item): Promise<any> => {
          const obj = {};
          for (let i = 0; i < header.length; i++) {
            const k = header[i];
            obj[k] = item[i];
          }
          return obj;
        }));
        ///this.file =faire le file pour l envoi
      }
    };
    reader.readAsBinaryString(target.files[0]);
  }

  async exportCanvas() {
    try {
      const res = await this.recenssementService.exportCanvas().subscribe(data => {
        this.downloadFile(data);
      });
    } catch (e) {
      console.log(e);
    }
  }

  downloadFile(data: Blob) {
    const contentType = 'application/vnd.ms-excel';
    const blob = new Blob([data], {type: contentType});
    const url = window.URL.createObjectURL(blob);
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.href = url;
    a.download = 'canvas.xlsx';
    a.click();
    window.URL.revokeObjectURL(url);
  }

  validerImp() {
    console.log(this.dataFile.target.files);
    const e = this.dataFile;
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('regionId', "1");
      formData.append('campaignId', "2");
      this.recenssementService.importIntrant(formData).subscribe(
        (res) => {
          console.log(res)
          this.element.show({
            title: 'Succés   !', content:"Importation reussi", cssClass: 'e-toast-success'
          });
          this.importData = null;
        },
        (err) => {
          this.element.show({
            title: 'Erreur trouvée  !', content:"Veillez recommencer", cssClass: 'e-toast-warning'
          });
          console.log(err)
        }
      );
      console.log(formData);
    }
  }
}
