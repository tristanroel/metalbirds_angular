import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionStorageService } from '../services/session-storage.service';

export const authGuard: CanActivateFn = (route, state) => {
  return inject(SessionStorageService).isConnected
  ? true 
  : inject(Router).createUrlTree(['/login']);
};
