import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import { Link } from "react-router-dom";

export default function MyNav() {
  return (
    <Navbar bg="light" expand="lg">
      <Container fluid>
        <Navbar.Brand href="./">Eric's Pitch Detector</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav>
            <Nav.Link href="/">Home</Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link href="/audio">Audio detector</Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link href="/file">File detector</Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link href="https://github.com/ARandomUser123">Github</Nav.Link>
          </Nav>
          {/* <Navbar.Brand href="https://github.com/ARandomUser123">
            <img
              src="./github-mark.png"
              width="30"
              height="30"
              className="d-inline-block align-top"
              alt="React Bootstrap logo"
            />
          </Navbar.Brand> */}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
