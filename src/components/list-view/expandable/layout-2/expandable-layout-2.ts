import { Component, Input, ViewChild } from '@angular/core';
import { IonicPage, Content, FabButton } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'expandable-layout-2',
  templateUrl: 'expandable.html'
})
export class ExpandableLayout2 {
  @Input() data: any;
  @Input() events: any;
  @ViewChild(Content)
  content: Content;
  @ViewChild(FabButton)
  fabButton: FabButton;

  constructor() {

    this.data = {
        "items":[
           {
              "id":1,
              "title":"Product 1",
              "backgroundImage":"assets/images/background/22.jpg",
              "button":"BUY",
              "items":[
                 "PAY WITH PAYPAL",
                 "PAY WITH VISA CARD",
                 "PAY WITH MAESTRO CARD"
              ]
           },
           {
              "id":2,
              "title":"Product 2",
              "backgroundImage":"assets/images/background/23.jpg",
              "button":"BUY",
              "items":[
                 "PAY WITH PAYPAL",
                 "PAY WITH VISA CARD",
                 "PAY WITH MAESTRO CARD"
              ]
           },
           {
              "id":3,
              "title":"Product 3",
              "backgroundImage":"assets/images/background/24.jpg",
              "button":"BUY",
              "items":[
                 "PAY WITH PAYPAL",
                 "PAY WITH VISA CARD",
                 "PAY WITH MAESTRO CARD"
              ]
           },
           {
              "id":4,
              "title":"Product 4",
              "backgroundImage":"assets/images/background/25.jpg",
              "button":"BUY",
              "items":[
                 "PAY WITH PAYPAL",
                 "PAY WITH VISA CARD",
                 "PAY WITH MAESTRO CARD"
              ]
           },
           {
              "id":5,
              "title":"Product 5",
              "backgroundImage":"assets/images/background/26.jpg",
              "button":"BUY",
              "items":[
                 "PAY WITH PAYPAL",
                 "PAY WITH VISA CARD",
                 "PAY WITH MAESTRO CARD"
              ]
           },
           {
              "id":6,
              "title":"Product 5",
              "backgroundImage":"assets/images/background/27.jpg",
              "button":"BUY",
              "items":[
                 "PAY WITH PAYPAL",
                 "PAY WITH VISA CARD",
                 "PAY WITH MAESTRO CARD"
              ]
           },
           {
              "id":7,
              "title":"Product 5",
              "backgroundImage":"assets/images/background/28.jpg",
              "button":"BUY",
              "items":[
                 "PAY WITH PAYPAL",
                 "PAY WITH VISA CARD",
                 "PAY WITH MAESTRO CARD"
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
