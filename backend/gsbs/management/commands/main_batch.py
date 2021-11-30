import logging

from django.core.management.base import BaseCommand
from django.db import ProgrammingError

from gsbs.application.service.scraping.nosh import ScrapyNoshService
from gsbs.application.service.scraping.lawson import ScrapyLawsonService
from gsbs.application.service.scraping.amazon import ScrapyAmazonService
from gsbs.application.service.scraping.rakuten_card import ScrapyRakutenCardService


log_format = '【%(asctime)s %(name)s %(levelname)s】%(message)s'
# logging.basicConfig(level=logging.INFO, format=log_format)


class Command(BaseCommand):

    def add_arguments(self, parser):
        parser.add_argument('parameter', nargs='+', type=str)

    def handle(self, *args, **options):
        execute_batch = None

        for index, parameter in enumerate(options['parameter']):
            if index == 0:
                execute_batch = parameter

        logging.basicConfig(level=logging.INFO, format=log_format, filename=f'/code/log/{execute_batch}.log')
        logging.info(f'Start processing: {execute_batch}')

        try:
            # python manage.py main_batch create_nosh_data
            if execute_batch == 'nosh':
                ScrapyNoshService.create_nosh_data()
            elif execute_batch == 'amazon':
                ScrapyAmazonService.create_purchasing_data()
            elif execute_batch == 'rakuten_card':
                ScrapyRakutenCardService.create_payment_date()

        except ProgrammingError as e:
            logging.exception(e)
        except Exception as e:
            logging.exception(e)

        logging.info(f'End processing: {execute_batch}')
