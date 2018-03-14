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
  userID:string;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.userID = navParams.data.userID;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }

  accessToMyTodoList(){
    console.log(this.userID)
    this.navCtrl.push('ListsPage', { userID: this.userID });
  }
}
