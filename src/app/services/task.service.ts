import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface Task {
  id: string;
  title: string;
  description: string;
  datetime: string;
}

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private tasksCollection: AngularFirestoreCollection<Task>;
  tasks: Observable<Task[]>;

  constructor(private afs: AngularFirestore) {
    this.tasksCollection = afs.collection<Task>('tasks');
    this.tasks = this.tasksCollection.snapshotChanges().pipe(
      map((actions) =>
        actions.map((a) => {
          const data = a.payload.doc.data() as Task;
          const id = a.payload.doc.id;
          return { ...data, id };
        })
      )
    );
  }

  getTasks(): Observable<Task[]> {
    return this.tasks;
  }

  addTask(task: Task): Promise<void> {
    const id = this.afs.createId();
    return this.tasksCollection.doc(id).set({ ...task, id });
  }

  deleteTask(id: string): Promise<void> {
    return this.tasksCollection.doc(id).delete();
  }

  updateTask(id: string, task: Task): Promise<void> {
    return this.tasksCollection.doc(id).update({ ...task });
  }
}
