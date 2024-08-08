import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private navCtrl: NavController,
    private afAuth: AngularFireAuth
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onRegister() {
    if (this.registerForm.valid) {
      const { email, password } = this.registerForm.value;
      this.afAuth
        .createUserWithEmailAndPassword(email, password)
        .then(() => {
          this.navCtrl.navigateRoot('/login');
        })
        .catch((error) => {
          console.error('Registration failed', error);
        });
    }
  }

  navigateToLogin() {
    this.navCtrl.navigateRoot('/login');
  }
}
