# 🎬 Telugu Movie Mindle

A **Wordle-inspired web game** where players guess **Telugu movie titles** by answering AI-generated questions based on **movie plots and song lyrics**.  
Powered by **LLMs**, built using **React**, and deployed with the help of **vibe coding** on [Lovable.dev](https://lovable.dev).

---

## 🧠 What It Does

- Users are shown 5 questions related to a Telugu movie's plot or lyrics.
- For each correct answer, a letter of the movie title is revealed.
- Users guess the full title in Wordle style.
- All questions are generated using **LLMs (LLaMA 3.2, DeepSeek R1)** via **LangChain + LangGraph**.

---

## ⚙️ Tech Stack

### 💻 Frontend
- React + Vite  
- ShadCN UI  
- Static `.csv` loader for questions  

### 🧠 Backend & AI
- Python (Data scraping, preprocessing)
- LangChain + LangGraph for LLM orchestration
- Groq API (Free and fast LLM calls)
- LLaMA 3.2 and DeepSeek R1 for question generation

---

## 📦 How It Works

1. **Scrape Movie Data**  
   - Wikipedia (plot)  
   - Gaana, Lyricstape (lyrics)

2. **Prompt LLMs**  
   - Send scraped text to an LLM chain  
   - Prompt-tuned to return 5 unique Q&A pairs

3. **Frontend Integration**  
   - Format Q&A into a `.csv`  
   - Display in a React interface, reveal movie title on correct answers

---
