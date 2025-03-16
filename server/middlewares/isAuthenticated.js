import { ClerkExpressWithAuth } from '@clerk/clerk-sdk-node';

const isAuthenticated = ClerkExpressWithAuth();

export default isAuthenticated;