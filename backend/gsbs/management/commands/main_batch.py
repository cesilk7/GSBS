import logging

from django.core.management.base import BaseCommand
from django.db import ProgrammingError

from gsbs.application.service.scrapy_nosh import ScrapyNoshService
from gsbs.application.service.scrapy_lawson import ScrapyLawsonService

log_format = '【%(asctime)s %(name)s %(levelname)s】%(message)s'
logging.basicConfig(level=logging.INFO, format=log_format)


class Command(BaseCommand):

    def add_arguments(self, parser):
        parser.add_argument('parameter', nargs='+', type=str)

    def handle(self, *args, **options):
        execute_batch = None

        for index, parameter in enumerate(options['parameter']):
            if index == 0:
                execute_batch = parameter

        logging.info(f'Start processing: {execute_batch}')

        try:
            # python manage.py main_batch create_nosh_data
            if execute_batch == 'create_nosh_data':
                ScrapyNoshService.create_nosh_data()
        except ProgrammingError as e:
            logging.exception(e)
        except Exception as e:
            logging.exception(e)

        logging.info(f'End processing: {execute_batch}')
