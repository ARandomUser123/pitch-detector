import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
// import { PitchDetector } from "pitchy";
import { useEffect, useState } from "react";

export default function Main() {
  const [audio, setAudio] = useState(null);

  const getMicrophone = async () => {
    const audio = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    });
    setAudio(audio);
  };

  const stopMicrophone = () => {
    audio.getTracks().forEach((track) => track.stop());
    setAudio(null);
  };

  useEffect(() => {
    getMicrophone();
  }, []);

  console.log(audio);
  return (
    <Container style={{ marginTop: 30 }}>
      <Row className="align-items-center">
        <Col>
          <Button style={{ width: "100%" }} onClick={getMicrophone}>
            Start Microphone
          </Button>
        </Col>
        <Col>
          <Button style={{ width: "100%" }} onClick={stopMicrophone}>
            Stop Microphone
          </Button>
        </Col>
      </Row>
      <Row style={{ marginTop: 30 }} className="justify-content-center">
        <Card style={{ width: "18rem" }}>
          <Card.Body>
            <Card.Title>Card Title</Card.Title>
            <Card.Text>
              Some quick example text to build on the card title and make up the
              bulk of the card's content.
            </Card.Text>
            <Button variant="primary">Go somewhere</Button>
          </Card.Body>
        </Card>
      </Row>
      <Row> {audio == null ? "Audio not ready!" : "Audio ready"}</Row>
    </Container>
  );
}
