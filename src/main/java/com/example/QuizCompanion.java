// Method to check answer with improved validation logic
public boolean checkAns(String answer) {
    // Validate if the answer is not null and not empty
    if (answer == null || answer.trim().isEmpty()) {
        return false; // Invalid answer
    }
    // Check against correct answer
    return answer.equalsIgnoreCase(getCorrectAnswer());
}

// Updated method to check the answer for specific cases
public boolean checkAnswer(String answer) {
    // Basic validations
    if (answer == null || answer.trim().isEmpty()) {
        return false; // Invalid answer, no response
    }
    // More complex validation logic can be added here
    String correctAnswer = getCorrectAnswer();
    // Compare the answers in a case-insensitive manner
    return answer.equalsIgnoreCase(correctAnswer);
}