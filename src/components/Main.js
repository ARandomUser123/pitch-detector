import Container from "react-bootstrap/Container";
import FileDetector from "./FileDetector.js";
import AudioDetector from "./AudioDetector.js";
import { Routes, Route } from "react-router-dom";

export default function Main() {
  return (
    <Container style={{ marginTop: 30 }}>
      <Routes>
        <Route exact path="/" element={<AudioDetector />} />
        <Route path="/audio" element={<AudioDetector />} />
        <Route path="/file" element={<FileDetector />} />
      </Routes>
    </Container>
  );
}
