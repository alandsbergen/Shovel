import flask
from flask import request, jsonify
from flask_cors import CORS
import json

from urllib.parse import unquote

# FLASK CONFIG
app = flask.Flask(__name__)
app.config["DEBUG"] = True
cors = CORS(app)

# NLP Imports
import spacy
import nltk
nltk.download('stopwords')
nltk.download('punkt')
from nltk.tokenize import sent_tokenize, word_tokenize
from rake_nltk import Rake
stopwords_list = nltk.corpus.stopwords.words('english')

from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import CountVectorizer
from nltk.stem.wordnet import WordNetLemmatizer
from nltk.tokenize import sent_tokenize, word_tokenize
from gensim.models import word2vec
import gensim
from nltk.corpus import stopwords,wordnet
from itertools import product
import numpy

""" This file is actively used by the Shovel app. It's purpose is to process highlighted
text using NLP algorithms to return a set of refined keywords, which are eventually used
as input in the app's call to NewsAPI."""

# HOME
@app.route('/', methods=['GET'])
def home():
    return "Python Backend"


# NLP Processing 
@app.route('/data', methods=['POST'])
def extractKeywords():
    '''
    Returns key phrases from tokenized input back to the user. Calls pretrained nlp model myRake. 
    This was the model that we found to be the most effecive in identifying key words. 
    '''
    data = unquote(request.json.get('data',""))

    myRake = Rake(min_length=1, max_length=5, include_repeated_phrases=False)
    myRake.extract_keywords_from_text(data)
    keyword_extracted = myRake.get_ranked_phrases()[:3]

    return json.dumps(keyword_extracted)


# ANALYZE Endpoint --> pass this back to the user endpoint 
@app.route('/analyze', methods=['POST'])
def analyze_context():
    article = unquote(request.json.get('article', ""))
    testData = unquote(request.json.get('test_data', ""))
    algo = request.json.get('algo', 'wordnet')

    if not (article and testData):
        return jsonify("Error: missing values")

    # Run the NLP algorithm to make sure our key words are accurate
    context = CheckSimilarity(article=article, testdata=testData, algo=algo).relatedContext
    response = {
                    "match":len(context)>0,
                    "found":len(context),
                    "yourSearch":testData,
                    "resp":context
    }
    return jsonify(response)


# SIMILARITY CHECK (NLP algorithm to check similarity)
class CheckSimilarity(object):
    '''
    Class to check the similarity between keywords and highlighted text. We use pre-trained models since
    we don't have enough train data. Therefore, we are just executing the models in this section. 
    '''
    def __init__(self, article, testdata, algo):
        self.article = article
        self.testdata = testdata
        self.lmtzr = WordNetLemmatizer()
        self.method = algo

        self.stopWords = stopwords.words('english')+ list('!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~')
        self.stopWords = [' '+i+' ' for i in self.stopWords] 

        if self.method =='w2v':
            self.wordmodelfile="../GoogleNews-vectors-negative300-SLIM.bin.gz"                                         
            self.wordmodel= gensim.models.KeyedVectors.load_word2vec_format(self.wordmodelfile, binary=True)

    @staticmethod
    def tokenize_sentences(text):
        '''
        Cut if there are multiple sentences in highlighted text
        '''
        sentences = []
        lines = text.split('\n')
        for i in lines:
            sentences.extend(i.split('.'))
        sentences = [i for i in sentences if i.strip()]
        return sentences


    def text_clean(self, text):
        '''
        Clean required text
        '''
        text = ' '+text.lower()+' '
        self.stopWords +=['"',"/","\/"]
        for sw in self.stopWords:
            text = text.replace(sw, " ")
        return text.strip()


    def w2v(self, s1,s2): 
        '''
        word to vector conversion
        '''
        if s1==s2:
                return 1.0

        s1words=s1.split()
        s2words=s2.split()
        s1wordsset=set(s1words)
        s2wordsset=set(s2words)
        vocab = self.wordmodel.vocab 
        if len(s1wordsset & s2wordsset)==0:
                return 0.0

        for word in s1wordsset.copy():
                if (word not in vocab):
                        s1words.remove(word)
        for word in s2wordsset.copy():
                if (word not in vocab):
                        s2words.remove(word)

        # Build a knowledge base for the relevant words 
        def get_or_train(s1words, s2words):
            try:
                rate = self.wordmodel.n_similarity(s1words, s2words)
                return rate
            except Exception as ex:
                print(ex)
                self.wordmodel.train 
                get_or_train(s1words, s2words)

    @property
    def relatedContext(self):
        '''
        Useful to determient if there is related context between the words highlighted and the article
        '''
        sentences = self.tokenize_sentences(self.article)
        test_sentences = self.tokenize_sentences(self.testdata)

        lemm_sentences = self.make_sentence_variation(sentences)
        lemm_test_sentences = self.make_sentence_variation(test_sentences)

        # Potential methods (written as modular code so user can input methodolgy)
        if self.method == 'dcs':
            vectorizer = CountVectorizer().fit_transform([' '.join(i) for i in lemm_test_sentences+lemm_sentences])
            vectors = vectorizer.toarray()
            test_vector = vectors[0]

        elif self.method == 'w2v':
            vectors = [' '.join(i) for i in lemm_sentences]
            test_vector = ' '.join(lemm_test_sentences[0])

        else:
            vectors = lemm_sentences
            test_vector = lemm_test_sentences[0]


        related_context = []

        # Conduct NLP for the highlighted words
        for index, vector in enumerate(vectors[1:]):
            if len(vector)>2:
                # Get the results ine the sim variable
                if self.method=='dcs':
                    sim = self.cossim_vectors(test_vector, vector)
                elif self.method == 'w2v':
                    sim = self.w2v(test_vector, vector)
                else:
                    sim = self.getWordnetSimilarity(test_vector, vector)
                if sim>0.9:
                    related_context.append({"sentence":sentences[index+1].strip(), "similarityIndex":sim})
            
            # Taking first 5 matches (to get all relavant matches uncomment this case), it would be slower.
            if len(related_context)>5:
                break

        return related_context


# APP RUNSERVER
if __name__ == "__main__":
    app.run(port=8000, debug=True)