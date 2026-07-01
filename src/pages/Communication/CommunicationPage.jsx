import React, { useEffect, useRef, useState } from "react";
import {
  Box,
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
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import RefreshIcon from "@mui/icons-material/Refresh";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import ForumIcon from "@mui/icons-material/Forum";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import { useSelector } from "react-redux";
import useChat from "../../modules/chat/hooks/useChat";

// ─── Bubble Actions ──────────────────────────────────────────────────────────

const NoteActions = ({ note, onEdit, onDelete }) => {
  const [anchor, setAnchor] = useState(null);
  return (
    <>
      <IconButton
        size="small"
        onClick={(e) => setAnchor(e.currentTarget)}
        sx={{
          color: "rgba(255,255,255,0.7)",
          "&:hover": { color: "#fff", background: "rgba(255,255,255,0.15)" },
          padding: "2px",
        }}
      >
        <MoreVertIcon fontSize="inherit" />
      </IconButton>
      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
        PaperProps={{
          sx: {
            borderRadius: "12px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
            border: "1px solid rgba(102,126,234,0.15)",
            minWidth: 140,
          },
        }}
      >
        <MenuItem
          onClick={() => {
            onEdit(note);
            setAnchor(null);
          }}
          sx={{ gap: 1, color: "#1d4ed8", fontWeight: 500, fontSize: "14px" }}
        >
          <EditOutlinedIcon fontSize="small" /> Edit Note
        </MenuItem>
        <MenuItem
          onClick={() => {
            onDelete(note);
            setAnchor(null);
          }}
          sx={{ gap: 1, color: "#dc2626", fontWeight: 500, fontSize: "14px" }}
        >
          <DeleteOutlineIcon fontSize="small" /> Delete Note
        </MenuItem>
      </Menu>
    </>
  );
};

// ─── Main Component ─────────────────────────────────────────────────────────

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

  const [appointmentInput, setAppointmentInput] = useState("");
  const [draft, setDraft] = useState("");
  const [editingNote, setEditingNote] = useState(null);
  const scrollRef = useRef(null);

  const role = user?.role;
  const allowed = ["doctor", "nurse"].includes(role);

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

  const handleSaveEdit = () => {
    if (!editingNote || !editingNote.text.trim()) return;
    updateMessage(editingNote.id, editingNote.text.trim());
    setEditingNote(null);
  };

  if (!allowed) {
    return (
      <div style={{ padding: "40px", textAlign: "center", animation: "fadeSlideUp 0.4s ease" }}>
        <div style={{ fontSize: "40px", marginBottom: "16px" }}>🚫</div>
        <div style={{ fontSize: "18px", fontWeight: 700, color: "#374151" }}>Access Denied</div>
        <div style={{ color: "#6b7280", marginTop: "8px" }}>Communication notes are strictly for doctors and nurses to coordinate care.</div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-10px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(102,126,234,0.05);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(102,126,234,0.2);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(102,126,234,0.4);
        }
      `}</style>

      <div style={{ animation: "fadeSlideUp 0.4s ease", display: "flex", flexDirection: "column", height: "calc(100vh - 120px)", minHeight: "500px" }}>
        <div style={{ marginBottom: "20px" }}>
          <h1
            style={{
              margin: 0,
              fontSize: "clamp(22px, 4vw, 32px)",
              fontWeight: 900,
              background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              lineHeight: 1.2,
            }}
          >
            💬 Medical Notes
          </h1>
          <p style={{ margin: "6px 0 0", color: "#9ca3af", fontSize: "14px", display: "flex", alignItems: "center", gap: "6px" }}>
            Coordination and clinical notes for active appointments. Role: <strong style={{ color: "#4f46e5", textTransform: "uppercase" }}>{role}</strong>
          </p>
        </div>

        <div style={{ display: "flex", flex: 1, gap: "24px", minHeight: 0, flexDirection: "row", flexWrap: "wrap" }}>
          {/* Selector Panel */}
          <div
            style={{
              flex: "0 0 300px",
              background: "rgba(255,255,255,0.75)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid rgba(30,60,114,0.1)",
              borderRadius: "20px",
              padding: "24px",
              boxShadow: "0 8px 32px rgba(30,60,114,0.08)",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              height: "max-content",
            }}
          >
            <div style={{ fontSize: "18px", fontWeight: 800, color: "#1e3c72", display: "flex", alignItems: "center", gap: "8px" }}>
              <AssignmentIndIcon style={{ color: "#3b82f6" }} /> 
              Load Appointment
            </div>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: "13px" }}>
              Notes are firmly attached to an appointment ID.
            </Typography>
            <form onSubmit={handleOpenAppointment} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <TextField
                label="Appointment ID"
                type="number"
                fullWidth
                required
                size="small"
                value={appointmentInput}
                onChange={(e) => setAppointmentInput(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    background: "rgba(255,255,255,0.8)",
                  },
                }}
              />
              <Button
                type="submit"
                variant="contained"
                disabled={!appointmentInput}
                sx={{
                  borderRadius: "12px",
                  fontWeight: 700,
                  textTransform: "none",
                  py: 1,
                  background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
                  boxShadow: "0 4px 14px rgba(42,82,152,0.3)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #2a5298 0%, #1e3c72 100%)",
                  },
                }}
              >
                Access Notes
              </Button>
            </form>

            {activeAppointmentId && (
              <div
                style={{
                  marginTop: "12px",
                  padding: "10px",
                  background: "rgba(16,185,129,0.1)",
                  borderRadius: "12px",
                  color: "#059669",
                  fontSize: "13px",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: "6px"
                }}
              >
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10b981", animation: "pulse 2s infinite" }} />
                Connected: Apt #{activeAppointmentId}
              </div>
            )}
          </div>

          {/* Thread Panel */}
          <div
            style={{
              flex: "1 1 400px",
              background: "rgba(255,255,255,0.75)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid rgba(30,60,114,0.1)",
              borderRadius: "20px",
              boxShadow: "0 8px 32px rgba(30,60,114,0.08)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div style={{ padding: "16px 24px", borderBottom: "1px solid rgba(0,0,0,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,255,255,0.5)" }}>
              <div style={{ fontSize: "16px", fontWeight: 800, color: "#1f2937" }}>
                {activeAppointmentId ? `Appointment #${activeAppointmentId}` : "Select an Appointment"}
              </div>
              {activeAppointmentId && (
                <Tooltip title="Refresh Thread">
                  <span>
                    <IconButton size="small" onClick={() => openAppointment(activeAppointmentId)} sx={{ color: "#3b82f6" }}>
                      <RefreshIcon fontSize="small" sx={{ animation: loading ? "spin 1s linear infinite" : "none" }} />
                    </IconButton>
                  </span>
                </Tooltip>
              )}
            </div>

            {/* Error Banners */}
            <div style={{ padding: "0 24px" }}>
              {error && <Alert severity="error" sx={{ mt: 2, borderRadius: "10px" }}>{error}</Alert>}
              {sendError && <Alert severity="error" sx={{ mt: 2, borderRadius: "10px" }}>{sendError}</Alert>}
            </div>

            {/* Message Thread */}
            {!activeAppointmentId ? (
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#9ca3af", padding: "40px" }}>
                <ForumIcon sx={{ fontSize: 60, opacity: 0.3, mb: 2 }} />
                <div style={{ fontSize: "18px", fontWeight: 700, color: "#4b5563" }}>No Thread Active</div>
                <div style={{ fontSize: "14px", mt: 1 }}>Submit an appointment ID to load the clinical notes track.</div>
              </div>
            ) : loading ? (
              <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
                <CircularProgress size={32} sx={{ color: "#4f46e5" }} />
              </div>
            ) : (
              <div
                ref={scrollRef}
                className="custom-scrollbar"
                style={{ flex: 1, overflowY: "auto", padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}
              >
                {messages.length === 0 ? (
                  <div style={{ textAlign: "center", color: "#9ca3af", fontSize: "14px", padding: "20px", background: "rgba(0,0,0,0.02)", borderRadius: "12px", border: "1px dashed rgba(0,0,0,0.1)" }}>
                    No notes recorded yet.
                  </div>
                ) : (
                  messages.map((note, index) => {
                    const isSelf = note.sender_id === user?.user_id;
                    return (
                      <div
                        key={note.id}
                        style={{
                          display: "flex",
                          flexDirection: isSelf ? "row-reverse" : "row",
                          alignItems: "flex-end",
                          gap: "12px",
                          animation: `slideIn 0.3s ease ${index * 0.03}s both`,
                        }}
                      >
                        <Avatar
                          sx={{
                            width: 34,
                            height: 34,
                            fontSize: "14px",
                            fontWeight: 700,
                            background: isSelf ? "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)" : "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                          }}
                        >
                          {(note.sender_name || "?").charAt(0).toUpperCase()}
                        </Avatar>
                        
                        <div style={{ display: "flex", flexDirection: "column", alignItems: isSelf ? "flex-end" : "flex-start", maxWidth: "75%" }}>
                          <div style={{ fontSize: "11px", color: "#9ca3af", marginBottom: "4px", padding: "0 4px" }}>
                            <strong style={{ color: "#6b7280" }}>{isSelf ? "You" : note.sender_name}</strong> · <span style={{ textTransform: "capitalize" }}>{note.sender_role}</span>
                          </div>
                          <div
                            style={{
                              background: isSelf ? "linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)" : "#ffffff",
                              color: isSelf ? "#ffffff" : "#1f2937",
                              padding: "12px 16px",
                              borderRadius: isSelf ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                              boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                              border: isSelf ? "none" : "1px solid rgba(0,0,0,0.05)",
                              fontSize: "14px",
                              lineHeight: 1.5,
                              wordBreak: "break-word",
                              position: "relative",
                            }}
                          >
                            {note.message}
                            
                            {isSelf && (
                              <div style={{ position: "absolute", top: "4px", right: "4px" }}>
                                <NoteActions
                                  note={note}
                                  onEdit={() => setEditingNote({ id: note.id, text: note.message })}
                                  onDelete={() => deleteMessage(note.id)}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* Composer */}
            {activeAppointmentId && (
              <div style={{ padding: "16px 24px", background: "rgba(249,250,251,0.8)", borderTop: "1px solid rgba(0,0,0,0.06)" }}>
                <div style={{ display: "flex", gap: "12px", alignItems: "flex-end" }}>
                  <TextField
                    placeholder="Write a clinical or coordination note..."
                    fullWidth
                    multiline
                    maxRows={4}
                    size="small"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={handleComposerKeyDown}
                    disabled={sending}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "16px",
                        background: "#fff",
                        boxShadow: "0 2px 10px rgba(0,0,0,0.02)",
                      },
                    }}
                  />
                  <Button
                    variant="contained"
                    onClick={handleSend}
                    disabled={!draft.trim() || sending}
                    sx={{
                      minWidth: "48px",
                      width: "48px",
                      height: "48px",
                      borderRadius: "14px",
                      background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                      p: 0,
                      "&:hover": { background: "linear-gradient(135deg, #059669 0%, #047857 100%)" }
                    }}
                  >
                    {sending ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog
        open={Boolean(editingNote)}
        onClose={() => setEditingNote(null)}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: {
            borderRadius: "20px",
            boxShadow: "0 24px 64px rgba(0,0,0,0.2)",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, fontSize: "16px", pb: 1 }}>Edit Note</DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <TextField
            multiline
            rows={4}
            fullWidth
            value={editingNote?.text || ""}
            onChange={(e) => setEditingNote(prev => ({ ...prev, text: e.target.value }))}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" }, mt: 1 }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={() => setEditingNote(null)} sx={{ borderRadius: "10px" }} color="inherit">Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSaveEdit}
            disabled={!editingNote?.text.trim()}
            sx={{ borderRadius: "10px", background: "linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)" }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CommunicationPage;
