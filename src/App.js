import AppNavBar from './components/AppNavBar';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Movies from './pages/Movies';
import GetMovie from './pages/ViewMovie';
import { Container } from 'react-bootstrap';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { useState, useEffect } from 'react';

function App() {
  // State hook for the user state is defined here to allow it to have a global scope
  // This can be achieved using react context
  // This will be used to store user information and will be used for validating if a user is logged in on the app or not.
  const [user, setUser] = useState({
    id: null,
    isAdmin: null,
  });

  // Function for clearing localStorage on logout
  function unsetUser() {
    localStorage.clear();
  }

  useEffect(() => {
    if (localStorage.getItem('token')) {
        fetch('https://movieapp-api-lms1.onrender.com/users/details', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log('Response Data:', data); // Log the response to see the structure
            // Check if the response contains the user details
            if (data && data.user && data.user._id) {
                setUser({
                    id: data.user._id,
                    isAdmin: data.user.isAdmin || false
                });
            } else {
                setUser({
                    id: null,
                    isAdmin: null
                });
            }
        })
        .catch(error => {
            console.error('Error fetching user details:', error);
            setUser({
                id: null,
                isAdmin: null
            });
        });
    } else {
        setUser({
            id: null,
            isAdmin: null
        });
    }
}, []);



  return (
    <>
      <UserProvider value={{ user, setUser, unsetUser }}>
        <Router>
          <AppNavBar />
          <Container>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/getMovie/:id" element={<GetMovie />} />
              <Route path="/movies" element={<Movies />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/logout" element={<Logout />} />
            </Routes>
          </Container>
        </Router>
      </UserProvider>
    </>
  );
}

export default App;
