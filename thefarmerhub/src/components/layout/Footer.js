import { Container } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="bg-success text-white py-3 mt-auto">
      <Container className="text-center">
        <p className="mb-0">© {new Date().getFullYear()} FarmerHub - Empowering Farmers</p>
      </Container>
    </footer>
  );
};

export default Footer;