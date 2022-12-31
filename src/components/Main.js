import Container from "react-bootstrap/Container";
import FileDetector from "./FileDetector.js";
import AudioDetector from "./AudioDetector.js";

export default function Main() {
  return (
    <Container style={{ marginTop: 30 }}>
      <AudioDetector />
      <FileDetector />
    </Container>
  );
}
