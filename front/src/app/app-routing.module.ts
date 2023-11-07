import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuizComponent } from './quiz/quiz.component';
import { CreateEditQuizComponent } from './create-edit-quiz/create-edit-quiz.component';
import { LoginRegisterComponent } from './login-register/login-register.component';
import { QuizzesComponent } from './quizzes/quizzes.component';
import { ShowStatsComponent } from './show-stats/show-stats.component';

const routes: Routes = [
  { path: '', redirectTo: '', pathMatch: 'full' },
  { path: 'authentication', component: LoginRegisterComponent },
  { path: 'quiz/:id', component: QuizComponent },
  { path: 'my-quizzes', component: QuizzesComponent },
  { path: 'shared-quizzes', component: QuizzesComponent },
  { path: 'create-quiz', component: CreateEditQuizComponent },
  { path: 'edit-quiz', component: CreateEditQuizComponent },
  { path: 'show-stats/:id', component: ShowStatsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
