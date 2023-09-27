import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Dish } from '../shared/dish';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { DishService } from '../services/dish.service';
import { switchMap } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Comment } from '../shared/comment';
import { visibility, flyInOut, expand } from '../animations/app.animations';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
  },
  animations: [
    visibility(),
    flyInOut(),
    expand()
  ]
})
export class DishdetailComponent implements OnInit {

  dish: Dish | null;
  dishIds: string[];
  prev: string;
  next: string;
  commentForm: FormGroup;
  comment: Comment;
  errMess: string;
  dishcopy: Dish | null;
  @ViewChild('cform') commentFormDirective: any;
  visibility = 'shown';

  formErrors: any = {
    rating: '',
    comment: '',
    author: ''
  }

  validationMessages: any = {
    'comment': {
      'required': 'Comment is required'
    },
    'author': {
      'required': 'Name is required',
      'minlength': 'Name must be at least 2 characters long'
    }
  }

  constructor(
    private dishService: DishService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    @Inject('BaseURL') public BaseURL: any
  ) { }

  ngOnInit(): void {
    this.dishService.getDishIds()
      .subscribe(dishIds => this.dishIds = dishIds);

    this.route.params
      .pipe(switchMap((params: Params) => {
        this.visibility = 'hidden';
        return this.dishService.getDish(params['id']);
      }))
      .subscribe({
        next: dish => { 
          this.dish = dish; 
          this.dishcopy = dish;
          this.setPrevNext(dish.id);
          this.visibility = 'shown';
        },
        error: errmess => this.errMess = <any>errmess
      })

    this.createForm();
  }

  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }

  goBack() {
    this.location.back();
  }

  createForm() {
    this.commentForm = this.fb.group({
      rating: 5,
      comment: ['', Validators.required],
      author: ['', [Validators.required, Validators.minLength(2)]],
    })
    this.commentForm.valueChanges
      .subscribe(data => this.onValueChanged(data));
    this.onValueChanged(); //reset validation messages
  }

  onValueChanged(data?: any){
    if (!this.commentForm) {
      return
    }
    const form = this.commentForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        //clear previous error message (if any)
        this.formErrors[field]='';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  onSubmit() {
    this.comment = this.commentForm.value;
    this.comment.date = new Date().toISOString();
    this.dishcopy?.comments.push(this.comment);
    this.dishService.putDish(this.dishcopy!)
      .subscribe({
        next: dish => {
          this.dish = dish;
          this.dishcopy = dish;
        },
        error: errmess => { 
          this.dish = null;
          this.dishcopy = null;
          this.errMess = <any>errmess
        }
      })
    //set form back to pristine
    this.commentFormDirective.resetForm();
    //reset values to default
    this.commentForm.reset({
      rating: 5,
      comment: '',
      author: '',
    })
  }

}
