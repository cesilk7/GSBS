import logging
import os
from pathlib import Path
import requests
from time import sleep
import re

from bs4 import BeautifulSoup
from PIL import Image
from io import BytesIO
import lxml
from django.db.utils import IntegrityError

from project.settings import MEDIA_ROOT
from gsbs.models import Meal
from gsbs.models import Company
from ..consts import URL_NOSH

logger = logging.getLogger(__name__)


class ScrapyNoshService(object):

    def __init__(self):
        pass

    @staticmethod
    def create_nosh_data():
        r = requests.get(URL_NOSH)
        soup = BeautifulSoup(r.content, 'lxml')
        a_tabs = soup.select('dl.foodArray dt a')

        company = Company.objects.filter(name='nosh')[0]
        price = re.search(r'\d+', soup.select(
            'footer.l-footer a p span span')[0].text).group()

        logger.info('Start create nosh data')
        for a in a_tabs:
            sleep(2)
            url = a.get('href')
            detail = BeautifulSoup(requests.get(url).content, 'lxml')
            td = detail.select('table tr td')

            url_image = detail.select('div.pic > p > img')[0].get('src')

            try:
                meal = Meal.objects.create(
                    company=company,
                    item_no=re.search(r'\d+', url).group(),
                    name=detail.select('div.detail > dl > dt')[0].text,
                    price=price,
                    calorie=re.search(r'\d+', td[0].text).group(),
                    protein=re.search(r'(\d+.\d+|\d+)', td[1].text).group(),
                    carbohydrate=re.search(
                        r'(\d+.\d+|\d+)',
                        detail.select('table tr td em')[0].text).group(),
                    sugar=re.search(r'(\d+.\d+|\d+)', td[2].text).group(),
                    lipid=re.search(r'(\d+.\d+|\d+)', td[3].text).group(),
                    dietary_fiber=re.search(r'(\d+.\d+|\d+)', td[4].text).group(),
                    salt=re.search(r'(\d+.\d+|\d+)', td[5].text).group(),
                    is_bad=False,
                    url=url,
                    img=create_image(url_image, company.name),
                )
                logger.info(f'Successfully created {meal.name}')
            except IntegrityError as e:
                logger.error(e)
                continue
        logger.info('End create nosh data')


def create_image(url, company_name, filename=None):
    r = requests.get(url)
    if r.status_code != 200:
        logger.warning('Failed to retrieve the image')
        return None

    path = os.path.join(MEDIA_ROOT, 'meal_images', company_name+'/')
    os.makedirs(path, exist_ok=True)
    if filename is None:
        path += url.split('/')[-1]
    else:
        path += filename

    with open(path, 'wb') as file:
        file.write(r.content)

    return path.replace(MEDIA_ROOT+'/', '')
