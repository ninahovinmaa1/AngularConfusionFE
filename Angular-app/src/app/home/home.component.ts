import { Component, Inject, OnInit } from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { Promotion } from '../shared/promotion';
import { PromotionService } from '../services/promotion.service';
import { LeaderService } from '../services/leader.service';
import { Leader } from '../shared/leader';
import { flyInOut, expand } from '../animations/app.animations';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
  },
  animations: [
    flyInOut(),
    expand()
  ]
})
export class HomeComponent implements OnInit {

  dish: Dish;
  promotion: Promotion;
  leader: Leader;
  dishErrMess: string;
  promotionErrMess: string;
  leaderErrMess: string;

  constructor(private dishService: DishService,
    private promotionService: PromotionService,
    private leaderService: LeaderService,
    @Inject('BaseURL') public BaseURL: any) { }

  ngOnInit(): void {
    this.dishService.getFeaturedDish()
      .subscribe({
        next: (dish) => this.dish = dish,
        error: (errmess) => this.dishErrMess = <any>errmess
      })
      
    this.promotionService.getFeaturedPromotion()
      .subscribe({
        next: (promotion) => this.promotion = promotion,
        error: (errmess) => this.promotionErrMess = <any>errmess
      });

    this.leaderService.getFeaturedLeader()
      .subscribe({
        next: (leader) => this.leader = leader,
        error: (errmess) => this.leaderErrMess = <any>errmess
      });
  }

}
