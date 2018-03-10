import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ListsPage } from "../lists/lists";

/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
userUuid:string;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.userUuid = navParams.data.userUuid;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }

  accessToMyTodoList(){
    console.log(this.userUuid)
    this.navCtrl.push('ListsPage', { userUuid: this.userUuid });
  }
}
