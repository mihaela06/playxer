import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Input,
  Button,
} from "reactstrap";
import "./AuthContainer.css";
import spotifyIcon from "../../../../assets/images/SpotifyIcon.png";

function AuthContainer() {
  return (
    <Container style={{"text-align": "center", "margin-top": "20%"}}>
      <Row>
        <Col md={{ span: 6, offset: 4 }}>
          <Container className="AuthContainer">
            <Row className="my-auto mx-auto">
              <Button className="ConnectButton">
                <Container>
                  <Row noGutters>
                    <Col xs={ 11 }  className="my-auto mx-auto">
                      <p>Connect with Spotify®</p>
                    </Col>
                    <Col xs={ 1 } className="my-auto mx-auto">
                      <img src={spotifyIcon} />
                    </Col>
                  </Row>
                </Container>
              </Button>
            </Row>
            <Row>
              <Col>
                <Form>
                  <FormGroup>
                    <Input
                      type="email"
                      name="email"
                      id="exampleEmail"
                      placeholder="E-mail"
                    />
                  </FormGroup>
                  <FormGroup>
                    <Input
                      type="password"
                      name="password"
                      id="examplePassword"
                      placeholder="Password"
                    />
                  </FormGroup>
                </Form>
              </Col>
            </Row>
          </Container>
        </Col>
      </Row>
    </Container>
  );
}

export default AuthContainer;
