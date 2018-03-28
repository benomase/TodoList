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

  removeSpecialCharacters(word :string): string {
    return word.replace('@','').replace(/\./g,'');
  }

  uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  showToast(msg: string) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
}
