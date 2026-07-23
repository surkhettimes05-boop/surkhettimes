import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Button,
} from "@react-email/components";
import * as React from "react";

interface VerifyEmailProps {
  verificationLink: string;
}

export const VerifyEmail = ({ verificationLink }: VerifyEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Verify your email address for Surkhet Times</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Confirm your subscription</Heading>
          <Text style={text}>
            Thank you for subscribing to Surkhet Times! Please verify your email
            address by clicking the button below. This ensures we have the right
            email and you want to receive our newsletters.
          </Text>
          <Section style={buttonContainer}>
            <Button style={button} href={verificationLink}>
              Verify Email Address
            </Button>
          </Section>
          <Text style={text}>
            If you didn't request this, you can safely ignore this email.
          </Text>
          <Text style={footer}>
            &copy; {new Date().getFullYear()} Surkhet Times. All rights reserved.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default VerifyEmail;

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "40px 20px",
  borderRadius: "8px",
  maxWidth: "600px",
  marginTop: "40px",
  marginBottom: "40px",
  border: "1px solid #eee",
};

const h1 = {
  color: "#1a1a1a",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "0 0 20px",
  padding: "0",
  lineHeight: "1.25",
};

const text = {
  color: "#4a4a4a",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "0 0 20px",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "30px 0",
};

const button = {
  backgroundColor: "#d92027",
  borderRadius: "4px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 24px",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
  margin: "20px 0 0",
};
