import {Component} from '@angular/core';
import {
  AlertController, IonicPage, ModalController, NavController, NavParams, PopoverController,
  ToastController
} from 'ionic-angular';
import {AngularFireList} from "angularfire2/database";
import {TodoServiceProvider} from "../../providers/todo-service/todo-service";
import {ToolProvider} from "../../providers/tool/tool";
import firebase from "firebase";
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
  listName: string;
  todos: AngularFireList<any>;
  firestore = firebase.storage();
  displayMethod: string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public todoService: TodoServiceProvider,
              public alertCtrl: AlertController,
              public modalCtrl: ModalController,
              public toastCtrl: ToastController,
              public toolProvider: ToolProvider,
              public popOverCtr : PopoverController) {

    this.listUuid = this.navParams.data.listUuid;
    this.userID = this.navParams.data.userID;
    this.listName = this.navParams.data.listName;
    this.todoService.getTodos(this.listUuid).subscribe((todos: AngularFireList<any>) => {

      this.todos = todos;
    });
    this.displayMethod='all';
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TodosPage');
  }

  addTodo() {
    let addModal = this.modalCtrl.create('AddTodoPage');
    addModal.onDidDismiss((todo) => {
      if (todo) {
        this.todoService.addTodo(this.listUuid,todo);
      }
    });

    addModal.present();
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
            todo.name = data.newName;
            this.todoService.editTodo(this.listUuid, todo).then((msg) => {
              this.toolProvider.showToast(msg);
            }).catch((msg) => {
              this.toolProvider.showToast(msg);
            });
          }
        }
      ]
    });
    prompt.present();
  }

  /*viewTodo(todo) {
    let editModal = this.modalCtrl.create('ViewTodoPage', {todo: todo, listUuid: this.listUuid});
    editModal.onDidDismiss((todo) => {
      if (todo) {
        this.editTodo(todo);
      }
    });
    editModal.present();
  }
*/

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
              this.toolProvider.showToast(msg);
            });
          }
        }
      ]
    });
    alert.present();
  }

  markasdone(todo) {
    todo.complete = !todo.complete;
    this.todoService.editTodo(this.listUuid,todo);
  //  this.todoService.incrementDoneTodoStats(this.userID);
  }

  setDisplayMethod(method) {
    this.displayMethod = method;
  }

  /*
  addImage() {
    this.toolProvider.showToast("addImage");

    this.fileChooser.open().then(url => {
      (<any>window).FilePath.resolveNativePath(url, result => {
        this.nativepath = result;
        this.toolProvider.showToast(result);

        this.uploadImage(todo);
      });
    });
  }

  uploadImage(todo) {
    this.toolProvider.showToast("uploadImage");
    (<any>window).resolveLocalFileSystemURL(this.nativepath, res => {
      res.file(resFile => {
        var reader = new FileReader();
        reader.readAsArrayBuffer(resFile);
        reader.onloadend = (evt: any) => {
          var imgBlob = new Blob([evt.target.result], {type: "image/jpg"});
          var imageStore = this.firestore.ref().child(this.todo.uuid);
          imageStore
            .put(imgBlob)
            .then(res => {
              this.toolProvider.showToast("upload sucess")
              this.displayImage();
            })
            .catch(err => {
              this.toolProvider.showToast("Upload Failed")
              alert("Upload Failed" + err);
              this.err = err
            });
        };
      });
    });
  }

  displayImage(todo) {
    this.toolProvider.showToast("this.uuid")
    this.firestore
      .ref()
      .child(this.todo.uuid)
      .getDownloadURL()
      .then(url => {
        this.zone.run(() => {
          this.toolProvider.showToast("image uploaded")
          this.imgsource = url;
        });
      });
  }*/

}
