import requests
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.common.by import By
import chromedriver_autoinstaller
import csv

""" This file is not actively used by the Shovel app; this file is kept for reference.
Main purpose is to web scrape reliablity and bias scores from the Ad Fontes Media website. 
Outputs results in a .csv file, which was later converted into SourceReliability.json under
client>>src>>scripts. """

def extract_rating(text):
    try:
        rating = float(text.split(": ", 1)[1])
        return rating
    except:
        return "Rating Incorrect Syntax"

def parse_page(url, browser, rows):
    browser.get(url)
    html = browser.page_source
    soup = BeautifulSoup(html,'html.parser')

    # Scrapes for all the news source links
    el_list = browser.find_elements(By.CLASS_NAME, 'elementor-post__title')
    link_list = []
    for el in el_list:
        try:
            temp = el.find_element(By.CSS_SELECTOR, 'a').get_attribute('href')
            link_list.append(temp)
        except:
            print("No Link")

    for link in link_list:
        try:
            browser.get(link)
            new_html = browser.page_source
            soup = BeautifulSoup(new_html,'html.parser')
            title = soup.title.string.replace(" Bias and Reliability | Ad Fontes Media", "")
            print(title)

            reliability = browser.find_element(By.XPATH, "//*//strong[text()[contains(.,'Reliability:')]]")
            r_score = extract_rating(reliability.text)
            print(reliability.text)

            bias = browser.find_element(By.XPATH, "//*//strong[text()[contains(.,'Bias:')]]")
            b_score = extract_rating(bias.text)
            print(bias.text)

            rows.append([title, r_score, b_score])

        except KeyboardInterrupt:
            print("quitting: KeyboardInterrupt")
            browser.close()
            exit(0)

        except:
            print("Nope!")

def populate_csv(fields, rows):
    filename = "source_reliability_bias.csv"
    with open(filename, 'w', newline='') as csvfile:
        csvwriter = csv.writer(csvfile) 
        csvwriter.writerow(fields) 
        csvwriter.writerows(rows)

def main():
    chromedriver_autoinstaller.install()
    browser = webdriver.Chrome()

    url = 'https://adfontesmedia.com/rankings-by-individual-news-source/'
    fields = ["Source", "Reliability", "Bias"]
    rows = []
    
    try:
        for i in range(1, 8):
            current_url = url + str(i) + '/'
            parse_page(current_url, browser, rows)
    except:
        print("Error")
        browser.quit()
    
    populate_csv(fields, rows)

if __name__ == "__main__":
    main()