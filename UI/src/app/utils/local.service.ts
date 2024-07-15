import { Injectable } from '@angular/core';
import *  as CryptoJS from 'crypto-js';
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class LocalService {
  key = "45jsdsb444";

  constructor(private route: Router) { }

  public saveData(key: string, value: string) {
    localStorage.setItem(key, this.encrypt(value));
  }

  public getData(key: string) {
    let data = localStorage.getItem(key) || "";
    return this.decrypt(data);
  }
  public removeData(key: string) {
    localStorage.removeItem(key);
  }

  public clearData() {
    localStorage.clear();
  }

  public encrypt(txt: string): string {
    return CryptoJS.AES.encrypt(txt, this.key).toString();
  }

  public decrypt(txtToDecrypt: string) {
    return CryptoJS.AES.decrypt(txtToDecrypt, this.key).toString(CryptoJS.enc.Utf8);
  }

  //Employee
  public employeeDetail = "455115dfsdfs";
  setEmployeeDetail(obj: any) {
    this.saveData(this.employeeDetail, JSON.stringify(obj));
  }

  getEmployeeDetail() {
    var obj = this.getData(this.employeeDetail);
    if (obj == null || obj == "" || obj == undefined)
      this.route.navigate(['/admin-login']);
    return JSON.parse(obj);
    //return {};
  }

  removeEmployeeDetail(){
    this.removeData(this.employeeDetail);
  }

}
