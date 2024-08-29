import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, AlertController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { TaskService } from '../services/task.service'; // Certifique-se de ter um serviço para gerenciar tarefas

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  profileForm: FormGroup;
  email?: string | null;
  totalTasks: number = 0;
  doneTasks: number = 0;
  notDoneTasks: number = 0;

  constructor(
    private fb: FormBuilder,
    private navCtrl: NavController,
    private afAuth: AngularFireAuth,
    private alertCtrl: AlertController,
    private taskService: TaskService
  ) {
    this.profileForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit() {
    this.loadUserData();
    this.loadTaskStats();
  }

  loadUserData() {
    this.afAuth.currentUser.then((user) => {
      if (user) {
        this.email = user.email;
        this.profileForm.patchValue({
          email: user.email,
        });
      }
    });
  }

  loadTaskStats() {
    this.taskService.getTasks().subscribe((tasks) => {
      this.totalTasks = tasks.length;
      this.doneTasks = tasks.filter((task) => task.isDone).length;
      this.notDoneTasks = tasks.filter((task) => !task.isDone).length;
    });
  }

  async changePassword() {
    const alert = await this.alertCtrl.create({
      header: 'Alterar Senha',
      inputs: [
        {
          name: 'currentPassword',
          type: 'password',
          placeholder: 'Senha Atual',
        },
        {
          name: 'newPassword',
          type: 'password',
          placeholder: 'Nova Senha',
        },
      ],
      buttons: [
        {
          text: 'Voltar',
          role: 'cancel',
        },
        {
          text: 'Salvar',
          handler: (data) => {
            this.updatePassword(data.currentPassword, data.newPassword);
          },
        },
      ],
    });

    await alert.present();
  }

  async changeEmail() {
    const alert = await this.alertCtrl.create({
      header: 'Alterar Email',
      inputs: [
        {
          name: 'newEmail',
          type: 'email',
          placeholder: 'Novo Email',
        },
      ],
      buttons: [
        {
          text: 'Voltar',
          role: 'cancel',
        },
        {
          text: 'Salvar',
          handler: (data) => {
            this.updateEmail(data.newEmail);
          },
        },
      ],
    });

    await alert.present();
  }

  updatePassword(currentPassword: string, newPassword: string) {
    this.afAuth.currentUser.then((user) => {
      if (user && user.email) {
        const credential = firebase.auth.EmailAuthProvider.credential(
          user.email,
          currentPassword
        );

        user
          .reauthenticateWithCredential(credential)
          .then(() => {
            user
              .updatePassword(newPassword)
              .then(() => {
                console.log('Password updated successfully');
              })
              .catch((error) => {
                console.error('Failed to update password', error);
              });
          })
          .catch((error) => {
            console.error('Reauthentication failed', error);
          });
      }
    });
  }

  updateEmail(newEmail: string) {
    this.afAuth.currentUser.then((user) => {
      if (user) {
        user
          .updateEmail(newEmail)
          .then(() => {
            console.log('Email updated successfully');
            this.email = newEmail;
          })
          .catch((error) => {
            console.error('Failed to update email', error);
          });
      }
    });
  }
}
