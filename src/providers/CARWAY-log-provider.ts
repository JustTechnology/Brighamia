import { InfiniteScroll } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { CARWAY_Model_Log } from '../models/CARWAY-model-log';
import { CARWAY_Util_Date } from '../util/CARWAY-util-date';
import { CARWAY_LOG_TYPE } from './constants-provider';

@Injectable()
export class CARWAY_Log_Provider 
{
  CARWAY_log:Array<CARWAY_Model_Log> = [];
  
  constructor() 
  {
    console.log('contruct CARWAY_Log_Provider');
  }

  add(origin:string,message:string,aCARWAY_LOG_TYPE:CARWAY_LOG_TYPE = CARWAY_LOG_TYPE.INFO)
  {
    let newMessage: CARWAY_Model_Log = {};
    let aNow:Date= new Date();
    let m_Type = CARWAY_LOG_TYPE.NOT_SET;

    newMessage.origin = origin;
    newMessage.message = message;
    newMessage.datetime = CARWAY_Util_Date.getActTimeKey(true);
    newMessage.datetime = newMessage.datetime.substr(0,2)+":"+newMessage.datetime.substr(2,2)+":"+newMessage.datetime.substr(4,newMessage.datetime.length);
    this.CARWAY_log.push(newMessage); 

    console.log("CARWAY_Log_Provider" + JSON.stringify(newMessage));
  }

  get()
  {
    return this.CARWAY_log;
  }
}
