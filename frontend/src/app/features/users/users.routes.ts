import { Routes } from '@angular/router';
import { UserListComponent } from './pages/user-list/user-list.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { adminGuard } from '../../core/guards/admin.guard';

export const USERS_ROUTES: Routes = [
  { path: 'profile', component: UserProfileComponent },
  { path: '', component: UserListComponent, canActivate: [adminGuard] },
];

