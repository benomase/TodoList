import {Component} from '@angular/core';
import {Events, IonicPage, ModalController, NavController, NavParams, AlertController} from 'ionic-angular';
import {TodoServiceProvider} from "../../providers/todo-service/todo-service";
import {AngularFireList} from "angularfire2/database";
import {AddListPage} from "../add-list/add-list";
import {TodosPage} from "../todos/todos";
import {ShareListPage} from "../share-list/share-list";

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
  listsIds: any;
  userID: string;
  todoLists: any;
  tempList: AngularFireList<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams
    , public todoService: TodoServiceProvider, public modalCtrl: ModalController
    , public events: Events, public alertCtrl: AlertController) {

    this.userID = navParams.data.userID;

    this.todoService.getTodoListsIds(this.userID).subscribe((listsIds: AngularFireList<any>) => {
      this.todoLists = [];
      this.listsIds = listsIds;
      for (let listId in this.listsIds) {
        this.todoService.getTodoList(this.listsIds[listId]).subscribe((list: AngularFireList<any>) => {
          this.todoLists[listId] = list;
        });
      }
    });

    console.log('hh')
  }

  ionViewDidLoad() {
  }

  selectList(list) {
    this.navCtrl.push('TodosPage', {listUuid: list.uuid, userID: this.userID});
  }

  addList() {
    let addModal = this.modalCtrl.create('AddListPage');
    addModal.onDidDismiss((list) => {
      if (list) {
        console.log('on dismiss add item :' + list);
        this.todoService.addTodoList(list, this.userID);
      }

    });

    addModal.present();
  }

  edit(list) {
    console.log('Edit a TodoList');
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
            console.log(JSON.stringify(data));
            this.todoService.editTodoList(list.uuid, list, this.userID);
          }
        }
      ]
    });
    prompt.present();
  }

  share(list) {
    console.log('Share a TodoList');
    let addModal = this.modalCtrl.create('ShareListPage');
    addModal.onDidDismiss((email) => {
      if (list) {
        this.todoService.shareTodoList(list, email);
      }
    });


    addModal.present();
  }


  remove(list) {
    console.log('remove list');
    let confirm = this.alertCtrl.create({
      title: 'Confirmation de suppression',
      message: 'Voulez vous vraiment supprimer cette liste?',
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
            this.todoService.removeTodoList(list.uuid, this.userID);
          }
        }
      ]
    });
    confirm.present();

  }

}
