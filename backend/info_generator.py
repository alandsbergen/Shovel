import spacy
import nltk
from nltk.tokenize import sent_tokenize, word_tokenize
from rake_nltk import Rake

from newsapi import NewsApiClient
import pandas as pd
from slugify import slugify

""" This file is not actively used by the Shovel app; it is a preliminary backend 
built in Python which currently prints data resulting from an API call on NLP-processed
text (if curious, run python info_generator.py). Mainly used to independently verify
results from tokenizing functions before integrating with Javascript / frontend. """

stopwords_list = nltk.corpus.stopwords.words('english')

def extraction(text):
    """ Returns key phrases from tokenized input """

    myRake = Rake(min_length=1, max_length=5, include_repeated_phrases=False)
    myRake.extract_keywords_from_text(text)
    keyword_extracted = myRake.get_ranked_phrases()[:3]
    return keyword_extracted


def starter(content):
    """ Tokenizes and extracts keywords from text content """

    stemmer = nltk.stem.porter.PorterStemmer()
    from nltk.stem import WordNetLemmatizer
    wordnet_lemmatizer = WordNetLemmatizer()
    tokenized = word_tokenize(content)
    #tokenizeStemmer = [ stemmer.stem(token) for token in tokenized if token not in stopwords_list]
    sentence = [wordnet_lemmatizer.lemmatize(word) for word in tokenized if word not in stopwords_list]
    sentence = ' '.join(sentence)

    processed = extraction(content)
    return processed


def slugified_db_sources(df):
    """ Returns list of slugify-formatted source names from slugified SRB csv """

    source_names = df['Source'].values
    return source_names

def get_rb_scores(source_name, df):
    """ Returns tuple of the reliability and bias scores for a source, or -1 if the source name
        is not found in the SRB database. """

    db_source_names = slugified_db_sources(df)
    check = source_name in db_source_names
    if check:
        r_score = df.loc[df['Source'].str.contains(source_name), 'Reliability'].values[0]
        b_score = df.loc[df['Source'].str.contains(source_name), 'Bias'].values[0]
        return (r_score, b_score)
    else:
        print("Cannot assign scores to ", source_name)
        return -1

def get_related_sources(phrase, df):
    """ Returns list of sources that correspond to phrase (derived from related articles sorted by popularity).
        N.B. The API call happens here, so this function can be adapted to do other things! """

    newsapi = NewsApiClient(api_key='10b67349b2f14011a5191c38ac54ede4')
    db_source_names = slugified_db_sources(df)

    # Option: limit search by sources in db_source_names
    # sources_param = ','.join(db_source_names)
    # for phrase in key_phrases:
    #     temp = newsapi.get_everything(q=key_phrases[0], sources=sources_param)
    #     print(temp)

    # THIS IS THE JSON OBJECT, IF YOU WANT TO MESS WITH IT
    api_search_results = newsapi.get_everything(q=phrase, sort_by='popularity', page_size=50)

    related_articles = api_search_results['articles']
    print("Phrase Searched: ", phrase)
    print("Number of related articles: ", len(related_articles))

    slugified_related_sources = []
    for article in related_articles:
        source_name = slugify(article['source']['name'])
        slugified_related_sources.append(source_name)
    
    return slugified_related_sources
    
def main():
    text = "The Ukrainian soccer federation urged FIFA on Monday to remove \
            Iran from the World Cup next month, alleging human rights violations \
            and supplying the Russian military with weapons."

    # Dataframe for source names (slugified) and their reliability, bias scores
    df = pd.read_csv('srb_slugified.csv')
    
    # Generate and print key phrases from input text
    key_phrases = starter(text)
    print("List of Key Phrases: ", key_phrases, "\n")

    # Get slugified source names
    slugified_source_names = slugified_db_sources(df)

    # Generate metadata for key phrases from input text
    for phrase in key_phrases:
        related_sources = get_related_sources(phrase, df)

        # Example call to get the reliability and bias scores for first source
        print("e.g. Scores for first source: ", get_rb_scores(related_sources[0], df), "\n")

if __name__ == "__main__":
    main()