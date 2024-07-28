// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { auth } from '../firebase';
// import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
// import { getAuth, updatePassword, sendPasswordResetEmail } from "firebase/auth";
// import '../styles/auth.css';


// export const signUp = async (email, password) => {
//   try {
//     if (!email || !password) {
//       throw new Error('Please fill in all fields');
//     } else if (password.length < 6 || password.length > 10) {
//       throw new Error('Password must be between 6 and 10 characters');
//     } else if (!email.includes('@')) {
//       throw new Error('Please enter a valid email address');
//     }
//     // Check if user already exists
//     const userExists = await checkUserExists(email);
//     if (userExists) {
//       throw new Error('User already exists');
//     }
//     const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//     return userCredential.user;
//   } catch (error) {
//     throw error;
//   }
// };

// const checkUserExists = async (email) => {
//   try {
//     // Implement your logic to check if user exists
//     // For example, you can make an API call to your backend to check if the email is already registered
//     // Return true if user exists, false otherwise
//     return false;
//   } catch (error) {
//     throw error;
//   }
// };

// export const login = async (email, password) => {
//   try {
//     const userCredential = await signInWithEmailAndPassword(auth, email, password);
//     return userCredential.user;
//   } catch (error) {
//     throw error;
//   }
// };

// export const logout = async () => {
//   try {
//     await signOut(auth);
//   } catch (error) {
//     throw error;
//   }
// };

// export const verifyToken = async (idToken) => {
//   try {
//     const response = await fetch('http://localhost:5000/auth/verify-token', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ idToken }),
//     });
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error("Token verification error:", error);
//     throw error;
//   }
// };

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     if (!email || !password) {
//       setError('Please fill in all fields');
//       return;
//     }
//     try {
//       await login(email, password);
//       navigate('/');
//     } catch (error) {
//       setError('Failed to log in. Please check your credentials.');
//     }
//   };

//   const handleSignup = async () => {
//     try {
//       await signUp(email, password);
//       navigate('/');
//     } catch (error) {
//       setError('Failed to sign up. Please try again.');
//     }
//   };

//   const handleLogout = async () => {
//     try {
//       await logout();
//       navigate('/');
//     } catch (error) {
//       setError('Failed to log out. Please try again.');
//     }
//   };

// const handlePasswordReset = async (email) => {
//   try {
//     await sendPasswordResetEmail(auth, email);
//     // Password reset email sent!
//   } catch (error) {
//     console.error("Password reset error:", error);
//   }
// };

// const handleUpdatePassword = async (newPassword) => {
//   try {
//     const user = auth.currentUser;
//     await updatePassword(user, newPassword);
//     // Update successful.
//   } catch (error) {
//     console.error("Update password error:", error);
//   }
// };

//   return (
//     <div className="login-container">
//       <div className="login-frame">
//         <div className="login-content">
//           <h1 className="login-title">LOG IN</h1>
//           <p className="login-subtitle">Access Your Galactic Account</p>
//           {error && <p className="error-message">{error}</p>}
//           <form onSubmit={handleLogin}>
//             <div className="input-group">
//               <input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 placeholder="Cosmic Email"
//                 className="login-input"
//               />
//             </div>
//             <div className="input-group">
//               <input
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 placeholder="Galactic Password"
//                 className="login-input"
//               />
//             </div>
//             <button type="submit" className="login-button">INITIATE</button>
//           </form>
//           <div className="login-options">
//             <a href="#" className="forgot-password" onClick={handlePasswordReset}>Coordinates?</a>
//             <a href="#" className="create-account" onClick={handleSignup}>Create Starship Account</a>
//             <a href="#" className="logout" onClick={handleLogout}>Home</a>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail, updatePassword, deleteUser as deleteAuthUser } from 'firebase/auth';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import '../styles/auth.css';

// Function to handle user signup
const signUp = async (email, password, username) => {
  try {
    if (!email || !password || !username) {
      throw new Error('Please fill in all fields');
    } else if (password.length < 6 || password.length > 10) {
      throw new Error('Password must be between 6 and 10 characters');
    } else if (!email.includes('@')) {
      throw new Error('Please enter a valid email address');
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    // Save user information in Firestore
    await setDoc(doc(db, "users", uid), {
      username,
      email,
      creationDate: new Date(),
    });

    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

// Function to handle user login
const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

// Function to handle user logout
const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};

// Function to handle user deletion
const handleDeleteAccount = async () => {
  const user = auth.currentUser;

  if (user) {
    const uid = user.uid;
    try {
      // Delete the Firestore document first
      await deleteDoc(doc(db, "users", uid));
      // Then delete the user authentication account
      await deleteAuthUser(user);
      console.log("User deleted successfully!");
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete account. Please try again.");
    }
  }
};

// Main Login component
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isSignup, setIsSignup] = useState(true);
  const navigate = useNavigate();

  // Handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    try {
      await login(email, password);
      navigate('/');
    } catch (error) {
      setError('Failed to log in. Please check your credentials.');
    }
  };

  // Handle signup form submission
  const handleSignup = async (e) => {
    e.preventDefault();
    if (!username) {
      setError('Please fill in all fields');
      return;
    }
    try {
      await signUp(email, password, username);
      navigate('/');
    } catch (error) {
      setError('Failed to sign up. Please try again.');
    }
  };

  // Handle password reset
  const handlePasswordReset = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      console.log("Password reset email sent!");
    } catch (error) {
      console.error("Password reset error:", error);
    }
  };

  // Handle password update
  const handleUpdatePassword = async (newPassword) => {
    try {
      const user = auth.currentUser;
      await updatePassword(user, newPassword);
      console.log("Password updated successfully!");
    } catch (error) {
      console.error("Update password error:", error);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      setError('Failed to log out. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-frame">
        <div className="login-content">
          <h1 className="login-title">{isSignup ? 'Sign Up' : 'Log In'}</h1>
          <p className="login-subtitle">Access Your Galactic Account</p>
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={isSignup ? handleSignup : handleLogin}>
            {isSignup && (
              <div className="input-group">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Cosmic Username"
                  className="login-input"
                />
              </div>
            )}
            <div className="input-group">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Cosmic Email"
                className="login-input"
              />
            </div>
            <div className="input-group">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Galactic Password"
                className="login-input"
              />
            </div>
            <button type="submit" className="login-button">{isSignup ? 'Create Starship Account' : 'INITIATE'}</button>
          </form>
          <div className="login-options">
            <a href="#" className="forgot-password" onClick={handlePasswordReset}>Coordinates?</a>
            <a href="#" className="create-account" onClick={() => setIsSignup(!isSignup)}>
              {isSignup ? 'Switch to Log In' : 'Create Starship Account'}
            </a>
            <a href="#" className="logout" onClick={handleLogout}>Home</a>
            <a href="#" className="delete-account" onClick={handleDeleteAccount}>Delete Account</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
