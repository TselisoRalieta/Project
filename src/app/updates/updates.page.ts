import { Component } from '@angular/core';

@Component({
  selector: 'app-updates',
  templateUrl: './updates.page.html',
  styleUrls: ['./updates.page.scss'],
  standalone: false,
})
export class UpdatesPage {
  // Sample news data
  newsList = [
    {
      title: 'Robredo: Elections just start of bigger battle',
      category: 'Politics',
      snippet: 'MAY 12, 2022 - For Vice President Leni Robredo, the outcome of the May 9 elections is just the beginning of the bigger battle.',
      imageUrl: 'assets/news1.jpg', // Sample image path
      fullText: 'MAY 12, 2022 - For Vice President Leni Robredo, the outcome of the May 9 elections is just the beginning of the bigger battle. Without directly acknowledging defeat, Robredo reiterated her call to supporters on Tuesday night to accept the final results, whatever these may be...',
    },
    {
      title: 'Comelec throws out DQ appeals vs BBM',
      category: 'Politics',
      snippet: 'The Commission on Elections has dismissed several disqualification cases filed against presidential aspirant Ferdinand Marcos Jr.',
      imageUrl: 'assets/news2.jpg', // Sample image path
      fullText: 'The Commission on Elections has dismissed several disqualification cases filed against presidential aspirant Ferdinand Marcos Jr. These cases were filed by various groups and individuals seeking to prevent him from running for president...',
    },
    // More articles can be added here
    {
      title: 'Comelec throws out DQ appeals vs BBM',
      category: 'Politics',
      snippet: 'The Commission on Elections has dismissed several disqualification cases filed against presidential aspirant Ferdinand Marcos Jr.',
      imageUrl: 'assets/news2.jpg', // Sample image path
      fullText: 'The Commission on Elections has dismissed several disqualification cases filed against presidential aspirant Ferdinand Marcos Jr. These cases were filed by various groups and individuals seeking to prevent him from running for president...',
    },
    {
      title: 'Comelec throws out DQ appeals vs BBM',
      category: 'Politics',
      snippet: 'The Commission on Elections has dismissed several disqualification cases filed against presidential aspirant Ferdinand Marcos Jr.',
      imageUrl: 'assets/news2.jpg', // Sample image path
      fullText: 'The Commission on Elections has dismissed several disqualification cases filed against presidential aspirant Ferdinand Marcos Jr. These cases were filed by various groups and individuals seeking to prevent him from running for president...',
    },
    {
      title: 'Comelec throws out DQ appeals vs BBM',
      category: 'Politics',
      snippet: 'The Commission on Elections has dismissed several disqualification cases filed against presidential aspirant Ferdinand Marcos Jr.',
      imageUrl: 'assets/news2.jpg', // Sample image path
      fullText: 'The Commission on Elections has dismissed several disqualification cases filed against presidential aspirant Ferdinand Marcos Jr. These cases were filed by various groups and individuals seeking to prevent him from running for president...',
    },
  ];

  // To track which news item is expanded
  expandedIndex: number = -1;

  // Toggle function to expand or collapse news detail
  toggleDetail(index: number) {
    this.expandedIndex = this.expandedIndex === index ? -1 : index; // Toggle the expanded section
  }

  // Check if the current news item is expanded
  isExpanded(index: number): boolean {
    return this.expandedIndex === index;
  }
}
