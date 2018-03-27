import {Component} from '@angular/core';
import {
  Alert, AlertCmp, AlertController, IonicPage, ModalController, NavController, NavParams,
  ToastController
} from 'ionic-angular';
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
  listUuid: string;
  userID: string;
  todos: AngularFireList<any>;


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public todoService: TodoServiceProvider,
              public alertCtrl: AlertController,
              public modalCtrl: ModalController,
              public toastCtrl: ToastController) {

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
        this.saveTodo(todo);
      }
    });

    addModal.present();
  }

  saveTodo(todo) {
    this.todoService.addTodo(this.listUuid, todo).then((msg) => {
      let toast = this.toastCtrl.create({
        message: msg,
        duration: 3000,
        position: 'top'
      });
      toast.present();
    }).catch((msg) => {
      let toast = this.toastCtrl.create({
        message: msg,
        duration: 3000,
        position: 'top'
      });
      toast.present();
    });
  }

  editTodo(todo) {
    let prompt = this.alertCtrl.create({
      title: 'Modifier une liste',
      message: "Veuillez saisir le nouveau nom de la liste",
      inputs: [
        {
          name: 'newName',
          placeholder: 'nom'
        },
      ],
      buttons: [
        {
          text: 'Annuler',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Modifier',
          handler: data => {
            this.todoService.editTodo(this.listUuid, todo.uuid, data.newName).then((msg) => {
              let toast = this.toastCtrl.create({
                message: msg,
                duration: 3000,
                position: 'top'
              });
              toast.present();
            }).catch((msg) => {
              let toast = this.toastCtrl.create({
                message: msg,
                duration: 3000,
                position: 'top'
              });
              toast.present();
            });
          }
        }
      ]
    });
    prompt.present();
  }

  viewTodo(todo) {
    let editModal = this.modalCtrl.create('ViewTodoPage', {todo: todo});

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
            this.todoService.removeTodo(this.listUuid, todo.uuid, this.userID).then((msg) => {
              let toast = this.toastCtrl.create({
                message: msg,
                duration: 3000,
                position: 'top'
              });
              toast.present();
            });
          }
        }
      ]
    });
    alert.present();
  }


}
