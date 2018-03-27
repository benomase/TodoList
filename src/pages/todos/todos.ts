import { Component } from '@angular/core';
import { Alert, AlertCmp, AlertController, IonicPage, ModalController, NavController, NavParams } from 'ionic-angular';
import { AngularFireList } from "angularfire2/database";
import { TodoServiceProvider } from "../../providers/todo-service/todo-service";
import { AddTodoPage } from "../add-todo/add-todo";
import { ViewTodoPage } from "../view-todo/view-todo";
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
  listUuid: string;
  userID: string;
  todos: AngularFireList<any>;
 


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public todoService: TodoServiceProvider,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController) {
    this.listUuid = this.navParams.data.listUuid;
    this.userID = this.navParams.data.userID;

    this.todoService.getTodos(this.listUuid).subscribe((todos: AngularFireList<any>) => {

      this.todos = todos;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TodosPage');
  }

  addTodo() {
    let addModal = this.modalCtrl.create('AddTodoPage');
    addModal.onDidDismiss((todo) => {

      if (todo) {
        console.log('on dismiss add todo :' + todo);
        this.saveTodo(todo);
      }

    });

    addModal.present();
  }

  saveTodo(todo) {
    this.todoService.addTodo(this.listUuid, todo);
  }

  editTodo(todo) {
    this.todoService.editTodo(this.listUuid, todo, this.userID);
  }

  viewTodo(todo) {
    // let editModal = 
    this.navCtrl.push('ViewTodoPage', { todo: todo });

    // editModal.onDidDismiss((todo) => {
    //   if (todo) {
    //     this.editTodo(todo);
    //   }
    // });
    // editModal.present();

    
  }

  deleteTodo(todo) {
    let alert = this.alertCtrl.create({
      title: 'Confirmation de suppression',
      message: 'Voulez vous vraiment supprimer cet Item?',
      buttons: [
        {
          text: 'Annuler',
          handler: () => {
            console.log('suppression annuler');
          }
        },
        {
          text: 'Confirmer',
          handler: () => {
            console.log('Confirmer');
            this.todoService.removeTodo(this.listUuid, todo.uuid, this.userID)
          }
        }
      ]
    });
    alert.present();
  }
  

}
