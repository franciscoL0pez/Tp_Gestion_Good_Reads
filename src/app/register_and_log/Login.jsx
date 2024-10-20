import React, { useState } from 'react';
import '/style.css';
import {auth} from './firebase'
import { signInWithEmailAndPassword } from 'firebase/auth';


// Hago lo mismo en el login
const Login = () => {
    const [email, setEmail ] = useState('');
    const [password, setPassword ] = useState('');

    const handleSubmit =  async(e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth,email, password);
            console.log("Login Success");

        } catch(err) {
            console.log(err);
        }
    }
    return (
        <div className = 'Signup-Container'> 
            <form className = 'Signup-form' onSubmit = {handleSubmit}>
                <h2>Login</h2>
                <labe1 htmlFor ="email">
                Email:
                    <input type="text" onChange = {(e) => setEmail(e.target.value)}/>
                </labe1>
            <labe1 htmlFor ="password">
                Password:
                    <input type="password" onChange = {(e) => setPassword(e.target.value)}/>
                </labe1>
                <button type  = 'submit'> Login </button>
                <p> Dont' have Account? <Link to ="/SignUp"> Login </Link> </p>
            </form>
        </div>

    );
}
export default Login