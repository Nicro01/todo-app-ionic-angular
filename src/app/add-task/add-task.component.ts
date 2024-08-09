import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TaskService } from '../services/task.service';
import { v4 as uuidv4 } from 'uuid';
import { toZonedTime, format } from 'date-fns-tz';

interface Task {
  id: string;
  title: string;
  description: string;
  datetime: string;
  isDone: boolean;
}

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss'],
})
export class AddTaskComponent {
  taskTitle: string = '';
  taskDescription: string = '';
  taskDatetime: Date = new Date();
  taskIsDone: boolean = false;

  tasks: Task[] = [];

  constructor(
    private modalCtrl: ModalController,
    private taskService: TaskService
  ) {}

  close() {
    this.modalCtrl.dismiss();
  }

  onDateTimeChange(event: CustomEvent) {
    this.taskDatetime = new Date(event.detail.value);
  }

  onIsDoneChange(event: CustomEvent) {
    this.taskIsDone = event.detail.checked;
  }

  saveTask() {
    if (this.taskTitle) {
      const timeZone = 'America/Sao_Paulo';

      const zonedDate = toZonedTime(this.taskDatetime, timeZone);

      const formattedDatetime = format(zonedDate, "yyyy-MM-dd'T'HH:mm:ssXXX", {
        timeZone,
      });

      const newTask: Task = {
        id: uuidv4(),
        title: this.taskTitle,
        description: this.taskDescription,
        datetime: formattedDatetime,
        isDone: this.taskIsDone,
      };

      this.taskService.addTask(newTask).then(() => {
        this.modalCtrl.dismiss();
      });
    }
  }
}
