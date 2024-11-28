import React, { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "../../App.css";
import {
  UserOutlined,
  HomeOutlined,
  GiftOutlined,
  EyeOutlined,
  LogoutOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Layout, Menu, Button, message } from "antd";
import logo from "../../assets/logo.png";
import Dashboard from "../../pages/dashboard";
import Customer from "../../pages/customer";
import CustomerCreate from "../../pages/customer/create";
import CustomerEdit from "../../pages/customer/edit";
// promotion
import Promotion from "../../pages/promotion";
import PromotionCreate from "../../pages/promotion/create";
import PromotionEdit from "../../pages/promotion/edit";
// view
import View from "../../pages/view";

import Zzz from "../../pages/zzz";

const { Header, Content, Footer, Sider } = Layout;

const FullLayout: React.FC = () => {
  const page = localStorage.getItem("page");
  const [messageApi, contextHolder] = message.useMessage();
  const [collapsed, setCollapsed] = useState(false);

  const setCurrentPage = (val: string) => {
    localStorage.setItem("page", val);
  };

  const Logout = () => {
    localStorage.clear();
    messageApi.success("Logout successful");
    setTimeout(() => {
      location.href = "/";
    }, 2000);
  };

  return (
    <Layout style={{ minHeight: "100vh", background: "#DAD6EF" }}>
      {contextHolder}

      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        style={{ background: "#8792E7" }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100%",
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: 20,
                marginBottom: 20,
              }}
            >
              <img src={logo} alt="Logo" style={{ width: "80%" }} />
            </div>
            <Menu
              theme="dark"
              defaultSelectedKeys={[page ? page : "dashboard"]}
              mode="inline"
              style={{ background: "#8792E7", color: "#fff" }}
            >
              <Menu.Item
                key="dashboard"
                onClick={() => setCurrentPage("dashboard")}
              >
                <Link to="/" style={{ color: "#000" }}>
                  <HomeOutlined style={{ marginRight: "8px" }} />
                  <span> Home </span>
                </Link>
              </Menu.Item>

              <Menu.Item
                key="customer"
                onClick={() => setCurrentPage("customer")}
              >
                <Link to="/customer" style={{ color: "#000" }}>
                  <UserOutlined style={{ marginRight: "8px" }} />
                  <span> User </span>
                </Link>
              </Menu.Item>

              <Menu.Item
                key="promotion"
                onClick={() => setCurrentPage("promotion")}
              >
                <Link to="/promotion" style={{ color: "#000" }}>
                  <EditOutlined style={{ marginRight: "8px" }} />
                  <span>Promotion</span>
                </Link>
              </Menu.Item>

              <Menu.Item
                key="view"
                onClick={() => setCurrentPage("view")}
              >
                <Link to="/view" style={{ color: "#000" }}>
                  <GiftOutlined style={{ marginRight: "8px" }} />
                  <span>Promotion All</span>
                </Link>
              </Menu.Item>

              <Menu.Item
                key="zzz"
                onClick={() => setCurrentPage("zzz")}
              >
                <Link to="/zzz" style={{ color: "#000" }}>
                  <EyeOutlined style={{ marginRight: "8px" }} />
                  <span>Test Promotion</span>
                </Link>
              </Menu.Item>

            </Menu>
            
          </div>

          <Button
            onClick={Logout}
            style={{
              margin: 4,
              background: "#DAD6EF",
              color: "#000",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <LogoutOutlined style={{ marginRight: "8px" }} />
            ออกจากระบบ
          </Button>
        </div>
      </Sider>

      <Layout>
        <Header style={{ padding: 0, background: "#DAD6EF" }} />
        <Content style={{ margin: "0 16px", background: "#DAD6EF" }}>
          <Breadcrumb style={{ margin: "16px 0" }} />
          <div
            style={{
              padding: 24,
              minHeight: "100%",
              background: "#DAD6EF",
            }}
          >
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/customer" element={<Customer />} />
              <Route path="/customer/create" element={<CustomerCreate />} />
              <Route path="/customer/edit/:id" element={<CustomerEdit />} />
              {/* promotion */}
              <Route path="/promotion" element={<Promotion />} />
              <Route path="/promotion/create" element={<PromotionCreate />} />
              <Route path="/promotion/edit/:id" element={<PromotionEdit />} />
              {/* view */}
              <Route path="/view" element={<View />} />
              <Route path="/zzz" element={<Zzz />} />
            </Routes>
          </div>
        </Content>
        <Footer
          style={{
            textAlign: "center",
            background: "#DAD6EF",
          }}
        >
          System Analysis and Design 1/67
        </Footer>
      </Layout>
    </Layout>
  );
};

export default FullLayout;
