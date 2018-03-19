import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {TodoList} from "../../models/model";

/**
 * Generated class for the ShareListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-share-list',
  templateUrl: 'share-list.html',
})
export class ShareListPage {

  email: string;
  constructor(public navCtrl: NavController, public navParams: NavParams,public view: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddListPage');
  }

  share(){
    this.view.dismiss(this.email);
  }

  close(){
    this.view.dismiss();
  }

}
