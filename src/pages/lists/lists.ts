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
    private barcodeScanner: BarcodeScanner) {

    this.afAuth.authState.subscribe((auth) => {
      if (auth) {
        console.log("auth ok");
      } else {
        console.log("auth not ok");
        this.navCtrl.setPages([
          {page: "AuthPage"}
        ]);
      }
    });

    

    this.userID = navParams.data.userID;

    this.todoService.getTodoListsIds(this.userID).subscribe((listsIds: AngularFireList<any>) => {
      this.todoLists = [];
      this.listsIds = listsIds;
      for (let listId in this.listsIds) {
        this.todoService.getTodoList(this.listsIds[listId]).subscribe((list: AngularFireList<any>) => {
          if(list)
            this.todoLists[listId] = list;
          console.log('hh' + this.todoLists)
        });
      }
    });

    const bannerConfig: AdMobFreeBannerConfig = {
      // add your config here
      // for the sake of this example we will just use the test config
      isTesting: true,
      autoShow: true
    };
    this.admobFree.banner.config(bannerConfig);

    this.admobFree.banner.prepare()
      .then(() => {
        // banner Ad is ready
        // if we set autoShow to false, then we will need to call the show method here
      })
      .catch(e => console.log(e));
    //this.showBanner();
  }
  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'top'
    });

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
        this.todoService.addTodoList(list, this.userID).then((msg)=>{
          let toast = this.toastCtrl.create({
            message: msg,
            duration: 3000,
            position: 'top'
          });
          toast.present();
        }).catch((msg)=>{
          let toast = this.toastCtrl.create({
            message: msg,
            duration: 3000,
            position: 'top'
          });
          toast.present();
        });
      }


    const bannerConfig: AdMobFreeBannerConfig = {
      // add your config here
      // for the sake of this example we will just use the test config
      isTesting: true,
      autoShow: true
    };
    this.admobFree.banner.config(bannerConfig);

    this.admobFree.banner.prepare()
      .then(() => {
        // banner Ad is ready
        // if we set autoShow to false, then we will need to call the show method here
      })
      .catch(e => console.log(e));
    //addModal.present();
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
            this.todoService.editTodoList(list.uuid, data.newName).then((msg)=>{
              let toast = this.toastCtrl.create({
                message: msg,
                duration: 3000,
                position: 'top'
              });
              toast.present();
            }).catch((msg)=>{
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

  share(list) {
    console.log('Share a TodoList');
    let addModal = this.modalCtrl.create('ShareListPage',{listUuid: list.uuid});
    addModal.onDidDismiss((email) => {
      if (list && email) {
        this.todoService.shareTodoList(list.uuid, this.toolProvider.removeSpecialCharacters(email)).then((msg)=>{
          let toast = this.toastCtrl.create({
            message: msg,
            duration: 3000,
            position: 'top'
          });
          toast.present();
        }).catch((err)=>{
          let toast = this.toastCtrl.create({
            message: err,
            duration: 3000,
            position: 'top'
          });
          toast.present();
        });
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
            this.todoService.removeTodoList(list.uuid, this.userID).then((msg)=>{
              let toast = this.toastCtrl.create({
                message: msg,
                duration: 3000,
                position: 'top'
              });
              toast.present();
            }).catch((msg)=>{
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
    confirm.present();

  }
  // failNFCMsg(err) {
  //   console.log("")
  // }
  // addNFCListener(/*onSuccess, onError*/) {
  //   this.nfc.enabled()
  //     .then(() => {

  //       this.nfc.addNdefListener(() => {
  //         console.log('successfully attached ndef listener');
  //         this.presentToast('successfully attached ndef listener')
  //         // onSuccess;

  //       }, (err) => {
  //         console.log('error attaching ndef listener', err);
  //         this.presentToast('error attaching ndef listener'+ err)
  //         // onError;
  //       }).subscribe((event) => {
  //         this.presentToast('received ndef message. the tag contains: '+ this.nfc.bytesToHexString(event.tag.id))
  //         console.log('received ndef message. the tag contains: ', event.tag);
  //         console.log('decoded tag id', this.nfc.bytesToHexString(event.tag.id));

  //         let message = this.ndef.textRecord('Hello world', "fr-FR", event.tag.id);
  //         // this.nfc.share([message]).then(onSuccess).catch(onError);
  //       });

  //     }).catch(err => {
  //       this.failNFCMsg(err)
  //       this.nfc.showSettings();

  //     })

  // }

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
     }).catch(err => {
         console.log('Error', err);
     });
  }

  private generateQrCode(liste){
       this.barcodeScanner.encode("TEXT_TYPE", liste.uuid);
  }
}
