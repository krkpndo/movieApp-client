import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <Container className="hero-section text-center">
        <h1>Welcome to our Movies Library</h1>
        {/* Button targets the Movies page */}
        <Button variant="primary" size="lg" as={Link} to="/movies" className="hero-button">
          View our Movies!
        </Button>
      </Container>
    </>
  );
}
