import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShareListPage } from './share-list';

@NgModule({
  declarations: [
    ShareListPage,
  ],
  imports: [
    IonicPageModule.forChild(ShareListPage),
  ],
  exports : [
    ShareListPage
  ]
})
export class ShareListPageModule {}
