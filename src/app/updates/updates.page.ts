import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { map } from 'rxjs/operators';

interface Blog {
  title: string;
  category: string;
  snippet: string;
  fullText: string;
  imageUrl: string;
  timestamp: string;
}

@Component({
  selector: 'app-updates',
  templateUrl: './updates.page.html',
  styleUrls: ['./updates.page.scss'],
  standalone: false,
})
export class UpdatesPage implements OnInit {

  newsList: Blog[] = [];
  expandedIndex: number = -1;

  constructor(private db: AngularFireDatabase) {}

  ngOnInit() {
    this.db.list<Blog>('blogs').snapshotChanges().pipe(
      map(changes => 
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() as Blog }))
      )
    ).subscribe(data => {
      this.newsList = data.reverse(); // newest first
    });
  }

  toggleDetail(index: number) {
    this.expandedIndex = this.expandedIndex === index ? -1 : index;
  }

  isExpanded(index: number): boolean {
    return this.expandedIndex === index;
  }
}
