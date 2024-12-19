import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Button } from 'react-bootstrap';

export default function MovieDetails() {
    const { id } = useParams(); // Extract movie ID from the route
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const [error, setError] = useState(null);

    // Fetch Movie Details
    const fetchMovieDetails = () => {
        const fetchUrl = `https://movieapp-api-lms1.onrender.com/movies/getMovie/${id}`;

        fetch(fetchUrl)
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Movie not found");
                }
                return res.json();
            })
            .then((data) => {
                console.log("Fetched Movie Details:", data);
                setMovie(data); // Set the fetched movie details
            })
            .catch((err) => {
                console.error("Error fetching movie details:", err);
                setError("Movie not found. Please check the ID or try again.");
            });
    };

    // Fetch movie details when the component mounts or ID changes
    useEffect(() => {
        fetchMovieDetails();
    }, []);

    return (
        <Container className="mt-5">
            {/* Go Back Button */}
            <Button variant="secondary" className="mb-3" onClick={() => navigate(-1)}>
                Back
            </Button>

            {/* Display Error */}
            {error && (
                <h3 className="text-danger text-center">{error}</h3>
            )}

            {/* Display Movie Details */}
            {movie ? (
                <Card className="text-center shadow-lg">
                    <Card.Img
                        variant="top"
                        src={movie.image || "http://clipart-library.com/data_images/528185.jpg"}
                        alt={movie.title}
                        style={{ height: '400px', objectFit: 'cover' }}
                    />
                    <Card.Body>
                        <Card.Title className="display-4">{movie.title}</Card.Title>
                        <Card.Text>
                            <strong>Genre:</strong> {movie.genre || "N/A"}
                        </Card.Text>
                        <Card.Text>
                            <strong>Year:</strong> {movie.year || "N/A"}
                        </Card.Text>
                        <Card.Text>
                            <strong>Duration:</strong> {movie.duration || "N/A"} minutes
                        </Card.Text>
                        <Card.Text>
                            <strong>Description:</strong> {movie.description || "No description available."}
                        </Card.Text>
                        {/* Add Director Field */}
                        <Card.Text>
                            <strong>Director:</strong> {movie.director || "N/A"}
                        </Card.Text>
                    </Card.Body>
                </Card>
            ) : !error ? (
                <h3 className="text-center">Loading...</h3>
            ) : null}
        </Container>
    );
}
