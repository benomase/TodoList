import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { SpeechRecognition } from '@ionic-native/speech-recognition';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import {environment} from "../environments/environment";
import {AngularFireModule} from "angularfire2";
import {AngularFireAuthModule} from "angularfire2/auth";
import {AngularFireDatabaseModule} from "angularfire2/database";
import {AuthPage} from "../pages/auth/auth";
import { TodoServiceProvider } from '../providers/todo-service/todo-service';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { NFC, Ndef } from "@ionic-native/nfc";

import { ToolProvider } from '../providers/tool/tool';
import { FilePath } from '@ionic-native/file-path';
import { FileChooser } from '@ionic-native/file-chooser';
import { GooglePlus } from '@ionic-native/google-plus';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Camera } from "@ionic-native/camera";


@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFireDatabaseModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    SpeechRecognition,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    TodoServiceProvider,
    AuthServiceProvider,
    NFC,
    Ndef,
    ToolProvider,
    FileChooser,
    FilePath,
    GooglePlus,
    BarcodeScanner,
    Camera
  ]
})
export class AppModule {}
