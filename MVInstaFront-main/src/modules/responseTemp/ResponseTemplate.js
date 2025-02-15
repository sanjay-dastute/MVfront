import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Form, Input, Button, Space, message, Col, Row, Typography } from "antd";
import Cookies from "js-cookie";
import {
  getResponseTemplate,
  submitResponseTemplate,
} from "../../services/userService";
import { createNotification } from "../../services/conversationService";
import "../../reducers/dashboardReducer";

const { TextArea } = Input;
const { Title } = Typography;

const ResponseTemplate = ({ refreshNotifications }) => {
  const [form] = Form.useForm();

  const { screenSize } = useSelector(({dashboardReducer}) => dashboardReducer);

  useEffect(() => {
    const fetchTemplateData = async () => {
      try {
        const organizationId = Cookies.get('organizationId');
        const responseData = await getResponseTemplate(organizationId);
        form.setFieldsValue({
          aboutUs: responseData.about,
          specialInstructions: responseData.specialInstructions,
          shippingPolicy: responseData.shippingPolicy,
          returnPolicy: responseData.returnPolicy,
          // paymentTerm: responseData.paymentTerm,
          paymentType: responseData.paymentType,
        });
      } catch (error) {
        console.error("Error loading response template:", error);
        message.error("Failed to load response template. Please try again.");
      }
    };

    fetchTemplateData();
  }, [form]);

  const onFinish = async (values) => {
    const requestData = {
      about: values.aboutUs,
      specialInstructions: values.specialInstructions,
      shippingPolicy: values.shippingPolicy,
      returnPolicy: values.returnPolicy,
      // paymentTerm: values.paymentTerm,
      paymentType: values.paymentType,
    };

    try {
      const response = await submitResponseTemplate(requestData);
      message.success("Response template saved successfully");

      // Create notification
      try {
        const notificationMessage = "Response Template has been updated.";
        await createNotification(notificationMessage);
        refreshNotifications();
      } catch (notificationError) {
        console.error("Notification Error:", notificationError);
      }
    } catch (error) {
      console.error("Error:", error);
      message.error("Failed to save response template. Please try again.");
    }
  };

  const onReset = () => {
    form.resetFields();
  };

  return (
    <Row style={{ justifyContent: 'center' }}>
      <Col span={24}>
        <Title level={screenSize < 576 ? 3 : 2} style={{ textAlign: "center", marginBottom: "20px" }}>
          Response Template
        </Title>
      </Col>
      <Col md={15} xs={24}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            aboutUs: "",
            specialInstructions: "",
            shippingPolicy: "",
            returnPolicy: "",
            // paymentTerm: "",
            paymentType: "",
          }}>
          <Form.Item
            label="About Us"
            name="aboutUs"
            rules={[
              { required: true, message: "About Us section is required" },
              { min: 10, message: "About Us section must be at least 10 characters" }
            ]}>
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item
            label="Special Instructions"
            name="specialInstructions"
            rules={[
              {
                required: false,
                min: 10,
                message: "Special Instructions must be at least 10 characters if provided"
              },
            ]}>
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item
            label="Shipping Policy"
            name="shippingPolicy"
            rules={[
              {
                required: false,
                min: 10,
                message: "Shipping Policy must be at least 10 characters if provided"
              },
            ]}>
            <TextArea 
              rows={4}
              showCount={false}
              autoSize={{ minRows: 4, maxRows: 8 }}
            />
          </Form.Item>

          <Form.Item
            label="Return Policy"
            name="returnPolicy"
            rules={[
              {
                required: false,
                min: 10,
                message: "Return Policy must be at least 10 characters if provided"
              },
            ]}>
            <TextArea 
              rows={4}
              showCount={false}
              autoSize={{ minRows: 4, maxRows: 8 }}
            />
          </Form.Item>

          {/* <Form.Item
            label="Payment Term"
            name="paymentTerm"
            rules={[
              {
                required: false,
                // message: "Please input the Payment Term section!",
              },
            ]}>
            <TextArea rows={2} />
          </Form.Item> */}

          <Form.Item
            label="Payment Type"
            name="paymentType"
            rules={[
              {
                required: false,
                // message: "Please input the Payment Type!"
              },
            ]}>
            <Input 
              showCount={false}
              maxLength={null}
            />
          </Form.Item>

          <Form.Item>
            <Space size="large">
              <Button type="primary" htmlType="submit" className="btn-size">
                Update
              </Button>
              {/* <Button htmlType="button" type="primary" onClick={onReset} ghost className="btn-size">
                Cancel
              </Button> */}
            </Space>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};

export default ResponseTemplate;
