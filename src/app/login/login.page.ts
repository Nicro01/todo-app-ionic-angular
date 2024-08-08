import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private navCtrl: NavController,
    private afAuth: AngularFireAuth
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(2)]],
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.afAuth
        .signInWithEmailAndPassword(email, password)
        .then(() => {
          this.navCtrl.navigateRoot('/tabs');
        })
        .catch((error) => {
          console.error('Login failed', error);
        });
    }
  }

  navigateToRegister() {
    this.navCtrl.navigateRoot('/register');
  }
}
