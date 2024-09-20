import { inject, Injectable } from '@angular/core';
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore, collection, addDoc, getDocs, CollectionReference } from 'firebase/firestore';
import { getAuth,onAuthStateChanged, User, Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { environment } from '../../enviromentConfig';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  private app: FirebaseApp;
  public firestore: Firestore;
  public auth: Auth;
  currentUser: User | null = null;

  constructor() {
    this.app = initializeApp(environment);
    this.firestore = getFirestore(this.app);
    this.auth = getAuth(this.app);
    this.initializeAuthListener();
  }

  private initializeAuthListener(): void {
    onAuthStateChanged(this.auth, (user: User | null) => {
      this.currentUser = user;
      if (user) {
        console.log("Usuario actual:", user);
      } else {
        console.log("No hay usuario autenticado.");
      }
    });
  }
  public getCurrentUser(): User | null {
    return this.currentUser;
  }

  async register(email: string, password: string): Promise<void> {
    try {
      await createUserWithEmailAndPassword(this.auth, email, password);
      console.log('User registered successfully');
    } catch (error) {
      throw error;
    }
  }

  async login(email: string, password: string): Promise<void> {
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
      console.log('User logged in successfully');
    } catch (error) {
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      console.log('User logout successfully');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }

  getUserLogged(){
    let afauth = inject(AngularFireAuth);
    return afauth.authState;
  }
}
