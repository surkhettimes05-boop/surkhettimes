"use client";

import React from "react";
import styled from "styled-components";
import { NewsletterForm } from "./NewsletterForm";

export const NewsletterFooter: React.FC = () => {
  return (
    <FooterContainer>
      <ContentWrapper>
        <TextContent>
          <Title>Get the Morning Brief</Title>
          <Subtitle>
            Start your day with the most important stories from Nepal and Karnali.
          </Subtitle>
        </TextContent>
        <FormWrapper>
          <NewsletterForm source="Footer" />
        </FormWrapper>
      </ContentWrapper>
    </FooterContainer>
  );
};

const FooterContainer = styled.div`
  background-color: #111;
  color: #fff;
  padding: 60px 20px;
  border-top: 4px solid #d92027;
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 40px;
  
  @media (max-width: 900px) {
    flex-direction: column;
    text-align: center;
  }
`;

const TextContent = styled.div`
  flex: 1;
`;

const Title = styled.h3`
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 12px 0;
  color: #fff;
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: #aaa;
  margin: 0;
  line-height: 1.5;
`;

const FormWrapper = styled.div`
  flex: 1;
  width: 100%;
  max-width: 500px;
`;
