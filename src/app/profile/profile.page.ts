import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  profileForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private navCtrl: NavController,
    private afAuth: AngularFireAuth
  ) {
    this.profileForm = this.fb.group({
      username: ['', [Validators.required]],
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit() {
    this.loadUserData();
  }

  loadUserData() {
    this.afAuth.currentUser.then((user) => {
      if (user) {
        this.profileForm.patchValue({
          username: user.displayName,
        });
      }
    });
  }

  onUpdateProfile() {
    if (this.profileForm.valid) {
      const { username, currentPassword, newPassword } = this.profileForm.value;

      this.afAuth.currentUser.then((user) => {
        if (user && user.email) {
          // Reautenticar o usuário
          const credential = firebase.auth.EmailAuthProvider.credential(
            user.email,
            currentPassword
          );

          user
            .reauthenticateWithCredential(credential)
            .then(() => {
              // Atualizar o nome de usuário
              user
                .updateProfile({ displayName: username })
                .then(() => {
                  // Atualizar a senha
                  user
                    .updatePassword(newPassword)
                    .then(() => {
                      console.log('Profile updated successfully');
                      this.navCtrl.navigateRoot('/tabs/tab1');
                    })
                    .catch((error) => {
                      console.error('Failed to update password', error);
                    });
                })
                .catch((error) => {
                  console.error('Failed to update username', error);
                });
            })
            .catch((error) => {
              console.error('Reauthentication failed', error);
            });
        }
      });
    }
  }
}
