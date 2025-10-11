import { Component } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';

interface Blog {
  title: string;
  category: string;
  snippet: string;
  fullText: string;
  imageUrl: string;
  timestamp?: string;
}

@Component({
  selector: 'app-blog',
  templateUrl: './blog.page.html',
  styleUrls: ['./blog.page.scss'],
  standalone: false,
})
export class BlogPage {

  blog: Blog = {
    title: '',
    category: '',
    snippet: '',
    fullText: '',
    imageUrl: ''
  };

  constructor(private db: AngularFireDatabase) {}

  submitBlog() {
    if (!this.blog.title || !this.blog.fullText || !this.blog.category) {
      alert('Please fill in all required fields');
      return;
    }

    this.blog.timestamp = new Date().toISOString();

    // Push blog to Firebase
    this.db.list('blogs').push(this.blog)
      .then(() => {
        // Push a notification for this new blog
        this.db.list('notifications').push({
          title: `New Blog: ${this.blog.title}`,
          description: this.blog.snippet || this.blog.fullText.substring(0, 50),
          timestamp: this.blog.timestamp
        });

        alert('Blog submitted successfully!');
        this.blog = { title: '', category: '', snippet: '', fullText: '', imageUrl: '' };
      })
      .catch(err => alert('Error: ' + err));
  }
}
