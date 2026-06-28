import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  IconButton,
  Avatar,
  Alert,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ForumIcon from "@mui/icons-material/Forum";
import RefreshIcon from "@mui/icons-material/Refresh";
import styled from "styled-components";
import { useSelector } from "react-redux";
import useChat from "../../modules/chat/hooks/useChat";

// ─── Styled layout pieces ────────────────────────────────────────────────────

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media (min-width: 900px) {
    flex-direction: row;
    align-items: flex-start;
  }
`;

const SelectorPanel = styled.div`
  flex: 0 0 100%;

  @media (min-width: 900px) {
    flex: 0 0 280px;
  }
`;

const ThreadPanel = styled.div`
  flex: 1;
  min-width: 0;
`;

const ThreadScroll = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 50vh;
  min-height: 240px;
  overflow-y: auto;
  padding: 4px 2px;

  @media (min-width: 600px) {
    max-height: 60vh;
  }
`;

const NoteRow = styled.div`
  display: flex;
  gap: 10px;
  align-items: flex-start;
  ${({ $isSelf }) => $isSelf && "flex-direction: row-reverse;"}
`;

const NoteBubble = styled.div`
  background: ${({ theme, $isSelf }) => ($isSelf ? theme.primary : theme.bg)};
  color: ${({ theme, $isSelf }) => ($isSelf ? "#fff" : theme.text)};
  border-radius: 12px;
  padding: 10px 14px;
  max-width: min(480px, 80%);
  word-break: break-word;
  border: 1px solid
    ${({ theme, $isSelf }) => ($isSelf ? "transparent" : theme.divider)};
`;

const NoteMeta = styled.div`
  font-size: 11px;
  opacity: 0.75;
  margin-bottom: 3px;
  text-transform: capitalize;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 32px 16px;
  color: ${({ theme }) => theme.textMuted};
  text-align: center;
  flex: 1;
`;

const ComposerRow = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 16px;
  align-items: flex-end;
`;

// ─── Main page ──────────────────────────────────────────────────────────────

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
    clearError,
  } = useChat();

  const [appointmentInput, setAppointmentInput] = useState("");
  const [draft, setDraft] = useState("");
  const scrollRef = useRef(null);

  const allowed = ["doctor", "nurse"].includes(user?.role);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleOpenAppointment = (e) => {
    e.preventDefault();
    const id = Number(appointmentInput);
    if (!id) return;
    clearError();
    openAppointment(id);
  };

  const handleSend = () => {
    if (!draft.trim() || !activeAppointmentId) return;
    sendMessage(activeAppointmentId, draft.trim());
    setDraft("");
  };

  const handleComposerKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!allowed) {
    return (
      <Alert severity="info">
        Communication notes are available to doctors and nurses for now.
      </Alert>
    );
  }

  return (
    <Box>
     
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Notes are tied to a specific appointment and visible to its care team
      </Typography>

      <Layout>
        <SelectorPanel>
          <Card>
            <CardContent>
              <Typography variant="h4" sx={{ mb: 1.5 }}>
                Open an appointment
              </Typography>
              <Box component="form" onSubmit={handleOpenAppointment}>
                <TextField
                  label="Appointment ID"
                  type="number"
                  fullWidth
                  size="small"
                  value={appointmentInput}
                  onChange={(e) => setAppointmentInput(e.target.value)}
                  sx={{ mb: 1.5 }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={!appointmentInput}
                >
                  Load Notes
                </Button>
              </Box>
              {activeAppointmentId && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block", mt: 1.5 }}
                >
                  Viewing appointment #{activeAppointmentId}
                </Typography>
              )}
            </CardContent>
          </Card>
        </SelectorPanel>

        <ThreadPanel>
          <Card>
            <CardContent sx={{ display: "flex", flexDirection: "column" }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1.5,
                }}
              >
                <Typography variant="h4">
                  {activeAppointmentId
                    ? `Notes — Appointment #${activeAppointmentId}`
                    : "Notes"}
                </Typography>
                {activeAppointmentId && (
                  <Tooltip title="Refresh">
                    <span>
                      <IconButton
                        size="small"
                        onClick={() => openAppointment(activeAppointmentId)}
                      >
                        <RefreshIcon fontSize="small" />
                      </IconButton>
                    </span>
                  </Tooltip>
                )}
              </Box>

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              {sendError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {sendError}
                </Alert>
              )}

              {!activeAppointmentId ? (
                <EmptyState>
                  <ForumIcon sx={{ fontSize: 40, opacity: 0.5 }} />
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    No appointment selected
                  </Typography>
                  <Typography variant="body2">
                    Enter an appointment ID to view and send notes.
                  </Typography>
                </EmptyState>
              ) : loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                  <CircularProgress size={28} />
                </Box>
              ) : (
                <ThreadScroll ref={scrollRef}>
                  {messages.length === 0 ? (
                    <EmptyState>
                      <Typography variant="body2">
                        No notes yet for this appointment. Be the first to add
                        one.
                      </Typography>
                    </EmptyState>
                  ) : (
                    messages.map((note) => {
                      const isSelf = note.sender_id === user?.user_id;
                      return (
                        <NoteRow key={note.id} $isSelf={isSelf}>
                          <Avatar sx={{ width: 32, height: 32, fontSize: 14 }}>
                            {(note.sender_name || "?").charAt(0).toUpperCase()}
                          </Avatar>
                          <NoteBubble $isSelf={isSelf}>
                            <NoteMeta>
                              {isSelf ? "You" : note.sender_name} ·{" "}
                              {note.sender_role}
                            </NoteMeta>
                            <Typography
                              variant="body2"
                              sx={{ color: "inherit" }}
                            >
                              {note.message}
                            </Typography>
                          </NoteBubble>
                        </NoteRow>
                      );
                    })
                  )}
                </ThreadScroll>
              )}

              {activeAppointmentId && (
                <ComposerRow>
                  <TextField
                    placeholder="Write a note for the care team…"
                    fullWidth
                    multiline
                    maxRows={4}
                    size="small"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={handleComposerKeyDown}
                    disabled={sending}
                  />
                  <Button
                    variant="contained"
                    onClick={handleSend}
                    disabled={!draft.trim() || sending}
                    sx={{ minWidth: 0, px: 2 }}
                  >
                    {sending ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <SendIcon />
                    )}
                  </Button>
                </ComposerRow>
              )}
            </CardContent>
          </Card>
        </ThreadPanel>
      </Layout>
    </Box>
  );
};

export default CommunicationPage;
