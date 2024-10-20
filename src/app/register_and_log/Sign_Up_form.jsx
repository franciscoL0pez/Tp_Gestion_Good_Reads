import React from 'react';
import '/style.css';
const Sign_Up_form = () => {
    return (
        <div className = 'Signup-Container'> 
            <form className = 'Signup-form'>
                <h2>Sign Up</h2>
                <labe1 htmlFor ="email">
                Email:
                    <input type="text"/>
                </labe1>
            <labe1 htmlFor ="password">
                Password:
                    <input type="password"/>
                </labe1>
                <button> Sign Up</button>
                <p> Already Registered? <a>Login </a> </p>
            </form>
        </div>

    );
}
export default Sign_Up_form