import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, user, authState } from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { User } from '../models';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap, of, from, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  // Observable for guards to use
  user$ = user(this.auth);

  // Signal for components to use. 
  currentUser = toSignal(
    this.user$.pipe(
      switchMap(firebaseUser => {
        if (!firebaseUser) {
          this.updateCache(null);
          return of(null);
        }
        return from(getDoc(doc(this.firestore, 'users', firebaseUser.uid))).pipe(
          map(snap => {
            const userData = snap.exists() ? snap.data() as User : null;
            this.updateCache(userData);
            return userData;
          })
        );
      })
    ),
    { initialValue: this.getInitialUser() }
  );

  async signUp(email: string, password: string, username: string, bio?: string) {
    const credential = await createUserWithEmailAndPassword(this.auth, email, password);
    const user: User = {
      uid: credential.user.uid,
      email,
      username,
      bio: bio || '',
      profileImageUrl: ''
    };
    await setDoc(doc(this.firestore, 'users', user.uid), user);
    this.router.navigate(['/home']);
  }

  async signIn(email: string, password: string) {
    await signInWithEmailAndPassword(this.auth, email, password);
    this.router.navigate(['/home']);
  }

  async logout() {
    await signOut(this.auth);
    this.updateCache(null);
    this.router.navigate(['/login']);
  }

  private getInitialUser(): User | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    const cached = localStorage.getItem('user_session');
    return cached ? JSON.parse(cached) : null;
  }

  private updateCache(userData: User | null) {
    if (isPlatformBrowser(this.platformId)) {
      if (userData) {
        localStorage.setItem('user_session', JSON.stringify(userData));
      } else {
        localStorage.removeItem('user_session');
      }
    }
  }
}
