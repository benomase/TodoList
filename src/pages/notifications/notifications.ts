import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {TodoServiceProvider} from "../../providers/todo-service/todo-service";
import {AngularFireList} from "angularfire2/database";

/**
 * Generated class for the NotificationsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html',
})
export class NotificationsPage {

  userID : string;
  listsIds: AngularFireList<any>;
  todoLists: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public todoService: TodoServiceProvider) {
    this.userID = navParams.data.userID;
    this.todoService.getWaitingTodoListsIds(this.userID).subscribe((listsIds: AngularFireList<any>)=>{
      this.listsIds = listsIds;
      this.todoLists = [];
      for (let listId in this.listsIds) {
        this.todoService.getTodoList(this.listsIds[listId]).subscribe((list: AngularFireList<any>) => {
          this.todoLists[listId] = list;
        });
      }
    });
  }

  acceptNotification(list) {
    this.todoService.acceptTodoListSharing(list.uuid,this.userID);
  }

  declineNotification(list) {
    this.todoService.declineTodoListSharing(list.uuid,this.userID);
  }
}
