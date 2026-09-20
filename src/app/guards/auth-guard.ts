import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  const isAuthenticated = confirm('Are you a certified Pokemon Trainer? (Press OK to enter)');
  
  if (isAuthenticated) {
    return true; // Allow access
  } else {
    router.navigate(['/']); // Redirect to home
    return false; // Block access
  }
};