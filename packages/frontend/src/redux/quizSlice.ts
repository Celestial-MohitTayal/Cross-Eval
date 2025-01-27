import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Quiz } from "../types/Quiz";

interface QuizState {
  quizzes: Quiz[];
}

const initialState: QuizState = {
  quizzes: [],
};

const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    setQuizzes(state, action: PayloadAction<Quiz[]>) {
      state.quizzes = action.payload;
    },
    addQuiz(state, action: PayloadAction<Quiz>) {
      state.quizzes.push(action.payload);
    },
  },
});

export const { setQuizzes, addQuiz } = quizSlice.actions;
export default quizSlice.reducer;
