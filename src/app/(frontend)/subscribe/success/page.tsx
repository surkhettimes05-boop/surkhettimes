"use client";

import React, { Suspense } from "react";
import styled from "styled-components";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const SuccessContent = () => {
  const searchParams = useSearchParams();
  const alreadyVerified = searchParams.get("alreadyVerified") === "true";

  return (
    <Container>
      <IconWrapper>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#278c43" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      </IconWrapper>
      
      <Title>
        {alreadyVerified ? "You're already verified!" : "Subscription Confirmed!"}
      </Title>
      
      <Subtitle>
        {alreadyVerified
          ? "Your email address is already on our active subscriber list. You're all set to receive our newsletters."
          : "Thank you for verifying your email. You will now receive the Morning Brief and breaking news alerts directly in your inbox."}
      </Subtitle>

      <Button href="/">Return to Homepage</Button>
    </Container>
  );
};

export default function SubscribeSuccessPage() {
  return (
    <PageWrapper>
      <Suspense fallback={<div>Loading...</div>}>
        <SuccessContent />
      </Suspense>
    </PageWrapper>
  );
}

const PageWrapper = styled.div`
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background-color: #f9f9f9;
`;

const Container = styled.div`
  background: white;
  padding: 60px 40px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  max-width: 500px;
  width: 100%;
  text-align: center;
  border-top: 4px solid #278c43;
`;

const IconWrapper = styled.div`
  margin-bottom: 24px;
  display: flex;
  justify-content: center;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 16px 0;
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: #555;
  line-height: 1.6;
  margin: 0 0 32px 0;
`;

const Button = styled(Link)`
  display: inline-block;
  background-color: #d92027;
  color: white;
  padding: 14px 28px;
  border-radius: 6px;
  font-weight: 600;
  text-decoration: none;
  transition: background-color 0.2s;

  &:hover {
    background-color: #b81b21;
  }
`;
