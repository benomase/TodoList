import { Injectable } from '@angular/core';

/*
  Generated class for the ToolProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ToolProvider {

  constructor() {
    console.log('Hello ToolProvider Provider');
  }

  removeSpecialCharacters(word :string): string {
    return word.replace('@','').replace('.','');
  }

  uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  
}
