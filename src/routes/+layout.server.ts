import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
  // Get session from cookies
  const sessionToken = event.cookies.get('session_token');
  const userInfo = event.cookies.get('user_info');
  
  let session = null;
  
  if (sessionToken && userInfo) {
    try {
      const user = JSON.parse(userInfo);
      session = {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      };
    } catch (error) {
      console.error('Error parsing user info:', error);
    }
  }

  return {
    session
  };
};