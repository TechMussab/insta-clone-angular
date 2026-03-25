import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take, filter } from 'rxjs/operators';
import { toObservable } from '@angular/core/rxjs-interop';

export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // On the server (SSR), we allow the navigation so the client can pick up the session.
  if (isPlatformServer(platformId)) return true;

  return toObservable(authService.currentUser).pipe(
    // Wait until the auth state is definitive (either a User object or null)
    filter(user => user !== undefined),
    map(user => !!user || router.createUrlTree(['/login'])),
    take(1)
  );
};
