export class AuthStateServiceMock {
  isAuthenticated = jasmine.createSpy().and.returnValue(false);
}
