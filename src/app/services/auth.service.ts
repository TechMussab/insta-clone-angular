import { Injectable, signal } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, user } from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { User } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser = signal<User | null>(null);
  user$;

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private router: Router
  ) {
    this.user$ = user(this.auth);
    this.user$.subscribe(async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(this.firestore, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          this.currentUser.set(userDoc.data() as User);
        }
      } else {
        this.currentUser.set(null);
      }
    });
  }

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
    this.currentUser.set(user);
    this.router.navigate(['/home']);
  }

  async signIn(email: string, password: string) {
    await signInWithEmailAndPassword(this.auth, email, password);
    this.router.navigate(['/home']);
  }

  async logout() {
    await signOut(this.auth);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }
}
