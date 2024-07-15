import { Injectable } from '@angular/core';
import { ConstantData } from './constant-data';
import { Router } from '@angular/router';
import { ActionModel } from './interface';

@Injectable({
  providedIn: 'root'
})
export class LoadDataService {


  constructor() { }

  validiateMenu(response: any, toastr: any, router: Router): ActionModel {
    var action: ActionModel = {} as ActionModel;
    if (response.Message == ConstantData.SuccessMessage) {
      action = response.Action;
      action.ResponseReceived = true;
    } else if (response.Message == ConstantData.AccessDenied) {
      toastr.error(response.Message);
      router.navigate(["page-not-found"]);
    } else {
      toastr.error(response.Message)
      router.navigate(["page-not-found"]);
    }
    return action;
  }


  round(value: number, NoOfDecimals?: number) {
    var multiflyFactor: number = 1;
    if (NoOfDecimals != null) {
      for (let i = 0; i < NoOfDecimals; i++) {
        multiflyFactor *= 10;
      }
      value = value * multiflyFactor;
    }
    if (value - Math.floor(value) >= 0.5) {
      return Math.ceil(value) / multiflyFactor;
    } else {
      return Math.floor(value) / multiflyFactor;
    }
  }

  loadDateYMD(date: any) {
    if (date == null || date == undefined)
      return null;
    var d = new Date(date);
    var dformat = [
      d.getFullYear(),
      ("0" + (d.getMonth() + 1)).slice(-2),
      ("0" + d.getDate()).slice(-2)
    ].join('-');
    return dformat;
  }

  loadDateTime(date: any) {
    if (date == null || date == undefined)
      return null;
    var d = new Date(date);
    var dformat = [
      d.getFullYear(),
      ("0" + (d.getMonth() + 1)).slice(-2),
      ("0" + d.getDate()).slice(-2)
    ].join('-')
      + ' ' +
      [d.getHours(),
      d.getMinutes(),
      d.getSeconds()].join(':');
    return dformat;
  }
  addDays(oldDate: any, days: number) {
    var date = new Date(oldDate);
    date.setDate(date.getDate() + days);
    return date;
  }
}
