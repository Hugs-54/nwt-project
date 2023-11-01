import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { QuizComponent } from './quiz/quiz.component';
import { QuestionComponent } from './question/question.component';
import { CreateQuizComponent } from './create-quiz/create-quiz.component';
import { HttpClientModule } from '@angular/common/http';
import { MyQuizzesComponent } from './my-quizzes/my-quizzes.component';
import { SharedQuizzesComponent } from './shared-quizzes/shared-quizzes.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    QuizComponent,
    QuestionComponent,
    CreateQuizComponent,
    MyQuizzesComponent,
    SharedQuizzesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
