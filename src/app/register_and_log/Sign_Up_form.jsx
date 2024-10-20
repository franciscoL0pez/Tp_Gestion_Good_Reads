import React, { useState } from 'react';
import '/style.css';
import {auth} from './firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth';


// Hago lo mismo en el login
const Sign_Up_form = () => {
    const [email, setEmail ] = useState('');
    const [password, setPassword ] = useState('');

    const handleSubmit =  async(e) => {
        e.preventDefault();
        try {
            await createUserWithEmailAndPassword(auth,email, password);
            console.log("Acount Created");

        } catch(err) {
            console.log(err);
        }
    }
    return (
        <div className = 'Signup-Container'> 
            <form className = 'Signup-form' onSubmit = {handleSubmit}>
                <h2>Sign Up</h2>
                <labe1 htmlFor ="email">
                Email:
                    <input type="text" onChange = {(e) => setEmail(e.target.value)}/>
                </labe1>
            <labe1 htmlFor ="password">
                Password:
                    <input type="password" onChange = {(e) => setPassword(e.target.value)}/>
                </labe1>
                <button type  = 'submit'> Sign Up</button>
                <p> Already Registered? <Link to ="/login"> Login </Link> </p>
            </form>
        </div>

    );
}
export default Sign_Up_form