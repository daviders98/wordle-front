import { useCallback, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Box,
  Typography,
  Button,
} from "@mui/material";
import moment from "moment";
import { useNavigate } from "react-router-dom";

interface WordEntry {
  solution: string;
  solution_date: string;
  solution_number: number;
}

export default function WordHistory() {
  const [words, setWords] = useState<WordEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [jwtValue, setJwtValue] = useState<string | null>(null);
  const navigate = useNavigate();

  const getJWT = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_RENDER_BASE_URL}/api/get-jwt/`,
      {
        method: "POST",
        credentials: "include",
      },
    );
    const jwt = await response.json();
    setJwtValue(jwt.token);
  };

  const getWords = useCallback(
    async (retry = true): Promise<void> => {
      const response = await fetch(
        `${process.env.REACT_APP_RENDER_BASE_URL}/api/list`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtValue}`,
          },
        },
      );

      if (response.status === 401 && retry) {
        await getJWT();
        return await getWords(false);
      }

      const data = await response.json();
      setWords(data);
      setLoading(false);
    },
    [jwtValue],
  );

  useEffect(() => {
    getJWT();
  }, []);

  useEffect(() => {
    if (jwtValue) {
      getWords();
    }
  }, [jwtValue, getWords]);

  if (loading)
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
      <Typography
        variant="h4"
        sx={{ fontWeight: 700, mb: 3, color: "#0C100F" }}
      >
        Word History
      </Typography>

      <TableContainer component={Paper} sx={{ maxWidth: 600, borderRadius: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <b>#</b>
              </TableCell>
              <TableCell>
                <b>Word</b>
              </TableCell>
              <TableCell>
                <b>Date</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {words.map((word) => (
              <TableRow key={word.solution_number}>
                <TableCell>{word.solution_number}</TableCell>
                <TableCell>{word.solution}</TableCell>
                <TableCell>
                  {moment(word.solution_date).format("MMM DD, YYYY")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

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
