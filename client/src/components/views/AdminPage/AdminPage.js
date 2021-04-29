import { Input, Table } from "antd";
import "antd/dist/antd.css";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { RiShutDownLine } from "react-icons/ri";
import { NotificationManager } from "react-notifications";
import "react-notifications/lib/notifications.css";
import { Container } from "reactstrap";
import { deleteUser, getUsers } from "../../../_actions/admin_actions";
import DarkMode from "../../common/DarkMode";
import { USER_SERVER } from "../../Config";
import "../../styles/AdminPage.css";

const { Search } = Input;

function AdminPage(props) {
  const [usersInfo, setUsersInfo] = useState([]);
  const [filteredInfo, setFilteredInfo] = useState([]);
  useEffect(() => {
    getData();
  }, []);
  const getData = () => {
    getUsers()
      .then((response) => {
        console.log(response);
        setUsersInfo(response.data);
        setFilteredInfo(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDelete = (record) => {
    if (window.confirm("Are you sure you wish to delete this user?")) {
      console.log("delete", record);
      deleteUser({ user: record })
        .then((response) => {
          console.log(response);
          if (response.success) {
            NotificationManager.success("User deleted", "Success!");
            let temp = usersInfo.filter((item) => item.email !== record.email);
            setUsersInfo(temp);
            let tempfil = filteredInfo.filter(
              (item) => item.email !== record.email
            );
            setFilteredInfo(tempfil);
          } else NotificationManager.error("User not deleted", "Error!");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const logoutHandler = () => {
    axios.get(`${USER_SERVER}/logout`).then((response) => {
      if (response.status === 200) {
        props.history.push("/auth");
      } else {
        alert("Log Out Failed");
      }
    });
  };

  const columns = [
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      sorter: (a, b) => a.username.localeCompare(b.username),
      render: (record) => <p className="table__text"> {record} </p>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (record) => <p className="table__text"> {record} </p>,
    },
    {
      title: "Action",
      key: "action",
      render: (record) => (
        <span
          className="table__action"
          href="/#"
          onClick={() => handleDelete(record)}
        >
          Delete{" "}
        </span>
      ),
    },
  ];

  const searchFunction = (value) => {
    var temp = usersInfo.filter((o) =>
      Object.keys(o).some((k) =>
        String(o[k]).toLowerCase().includes(value.toLowerCase())
      )
    );
    setFilteredInfo(temp);
  };

  return (
    <div className="center-items">
      <DarkMode />
      <Container style={{ margin: "10px" }}>
        <div
          className="center-items"
          style={{ display: "flex", flexDirection: "row" }}
        >
          <p className="panel__title">Admin control panel </p>{" "}
          <RiShutDownLine
            color="red"
            size="sm"
            className="logout-icon"
            onClick={() => {
              logoutHandler();
            }}
          />
        </div>{" "}
        <Search
          style={{ margin: "0 0 20px 0" }}
          placeholder="Search by..."
          enterButton
          onSearch={searchFunction}
          on
        />{" "}
        {filteredInfo && (
          <Table
            columns={columns}
            rowKey={(record) => record.username}
            dataSource={filteredInfo}
          />
        )}{" "}
      </Container>{" "}
    </div>
  );
}

export default AdminPage;
