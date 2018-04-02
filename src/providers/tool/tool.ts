import { Injectable } from '@angular/core';
import {ToastController} from "ionic-angular";

/*
  Generated class for the ToolProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ToolProvider {
  constructor(public toastCtrl : ToastController) {

  }
  /**
   * Remove @ and . from a string
   * @param {string} word
   * @returns {string}
   */
  removeSpecialCharacters(word :string): string {
    return word.replace('@','').replace(/\./g,'');
  }

  /**
   * Show a Toast Message
   * @param {string} msg
   */
  showToast(msg: string) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
}
