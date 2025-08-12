import React, { useEffect, useState } from "react";

const TrainingTutorials = () => {
  // Hapa tuta-store video data (title na url) ambayo baadaye admin atakuwa ana-insert kwenye backend
  // Kwani user atakuwa view only, tutachukua data kutoka API/Django

  const [tutorials, setTutorials] = useState([]);

  useEffect(() => {
    // Hapa unaweza replace fetch URL na API yako ya django
    fetch("/api/training-tutorials/")
      .then((res) => res.json())
      .then((data) => {
        setTutorials(data);
      })
      .catch((err) => {
        console.error("Error fetching tutorials:", err);
      });
  }, []);

  return (
    <div className="container my-4">
      <h2 className="mb-4">Training and Tutorials</h2>
      {tutorials.length === 0 ? (
        <p>Hakuna mafunzo yoyote kwa sasa.</p>
      ) : (
        tutorials.map((tutorial) => (
          <div key={tutorial.id} className="mb-4">
            <h5>{tutorial.title}</h5>
            {/* Assuming tutorial.video_url ni link ya YouTube / video file */}
            <div className="ratio ratio-16x9">
              <iframe
                src={tutorial.video_url}
                title={tutorial.title}
                allowFullScreen
              ></iframe>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default TrainingTutorials;
