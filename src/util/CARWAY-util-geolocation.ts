import { CARWAY_Util_Text } from './CARWAY-util-text';
import { CARWAY_Log_Provider } from './../providers/CARWAY-log-provider';
import { CARWAY_Geoposition } from './../models/CARWAY-model-geoposition';
import { Http } from '@angular/http';
import { BackgroundGeolocationResponse } from '@ionic-native/background-geolocation';
import { routeSnappedToRoadLatLngPlace } from '../models/CARWAY-model-track-single';
import { CarwayLocationTrackerProvider } from '../providers/carway-location-tracker';
import { LOADING_POSITION_STATE } from '../providers/constants-provider';
import { resolveDefinition } from '@angular/core/src/view/util';
import { ToastController } from 'ionic-angular';
declare var google: any;

export class CARWAY_Util_Geolocation
{
    public static searchPlace(query:string,sType:string) : Array<any> 
    {
        let autocompleteService:any = new google.maps.places.AutocompleteService();
        let places: any = new Array<any>();

        if(query.length > 0) 
        {
            let config = 
            {
                // types: [''],
                input: query
            }
            
            autocompleteService.getPlacePredictions(config, (predictions, status) => 
            {
              if(status == google.maps.places.PlacesServiceStatus.OK && predictions)
              {
                    predictions.forEach((prediction) => 
                    {
                        places.push(prediction);
                    });
                }
            });

            return places;
        } 
    }

    public static searchPlaceHttp(http:Http,query:string,sType:string) : Array<any> 
    {
        let autocompleteService:any = new google.maps.places.AutocompleteService();
        let places: any = new Array<any>();

        if(query.length > 0) 
        {
            let config = 
            {
                types: [sType],
                input: query
            }
            
            autocompleteService.getPlacePredictions(config, (predictions, status) => 
            {
              if(status == google.maps.places.PlacesServiceStatus.OK && predictions)
              {
                    predictions.forEach((prediction) => 
                    {
                        places.push(prediction);
                    });
                }
            });

            return places;
        } 
    }

    public static getLatLngDetails(http:Http,lat:number,lng:number) 
    {
        return http.post(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyCR5BUIo2C5JS8wCSanmmWQANLvwgq9ZCA`, "");
    }

    public static addMarker(aMap:any,sIcoURL:string,lat:number,lng:number,sInfoWindowText:string,bDeleteMarkers:boolean)
    {
        let aArrayMarker = aMap.get("marker");
        let ico = null;
                
        if(sIcoURL)
        {
            ico = 
            {
                url:sIcoURL,
                scaledSize: new google.maps.Size(22,32)
            }
        }
        
        if(aArrayMarker)
        {
            if(bDeleteMarkers)
            {
                aArrayMarker.forEach(marker =>
                {
                    marker.setMap(null);
                    marker = null;
                });
            }
        }
        else
        {
            aArrayMarker = new Array<any>();
        }
        
        let marker = new google.maps.Marker(
        {
            position:new google.maps.LatLng(lat,lng),
            map:aMap,
            icon:ico
        });
    
        let infoWindow:google.maps.InfoWindow = new google.maps.InfoWindow(
        {
            content:sInfoWindowText,
            maxWidth:200
        });

        aArrayMarker.push(marker);
        aMap.set("marker",aArrayMarker);

        google.maps.event.addListener(marker, 'click', function() 
        {
            if(!marker.open)
            {
                infoWindow.open(this.map,marker);
                marker.open = true;
            }
            else
            {
                infoWindow.close();
                marker.open = false;
            }
        });    
    }

    public static getPlaceFromLatLng(http:Http,lat:number,lng:number)
    {
        let url:string = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyCR5BUIo2C5JS8wCSanmmWQANLvwgq9ZCA`
 
        return http.post(url, "");
    }

    public static copyGeolocationResponseToGeoposition(http:Http,aBackgroundGeolocationResponse:BackgroundGeolocationResponse) : CARWAY_Geoposition
    {
        let aCARWAY_Geoposition:CARWAY_Geoposition = new CARWAY_Geoposition();

        aCARWAY_Geoposition.coords = aBackgroundGeolocationResponse.coords;
        aCARWAY_Geoposition.timestamp = aBackgroundGeolocationResponse.time;

        return aCARWAY_Geoposition;
    }

    public static convertLatLngPlaceToGoogleLatLng(aArrayRouteSnappedToRoadLatLng:Array<routeSnappedToRoadLatLngPlace>) : Array<google.maps.LatLng>
    {
        let aArrayGoogleLatLng:Array<google.maps.LatLng> = new Array<google.maps.LatLng>();

        for(let i=0 ; i<aArrayRouteSnappedToRoadLatLng.length ; i++)
        {
            aArrayGoogleLatLng.push(new google.maps.LatLng(aArrayRouteSnappedToRoadLatLng[i].lat,aArrayRouteSnappedToRoadLatLng[i].lng));
        }
        
        return aArrayGoogleLatLng;
    }

    public static centerMap(aMap:google.maps.Map,lat:number,lng:number,nZoom:number=15)
    {
		aMap.setZoom(nZoom);
        aMap.setCenter(new google.maps.LatLng(lat,lng));
    }

    public static setHereMarker(toastcontroller:ToastController,aCARWAY_LocationTracker_Provider:CarwayLocationTrackerProvider,aMap:google.maps.Map,bCenterMap:boolean) : Promise<void>
	{
        // HERE-Marker
        let aPromise:Promise<void> = new Promise((resolveMarker,rejectMarker) =>
        {
            aCARWAY_LocationTracker_Provider.getPosition(false)
            .then
            (
                (resolvePosition:CARWAY_Geoposition) =>
                {
                    if(resolvePosition)
                    {
                        // Position bestimmt, Here-Marker anzeigen
                        CARWAY_Util_Geolocation.addMarker(aMap,"",resolvePosition.coords.latitude,resolvePosition.coords.longitude,"Ihr aktueller Standort",true);
                        
                        if(bCenterMap)
                        {
                            CARWAY_Util_Geolocation.centerMap(aMap,resolvePosition.coords.latitude,resolvePosition.coords.longitude);
                        }
                    }

                    resolveMarker();
                }
            )
        });
        
        return aPromise;
    }
    
    public static addCircle(aMap:google.maps.Map,lat:number,lng:number)
	{
		new google.maps.Circle(
			{
				strokeColor: '#CCBE94',
				strokeOpacity: 0.8,
				strokeWeight: 2,
				fillColor: '#CCBE94',
				fillOpacity: 0.25,
				center: new google.maps.LatLng(lat,lng),
				map: aMap,
				radius: 2,
			});		
    }
    
    public static readSnappedRoutePoints(aHttp:Http,sPath:string) : Promise<Array<routeSnappedToRoadLatLngPlace>>
    {
        let aPromise:Promise<Array<routeSnappedToRoadLatLngPlace>> = new Promise((resolve,error) =>
        {
            let aArrayRouteSnappedToRoadLatLng:Array<routeSnappedToRoadLatLngPlace> = new Array<routeSnappedToRoadLatLngPlace>();

            aHttp.post(`https://roads.googleapis.com/v1/snapToRoads?path=${sPath}&interpolate=true&key=AIzaSyCR5BUIo2C5JS8wCSanmmWQANLvwgq9ZCA`, "")
            .map((data) => data.json())
            .subscribe
            (
                data => 
                {
                    data.snappedPoints.forEach(snappedPoint => 
                    {
                        let aRouteSnappedToRoadLatLngPlace:routeSnappedToRoadLatLngPlace = new routeSnappedToRoadLatLngPlace();
                        aRouteSnappedToRoadLatLngPlace.lat = snappedPoint.location.latitude;
                        aRouteSnappedToRoadLatLngPlace.lng = snappedPoint.location.longitude;
                        aRouteSnappedToRoadLatLngPlace.placeID = snappedPoint.placeId;
                        
                        aArrayRouteSnappedToRoadLatLng.push(aRouteSnappedToRoadLatLngPlace);
                    });

                    resolve(aArrayRouteSnappedToRoadLatLng);
                }
                , 
                error => 
                {                    
                    error(error);
                }
            );
        });

        return aPromise;
    }

    public static addConnections(aMap:google.maps.Map,aArrayLatLng:Array<any>,bFullRoute:boolean)
    {
		let aPolyLineOption:google.maps.PolylineOptions = {path:aArrayLatLng};
        
		if(bFullRoute)
		{
			aPolyLineOption.strokeWeight = 8;
			aPolyLineOption.strokeOpacity = 0.6;
			aPolyLineOption.strokeColor = '#fcd736';
		}
		else
		{
			var lineSymbol = 
			{
				path: google.maps.SymbolPath.FORWARD_OPEN_ARROW
			};

			aPolyLineOption.strokeWeight = 1;
			aPolyLineOption.strokeOpacity = 1;
			aPolyLineOption.strokeColor = '#40311E';
			aPolyLineOption.icons = [{icon: lineSymbol,offset: '100%',repeat: '15%'}]
		}
		
        let aPolyline = new google.maps.Polyline(aPolyLineOption);

		aPolyline.setMap(aMap);
    }

    public static convertGeolocationResponseToPath(aArrayBackgroundGeolocationResponse:Array<BackgroundGeolocationResponse>) : string
    {
        let sPath:string = "";

        for(let i=0 ; i<aArrayBackgroundGeolocationResponse.length ; i++)
        {
            if(i>0)
            {
                sPath = sPath + "|";
            }
            
            sPath = sPath + aArrayBackgroundGeolocationResponse[i].latitude +"," + aArrayBackgroundGeolocationResponse[i].longitude;
        }
        
        return sPath;
    }

    public static getDistanceFromLatLonInM(lat1,lon1,lat2,lon2) 
    {
        var R = 6371; // Radius of the earth in km
        var dLat = CARWAY_Util_Geolocation.deg2rad(lat2-lat1);  // deg2rad below
        var dLon = CARWAY_Util_Geolocation.deg2rad(lon2-lon1); 
        var a = 
          Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(CARWAY_Util_Geolocation.deg2rad(lat1)) * Math.cos(CARWAY_Util_Geolocation.deg2rad(lat2)) * 
          Math.sin(dLon/2) * Math.sin(dLon/2)
          ; 
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        var d = R * c; // Distance in km
        return d/1000;
      }
      
      public static deg2rad(deg) 
      {
        return deg * (Math.PI/180)
      }
}