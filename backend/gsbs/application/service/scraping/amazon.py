import datetime
import logging
import os
import re
from time import sleep

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException

from gsbs.models import AmazonPurchaseHistory


URL = 'https://www.amazon.co.jp/ref=nav_logo'
ORDER_DETAIL_URL = 'https://www.amazon.co.jp/gp/your-account/order-details?orderID='
D_ORDER_DETAIL_URL= 'https://www.amazon.co.jp/gp/digital/your-account/order-summary.html/ref=ppx_yo_dt_b_dor_o00?ie=UTF8&orderID='

logger = logging.getLogger()


class ScrapyAmazonService(object):

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

        self.order_numbers = []
        self.d_order_numbers = []

    def login(self):
        self.driver.get(URL)
        self.driver.find_element(by=By.ID, value='nav-link-accountList-nav-line-1').click()
        self.driver.find_element(by=By.CLASS_NAME, value='auth-autofocus').send_keys(os.environ['AMAZON_EMAIL'])
        self.driver.find_element(by=By.ID, value='continue').click()
        self.driver.find_element(by=By.CLASS_NAME, value='auth-autofocus').send_keys(os.environ['AMAZON_PASSWORD'])
        self.driver.find_element(by=By.ID, value='signInSubmit').click()
        logger.info('Login was successful')

    def set_order_number(self):
        self.driver.find_element(by=By.ID, value='nav-orders').click()
        # self.driver.find_element(
        #     by=By.XPATH, value='//span[contains(text(), "注文履歴") and contains(@class, "nav-line-2")]').click()
        logger.info('To move history was successful')

        logger.info('Get order number')
        order_filter_num = len(self.driver.find_elements(
            by=By.XPATH, value='//select[contains(@id, "orderFilter")]/option')) - 2

        self.p_by_period(order_filter_num)

    def p_by_period(self, order_filter_num):
        # Repeat for the target period
        for i in range(order_filter_num):

            # Click the select box for the target period
            self.driver.execute_script('window.scrollTo(0, 0);')

            select_box = self.driver.find_element(
                by=By.XPATH, value='//span[contains(@class, "a-button-text a-declarative")]')
            self.driver.execute_script('arguments[0].click();', select_box)
            self.driver.find_elements(by=By.CLASS_NAME, value='a-dropdown-item')[i+2].click()

            date = self.driver.find_element(by=By.CLASS_NAME, value='a-dropdown-prompt').text

            # Get max pages
            try:
                max_page = int(self.driver.find_elements(by=By.CLASS_NAME, value='a-normal')[-1].text)
            except IndexError:
                max_page = 1

            if self.p_by_page(max_page, date):
                break

    def p_by_page(self, max_page, date) -> bool:
        loop_stop = False
        # Repeat the process for each page
        for j in range(max_page):
            if loop_stop:
                break
            logger.info(f'Get {date} history page {j+1}')

            elements = self.driver.find_elements(by=By.XPATH, value='//span[contains(text(), "注文番号")]/../span[2]')
            for e in elements:
                if AmazonPurchaseHistory.objects.filter(order_number=e.text).count():
                    loop_stop = True
                    break
                if re.match(r'^D', e.text):
                    self.d_order_numbers.append(e.text)
                else:
                    self.order_numbers.append(e.text)
            if max_page > 1:
                self.driver.find_element(by=By.CLASS_NAME, value='a-last').click()
        return loop_stop

    def register_order(self):
        logger.info('Get order detail')

        for i, order_number in enumerate(self.order_numbers):
            if (i+1) % 10 == 0:
                logger.info(f'Get order count {i+1}')

            self.driver.get(ORDER_DETAIL_URL + order_number)
            sleep(1)

            date = self.driver.find_elements(by=By.CLASS_NAME, value='order-date-invoice-item')[0].text
            date = datetime.datetime.strptime(date, '注文日 %Y年%m月%d日')
            items = self.driver.find_elements(
                by=By.XPATH, value='//div[contains(@class, "a-fixed-left-grid-col a-col-right")]')

            for j, item in enumerate(items):
                item_name = item.find_element(by=By.CLASS_NAME, value='a-link-normal').text
                try:
                    store_name = item.find_element(
                        by=By.CSS_SELECTOR, value='.a-size-small.a-color-secondary').text.replace('販売: ', '')
                except NoSuchElementException:
                    store_name = ''
                price = int(item.find_element(
                    by=By.CSS_SELECTOR, value='.a-size-small.a-color-price').text.replace('￥', '').replace(',', ''))

                history = AmazonPurchaseHistory.objects.create(
                    order_number=order_number,
                    order_column_no=j+1,
                    order_date=date,
                    item_name=item_name,
                    store_name=store_name,
                    price=price
                )
                logger.info(f'Successfully created {history.item_name}')

    def register_d_order(self):
        logger.info('Get digital order detail')

        for i, order_number in enumerate(self.d_order_numbers):
            if (i + 1) % 10 == 0:
                logger.info(f'Get order count {i + 1}')

            self.driver.get(D_ORDER_DETAIL_URL + order_number)
            sleep(1)

            date = self.driver.find_element(by=By.XPATH, value='//b[contains(text(), "デジタル注文:")]').text
            date = datetime.datetime.strptime(date, 'デジタル注文: %Y/%m/%d')

            item_names = self.driver.find_elements(
                by=By.CSS_SELECTOR, value='td[valign="top"][style="padding:10px"] > b')
            store_names = self.driver.find_elements(
                by=By.CSS_SELECTOR, value='td[valign="top"][style="padding:10px"]'
            )
            prices = self.driver.find_elements(
                by=By.CSS_SELECTOR, value='td.a-text-right[valign="top"][style="padding:10px"]')
            for j in range(len(item_names)):
                history = AmazonPurchaseHistory.objects.create(
                    order_number=order_number,
                    order_column_no=j + 1,
                    order_date=date,
                    item_name=item_names[j].text,
                    store_name=re.sub(r'.*\n', '', store_names[j].text.replace('販売: ', '')),
                    price=int(prices[j].text.replace('￥ ', '').replace(',', ''))
                )
                logger.info(f'Successfully created {history.item_name}')

    @classmethod
    def create_purchasing_data(cls):
        logger.info('##### Start amazon #####')
        service = ScrapyAmazonService()
        service.login()
        service.set_order_number()
        service.register_order()
        service.register_d_order()
        service.driver.quit()
        logger.info('##### Finish amazon #####')
