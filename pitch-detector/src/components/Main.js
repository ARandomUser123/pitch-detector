import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { PitchDetector } from "pitchy";
import { useEffect, useState } from "react";

export default function Main() {
  const [audio, setAudio] = useState(null);
  const [analyser, setAnalyser] = useState(null);
  const [context, setContext] = useState(null);
  const [timer, setTimer] = useState(null);
  const [pitch, setPitch] = useState(null);

  const getMicrophone = async () => {
    const audioContext = new window.AudioContext();
    const analyserNode = audioContext.createAnalyser();
    const audio = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });
    await audioContext.createMediaStreamSource(audio).connect(analyserNode);
    setAudio(audio);
    setContext(audioContext);
    setAnalyser(analyserNode);
  };

  const stopMicrophone = () => {
    audio.getTracks().forEach((track) => track.stop());
    setAudio(null);
    clearInterval(timer);
    setTimer(null);
  };

  const getPitch = () => {
    const detector = PitchDetector.forFloat32Array(analyser.fftSize);
    const input = new Float32Array(detector.inputLength);
    analyser.getFloatTimeDomainData(input);
    const [pitch, clarity] = detector.findPitch(input, context.sampleRate);
    console.log("getPitch", analyser);
    setPitch(pitch);
  };

  const startDetection = async () => {
    if (audio == null) {
      await getMicrophone();
    }
    console.log("startDetection", timer);
    if (timer == null) {
      const interval = setInterval(getPitch, 100);
      setTimer(interval);
    }
  };

  useEffect(() => {
    getMicrophone();
  }, []);

  console.log("audio", audio);

  return (
    <Container style={{ marginTop: 30 }}>
      <Row className="">
        <Col>
          <Button
            style={{ width: "100%" }}
            onClick={audio == null ? startDetection : stopMicrophone}
          >
            {audio == null ? "Start detection" : "Stop  microphone"}
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
      <Row> {pitch ?? 0} </Row>
    </Container>
  );
}
