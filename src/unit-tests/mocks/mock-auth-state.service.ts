export class MockAuthStateService {
  isAuthenticated = jasmine.createSpy().and.returnValue(false);
}
