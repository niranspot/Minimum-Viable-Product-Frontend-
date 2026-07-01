import React, { useEffect, useRef, useState } from "react";
import {
  TextField, Button, Alert, CircularProgress, Tooltip, IconButton,
  Avatar, Dialog, DialogTitle, DialogContent, DialogActions,
  Menu, MenuItem,
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
import { useThemeMode } from "../../context/ThemeContext";
import HeroBanner from "../../components/common/HeroBanner";

// ─── Theme Tokens ──────────────────────────────────────────────────────────────
const getTokens = (mode) => ({
  isDark:       mode === "dark",
  bg:           mode === "dark" ? "#0D1117" : "#F4F6FB",
  surface:      mode === "dark" ? "#161B22" : "#FFFFFF",
  surfaceAlt:   mode === "dark" ? "#1C2333" : "#F0F4FA",
  panelBg:      mode === "dark" ? "rgba(22,27,34,0.85)" : "rgba(255,255,255,0.85)",
  border:       mode === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
  text:         mode === "dark" ? "#E6EDF3" : "#1A1A2E",
  textSec:      mode === "dark" ? "#8B949E" : "#718096",
  // Brand from dashboard screenshots
  purple:       "#7C3AED",
  purpleLight:  mode === "dark" ? "rgba(124,58,237,0.2)" : "rgba(124,58,237,0.1)",
  teal:         "#0891B2",
  tealLight:    mode === "dark" ? "rgba(8,145,178,0.2)" : "rgba(8,145,178,0.1)",
  green:        "#16A34A",
  greenLight:   mode === "dark" ? "rgba(22,163,74,0.2)" : "rgba(22,163,74,0.1)",
  selfBubble:   "linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)",
  otherBubble:  mode === "dark" ? "#1C2333" : "#FFFFFF",
  otherText:    mode === "dark" ? "#E6EDF3" : "#1A1A2E",
  shadow:       mode === "dark" ? "0 8px 32px rgba(0,0,0,0.4)" : "0 8px 24px rgba(0,0,0,0.08)",
});

// ─── Note Bubble Actions Menu ──────────────────────────────────────────────────
const NoteActions = ({ note, onEdit, onDelete, mode }) => {
  const [anchor, setAnchor] = useState(null);
  const t = getTokens(mode);
  return (
    <>
      <IconButton size="small" onClick={(e) => setAnchor(e.currentTarget)}
        sx={{ color: "rgba(255,255,255,0.75)", padding: "2px", "&:hover": { color: "#fff", background: "rgba(255,255,255,0.15)" } }}>
        <MoreVertIcon sx={{ fontSize: 16 }} />
      </IconButton>
      <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}
        PaperProps={{ sx: { borderRadius: "14px", boxShadow: "0 8px 32px rgba(0,0,0,0.2)", border: `1px solid ${t.border}`, minWidth: 150, bgcolor: t.surface } }}>
        <MenuItem onClick={() => { onEdit(note); setAnchor(null); }} sx={{ gap: 1.5, color: "#2563EB", fontWeight: 700, fontSize: "13px" }}>
          <EditOutlinedIcon fontSize="small" /> Edit Note
        </MenuItem>
        <MenuItem onClick={() => { onDelete(note); setAnchor(null); }} sx={{ gap: 1.5, color: "#DC2626", fontWeight: 700, fontSize: "13px" }}>
          <DeleteOutlineIcon fontSize="small" /> Delete
        </MenuItem>
      </Menu>
    </>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────────
const CommunicationPage = () => {
  const { user } = useSelector((state) => state.auth);
  const { mode } = useThemeMode();
  const t = getTokens(mode);

  const { activeAppointmentId, messages, loading, error, sending, sendError, openAppointment, sendMessage, updateMessage, deleteMessage, clearError } = useChat();

  const [appointmentInput, setAppointmentInput] = useState("");
  const [draft, setDraft] = useState("");
  const [editingNote, setEditingNote] = useState(null);
  const scrollRef = useRef(null);

  const role = user?.role;
  const allowed = ["doctor", "nurse"].includes(role);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
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
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleSaveEdit = () => {
    if (!editingNote || !editingNote.text.trim()) return;
    updateMessage(editingNote.id, editingNote.text.trim());
    setEditingNote(null);
  };

  if (!allowed) {
    return (
      <div style={{ padding: "60px", textAlign: "center", borderRadius: "20px", background: t.bg }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>🚫</div>
        <div style={{ fontSize: "20px", fontWeight: 800, color: t.text }}>Access Denied</div>
        <div style={{ color: t.textSec, marginTop: "8px", fontSize: "14px" }}>
          Communication notes are strictly for doctors and nurses.
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes slideUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes slideIn { from { opacity:0; transform:translateX(-8px); } to { opacity:1; transform:translateX(0); } }
        @keyframes spin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
        .msg-scroll::-webkit-scrollbar { width: 6px; }
        .msg-scroll::-webkit-scrollbar-track { background: transparent; }
        .msg-scroll::-webkit-scrollbar-thumb { background: ${t.isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}; border-radius: 4px; }
        .msg-scroll::-webkit-scrollbar-thumb:hover { background: ${t.isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)"}; }
      `}</style>

      <div style={{ animation: "slideUp 0.4s ease", display: "flex", flexDirection: "column", height: "calc(100vh - 120px)", minHeight: "520px" }}>

        {/* ── Hero Banner ──────────────────────────────────────── */}
        <HeroBanner
          title={role === "doctor" ? "Medical Notes — Doctor View" : "Medical Notes — Nurse View"}
          subtitle="Appointment-based clinical notes · Doctors & nurses only · Role-based visibility"
          icon="💬"
          gradient="linear-gradient(135deg, #7C3AED 0%, #6D28D9 50%, #4F46E5 100%)"
          pills={[
            { icon: "🔴", label: "Live Data" },
            { icon: "🏥", label: "Appointment-based" },
            { icon: "🔍", label: "Role-scoped View" },
          ]}
        />

        {/* ── Two-pane layout ─────────────────────────────────────── */}
        <div style={{ display: "flex", flex: 1, gap: "20px", minHeight: 0, flexWrap: "wrap" }}>

          {/* ── Left: Selector Panel ────────────────────────────── */}
          <div style={{
            flex: "0 0 280px",
            background: t.panelBg,
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: `1px solid ${t.border}`,
            borderRadius: "20px",
            padding: "24px",
            boxShadow: t.shadow,
            display: "flex", flexDirection: "column", gap: "16px",
            height: "max-content",
          }}>
            {/* Panel header */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", color: t.text }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "linear-gradient(135deg, #7C3AED 0%, #0891B2 100%)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
                <AssignmentIndIcon style={{ fontSize: "18px" }} />
              </div>
              <div style={{ fontWeight: 800, fontSize: "16px" }}>Load Appointment</div>
            </div>
            <p style={{ margin: 0, fontSize: "13px", color: t.textSec }}>Notes are tied to an appointment ID — enter it below to load the thread.</p>

            <form onSubmit={handleOpenAppointment} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <TextField label="Appointment ID" type="number" fullWidth required size="small" value={appointmentInput}
                onChange={(e) => setAppointmentInput(e.target.value)}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", bgcolor: t.isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.02)" } }} />
              <button type="submit" disabled={!appointmentInput}
                style={{
                  padding: "10px", borderRadius: "12px", border: "none", fontWeight: 700,
                  fontSize: "14px", cursor: appointmentInput ? "pointer" : "not-allowed",
                  background: appointmentInput ? "linear-gradient(135deg, #7C3AED 0%, #0891B2 100%)" : t.surfaceAlt,
                  color: appointmentInput ? "#fff" : t.textSec,
                  boxShadow: appointmentInput ? "0 4px 16px rgba(124,58,237,0.35)" : "none",
                  transition: "all 0.2s",
                }}>
                Access Appointment Notes
              </button>
            </form>

            {activeAppointmentId && (
              <div style={{ padding: "10px 14px", background: t.greenLight, borderRadius: "12px", color: t.green, fontSize: "13px", fontWeight: 700, display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: t.green }} />
                Connected: Apt #{activeAppointmentId}
              </div>
            )}
          </div>

          {/* ── Right: Thread Panel ─────────────────────────────── */}
          <div style={{
            flex: "1 1 360px",
            background: t.panelBg,
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: `1px solid ${t.border}`,
            borderRadius: "20px",
            boxShadow: t.shadow,
            display: "flex", flexDirection: "column",
            overflow: "hidden",
          }}>
            {/* Panel header bar */}
            <div style={{ padding: "14px 22px", borderBottom: `1px solid ${t.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", background: t.isDark ? "rgba(255,255,255,0.02)" : "rgba(124,58,237,0.04)" }}>
              <div style={{ fontWeight: 800, fontSize: "15px", color: t.text }}>
                {activeAppointmentId ? `Appointment Thread #${activeAppointmentId}` : "Select an Appointment"}
              </div>
              {activeAppointmentId && (
                <Tooltip title="Refresh thread">
                  <span>
                    <IconButton size="small" onClick={() => openAppointment(activeAppointmentId)}
                      sx={{ color: t.purple, "&:hover": { background: t.purpleLight } }}>
                      <RefreshIcon fontSize="small" sx={{ animation: loading ? "spin 1s linear infinite" : "none" }} />
                    </IconButton>
                  </span>
                </Tooltip>
              )}
            </div>

            {/* Alerts */}
            <div style={{ padding: "0 22px" }}>
              {error    && <Alert severity="error" sx={{ mt: 2, borderRadius: "10px" }}>{error}</Alert>}
              {sendError && <Alert severity="error" sx={{ mt: 2, borderRadius: "10px" }}>{sendError}</Alert>}
            </div>

            {/* ── Scrollable Messages ──────────────────────────── */}
            {!activeAppointmentId ? (
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px", color: t.textSec, padding: "40px" }}>
                <ForumIcon sx={{ fontSize: 60, opacity: 0.15 }} />
                <div style={{ fontSize: "17px", fontWeight: 800, color: t.text }}>No Thread Active</div>
                <div style={{ fontSize: "13px", textAlign: "center" }}>Enter an appointment ID on the left to load its clinical notes.</div>
              </div>
            ) : loading ? (
              <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
                <CircularProgress size={36} sx={{ color: t.purple }} />
              </div>
            ) : (
              <div ref={scrollRef} className="msg-scroll" style={{ flex: 1, overflowY: "auto", padding: "20px 22px", display: "flex", flexDirection: "column", gap: "14px" }}>
                {messages.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "30px 20px", color: t.textSec, fontSize: "14px", background: t.surfaceAlt, borderRadius: "14px", border: `1px dashed ${t.border}` }}>
                    No notes yet — be first to add a clinical note.
                  </div>
                ) : messages.map((note, index) => {
                  const isSelf = note.sender_id === user?.user_id;
                  return (
                    <div key={note.id} style={{ display: "flex", flexDirection: isSelf ? "row-reverse" : "row", alignItems: "flex-end", gap: "10px", animation: `slideIn 0.3s ease ${index * 0.03}s both` }}>
                      <Avatar sx={{ width: 32, height: 32, fontSize: "13px", fontWeight: 700, flexShrink: 0,
                        background: isSelf ? "linear-gradient(135deg, #7C3AED 0%, #0891B2 100%)" : "linear-gradient(135deg, #16A34A 0%, #0891B2 100%)",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>
                        {(note.sender_name || "?").charAt(0).toUpperCase()}
                      </Avatar>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: isSelf ? "flex-end" : "flex-start", maxWidth: "72%" }}>
                        <div style={{ fontSize: "11px", color: t.textSec, marginBottom: "4px", padding: "0 4px" }}>
                          <strong style={{ color: t.text }}>{isSelf ? "You" : note.sender_name}</strong>
                          {" · "}
                          <span style={{ textTransform: "capitalize" }}>{note.sender_role}</span>
                        </div>
                        <div style={{
                          background: isSelf ? t.selfBubble : t.otherBubble,
                          color: isSelf ? "#fff" : t.otherText,
                          padding: "11px 15px",
                          borderRadius: isSelf ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                          boxShadow: t.isDark ? "0 4px 12px rgba(0,0,0,0.3)" : "0 4px 12px rgba(0,0,0,0.06)",
                          border: isSelf ? "none" : `1px solid ${t.border}`,
                          fontSize: "14px", lineHeight: "1.55", wordBreak: "break-word",
                          position: "relative",
                        }}>
                          {note.message}
                          {isSelf && (
                            <div style={{ position: "absolute", top: "4px", right: "4px" }}>
                              <NoteActions note={note} mode={mode}
                                onEdit={() => setEditingNote({ id: note.id, text: note.message })}
                                onDelete={() => deleteMessage(note.id)} />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ── Composer ─────────────────────────────────────── */}
            {activeAppointmentId && (
              <div style={{ padding: "14px 22px", borderTop: `1px solid ${t.border}`, background: t.isDark ? "rgba(255,255,255,0.02)" : "rgba(124,58,237,0.03)" }}>
                <div style={{ display: "flex", gap: "10px", alignItems: "flex-end" }}>
                  <TextField placeholder="Write a clinical or coordination note…" fullWidth multiline maxRows={4} size="small"
                    value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={handleComposerKeyDown} disabled={sending}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "16px", bgcolor: t.isDark ? "rgba(255,255,255,0.04)" : "#fff" } }} />
                  <button onClick={handleSend} disabled={!draft.trim() || sending}
                    style={{
                      width: "46px", height: "46px", borderRadius: "14px", border: "none", flexShrink: 0,
                      background: draft.trim() && !sending ? "linear-gradient(135deg, #16A34A 0%, #0891B2 100%)" : t.surfaceAlt,
                      color: draft.trim() && !sending ? "#fff" : t.textSec,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: draft.trim() && !sending ? "pointer" : "not-allowed",
                      boxShadow: draft.trim() && !sending ? "0 4px 16px rgba(22,163,74,0.4)" : "none",
                      transition: "all 0.2s",
                    }}>
                    {sending ? <CircularProgress size={18} sx={{ color: "inherit" }} /> : <SendIcon style={{ fontSize: "20px" }} />}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Edit Dialog ──────────────────────────────────────────── */}
      <Dialog open={Boolean(editingNote)} onClose={() => setEditingNote(null)} fullWidth maxWidth="xs"
        PaperProps={{ sx: { borderRadius: "20px", boxShadow: "0 24px 64px rgba(0,0,0,0.25)", bgcolor: t.surface } }}>
        <DialogTitle sx={{ fontWeight: 800, fontSize: "16px", pb: 1, color: t.text }}>✏️ Edit Note</DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <TextField multiline rows={4} fullWidth value={editingNote?.text || ""}
            onChange={(e) => setEditingNote((prev) => ({ ...prev, text: e.target.value }))}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" }, mt: 1 }} />
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={() => setEditingNote(null)} sx={{ borderRadius: "10px", color: t.textSec }}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveEdit} disabled={!editingNote?.text.trim()}
            sx={{ borderRadius: "10px", background: "linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)", fontWeight: 700 }}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CommunicationPage;
