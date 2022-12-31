import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import { PitchDetector } from "pitchy";
import { useState } from "react";
import { freqToPitch } from "../utils/utils.js";

export default function FileDetecotr() {
  const [file, setFile] = useState(null);
  const [history, setHistory] = useState([]);

  const startFileDetection = () => {
    const reader = new FileReader();
    if (file == null) {
      alert("please upload a file");
      return;
    }
    reader.readAsArrayBuffer(file);
    reader.onload = async () => {
      const arrayBuffer = reader.result;

      const offlineAudioContext = new OfflineAudioContext({
        length: 1,
        sampleRate: 44100,
      });
      const audioBuffer = await offlineAudioContext.decodeAudioData(
        arrayBuffer
      );
      const pitches = [];
      let released = true;
      for (
        let i = 0;
        i < audioBuffer.length;
        i += audioBuffer.sampleRate / 20
      ) {
        const input = new Float32Array(audioBuffer.sampleRate / 20);
        audioBuffer.copyFromChannel(input, 0, i);
        const detector = PitchDetector.forFloat32Array(
          audioBuffer.sampleRate / 20
        );

        const [frequency, clarity] = detector.findPitch(
          input,
          offlineAudioContext.sampleRate
        );

        const pitchNew = freqToPitch(frequency);
        if (clarity > 0.95 && released) {
          pitches.push(pitchNew);
          released = false;
        } else if (clarity < 0.8) {
          released = true;
        }
      }
      setHistory(pitches);
    };
  };

  return (
    <>
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
        <Button variant="primary" onClick={startFileDetection}>
          Start file detection
        </Button>
      </Row>
      <Row> {history.join(",")} </Row>
    </>
  );
}
