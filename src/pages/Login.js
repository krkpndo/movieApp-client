import { useState, useEffect, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Navigate, Link } from 'react-router-dom';
import { Notyf } from 'notyf';
import UserContext from '../context/UserContext';

export default function Login() {
    const { user, setUser } = useContext(UserContext);
    const notyf = new Notyf();
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isActive, setIsActive] = useState(false);  // Default is inactive
    
    const authenticate = (e) => {
        e.preventDefault();

        fetch(`https://movieapp-api-lms1.onrender.com/users/login`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        })
        .then(res => res.json())
        .then(data => {
            if (data.access) {
                // Save token and retrieve user details
                localStorage.setItem('token', data.access);
                retrieveUserDetails(data.access);
                setEmail('');
                setPassword('');
                notyf.success('Successful Login');
            } else {
                // Handle incorrect login
                const errorMessage = data.message === "Email and password do not match" 
                    ? "Incorrect credentials. Try again!" 
                    : `${email} does not exist`;
                notyf.error(errorMessage);
            }
        });
    };

    const retrieveUserDetails = (token) => {
        fetch(`https://movieapp-api-lms1.onrender.com/users/details`, {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then(response => response.json())
        .then(data => {
            // Check if user details exist
            if (data && data.user && data.user._id) {
                setUser({ id: data.user._id, isAdmin: data.user.isAdmin || false });
            } else {
                console.error('User details not found in the response');
                // You can also log out the user or handle the error as needed
                setUser({ id: null, isAdmin: null });
            }
        })
        .catch(error => {
            console.error('Error fetching user details:', error);
            setUser({ id: null, isAdmin: null });
        });
    };


    useEffect(() => {
        // Enable submit button only when both fields are filled
        setIsActive(email !== '' && password !== '');
    }, [email, password]);

    // Redirect to home if already logged in
    if (user.id !== null) {
        return <Navigate to="/" />;
    }

    return ( 
        (user.id !== null)
            ?
            <Navigate to='/'/>
            :    
        <Form onSubmit={authenticate}>
            <h1 className="my-5 text-center">Login</h1>

            <Form.Group>
                <Form.Label>Email address</Form.Label>
                <Form.Control 
                    type="email" 
                    placeholder="Enter email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control 
                    type="password" 
                    placeholder="Password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </Form.Group>

            <Button variant={isActive ? "primary" : "danger"} type="submit" id="loginBtn" disabled={!isActive}>
                Login
            </Button>

            <p className="mx-auto py-3 text-center">
                Don't have an account yet? <Link to="/register">Click here</Link> to register
            </p>
        </Form>
    );
}
