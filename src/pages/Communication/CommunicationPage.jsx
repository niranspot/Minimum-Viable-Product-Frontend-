import React, { useEffect, useRef, useState } from "react";
import {
  Typography,
  TextField,
  Button,
  IconButton,
  Avatar,
  Alert,
  CircularProgress,
  Tooltip,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Stack,
  Divider,
  Box,
  InputAdornment,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import RefreshIcon from "@mui/icons-material/Refresh";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import SearchIcon from "@mui/icons-material/Search";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import MedicalServicesOutlinedIcon from "@mui/icons-material/MedicalServicesOutlined";
import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";
import { useSelector } from "react-redux";
import useChat from "../../modules/chat/hooks/useChat";
import styled, { keyframes, css } from "styled-components";

// ─── Animations ───────────────────────────────────────────────────────────────
const fadeUp = keyframes`from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}`;
const slideInLeft = keyframes`from{opacity:0;transform:translateX(-16px)}to{opacity:1;transform:translateX(0)}`;
const slideInRight = keyframes`from{opacity:0;transform:translateX(16px)}to{opacity:1;transform:translateX(0)}`;
const pulse = keyframes`0%,100%{opacity:1}50%{opacity:0.4}`;
const spin = keyframes`from{transform:rotate(0deg)}to{transform:rotate(360deg)}`;

// ─── Styled components ────────────────────────────────────────────────────────
const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 100px);
  min-height: 520px;
  animation: ${fadeUp} 0.35s ease;
`;

const PageTop = styled.div`
  margin-bottom: 20px;
  flex-shrink: 0;
`;

const Layout = styled.div`
  display: flex;
  flex: 1;
  gap: 20px;
  min-height: 0;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const SidePanel = styled.div`
  flex: 0 0 280px;
  display: flex;
  flex-direction: column;
  gap: 14px;

  @media (max-width: 768px) {
    flex: none;
  }
`;

const SideCard = styled.div`
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(102, 126, 234, 0.15);
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.08);
`;

const ThreadPanel = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(102, 126, 234, 0.15);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 24px rgba(102, 126, 234, 0.08);
`;

const ThreadHeader = styled.div`
  padding: 18px 24px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(255, 255, 255, 0.5);
  flex-shrink: 0;
`;

const NotesScroll = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;

  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb {
    background: rgba(102, 126, 234, 0.2);
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(102, 126, 234, 0.4);
  }
`;

const Composer = styled.div`
  padding: 16px 24px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  background: rgba(249, 250, 251, 0.8);
  flex-shrink: 0;
`;

const BubbleRow = styled.div`
  display: flex;
  flex-direction: ${({ $self }) => ($self ? "row-reverse" : "row")};
  align-items: flex-end;
  gap: 10px;
  ${({ $self }) =>
    $self
      ? css`animation: ${slideInRight} 0.25s ease both;`
      : css`animation: ${slideInLeft} 0.25s ease both;`}
  animation-delay: ${({ delay }) => delay || "0s"};
`;

const BubbleContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${({ $self }) => ($self ? "flex-end" : "flex-start")};
  max-width: 72%;
`;

const Bubble = styled.div`
  position: relative;
  padding: 12px 16px;
  border-radius: ${({ $self }) =>
    $self ? "18px 18px 4px 18px" : "18px 18px 18px 4px"};
  background: ${({ $self }) =>
    $self
      ? "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)"
      : "rgba(0,0,0,0.04)"};
  color: ${({ $self }) => ($self ? "#fff" : "inherit")};
  font-size: 14px;
  line-height: 1.55;
  word-break: break-word;
  border: ${({ $self }) => ($self ? "none" : "1px solid rgba(0,0,0,0.07)")};
  box-shadow: ${({ $self }) =>
    $self
      ? "0 4px 14px rgba(59,130,246,0.25)"
      : "0 2px 8px rgba(0,0,0,0.05)"};
`;

const BubbleMeta = styled.div`
  font-size: 11px;
  color: #9ca3af;
  margin-bottom: 5px;
  padding: 0 4px;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const RoleBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 1px 7px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 600;
  background: ${({ role }) =>
    role === "doctor" ? "#dbeafe" : "#f3e8ff"};
  color: ${({ role }) =>
    role === "doctor" ? "#1d4ed8" : "#7c3aed"};
  text-transform: capitalize;
`;

const EmptyThread = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #9ca3af;
  padding: 40px;
  text-align: center;
`;

const ConnectedBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 12px;
  background: rgba(16, 185, 129, 0.1);
  color: #059669;
  font-size: 13px;
  font-weight: 600;
`;

const PulseDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #10b981;
  animation: ${pulse} 2s ease infinite;
`;

const AnimatedRefresh = styled(RefreshIcon)`
  animation: ${({ $loading }) => ($loading === "true" ? css`${spin} 1s linear infinite` : "none")};
`;

const AccessDeniedWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 60px 24px;
  text-align: center;
  animation: ${fadeUp} 0.4s ease;
`;

// ─── Bubble action menu ───────────────────────────────────────────────────────
const BubbleActions = ({ note, onEdit, onDelete }) => {
  const [anchor, setAnchor] = useState(null);
  return (
    <>
      <IconButton
        size="small"
        onClick={(e) => { e.stopPropagation(); setAnchor(e.currentTarget); }}
        sx={{
          color: "rgba(255,255,255,0.75)",
          width: 22,
          height: 22,
          "&:hover": { color: "#fff", background: "rgba(255,255,255,0.15)" },
        }}
      >
        <MoreVertIcon sx={{ fontSize: 14 }} />
      </IconButton>
      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
        PaperProps={{
          sx: { borderRadius: "12px", minWidth: 150, boxShadow: "0 8px 24px rgba(0,0,0,0.12)" },
        }}
      >
        <MenuItem
          onClick={() => { onEdit(note); setAnchor(null); }}
          sx={{ gap: 1, fontSize: "14px", color: "primary.main", fontWeight: 500 }}
        >
          <EditOutlinedIcon fontSize="small" /> Edit Note
        </MenuItem>
        <MenuItem
          onClick={() => { onDelete(note.id); setAnchor(null); }}
          sx={{ gap: 1, fontSize: "14px", color: "error.main", fontWeight: 500 }}
        >
          <DeleteOutlineIcon fontSize="small" /> Delete
        </MenuItem>
      </Menu>
    </>
  );
};

// ─── Edit dialog ──────────────────────────────────────────────────────────────
const EditNoteDialog = ({ open, note, onClose, onSave, saving }) => {
  const [text, setText] = useState("");

  useEffect(() => {
    if (open && note) setText(note.message || "");
  }, [open, note]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm"
      PaperProps={{ sx: { borderRadius: "18px" } }}
    >
      <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Avatar sx={{ bgcolor: "primary.main", width: 34, height: 34 }}>
            <EditOutlinedIcon fontSize="small" />
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight={700}>Edit Note</Typography>
            <Typography variant="caption" color="text.secondary">Modify your clinical note</Typography>
          </Box>
        </Stack>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <TextField
          multiline
          rows={5}
          fullWidth
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write your clinical or coordination note…"
          sx={{ mt: 2, "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={onClose} disabled={saving} color="inherit">Cancel</Button>
        <Button
          variant="contained"
          onClick={() => onSave(note.id, text.trim())}
          disabled={!text.trim() || saving}
          startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <EditOutlinedIcon />}
        >
          {saving ? "Saving…" : "Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// ─── Role icon helper ─────────────────────────────────────────────────────────
const RoleIcon = ({ role }) =>
  role === "doctor"
    ? <MedicalServicesOutlinedIcon sx={{ fontSize: 10 }} />
    : <LocalHospitalOutlinedIcon sx={{ fontSize: 10 }} />;

// ─── Main Page ────────────────────────────────────────────────────────────────
const CommunicationPage = () => {
  const { user } = useSelector((state) => state.auth);
  const {
    activeAppointmentId,
    messages,
    loading,
    error,
    sending,
    sendError,
    openAppointment,
    sendMessage,
    updateMessage,
    deleteMessage,
    clearError,
  } = useChat();

  const [aptInput, setAptInput] = useState("");
  const [draft, setDraft] = useState("");
  const [editingNote, setEditingNote] = useState(null);
  const [search, setSearch] = useState("");
  const scrollRef = useRef(null);

  const role = user?.role;
  const canWrite = ["doctor", "nurse"].includes(role);

  // Auto-scroll to latest note
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleLoad = (e) => {
    e.preventDefault();
    const id = Number(aptInput);
    if (!id) return;
    clearError();
    openAppointment(id);
  };

  const handleSend = () => {
    if (!draft.trim() || !activeAppointmentId) return;
    sendMessage(activeAppointmentId, draft.trim());
    setDraft("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSaveEdit = (id, text) => {
    updateMessage(id, text);
    setEditingNote(null);
  };

  // Filter messages by search
  const filtered = search.trim()
    ? messages.filter((m) =>
        m.message?.toLowerCase().includes(search.toLowerCase()) ||
        m.sender_name?.toLowerCase().includes(search.toLowerCase())
      )
    : messages;

  // ── Access denied for non-medical roles ──────────────────────────────────
  if (!canWrite) {
    return (
      <AccessDeniedWrapper>
        <Box
          sx={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: "rgba(239,68,68,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <LockOutlinedIcon sx={{ fontSize: 36, color: "error.main" }} />
        </Box>
        <Typography variant="h5" fontWeight={800} color="text.primary">
          Access Restricted
        </Typography>
        <Typography variant="body2" color="text.secondary" maxWidth={360}>
          Clinical notes and coordination messages are strictly accessible to{" "}
          <strong>doctors</strong> and <strong>nurses</strong> only. Your current
          role (<Chip label={role} size="small" color="default" sx={{ fontWeight: 600 }} />) does not have permission to view this module.
        </Typography>
      </AccessDeniedWrapper>
    );
  }

  return (
    <PageWrapper>
      {/* ── Header ── */}
      <PageTop>
        <h1
          style={{
            margin: 0,
            fontSize: "clamp(22px, 4vw, 32px)",
            fontWeight: 900,
            background: "linear-gradient(135deg, #2b5876 0%, #4e4376 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            lineHeight: 1.2,
          }}
        >
          💬 Clinical Notes
        </h1>
        <p style={{ margin: "6px 0 0", color: "#9ca3af", fontSize: "14px" }}>
          Appointment-based coordination notes for doctors and nurses
        </p>
      </PageTop>

      <Layout>
        {/* ── Side Panel ── */}
        <SidePanel>
          {/* Load appointment card */}
          <SideCard>
            <Stack spacing={1.5}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Avatar sx={{ bgcolor: "primary.main", width: 32, height: 32 }}>
                  <AssignmentOutlinedIcon sx={{ fontSize: 16 }} />
                </Avatar>
                <Box>
                  <Typography variant="body1" fontWeight={700} lineHeight={1.2}>
                    Load Appointment
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Enter an appointment ID
                  </Typography>
                </Box>
              </Stack>

              <form onSubmit={handleLoad}>
                <Stack spacing={1.5}>
                  <TextField
                    label="Appointment ID"
                    type="number"
                    fullWidth
                    size="small"
                    required
                    value={aptInput}
                    onChange={(e) => setAptInput(e.target.value)}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={!aptInput}
                    fullWidth
                    sx={{ borderRadius: "10px", fontWeight: 600 }}
                  >
                    Open Thread
                  </Button>
                </Stack>
              </form>

              {activeAppointmentId && (
                <ConnectedBadge>
                  <PulseDot />
                  Apt #{activeAppointmentId} active
                </ConnectedBadge>
              )}
            </Stack>
          </SideCard>

          {/* Stats card */}
          {activeAppointmentId && (
            <SideCard>
              <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}>
                Thread Stats
              </Typography>
              <Stack spacing={1} sx={{ mt: 1.5 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" color="text.secondary">Total notes</Typography>
                  <Typography variant="body2" fontWeight={700}>{messages.length}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" color="text.secondary">Your notes</Typography>
                  <Typography variant="body2" fontWeight={700}>
                    {messages.filter((m) => m.sender_id === user?.user_id).length}
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" color="text.secondary">Contributors</Typography>
                  <Typography variant="body2" fontWeight={700}>
                    {new Set(messages.map((m) => m.sender_id)).size}
                  </Typography>
                </Stack>
              </Stack>
            </SideCard>
          )}

          {/* Role badge */}
          <SideCard>
            <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}>
              Your Access
            </Typography>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1.5 }}>
              <Chip
                icon={<MedicalServicesOutlinedIcon />}
                label={role?.charAt(0).toUpperCase() + role?.slice(1)}
                color={role === "doctor" ? "primary" : "secondary"}
                size="small"
                sx={{ fontWeight: 600 }}
              />
              <Typography variant="caption" color="text.secondary">
                Full read & write
              </Typography>
            </Stack>
          </SideCard>
        </SidePanel>

        {/* ── Thread Panel ── */}
        <ThreadPanel>
          {/* Header */}
          <ThreadHeader>
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <ForumOutlinedIcon sx={{ color: "primary.main", fontSize: 20 }} />
              <Box>
                <Typography variant="body1" fontWeight={700}>
                  {activeAppointmentId
                    ? `Appointment #${activeAppointmentId}`
                    : "No Thread Active"}
                </Typography>
                {activeAppointmentId && (
                  <Typography variant="caption" color="text.secondary">
                    {messages.length} note{messages.length !== 1 ? "s" : ""}
                  </Typography>
                )}
              </Box>
            </Stack>

            <Stack direction="row" alignItems="center" spacing={1}>
              {activeAppointmentId && messages.length > 0 && (
                <TextField
                  placeholder="Search notes…"
                  size="small"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ fontSize: 16 }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    width: 180,
                    "& .MuiOutlinedInput-root": { borderRadius: "20px", fontSize: "13px" },
                  }}
                />
              )}
              {activeAppointmentId && (
                <Tooltip title="Refresh thread">
                  <IconButton
                    size="small"
                    onClick={() => openAppointment(activeAppointmentId)}
                    disabled={loading}
                  >
                    <AnimatedRefresh
                      fontSize="small"
                      $loading={loading ? "true" : "false"}
                    />
                  </IconButton>
                </Tooltip>
              )}
            </Stack>
          </ThreadHeader>

          {/* Error banners */}
          {(error || sendError) && (
            <Box sx={{ px: 2.5, pt: 1.5 }}>
              {error && (
                <Alert severity="error" onClose={clearError} sx={{ mb: 1, borderRadius: "10px" }}>
                  {error}
                </Alert>
              )}
              {sendError && (
                <Alert severity="error" sx={{ borderRadius: "10px" }}>
                  {sendError}
                </Alert>
              )}
            </Box>
          )}

          {/* Thread body */}
          {!activeAppointmentId ? (
            <EmptyThread>
              <ForumOutlinedIcon sx={{ fontSize: 56, opacity: 0.2 }} />
              <Typography variant="h6" fontWeight={700}>No Thread Loaded</Typography>
              <Typography variant="body2">
                Enter an appointment ID in the panel to start viewing and adding clinical notes.
              </Typography>
            </EmptyThread>
          ) : loading ? (
            <Box sx={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
              <CircularProgress size={32} />
            </Box>
          ) : (
            <NotesScroll ref={scrollRef}>
              {filtered.length === 0 ? (
                <Box
                  sx={{
                    textAlign: "center",
                    py: 5,
                    color: "text.secondary",
                    border: "1px dashed",
                    borderColor: "divider",
                    borderRadius: "14px",
                  }}
                >
                  <ForumOutlinedIcon sx={{ fontSize: 36, opacity: 0.3, mb: 1 }} />
                  <Typography variant="body2">
                    {search ? "No notes match your search." : "No clinical notes recorded yet. Be the first to add one."}
                  </Typography>
                </Box>
              ) : (
                filtered.map((note, i) => {
                  const isSelf = note.sender_id === user?.user_id;
                  return (
                    <BubbleRow key={note.id} $self={isSelf ? 1 : 0} delay={`${i * 0.03}s`}>
                      {/* Avatar */}
                      <Avatar
                        sx={{
                          width: 34,
                          height: 34,
                          fontSize: "13px",
                          fontWeight: 700,
                          bgcolor: isSelf ? "#1d4ed8" : note.sender_role === "doctor" ? "#7c3aed" : "#db2777",
                          flexShrink: 0,
                        }}
                      >
                        {(note.sender_name || "?").charAt(0).toUpperCase()}
                      </Avatar>

                      {/* Content */}
                      <BubbleContent $self={isSelf ? 1 : 0}>
                        <BubbleMeta>
                          <strong style={{ color: "inherit" }}>
                            {isSelf ? "You" : note.sender_name}
                          </strong>
                          <RoleBadge role={note.sender_role}>
                            <RoleIcon role={note.sender_role} />
                            {note.sender_role}
                          </RoleBadge>
                          <span>
                            {note.created_at
                              ? new Date(note.created_at).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : ""}
                          </span>
                        </BubbleMeta>

                        <Bubble $self={isSelf ? 1 : 0}>
                          {note.message}
                          {isSelf && (
                            <Box sx={{ position: "absolute", top: 4, right: 4 }}>
                              <BubbleActions
                                note={note}
                                onEdit={(n) => setEditingNote(n)}
                                onDelete={deleteMessage}
                              />
                            </Box>
                          )}
                        </Bubble>

                        <Typography
                          variant="caption"
                          sx={{ opacity: 0.5, mt: 0.5, px: 0.5 }}
                        >
                          {note.created_at
                            ? new Date(note.created_at).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                              })
                            : ""}
                        </Typography>
                      </BubbleContent>
                    </BubbleRow>
                  );
                })
              )}
            </NotesScroll>
          )}

          {/* Composer */}
          {activeAppointmentId && (
            <Composer>
              <Stack direction="row" spacing={1.5} alignItems="flex-end">
                <Avatar
                  sx={{
                    width: 34,
                    height: 34,
                    fontSize: "13px",
                    fontWeight: 700,
                    bgcolor: "primary.main",
                    flexShrink: 0,
                  }}
                >
                  {(user?.name || "Y").charAt(0).toUpperCase()}
                </Avatar>
                <TextField
                  placeholder="Write a clinical or coordination note… (Enter to send)"
                  fullWidth
                  multiline
                  maxRows={4}
                  size="small"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={sending}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "14px",
                      fontSize: "14px",
                    },
                  }}
                />
                <Tooltip title="Send note (Enter)">
                  <span>
                    <IconButton
                      onClick={handleSend}
                      disabled={!draft.trim() || sending}
                      sx={{
                        bgcolor: "primary.main",
                        color: "#fff",
                        width: 40,
                        height: 40,
                        borderRadius: "12px",
                        flexShrink: 0,
                        "&:hover": { bgcolor: "primary.dark" },
                        "&:disabled": { bgcolor: "action.disabledBackground" },
                      }}
                    >
                      {sending ? (
                        <CircularProgress size={18} color="inherit" />
                      ) : (
                        <SendIcon sx={{ fontSize: 18 }} />
                      )}
                    </IconButton>
                  </span>
                </Tooltip>
              </Stack>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.75, display: "block", pl: "46px" }}>
                Notes are encrypted • Only doctors and nurses can view this thread
              </Typography>
            </Composer>
          )}
        </ThreadPanel>
      </Layout>

      {/* ── Edit dialog ── */}
      <EditNoteDialog
        open={Boolean(editingNote)}
        note={editingNote}
        onClose={() => setEditingNote(null)}
        onSave={handleSaveEdit}
        saving={sending}
      />
    </PageWrapper>
  );
};

export default CommunicationPage;
