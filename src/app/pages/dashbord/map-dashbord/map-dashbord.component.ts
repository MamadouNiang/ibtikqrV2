import {Component, OnInit, ViewChild} from '@angular/core';
import * as L from 'leaflet';
import {rim_map} from './rim_map';
import {StatisticalSheetsService} from '../../../services/endpoints/statistical-sheets.service';
import {ToastAnimationSettingsModel, ToastPositionModel} from '@syncfusion/ej2-angular-notifications';
import {GridComponent} from '@syncfusion/ej2-angular-grids';

@Component({
  selector: 'app-map-dashbord',
  templateUrl: './map-dashbord.component.html',
  styleUrls: ['./map-dashbord.component.css']
})
export class MapDashbordComponent implements OnInit {
  @ViewChild('grid') public grid: GridComponent;

  map;

  @ViewChild('element') element;
  public position: ToastPositionModel = {X: 'Right', Y: 'Bottom'};
  public toasts;
  public animation: ToastAnimationSettingsModel = {
    show: {effect: 'SlideRightIn', duration: 600, easing: 'linear'},
    hide: {effect: 'FadeOut', duration: 100, easing: 'linear'}
  };
  dateStaticalSheetByRegion: any[];
  toolbar: string[];

  constructor(
    private sheetsService: StatisticalSheetsService,

  ) {
  }


  ngOnInit(): void {
    this.toolbar = ['Search'];

    this.createMap();
  }

  createMap() {
    const region = (JSON.parse(localStorage.getItem('regions')).filter((e, id) => e.name === localStorage.getItem('region')));

    console.log(region[0].id);
    console.log(region[0]);
    const mauritanieRef = {
      lat: 20.811029,
      lng: -11.022937,
    };

    const zoomLevel = 6;

    this.map = L.map('map', {
      center: [mauritanieRef.lat, mauritanieRef.lng],
      zoom: zoomLevel
    }).setView([mauritanieRef.lat, mauritanieRef.lng], zoomLevel);
    const mainLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    });

    //L.geoJSON(rim_map).addTo(this.map);
    mainLayer.addTo(this.map);

    const rim_mapChild = {
      features: rim_map['features'].filter((e) => e.properties.name === localStorage.getItem('region')),
    };

    L.geoJSON(rim_mapChild).addTo(this.map);

    this.getStaticalSheetByRegion();
  }

  getStaticalSheetByRegion(){
    const region = (JSON.parse(localStorage.getItem('regions')).filter((e, id) => e.name === localStorage.getItem('region')));

    this.sheetsService.getstatisticalBRegion(region[0].id).subscribe((value)=>{
      console.log(value);
      if (value.length === 0){
        this.dateStaticalSheetByRegion = [];
        this.element.show({
          title: 'Avertissement  !', content: 'Aucune entrée trouvé !', cssClass: 'e-toast-warning'
        });

      }else {
        this.dateStaticalSheetByRegion = value;
        var myIcon = L.icon({
          iconUrl: '../assets/img/position.png',
          iconSize: [10, 30],
          iconAnchor: [22, 94],
          popupAnchor: [-3, -76],
        });
        value.forEach(e=>{
          L.marker([e.latitude,e.longitude], {icon: myIcon}).addTo(this.map);
          this.map.zoom = 12;
        })
      }
    },(error)=>{
      console.log(error);
    })
  }

  onCreate(a) {

  }
}
