import { Component, OnInit, Inject } from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  dishes: Dish[];
  selectedDish: Dish;
  errMess: string;
  
  constructor(private dishService: DishService,
    @Inject('BaseURL') public BaseURL: any) { }
  
  ngOnInit(): void {
    this.dishService.getDishes()
      .subscribe({
        next: (dishes) => this.dishes = dishes,
        error: (errmess) => this.errMess = errmess
      })
  }
  
  onSelect(dish: Dish) {
    this.selectedDish = dish;
  }
}
