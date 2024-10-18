import { CanActivateFn, Router } from '@angular/router';
import { FirebaseService } from '../servicios/firebase.service';
import { inject } from '@angular/core';


export const guardDeJuegosGuard: CanActivateFn = (route, state) => {
  const firebase = inject(FirebaseService);
  const router = inject(Router);

  if(firebase.getCurrentUser() != null){
    return true;
  }
  else{
    router.navigate(['/login']);
    return false;
  }
};
