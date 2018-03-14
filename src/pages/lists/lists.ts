import { Component } from '@angular/core';
import { Events, IonicPage, ModalController, NavController, NavParams, AlertController } from 'ionic-angular';
import { TodoServiceProvider } from "../../providers/todo-service/todo-service";
import { AngularFireList } from "angularfire2/database";
import { AddListPage } from "../add-list/add-list";
import { TodosPage } from "../todos/todos";
import { ActionSheetController } from 'ionic-angular';
import { AngularFireAuth } from "angularfire2/auth";

import { AuthPage } from "../auth/auth";

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
  userUuid: string;
  lists: Array<any>;
  matchedName: string[];

  constructor(public navCtrl: NavController, public navParams: NavParams
    , public todoService: TodoServiceProvider, public modalCtrl: ModalController
    , public events: Events, public alertCtrl: AlertController,
    public actionSheetCtrl: ActionSheetController,
    public afAuth: AngularFireAuth) {

    this.afAuth.authState.subscribe((auth) => {
      if (auth) {
        console.log("auth ok");
      } else {
        console.log("auth not ok");
        this.navCtrl.setPages([
          { page: "AuthPage" }
        ]);
      }

    });



    this.userUuid = navParams.data.userUuid;

    this.todoService.getTodoListsIds(this.userUuid).subscribe((listsIds: AngularFireList<any>) => {
      console.log(listsIds)
      this.listsIds = listsIds;

      this.todoService.setMydataList(listsIds);
      //  this.lists = this.todoService.getDataList();
      // this.lists =this.todoService.dataArray;

    });
    this.todoService.getDataList().subscribe(lists => (
      console.log(lists),
      this.lists = lists
    ));


  }



  ionViewDidLoad() {

  }
  selectList(list) {
    this.navCtrl.push('TodosPage', { listUuid: list.uuid, userUuid: this.userUuid });
  }

  addList() {
    let addModal = this.modalCtrl.create('AddListPage');


    addModal.onDidDismiss((list) => {
      if (list) {
        console.log('on dismiss add item :' + list);
        this.todoService.addTodoList(list, this.userUuid);
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
            this.todoService.editTodoList(list.uuid, list, this.userUuid);
          }
        }
      ]
    });
    prompt.present();
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
            this.todoService.removeTodoList(list.uuid, this.userUuid);
          }
        }
      ]
    });
    confirm.present();

  }

  // presentActionSheet() {
  //   let actionSheet = this.actionSheetCtrl.create({
  //     title: 'Add new list',
  //     buttons: [
  //       {
  //         text: 'Add',
  //         role: 'Add',
  //         handler: () => {
  //           console.log('Add clicked');

  //           this.addList("");
  //         }
  //       }, {
  //         text: 'Add using speach recognition',
  //         handler: () => {
  //           console.log('speach recognition clicked');
  //          // this.addListWithSpeachRecognition();
  //         }
  //       }
  //     ]
  //   });
  //   actionSheet.present();
  // }


}

