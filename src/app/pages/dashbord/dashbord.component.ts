import {Component, OnInit, ViewChild} from '@angular/core';
import {
  AccumulationChart,
  AccumulationChartComponent,
  AccumulationTheme,
  IAccLoadedEventArgs,
  LegendSettingsModel,
  TooltipSettingsModel
} from '@syncfusion/ej2-angular-charts';
import {EstimationService} from '../../services/endpoints/estimation.service';
import {ToastAnimationSettingsModel, ToastPositionModel} from '@syncfusion/ej2-angular-notifications';
import {GroupSettingsModel} from '@syncfusion/ej2-angular-grids';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-dashbord',
  templateUrl: './dashbord.component.html',
  styleUrls: ['./dashbord.component.sass']
})
export class DashbordComponent implements OnInit {
  @ViewChild('pie')
  public pie: AccumulationChartComponent | AccumulationChart;
  @ViewChild('pie2')
  public pie2: AccumulationChartComponent | AccumulationChart;
  btndashUsers = false;
  dashUsers: any;
  pSaisie: number;
  pEdition: number;
  pConsultation: number;
  pSuper: number;
  pAdmin: number;
  allCamp: any;
  allData = [];
  allDataGraph = [];
  public groupOptions: GroupSettingsModel;

  @ViewChild('element') element;
  public position: ToastPositionModel = {X: 'Right', Y: 'Bottom'};
  public toasts;
  public animation: ToastAnimationSettingsModel = {
    show: {effect: 'SlideRightIn', duration: 600, easing: 'linear'},
    hide: {effect: 'FadeOut', duration: 100, easing: 'linear'}
  };
  responseCamp: any;

  constructor(
    private estimationService: EstimationService,
  ) {
  }

  public dataA = [];
  public dataS = [];
  roles;
  public enableAnimation: boolean = true;
  public enableSmartLabels: boolean = true;
  public radius: string = 'r';
  //Initializing Legend
  public legendSettingsV: LegendSettingsModel = {
    visible: true,
    position: 'Bottom',
    reverse: true,

  };
  //Initializing Legend
  public legendSettingsN: LegendSettingsModel = {
    visible: true,
    position: 'Bottom',
    reverse: true
  };

  //Initializing DataLabel
  public dataLabelV: Object = {
    visible: true,
    name: 'x',
    position: 'Outside',
    font: {
      fontWeight: '600',
      color: '#000000'
    }
  };
  //Initializing DataLabel
  public dataLabelN: Object = {
    visible: true,
    name: 'x',
    position: 'Outside',
    font: {
      fontWeight: '600',
      color: '#000000'
    }
  };

  public loadValider(args: IAccLoadedEventArgs): void {
    let selectedTheme: string = location.hash.split('/')[1];
    selectedTheme = selectedTheme ? selectedTheme : 'Bootstrap5';
    args.accumulation.theme = <AccumulationTheme> (selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1)).replace(/-dark/i, 'Dark');
  };

  public loadNonValider(args: IAccLoadedEventArgs): void {
    let selectedTheme: string = location.hash.split('/')[1];
    selectedTheme = selectedTheme ? selectedTheme : 'Material';
    args.accumulation.theme = <AccumulationTheme> (selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1)).replace(/-dark/i, 'Dark');
  };

  // custom code end
  public startAngleV: number = 0;
  public endAngleV: number = 360;
  public tooltipV: TooltipSettingsModel = {enable: true};
  public titleV: string = 'subvention en engrais';
  // custom code end
  public startAngleNv: number = 0;
  public endAngleNv: number = 360;
  public tooltipNv: TooltipSettingsModel = {enable: true};
  public titleNv: string = 'subvention en herbicides';

  ngOnInit(): void {
    this.getEstimations();
    this.groupOptions = {showDropArea: false, showGroupedColumn: false, columns: ['code']};

  }


  async getEstimations() {
    this.estimationService.estimations().pipe(map(data => {
      const d = [];
      (data as Array<any>).forEach(el => {
        console.log(el);
        el.agriculturalInputs.forEach(e => {
          e['agId'] = e['id'];
          delete e['id'];
          d.push({...e, ...el, ...{intrantTotal: (e.campaignUnitCost ? e.campaignUnitCost : e.unitCost) * e.quantity}});
          this.allDataGraph.push({...{x: e.name, y: Number(e.quantity), text: ' ' + e.unit + '', type: e.unit}});
        });
      });
      return d;
    }))
      .subscribe({
        next: (value) => {
          this.allCamp = value;
          for (const allDataGraphElement of this.allDataGraph) {
            if (allDataGraphElement.type === 'KG') {
              this.tooltipV = {format: '${point.x} : <b>${point.y} Kg</b>'}
              this.dataA = [...this.dataA, allDataGraphElement];

            } else {
              this.tooltipNv = {format: '${point.x} : <b>${point.y} L</b>'}
              this.dataS = [...this.dataS, allDataGraphElement];
            }
          }
        },
        error: (e) => {
          console.log(e);
          this.element.show({
            title: 'Erreur trouvée   !', content: e.error.error, cssClass: 'e-toast-danger'
          });
        }
      });

  }

  onCreate(a) {
  }


}
