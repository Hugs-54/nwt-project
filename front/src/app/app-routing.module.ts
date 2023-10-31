import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuizComponent } from './quiz/quiz.component';
import { CreateQuizComponent } from './create-quiz/create-quiz.component';
import { MyQuizzesComponent } from './my-quizzes/my-quizzes.component';
import { SharedQuizzesComponent } from './shared-quizzes/shared-quizzes.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'quiz/:id', component: QuizComponent },
  { path: 'my-quizzes', component: MyQuizzesComponent },
  { path: 'create-quiz', component: CreateQuizComponent },
  { path: 'shared-quizzes', component: SharedQuizzesComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
