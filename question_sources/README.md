# 🎬 Wikipedia Plot Question Generator

This script fetches the plot of a Telugu movie from Wikipedia and uses the LLaMA-3 model with a Groq API Endpoint to generate unique trivia questions based on the plot.

## Features
- Fetches Wikipedia plot using movie title
- Cleans and formats movie names
- Sends plot to Groq LLM for question generation
- Extracts question-answer pairs using regex
- Stores output in a Pandas DataFrame

## Installation
```bash
pip install wikipedia wikipedia-api pandas groq
```

## Setup
1. Get your Groq API key from https://console.groq.com/
2. Replace `'Your API Key here'` in the script with your key

## Example Output
```
What is the name of the village in Kick 2?,Vilaspur
Which festival is shown in the film?,Bonalu
```

## Output
Final questions are saved in a DataFrame:
```python
| Movie    | Question                                              | Answer      |
|----------|-------------------------------------------------------|-------------|
| Khaleja  | What is the occupation of the protagonist in the film?| Taxi Driver |
```

## Note
- Works best for Telugu movies with a proper Plot section on Wikipedia
