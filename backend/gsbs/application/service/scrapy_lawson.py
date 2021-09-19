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


class ScrapyLawsonService(object):

    def __init__(self):
        pass
