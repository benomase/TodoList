import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AuthPage } from './auth';
import {ListsPage} from "../lists/lists";

@NgModule({
  declarations: [
    AuthPage
  ],
  imports: [
    IonicPageModule.forChild(AuthPage),
  ],
  exports: [
    AuthPage
  ]
})
export class AuthPageModule {}
