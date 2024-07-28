// // src/components/Navigation.js

// import React from 'react';
// import { Link } from 'react-router-dom';

// function Navigation() {
//   return (
//     <nav>
//       <ul>
//         <li><Link to="/">Home</Link></li>
//         <li><Link to="/chart">Chart</Link></li>
//         <li><Link to="/particles">Particles</Link></li>
//       </ul>
//     </nav>
//   );
// }

// export default Navigation;

// src/components/Navigation.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

const Navigation = () => {
  const [user] = useAuthState(auth);

  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/chart">Chart</Link></li>
        <li><Link to="/particles">Particles</Link></li>
        {user ? (
          <>
            <li>{user.email}</li>
            <li><button onClick={handleLogout}>Logout</button></li>
          </>
        ) : (
          <li><Link to="/auth">Login</Link></li>
        )}
      </ul>
    </nav>
  );
};

export default Navigation;

