import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-events',
  templateUrl: './events.page.html',
  styleUrls: ['./events.page.scss'],
})
export class EventsPage implements OnInit {
  events: any[] = [];

  constructor(private navCtrl: NavController, private http: HttpClient) { }

  ngOnInit() {
    this.loadEvents();
  }

  loadEvents() {
    this.http.get<any[]>('http://localhost:3000/events')
      .subscribe(data => {
        this.events = data;
      }, error => {
        console.error('Error loading events', error);
      });
  }

  openCreateEventPage() {
    this.navCtrl.navigateForward('/tabs/events/add-event');
  }
}