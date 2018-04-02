import { Component } from '@angular/core';
import { Events, IonicPage, ModalController, NavController, NavParams, AlertController } from 'ionic-angular';
import { TodoServiceProvider } from "../../providers/todo-service/todo-service";
import { AngularFireList } from "angularfire2/database";
import { AddListPage } from "../add-list/add-list";
import { TodosPage } from "../todos/todos";
import { ActionSheetController } from 'ionic-angular';
import { AngularFireAuth } from "angularfire2/auth";
import { TodoList } from "../../models/model";

import { AuthPage } from "../auth/auth";
import { NFC, Ndef } from "@ionic-native/nfc";
import { SpeechRecognition } from '@ionic-native/speech-recognition';
import { ChangeDetectorRef } from '@angular/core';
import { ShareListPage } from "../share-list/share-list";
import { ToolProvider } from "../../providers/tool/tool";
import { ToastController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { AuthServiceProvider } from "../../providers/auth-service/auth-service";

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
  nameListToAdd: string;

  constructor(public navCtrl: NavController, public navParams: NavParams
    , public todoService: TodoServiceProvider, public modalCtrl: ModalController
    , public events: Events, public alertCtrl: AlertController,
    public actionSheetCtrl: ActionSheetController,
    public afAuth: AngularFireAuth,
    public nfc: NFC, public ndef: Ndef
    , public toolProvider: ToolProvider,
    private toastCtrl: ToastController,
    private speechRecognition: SpeechRecognition,
    private cd: ChangeDetectorRef,
    private barcodeScanner: BarcodeScanner,
     public authProvider: AuthServiceProvider) {

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
  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'top'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
  }
  ionViewDidLoad() {

  }
  selectList(list) {

    this.navCtrl.push('TodosPage', { listUuid: list.uuid, userID: this.userID });
  }

  addList(type) {


    switch (type) {
      case "speachRecognition":
        this.startListening();
        break;
      case "qrCode":
        this.scanQrCode();
        break;
      default:
        let addModal = this.modalCtrl.create('AddListPage');


        addModal.onDidDismiss((list) => {
          if (list) {
            console.log('on dismiss add item :' + list);
            this.todoService.addTodoList(list, this.userID);
          }

        });

        addModal.present();
    }


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

  private getPermission() {
    this.speechRecognition.hasPermission()
      .then((hasPermission: boolean) => {
        if (!hasPermission) {
          this.speechRecognition.requestPermission().then(
            () => this.presentToast('Granted'),
            () => this.presentToast('Denied')
          );
        } else {
          this.presentToast('has permission');
        }
      });
  }
  private startListening() {
    let options = {
      language: 'fr-FR'
    }

    //get permission 
    this.getPermission();
    this.speechRecognition.startListening(options).subscribe(matches => {

      let list: TodoList = {
        uuid: "",
        name: matches[1],
        items: []
      };
      if (list) {
        this.todoService.addTodoList(list, this.userID);
      }

      this.cd.detectChanges();

    }, error => this.presentToast(error));
  }

  private scanQrCode() {

    this.barcodeScanner.scan().then(barcodeData => {
      console.log('Barcode data', barcodeData.text);
      let resultListID = barcodeData.text.split("@")[0];
      let resultTypeShare = barcodeData.text.split("@")[1];
      if (resultTypeShare == "copie") {
        alert("The list are shared as a copy")
        console.log("The list are shared as a copy")
      
      } else if (resultTypeShare == "access") {
      
        console.log("The list are shared in read only")
        this.todoService.shareTodoList(resultListID, this.userID);
      
      }
      else {
        alert()
        console.log("No type of share in qrCode scanned")
      }
    }).catch(err => {
      console.log('Error', err);
    });


  }

  private generateQrCode(liste) {
    let typeQr;
    let confirm = this.alertCtrl.create({
      title: 'Type de partage',
      message: 'Comment voulez vous partager cette liste?',
      buttons: [
        {
          text: 'Une copie',
          handler: () => {
            this.barcodeScanner.encode("TEXT_TYPE", liste.uuid + "@copie");
          }
        },
        {
          text: 'Lecture seule',
          handler: () => {

            this.barcodeScanner.encode("TEXT_TYPE", liste.uuid + "@access");
          }
        }
      ]
    });
    confirm.present();


  }

  goToHomePage() {
    
     this.navCtrl.push('AuthPage');
   }
    /*
   *TODO: get userid and send it in the navParam
   */
   GoToListsPage(){
     this.navCtrl.push('ListsPage', { userID: this.userID });
   }
   logout() {
     this.authProvider.logoutUser().then(() => {
       console.log('o');
     });
   }
}
