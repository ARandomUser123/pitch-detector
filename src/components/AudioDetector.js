import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import { useState, useRef } from "react";
import { PitchDetector } from "pitchy";
import { freqToPitch } from "../utils/utils.js";

export default function AudioDetector() {
  const [history, setHistory] = useState([]);
  const audio = useRef(null);
  const [pitch, setPitch] = useState(null);
  const [timer, setTimer] = useState(null);
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
      const interval = setInterval(getPitch, 50, analyserNode, audioContext);
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

  return (
    <>
      <Row style={{ marginBottom: 30 }}>
        {`Microphone stream ${audio.current == null ? "not " : ""}ready!`}
      </Row>
      <Row style={{ marginBottom: 30 }}>
        <Col>
          <Button
            style={{ width: "100%" }}
            onClick={audio.current == null ? startDetection : stopMicrophone}
          >
            {audio.current == null ? "Start microphone" : "Stop microphone"}
          </Button>
        </Col>
        <Col>
          <Button style={{ width: "100%" }} onClick={clearHistory}>
            Reset history
          </Button>
        </Col>
      </Row>

      <Row
        style={{ marginTop: 30, marginBottom: 30 }}
        className="justify-content-center"
      >
        <Card style={{ width: "18rem" }}>
          <Card.Body>
            <Card.Title></Card.Title>
            <Card.Text style={{ fontSize: 24 }}>{pitch}</Card.Text>
          </Card.Body>
        </Card>
      </Row>
      <Row> {history.join(",")} </Row>
    </>
  );
}
