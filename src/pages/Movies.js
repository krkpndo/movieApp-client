import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import '../index.css'; // Import the CSS file

export default function GetMovies() {
    const navigate = useNavigate();
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = () => {
        let fetchUrl = "https://movieapp-api-lms1.onrender.com/movies/getMovies";

        fetch(fetchUrl, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token') || ''}` // Send token only if it exists
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.movies) {
                    setMovies(data.movies);
                    setLoading(false);
                } else {
                    setError("No movies found.");
                    setLoading(false);
                }
            })
            .catch(error => {
                setError("Error fetching movies.");
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <>
            {/* Header Section */}
            <div className="header-section">
                <h1>Movies</h1>
                {/* Add Movie Button only for logged-in users */}
                {localStorage.getItem('token') ? (
                    <button onClick={() => navigate('/addMovie')} className="add-movie-btn">
                        Add Movie
                    </button>
                ) : null}
            </div>

            {/* Movies List */}
            <Container className="card-container text-center">
                {/* Loading State */}
                {loading && (
                    <div className="d-flex justify-content-center mt-5">
                        <Spinner animation="border" role="status" variant="primary" />
                        <span className="visually-hidden">Loading...</span>
                    </div>
                )}

                {/* Error Message */}
                {error && <p className="no-movies">{error}</p>}

                {/* Movies Grid */}
                <Row className="justify-content-center">
                    {movies.length > 0 ? (
                        movies.map((movie, index) => (
                            <Col key={index} sm={12} md={6} lg={4}>
                                <Card className="mb-4 shadow-sm">
                                    {/* Movie Image */}
                                    <Card.Img
                                        variant="top"
                                        src={movie.image || "http://clipart-library.com/data_images/528185.jpg"}
                                        alt={movie.title}
                                        className="card-img-top"
                                    />
                                    <Card.Body>
                                        <Card.Title className="card-title">{movie.title}</Card.Title>
                                        <Button
                                            variant="primary"
                                            size="lg"
                                            as={Link}
                                            to={`/getMovie/${movie._id}`} // Movie details page
                                        >
                                            Details
                                        </Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))
                    ) : (
                        <p className="no-movies">No movies found</p>
                    )}
                </Row>
            </Container>
        </>
    );
}
