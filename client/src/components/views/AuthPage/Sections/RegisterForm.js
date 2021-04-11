import React from "react";
import { withRouter } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import { registerUser } from "../../../../_actions/user_actions";
import { useDispatch } from "react-redux";
import "../../../../styles/AuthPage.css";
import { Container, Row, Col } from "reactstrap";
import { Form, Icon, Input, Button } from "antd";

function RegisterPage(props) {
  const dispatch = useDispatch();
  return (
    <Formik
      initialValues={{
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
      }}
      validationSchema={Yup.object().shape({
        username: Yup.string().required("Username is required"),
        email: Yup.string()
          .email("Email is invalid")
          .required("Email is required"),
        password: Yup.string()
          .min(6, "Password must be at least 6 characters")
          .required("Password is required"),
        confirmPassword: Yup.string()
          .oneOf([Yup.ref("password"), null], "Passwords must match")
          .required("You have to confirm your password"),
      })}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          let dataToSubmit = {
            email: values.email,
            password: values.password,
            username: values.username,
          };

          dispatch(registerUser(dataToSubmit)).then((response) => {
            if (response.payload.success) {
              props.history.push("/auth");
            } else {
              alert(response.payload.err.errmsg);
            }
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
          <div>
            <Container>
              <Row>
                <Col>
                  <form onSubmit={handleSubmit}>
                    <Form.Item required>
                      <Input
                        id="username"
                        prefix={<Icon type="user" className="input__icon" />}
                        placeholder="Enter your username"
                        type="text"
                        value={values.username}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={
                          errors.username && touched.username
                            ? "text-input error"
                            : "text-input"
                        }
                      />{" "}
                      {errors.username && touched.username && (
                        <div className="input-feedback">
                          {" "}
                          {errors.username}{" "}
                        </div>
                      )}{" "}
                    </Form.Item>{" "}
                    <Form.Item
                      required
                      hasFeedback
                      validateStatus={
                        values.email == ""
                          ? undefined
                          : errors.email && touched.email
                          ? "error"
                          : "success"
                      }
                    >
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
                    <Form.Item
                      required
                      hasFeedback
                      validateStatus={
                        values.password == ""
                          ? undefined
                          : errors.password && touched.password
                          ? "error"
                          : "success"
                      }
                    >
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
                    <Form.Item required hasFeedback>
                      <Input
                        id="confirmPassword"
                        prefix={<Icon type="lock" className="input__icon" />}
                        placeholder="Re-enter your password"
                        type="password"
                        value={values.confirmPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={
                          errors.confirmPassword && touched.confirmPassword
                            ? "text-input error"
                            : "text-input"
                        }
                      />{" "}
                      {errors.confirmPassword && touched.confirmPassword && (
                        <div className="input-feedback">
                          {" "}
                          {errors.confirmPassword}{" "}
                        </div>
                      )}{" "}
                    </Form.Item>{" "}
                    <Form.Item>
                      <Button
                        onClick={handleSubmit}
                        type="primary"
                        className="login-form-button login-form-button--main mx-auto my-auto center-items"
                        disabled={isSubmitting}
                      >
                        <p
                          className="my-auto mx-auto"
                          style={{ padding: "5px" }}
                        >
                          Sign up{" "}
                        </p>{" "}
                      </Button>{" "}
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

export default withRouter(RegisterPage);
