import { Component } from '@angular/core';
import { Events, IonicPage, ModalController, NavController, NavParams, AlertController } from 'ionic-angular';
import { TodoServiceProvider } from "../../providers/todo-service/todo-service";
import { AngularFireList } from "angularfire2/database";
import { AddListPage } from "../add-list/add-list";
import { TodosPage } from "../todos/todos";
import { ActionSheetController } from 'ionic-angular';
import { AngularFireAuth } from "angularfire2/auth";

import { AuthPage } from "../auth/auth";
import { NFC, Ndef } from "@ionic-native/nfc";

import {ShareListPage} from "../share-list/share-list";
import {ToolProvider} from "../../providers/tool/tool";

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
  matchedName: string[];


  constructor(public navCtrl: NavController, public navParams: NavParams
    , public todoService: TodoServiceProvider, public modalCtrl: ModalController
    , public events: Events, public alertCtrl: AlertController,
    public actionSheetCtrl: ActionSheetController,
    public afAuth: AngularFireAuth,
    public nfc: NFC, public ndef: Ndef
    , public toolProvider: ToolProvider) {

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

    

    this.userID = navParams.data.userID;


    this.todoService.getTodoListsIds(this.userID).subscribe((listsIds: AngularFireList<any>) => {
      this.todoLists = [];
      this.listsIds = listsIds;
      for (let listId in this.listsIds) {
        this.todoService.getTodoList(this.listsIds[listId]).subscribe((list: AngularFireList<any>) => {
          this.todoLists[listId] = list;
          console.log('hh' + this.todoLists)

        });
      }
    });


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
        this.todoService.shareTodoList(list.uuid, this.toolProvider.removeSpecialCharacters(email));
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
  failNFCMsg(err) {
    //this.showToast('NFC Failed')
    console.log("")
  }
  addNFCListener(onSuccess, onError) {
    this.nfc.enabled()
      .then(() => {

        this.nfc.addNdefListener(() => {
          console.log('successfully attached ndef listener');
          onSuccess;

        }, (err) => {
          console.log('error attaching ndef listener', err);
          onError;
        }).subscribe((event) => {
          console.log('received ndef message. the tag contains: ', event.tag);
          console.log('decoded tag id', this.nfc.bytesToHexString(event.tag.id));

          let message = this.ndef.textRecord('Hello world', "fr-FR", event.tag.id);
          this.nfc.share([message]).then(onSuccess).catch(onError);
        });

      }).catch(err => {
        this.failNFCMsg(err)
        this.nfc.showSettings();

      })

  }

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

  //           this.addList();
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




