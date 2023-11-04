import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuizComponent } from './quiz/quiz.component';
import { CreateQuizComponent } from './create-quiz/create-quiz.component';
import { LoginRegisterComponent } from './login-register/login-register.component';
import { QuizzesComponent } from './quizzes/quizzes.component';

const routes: Routes = [
  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: 'login', component: LoginRegisterComponent },
  { path: 'quiz/:id', component: QuizComponent },
  { path: 'my-quizzes', component: QuizzesComponent },
  { path: 'shared-quizzes', component: QuizzesComponent },
  { path: 'create-quiz', component: CreateQuizComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
