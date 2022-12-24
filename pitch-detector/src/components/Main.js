import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { PitchDetector } from "pitchy";
import { useState, useRef } from "react";
import pitchMap from "../utils/pitchMap";
import Form from "react-bootstrap/Form";

export default function Main() {
  const audio = useRef(null);
  const [timer, setTimer] = useState(null);
  const [pitch, setPitch] = useState(null);
  const [history, setHistory] = useState([]);
  const [file, setFile] = useState(null);
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
    console.log(input);
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
            {/* <Button variant="primary">Go somewhere</Button> */}
          </Card.Body>
        </Card>
      </Row>

      <Row> {history.join(",")} </Row>
      <Row style={{ marginBottom: 30 }}>
        <Form.Control
          type="file"
          onChange={(event) => {
            const files = event.target.files;
            if (files.length > 0) {
              const audioFile = files[0];
              setFile(audioFile);
            }
          }}
        />
      </Row>
      <Row>
        <Button
          variant="primary"
          onClick={() => {
            const reader = new FileReader();
            reader.readAsArrayBuffer(file);
            reader.onload = async () => {
              const arrayBuffer = reader.result;
              // const float32Array = Float32Array.from(arrayBuffer);
              const offlineAudioContext = new OfflineAudioContext({
                length: 1,
                sampleRate: 44100,
              });
              const audioBuffer = await offlineAudioContext.decodeAudioData(
                arrayBuffer
              );
              for (
                let i = 0;
                i < audioBuffer.length;
                i += audioBuffer.sampleRate / 10
              ) {
                const input = new Float32Array(audioBuffer.sampleRate / 10);
                audioBuffer.copyFromChannel(input, 0, i);
                const detector = PitchDetector.forFloat32Array(
                  audioBuffer.sampleRate / 10
                );
                // console.log(input);
                const [frequency, clarity] = detector.findPitch(
                  input,
                  offlineAudioContext.sampleRate
                );
                // console.log(frequency, clarity);
                const pitchNew = freqToPitch(frequency);
                console.log("pitchNew", pitchNew);
              }
            };
          }}
        >
          Start file detection
        </Button>
      </Row>
    </Container>
  );
}
