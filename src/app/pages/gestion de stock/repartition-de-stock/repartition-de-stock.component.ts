import {Component, OnInit, ViewChild} from '@angular/core';
import {EstimationService} from '../../../services/endpoints/estimation.service';
import {ToastAnimationSettingsModel, ToastPositionModel} from '@syncfusion/ej2-angular-notifications';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {GridComponent, QueryCellInfoEventArgs, RowSelectEventArgs, SelectionService} from '@syncfusion/ej2-angular-grids';
import {StockService} from '../../../services/endpoints/stock.service';
import { Tooltip } from '@syncfusion/ej2-popups';
import { DataManager, Query } from '@syncfusion/ej2-data';

@Component({
  selector: 'app-repartition-de-stock',
  templateUrl: './repartition-de-stock.component.html',
  styleUrls: ['./repartition-de-stock.component.css'],
  providers: [SelectionService]
})
export class RepartitionDeStockComponent implements OnInit {
  public groupSettings: { [x: string]: Object } = {showDropArea: true, columns: ['campaign']};

  @ViewChild('grid') public grid: GridComponent;

  public data: Object[];
  public key: string = null;
  public keyChild: string = null;

  @ViewChild('mastergrid') public mastergrid: GridComponent;

  @ViewChild('detailgrid') public detailgrid: GridComponent;

  @ViewChild('detailgridChild') public detailgridChild: GridComponent;


  regions: string;
  region: any;
  campagnes: any;
  selectedRegion: any;

  @ViewChild('element') element;
  public position: ToastPositionModel = {X: 'Right', Y: 'Bottom'};
  public toasts;
  public animation: ToastAnimationSettingsModel = {
    show: {effect: 'SlideRightIn', duration: 600, easing: 'linear'},
    hide: {effect: 'FadeOut', duration: 100, easing: 'linear'}
  };

  validerFormCampagne: FormGroup;
  validerFormregion: FormGroup;
  dataSource: Object[];

  selectedCampagne: any;
  dataSourceChild: any;
  keyIntrant: { id: any; name: any; };

  constructor(private estimationService: EstimationService, private fb: FormBuilder, private stockService: StockService,
  ) {
  }

  ngOnInit(): void {
    this.getRegions();
    this.getAllCampagnes();
    this.campagnesForm();
  }

  onCreate(a) {
  }

  campagnesForm() {
    this.validerFormCampagne = this.fb.group({
      idCampaign: ['', Validators.required],
    });
  }

  regionsForm() {
    this.validerFormregion = this.fb.group({
      idRegion: [this.region.id, Validators.required],
    });
  }

  getRegions() {
    this.regions = (JSON.parse(localStorage.getItem('regions')));
    const reg = (JSON.parse(localStorage.getItem('regions')).filter((e, id) => e.name === localStorage.getItem('region')));
    this.region = reg[0];
    this.regionsForm();
    console.log(this.region.id);
    this.checkRegionStaticalSheet(this.region.id);
  }

  async getAllCampagnes() {
    try {
      const resp = await this.estimationService.estimations().toPromise();
      this.campagnes = resp;

    } catch (e) {
      console.log(e);
      this.element.show({
        title: 'Erreur trouvée   !', content: e.error.error, cssClass: 'e-toast-danger'
      });
    }
  }

  checkRegionAndCamp() {

  }

  checkRegionStaticalSheet(idRegion: any) {
    this.stockService.getStockByRegionId(idRegion).subscribe({
      next: (value) => {
        let s  = 0;
        value.filter(e=>{
          s = s + e.campaign.totalCost;
          Object.assign(e, {totalCamp: s})
        })
        console.log(value);

        this.data = value;
      },
      error: (error) => {
        console.log(error);
      }
    });
  }
  tooltip(args: QueryCellInfoEventArgs) {
    if (typeof (args.data['campaign'][args.column.field])==='string'){
      const tooltip: Tooltip = new Tooltip({
        content:args.data['campaign'][args.column.field].toString()
      }, args.cell as HTMLTableCellElement);
    }

  }


  public onRowSelected(args: RowSelectEventArgs): void {
    const queryData: any =  args.data['campaign'];
    this.key = queryData.code;
    queryData.agriculturalInputs.filter(e=>{
      Object.assign(e,{totalCost:e.quantity*e.unitCost})
    })
    const dataSource: object[] = queryData.agriculturalInputs;
    this.detailgrid.dataSource = dataSource;
  }

  changeReion(){
    this.checkRegionStaticalSheet(Number(this.validerFormregion.get('idRegion').value));

  }

  public onRowSelectedChild(args: RowSelectEventArgs): void {
    this.keyIntrant = {id:args.data['id'],name:args.data['name']};
    const dataFilterCamp = this.data.filter((e)=> e['campaign'].code === this.key);
    const dataFilterAgrInput = (dataFilterCamp[0]['statisticalSheetsByRegion'][this.validerFormregion.get('idRegion').value]);
    const maVar = [];
    let s = 0;

    dataFilterAgrInput.filter((e)=>{
      e.agriculturalInputs.filter((i)=>{
        if (i.name===args.data[ 'name']){
          e.estimationCostQuantities.filter(ei=>{
            if (ei.agriculturalInputId===args.data['id']){
              s = s + ei.quantity
              Object.assign(this.keyIntrant,{consoQuantityByIntrant:s},{prixTot:i.unitCost*s})
            }
          });
          maVar.push(e);
        }
      })
    })
    this.detailgridChild.dataSource = maVar;
    console.log(this.detailgridChild.dataSource);
    console.log(this.keyIntrant);
    // .validerFormregion.get('idRegion').value;
    // const id = this.validerFormregion.get('idRegion').value;
    // const row  = args.data;
    // console.log();
    // this.detailgridChild.dataSource = row['statisticalSheetsByRegion'][id];
  }
}
