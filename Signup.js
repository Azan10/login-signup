import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import { auth } from "./firebase";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const db = getDatabase();

  const handleFullName = (event) => {
    setFullName(event.target.value);
  };

  const handleEmail = (event) => {
    setEmail(event.target.value);
  };

  const handlePassword = (event) => {
    setPassword(event.target.value);
  };

  const handleConfirmPassword = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handleForm = (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
    } else {
      setError("");
      navigate("/home");
  
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          const uid = user.uid;
          const userRef = ref(db, `users/${uid}`);
  
          // Add user data to the Firebase database
          set(userRef, {
            fullName: fullName,
            email: email,
            isAdmin:false
           
          })
          .then(() => {
            console.log("User added to database");
          })
          .catch((error) => {
            console.error(error);
            setError(error.message);
          });
        })
        .catch((error) => {
          console.error(error);
          setError(error.message);
        });
    }
  };
  
     

  return (
    <form onSubmit={handleForm}>
      <h1>Sign up</h1>
      <input
        type="text"
        placeholder="Your Name"
        required
        onChange={handleFullName}
      />
      <input
        type="email"
        placeholder="Your Email"
        required
        onChange={handleEmail}
      />
      <input
        type="password"
        placeholder="Password"
        required
        onChange={handlePassword}
      />
      <input
        type="password"
        placeholder="Repeat your password"
        required
        onChange={handleConfirmPassword}
      />

      <button>Sign up</button>
      {error && <p>{error}</p>}
    </form>
  );
}

export default Signup;


