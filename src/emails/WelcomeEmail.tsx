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

interface WelcomeEmailProps {
  unsubscribeLink: string;
  preferencesLink: string;
}

export const WelcomeEmail = ({
  unsubscribeLink,
  preferencesLink,
}: WelcomeEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Welcome to Surkhet Times - Your Daily Morning Brief</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Welcome to Surkhet Times!</Heading>
          <Text style={text}>
            Thank you for subscribing to our newsletter. You're now on the list
            to get the most important Nepal and Karnali news delivered directly
            to your inbox.
          </Text>
          <Text style={text}>
            Here's what you can expect from us:
          </Text>
          <ul style={list}>
            <li style={listItem}><strong>Daily Briefs:</strong> The top stories you need to know every morning.</li>
            <li style={listItem}><strong>Breaking News:</strong> Important updates as they happen.</li>
            <li style={listItem}><strong>Weekly Digests:</strong> A summary of the week's best journalism.</li>
          </ul>
          
          <Section style={buttonContainer}>
            <Button style={button} href="https://surkhettimes.com">
              Visit Surkhet Times
            </Button>
          </Section>
          
          <Text style={text}>
            You can customize what emails you receive by updating your{" "}
            <Link style={link} href={preferencesLink}>
              email preferences
            </Link>.
          </Text>

          <Text style={footer}>
            &copy; {new Date().getFullYear()} Surkhet Times. All rights reserved.<br />
            Don't want these emails?{" "}
            <Link style={footerLink} href={unsubscribeLink}>
              Unsubscribe anytime
            </Link>.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default WelcomeEmail;

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

const list = {
  paddingLeft: "24px",
  margin: "0 0 20px",
};

const listItem = {
  color: "#4a4a4a",
  fontSize: "16px",
  lineHeight: "24px",
  marginBottom: "10px",
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

const link = {
  color: "#d92027",
  textDecoration: "underline",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
  margin: "40px 0 0",
  textAlign: "center" as const,
};

const footerLink = {
  color: "#8898aa",
  textDecoration: "underline",
};
