"use client";

import React from "react";
import styled from "styled-components";
import { NewsletterForm } from "./NewsletterForm";

export const NewsletterHero: React.FC = () => {
  return (
    <HeroContainer>
      <ContentWrapper>
        <Badge>The Morning Brief</Badge>
        <Title>Stay Ahead of the News</Title>
        <Subtitle>
          Get the most important Nepal and Karnali news delivered directly to your
          inbox every morning. Join thousands of smart readers.
        </Subtitle>
        <NewsletterForm source="Homepage Hero" />
      </ContentWrapper>
    </HeroContainer>
  );
};

const HeroContainer = styled.section`
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 80px 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid #dee2e6;
`;

const ContentWrapper = styled.div`
  max-width: 600px;
  width: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Badge = styled.span`
  background-color: #ffe8e8;
  color: #d92027;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 16px;
`;

const Title = styled.h2`
  font-size: 42px;
  font-weight: 800;
  color: #1a1a1a;
  margin: 0 0 16px 0;
  line-height: 1.1;
  letter-spacing: -1px;
  
  @media (max-width: 768px) {
    font-size: 32px;
  }
`;

const Subtitle = styled.p`
  font-size: 18px;
  color: #555;
  margin: 0 0 32px 0;
  line-height: 1.5;
  
  @media (max-width: 768px) {
    font-size: 16px;
  }
`;
