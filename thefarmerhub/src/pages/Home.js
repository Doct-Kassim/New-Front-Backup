import React from 'react';

import { Container, Row, Col, Button, Card, Carousel } from 'react-bootstrap';

import { Link } from 'react-router-dom';

import { FaCloudSun, FaComments, FaChartBar, FaTractor, FaSeedling, FaBug } from 'react-icons/fa';

import './Home.css';

const carouselImages = [
  {
    id: 1,
    src: "/images/farm2.png",
    alt: "Kilimo cha kisasa",
    title: "Kilimo Bora",
    description: "Jifunze mbinu za kisasa za kilimo"
  },
  {
    id: 2,
    src: "/images/kuku.jpg",
    alt: "Ufugaji wa kisasa",
    title: "Ufugaji",
    description: "Mbinu bora za ufugaji wa mifugo"
  },
  {
    id: 3,
    src: "/images/farm4.jpeg",
    alt: "Soko la mazao",
    title: "Soko Lenye Faida",
    description: "Pata habari za bei za soko"
  },
  {
    id: 4,
    src: "/images/farm1.png",
    alt: "Teknolojia ya kilimo",
    title: "Teknolojia",
    description: "Vifaa vipya vya kilimo"
  }
];

const Home = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section bg-primary text-white py-5">
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <h1>Karibu kwenye <strong>FarmerHub</strong></h1>
              <p className="lead">
                Platform bora ya wakulima kushiriki ujuzi, habari za soko, na mazungumzo.
              </p>
              <Button 
                as={Link} 
                to="/HomePage" 
                variant="light" 
                size="lg"
              >
                farmer Dashboard
              </Button>
            </Col>

           
          </Row>
        </Container>
      </section>

      {/* Carousel Section */}
      <section className="carousel-section py-4">
        <Container fluid="xxl" className="px-0 mx-auto">
          <Carousel fade interval={3000} pause={false}>
            {carouselImages.map((image) => (
              <Carousel.Item key={image.id}>
                <div style={{
                  height: '60vh',
                  minHeight: '400px',
                  maxHeight: '600px',
                  overflow: 'hidden'
                }}>
                  <img
                    className="d-block w-100 h-100"
                    src={image.src}
                    alt={image.alt}
                    style={{
                      objectFit: 'cover',
                      objectPosition: 'center',
                      borderRadius: '8px'
                    }}
                  />
                </div>
                <Carousel.Caption className="bg-dark bg-opacity-50 rounded p-3">
                  <h3>{image.title}</h3>
                  <p>{image.description}</p>
                </Carousel.Caption>
              </Carousel.Item>
            ))}
          </Carousel>
        </Container>
      </section>

      {/* Features Section */}
      <section className="features-section py-5">
        <Container>
          <h2 className="text-center mb-4">Vitu Unavyoweza Kufanya<br />(huduma zetu)</h2>
          <Row>
            <Col md={4} className="mb-4">
              <Card className="h-100 text-center">
                <Card.Body>
                  <FaCloudSun size={40} className="mb-2 text-warning" />
                  <Card.Title>Hali ya Hewa</Card.Title>
                  <Card.Text>
                    Pata habari za hali ya hewa kwa eneo lako kwa siku 7 zijazo.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="h-100 text-center">
                <Card.Body>
                  <FaComments size={40} className="mb-2 text-primary" />
                  <Card.Title>Forum</Card.Title>
                  <Card.Text>
                    Shiriki maswali na majibu na wakulima wenzako.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="h-100 text-center">
                <Card.Body>
                  <FaChartBar size={40} className="mb-2 text-info" />
                  <Card.Title>Bei za Soko</Card.Title>
                  <Card.Text>
                    Fahamu bei za mazao kwa sasa kutoka kwenye soko mbalimbali.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="h-100 text-center">
                <Card.Body>
                  <FaTractor size={40} className="mb-2 text-danger" />
                  <Card.Title>Elimu ya Ufugaji</Card.Title>
                  <Card.Text>
                    Jifunze zaidi mbinu na utaalamu wa ufugaji wa kisasa.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="h-100 text-center">
                <Card.Body>
                  <FaSeedling size={40} className="mb-2 text-success" />
                  <Card.Title>Kilimo</Card.Title>
                  <Card.Text>
                    Fahamu zaidi kuhusu kilimo na jinsi ya kukabiliana na changamoto zake.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="h-100 text-center">
                <Card.Body>
                  <FaBug size={40} className="mb-2 text-dark" />
                  <Card.Title>Pests and Diseases</Card.Title>
                  <Card.Text>
                    Zijue mbinu na tiba mbalimbali za kudhibiti magonjwa ya mimea na wanyama.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Home;
