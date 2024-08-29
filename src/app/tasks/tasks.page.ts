import { Component, OnInit } from '@angular/core';
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
  selector: 'app-tasks',
  templateUrl: './tasks.page.html',
  styleUrls: ['./tasks.page.scss'],
})
export class TasksPage implements OnInit {
  tasks: Task[] = [];

  groupedTasks: { data: string; tasks: Task[] }[] = [];

  constructor(
    private taskService: TaskService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.taskService.getTasks().subscribe((tasks) => {
      this.tasks = tasks;
      this.groupTasksByDate();
    });
  }

  groupTasksByDate() {
    const taskMap: { [key: string]: Task[] } = {};

    this.tasks.forEach((task) => {
      const date = new Date(task.datetime).toLocaleDateString('pt-BR', {
        timeZone: 'America/Sao_Paulo',
      });

      if (!taskMap[date]) {
        taskMap[date] = [];
      }
      taskMap[date].push(task);
    });

    this.groupedTasks = Object.entries(taskMap)
      .map(([date, tasks]) => ({
        data: date,
        tasks: tasks,
      }))
      .sort((a, b) => {
        const dateA = new Date(a.data.split('/').reverse().join('-'));
        const dateB = new Date(b.data.split('/').reverse().join('-'));
        return dateB.getTime() - dateA.getTime();
      });
  }

  deleteTask(id: string) {
    this.taskService
      .deleteTask(id)
      .then(() => {
        this.loadTasks(); // Recarrega as tarefas
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
