import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  menuItems = [
    {
      id: 1,
      name: 'Hamburger',
      description: 'Juicy beef patty with fresh lettuce, tomato, and special sauce in a toasted bun',
      price: '₹299',
      modelUrl: 'assets/models/carbonara.glb',
      imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60',
      category: 'Main Course'
    },
    {
      id: 2,
      name: 'Sandwich',
      description: 'Freshly made sandwich with your choice of meat, cheese, and vegetables',
      price: '₹199',
      modelUrl: 'assets/models/caesar-salad.glb',
      imageUrl: 'https://images3.alphacoders.com/868/thumb-1920-868525.jpg',
      category: 'Starters'
    }
  ];

  selectedItem: any = null;

  constructor() { }

  ngOnInit(): void { }

  selectItem(item: any) {
    this.selectedItem = item;
  }

  viewIn3D(item: any) {
    // Implement 3D view logic
    console.log('Viewing in 3D:', item);
  }

  viewInAR(item: any) {
    // Implement AR view logic
    console.log('Viewing in AR:', item);
  }
}
