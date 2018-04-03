import {Component, NgZone} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {TodoItem} from "../../models/model";
import {TodoServiceProvider} from "../../providers/todo-service/todo-service";
import {FileChooser} from "@ionic-native/file-chooser";
import {FilePath} from "@ionic-native/file-path";
import {ToastController} from 'ionic-angular';

import firebase from "firebase";
import {ToolProvider} from "../../providers/tool/tool";

/**
 * Generated class for the ViewTodoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-view-todo',
  templateUrl: 'view-todo.html',
})
export class ViewTodoPage {
  todo: TodoItem;
  nativepath: any;
  firestore = firebase.storage();
  imgsource: any;
  err;

  constructor(public navParams: NavParams,
              public view: ViewController,
              public todoService: TodoServiceProvider,
              private fileChooser: FileChooser,
              public zone: NgZone,
              private toastCtrl: ToastController,
              public toolProvider: ToolProvider) {
    this.todo = this.navParams.data.todo;
  }

  markasdone() {
    this.todo.complete = !this.todo.complete;
  }

  saveTodo() {
    this.view.dismiss(this.todo);
  }

 
addImage() {
  this.fileChooser.open().then(url => {
    (<any>window).FilePath.resolveNativePath(url, result => {
      this.nativepath = result;
      this.uploadImage();
    });
  });
}

uploadImage() {
  (<any>window).resolveLocalFileSystemURL(this.nativepath, res => {
    res.file(resFile => {
      var reader = new FileReader();
      reader.readAsArrayBuffer(resFile);
      reader.onloadend = (evt: any) => {
        var imgBlob = new Blob([evt.target.result], { type: "image/jpeg" });
        var imageStore = this.firestore.ref().child(this.todo.uuid);
        imageStore
          .put(imgBlob)
          .then(res => {
            // this.showToast("upload sucess", "bottom");
            this.displayImage();
          })
          .catch(err => {
            alert("Upload Failed" + err);
          });
      };
    });
  });
}
displayImage() {
  this.firestore
    .ref()
    .child(this.todo.uuid)
    .getDownloadURL()
    .then(url => {
      this.zone.run(() => {
        // this.showToast("Image loaded", "bottom");
        this.imgsource = url;
      });
    });
}

}
