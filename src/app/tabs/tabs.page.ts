import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { AddTaskComponent } from '../add-task/add-task.component';
import { Share } from '@capacitor/share';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage {
  activeTab: string = '';

  constructor(private router: Router, private modalCtrl: ModalController) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.setActiveTab(event.urlAfterRedirects);
      }
    });
  }

  async openAddTaskModal() {
    const modal = await this.modalCtrl.create({
      component: AddTaskComponent,
    });
    return await modal.present();
  }

  async shareMessage() {
    await Share.share({
      title: 'Compartilhar Tarefa',
      text: 'Olha só essa tarefa que estou trabalhando!',
      url: 'https://example.com',
      dialogTitle: 'Compartilhar via',
    });
  }

  setActiveTab(url: string) {
    if (url.includes('tab1')) {
      this.activeTab = 'tab1';
    } else if (url.includes('tab2')) {
      this.activeTab = 'tab2';
    } else if (url.includes('tab3')) {
      this.activeTab = 'tab3';
    } else if (url.includes('tab4')) {
      this.activeTab = 'tab4';
    } else if (url.includes('tab5')) {
      this.activeTab = 'tab5';
    }
  }
}
