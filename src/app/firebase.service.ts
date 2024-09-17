import { Injectable } from '@angular/core';
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore, collection, addDoc, getDocs, CollectionReference } from 'firebase/firestore';
import { getAuth, Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { environment } from '../enviromentConfig';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  private app: FirebaseApp;
  public firestore: Firestore;
  public auth: Auth;

  constructor() {
    this.app = initializeApp(environment);
    this.firestore = getFirestore(this.app);
    this.auth = getAuth(this.app);
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
}
