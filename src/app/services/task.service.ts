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
  isDone: boolean;
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

  getTasksByMonth(month: string): Promise<Task[]> {
    console.log(month);

    const startOfMonth = new Date(`${month}-01T00:00:00Z`).toISOString();
    const endOfMonth = new Date(`${month}-01T00:00:00Z`);
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    const endOfMonthISO = endOfMonth.toISOString();

    console.log(startOfMonth, endOfMonthISO);

    return this.tasksCollection.ref
      .where('datetime', '>=', startOfMonth)
      .where('datetime', '<', endOfMonthISO)
      .get()
      .then((querySnapshot) => {
        const tasks: Task[] = [];

        querySnapshot.forEach((doc) => {
          tasks.push(doc.data() as Task);
        });

        return tasks;
      });
  }

  archiveTask(id: string): Promise<void> {
    return this.tasksCollection
      .doc(id)
      .get()
      .toPromise()
      .then((docSnapshot) => {
        if (docSnapshot && docSnapshot.exists) {
          const currentIsDone = docSnapshot.data()?.isDone;
          return this.tasksCollection
            .doc(id)
            .update({ isDone: !currentIsDone });
        } else {
          throw new Error('Document not found');
        }
      })
      .catch((error) => {
        console.error('Error updating task:', error);
        throw error;
      });
  }
}
