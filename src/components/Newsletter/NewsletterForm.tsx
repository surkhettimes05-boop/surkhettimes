"use client";

import React, { useState } from "react";
import styled from "styled-components";

interface NewsletterFormProps {
  source?: string;
}

export const NewsletterForm: React.FC<NewsletterFormProps> = ({
  source = "Direct",
}) => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"IDLE" | "LOADING" | "SUCCESS" | "ERROR">("IDLE");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setStatus("ERROR");
      setMessage("Please enter a valid email address.");
      return;
    }

    setStatus("LOADING");

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          source,
          honeypot: "", // Used to trick bots
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to subscribe");
      }

      setStatus("SUCCESS");
      setMessage(data.message || "Subscribed successfully!");
      setEmail("");
    } catch (err: any) {
      setStatus("ERROR");
      setMessage(err.message || "An unexpected error occurred.");
    }
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <InputWrapper>
        <EmailInput
          type="email"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === "LOADING" || status === "SUCCESS"}
          required
        />
        {/* Honeypot field for spam bots */}
        <HoneypotInput type="text" name="honeypot" tabIndex={-1} autoComplete="off" />
        <SubmitButton
          type="submit"
          disabled={status === "LOADING" || status === "SUCCESS"}
        >
          {status === "LOADING" ? "Subscribing..." : "Subscribe"}
        </SubmitButton>
      </InputWrapper>
      
      {status === "SUCCESS" && <SuccessMessage>{message}</SuccessMessage>}
      {status === "ERROR" && <ErrorMessage>{message}</ErrorMessage>}
      
      <Guarantees>
        <GuaranteeItem>
          <CheckIcon /> No spam
        </GuaranteeItem>
        <GuaranteeItem>
          <CheckIcon /> Unsubscribe anytime
        </GuaranteeItem>
      </Guarantees>
    </FormContainer>
  );
};

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
`;

const InputWrapper = styled.div`
  display: flex;
  gap: 8px;
  
  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const EmailInput = styled.input`
  flex: 1;
  padding: 14px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 16px;
  font-family: inherit;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #d92027;
    box-shadow: 0 0 0 3px rgba(217, 32, 39, 0.1);
  }
  
  &:disabled {
    background-color: #f9f9f9;
    cursor: not-allowed;
  }
`;

const HoneypotInput = styled.input`
  display: none;
`;

const SubmitButton = styled.button`
  background-color: #d92027;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 14px 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.1s ease;
  white-space: nowrap;
  
  &:hover:not(:disabled) {
    background-color: #b81b21;
  }
  
  &:active:not(:disabled) {
    transform: scale(0.98);
  }
  
  &:disabled {
    background-color: #f0898d;
    cursor: not-allowed;
  }
`;

const MessageBase = styled.p`
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  padding: 10px 12px;
  border-radius: 6px;
`;

const SuccessMessage = styled(MessageBase)`
  background-color: #e6f7eb;
  color: #278c43;
  border: 1px solid #c3e8cd;
`;

const ErrorMessage = styled(MessageBase)`
  background-color: #fdeded;
  color: #d32f2f;
  border: 1px solid #f9caca;
`;

const Guarantees = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 4px;
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 8px;
  }
`;

const GuaranteeItem = styled.span`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #666;
`;

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#278c43" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);
