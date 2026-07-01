import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { Box, Chip } from '@mui/material';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import CheckIcon         from '@mui/icons-material/Check';
import ArrowForwardIcon  from '@mui/icons-material/ArrowForward';
import PeopleIcon        from '@mui/icons-material/People';
import CalendarIcon      from '@mui/icons-material/CalendarMonth';
import ReceiptIcon       from '@mui/icons-material/Receipt';
import SecurityIcon      from '@mui/icons-material/Security';
import SpeedIcon         from '@mui/icons-material/Speed';
import CloudIcon         from '@mui/icons-material/Cloud';
import {plans,features} from './Config'

// ── Animations ─────────────────────────────────────────
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-10px); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.7; }
`;

// ── Layout ─────────────────────────────────────────────
const Page = styled.div`
  min-height: 100vh;
  background: #F7F9FC;
  font-family: 'Inter', 'Roboto', sans-serif;
`;

const Nav = styled.nav`
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 100;
  background: rgba(255,255,255,0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #E2E8F0;
  padding: 0 40px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const NavBrand = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 20px;
  font-weight: 800;
  color: #1565C0;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 32px;
  @media (max-width: 768px) { display: none; }
`;

const NavLink = styled.a`
  color: #5A7184;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  &:hover { color: #1565C0; }
`;

const NavActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const BtnOutline = styled.button`
  padding: 8px 20px;
  border: 2px solid #1565C0;
  border-radius: 8px;
  background: transparent;
  color: #1565C0;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  &:hover { background: #1565C0; color: #fff; }
`;

const BtnPrimary = styled.button`
  padding: 8px 20px;
  border: none;
  border-radius: 8px;
  background: #1565C0;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  &:hover { background: #003C8F; }
`;

// ── Hero ───────────────────────────────────────────────
const Hero = styled.section`
  padding: 140px 40px 80px;
  text-align: center;
  background: linear-gradient(135deg, #1565C0 0%, #003C8F 50%, #1A1A2E 100%);
  position: relative;
  overflow: hidden;
  &::before {
    content: '';
    position: absolute;
    top: -50%; left: -50%;
    width: 200%; height: 200%;
    background: radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 60%);
    animation: ${pulse} 4s ease infinite;
  }
`;

const HeroBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 20px;
  padding: 6px 16px;
  color: #93C5FD;
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 24px;
  animation: ${fadeUp} 0.6s ease;
`;

const HeroTitle = styled.h1`
  font-size: clamp(36px, 6vw, 72px);
  font-weight: 800;
  color: #fff;
  line-height: 1.1;
  margin: 0 0 24px;
  animation: ${fadeUp} 0.7s ease;
  span { color: #60A5FA; }
`;

const HeroSub = styled.p`
  font-size: clamp(16px, 2vw, 20px);
  color: rgba(255,255,255,0.75);
  max-width: 600px;
  margin: 0 auto 40px;
  line-height: 1.6;
  animation: ${fadeUp} 0.8s ease;
`;

const HeroActions = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
  animation: ${fadeUp} 0.9s ease;
`;

const HeroBtnPrimary = styled.button`
  padding: 14px 32px;
  background: #fff;
  color: #1565C0;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
  &:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.2); }
`;

const HeroBtnOutline = styled.button`
  padding: 14px 32px;
  background: transparent;
  color: #fff;
  border: 2px solid rgba(255,255,255,0.4);
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  &:hover { border-color: #fff; background: rgba(255,255,255,0.1); }
`;

const HeroStats = styled.div`
  display: flex;
  justify-content: center;
  gap: 48px;
  margin-top: 64px;
  flex-wrap: wrap;
  animation: ${fadeUp} 1s ease;
`;

const HeroStat = styled.div`
  text-align: center;
  .value { font-size: 36px; font-weight: 800; color: #fff; }
  .label { font-size: 13px; color: rgba(255,255,255,0.6); margin-top: 4px; }
`;

// ── Section ────────────────────────────────────────────
const Section = styled.section`
  padding: 80px 40px;
  max-width: 1200px;
  margin: 0 auto;
`;

const SectionBadge = styled.div`
  display: inline-block;
  background: #E3F0FF;
  color: #1565C0;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  padding: 4px 12px;
  border-radius: 20px;
  margin-bottom: 12px;
`;

const SectionTitle = styled.h2`
  font-size: clamp(28px, 4vw, 42px);
  font-weight: 800;
  color: #1A1A2E;
  margin: 0 0 16px;
  span { color: #1565C0; }
`;

const SectionSub = styled.p`
  font-size: 16px;
  color: #718096;
  max-width: 560px;
  line-height: 1.6;
  margin: 0 0 48px;
`;

// ── Features ───────────────────────────────────────────
const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
`;

const FeatureCard = styled.div`
  background: #fff;
  border: 1px solid #E2E8F0;
  border-radius: 16px;
  padding: 28px;
  transition: all 0.3s;
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(21,101,192,0.1);
    border-color: #1565C0;
  }
`;

const FeatureIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${({ bg }) => bg || '#E3F0FF'};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  color: ${({ color }) => color || '#1565C0'};
  animation: ${float} 3s ease infinite;
  animation-delay: ${({ delay }) => delay || '0s'};
`;

const FeatureTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #1A1A2E;
  margin: 0 0 8px;
`;

const FeatureDesc = styled.p`
  font-size: 14px;
  color: #718096;
  line-height: 1.6;
  margin: 0;
`;

// ── Pricing ────────────────────────────────────────────
const PricingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  align-items: start;
`;

const PricingCard = styled.div`
  background: ${({ featured }) => featured ? 'linear-gradient(135deg, #1565C0, #003C8F)' : '#fff'};
  border: ${({ featured }) => featured ? 'none' : '1px solid #E2E8F0'};
  border-radius: 20px;
  padding: 36px 28px;
  position: relative;
  transition: all 0.3s;
  transform: ${({ featured }) => featured ? 'scale(1.05)' : 'scale(1)'};
  box-shadow: ${({ featured }) => featured ? '0 20px 60px rgba(21,101,192,0.3)' : 'none'};
  &:hover {
    box-shadow: ${({ featured }) => featured
      ? '0 24px 80px rgba(21,101,192,0.4)'
      : '0 8px 24px rgba(0,0,0,0.08)'};
  }
`;

const PopularBadge = styled.div`
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: #F59E0B;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  padding: 4px 16px;
  border-radius: 20px;
`;

const PlanName = styled.div`
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: ${({ featured }) => featured ? 'rgba(255,255,255,0.7)' : '#718096'};
  margin-bottom: 8px;
`;

const PlanPrice = styled.div`
  font-size: 48px;
  font-weight: 800;
  color: ${({ featured }) => featured ? '#fff' : '#1A1A2E'};
  line-height: 1;
  margin-bottom: 4px;
  span { font-size: 20px; font-weight: 500; }
`;

const PlanPeriod = styled.div`
  font-size: 13px;
  color: ${({ featured }) => featured ? 'rgba(255,255,255,0.6)' : '#718096'};
  margin-bottom: 24px;
`;

const PlanDesc = styled.div`
  font-size: 14px;
  color: ${({ featured }) => featured ? 'rgba(255,255,255,0.75)' : '#718096'};
  margin-bottom: 24px;
  line-height: 1.5;
`;

const PlanDivider = styled.hr`
  border: none;
  border-top: 1px solid ${({ featured }) => featured ? 'rgba(255,255,255,0.15)' : '#E2E8F0'};
  margin-bottom: 24px;
`;

const PlanFeatures = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 32px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const PlanFeature = styled.li`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: ${({ featured }) => featured ? 'rgba(255,255,255,0.85)' : '#2D3748'};
`;

const CheckCircle = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: ${({ featured }) => featured ? 'rgba(255,255,255,0.2)' : '#E3F0FF'};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: ${({ featured }) => featured ? '#fff' : '#1565C0'};
`;

const PlanBtn = styled.button`
  width: 100%;
  padding: 14px;
  border-radius: 10px;
  border: ${({ featured }) => featured ? 'none' : '2px solid #1565C0'};
  background: ${({ featured }) => featured ? '#fff' : 'transparent'};
  color: ${({ featured }) => featured ? '#1565C0' : '#1565C0'};
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    background: ${({ featured }) => featured ? '#E3F0FF' : '#1565C0'};
    color: ${({ featured }) => featured ? '#1565C0' : '#fff'};
    transform: translateY(-1px);
  }
`;

// ── Footer ─────────────────────────────────────────────
const Footer = styled.footer`
  background: #1A1A2E;
  color: rgba(255,255,255,0.6);
  text-align: center;
  padding: 32px 40px;
  font-size: 14px;
`;


// ── Component ──────────────────────────────────────────
const LandingPage = () => {
  const navigate = useNavigate();

  const handleSelectPlan = (plan) => {
    navigate('/signup', { state: { plan } });
  };

  return (
    <Page>
      {/* Navbar */}
      <Nav>
        <NavBrand>
          <LocalHospitalIcon sx={{ fontSize: 28 }} />
          MediCloud HMS
        </NavBrand>
        <NavLinks>
          <NavLink href="#features">Features</NavLink>
          <NavLink href="#pricing">Pricing</NavLink>
          <NavLink href="#contact">Contact</NavLink>
        </NavLinks>
        <NavActions>
          <BtnOutline onClick={() => navigate('/login')}>Sign In</BtnOutline>
          <BtnPrimary onClick={() => navigate('/signup')}>Get Started</BtnPrimary>
        </NavActions>
      </Nav>

      {/* Hero */}
      <Hero>
        <HeroBadge>
          🏥 Trusted by 500+ Hospitals across India
        </HeroBadge>
        <HeroTitle>
          Modern Hospital<br />
          Management <span>Simplified</span>
        </HeroTitle>
        <HeroSub>
          One platform to manage patients, appointments, billing, staff,
          and communications — all in one secure, cloud-based system.
        </HeroSub>
        <HeroActions>
          <HeroBtnPrimary onClick={() => navigate('/signup')}>
            Start Free Trial <ArrowForwardIcon fontSize="small" />
          </HeroBtnPrimary>
          <HeroBtnOutline onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}>
            See Features
          </HeroBtnOutline>
        </HeroActions>
        <HeroStats>
          {[
            { value: '500+', label: 'Hospitals' },
            { value: '1M+',  label: 'Patients Managed' },
            { value: '99.9%',label: 'Uptime' },
            { value: '24/7', label: 'Support' },
          ].map((s) => (
            <HeroStat key={s.label}>
              <div className="value">{s.value}</div>
              <div className="label">{s.label}</div>
            </HeroStat>
          ))}
        </HeroStats>
      </Hero>

      {/* Features */}
      <Section id="features">
        <SectionBadge>Features</SectionBadge>
        <SectionTitle>Everything your hospital <span>needs</span></SectionTitle>
        <SectionSub>
          Powerful tools built specifically for healthcare — from patient intake
          to final billing, we have you covered.
        </SectionSub>
        <FeaturesGrid>
          {features.map((f) => (
            <FeatureCard key={f.title}>
              <FeatureIcon bg={f.bg} color={f.color} delay={f.delay}>
                {f.icon}
              </FeatureIcon>
              <FeatureTitle>{f.title}</FeatureTitle>
              <FeatureDesc>{f.desc}</FeatureDesc>
            </FeatureCard>
          ))}
        </FeaturesGrid>
      </Section>

      {/* Pricing */}
      <div style={{ background: '#F0F4FF', padding: '80px 40px' }} id="pricing">
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <SectionBadge>Pricing</SectionBadge>
          <SectionTitle>Simple, <span>transparent</span> pricing</SectionTitle>
          <SectionSub>
            No hidden fees. No surprises. Pick a plan that fits your hospital's size.
          </SectionSub>
          <PricingGrid>
            {plans.map((plan) => (
              <PricingCard key={plan.name} featured={plan.featured}>
                {plan.featured && <PopularBadge>Most Popular</PopularBadge>}
                <PlanName featured={plan.featured}>{plan.name}</PlanName>
                <PlanPrice featured={plan.featured}>
                  <span>₹</span>{plan.price.replace('₹', '')}
                </PlanPrice>
                <PlanPeriod featured={plan.featured}>{plan.period}</PlanPeriod>
                <PlanDesc featured={plan.featured}>{plan.desc}</PlanDesc>
                <PlanDivider featured={plan.featured} />
                <PlanFeatures>
                  {plan.features.map((f) => (
                    <PlanFeature key={f} featured={plan.featured}>
                      <CheckCircle featured={plan.featured}>
                        <CheckIcon sx={{ fontSize: 12 }} />
                      </CheckCircle>
                      {f}
                    </PlanFeature>
                  ))}
                </PlanFeatures>
                <PlanBtn
                  featured={plan.featured}
                  onClick={() => handleSelectPlan(plan.value)}
                >
                  Get Started with {plan.name}
                </PlanBtn>
              </PricingCard>
            ))}
          </PricingGrid>
        </div>
      </div>

      {/* Footer */}
      <Footer>
        © 2026 MediCloud HMS. All rights reserved. Built for Healthcare SaaS.
      </Footer>
    </Page>
  );
};

export default LandingPage;