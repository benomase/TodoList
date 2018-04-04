import { AngularFireDatabase } from "angularfire2/database";
import { TodoItem, TodoList } from "../../models/model";
import { Observable } from "rxjs/Observable";
import "firebase/app";
import {Injectable} from "@angular/core";
import {FirebaseApp} from "angularfire2";

/*
  Generated class for the TodoServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class TodoServiceProvider {
  data: Observable<any[]>;

  constructor(public db: AngularFireDatabase, public firebase: FirebaseApp) {
  }

  /**
   * GET TodoLists Ids of a user
   * @param {String} userID
   * */
  public getTodoListsIds(userID: string): Observable<any> {
    return this.db.list(`/users/${userID}/lists/`).valueChanges();
  }


  /**
   * Get Waiting TodoLists Ids of a user
   * @param {string} userID
   * @returns {Observable<any>}
   */
  getWaitingTodoListsIds(userID: string): Observable<any> {
    return this.db.list(`/users/${userID}/w-lists/`).valueChanges();
  }

  /**
   * Get a Specified TodoList
   * @param {string} listUuid
   * @returns {Observable<any>}
   */
  public getTodoList(listUuid: string): Observable<any> {
    return this.db.object(`/lists/${listUuid}`).valueChanges();
  }

  /**
   * ADD TODOLIST ID TO USER
   */
  public addTodoListId(listUuid: string, userID: string): Promise<any> {
    return this.db.object(`/users/${userID}/lists/${listUuid}`).set(listUuid);
  }

  /**
   * ADD TODOLIST TO LISTS
   */
  public addTodoListObject(list: TodoList, userID: string) {
    let ref = this.db.list(`/lists`).push({});
    list.uuid = ref.key;
    list.instances = 1;
    list.users = [];
    list.users[userID] = userID;
    ref.set(list);
    return ref.key;
  }

  /**
   * ADD TODOLIST (MAIN)
   * @param {TodoList} list
   * @param {string} userID
   */
  public addTodoList(list: TodoList, userID: string): Promise<any> {
    return new Promise((resolve, reject) => {
      let listUuid = this.addTodoListObject(list, userID);
      this.addTodoListId(listUuid, userID).then(() => {
        resolve('La liste a été ajouté avec succès');
      }).catch((err) => {
        reject(err)
      });
    });
  }

  /**
   * Get a all TodoItems In a specified List
   * @param {string} listUuid
   * @returns {Observable<any>}
   */
  public getTodos(listUuid: string): Observable<any> {
    return this.db.list(`/lists/${listUuid}/items`).valueChanges();
  }

  /**
   * Add a TodoItem to a specified List
   * @param {string} listUuid
   * @param {TodoItem} newItem
   * @returns {Promise<any>}
   */
  public addTodo(listUuid: string, newItem: TodoItem): Promise<any> {
    let ref = this.db.list(`/lists/${listUuid}/items`).push({});
    newItem.uuid = ref.key;
    return ref.set(newItem);
  }

  /**
   * Edit a TodoItem
   * @param {string} listUuid
   * @param {TodoItem} todo
   * @returns {Promise<any>}
   */
  public editTodo(listUuid: string, todo: TodoItem): Promise<any> {
    return this.db.object(`/lists/${listUuid}/items/${todo.uuid}`).update(todo);
  }

  /**
   * Edit a TodoList
   * @param {string} listUuid
   * @param {string} newName
   * @returns {Promise<any>}
   */
  public editTodoList(listUuid: string, newName: string): Promise<any> {
    return this.db.object(`/lists/${listUuid}/name`).set(newName);
  }

  /**
   * Remove a TodoList
   * @param {string} listUuid
   * @param {string} userID
   * @returns {Promise<any>}
   */
  public removeTodoList(listUuid: string, userID: string): Promise<any> {
    return this.firebase.database().ref(`/lists/${listUuid}`).once('value').then((snapshot) => {
      this.db.object(`/users/${userID}/lists/${listUuid}`).remove();
      if (snapshot.val().instances <= 1) {
        this.db.object(`/lists/${listUuid}`).remove();
      }
      else {
        this.db.object(`/lists/${listUuid}/instances`).set(--snapshot.val().instances);
        this.db.object(`/lists/${listUuid}/users/${userID}`).remove();
      }
    });
  }

  /**
   * Remove a TodoItem
   * @param {string} listUuid
   * @param {string} todoUuid
   * @param {string} userID
   * @returns {Promise<any>}
   */
  public removeTodo(listUuid: string, todoUuid: string, userID: string): Promise<any> {
    return this.db.object(`/lists/${listUuid}/items/${todoUuid}`).remove();
  }

  /**
   * Share a TodoList with another user, by providing it's ID
   * The other user will get a complete (full) access to the List
   * @param {string} listUuid
   * @param {string} userID
   * @returns {Promise<any>}
   */
  public shareTodoList(listUuid: string, userID: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.firebase.database().ref(`/users/${userID}`).once("value").then((snapshot) => {
        if (snapshot.val()) {
          this.db.list(`/users/${userID}/w-lists`).set(listUuid, listUuid);
          resolve('La liste a été partagée avec succès');
        }
        else {
          reject("L'email n'as pas été trouvé dans nos bases de données");
        }
      }).catch(() => {
        reject('Probleme de communication avec la base de donnée, veuillez réessayé plutard');
      });
    });
  }

  /**
   * Accept a TodoList sharing
   * @param {string} listUuid
   * @param {string} userID
   */
  acceptTodoListSharing(listUuid: string, userID: string) {
    this.firebase.database().ref(`/lists/${listUuid}`).once('value').then((snapshot) => {
      this.db.object(`/lists/${listUuid}/instances`).set(++snapshot.val().instances);
      this.db.list(`/lists/${listUuid}/users`).set(userID, userID);
      this.db.object(`/users/${userID}/w-lists/${listUuid}`).remove();
      this.db.list(`/users/${userID}/lists`).set(listUuid, listUuid);
    });
  }

  /**
   * Decline a TodoList Sharing
   * @param {string} listUuid
   * @param {string} userID
   */
  declineTodoListSharing(listUuid: string, userID: string) {
    this.db.object(`/users/${userID}/w-lists/${listUuid}`).remove();
  }

  /**
   * Get the list of the people whom can access the list
   * @param {string} listUuid
   * @returns {Observable<any>}
   */
  getSharedPeopleForList(listUuid: string): Observable<any> {
    return this.db.list(`/lists/${listUuid}/users`).valueChanges();
  }

  getStats(userID: string): Observable<any> {
    return this.db.object(`/stats/${userID}`).valueChanges();
  }


  incrementDoneTodoStats(userID: string) {
    this.firebase.database().ref(`/stats/${userID}`).once('value').then((snapshot) => {
        if(!snapshot.val() || !snapshot.val().doneTodoCount)
          this.db.object(`/stats/${userID}/doneTodoCount`).set(1);
        else
          this.db.object(`/stats/${userID}/doneTodoCount`).set(++snapshot.val().doneTodoCount);
    }).catch((msg)=>{
      console.log('snapshot error')
    });
  }
}
