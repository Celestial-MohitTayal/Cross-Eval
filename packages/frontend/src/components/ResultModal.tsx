import React from "react";
import {
  Modal,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button
} from "@mui/material";

interface Attempt {
  student: string;
  answers: Record<string, string>;
  score: number;
  _id: string;
}

interface ResultModalProps {
  open: boolean;
  onClose: () => void;
  attempts: Attempt[] | Attempt;
}

const ResultModal: React.FC<ResultModalProps> = ({ open, onClose, attempts }) => {
  return (
    <Modal open={open} onClose={onClose} aria-labelledby="result-modal-title">
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: "80%", md: "60%", lg: "50%" }, 
          maxHeight: "80vh",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 3,
          borderRadius: 2,
          overflowY: "auto",
        }}
      >
        <Typography variant="h6" id="result-modal-title" gutterBottom>
          Quiz Results
        </Typography>

        <TableContainer component={Paper} sx={{ maxHeight: "50vh", overflowY: "auto" }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell><strong>Student ID</strong></TableCell>
                <TableCell><strong>Answers</strong></TableCell>
                <TableCell><strong>Score</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.isArray(attempts) ? (attempts.map((attempt) => (
                <TableRow key={attempt._id}>
                  <TableCell>{attempt.student}</TableCell>
                  <TableCell>
                    {Object.entries(attempt.answers).map(([question, answer]) => (
                      <div key={question}>
                        <strong>Q{+question + 1}:</strong> {answer}
                      </div>
                    ))}
                  </TableCell>
                  <TableCell>{attempt.score}</TableCell>
                </TableRow>
              ))) : (
                <TableRow>
                  <TableCell>{attempts.student}</TableCell>
                  <TableCell>
                    {Object.entries(attempts.answers).map(([question, answer]) => (
                      <div key={question}>
                        <strong>Q{+question + 1}:</strong> {answer}
                      </div>
                    ))}
                  </TableCell>
                  <TableCell>{attempts.score}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Box display="flex" justifyContent="center" mt={2}>
          <Button variant="contained" color="secondary" onClick={onClose}>
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ResultModal;
