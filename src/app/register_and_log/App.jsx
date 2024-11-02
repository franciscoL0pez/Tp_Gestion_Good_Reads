import React from 'react';
import Sign_Up_form from './Sign_Up_form';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
function App(){
    return(
        <BrowserRouter>
        <Route>
            <Route path = '/signup' element = {<SignUpForm/>}> </Route>
            <Route path = '/login' element = {<Login/>}> </Route>
            
        </Route>
        <Sign_Up_form/>
        </BrowserRouter>
    );
}

export default App;