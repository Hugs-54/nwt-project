import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { QuizComponent } from './quiz/quiz.component';
import { QuestionComponent } from './question/question.component';
import { CreateEditQuizComponent } from './create-edit-quiz/create-edit-quiz.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginRegisterComponent } from './login-register/login-register.component';
import { ButtonAccessQuizComponent } from './button-access-quiz/button-access-quiz.component';
import { QuizzesComponent } from './quizzes/quizzes.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { DetailsComponent } from './details/details.component';
import { ShowStatsComponent } from './show-stats/show-stats.component';

@NgModule({
  declarations: [
    AppComponent,
    QuizComponent,
    QuestionComponent,
    CreateEditQuizComponent,
    LoginRegisterComponent,
    ButtonAccessQuizComponent,
    QuizzesComponent,
    LeaderboardComponent,
    DetailsComponent,
    ShowStatsComponent,
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
