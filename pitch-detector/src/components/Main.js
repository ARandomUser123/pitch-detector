import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { PitchDetector } from "pitchy";
import { useState, useRef } from "react";
import pitchMap from "../utils/pitchMap";

export default function Main() {
  const audio = useRef(null);
  const [timer, setTimer] = useState(null);
  const [pitch, setPitch] = useState(null);
  const [history, setHistory] = useState([]);
  const released = useRef(true);

  const clearHistory = () => {
    setHistory([]);
    setPitch(null);
  };

  const stopMicrophone = () => {
    audio.current.getTracks().forEach((track) => track.stop());
    audio.current = null;
    clearInterval(timer);
    setTimer(null);
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

  const getPitch = (analyser, audioContext) => {
    const detector = PitchDetector.forFloat32Array(analyser.fftSize);
    const input = new Float32Array(detector.inputLength);
    analyser.getFloatTimeDomainData(input);
    const [frequency, clarity] = detector.findPitch(
      input,
      audioContext.sampleRate
    );
    if (clarity >= 0.95) {
      const pitchNew = freqToPitch(frequency);
      if (released.current) {
        released.current = false;
        setPitch(pitchNew);
        history.push(pitchNew);
        setHistory(history);
      }
    } else {
      released.current = true;
    }
  };

  const freqToPitch = (input) => {
    let minDiff = 10000;
    let pitchMin;

    Object.entries(pitchMap).forEach(([pitch, frequency]) => {
      const diff = Math.abs(input - frequency);
      if (diff < minDiff) {
        pitchMin = pitch;
        minDiff = diff;
      }
    });

    return pitchMin;
  };

  return (
    <Container style={{ marginTop: 30 }}>
      <Row style={{ marginBottom: 30 }}>
        <Col>
          <Button
            style={{ width: "100%" }}
            onClick={audio.current == null ? startDetection : stopMicrophone}
          >
            {audio.current == null ? "Start Detection" : "Stop microphone"}
          </Button>
        </Col>
        <Col>
          <Button style={{ width: "100%" }} onClick={clearHistory}>
            Reset History
          </Button>
        </Col>
      </Row>
      <Row style={{ margiTop: 30 }} className="justify-content-center">
        <Card style={{ width: "18rem" }}>
          <Card.Body>
            <Card.Title></Card.Title>
            <Card.Text>
              <h2>{pitch}</h2>
            </Card.Text>
            {/* <Button variant="primary">Go somewhere</Button> */}
          </Card.Body>
        </Card>
      </Row>
      <Row> {audio.current == null ? "Audio not ready!" : "Audio ready"} </Row>
      <Row> {history.join(",")} </Row>
    </Container>
  );
}
