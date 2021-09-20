import logging
import requests
from time import sleep
import re

from bs4 import BeautifulSoup
from PIL import Image
from io import BytesIO
import lxml

from gsbs.models import Meal
from gsbs.models import Company

URL_LAWSON = 'https://www.lawson.co.jp/recommend/allergy/detail/index.html'
URL_FATSECRET = 'https://www.fatsecret.jp/%E3%82%AB%E3%83%AD%E3%83%AA%E3%83%BC-%E6%A0%84%E9%A4%8A/search?q=%E3%83%AD%E3%83%BC%E3%82%BD%E3%83%B3'


class ScrapyLawsonService(object):

    def __init__(self):
        pass
