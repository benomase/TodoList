import { Component } from '@angular/core';
import {Events, IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import {TodoServiceProvider} from "../../providers/todo-service/todo-service";
import {AngularFireList} from "angularfire2/database";
import {AddListPage} from "../add-list/add-list";
import {TodosPage} from "../todos/todos";

/**
 * Generated class for the ListsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-lists',
  templateUrl: 'lists.html',
})
export class ListsPage {
  lists: any;
  userUuid: string;

  constructor(public navCtrl: NavController, public navParams: NavParams
  , public todoService : TodoServiceProvider, public modalCtrl:ModalController
              ,public events :Events) {
    this.userUuid = navParams.data.userUuid;
     this.todoService.getTodoLists(this.userUuid).subscribe((lists : AngularFireList<any>) => {
      this.lists = lists;
    });
  }


  ionViewDidLoad(){
  }

  selectList(list) {
    this.navCtrl.push('TodosPage',{listUuid:list.uuid,userUuid:this.userUuid});

  }

  addList() {
    let addModal = this.modalCtrl.create('AddListPage');
    addModal.onDidDismiss((list) => {
      if(list){
        console.log('on dismiss add item :'+list);
        this.todoService.addTodoList(list,this.userUuid);
      }

    });

    addModal.present();
  }
}
