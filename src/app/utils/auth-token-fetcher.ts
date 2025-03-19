import {AuthRequest} from '@src/app/models/auth.model';
import {PizzaService} from '@src/app/services/pizza.service';
import {AuthStateService} from '@src/app/services/auth-state.service';
import {ToastrService} from 'ngx-toastr';

export function fetchAuthTokenAgain(pizzaService: PizzaService, authState: AuthStateService, toast: ToastrService) {
  return fetchAuthToken(pizzaService, authState, toast, authState.username, authState.password);
}

export function fetchAuthToken(pizzaService: PizzaService, authState: AuthStateService, toast: ToastrService, username: string | null, password: string | null) {
  if (!username || !password) return;

  const authRequest: AuthRequest = {
    username: username,
    password: password,
  }

  pizzaService.getAuthToken(authRequest).subscribe({
    next: (res) => {
      authState.setAuth(username, password, res.body?.access_token ?? null);
    },
    error: (err) => {
      if (err.status === 400) {
        toast.error(err.error.msg, "Error");
      } else {
        toast.error(err.error.msg, "Unauthorized");
      }
    }
  });
}
