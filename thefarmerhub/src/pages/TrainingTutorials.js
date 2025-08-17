// src/pages/TrainingTutorials.js
import React, { useEffect, useState } from "react";

import { Container, Row, Col, Card, Form, InputGroup, Button } from "react-bootstrap";

import { FaSearch, FaDownload, FaVideo } from "react-icons/fa";

// Helper function to strip HTML tags from description
const stripHtml = (html) => {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
};

const TrainingTutorials = () => {
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch data from Django API
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/training-videos/")
      .then((res) => res.json())
      .then((data) => {
        setVideos(data);
        setFilteredVideos(data);
      })
      .catch((err) => console.error("Error fetching videos:", err));
  }, []);

  // Search functionality
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = videos.filter((video) =>
      video.title.toLowerCase().includes(value)
    );
    setFilteredVideos(filtered);
  };

  return (
    <>
      {/* Hero Section */}
      <div
        className="py-5"
        style={{
          backgroundColor: "#e6f4ea",
          borderRadius: "0 0 30px 30px",
          textAlign: "center",
        }}
      >
        <Container>
          <h1 className="fw-bold text-success">
            <FaVideo className="me-2" />
            Training & Tutorials
          </h1>
          <p className="text-success fs-5">
            Watch, learn and download training videos to improve your farming skills.
          </p>

          {/* Search Bar inside Hero */}
          <Row className="justify-content-center mt-4">
            <Col md={6}>
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="Search by video title..."
                  value={searchTerm}
                  onChange={handleSearch}
                />
                <Button variant="success">
                  <FaSearch />
                </Button>
              </InputGroup>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Video List */}
      <Container className="my-4">
        <Row>
          {filteredVideos.length > 0 ? (
            filteredVideos.map((video) => {
              const videoSrc =
                video.video_url ||
                (video.video_file ? `http://127.0.0.1:8000${video.video_file}` : "");

              return (
                <Col lg={6} md={12} sm={12} xs={12} className="mb-4" key={video.id}>
                  <Card className="shadow-sm border-0 h-100">
                    <Card.Body>
                      <Card.Title className="fw-bold text-primary">
                        {video.title}
                      </Card.Title>

                      <Card.Text className="text-muted mb-3">
                        {video.description
                          ? stripHtml(video.description).substring(0, 150) + "..."
                          : ""}
                      </Card.Text>

                      {videoSrc && (
                        <div className="mb-3">
                          <video
                            width="100%"
                            height="auto"
                            controls
                            className="rounded shadow-sm"
                            style={{ maxHeight: "400px" }}
                          >
                            <source src={videoSrc} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        </div>
                      )}

                      <div className="d-flex justify-content-between align-items-center">
                        <small className="text-muted">
                          Uploaded:{" "}
                          {video.created_at
                            ? new Date(video.created_at).toLocaleDateString()
                            : "N/A"}
                        </small>
                        {videoSrc && (
                          <a
                            href={videoSrc}
                            download
                            className="btn btn-sm btn-outline-success"
                          >
                            <FaDownload className="me-1" /> Download
                          </a>
                        )}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })
          ) : (
            <Col>
              <p className="text-center text-muted">No videos found.</p>
            </Col>
          )}
        </Row>
      </Container>
    </>
  );
};

export default TrainingTutorials;
