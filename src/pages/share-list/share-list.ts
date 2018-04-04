import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {AngularFireList} from "angularfire2/database";
import {TodoServiceProvider} from "../../providers/todo-service/todo-service";
import {ToolProvider} from "../../providers/tool/tool";

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
  sharedList: AngularFireList<any>;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public view: ViewController,
              public todoService:TodoServiceProvider,
              public toolProvider: ToolProvider
  ) {
    this.todoService.getSharedPeopleForList(this.navParams.data.listUuid).subscribe((list) => {
      this.sharedList = list;
      this.sharedList.remove(toolProvider.removeSpecialCharacters(this.email));
    });
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
