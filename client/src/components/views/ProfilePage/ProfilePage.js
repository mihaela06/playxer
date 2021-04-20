import React, { useState, useEffect } from "react";
import { getProfile } from "../../../_actions/spotify_actions";
import Loading from "../../Loading";
import { changeEmail, changePassword } from "../../../_actions/user_actions";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { USER_SERVER } from "../../Config";
import { useSelector } from "react-redux";
import { Container, Row, Col } from "reactstrap";
import { Form, Icon, Input, Button } from "antd";
import { useDispatch } from "react-redux";

import { NotificationManager } from "react-notifications";
import "react-notifications/lib/notifications.css";

function ProfilePage(props) {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    getData();
  }, []);

  const logoutHandler = () => {
    axios.get(`${USER_SERVER}/logout`).then((response) => {
      if (response.status === 200) {
        props.history.push("/auth");
      } else {
        alert("Log Out Failed");
      }
    });
  };

  const getData = () => {
    getProfile()
      .then((response) => {
        setProfile(response.spotifyData.body);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  if (loading)
    return (
      <div className="h-100">
        <Loading />
      </div>
    );

  return (
    <div>
      <div style={{ padding: "5vmin" }}>
        <Row>
          <Col xs={3} className="center-items">
            <img
              src={profile.images ? profile.images[0].url : null}
              alt={profile.display_name}
              style={{ borderRadius: "50%", height: "20vmin" }}
            ></img>
          </Col>
          <Col xs={9}>
            <p style={{ color: "var(--text-color)", fontSize: "8vmin" }}>
              {profile.display_name}
            </p>
            <a onClick={logoutHandler}>
              <button
                style={{
                  backgroundColor: "var(--cadet-blue)",
                  borderRadius: "5px",
                  border: "0px",
                  fontSize: "4vmin",
                  position: "absolute",
                  bottom: "5px",
                  maxHeight: "50px",
                }}
                className="increase-hover"
              >
                Logout from Playxer
              </button>{" "}
            </a>{" "}
          </Col>
        </Row>
        <h4 style={{ marginTop: "5vh" }}>Modify your account information</h4>
        <Formik
          initialValues={{
            email: "",
          }}
          validationSchema={Yup.object().shape({
            email: Yup.string()
              .email("Email is invalid")
              .required("Email is required"),
          })}
          onSubmit={(values, { setSubmitting }) => {
            setTimeout(() => {
              let dataToSubmit = {
                id: user.userData._id,
                email: values.email,
              };

              dispatch(changeEmail(dataToSubmit)).then((response) => {
                if (response.payload.success) {
                  NotificationManager.success(
                    "Your email was updated",
                    "Success!"
                  );
                } else {
                  let errorMessage = "Unknown error";
                  console.log(response.payload);
                  if (response.payload.err.name === "MongoError") {
                    errorMessage = "";
                    console.log(response.payload.err.keyValue.value);
                    for (var prop in response.payload.err.keyValue)
                      errorMessage +=
                        prop.charAt(0).toUpperCase() +
                        prop.slice(1) +
                        " is already in use";
                  }
                  NotificationManager.error(
                    errorMessage,
                    "Email update unsuccessful"
                  );
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
                <form onSubmit={handleSubmit} className="center-items">
                  <Row className="w-100">
                    <Col md={8}>
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
                          prefix={<Icon type="mail" />}
                          placeholder={user.userData.email}
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
                          <div
                            className="input-feedback"
                            style={{ color: "var(--text-color)" }}
                          >
                            {" "}
                            {errors.email}{" "}
                          </div>
                        )}{" "}
                      </Form.Item>{" "}
                    </Col>
                    <Col md={4}>
                      <Form.Item>
                        <Container className="center-items">
                          <Button
                            onClick={handleSubmit}
                            type="primary"
                            disabled={isSubmitting}
                          >
                            <Container>
                              <p
                                className="my-auto mx-auto"
                                style={{ padding: "5px" }}
                              >
                                Change email{" "}
                              </p>{" "}
                            </Container>{" "}
                          </Button>{" "}
                        </Container>{" "}
                      </Form.Item>{" "}
                    </Col>{" "}
                  </Row>{" "}
                </form>{" "}
              </div>
            );
          }}
        </Formik>
        <Formik
          initialValues={{
            oldPassword: "",
            newPassword: "",
            newPasswordConfirm: "",
          }}
          validationSchema={Yup.object().shape({
            oldPassword: Yup.string()
              .min(6, "Password must be at least 6 characters")
              .required("Current password is required"),
            newPassword: Yup.string()
              .min(6, "Password must be at least 6 characters")
              .required("New password is required"),
            newPasswordConfirm: Yup.string()
              .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
              .required("You have to confirm your password"),
          })}
          onSubmit={(values, { setSubmitting }) => {
            setTimeout(() => {
              let dataToSubmit = {
                oldPassword: values.oldPassword,
                newPassword: values.newPassword,
                id: user.userData._id,
              };

              dispatch(changePassword(dataToSubmit)).then((response) => {
                if (response.payload.success) {
                  NotificationManager.success(
                    "Your password was updated",
                    "Success!"
                  );
                } else {
                  let errorMessage = "Unknown error";
                  console.log(response.payload);
                  if (response.payload) errorMessage = response.payload.message;

                  NotificationManager.error(
                    errorMessage,
                    "Password update unsuccessful"
                  );
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
              <div style={{marginTop: "5vh"}}>
                <form onSubmit={handleSubmit} className="center-items"> 
                  <Row className="w-100">
                    <Col md={8}>
                      <Form.Item
                        required
                        hasFeedback
                        validateStatus={
                          values.oldPassword == ""
                            ? undefined
                            : errors.oldPassword && touched.oldPassword
                            ? "error"
                            : "success"
                        }
                      >
                        <Input
                          id="oldPassword"
                          prefix={<Icon type="lock" />}
                          placeholder="Enter your current password"
                          type="password"
                          value={values.oldPassword}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={
                            errors.oldPassword && touched.oldPassword
                              ? "text-input error"
                              : "text-input"
                          }
                        />{" "}
                        {errors.oldPassword && touched.oldPassword && (
                          <div
                            className="input-feedback"
                            style={{ color: "var(--text-color)" }}
                          >
                            {" "}
                            {errors.oldPassword}{" "}
                          </div>
                        )}{" "}
                      </Form.Item>{" "}
                      <Form.Item
                        required
                        hasFeedback
                        validateStatus={
                          values.newPassword == ""
                            ? undefined
                            : errors.newPassword && touched.newPassword
                            ? "error"
                            : "success"
                        }
                      >
                        <Input
                          id="newPassword"
                          prefix={<Icon type="lock" />}
                          placeholder="Enter your new password"
                          type="password"
                          value={values.newPassword}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={
                            errors.newPassword && touched.newPassword
                              ? "text-input error"
                              : "text-input"
                          }
                        />{" "}
                        {errors.newPassword && touched.newPassword && (
                          <div
                            className="input-feedback"
                            style={{ color: "var(--text-color)" }}
                          >
                            {" "}
                            {errors.newPassword}{" "}
                          </div>
                        )}{" "}
                      </Form.Item>{" "}
                      <Form.Item
                        required
                        hasFeedback
                        validateStatus={
                          values.newPasswordConfirm == ""
                            ? undefined
                            : errors.newPasswordConfirm &&
                              touched.newPasswordConfirm
                            ? "error"
                            : "success"
                        }
                      >
                        <Input
                          id="newPasswordConfirm"
                          prefix={<Icon type="lock" />}
                          placeholder="Re-enter your new password"
                          type="password"
                          value={values.newPasswordConfirm}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={
                            errors.newPasswordConfirm &&
                            touched.newPasswordConfirm
                              ? "text-input error"
                              : "text-input"
                          }
                        />{" "}
                        {errors.newPasswordConfirm &&
                          touched.newPasswordConfirm && (
                            <div
                              className="input-feedback"
                              style={{ color: "var(--text-color)" }}
                            >
                              {" "}
                              {errors.newPasswordConfirm}{" "}
                            </div>
                          )}{" "}
                      </Form.Item>{" "}
                    </Col>
                    <Col md={4} className="center-items">
                      <Form.Item>
                        <Container className="center-items">
                          <Button
                            onClick={handleSubmit}
                            type="primary"
                            disabled={isSubmitting}
                          >
                            <Container>
                              <p
                                className="my-auto mx-auto"
                                style={{ padding: "5px" }}
                              >
                                Change password{" "}
                              </p>{" "}
                            </Container>{" "}
                          </Button>{" "}
                        </Container>{" "}
                      </Form.Item>{" "}
                    </Col>{" "}
                  </Row>{" "}
                </form>{" "}
              </div>
            );
          }}
        </Formik>
      </div>
    </div>
  );
}

export default ProfilePage;
