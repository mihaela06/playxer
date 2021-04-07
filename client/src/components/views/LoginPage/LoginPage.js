import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { loginUser } from "../../../_actions/user_actions";
import { Formik } from "formik";
import * as Yup from "yup";
import { Form, Icon, Input, Button } from "antd";
import { useDispatch } from "react-redux";
import ParticleBackground from "./Sections/ParticleBackground";
import { Container, Row, Col } from "reactstrap";
import "./LoginPage.css";
import spotifyIcon from "../../../assets/images/SpotifyIcon.png";
import mixIt from "../../../assets/images/MixIt.gif";

function LoginPage(props) {
  const dispatch = useDispatch();

  const [formErrorMessage, setFormErrorMessage] = useState("");

  return (
    <Formik
      initialValues={{
        email: "",
        password: "",
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string()
          .email("Email is invalid")
          .required("Email is required"),
        password: Yup.string()
          .min(6, "Password must be at least 6 characters")
          .required("Password is required"),
      })}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          let dataToSubmit = {
            email: values.email,
            password: values.password,
          };

          dispatch(loginUser(dataToSubmit))
            .then((response) => {
              if (response.payload.loginSuccess) {
                window.localStorage.setItem("userId", response.payload.userId);
                props.history.push("/");
              } else {
                setFormErrorMessage(
                  "Check your email and password and try again!"
                );
              }
            })
            .catch((err) => {
              setFormErrorMessage(
                "Check your email and password and try again!"
              );
              setTimeout(() => {
                setFormErrorMessage("");
              }, 3000);
            });
          setSubmitting(false);
        }, 500);
      }}
    >
      {(props) => {
        const {
          values,
          touched,
          errors,
          isSubmitting,
          handleChange,
          handleBlur,
          handleSubmit,
        } = props;
        return (
          <div className="app">
            <ParticleBackground />
            <Container>
              <Row>
                <Col md={{ span: 6, offset: 4 }} className="my-auto mx-auto">
                  <Container className="auth-container">
                    <Row>
                      <Button className="connect-spotify-button login-form-button mx-auto">
                        <Container>
                          <Row noGutters>
                            <Col xs={11} className="my-auto mx-auto">
                              <p>Connect with Spotify®</p>
                            </Col>
                            <Col xs={1} className="my-auto mx-auto">
                              <img src={spotifyIcon} />
                            </Col>
                          </Row>
                        </Container>
                      </Button>
                    </Row>
                    <Row>
                      <Col>
                        <form onSubmit={handleSubmit}>
                          <Form.Item required>
                            <Input
                              id="email"
                              prefix={<Icon type="mail" />}
                              placeholder="Enter your email"
                              type="email"
                              value={values.email}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              className={
                                errors.email && touched.email
                                  ? "text-input error"
                                  : "text-input"
                              }
                            />{" "}
                            {errors.email && touched.email && (
                              <div className="input-feedback">
                                {" "}
                                {errors.email}{" "}
                              </div>
                            )}{" "}
                          </Form.Item>
                          <Form.Item required>
                            <Input
                              id="password"
                              prefix={<Icon type="lock" />}
                              placeholder="Enter your password"
                              type="password"
                              value={values.password}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              className={
                                errors.password && touched.password
                                  ? "text-input error"
                                  : "text-input"
                              }
                            />{" "}
                            {errors.password && touched.password && (
                              <div className="input-feedback">
                                {" "}
                                {errors.password}{" "}
                              </div>
                            )}{" "}
                          </Form.Item>
                          {formErrorMessage && (
                            <label className="center-items">
                              <p className="error">{formErrorMessage} </p>{" "}
                            </label>
                          )}
                          <Form.Item>
                            <Container>
                              <Row
                                style={{
                                  marginBottom: "20px",
                                }}
                              >
                                <Col xs={{ span: 8, offset: 3 }}>
                                  <Button
                                    type="primary"
                                    htmlType="submit"
                                    className="login-form-button login-form-button--main mx-auto my-auto"
                                    disabled={isSubmitting}
                                    onSubmit={handleSubmit}
                                  >
                                    <Container style={{ padding: "5px" }}>
                                      <Row noGutters>
                                        <Col xs={8}>
                                          <p className="my-auto mx-auto">Mix it!</p>
                                        </Col>
                                        <Col xs={4}>
                                          <img
                                            src={mixIt}
                                            style={{
                                              height: "40px",
                                              marginLeft: "5px",
                                            }}
                                          />
                                        </Col>
                                      </Row>
                                    </Container>
                                  </Button>{" "}
                                </Col>
                              </Row>
                              <Row
                                style={{
                                  marginTop: "10px",
                                  marginBottom: "-10px",
                                }}
                              >
                                <Col xs={6} className="center-items">
                                  <a href="/register">
                                    <Button
                                      type="secondary"
                                      htmlType="button"
                                      disabled={isSubmitting}
                                      className="my-auto mx-auto login-form-button"
                                    >
                                      Register now
                                    </Button>{" "}
                                  </a>
                                </Col>
                                <Col xs={6} className="center-items">
                                  <a href="/reset_user">
                                    <Button
                                      type="secondary"
                                      htmlType="button"
                                      disabled={isSubmitting}
                                      className="my-auto mx-auto login-form-button"
                                    >
                                      Forgot password?
                                    </Button>{" "}
                                  </a>
                                </Col>
                              </Row>
                            </Container>
                          </Form.Item>{" "}
                        </form>{" "}
                      </Col>
                    </Row>
                  </Container>
                </Col>
              </Row>
            </Container>
          </div>
        );
      }}
    </Formik>
  );
}

export default withRouter(LoginPage);
