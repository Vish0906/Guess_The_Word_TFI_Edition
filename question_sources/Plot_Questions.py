import wikipediaapi
from groq import Groq
import os
from getpass import getpass
import re
import pandas as pd

import wikipedia

def get_wikipedia_link(movie_name):
    try:
        page = wikipedia.page(movie_name + " (film)", auto_suggest=True)
        return page.url
    except wikipedia.exceptions.DisambiguationError as e:
        return f"Multiple results found: {e.options}"
    except wikipedia.exceptions.PageError:
        return "No Wikipedia page found."


url = get_wikipedia_link('Kick 2 (2015)')
url
result = url[url.index("wiki/") + len("wiki/"):]
print(result)


import re

def clean_movie_name(result):
    # Remove underscores and anything inside parentheses
    movie_name = re.sub(r'_\(.*?\)', '', result)  # Remove (....)
    movie_name = movie_name.replace('_', ' ')  # Replace underscores with spaces
    return movie_name



#########       GETTING WIKI PLOT       ##########


import wikipediaapi

def get_wikipedia_plot(page_title, language='en'):
    """Fetches and prints the 'Plot' section of a Wikipedia page."""
    wiki_wiki = wikipediaapi.Wikipedia(
        user_agent='MyProjectName (youremail@example.com)',
        language=language
    )

    page = wiki_wiki.page(page_title)

    if not page.exists():
        print(f"Page '{page_title}' does not exist!")
        return None

    plot_text = page.section_by_title("Plot")  # Extract 'Plot' section

    if plot_text:
        print(f"\nPlot Section of {page.title}:\n")
        print(plot_text)
        return plot_text
    else:
        print(f"\nNo 'Plot' section found for {page.title}.")
        return None

# Example Usage:
mov_name = clean_movie_name(result)
linko = result
plot_data = get_wikipedia_plot(linko)  # Replace with any movie title





########        PLOT TEXT TO LLM.     ########
from getpass import getpass


GROQ_API_KEY = 'Your API Key here'
os.environ['GROQ_API_KEY'] = GROQ_API_KEY

def generate_questions(text, movie_name, num_questions=7):
    """
    Generate questions using Groq API based on the provided text.
    """
    client = Groq(api_key=os.environ['GROQ_API_KEY'])

    prompt = f"""Here is the plot of the Telugu movie {movie_name}:

{text}

Generate {num_questions} unique and interesting questions based on this plot. Follow these guidelines:
1. Questions should focus on less obvious details from the plot
2. Avoid basic questions about main character names or major plot points
3. Look for places, festivals, numbers, any names of the side characters, weapons(if applicable)
4. Questions should have answers that are either a single word or maximum two words
5. The questions should be simple to understand but should test knowledge of small details

Make sure to include the {movie_name} in either the question or the answer.


Format your response as exactly {num_questions} lines, each in the format:
question,answer

Make sure that the answers are mostly proper nouns, such as, names, places, specific names of things etc.

Example format:
In which city does the majority of the film Orange take place?,Sydney
What is the name of the friend who dies in Dhruva?,Gautam

Go Crazy with the questions. Read and analyze each and every word of the plot given and form crazy questions

Only provide the lines in the specified format, with no additional text or explanations."""

    try:
        response = client.chat.completions.create(
            messages=[{
                "role": "user",
                "content": prompt
            }],
            #model="deepseek-r1-distill-llama-70b",
            model="llama-3.3-70b-versatile",
            temperature=0.3,
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"Error generating questions: {str(e)}")
        return None

print(plot_data.text)
data_gen = generate_questions(plot_data.text, mov_name, num_questions=5)
print(data_gen)



########      STRING REGEX       ########

# Extract only the content after </think>
raw_text = data_gen.strip()
if "</think>" in raw_text:
    raw_text = raw_text.split("</think>")[-1].strip()  # Get text after </think>

# Extract valid "question,answer" lines using regex
question_lines = re.findall(r"^(.*?),(.*?)$", raw_text, re.MULTILINE)

# Format the extracted data
formatted_questions = [[mov_name, q.strip(), a.strip()] for q, a in question_lines]




########        PANDAS DATAFRAME.      ########

def append_rows(df, formatted_values):
    new_rows = pd.DataFrame(formatted_values, columns=["Movie", "Question", "Answer"])
    df = pd.concat([df, new_rows], ignore_index=True)
    return df

dfo = pd.DataFrame(formatted_questions,columns=["Movie", "Question", "Answer"])
