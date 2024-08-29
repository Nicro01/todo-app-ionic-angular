import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TaskService } from '../services/task.service';
import { AlertController } from '@ionic/angular';

interface Task {
  id: string;
  title: string;
  description: string;
  datetime: string;
  isDone: boolean;
}

@Component({
  selector: 'app-month',
  templateUrl: './month.component.html',
  styleUrls: ['./month.component.scss'],
})
export class MonthComponent implements OnInit {
  @Input() month!: string;
  tasks: Task[] = [];

  constructor(
    private taskService: TaskService,
    private modalCtrl: ModalController,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.taskService
      .getTasksByMonth(this.month)
      .then((tasks) => {
        this.tasks = tasks;
      })
      .catch((error) => {
        console.error('Erro ao buscar tarefas para o mês:', error);
      });
  }

  close() {
    this.modalCtrl.dismiss();
  }

  deleteTask(id: string) {
    this.taskService
      .deleteTask(id)
      .then(() => {
        this.loadTasks();
      })
      .catch((error) => {
        console.error('Failed to delete task', error);
      });
  }

  async archiveTask(task: Task) {
    this.taskService.archiveTask(task.id).then(() => {
      this.loadTasks();
    });
  }

  async editTask(task: Task) {
    const alert = await this.alertController.create({
      header: 'Edit Task',
      inputs: [
        {
          name: 'title',
          type: 'text',
          value: task.title,
          placeholder: 'Task title',
        },
        {
          name: 'description',
          type: 'textarea',
          value: task.description,
          placeholder: 'Task description',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Save',
          handler: (data) => {
            this.taskService
              .updateTask(task.id, data)
              .then(() => {
                this.loadTasks();
              })
              .catch((error) => {
                console.error('Failed to update task', error);
              });
          },
        },
      ],
    });

    await alert.present();
  }
}
