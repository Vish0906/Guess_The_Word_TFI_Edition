import pandas as pd
import numpy as np
import random


#### DATA CLEANING ####

df = pd.read_csv('Telugu Lyrics Database - Filt_2.csv')
df['lyrics_list'] = df['English Lyrics'].str.replace(r'\n', '; ', regex=True)
df['Lyricist'] = df['Lyricist'].str.replace('Singers', '', regex=False).str.strip()

dof = df[360:372]


#### FINAL CODE IMPLEMENTATION ####

questions_data = []

for index, row in dof.iterrows():
    lyr = row['lyrics_list']

    if not isinstance(lyr, str) or not lyr.strip():
        continue  # Skip if lyrics are empty or not a string

    sentences = lyr.split(",")
    sentences = [s.strip() for s in sentences if s.strip()]

    lyrics = f"""{";".join(sentences)}"""

    # Split lyrics into paragraphs based on ";;"
    paragraphs = [p.strip() for p in lyrics.split(";;") if p.strip()]

    if not paragraphs:
        continue  # Skip if there are no valid paragraphs

    for _ in range(3):  # Generate 3 question sets
        selected_paragraph = random.choice(paragraphs)

        lines = [line.strip() for line in selected_paragraph.split(";") if line.strip()]

        if not lines:
            continue  # Skip if there are no valid lines

        # Select two or three consecutive lines randomly
        if len(lines) > 2:
            start_index = random.randint(0, len(lines) - 3)
            selected_snippet = f"{lines[start_index]}; {lines[start_index + 1]}; {lines[start_index + 2]}"
        elif len(lines) > 1:
            start_index = random.randint(0, len(lines) - 2)
            selected_snippet = f"{lines[start_index]}; {lines[start_index + 1]}"
        else:
            selected_snippet = lines[0] + ";"

        words = selected_snippet.split()

        if not words:
            continue  # Skip if no words

        blank_index = random.randint(0, len(words) - 1)
        missing_word = words[blank_index]
        words[blank_index] = "___"

        lyric_snippet = " ".join(words)

        # Append questions
        questions_data.append([
            row['Movie'],
            f"Complete the lyric: '{lyric_snippet}'",
            missing_word,
            row['Movie'],  # Film
            row['Song']    # Song
        ])

        questions_data.append([
            row['Movie'],
            f"Who is the music director for the song with the lyrics snippet '{selected_snippet}'?",
            row['Music Director'],
            row['Movie'],
            row['Song']
        ])

        if pd.notna(row['Lyricist']) and str(row['Lyricist']).strip():
            questions_data.append([
                row['Movie'],
                f"Who penned the lyrics to the song with the lyrics snippet '{selected_snippet}'?",
                row['Lyricist'],
                row['Movie'],
                row['Song']
            ])

        questions_data.append([
            row['Movie'],
            f"Which movie has the song with the following lyrics snippet from: '{selected_snippet}'?",
            row['Movie'],
            row['Movie'],
            row['Song']
        ])

        if pd.notna(row['Singers']) and str(row['Singers']).strip() and ',' not in row['Singers']:
            questions_data.append([
                row['Movie'],
                f"Who sang the song with the lyrics snippet '{selected_snippet}'?",
                row['Singers'],
                row['Movie'],
                row['Song']
            ])

# Convert to DataFrame with additional columns
questions_df = pd.DataFrame(
    questions_data,
    columns=['Movie', 'Question', 'Answer', 'Film', 'Song']
)
print(questions_df)
print(questions_df['Question'].head())