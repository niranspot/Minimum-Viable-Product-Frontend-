import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Alert,
  CircularProgress,
  Typography,
  InputAdornment,
  IconButton,
  Chip,
  LinearProgress,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  LocalHospital,
  CheckCircle,
  Business,
  AlternateEmail,
  LockOutlined,
  Language,
  VerifiedUser,
  Check,
  Launch,
  ArrowForward,
} from "@mui/icons-material";
import styled, { keyframes } from "styled-components";
import axiosClient from "../../services/axiosClient";

// ── Animations ─────────────────────────────────────────
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { opacity: 0; transform: translateX(30px); }
  to { opacity: 1; transform: translateX(0); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
`;

// ── Styled Components ──────────────────────────────────
const Page = styled.div`
  height: 100vh;
  max-height: 100vh;
  display: flex;
  font-family: "Inter", "Roboto", sans-serif;
  background-color: #f8fafc;
  overflow: hidden; /* Lock the view screen completely */

  @media (max-width: 900px) {
    flex-direction: column;
    height: auto;
    max-height: none;
    overflow-y: auto;
  }
`;

const LeftSide = styled.div`
  flex: 1.2;
  background: radial-gradient(
    circle at 80% 20%,
    #1e40af 0%,
    #1e3a8a 40%,
    #0f172a 100%
  );
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 40px 60px;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: -100px;
    right: -100px;
    width: 500px;
    height: 500px;
    border-radius: 50%;
    background: radial-gradient(
      circle,
      rgba(96, 165, 250, 0.08) 0%,
      transparent 70%
    );
  }

  @media (max-width: 1024px) {
    padding: 40px;
  }

  @media (max-width: 900px) {
    padding: 32px 24px;
  }
`;

const RightSide = styled.div`
  width: 540px;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 32px 48px;
  box-shadow: -10px 0 30px rgba(0, 0, 0, 0.02);
  animation: ${fadeIn} 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden; /* Absolute lockdown on desktop scrollbars */

  @media (max-width: 1024px) {
    padding: 32px;
    width: 480px;
  }

  @media (max-width: 900px) {
    width: 100%;
    padding: 32px 24px;
  }
`;

const BrandRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 32px;
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 16px;
  background: rgba(255, 255, 255, 0.02);
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.04);
`;

const FeatureIcon = styled.div`
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 18px;
`;

const PlanBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: ${({ plan }) =>
    plan === "enterprise" ? "#0f172a" : plan === "pro" ? "#2563eb" : "#e0f2fe"};
  color: ${({ plan }) =>
    plan === "enterprise" ? "#fff" : plan === "pro" ? "#fff" : "#0369a1"};
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  padding: 4px 12px;
  border-radius: 30px;
`;

const FormLabelText = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: #475569;
  margin-bottom: 4px;
  display: block;
  letter-spacing: 0.3px;
`;

const SubmitBtn = styled.button`
  width: 100%;
  padding: 13px;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 14.5px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  margin-top: 4px;
  box-shadow: 0 4px 14px rgba(37, 99, 235, 0.2);

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #1d4ed8, #1e40af);
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

const SuccessPage = styled.div`
  height: 100vh;
  max-height: 100vh;
  display: flex;
  background: #f1f5f9;
  overflow: hidden;

  @media (max-width: 968px) {
    flex-direction: column-reverse;
    height: auto;
    max-height: none;
  }
`;

const SuccessLeftImage = styled.div`
  flex: 1.3;
  background:
    linear-gradient(135deg, rgba(15, 23, 42, 0.7), rgba(30, 58, 95, 0.85)),
    url("https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1400&q=80");
  background-size: cover;
  background-position: center 30%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 64px 56px;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 200px;
    background: linear-gradient(to top, rgba(15, 23, 42, 0.6), transparent);
    pointer-events: none;
  }

  @media (max-width: 968px) {
    height: 340px;
    padding: 32px 28px;
    background-position: center 40%;
  }
`;

const SuccessLeftContent = styled.div`
  position: relative;
  z-index: 2;
  animation: ${slideIn} 0.6s cubic-bezier(0.16, 1, 0.3, 1);
`;

const Badge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(96, 165, 250, 0.15);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(96, 165, 250, 0.25);
  border-radius: 100px;
  padding: 6px 16px 6px 10px;
  margin-bottom: 20px;
  width: fit-content;
`;

const BadgeDot = styled.span`
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #60a5fa;
  animation: ${pulse} 2s ease-in-out infinite;
`;

const SuccessRightSide = styled.div`
  width: 560px;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px;
  box-shadow: -8px 0 40px rgba(0, 0, 0, 0.04);

  @media (max-width: 968px) {
    width: 100%;
    flex: 1;
    padding: 40px 24px;
    box-shadow: 0 -8px 40px rgba(0, 0, 0, 0.04);
  }
`;

const SuccessCard = styled.div`
  width: 100%;
  max-width: 400px;
  text-align: center;
  animation: ${fadeIn} 0.5s cubic-bezier(0.16, 1, 0.3, 1);
`;

const IconCircle = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ecfdf5, #d1fae5);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  border: 2px solid #86efac;
  box-shadow: 0 8px 24px rgba(22, 163, 74, 0.12);
`;

const URLBox = styled.div`
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px 24px;
  margin-bottom: 32px;
  transition: all 0.2s ease;

  &:hover {
    border-color: #94a3b8;
    background: #f8fafc;
  }
`;

const URLBadge = styled.div`
  display: inline-block;
  background: #e0f2fe;
  color: #0369a1;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  padding: 4px 12px;
  border-radius: 100px;
  margin-bottom: 8px;
`;

const SubmitBtn2 = styled.button`
  width: 100%;
  padding: 16px 32px;
  background: linear-gradient(135deg, #0f172a, #1e293b);
  color: #ffffff;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  box-shadow: 0 4px 16px rgba(15, 23, 42, 0.15);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(15, 23, 42, 0.25);
    background: linear-gradient(135deg, #1e293b, #0f172a);
  }

  &:active {
    transform: translateY(0);
  }

  svg {
    transition: transform 0.2s ease;
  }

  &:hover svg {
    transform: translateX(4px);
  }
`;

// ── Data ───────────────────────────────────────────────
const PLANS = ["basic", "pro", "enterprise"];

const PLAN_INFO = {
  basic: {
    color: "#2563eb",
    bg: "#e0f2fe",
    emoji: "🏥",
    desc: "Small clinics",
  },
  pro: { color: "#fff", bg: "#2563eb", emoji: "⭐", desc: "Growing hospitals" },
  enterprise: {
    color: "#fff",
    bg: "#0f172a",
    emoji: "🏢",
    desc: "Large networks",
  },
};

const FEATURES = [
  {
    icon: "🏥",
    title: "Isolated Database",
    desc: "Your data in a dedicated database Instance",
  },
  {
    icon: "🔐",
    title: "Role-Based Access",
    desc: "Secure layers for Admin, Doctor, & Nurse",
  },
  {
    icon: "📊",
    title: "Real-Time Dashboard",
    desc: "Live analytics, patient admissions & stats",
  },
  {
    icon: "🌐",
    title: "Custom Subdomain",
    desc: "Instantly provision yourname.medicloud.com",
  },
];

// ── Component ──────────────────────────────────────────
const TenantSignupPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    company_name: "",
    subdomain: "",
    email: "",
    password: "",
    plan: location.state?.plan || "basic",
  });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const filled = Object.values(form).filter(Boolean).length;
  const progress = Math.round((filled / Object.keys(form).length) * 100);

  const handleCompanyChange = (e) => {
    const name = e.target.value;
    const subdomain = name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .slice(0, 20);
    setForm({ ...form, company_name: name, subdomain });
    setError(null);
  };

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
    setError(null);
  };

  const handleSubdomainChange = (e) => {
    const val = e.target.value.toLowerCase().replace(/[^a-z0-9]/g, "");
    setForm({ ...form, subdomain: val });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.company_name || !form.subdomain || !form.email || !form.password)
      return;
    setLoading(true);
    try {
      const res = await axiosClient.post("/tenant/signup", form);
      console.log("Full Response:", res);
      console.log("res.data:", res.data);
      console.log("res.data.data:", res.data?.data);
      setSuccess(res.data.data.subdomain);
    } catch (err) {
      console.log("Entire Error:", err);
      console.log("Response:", err.response);
      console.log("Request:", err.request);
      console.log("Message:", err.message);

      setError(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <SuccessPage>
        <SuccessLeftImage>
          <SuccessLeftContent>
            <Badge>
              <BadgeDot />
              <Typography
                sx={{
                  color: "#93C5FD",
                  fontWeight: 600,
                  fontSize: 12,
                  letterSpacing: "0.5px",
                }}
              >
                SYSTEM ACTIVE
              </Typography>
            </Badge>
            <Typography
              sx={{
                color: "#FFFFFF",
                fontSize: { xs: 24, sm: 30 },
                fontWeight: 700,
                lineHeight: 1.2,
                maxWidth: "480px",
                letterSpacing: "-0.5px",
                mb: 1,
              }}
            >
              Your clinical administration engine is ready for launch
            </Typography>
            <Typography
              sx={{
                color: "rgba(255,255,255,0.7)",
                fontSize: 15,
                fontWeight: 400,
                maxWidth: "400px",
                lineHeight: 1.6,
              }}
            >
              Secure infrastructure has been provisioned with enterprise-grade
              encryption and high availability.
            </Typography>
          </SuccessLeftContent>
        </SuccessLeftImage>

        <SuccessRightSide>
          <SuccessCard>
            <IconCircle>
              <CheckCircle sx={{ fontSize: 36, color: "#16A34A" }} />
            </IconCircle>

            <Typography
              variant="h5"
              fontWeight={700}
              color="#0F172A"
              sx={{ letterSpacing: "-0.5px", mb: 1.5 }}
            >
              Setup Complete
            </Typography>
            <Typography
              variant="body2"
              color="#64748B"
              sx={{ mb: 4, lineHeight: 1.6 }}
            >
              Your infrastructure instances have been successfully provisioned
              and are now operational.
            </Typography>

            <URLBox>
              <URLBadge>Live Subsystem URL</URLBadge>
              <Typography
                fontWeight={700}
                color="#0F172A"
                fontSize={18}
                sx={{ letterSpacing: "-0.3px", fontFamily: "monospace" }}
              >
                {success}.lvh.me:3000
              </Typography>
            </URLBox>

            <SubmitBtn2
              onClick={() =>
                window.open(
                  `http://${success}.lvh.me:3000/login`,
                  "_blank",
                  "noopener,noreferrer",
                )
              }
            >
              Launch Digital Portal
              <ArrowForward sx={{ fontSize: 18 }} />
            </SubmitBtn2>

            <Typography
              variant="caption"
              color="#94A3B8"
              sx={{ display: "block", mt: 2.5, letterSpacing: "0.3px" }}
            >
              Secured with TLS 1.3 • 99.99% uptime SLA
            </Typography>
          </SuccessCard>
        </SuccessRightSide>
      </SuccessPage>
    );
  }

  return (
    <Page>
      <LeftSide>
        <BrandRow>
          <LocalHospital sx={{ color: "#60A5FA", fontSize: 30 }} />
          <Typography
            sx={{
              color: "#fff",
              fontWeight: 800,
              fontSize: 20,
              letterSpacing: "-0.5px",
            }}
          >
            MediCloud{" "}
            <span style={{ fontWeight: 400, color: "#93C5FD" }}>HMS</span>
          </Typography>
        </BrandRow>

        <Typography
          sx={{
            color: "#fff",
            fontSize: "clamp(26px, 3vw, 36px)",
            fontWeight: 800,
            lineHeight: 1.2,
            mb: 2,
            letterSpacing: "-1px",
          }}
        >
          Automate your hospital's
          <br />
          <span style={{ color: "#60A5FA" }}>clinical pipeline</span>
        </Typography>

        <Typography
          sx={{
            color: "rgba(241, 245, 249, 0.7)",
            fontSize: 14.5,
            mb: 3,
            lineHeight: 1.5,
            maxWidth: "440px",
          }}
        >
          Deploy your dedicated instance securely in minutes. Multi-tenant
          sandboxed data environments tailored to high enterprise compliance
          levels.
        </Typography>

        <Box>
          {FEATURES.map((f) => (
            <FeatureItem key={f.title}>
              <FeatureIcon>{f.icon}</FeatureIcon>
              <Box>
                <Typography
                  sx={{ color: "#fff", fontWeight: 600, fontSize: 14 }}
                >
                  {f.title}
                </Typography>
                <Typography
                  sx={{
                    color: "rgba(203, 213, 225, 0.6)",
                    fontSize: 12.5,
                    mt: 0.1,
                  }}
                >
                  {f.desc}
                </Typography>
              </Box>
            </FeatureItem>
          ))}
        </Box>
      </LeftSide>

      <RightSide>
        <Box mb={2}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 0.5,
            }}
          >
            <Typography
              variant="h6"
              fontWeight={800}
              color="#0f172a"
              sx={{ letterSpacing: "-0.5px" }}
            >
              Create Workspace
            </Typography>
            <PlanBadge plan={form.plan}>
              {PLAN_INFO[form.plan]?.emoji} {form.plan}
            </PlanBadge>
          </Box>
          <Typography variant="body2" color="#64748b" mb={1.5}>
            Initialize your tenant deployment configuration.
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.2 }}>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                flex: 1,
                height: 5,
                borderRadius: 3,
                bgcolor: "#e2e8f0",
                "& .MuiLinearProgress-bar": {
                  borderRadius: 3,
                  bgcolor: "#2563eb",
                },
              }}
            />
            <Typography variant="caption" color="#475569" fontWeight={700}>
              {progress}%
            </Typography>
          </Box>
        </Box>

        {error && (
          <Alert
            severity="error"
            sx={{ mb: 2, borderRadius: "8px", py: 0 }}
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          {/* Company Context */}
          <FormLabelText>HOSPITAL ENTITY NAME</FormLabelText>
          <TextField
            fullWidth
            required
            size="small"
            value={form.company_name}
            onChange={handleCompanyChange}
            sx={{ mb: 1.5 }}
            disabled={loading}
            placeholder="e.g. Apollo Grace Medical"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Business sx={{ color: "#94a3b8", fontSize: 18 }} />
                  </InputAdornment>
                ),
              },
            }}
          />

          {/* Routing Subdomain Identifier */}
          <FormLabelText>SYSTEM SUBDOMAIN INSTANCE</FormLabelText>
          <TextField
            fullWidth
            required
            size="small"
            value={form.subdomain}
            onChange={handleSubdomainChange}
            sx={{ mb: 0.2 }}
            disabled={loading}
            placeholder="subdomain"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Language sx={{ color: "#94a3b8", fontSize: 18 }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Typography
                      variant="caption"
                      color="primary"
                      fontWeight={700}
                      sx={{
                        background: "#eff6ff",
                        px: 1,
                        py: 0.2,
                        borderRadius: 1,
                      }}
                    >
                      .lvh.me:3000
                    </Typography>
                  </InputAdornment>
                ),
              },
            }}
          />

          <Box sx={{ minHeight: "18px", mb: 1 }}>
            {form.subdomain && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Check sx={{ fontSize: 12, color: "#16a34a" }} />
                <Typography
                  variant="caption"
                  color="#16a34a"
                  fontWeight={600}
                  fontSize={11}
                >
                  Active Path: {form.subdomain}.lvh.me:3000
                </Typography>
              </Box>
            )}
          </Box>

          {/* Email Address */}
          <FormLabelText>SUPER-ADMINISTRATOR EMAIL</FormLabelText>
          <TextField
            type="email"
            fullWidth
            required
            size="small"
            value={form.email}
            onChange={handleChange("email")}
            sx={{ mb: 1.5 }}
            disabled={loading}
            placeholder="chief@hospital.com"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <AlternateEmail sx={{ color: "#94a3b8", fontSize: 18 }} />
                  </InputAdornment>
                ),
              },
            }}
          />

          {/* System Password */}
          <FormLabelText>PASSWORD</FormLabelText>
          <TextField
            type={showPass ? "text" : "password"}
            fullWidth
            required
            size="small"
            value={form.password}
            onChange={handleChange("password")}
            sx={{ mb: 2 }}
            disabled={loading}
            placeholder="Min. 6 characters"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlined sx={{ color: "#94a3b8", fontSize: 18 }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPass(!showPass)}
                      edge="end"
                      size="small"
                    >
                      {showPass ? (
                        <VisibilityOff fontSize="small" />
                      ) : (
                        <Visibility fontSize="small" />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          {/* Subscription Tier Cards Grid */}
          <FormLabelText>CHOOSE OPERATIONAL SUBSCRIPTION TIER</FormLabelText>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 1,
              mb: 2.5,
            }}
          >
            {PLANS.map((p) => {
              const info = PLAN_INFO[p];
              const selected = form.plan === p;
              return (
                <Box
                  key={p}
                  onClick={() => !loading && setForm({ ...form, plan: p })}
                  sx={{
                    border: `2px solid ${selected ? "#2563eb" : "#e2e8f0"}`,
                    borderRadius: 2.5,
                    p: 1,
                    cursor: "pointer",
                    textAlign: "center",
                    background: selected ? "#f0f9ff" : "#ffffff",
                    transition: "all 0.15s ease",
                    "&:hover": {
                      borderColor: "#2563eb",
                      background: selected ? "#f0f9ff" : "#f8fafc",
                    },
                  }}
                >
                  <Typography fontSize={18} mb={0.2}>
                    {info.emoji}
                  </Typography>
                  <Typography
                    fontSize={11.5}
                    fontWeight={700}
                    color={selected ? "#2563eb" : "#0f172a"}
                  >
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </Typography>
                  <Typography fontSize={10} color="#64748b" sx={{ mt: 0.1 }}>
                    {info.desc}
                  </Typography>
                </Box>
              );
            })}
          </Box>

          <SubmitBtn
            type="submit"
            disabled={
              loading ||
              !form.company_name ||
              !form.subdomain ||
              !form.email ||
              !form.password
            }
          >
            {loading ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              "Deploy Infrastructure Portal →"
            )}
          </SubmitBtn>

          <Typography
            variant="body2"
            color="#64748b"
            textAlign="center"
            mt={2}
            sx={{
              cursor: "pointer",
              display: "block",
              "&:hover": { color: "#2563eb" },
            }}
            onClick={() => navigate("/login")}
          >
            Already handling an active node?{" "}
            <span style={{ color: "#2563eb", fontWeight: 600 }}>Sign In</span>
          </Typography>
        </Box>
      </RightSide>
    </Page>
  );
};

export default TenantSignupPage;
