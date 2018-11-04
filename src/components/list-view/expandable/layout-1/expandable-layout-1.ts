import { Component, Input, ViewChild } from '@angular/core';
import { IonicPage, Content, FabButton } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'expandable-layout-1',
  templateUrl: 'expandable.html'
})
export class ExpandableLayout1 {
  @Input() data: any;
  @Input() events: any;
  @ViewChild(Content)
  content: Content;
  @ViewChild(FabButton)
  fabButton: FabButton;
  buttons;

  constructor() { 

    this.buttons =  [
      {icon: 'mail', title: 'Mail', color: 'dark', handler: ()=> {console.log('close me')}},
      {icon: 'alarm', title: 'Alarm', color: 'dark', handler: ()=> {console.log('close me')}},
      {icon: 'laptop', title: 'Laptop', color: 'dark', handler: ()=> {console.log('dont close me'); return false}}
    ]
    this.data = 
    {
      "items":[
        {
           "id":1,
           "title":"Tanken",
           "description":"SINGER",
           "image":"assets/images/avatar/15.jpg",
           "iconLike":"icon-thumb-up",
           "iconFavorite":"icon-heart",
           "iconShare":"icon-share-variant",
           "items":[
              {
                 "id":1,
                 "title":"AlbumName",
                 "description":"Universal, 2016",
                 "image":"assets/images/avatar/10.jpg",
                 "iconPlay":"icon-play-circle-outline"
              },
              {
                 "id":2,
                 "title":"AlbumName",
                 "description":"Universal, 2016",
                 "image":"assets/images/avatar/11.jpg",
                 "iconPlay":"icon-play-circle-outline"
              },
              {
                 "id":3,
                 "title":"AlbumName",
                 "description":"Universal, 2016",
                 "image":"assets/images/avatar/12.jpg",
                 "iconPlay":"icon-play-circle-outline"
              },
              {
                 "id":4,
                 "title":"AlbumName",
                 "description":"Universal, 2016",
                 "image":"assets/images/avatar/13.jpg",
                 "iconPlay":"icon-play-circle-outline"
              }
           ]
        },
        {
           "id":2,
           "title":"Ölstand",
           "description":"BASSO",
           "image":"assets/images/avatar/2.jpg",
           "iconLike":"icon-thumb-up",
           "iconFavorite":"icon-heart",
           "iconShare":"icon-share-variant",
           "items":[
              {
                 "id":1,
                 "title":"AlbumName1",
                 "description":"Universal, 2016",
                 "image":"assets/images/avatar/14.jpg",
                 "iconPlay":"icon-play-circle-outline"
              },
              {
                 "id":2,
                 "title":"AlbumName2",
                 "description":"Universal, 2016",
                 "image":"assets/images/avatar/15.jpg",
                 "iconPlay":"icon-play-circle-outline"
              },
              {
                 "id":3,
                 "title":"AlbumName3",
                 "description":"Universal, 2016",
                 "image":"assets/images/avatar/14.jpg",
                 "iconPlay":"icon-play-circle-outline"
              },
              {
                 "id":4,
                 "title":"AlbumName4",
                 "description":"Universal, 2016",
                 "image":"assets/images/avatar/13.jpg",
                 "iconPlay":"icon-play-circle-outline"
              },
              {
                 "id":5,
                 "title":"AlbumName5",
                 "description":"Universal, 2016",
                 "image":"assets/images/avatar/12.jpg",
                 "iconPlay":"icon-play-circle-outline"
              },
              {
                 "id":6,
                 "title":"AlbumName6",
                 "description":"Universal, 2016",
                 "image":"assets/images/avatar/11.jpg",
                 "iconPlay":"icon-play-circle-outline"
              }
           ]
        },
        {
           "id":3,
           "title":"Inspektion",
           "description":"Zklische Inspaktion",
           "image":"assets/images/avatar/3.jpg",
           "iconLike":"icon-thumb-up",
           "iconFavorite":"icon-heart",
           "iconShare":"icon-share-variant",
           "items":[
              {
                 "id":1,
                 "title":"AlbumName1",
                 "description":"Universal, 2016",
                 "image":"assets/images/avatar/11.jpg",
                 "iconPlay":"icon-play-circle-outline"
              },
              {
                 "id":2,
                 "title":"AlbumName2",
                 "description":"Universal, 2016",
                 "image":"assets/images/avatar/12.jpg",
                 "iconPlay":"icon-play-circle-outline"
              },
              {
                 "id":3,
                 "title":"AlbumName3",
                 "description":"Universal, 2016",
                 "image":"assets/images/avatar/13.jpg",
                 "iconPlay":"icon-play-circle-outline"
              },
              {
                 "id":4,
                 "title":"AlbumName4",
                 "description":"Universal, 2016",
                 "image":"assets/images/avatar/14.jpg",
                 "iconPlay":"icon-play-circle-outline"
              },
              {
                 "id":5,
                 "title":"AlbumName5",
                 "description":"Universal, 2016",
                 "image":"assets/images/avatar/15.jpg",
                 "iconPlay":"icon-play-circle-outline"
              }
           ]
        },
        {
           "id":4,
           "title":"Reinigung",
           "description":"Autowäsche inkl Lackschutz",
           "image":"assets/images/avatar/4.jpg",
           "iconLike":"icon-thumb-up",
           "iconFavorite":"icon-heart",
           "iconShare":"icon-share-variant",
           "items":[
              {
                 "id":1,
                 "title":"AlbumName1",
                 "description":"Universal, 2016",
                 "image":"assets/images/avatar/0.jpg",
                 "iconPlay":"icon-play-circle-outline"
              },
              {
                 "id":2,
                 "title":"AlbumName2",
                 "description":"Universal, 2016",
                 "image":"assets/images/avatar/1.jpg",
                 "iconPlay":"icon-play-circle-outline"
              },
              {
                 "id":3,
                 "title":"AlbumName3",
                 "description":"Universal, 2016",
                 "image":"assets/images/avatar/2.jpg",
                 "iconPlay":"icon-play-circle-outline"
              },
              {
                 "id":4,
                 "title":"AlbumName4",
                 "description":"Universal, 2016",
                 "image":"assets/images/avatar/3.jpg",
                 "iconPlay":"icon-play-circle-outline"
              }
           ]
        },
        {
           "id":5,
           "title":"Unfall",
           "description":"Selbstverschuldeter Schaden",
           "image":"assets/images/avatar/5.jpg",
           "iconLike":"icon-thumb-up",
           "iconFavorite":"icon-heart",
           "iconShare":"icon-share-variant",
           "items":[
              {
                 "id":1,
                 "title":"AlbumName1",
                 "description":"Universal, 2016",
                 "image":"assets/images/avatar/14.jpg",
                 "iconPlay":"icon-play-circle-outline"
              },
              {
                 "id":2,
                 "title":"AlbumName2",
                 "description":"Universal, 2016",
                 "image":"assets/images/avatar/15.jpg",
                 "iconPlay":"icon-play-circle-outline"
              },
              {
                 "id":3,
                 "title":"AlbumName3",
                 "description":"Universal, 2016",
                 "image":"assets/images/avatar/6.jpg",
                 "iconPlay":"icon-play-circle-outline"
              },
              {
                 "id":4,
                 "title":"AlbumName4",
                 "description":"Universal, 2016",
                 "image":"assets/images/avatar/7.jpg",
                 "iconPlay":"icon-play-circle-outline"
              }
           ]
        },
        {
           "id":6,
           "title":"Artist5",
           "description":"DRUMMER",
           "image":"assets/images/avatar/3.jpg",
           "iconLike":"icon-thumb-up",
           "iconFavorite":"icon-heart",
           "iconShare":"icon-share-variant",
           "items":[
              {
                 "id":1,
                 "title":"AlbumName1",
                 "description":"Universal, 2016",
                 "image":"assets/images/avatar/14.jpg",
                 "iconPlay":"icon-play-circle-outline"
              },
              {
                 "id":2,
                 "title":"AlbumName2",
                 "description":"Universal, 2016",
                 "image":"assets/images/avatar/15.jpg",
                 "iconPlay":"icon-play-circle-outline"
              },
              {
                 "id":3,
                 "title":"AlbumName3",
                 "description":"Universal, 2016",
                 "image":"assets/images/avatar/6.jpg",
                 "iconPlay":"icon-play-circle-outline"
              },
              {
                 "id":4,
                 "title":"AlbumName4",
                 "description":"Universal, 2016",
                 "image":"assets/images/avatar/7.jpg",
                 "iconPlay":"icon-play-circle-outline"
              }
           ]
        },
        {
           "id":7,
           "title":"Artist5",
           "description":"DRUMMER",
           "image":"assets/images/avatar/4.jpg",
           "iconLike":"icon-thumb-up",
           "iconFavorite":"icon-heart",
           "iconShare":"icon-share-variant",
           "items":[
              {
                 "id":1,
                 "title":"AlbumName1",
                 "description":"Universal, 2016",
                 "image":"assets/images/avatar/14.jpg",
                 "iconPlay":"icon-play-circle-outline"
              },
              {
                 "id":2,
                 "title":"AlbumName2",
                 "description":"Universal, 2016",
                 "image":"assets/images/avatar/15.jpg",
                 "iconPlay":"icon-play-circle-outline"
              },
              {
                 "id":3,
                 "title":"AlbumName3",
                 "description":"Universal, 2016",
                 "image":"assets/images/avatar/6.jpg",
                 "iconPlay":"icon-play-circle-outline"
              },
              {
                 "id":4,
                 "title":"AlbumName4",
                 "description":"Universal, 2016",
                 "image":"assets/images/avatar/7.jpg",
                 "iconPlay":"icon-play-circle-outline"
              }
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
