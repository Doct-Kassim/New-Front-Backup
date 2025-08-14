import React from 'react';

import { Card, Carousel } from 'react-bootstrap';

const AboutPage = () => {
 
  const images = [
    '/images/kilimo.jpg',
    '/images/ufugaji.jpg',
    '/images/shamba.jpg',
    '/images/uvuvi.jpg',
  ];

  return (
    <Card className="my-4 shadow">
      <Card.Body>
        <Carousel fade className="mb-4 rounded">
          {images.map((src, idx) => (
            <Carousel.Item key={idx}>
              <img
                className="d-block w-100"
                src={src}
                alt={`Slide ${idx + 1}`}
                style={{ maxHeight: '350px', objectFit: 'cover' }}
              />
            </Carousel.Item>
          ))}
        </Carousel>

        <h2 className="mb-3 text-success fw-bold">About Us</h2>

        <p style={{ textAlign: 'justify', fontSize: '1.1rem', lineHeight: '1.6' }}>
          Kilimo Tanzania ni kitovu cha ubunifu na ufanisi katika sekta ya kilimo na ufugaji. Tovuti yetu imeundwa kwa lengo la kubadilisha tasnia hii kupitia usambazaji wa maarifa na miongozo ya hali ya juu kwa wakulima na wafugaji. Tunalenga kuleta mapinduzi ya kielimu katika kilimo na ufugaji kwa kutoa nyaraka, mafunzo, na taarifa za hali ya juu zilizoandaliwa na wataalamu wetu.
        </p>
        <p style={{ textAlign: 'justify', fontSize: '1.1rem', lineHeight: '1.6' }}>
          Tunajivunia kuwa chanzo cha habari muhimu na miongozo sahihi kwa wakulima na wafugaji nchini Tanzania. Tovuti yetu inakupa ufahamu wa kina kuhusu mazao mbalimbali na njia bora za kilimo na ufugaji.
        </p>
        <p style={{ textAlign: 'justify', fontSize: '1.1rem', lineHeight: '1.6' }}>
          Kilimo na ufugaji sio tu shughuli za kujipatia kipato, bali ni njia ya kujenga uchumi imara na endelevu. Tunatambua umuhimu wa kilimo biashara na ufugaji kama njia pekee ya kujenga ustawi wa kiuchumi. Tukitumia ardhi yenye rutuba ipasavyo, tunaweza kutosheleza mahitaji ya chakula kwa jamii yetu na hata kuuza ziada nje ya nchi, hivyo kuongeza mapato na faida kwa taifa letu.
        </p>
        <p style={{ textAlign: 'justify', fontSize: '1.1rem', lineHeight: '1.6' }}>
          Tunajivunia kuwa chaguo lako kuu kwa habari za kilimo na ufugaji hapa Tanzania. Jiunge nasi katika safari ya kufanikisha malengo yako ya kilimo na ufugaji endelevu na faida kubwa zaidi.
        </p>
      </Card.Body>
    </Card>
  );
};

export default AboutPage;
