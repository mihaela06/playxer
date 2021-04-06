import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { loginUser } from "../../../_actions/user_actions";
import { Formik } from "formik";
import * as Yup from "yup";
import { Form, Icon, Input, Button, Checkbox, Typography } from "antd";
import { useDispatch } from "react-redux";
import ParticleBackground from "./Sections/ParticleBackground";
import { Container, Row, Col } from "reactstrap";
//import "./AuthContainer.css";
import spotifyIcon from "../../../assets/images/SpotifyIcon.png";

const { Title } = Typography;

function LoginPage(props) {
  const dispatch = useDispatch();
  const rememberMeChecked = localStorage.getItem("rememberMe") ? true : false;

  const [formErrorMessage, setFormErrorMessage] = useState("");
  const [rememberMe, setRememberMe] = useState(rememberMeChecked);

  const handleRememberMe = () => {
    setRememberMe(!rememberMe);
  };

  const initialEmail = localStorage.getItem("rememberMe")
    ? localStorage.getItem("rememberMe")
    : "";

  return (
    <Formik
      initialValues={{
        email: initialEmail,
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
                if (rememberMe === true) {
                  window.localStorage.setItem("rememberMe", values.id);
                } else {
                  localStorage.removeItem("rememberMe");
                }
                props.history.push("/");
              } else {
                setFormErrorMessage("Check out your email or password again");
              }
            })
            .catch((err) => {
              setFormErrorMessage("Check out your email or password again");
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
          dirty,
          isSubmitting,
          handleChange,
          handleBlur,
          handleSubmit,
          handleReset,
        } = props;
        return (
          <div className="app">
            <ParticleBackground />

            <Container>
              <Row>
                <Col md={{ span: 6, offset: 4 }} className="my-auto mx-auto">
                  <Container
                    className="AuthContainer"
                    style={{ margin: "10px", zIndex:10, position: "relative" }}
                  >
                    <Row>
                      <Button
                        className="ConnectButton mx-auto"
                        style={{
                          height: "50px",
                        }}
                      >
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
                          <Form.Item required style={{ marginBottom: "0px" }}>
                            <Input
                              id="email"
                              prefix={
                                <Icon
                                  type="user"
                                  style={{ color: "rgba(0,0,0,.25)" }}
                                />
                              }
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
                              prefix={
                                <Icon
                                  type="lock"
                                  style={{ color: "rgba(0,0,0,.25)" }}
                                />
                              }
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
                            <label>
                              <p
                                style={{
                                  color: "#ff0000bf",
                                  fontSize: "0.7rem",
                                  border: "1px solid",
                                  padding: "1rem",
                                  borderRadius: "10px",
                                }}
                              >
                                {formErrorMessage}{" "}
                              </p>{" "}
                            </label>
                          )}
                          <Form.Item>
                            <Checkbox
                              id="rememberMe"
                              onChange={handleRememberMe}
                              checked={rememberMe}
                            >
                              Remember me{" "}
                            </Checkbox>{" "}
                            <a
                              className="login-form-forgot"
                              href="/reset_user"
                              style={{ float: "right" }}
                            >
                              forgot password{" "}
                            </a>{" "}
                            <div>
                              <Button
                                type="primary"
                                htmlType="submit"
                                className="login-form-button"
                                style={{ minWidth: "100%" }}
                                disabled={isSubmitting}
                                onSubmit={handleSubmit}
                              >
                                Log in
                              </Button>{" "}
                            </div>
                            Or <a href="/register"> register now! </a>{" "}
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
