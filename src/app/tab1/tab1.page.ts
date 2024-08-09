import { Component } from '@angular/core';
import { MonthComponent } from '../month/month.component';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page {
  month: string;

  months = [
    ['Janeiro', '#FFDDC1'], // Light Peach
    ['Fevereiro', '#FFD3B6'], // Peach
    ['Março', '#FFAAA5'], // Light Coral
    ['Abril', '#FF8B94'], // Coral
    ['Maio', '#D4A5A5'], // Rose Gold
    ['Junho', '#A8E6CF'], // Light Mint
    ['Julho', '#DCEDC1'], // Pale Green
    ['Agosto', '#FFD3B6'], // Light Apricot
    ['Setembro', '#FFAAA5'], // Light Coral
    ['Outubro', '#FF8B94'], // Coral
    ['Novembro', '#D4A5A5'], // Rose Gold
    ['Dezembro', '#F8B195'], // Soft Pink
  ];

  constructor(private modalCtrl: ModalController) {
    this.month = '';
  }

  async openMonthTasksModal(month: string) {
    const monthNumber = this.months.findIndex((m) => m[0] === month);

    const modal = await this.modalCtrl.create({
      component: MonthComponent,
      componentProps: {
        month: `2024-0${monthNumber + 1}`,
      },
    });

    return await modal.present();
  }
}
