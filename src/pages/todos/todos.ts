import { Component } from '@angular/core';
import {Alert, AlertCmp, AlertController, IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import {AngularFireList} from "angularfire2/database";
import {TodoServiceProvider} from "../../providers/todo-service/todo-service";
import {AddTodoPage} from "../add-todo/add-todo";
import {ViewTodoPage} from "../view-todo/view-todo";

/**
 * Generated class for the TodosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-todos',
  templateUrl: 'todos.html',
})
export class TodosPage {
  listUuid : string;
  userUuid: string;
  todos: AngularFireList<any>;


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public todoService : TodoServiceProvider,
              public alertCtrl: AlertController,
              public modalCtrl: ModalController) {
    this.listUuid = this.navParams.data.listUuid;
    this.userUuid = this.navParams.data.userUuid;

    this.todoService.getTodos(this.listUuid,this.userUuid).subscribe((todos : AngularFireList<any>) => {
      this.todos = todos;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TodosPage');
  }

  addTodo() {
    let addModal = this.modalCtrl.create('AddTodoPage');
    addModal.onDidDismiss((todo) => {

      if(todo){
        console.log('on dismiss add todo :'+todo);
        this.saveTodo(todo);
      }

    });

    addModal.present();
  }

  saveTodo(todo) {
    this.todoService.addTodo(this.listUuid,todo,this.userUuid);
  }

  editTodo(todo) {
    this.todoService.editTodo(this.listUuid,todo,this.userUuid);
  }

  viewTodo(todo){
      let editModal = this.modalCtrl.create('ViewTodoPage',{todo : todo});

      editModal.onDidDismiss((todo) => {
        if(todo){
          this.editTodo(todo);
        }
      });
      editModal.present();
    }

    deleteTodo(todo) {
      let alert = this.alertCtrl.create({
        title: 'Confirm purchase',
        message: 'Do you want to buy this book?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Buy',
            handler: () => {
              console.log('Buy clicked');
            }
          }
        ]
      });
      alert.present();
    }

}
