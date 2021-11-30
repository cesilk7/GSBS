import datetime
import logging
import os
from time import sleep

from selenium import webdriver
from selenium.webdriver.common.by import By
from django.db.utils import IntegrityError

from gsbs.models import RakutenCardPaymentHistory


URL = 'https://www.rakuten-card.co.jp/e-navi/'
HISTORY_URL = 'https://www.rakuten-card.co.jp/e-navi/members/statement/index.xhtml?tabNo='
MONTH_PERIOD = 16

logger = logging.getLogger()


class ScrapyRakutenCardService(object):

    def __init__(self):
        host_name = os.environ['HUB_HOST']
        options = webdriver.FirefoxOptions()
        options.add_argument('--headless')
        options.add_argument('--window-size=1280,1024')

        self.driver = webdriver.Remote(
            command_executor=f'http://{host_name}:4444/wd/hub',
            desired_capabilities=options.to_capabilities(),
            options=options,
        )

    def login(self):
        self.driver.get(URL)
        form = self.driver.find_elements(by=By.CLASS_NAME, value='js-has-placeholder')
        form[0].send_keys(os.environ['RAKUTEN_EMAIL'])
        form[1].send_keys(os.environ['RAKUTEN_PASSWORD'])
        self.driver.find_element(by=By.ID, value='loginButton').click()
        sleep(2)
        logger.info('Login was successful')

    def register_payment_history(self):
        for i in range(MONTH_PERIOD):
            sleep(1)
            self.driver.get(HISTORY_URL + str(i))

            num_record = len(self.driver.find_elements(by=By.CLASS_NAME, value='stmt-payment-lists__tbl'))
            num_cancel_record = len(self.driver.find_elements(
                by=By.CSS_SELECTOR, value='div.stmt-payment-lists.is-cancel > div.stmt-payment-lists__body > div'))
            if num_cancel_record > 0:
                num_record = num_record - num_cancel_record - 1
            for j in range(num_record):
                if j == 0:
                    continue
                tbl = self.driver.find_elements(by=By.CLASS_NAME, value='stmt-payment-lists__tbl')[j]
                if not self.register(tbl, num_record - j):
                    return

    def register(self, tbl, num):
        date = tbl.find_elements(by=By.CLASS_NAME, value='stmt-payment-lists__data')[0].text
        date = datetime.datetime.strptime(date, '%Y/%m/%d')
        store_name = tbl.find_elements(by=By.CLASS_NAME, value='stmt-payment-lists__data')[1].text
        user = tbl.find_elements(by=By.CLASS_NAME, value='stmt-payment-lists__data')[2].text.replace('*', '')
        payment_method = tbl.find_elements(by=By.CLASS_NAME, value='stmt-payment-lists__data')[3].text
        payment = tbl.find_elements(
            by=By.CLASS_NAME, value='stmt-payment-lists__data')[4].text.replace('¥ ', '').replace(',', '')

        try:
            RakutenCardPaymentHistory.objects.create(
                payment_date=date,
                payment_row=num,
                store_name=store_name,
                user=user,
                payment_method=payment_method,
                payment=payment
            )
            return True
        except IntegrityError:
            logger.info('this data already exists.')
            return False

    @classmethod
    def create_payment_date(cls):
        logger.info('##### Start rakuten card #####')
        service = ScrapyRakutenCardService()
        service.login()
        service.register_payment_history()
        service.driver.quit()
        logger.info('##### END rakuten card #####')


if __name__ == '__main__':
    ScrapyRakutenCardService.create_payment_date()
