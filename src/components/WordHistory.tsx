import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import styled from "styled-components";
import { formatMeaning } from "../utils/helpers";

interface WordEntry {
  solution: string;
  solution_date: string;
  solution_number: number;
  meaning: string;
}

interface WordHistoryProps {
  pastWords: WordEntry[];
  loadPage: (page: number) => void;
  page: number;
  total: number | null;
  loadingWords: boolean;
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

export default function WordHistory({
  pastWords,
  loadPage,
  page,
  total,
  loadingWords,
}: WordHistoryProps) {
  const navigate = useNavigate();
  const perPage = 50;

  const totalPages = total ? Math.ceil(total / perPage) : 1;

  const handleNext = () => {
    if (!total || page >= totalPages) return;
    loadPage(page + 1);
  };

  const handlePrevious = () => {
    if (page <= 1) return;
    loadPage(page - 1);
  };

  if (loadingWords && pastWords.length === 0) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#e3e2e0",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        backgroundColor: "#e3e2e0",
        minHeight: "100vh",
        py: 4,
        px: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <TitleContainer onClick={() => navigate("/")}>
        <Logo src={"/logo.png"} alt="wordle logo" />
        <Typography
          variant="h4"
          sx={{ fontWeight: 700, mb: 3, textAlign: "center" }}
        >
          Word History
        </Typography>
      </TitleContainer>

      <TableContainer component={Paper} sx={{ maxWidth: 600, borderRadius: 3 }}>
        <Table
          sx={{
            "& .MuiTableCell-root": {
              py: 2,
              px: 2,
            },
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: "5%" }}>
                <b>#</b>
              </TableCell>
              <TableCell sx={{ width: "20%" }}>
                <b>Word</b>
              </TableCell>
              <TableCell sx={{ width: "15%" }}>
                <b>Date</b>
              </TableCell>
              <TableCell sx={{ width: "60%", wordBreak: "break-word" }}>
                <b>Meaning</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loadingWords && pastWords.length > 0 ? (
              <TableRow>
                <TableCell colSpan={4} sx={{ textAlign: "center", py: 4 }}>
                  <CircularProgress size={24} />
                </TableCell>
              </TableRow>
            ) : (
              pastWords.map((word) => (
                <TableRow key={word.solution_number}>
                  <TableCell sx={{ width: "3%" }}>
                    {word.solution_number}
                  </TableCell>
                  <TableCell sx={{ width: "15%" }}>
                    <b>{word.solution}</b>
                  </TableCell>
                  <TableCell sx={{ width: "15%" }}>
                    {moment(word.solution_date).format("MMM DD, YYYY")}
                  </TableCell>
                  <TableCell sx={{ width: "100%", wordBreak: "break-word" }}>
                    {formatMeaning(word.meaning)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 2, display: "flex", gap: 2, justifyContent: "center" }}>
        <Button
          onClick={handlePrevious}
          disabled={page <= 1}
          sx={{
            color: "#0C100F",
            borderColor: "#0C100F",
            borderRadius: "99px",
            border: "2px solid #0C100F",
            textTransform: "none",
            fontWeight: 600,
            px: 3,
          }}
        >
          Previous
        </Button>

        <Typography sx={{ alignSelf: "center" }}>
          Page {page}/{totalPages}
        </Typography>

        <Button
          onClick={handleNext}
          disabled={!total || page >= totalPages}
          sx={{
            color: "#0C100F",
            borderColor: "#0C100F",
            borderRadius: "99px",
            border: "2px solid #0C100F",
            textTransform: "none",
            fontWeight: 600,
            px: 3,
          }}
        >
          Next
        </Button>
      </Box>

      <Button
        onClick={() => navigate("/")}
        sx={{
          mt: 3,
          color: "#0C100F",
          borderColor: "#0C100F",
          borderRadius: "99px",
          border: "2px solid #0C100F",
          textTransform: "none",
          fontWeight: 600,
        }}
      >
        Go Back
      </Button>
    </Box>
  );
}
