import { NgModule } from '@angular/core';

import { OrderbyPipe } from './orderby/orderby';
import { LongAddressPipe } from './long-address/long-address';
import { TimeHourPipe } from './time-hour/time-hour';
import { TimeMinutePipe } from './time-minute/time-minute';
import { TimeStringPipe } from './time-string/time-string';
import { DurationStringPipe } from './duration-string/duration-string';
import { DistanceKmPipe } from './distance-km/distance-km';
import { DurationStringMapPipe } from './duration-string-map/duration-string-map';
import { DatetimecontrolPipe } from './datetimecontrol/datetimecontrol';

@NgModule({
    declarations: 
    [
        OrderbyPipe,
        LongAddressPipe,
        TimeHourPipe,
        TimeMinutePipe,
        TimeStringPipe,
         DurationStringPipe,
    DistanceKmPipe,
    DurationStringMapPipe,
    DatetimecontrolPipe,
    ]
    ,
	imports: [],
    exports: 
    [
        OrderbyPipe,
        LongAddressPipe,
        TimeHourPipe,
        TimeMinutePipe,
        TimeStringPipe,
        DurationStringPipe,
    DistanceKmPipe,
    DurationStringMapPipe,
    DatetimecontrolPipe,
    ]
})
export class PipesModule {}
