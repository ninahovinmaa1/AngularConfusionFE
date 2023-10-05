import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { baseURL } from '../shared/baseurl';
import { ProcessHTTPMsgService } from './process-httpmsg.service';
import { Feedback } from '../shared/feedback';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  constructor(
    private http: HttpClient,
    private processHTTPMsgService: ProcessHTTPMsgService
  ) { }

  putFeedback(feedback: Feedback): Observable<Feedback> {
    console.log("service: ", feedback)
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }

    return this.http.post<Feedback>(baseURL + 'feedback', feedback, httpOptions)
      .pipe(catchError(this.processHTTPMsgService.handleError));
  }
}
