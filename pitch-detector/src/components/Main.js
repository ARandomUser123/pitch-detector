import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { PitchDetector } from "pitchy";
import { useEffect, useState, useRef } from "react";

export default function Main() {
  const audio = useRef(null);
  const [timer, setTimer] = useState(null);
  const [pitch, setPitch] = useState(null);

  const stopMicrophone = () => {
    audio.current.getTracks().forEach((track) => track.stop());
    audio.current = null;
    clearInterval(timer);
    setTimer(null);
  };

  const getPitch = (analyser, audioContext) => {
    const detector = PitchDetector.forFloat32Array(analyser.fftSize);
    const input = new Float32Array(detector.inputLength);
    analyser.getFloatTimeDomainData(input);
    const [pitch] = detector.findPitch(input, audioContext.sampleRate);
    setPitch(pitch);
  };

  const startDetection = async () => {
    const audioContext = new window.AudioContext();
    const analyserNode = audioContext.createAnalyser();
    audio.current = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });
    audioContext.createMediaStreamSource(audio.current).connect(analyserNode);
    if (timer == null) {
      const interval = setInterval(getPitch, 100, analyserNode, audioContext);
      setTimer(interval);
    }
  };

  useEffect(() => {}, []);

  return (
    <Container style={{ marginTop: 30 }}>
      <Row className="">
        <Col>
          <Button
            style={{ width: "100%" }}
            onClick={audio.current == null ? startDetection : stopMicrophone}
          >
            {audio.current == null ? "Start detection" : "Stop  microphone"}
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
      <Row> {audio.current == null ? "Audio not ready!" : "Audio ready"}</Row>
      <Row> {pitch ?? 0} hz </Row>
    </Container>
  );
}
