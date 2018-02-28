import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViewTodoPage } from './view-todo';

@NgModule({
  declarations: [
    ViewTodoPage,
  ],
  imports: [
    IonicPageModule.forChild(ViewTodoPage),
  ],
  exports : [
    ViewTodoPage
  ]
})
export class ViewTodoPageModule {}
