import { Component, Input, ViewChild } from '@angular/core';
import { IonicPage, Content, FabButton } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'expandable-layout-3',
  templateUrl: 'expandable.html'
})
export class ExpandableLayout3 {
  @Input() data: any;
  @Input() events: any;
  @ViewChild(Content)
  content: Content;
  @ViewChild(FabButton)
  fabButton: FabButton;

  constructor() {

    this.data = {
      "title":"New York",
      "headerImage":"assets/images/background-small/7.jpg",
      "items":[
         {
            "title":"Where to go",
            "icon":"icon-map-marker-radius",
            "items":[
               "Monuments",
               "Sightseeing",
               "Historical",
               "Sport"
            ]
         },
         {
            "title":"Where to sleep",
            "icon":"icon-hotel",
            "items":[
               "Hotels",
               "Hostels",
               "Motels",
               "Rooms"
            ]
         },
         {
            "title":"Where to eat",
            "icon":"icon-silverware-variant",
            "items":[
               "Fast Food",
               "Restorants",
               "Pubs",
               "Hotels"
            ]
         },
         {
            "title":"Where to drink",
            "icon":"icon-martini",
            "items":[
               "Caffes",
               "Bars",
               "Pubs",
               "Clubs"
            ]
         },
         {
            "title":"Where to go",
            "icon":"icon-map-marker-radius",
            "items":[
               "Monuments",
               "Sightseeing",
               "Historical",
               "Sport"
            ]
         }
      ]
    }
   }

  onEvent(event: string, item: any, e: any) {
    if (e) {
      e.stopPropagation();
    }
    if (this.events[event]) {
      this.events[event](item);
    }
  }

  toggleGroup(group: any) {
    group.show = !group.show;
  }

  isGroupShown(group: any) {
    return group.show;
  }

  ngAfterViewInit() {
    this.content.ionScroll.subscribe((d) => {
      this.fabButton.setElementClass("fab-button-out", d.directionY == "down");
    });
  }
}
