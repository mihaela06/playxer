import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { loginUser } from "../../../../_actions/user_actions";
import { Formik } from "formik";
import * as Yup from "yup";
import { Form, Icon, Input, Button } from "antd";
import { useDispatch } from "react-redux";
import { Container, Row, Col } from "reactstrap";
import "../../../../styles/AuthPage.css";
import mixIt from "../../../../assets/images/MixIt.gif";

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
          <div>
            <Container>
              <Row>
                <Col>
                  <form onSubmit={handleSubmit}>
                    <Form.Item required>
                      <Input
                        id="email"
                        prefix={<Icon type="mail" className="input__icon" />}
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
                        <div className="input-feedback"> {errors.email} </div>
                      )}{" "}
                    </Form.Item>{" "}
                    <Form.Item required>
                      <Input
                        id="password"
                        prefix={<Icon type="lock" className="input__icon" />}
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
                    </Form.Item>{" "}
                    {formErrorMessage && (
                      <label className="center-items">
                        <p className="error"> {formErrorMessage} </p>{" "}
                        <a href="/reset_user"> Forgot your password ? </a>{" "}
                        <br />
                      </label>
                    )}{" "}
                    <Form.Item>
                      <Container>
                        <Row>
                          <Col className="center-items">
                            <Button
                              type="primary"
                              htmlType="submit"
                              className="login-form-button login-form-button--main"
                              disabled={isSubmitting}
                              onSubmit={handleSubmit}
                            >
                              <Container style={{ padding: "5px" }}>
                                <Row noGutters >
                                  <Col xs={8}>
                                    <p className="my-auto mx-auto"> Mix it! </p>{" "}
                                  </Col>{" "}
                                  <Col xs={4} >
                                    <img
                                      src={mixIt}
                                      style={{
                                        height: "40px",
                                        marginLeft: "5px",
                                      }}
                                    />{" "}
                                  </Col>{" "}
                                </Row>{" "}
                              </Container>{" "}
                            </Button>{" "}
                          </Col>{" "}
                        </Row>{" "}
                      </Container>{" "}
                    </Form.Item>{" "}
                  </form>{" "}
                </Col>{" "}
              </Row>{" "}
            </Container>{" "}
          </div>
        );
      }}
    </Formik>
  );
}

export default withRouter(LoginPage);
