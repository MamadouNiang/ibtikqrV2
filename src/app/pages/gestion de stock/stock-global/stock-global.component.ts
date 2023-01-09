import {Component, OnInit, ViewChild} from '@angular/core';
import {StockService} from '../../../services/endpoints/stock.service';
import {AggregateRowModel, DetailRowService,
  ExcelExportProperties,
  ExcelExportService, GridComponent, GroupService, GroupSettingsModel, PdfExportService, ToolbarService} from '@syncfusion/ej2-angular-grids';
import {IntrantService} from '../../../services/endpoints/intrant.service';

@Component({
  selector: 'app-stock-global',
  templateUrl: './stock-global.component.html',
  styleUrls: ['./stock-global.component.css'],
  providers: [DetailRowService,ToolbarService, ExcelExportService, PdfExportService, GroupService]
})
export class StockGlobalComponent implements OnInit {
  @ViewChild('grid') public grid: GridComponent;

  public dataCampagne = [];
  public groupOptions: GroupSettingsModel;
  public data: any[];


  constructor(private intrantService: IntrantService, private stockService: StockService) {
  }

  ngOnInit(): void {
    this.getStock();
    this.toolbar = ['ExcelExport'];
    this.aggregates = [{
      columns: [{
        type: 'Sum',
        field: 'quantityConso',
        format: 'N2',
        footerTemplate: '${Sum}'
      },{
        type: 'Sum',
        field: 'montantConso',
        format: 'N2',
        footerTemplate : '${Sum}'
      },{
        type: 'Sum',
        field: 'montantConso',
        format: 'N2',
        footerTemplate : '${Sum}'
      }]
    }];
    this.groupOptions = {showDropArea: false, columns: ['campagne', 'regionName', 'farmerFirstName']};

  }

  getStock(): void {
    this.stockService.getStock().subscribe({
      next: (value) => {

        value.filter((e) => {
          // chercher la campagne et la region et les ajouter en tant qu'object pour faire un groupBy
          console.log(Object.keys(e.statisticalSheetsByRegion).length);
          for (let i = 0; i < Object.keys(e.statisticalSheetsByRegion).length; i++) {
            e.statisticalSheetsByRegion[Object.keys(e.statisticalSheetsByRegion)[i]].filter((el) => {
              Object.assign(el, {campagne: el.campaign.code}, {regionName: el.region.name});
              this.dataCampagne.push(el);
            });
          }
        });

        let tempData = [];
        this.dataCampagne.filter(e => {
          e['agriculturalInputs'].filter(el => {
            e['estimationCostQuantities'].filter(el2 => {
              if (el.id === el2.agriculturalInputId) {
                //Object.assign(e, {intrantName: el.name, quantityConso: el2.quantity});
                tempData.push({...e,
                  ...{intrantName: el.name, quantityConso: el2.quantity, unit: el.unit,
                    unitCost:el.unitCost,montantConso:(el2.quantity)*(el.unitCost)}});
              }
            });
          });
        });

        this.data = tempData;
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  public initial = true;
  dataBound() {
    if (this.initial === true) {
      this.grid.groupModule.collapseAll();
      this.initial = false;
    }
  }
  public toolbar: string[];
  public aggregates: AggregateRowModel[] ;
  excelQueryCellInfo(args) {
    args.style = {borders: { color: '#9c4b4b' }, fontColor: '#9c4b4b' };
  }
  toolbarClick(args: any): void {
    switch (args.item.text) {
      case 'Excel Export':
        if (args.item.id === 'Grid_excelexport') { // 'Grid_excelexport' -> Grid component id + _ + toolbar item name
          this.grid.excelExport();
        }
        this.grid.excelExport();
        break;
    }
  }
}
