import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Chip,
  Box,
  CircularProgress,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

interface Commit {
  hash?: string;
  message: string;
  author: string;
  date: string;
  source?: "front" | "backend";
}

interface CombinedVersion {
  version: string;
  front?: Commit[];
  backend?: Commit[];
}

interface Version {
  version: string;
  commits: Commit[];
}

const Logo = styled.img`
  width: 64px;
  height: 64px;
  margin: 10px 0;

  @media (max-width: 400px) {
    width: 48px;
    height: 48px;
  }
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
`;

const FloatingGoHome = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: white;
  color: #0c100f;
  border: 1;
  border-radius: 99px;
  font-size: 0.9rem;
  cursor: pointer;
  padding: 8px;

  &:hover {
    opacity: 1;
    transform: scale(1.05);
  }

  @media (max-width: 400px) {
    font-size: 0.8rem;
    bottom: 16px;
    right: 16px;
  }
`;

export default function Changelog() {
  const [changelog, setChangelog] = useState<Version[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/changelog-combined.json")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch changelog");
        return res.json();
      })
      .then((data: CombinedVersion[]) => {
        const normalized = data.map((entry) => {
          const front = (entry.front ?? []).map((c) => ({ ...c, source: "front" as const }));
          const backend = (entry.backend ?? []).map((c) => ({ ...c, source: "backend" as const }));

          const commits = [...front, ...backend].sort((a, b) => {
            const da = new Date(a.date).getTime();
            const db = new Date(b.date).getTime();
            return db - da;
          });

          return { version: entry.version, commits };
        });

        setChangelog(normalized.reverse());
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "#e3e2e0",
        }}
      >
        <CircularProgress />
      </Box>
    );

  const getColors = (message: string) => {
    if (message.startsWith("feat")) return { bg: "#D9F7E3", border: "#34A853" };
    if (message.startsWith("fix")) return { bg: "#FFE8CC", border: "#FB8C00" };
    if (message.startsWith("chore")) return { bg: "#F0F0F0", border: "#9E9E9E" };
    return { bg: "#E3E2E0", border: "#0C100F" };
  };

  const formatMessage = (message: string) => {
    const parts = message.split(":");
    if (parts.length <= 1) return message;
    return parts.slice(1).join(":").trim();
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#e3e2e0",
        color: "#0C100F",
        px: 2,
        py: 4,
      }}
    >
      <Box sx={{ maxWidth: 700, mx: "auto" }}>
        <TitleContainer onClick={() => navigate("/")}>
          <Logo src={"/logo.png"} alt="wordle logo" />
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, textAlign: "center" }}>
            Better Wordle Changelog
          </Typography>
        </TitleContainer>

        {changelog.length === 0 && (
          <Typography sx={{ textAlign: "center", mt: 4 }}>No changelog entries found.</Typography>
        )}

        {changelog.map((entry) => {
          const firstMsg = entry.commits.length > 0 ? entry.commits[0].message : "";
          const { bg, border } = getColors(firstMsg);

          return (
            <Accordion
              key={entry.version}
              sx={{
                mb: 1.5,
                backgroundColor: bg,
                border: `2px solid ${border}`,
                boxShadow: "none",
                borderRadius: "12px",
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: "#0C100F" }}>
                  {entry.version}
                </Typography>
              </AccordionSummary>

              <AccordionDetails>
                {entry.commits.map((commit) => {
                  const key = `${commit.hash ?? commit.date}-${commit.message}`;
                  return (
                    <Box key={key} sx={{ mb: 2 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 500, color: "#0C100F" }}>
                        {formatMessage(commit.message)}
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          flexWrap: "wrap",
                          gap: 1,
                          mt: 0.5,
                        }}
                      >
                        <Chip
                          label={commit.author}
                          size="small"
                          variant="outlined"
                          sx={{ color: "#0C100F", borderColor: "#0C100F" }}
                        />

                        <Chip
                          label={new Date(commit.date).toLocaleString()}
                          size="small"
                          sx={{ color: "#0C100F", borderColor: "#0C100F" }}
                        />

                        {commit.source && (
                          <Chip
                            label={commit.source === "front" ? "frontend" : "backend"}
                            size="small"
                            sx={{
                              color: "#0C100F",
                              borderColor: "#0C100F",
                              fontWeight: 600,
                            }}
                          />
                        )}
                      </Box>
                    </Box>
                  );
                })}
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Box>

      <FloatingGoHome onClick={() => navigate("/")}>Go Home</FloatingGoHome>
    </Box>
  );
}
